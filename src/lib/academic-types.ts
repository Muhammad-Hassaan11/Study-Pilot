export type Period = { id: string; name: string; start: string; end: string; goal: string; goalRuleId: string };
export type ClassOccurrence = { id: string; courseId: string; slotId: string; date: string; start: string; end: string; timezone: string; room: string; cancelled: boolean; attendance: 'attended' | 'missed' | ''; changes: { at: string; action: string }[] };
export type Band = { label: string; lower: string; points: string };
export type GradeRule = { id: string; familyId: string; version: number; name: string; scale: 'percentage' | '4' | '10' | 'custom'; maxPoints: string; rounding: 'none' | 'half-up'; bands: Band[]; createdAt: string };
export type Assessment = { id: string; courseId: string; title: string; type: string; max: string; weight: string; score: string; increment: string; due: string };
export type CourseTarget = { kind: 'raw' | 'grade'; value: string };
export type AcademicData = { schema: 2; periods: Period[]; classOccurrences: ClassOccurrence[]; gradeRules: GradeRule[]; assessments: Assessment[]; defaultAttendance: string };
