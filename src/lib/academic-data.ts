import { Temporal } from '@js-temporal/polyfill';
import type { StudyData, Course, Slot } from './model';
import type { Assessment, ClassOccurrence, GradeRule } from './academic-types';
import { decimal, Q } from './exact';
import { courseCalculation } from './academic-calculations';

const text = (v: unknown, label: string, optional = false, max = 160) => {
  if (typeof v !== 'string' || v.length > max || (!optional && !v.trim())) throw new Error(`${label}: enter valid text.`);
  return v.trim();
};
const identifier = (v: unknown) => { const id = text(v,'Identifier',false,100); if (!/^[\w@-]+$/.test(id)) throw new Error('Invalid identifier.'); return id; };
export function dateInput(v: unknown, label: string, optional = false) {
  if (optional && (v === '' || v === undefined)) return '';
  const value = text(v,label);
  try { if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Temporal.PlainDate.from(value).toString() !== value) throw new Error(); }
  catch { throw new Error(`${label}: use a valid date.`); }
  if (value < '1900-01-01' || value > '2200-12-31') throw new Error(`${label}: use a date from 1900–2200.`);
  return value;
}
function instant(local: string, zone: string) {
  try { return Temporal.PlainDateTime.from(local).toZonedDateTime(zone,{disambiguation:'reject'}).toInstant().toString(); }
  catch { throw new Error('Class time is invalid or ambiguous during a clock change. Choose an unambiguous local time.'); }
}
const dateAt = (now: number, zone: string) => Temporal.Instant.fromEpochMilliseconds(now).toZonedDateTimeISO(zone).toPlainDate().toString();
export function upgradeAcademic(data: StudyData, now = Date.now()): StudyData {
  const result = structuredClone(data);
  result.schema = 2; result.periods ??= []; result.classOccurrences ??= []; result.gradeRules ??= []; result.assessments ??= []; result.defaultAttendance ??= '';
  for (const c of result.courses) {
    c.periodId ??= ''; c.attendanceRequirement ??= ''; c.attendancePolicy ??= false; c.gradingPolicy ??= false; c.gradeRuleId ??= ''; c.target ??= null; c.ruleHistory ??= [];
  }
  for (const s of result.slots) { s.fromDate ??= dateAt(now,s.timezone); s.untilDate ??= ''; }
  return result;
}
export function materialize(data: StudyData, now = Date.now()): StudyData {
  const result = upgradeAcademic(data,now), known = new Set(result.classOccurrences.map(o => o.id));
  for (const slot of result.slots) {
    const course = result.courses.find(c => c.id === slot.courseId);
    if (!course || course.archived) continue;
    const period = result.periods.find(p => p.id === course.periodId);
    const start = [slot.fromDate,period?.start || ''].sort().at(-1)!;
    const horizon = Temporal.PlainDate.from(dateAt(now,slot.timezone)).add({days:7}).toString();
    const end = [horizon,slot.untilDate,period?.end].filter((v): v is string => !!v).sort()[0];
    if (start > end) continue;
    let date = Temporal.PlainDate.from(start);
    date = date.add({days:(slot.weekday-date.dayOfWeek%7+7)%7});
    while (date.toString() <= end) {
      const key = `${slot.id}@${date}`;
      if (!known.has(key)) {
        try { result.classOccurrences.push({id:key,courseId:course.id,slotId:slot.id,date:date.toString(),start:instant(`${date}T${slot.start}`,slot.timezone),end:instant(`${date}T${slot.end}`,slot.timezone),timezone:slot.timezone,room:slot.room,cancelled:false,attendance:'',changes:[]}); known.add(key); }
        catch { /* Recurrence view emits a clock-change warning; no guessed instant or attendance. */ }
      }
      date = date.add({days:7});
    }
  }
  return result;
}
function removeFuture(data: StudyData, courseIds: string[], now: number) {
  data.classOccurrences = data.classOccurrences.filter(o => !courseIds.includes(o.courseId) || !o.slotId || Date.parse(o.start) <= now || o.changes.length > 0);
}
export function validateRule(p: Record<string,unknown>, now: number, prior?: GradeRule): GradeRule {
  const scale = text(p.scale,'Scale') as GradeRule['scale'];
  if (!['percentage','4','10','custom'].includes(scale)) throw new Error('Scale: choose a supported scale.');
  const maxPoints = scale === '4' ? '4' : scale === '10' ? '10' : scale === 'percentage' ? '100' : decimal(p.maxPoints,'Maximum points','0.01','1000');
  if (!['none','half-up'].includes(String(p.rounding))) throw new Error('Rounding: choose a supported policy.');
  if (!Array.isArray(p.bands) || p.bands.length < 1 || p.bands.length > 30) throw new Error('Grade bands: enter 1–30 bands.');
  const bands = p.bands.map((raw: Record<string,unknown>, i: number) => {
    if (!raw || typeof raw !== 'object') throw new Error(`Band ${i+1}: invalid row.`);
    return {label:text(raw.label,`Band ${i+1} label`,false,30), lower:decimal(raw.lower,`Band ${i+1} lower threshold`),points:scale === 'percentage' ? '' : decimal(raw.points,`Band ${i+1} points`,'0',maxPoints,false,4)};
  }).sort((a,b) => Q.of(a.lower).cmp(b.lower));
  if (Q.of(bands[0].lower).cmp(0)) throw new Error('Lowest band: start at 0 to cover the full percentage range.');
  if (new Set(bands.map(b => b.label.toLowerCase())).size !== bands.length) throw new Error('Grade labels must be unique (ignoring case).');
  for (let i = 1; i < bands.length; i++) {
    if (Q.of(bands[i].lower).cmp(bands[i-1].lower) === 0) throw new Error(`Band ${bands[i].label}: duplicate lower threshold.`);
    if (scale !== 'percentage' && Q.of(bands[i].points).cmp(bands[i-1].points) < 0) throw new Error(`Band ${bands[i].label}: points must not decrease as marks rise.`);
  }
  const id = identifier(p.id);
  // Changing a numeric scale creates a new compatibility lineage, even from an existing version.
  const compatible = prior && prior.scale === scale && Q.of(prior.maxPoints).cmp(maxPoints) === 0;
  return { id, familyId:compatible ? prior.familyId : id, version: prior ? prior.version+1 : 1, name:text(p.name,'Grading system name'), scale,maxPoints,rounding:p.rounding as GradeRule['rounding'],bands,createdAt:new Date(now).toISOString() };
}
export function applyAcademic(data: StudyData, kind: string, p: Record<string,unknown>, now: number) {
  const course = (value: unknown): Course => { const c = data.courses.find(c => c.id === value); if (!c) throw new Error('Course is unavailable.'); return c; };
  const period = (value: unknown) => { const found = data.periods.find(s => s.id === value); if (!found) throw new Error('Academic period is unavailable.'); return found; };
  const occurrence = (value: unknown) => { const found = data.classOccurrences.find(o => o.id === value); if (!found) throw new Error('Class occurrence is unavailable.'); return found; };
  const change = (o: ClassOccurrence, action: string) => o.changes.push({at:new Date(now).toISOString(),action});
  switch (kind) {
    case 'period': {
      const id = identifier(p.id), start = dateInput(p.start,'Period start',true), end = dateInput(p.end,'Period end',true);
      if (start && end && end < start) throw new Error('Period end must not precede its start.');
      const old = data.periods.find(s => s.id === id);
      if (old) Object.assign(old,{name:text(p.name,'Period name'),start,end});
      else data.periods.push({id,name:text(p.name,'Period name'),start,end,goal:'',goalRuleId:''});
      removeFuture(data,data.courses.filter(c => c.periodId === id).map(c => c.id),now); return true;
    }
    case 'course-academic': {
      const c = course(p.id), periodId = text(p.periodId,'Academic period',true);
      if (periodId) period(periodId);
      c.periodId = periodId; c.credits = decimal(p.credits,'Credits','0.01','100',true);
      c.attendanceRequirement = decimal(p.requirement,'Attendance requirement','0','100',true);
      if (typeof p.attendancePolicy !== 'boolean' || typeof p.gradingPolicy !== 'boolean') throw new Error('Review the policy checkboxes.');
      c.attendancePolicy = p.attendancePolicy; c.gradingPolicy = p.gradingPolicy;
      removeFuture(data,[c.id],now); return true;
    }
    case 'attendance-default': data.defaultAttendance = decimal(p.value,'Default attendance requirement','0','100',true); return true;
    case 'dated-class': {
      const c = course(p.courseId), id = identifier(p.id), date = dateInput(p.date,'Class date');
      if (data.classOccurrences.some(o => o.id === id)) throw new Error('This dated class already exists.');
      const timezone = text(p.timezone,'Timezone'), start = instant(`${date}T${text(p.start,'Start time')}`,timezone), end = instant(`${date}T${text(p.end,'End time')}`,timezone);
      if (Date.parse(end) <= Date.parse(start)) throw new Error('Class end must be after start.');
      data.classOccurrences.push({id,courseId:c.id,slotId:'',date,start,end,timezone,room:text(p.room,'Room',true,100),cancelled:false,attendance:'',changes:[]}); return true;
    }
    case 'attendance': {
      const o = occurrence(p.id);
      if (Date.parse(o.start) > now || o.cancelled) throw new Error('Only started, non-cancelled classes can be marked.');
      if (!['attended','missed',''].includes(String(p.status))) throw new Error('Choose Attended, Missed, or Clear.');
      const status = p.status as ClassOccurrence['attendance'];
      if (o.attendance !== status) { change(o,`${o.attendance || 'unmarked'} → ${status || 'unmarked'}`); o.attendance = status; }
      return true;
    }
    case 'class-cancel': {
      const o = occurrence(p.id);
      if (typeof p.cancelled !== 'boolean') throw new Error('Choose a cancellation state.');
      if (o.attendance && p.confirm !== true) throw new Error('Confirm removal of this counted class before cancellation.');
      if (o.cancelled !== p.cancelled) { change(o,p.cancelled ? `Cancelled (previously ${o.attendance || 'unmarked'})` : 'Restored as unmarked'); o.cancelled = p.cancelled; o.attendance = ''; }
      return true;
    }
    case 'schedule-revise': {
      const old = data.slots.find(s => s.id === p.id);
      if (!old) throw new Error('Recurring class is unavailable.');
      const effective = dateInput(p.effective,'Effective date');
      if (effective <= dateAt(now,old.timezone) || effective < old.fromDate || (old.untilDate && effective > old.untilDate)) throw new Error('Choose a future effective date within the recurrence.');
      const start = text(p.start,'Start time'), end = text(p.end,'End time');
      if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(start) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(end) || end <= start) throw new Error('Use valid same-day start and end times.');
      if (!Number.isInteger(p.weekday) || Number(p.weekday) < 0 || Number(p.weekday) > 6) throw new Error('Choose a weekday.');
      const newId = identifier(p.newId);
      if (data.slots.some(s => s.id === newId)) throw new Error('Schedule revision already exists.');
      const revised: Slot = {...old,id:newId,fromDate:effective,start,end,weekday:Number(p.weekday),room:text(p.room,'Room',true,100)};
      old.untilDate = Temporal.PlainDate.from(effective).subtract({days:1}).toString();
      data.classOccurrences = data.classOccurrences.filter(o => o.slotId !== old.id || o.date < effective || Date.parse(o.start) <= now);
      data.slots.push(revised); return true;
    }
    case 'rule': {
      if (p.reviewed !== true) throw new Error('Review grade ranges, points, and affected courses before saving.');
      const prior = p.previousId ? data.gradeRules.find(r => r.id === p.previousId) : undefined;
      if (p.previousId && !prior) throw new Error('Previous rule version is unavailable.');
      if (data.gradeRules.some(r => r.id === p.id)) throw new Error('Rule version already exists.');
      const rule = validateRule(p,now,prior);
      rule.version = prior ? Math.max(...data.gradeRules.filter(r => r.familyId === prior.familyId).map(r => r.version))+1 : 1;
      if (!Array.isArray(p.courseIds) || !p.courseIds.every(id => typeof id === 'string')) throw new Error('Review affected courses.');
      const affected = p.courseIds.map(id => course(id));
      for (const c of affected) if (c.archived || courseCalculation(data,c).final) throw new Error('Completed or archived courses require a separate explicit historical remap.');
      data.gradeRules.push(rule);
      for (const c of affected) { c.ruleHistory.push({from:c.gradeRuleId,to:rule.id,at:new Date(now).toISOString()}); c.gradeRuleId = rule.id; }
      return true;
    }
    case 'assign-rule': {
      const c = course(p.id), rule = data.gradeRules.find(r => r.id === p.ruleId);
      if (!rule) throw new Error('Grading system is unavailable.');
      if ((courseCalculation(data,c).final || c.archived) && p.confirm !== true) throw new Error('Confirm historical remapping after reviewing the old and new result.');
      if (c.gradeRuleId !== rule.id) { c.ruleHistory.push({from:c.gradeRuleId,to:rule.id,at:new Date(now).toISOString()}); c.gradeRuleId = rule.id; }
      return true;
    }
    case 'assessment': {
      const c = course(p.courseId), id = identifier(p.id);
      const existing = data.assessments.find(a => a.id === id);
      if (existing && existing.courseId !== c.id) throw new Error('Assessment belongs to a different course.');
      const max = decimal(p.max,'Maximum marks','0.01','1000000'), weight = decimal(p.weight,'Weight','0.01','100');
      const score = decimal(p.score,'Score','0',max,true), increment = decimal(p.increment,'Score increment','0.01',max,true);
      if (increment && (Q.of(max).div(increment).d !== 1n || (score !== '' && Q.of(score).div(increment).d !== 1n))) throw new Error('Maximum and score must be multiples of the configured increment.');
      const type = text(p.type,'Assessment type');
      if (!['assignment','quiz','exam','project','other'].includes(type)) throw new Error('Choose an assessment type.');
      const row: Assessment = {id,courseId:c.id,title:text(p.title,'Assessment title'),type,max,weight,score,increment,due:dateInput(p.due,'Assessment date',true)};
      if (existing) Object.assign(existing,row); else data.assessments.push(row); return true;
    }
    case 'assessment-delete': {
      const c = course(p.courseId), index = data.assessments.findIndex(a => a.id === p.id && a.courseId === c.id);
      if (index < 0) throw new Error('Assessment is unavailable.');
      if (p.confirm !== true) throw new Error('Confirm assessment deletion.');
      data.assessments.splice(index,1); return true;
    }
    case 'course-target': {
      const c = course(p.id);
      if (p.targetKind === 'none') { c.target = null; return true; }
      if (p.targetKind === 'raw') c.target = {kind:'raw',value:decimal(p.value,'Raw target')};
      else if (p.targetKind === 'grade') {
        const value = text(p.value,'Target grade'), rule = data.gradeRules.find(r => r.id === c.gradeRuleId);
        if (!rule?.bands.some(b => b.label === value)) throw new Error('Choose a grade in the course’s current rule version.');
        c.target = {kind:'grade',value};
      } else throw new Error('Choose raw percentage or grade target.');
      return true;
    }
    case 'semester-goal': {
      const per = period(p.id);
      if (p.value === '') { per.goal = ''; per.goalRuleId = ''; return true; }
      const rule = data.gradeRules.find(r => r.id === p.ruleId);
      if (!rule || rule.scale === 'percentage') throw new Error('Select a saved grade-point system for this GPA goal.');
      per.goal = decimal(p.value,'Semester GPA goal','0',rule.maxPoints,false,4); per.goalRuleId = rule.id; return true;
    }
    default: return false;
  }
}
