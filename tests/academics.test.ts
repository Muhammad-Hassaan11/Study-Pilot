import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { applyMutation, initialData, occurrences, type StudyData } from '../src/lib/model';
import { attendanceMath, attendanceSummary, courseCalculation, gradeMinimum, mapGrade, semesterCalculation } from '../src/lib/academic-calculations';
import { materialize, upgradeAcademic, validateRule } from '../src/lib/academic-data';
import { Q } from '../src/lib/exact';
import { createStore } from '../src/lib/store';

const now = Date.parse('2026-10-05T12:00:00Z');
const bands = [ ['F','0','0'],['D','50','1'],['C','60','2'],['C+','65','2.5'],['B','70','3'],['B+','75','3.33'],['A−','80','3.67'],['A','85','4'] ].map(([label,lower,points])=>({label,lower,points}));
function mutate(data:StudyData,kind:string,payload:Record<string,unknown>) {return applyMutation(data,{kind,payload},now);}
function base() {
  let d=initialData('UTC');
  d=mutate(d,'course',{id:'course-a',name:'Calculus',code:'MAT',color:'#6763d9',credits:'3'});
  d=mutate(d,'period',{id:'fall',name:'Fall 2026',start:'2026-09-01',end:'2026-12-31'});
  return mutate(d,'course-academic',{id:'course-a',periodId:'fall',credits:'3',requirement:'75',attendancePolicy:false,gradingPolicy:false});
}
function weighted() {
  let d=base();
  for (const [id,title,max,weight,score,increment] of [['quiz','Quiz','20','20','18','1'],['midterm','Midterm','50','20','45','1'],['final','Final','100','60','','1']]) d=mutate(d,'assessment',{id,courseId:'course-a',title,type:'exam',max,weight,score,increment,due:''});
  return mutate(d,'course-target',{id:'course-a',targetKind:'raw',value:'80'});
}
function rulePayload(id='rules') {return {id,name:'Reviewed example',scale:'4',maxPoints:'4',rounding:'none',bands,courseIds:['course-a'],reviewed:true};}

