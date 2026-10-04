import { Temporal } from '@js-temporal/polyfill';

export type Course = { id: string; name: string; code: string; color: string; credits: string; archived: boolean };
export type Slot = { id: string; courseId: string; weekday: number; start: string; end: string; room: string; timezone: string };
export type Deadline = { id: string; courseId: string; title: string; type: 'assignment' | 'quiz' | 'exam' | 'project'; due: string; notes: string; done: boolean };
export type Profile = { name: string; university: string; timezone: string; theme: 'light' | 'dark' | 'system' };
export type StudyData = { revision: number; profile: Profile; courses: Course[]; slots: Slot[]; deadlines: Deadline[] };
export type Occurrence = Slot & { date: string; startsAt: number; endsAt: number; course: Course; conflict: boolean };

export function initialData(timezone = 'UTC'): StudyData {
  return { revision: 0, profile: { name: '', university: '', timezone, theme: 'system' }, courses: [], slots: [], deadlines: [] };
}
export function validTimezone(zone: string) {
  try { Temporal.Now.zonedDateTimeISO(zone); return true; } catch { return false; }
}
export function localToInstant(value: string, timezone: string): string {
  try { return Temporal.PlainDateTime.from(value).toZonedDateTime(timezone, { disambiguation: 'reject' }).toInstant().toString(); }
  catch { throw new Error('This local time is invalid or occurs twice because of a clock change. Choose an unambiguous time.'); }
}
export function localDate(now: number, timezone: string) {
  return Temporal.Instant.fromEpochMilliseconds(now).toZonedDateTimeISO(timezone).toPlainDate().toString();
}
export function localInput(instant: string, timezone: string) {
  return Temporal.Instant.from(instant).toZonedDateTimeISO(timezone).toPlainDateTime().toString({ smallestUnit: 'minute' });
}
export function occurrences(data: StudyData, now: number, days = 7): { items: Occurrence[]; warnings: string[] } {
  const items: Occurrence[] = [], warnings: string[] = [];
  for (const slot of data.slots) {
    const course = data.courses.find(c => c.id === slot.courseId && !c.archived);
    if (!course) continue;
    const first = Temporal.Instant.fromEpochMilliseconds(now).toZonedDateTimeISO(slot.timezone).toPlainDate();
    for (let i = -1; i <= days; i++) {
      const date = first.add({ days: i });
      if (date.dayOfWeek % 7 !== slot.weekday) continue;
      try {
        const startsAt = Date.parse(localToInstant(`${date}T${slot.start}`, slot.timezone));
        const endsAt = Date.parse(localToInstant(`${date}T${slot.end}`, slot.timezone));
        const displayDate = localDate(startsAt, data.profile.timezone);
        const today = localDate(now, data.profile.timezone);
        if (displayDate < today || displayDate > Temporal.PlainDate.from(today).add({ days }).toString()) continue;
        items.push({ ...slot, date: date.toString(), startsAt, endsAt, course, conflict: false });
      } catch { warnings.push(`${course.name} on ${date}: clock change needs a schedule adjustment.`); }
    }
  }
  items.sort((a,b) => a.startsAt-b.startsAt || a.course.name.localeCompare(b.course.name) || a.id.localeCompare(b.id));
  for (const item of items) item.conflict = items.some(other => other !== item && item.startsAt < other.endsAt && other.startsAt < item.endsAt);
  return { items, warnings };
}
export function deadlineStatus(due: string, now: number) {
  const delta = Date.parse(due) - now;
  return delta < 0 ? 'Overdue' : delta === 0 ? 'Due now' : delta <= 86400000 ? 'Due soon' : 'Upcoming';
}
export function pendingDeadlines(data: StudyData) {
  return data.deadlines.filter(d => !d.done).sort((a,b) => Date.parse(a.due)-Date.parse(b.due) || a.id.localeCompare(b.id));
}

