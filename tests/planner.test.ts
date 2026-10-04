import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createStore } from '../src/lib/store';
import { applyMutation, deadlineStatus, initialData, localToInstant, occurrences, pendingDeadlines } from '../src/lib/model';

const course = { id:'course-1', name:'Mathematics', code:'MTH101', color:'#6763d9', credits:'3' };
test('guest work persists, is isolated, rejects stale writes, and retries once logically', () => {
  const store = createStore(':memory:');
  try {
    const alice = store.create('UTC'), bob = store.create('UTC');
    const saved = store.mutate(alice.token,'request-0001',0,{kind:'course',payload:course});
    assert.equal(saved.courses.length,1);
    assert.equal(store.read(alice.token).courses[0].name,'Mathematics');
    assert.equal(store.read(bob.token).courses.length,0);
    assert.equal(store.mutate(alice.token,'request-0001',0,{kind:'course',payload:course}).revision,1);
    assert.throws(() => store.mutate(alice.token,'request-0002',0,{kind:'course',payload:course}), /another tab/);
    assert.throws(() => store.mutate(bob.token,'request-0003',0,{kind:'archive',payload:{id:course.id}}), /unavailable/);
    assert.throws(() => store.read('forged-session'), /session has ended/);
    store.delete(alice.token);
    assert.throws(() => store.read(alice.token), /session has ended/);
    assert.throws(() => store.mutate(alice.token,'request-0004',1,{kind:'course',payload:course}), /session has ended/);
    assert.equal(store.read(bob.token).revision,0);
    store.signout(bob.token);
    assert.throws(() => store.read(bob.token), /session has ended/);
  } finally { store.close(); }
});
test('DST gaps and overlaps require correction; ordinary deadlines retain their instant', () => {
  assert.throws(() => localToInstant('2026-03-08T02:30','America/Los_Angeles'), /clock change/);
  assert.throws(() => localToInstant('2026-11-01T01:30','America/Los_Angeles'), /clock change/);
  assert.equal(localToInstant('2026-10-05T10:00','America/Los_Angeles'),'2026-10-05T17:00:00Z');
});
test('due boundaries are exact and completed records remain reopenable', () => {
  const now = Date.parse('2026-10-05T17:00:00Z');
  assert.equal(deadlineStatus('2026-10-05T16:59:59Z',now),'Overdue');
  assert.equal(deadlineStatus('2026-10-05T17:00:00Z',now),'Due now');
  assert.equal(deadlineStatus('2026-10-06T17:00:00Z',now),'Due soon');
  assert.equal(deadlineStatus('2026-10-06T17:00:01Z',now),'Upcoming');
  let data = applyMutation(initialData(),{kind:'course',payload:course});
  data = applyMutation(data,{kind:'deadline',payload:{id:'deadline-1',courseId:course.id,title:'Essay',type:'assignment',localDue:'2026-10-05T10:00',timezone:'America/Los_Angeles',notes:''}});
  assert.equal(pendingDeadlines(data).length,1);
  data = applyMutation(data,{kind:'complete',payload:{id:'deadline-1',done:true}});
  assert.equal(pendingDeadlines(data).length,0); assert.equal(data.deadlines.length,1);
  data = applyMutation(data,{kind:'complete',payload:{id:'deadline-1',done:false}});
  assert.equal(pendingDeadlines(data).length,1);
  data = applyMutation(data,{kind:'profile',payload:{name:'',university:'',theme:'dark',timezone:'Asia/Karachi'}});
  assert.equal(data.deadlines[0].due,'2026-10-05T17:00:00Z');
});
test('weekly classes show the next class, current end boundary, and overlapping slots', () => {
  let data = applyMutation(initialData('America/Los_Angeles'),{kind:'course',payload:course});
  data = applyMutation(data,{kind:'slot',payload:{id:'slot-1',courseId:course.id,weekday:1,start:'10:00',end:'11:30',room:'B-204',timezone:'America/Los_Angeles'}});
  const now = Date.parse('2026-10-05T16:35:00Z');
  assert.equal((occurrences(data,now).items[0].startsAt-now)/60000,25);
  assert.equal(occurrences(data,now).items[0].room,'B-204');
  data = applyMutation(data,{kind:'slot',payload:{id:'slot-2',courseId:course.id,weekday:1,start:'11:00',end:'12:00',room:'B-205',timezone:'America/Los_Angeles'}});
  assert.equal(occurrences(data,now).items[0].conflict,true);
  assert.equal(occurrences(data,now).items[1].conflict,true);
  assert.throws(() => applyMutation(data,{kind:'slot',payload:{id:'bad',courseId:course.id,weekday:1,start:'23:00',end:'01:00',room:'',timezone:'UTC'}}), /End time/);
  data = applyMutation(data,{kind:'archive',payload:{id:course.id}});
  assert.equal(occurrences(data,now).items.length,0); assert.equal(data.slots.length,2);
});