test('all supplied attendance fixtures and exact risk boundaries',()=>{
  for(const [a,m,q,state,allow,recovery] of [
    [18,2,'75','On track',4,null],[14,4,'75','Close to limit',0,null],[12,6,'75','Below requirement',null,6],
    [3,1,'75','Close to limit',0,null],[4,1,'75','Close to limit',0,null],[0,3,'75','Below requirement',null,9],
    [0,0,'100','No attendance recorded',null,null],[5,0,'100','Close to limit',0,null],[4,1,'100','Below requirement',null,null],
  ] as const){const r=attendanceMath(a,m,q);assert.equal(r.state,state);assert.equal(r.allowance,allow);assert.equal(r.recovery,recovery);}
  assert.equal(attendanceMath(18,2,'75').percent,90);
  assert.equal(attendanceMath(19,2,'75').allowance,4);
  assert.equal(attendanceMath(18,3,'75').allowance,3);
  assert.equal(attendanceMath(1,2,'0').state,'No minimum');
  assert.equal(attendanceMath(1,2,'').state,'Requirement not set');
  assert.equal(attendanceMath(74999,25001,'75').state,'Below requirement');
  assert.match(attendanceMath(4,1,'100').advice,/No finite recovery/);
});
test('allowance and recovery satisfy independent defining inequalities at decimal requirements',()=>{
  for(let a=0;a<35;a++)for(let m=0;m<15;m++)for(const q of ['0.01','33.33','66.67','75','99.99','100']) {
    if(!a&&!m)continue;
    const r=attendanceMath(a,m,q), hundredths=Math.round(Number(q)*100);
    if(r.allowance!==null){assert.ok(a*10000 >= hundredths*(a+m+r.allowance));assert.ok(a*10000 < hundredths*(a+m+r.allowance+1));}
    if(r.recovery!==null){assert.ok((a+r.recovery)*10000>=hundredths*(a+m+r.recovery));assert.ok((a+r.recovery-1)*10000<hundredths*(a+m+r.recovery-1));}
  }
});
test('dated attendance has stable identity, correction, clear, cancellation and future denial',()=>{
  let d=base();
  for(const [id,start,end] of [['first','09:00','10:00'],['second','10:00','11:00'],['future','13:00','14:00']]) d=mutate(d,'dated-class',{id,courseId:'course-a',date:'2026-10-05',start,end,timezone:'UTC',room:'B-204'});
  d=mutate(d,'attendance',{id:'first',status:'missed'}); d=mutate(d,'attendance',{id:'first',status:'attended'});d=mutate(d,'attendance',{id:'first',status:'attended'});
  let s=attendanceSummary(d,d.courses[0],now); assert.equal(s.attended,1);assert.equal(s.total,1);assert.equal(s.unmarked,1);
  assert.equal(d.classOccurrences[0].changes.length,2);
  assert.throws(()=>mutate(d,'attendance',{id:'future',status:'attended'}),/started/);
  assert.throws(()=>mutate(d,'class-cancel',{id:'first',cancelled:true}),/Confirm/);
  d=mutate(d,'class-cancel',{id:'first',cancelled:true,confirm:true});
  assert.equal(attendanceSummary(d,d.courses[0],now).total,0);
  assert.throws(()=>mutate(d,'attendance',{id:'first',status:'attended'}),/non-cancelled/);
  d=mutate(d,'class-cancel',{id:'first',cancelled:false,confirm:true});d=mutate(d,'attendance',{id:'first',status:'attended'});d=mutate(d,'attendance',{id:'first',status:''});
  s=attendanceSummary(d,d.courses[0],now);assert.equal(s.total,0);assert.equal(s.unmarked,2);
});
test('recurrence revision preserves past records and replaces future times',()=>{
  let d=base();
  d=mutate(d,'slot',{id:'weekly',courseId:'course-a',weekday:1,start:'09:00',end:'10:00',room:'Old room',timezone:'UTC',fromDate:'2026-09-28',untilDate:''});
  d=mutate(d,'attendance',{id:'weekly@2026-09-28',status:'attended'});
  d=mutate(d,'schedule-revise',{id:'weekly',newId:'revised',effective:'2026-10-06',weekday:1,start:'11:00',end:'12:00',room:'New room'});
  assert.equal(d.classOccurrences.find(o=>o.id==='weekly@2026-09-28')?.attendance,'attended');
  assert.equal(d.classOccurrences.find(o=>o.id==='weekly@2026-10-05')?.start,'2026-10-05T09:00:00Z');
  assert.equal(d.classOccurrences.some(o=>o.id==='weekly@2026-10-12'),false);
  assert.equal(d.classOccurrences.find(o=>o.id==='revised@2026-10-12')?.room,'New room');
  assert.throws(()=>mutate(d,'schedule-revise',{id:'revised',newId:'bad',effective:'2026-10-05',weekday:1,start:'12:00',end:'13:00',room:''}),/future/);
});
test('period boundaries limit recurrence without manufacturing remaining-semester facts',()=>{
  let d=base();d=mutate(d,'period',{id:'fall',name:'Fall',start:'2026-10-01',end:'2026-10-07'});
  d=mutate(d,'slot',{id:'weekly',courseId:'course-a',weekday:1,start:'09:00',end:'10:00',room:'',timezone:'UTC',fromDate:'2026-09-01',untilDate:''});
  assert.deepEqual(d.classOccurrences.map(o=>o.date),['2026-10-05']);
  assert.equal(occurrences(d,now).items.length,1);
});
test('default applies only to new courses and migration does not invent old records',()=>{
  let d=base();d=mutate(d,'attendance-default',{value:'80'});
  d=mutate(d,'course',{id:'new',name:'New course',code:'',color:'#6763d9',credits:''});
  assert.equal(d.courses[0].attendanceRequirement,'75');assert.equal(d.courses[1].attendanceRequirement,'80');
  assert.throws(()=>mutate(d,'attendance-default',{value:'75.001'}),/two|2 places/);
  assert.throws(()=>mutate(d,'attendance-default',{value:'NaN'}),/decimal/);
  const legacy=JSON.parse(JSON.stringify(initialData())); delete legacy.schema;delete legacy.classOccurrences;
  legacy.slots=[{id:'old',courseId:'old-course',weekday:1,start:'10:00',end:'11:00',room:'',timezone:'UTC'}];
  legacy.courses=[{id:'old-course',name:'Old',code:'',color:'#6763d9',credits:'',archived:false}];
  const migrated=upgradeAcademic(legacy,now);assert.equal(migrated.slots[0].fromDate,'2026-10-05');assert.equal(migrated.courses[0].attendanceRequirement,'');
  assert.equal(materialize(migrated,now).classOccurrences.some(o=>o.date<'2026-10-05'),false);
});
test('weighted fixture yields exact earned, lost, target, conservative and discrete minimums',()=>{
  const d=weighted(),r=courseCalculation(d,d.courses[0]);
  assert.equal(r.earned.number(),36);assert.equal(r.remaining.number(),60);assert.equal(r.lost.number(),4);assert.equal(r.maximum.number(),96);assert.equal(r.gradedAverage?.number(),90);
  assert.equal(r.required?.fixed(2,true),'73.34');assert.equal(r.minimumMark?.number(),74);assert.equal(r.resultingScore?.number(),80.4);
  assert.deepEqual(r.chart.map(s=>s.value),[36,44,16,4]);assert.equal(r.chart.reduce((s,x)=>s+x.value,0),100);
  const impossible=mutate(d,'course-target',{id:'course-a',targetKind:'raw',value:'97'}), i=courseCalculation(impossible,impossible.courses[0]);
  assert.equal(i.state,'Target unreachable');assert.match(i.advice,/1.00 weighted points/);assert.ok(i.chart.every(s=>s.value>=0));
  const safe=mutate(d,'course-target',{id:'course-a',targetKind:'raw',value:'30'});assert.match(courseCalculation(safe,safe.courses[0]).state,/secured/);
});
test('blank is ungraded, zero is scored, invalid weights suppress predictions',()=>{
  let d=weighted();d=mutate(d,'assessment',{...d.assessments[2],score:'0'});
  let r=courseCalculation(d,d.courses[0]);assert.equal(r.final,true);assert.equal(r.remaining.number(),0);assert.equal(r.earned.number(),36);assert.equal(r.targetMet,false);
  d=mutate(d,'assessment',{...d.assessments[2],score:'',weight:'59.99'});r=courseCalculation(d,d.courses[0]);assert.equal(r.valid,false);assert.equal(r.required,null);assert.equal(r.chart.length,0);assert.match(r.advice,/0.01% missing/);
  d=mutate(d,'assessment',{...d.assessments[2],weight:'60.01'});assert.match(courseCalculation(d,d.courses[0]).advice,/0.01% excess/);
  assert.throws(()=>mutate(d,'assessment',{...d.assessments[0],score:'21'}),/Score/);
  assert.throws(()=>mutate(d,'assessment',{...d.assessments[0],max:'0'}),/Maximum/);
  assert.throws(()=>mutate(d,'assessment',{...d.assessments[0],score:'18.5',increment:'1'}),/multiples/);
});
test('multiple pending assessments receive only an aggregate requirement; no scored work is not a failed grade',()=>{
  let d=weighted();d=mutate(d,'assessment',{...d.assessments[1],score:''});
  const r=courseCalculation(d,d.courses[0]);assert.equal(r.minimumMark,null);assert.match(r.advice,/aggregate/);
  d=mutate(d,'assessment',{...d.assessments[0],score:''});const empty=courseCalculation(d,d.courses[0]);assert.equal(empty.earned.number(),0);assert.equal(empty.remaining.number(),100);assert.equal(empty.final,false);assert.equal(empty.grade,null);
});
test('grade boundaries, half-up forward mapping and inverse keep raw intent separate',()=>{
  const rule=validateRule(rulePayload(),now), half={...rule,rounding:'half-up' as const};
  assert.equal(mapGrade(Q.of('84.5'),rule)?.label,'A−');assert.equal(mapGrade(Q.of(100),rule)?.label,'A');assert.equal(mapGrade(Q.of('79.95'),rule)?.label,'B+');assert.equal(mapGrade(Q.of('79.95'),half)?.label,'A−');
  assert.equal(gradeMinimum(half,'A−')?.number(),79.5);assert.equal(mapGrade(Q.of('79.4999'),half)?.label,'B+');
  let d=weighted();d=mutate(d,'rule',{...rulePayload(),rounding:'half-up'});d=mutate(d,'course-target',{id:'course-a',targetKind:'grade',value:'A−'});assert.equal(courseCalculation(d,d.courses[0]).target?.number(),79.5);
  d=mutate(d,'course-target',{id:'course-a',targetKind:'raw',value:'80'});assert.equal(courseCalculation(d,d.courses[0]).target?.number(),80);
});
test('invalid rules never replace saved rules; bands cover decimals exactly once',()=>{
  const p=rulePayload();
  assert.throws(()=>validateRule({...p,bands:[{label:'F',lower:'1',points:'0'}]},now),/start at 0/);
  assert.throws(()=>validateRule({...p,bands:[bands[0],{label:'A',lower:'0',points:'4'}]},now),/duplicate/);
  assert.throws(()=>validateRule({...p,bands:[bands[0],{label:'f',lower:'50',points:'4'}]},now),/unique/);
  assert.throws(()=>validateRule({...p,bands:[{label:'F',lower:'0',points:'4'},{label:'A',lower:'85',points:'3'}]},now),/decrease/);
  assert.throws(()=>validateRule({...p,bands:[{label:'F',lower:'0',points:'5'}]},now),/0–4/);
  for(let n=0;n<=10000;n++){const g=mapGrade(Q.of((n/100).toFixed(2)),validateRule(p,now));assert.ok(g);}
});
test('completed courses keep old versions and explicit remapping preserves raw scores',()=>{
  let d=weighted();d=mutate(d,'rule',rulePayload());d=mutate(d,'assessment',{...d.assessments[2],score:'80'});
  const raw=courseCalculation(d,d.courses[0]).earned.fixed(6), original=JSON.stringify(d.assessments);
  const next={...rulePayload('new-rules'),previousId:'rules',bands:bands.map(b=>({...b,lower:b.label==='A'?'83':b.lower})),courseIds:[]};
  d=mutate(d,'rule',next);assert.equal(d.courses[0].gradeRuleId,'rules');assert.equal(courseCalculation(d,d.courses[0]).grade?.label,'A−');
  assert.throws(()=>mutate(d,'assign-rule',{id:'course-a',ruleId:'new-rules'}),/Confirm historical/);
  d=mutate(d,'assign-rule',{id:'course-a',ruleId:'new-rules',confirm:true});assert.equal(courseCalculation(d,d.courses[0]).grade?.label,'A');assert.equal(courseCalculation(d,d.courses[0]).earned.fixed(6),raw);assert.equal(JSON.stringify(d.assessments),original);assert.equal(d.courses[0].ruleHistory.length,2);
});
test('credit-weighted fixture is 31.34/9 and missing credits are visibly excluded',()=>{
  let d=base();d=mutate(d,'rule',rulePayload());
  for(const [id,credits,score] of [['course-a','3','90'],['course-b','4','72'],['course-c','2','82']]) {
    if(id!=='course-a'){d=mutate(d,'course',{id,name:id,code:'',color:'#6763d9',credits});d=mutate(d,'course-academic',{id,periodId:'fall',credits,requirement:'',attendancePolicy:false,gradingPolicy:false});d=mutate(d,'assign-rule',{id,ruleId:'rules'});}
    d=mutate(d,'assessment',{id:`a-${id}`,courseId:id,title:'Final',type:'exam',max:'100',weight:'100',score,increment:'1',due:''});
  }
  let r=semesterCalculation(d,'fall');assert.equal(r.quality.fixed(2),'31.34');assert.equal(r.credits.number(),9);assert.equal(r.gpa?.fixed(2),'3.48');assert.equal(r.complete,true);
  d=mutate(d,'course-academic',{id:'course-c',periodId:'fall',credits:'',requirement:'',attendancePolicy:false,gradingPolicy:false});r=semesterCalculation(d,'fall');assert.equal(r.complete,false);assert.equal(r.included.length,2);assert.equal(r.excluded[0].reason,'Credits missing');assert.equal(r.credits.number(),7);
});
test('rounded GPA cannot falsely achieve goal; incompatible scales withhold aggregation',()=>{
  let d=base();d=mutate(d,'rule',{...rulePayload(),bands:[{label:'Pass',lower:'0',points:'3.496'}]});
  d=mutate(d,'assessment',{id:'all',courseId:'course-a',title:'Final',type:'exam',max:'100',weight:'100',score:'80',increment:'1',due:''});
  d=mutate(d,'semester-goal',{id:'fall',value:'3.50',ruleId:'rules'});
  let r=semesterCalculation(d,'fall');assert.equal(r.gpa?.fixed(2),'3.50');assert.equal(r.targetMet,false);
  d=mutate(d,'rule',{...rulePayload('ten'),scale:'10',courseIds:[]});d=mutate(d,'assign-rule',{id:'course-a',ruleId:'ten',confirm:true});r=semesterCalculation(d,'fall');assert.equal(r.incompatible,true);assert.equal(r.gpa,null);
});
test('unsupported policies withhold unconditional advice, grades and GPA',()=>{
  let d=weighted();d=mutate(d,'rule',rulePayload());d=mutate(d,'assessment',{...d.assessments[2],score:'100'});
  d=mutate(d,'course-academic',{id:'course-a',periodId:'fall',credits:'3',requirement:'75',attendancePolicy:true,gradingPolicy:true});
  assert.equal(courseCalculation(d,d.courses[0]).grade,null);assert.equal(courseCalculation(d,d.courses[0]).state,'Unsupported grading policy');assert.equal(semesterCalculation(d,'fall').gpa,null);assert.equal(attendanceSummary(d,d.courses[0],now).allowance,null);
});
test('academic records survive store reopen, reject cross-account and stale corrections, and retry once',()=>{
  const path=join(mkdtempSync(join(tmpdir(),'studypilot-academics-')),'test.sqlite');let store=createStore(path);
  const a=store.create('UTC'),b=store.create('UTC');let revision=0;
  const write=(kind:string,payload:Record<string,unknown>,requestId=`request-${revision}`)=>{const result=store.mutate(a.token,requestId,revision,{kind,payload});revision=result.revision;return result;};
  write('course',{id:'private',name:'Private course',code:'',color:'#6763d9',credits:'3'});
  write('dated-class',{id:'old-class',courseId:'private',date:'2020-01-01',start:'09:00',end:'10:00',room:'',timezone:'UTC'});
  const prior=revision;write('attendance',{id:'old-class',status:'attended'},'retry-attendance');
  assert.equal(store.mutate(a.token,'retry-attendance',prior,{kind:'attendance',payload:{id:'old-class',status:'attended'}}).revision,revision);
  assert.throws(()=>store.mutate(a.token,'stale-attendance',prior,{kind:'attendance',payload:{id:'old-class',status:'missed'}}),/another tab/);
  assert.throws(()=>store.mutate(b.token,'foreign-attendance',0,{kind:'attendance',payload:{id:'old-class',status:'attended'}}),/unavailable/);
  assert.throws(()=>store.mutate(b.token,'foreign-score',0,{kind:'assessment',payload:{id:'score',courseId:'private'}}),/unavailable/);
  store.close();store=createStore(path);assert.equal(store.read(a.token).classOccurrences[0].attendance,'attended');assert.equal(store.read(b.token).classOccurrences.length,0);store.delete(a.token);assert.throws(()=>store.read(a.token),/session/);store.close();
});