function string(value: unknown, label: string, max = 160, required = true): string {
  if (typeof value !== 'string' || value.length > max || (required && !value.trim())) throw new Error(`Check ${label}.`);
  return value.trim();
}
function id(value: unknown) { const result = string(value, 'identifier', 64); if (!/^[a-zA-Z0-9-]+$/.test(result)) throw new Error('Invalid identifier.'); return result; }
export type Mutation = { kind: string; payload: Record<string, unknown> };
export function applyMutation(current: StudyData, mutation: Mutation): StudyData {
  const data = structuredClone(current), p = mutation.payload;
  const ownedCourse = (value: unknown) => {
    const course = data.courses.find(c => c.id === value);
    if (!course) throw new Error('Course is unavailable.');
    return course;
  };
  switch (mutation.kind) {
    case 'profile': {
      const timezone = string(p.timezone, 'timezone', 100);
      if (!validTimezone(timezone) || !['system','light','dark'].includes(String(p.theme))) throw new Error('Choose a valid timezone and appearance.');
      data.profile = { name: string(p.name, 'name', 80, false), university: string(p.university, 'university', 160, false), timezone, theme: p.theme as Profile['theme'] };
      break;
    }
    case 'course': {
      const course: Course = { id: id(p.id), name: string(p.name, 'course name'), code: string(p.code, 'course code', 24, false), color: string(p.color, 'color'), credits: string(p.credits, 'credits', 8, false), archived: false };
      if (!/^#[0-9a-f]{6}$/i.test(course.color) || (course.credits && (!Number.isFinite(Number(course.credits)) || Number(course.credits) <= 0 || Number(course.credits) > 100))) throw new Error('Use a valid color and positive credits.');
      const existing = data.courses.findIndex(c => c.id === course.id);
      if (existing >= 0) data.courses[existing] = { ...course, archived: data.courses[existing].archived }; else data.courses.push(course);
      break;
    }
    case 'archive': {
      const course = ownedCourse(p.id); course.archived = !course.archived; break;
    }
    case 'slot': {
      const course = ownedCourse(p.courseId);
      if (course.archived) throw new Error('Restore this course before adding a class.');
      const start = string(p.start, 'start time'), end = string(p.end, 'end time'), timezone = string(p.timezone, 'timezone', 100);
      if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(start) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(end) || end <= start) throw new Error('End time must be after start time. Split overnight classes into separate slots.');
      if (!Number.isInteger(p.weekday) || Number(p.weekday) < 0 || Number(p.weekday) > 6 || !validTimezone(timezone)) throw new Error('Choose a valid weekday and timezone.');
      const slot: Slot = { id: id(p.id), courseId: course.id, weekday: Number(p.weekday), start, end, room: string(p.room, 'room', 100, false), timezone };
      if (data.slots.some(s => s.id === slot.id)) throw new Error('This class already exists.');
      data.slots.push(slot); break;
    }
    case 'deadline': {
      const course = ownedCourse(p.courseId);
      const deadline: Deadline = { id: id(p.id), courseId: course.id, title: string(p.title, 'title'), type: p.type as Deadline['type'], due: localToInstant(string(p.localDue, 'due date'), string(p.timezone, 'timezone', 100)), notes: string(p.notes, 'notes', 3000, false), done: false };
      if (!['assignment','quiz','exam','project'].includes(deadline.type)) throw new Error('Choose a deadline type.');
      const existing = data.deadlines.findIndex(d => d.id === deadline.id);
      if (existing >= 0) data.deadlines[existing] = { ...deadline, done: data.deadlines[existing].done }; else { if (course.archived) throw new Error('Restore this course first.'); data.deadlines.push(deadline); }
      break;
    }
    case 'complete': {
      const deadline = data.deadlines.find(d => d.id === p.id);
      if (!deadline || typeof p.done !== 'boolean') throw new Error('Deadline is unavailable.');
      deadline.done = p.done; break;
    }
    default: throw new Error('Unknown action.');
  }
  data.revision += 1;
  return data;
}
