'use client';
import { useState, type ReactNode } from 'react';
import type { Course, StudyData } from '@/lib/model';
import type { Period } from '@/lib/academic-types';

export type SaveAcademic = (kind: string, payload: Record<string,unknown>) => Promise<boolean>;
export type AcademicProps = { data: StudyData; now: number; save: SaveAcademic; disabled: boolean; error: string };
export function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="field"><span>{label}</span>{children}</label>; }
export function Decimal({ name, value = '', min = '0', max = '100', optional = false, step = '0.01' }: { name: string; value?: string; min?: string; max?: string; optional?: boolean; step?: string }) {
  return <input type="number" name={name} defaultValue={value} min={min} max={max} step={step} required={!optional} inputMode="decimal"/>;
}
export function FormError({ error }: { error: string }) { return error ? <p className="error" role="alert">{error}</p> : null; }
export function PeriodForm({ existing, save, disabled, error }: {existing?: Period; save: SaveAcademic; disabled: boolean; error: string}) {
  const [id,setId] = useState(existing?.id || crypto.randomUUID());
  return <form className="academic-form" onSubmit={async e => { e.preventDefault(); const form = e.currentTarget; if (await save('period',{...Object.fromEntries(new FormData(form)),id})) { if (!existing) {form.reset();setId(crypto.randomUUID());} } }}>
    <Field label="Period name"><input name="name" required maxLength={160} defaultValue={existing?.name} placeholder="e.g. Fall 2026"/></Field>
    <div className="form-two"><Field label="Start date (optional)"><input type="date" name="start" defaultValue={existing?.start}/></Field><Field label="End date (optional)"><input type="date" name="end" defaultValue={existing?.end}/></Field></div>
    <p className="fine">Unknown dates stay unknown. Boundary edits adjust future scheduling; existing past class snapshots remain available for explicit correction.</p><FormError error={error}/><button className="primary" disabled={disabled}>{existing ? 'Save period' : 'Create period'}</button>
  </form>;
}
export function PeriodManager({data,save,disabled,error}: AcademicProps) {
  return <details className="panel academic-details"><summary>Manage academic periods</summary><div className="details-content"><h3>Create an academic period</h3><PeriodForm save={save} disabled={disabled} error={error}/>{data.periods.map(p => <details key={p.id} className="sub-details"><summary>Edit {p.name}</summary><PeriodForm existing={p} save={save} disabled={disabled} error={error}/></details>)}</div></details>;
}
export function CourseAcademicForm({course,data,save,disabled,error}: Omit<AcademicProps,'now'> & {course: Course}) {
  return <form className="academic-form" onSubmit={e => {e.preventDefault(); const fields = new FormData(e.currentTarget); void save('course-academic',{...Object.fromEntries(fields),id:course.id,attendancePolicy:fields.has('attendancePolicy'),gradingPolicy:fields.has('gradingPolicy')});}}>
    <div className="form-two"><Field label="Academic period"><select name="periodId" defaultValue={course.periodId}><option value="">Unassigned</option>{data.periods.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></Field><Field label="Course credits (optional)"><Decimal name="credits" value={course.credits} min="0.01" optional/></Field></div>
    <Field label="Attendance requirement % (blank means unset)"><Decimal name="requirement" value={course.attendanceRequirement} optional/></Field>
    <label className="checkbox-field"><input type="checkbox" name="attendancePolicy" defaultChecked={course.attendancePolicy}/>My institution uses unequal contact hours, partial/excused attendance, or another unsupported attendance rule.</label>
    <label className="checkbox-field"><input type="checkbox" name="gradingPolicy" defaultChecked={course.gradingPolicy}/>This course has bonus/category/hurdle rules, penalties, or special GPA inclusion rules that the fixed model does not support.</label>
    <p className="fine">Checking a policy exception withholds definitive advice for that model. No university policy is inferred from its name.</p><FormError error={error}/><button className="primary" disabled={disabled}>Save course settings</button>
  </form>;
}
export function AcademicEmpty() { return <div className="empty"><h2>Start with a course</h2><p>Add a course using the button above, then return here to record your progress. Grading setup is never required for attendance.</p></div>; }
