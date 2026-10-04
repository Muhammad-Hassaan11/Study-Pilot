import type { Course, StudyData } from './model';
import type { GradeRule } from './academic-types';
import { Q, sum } from './exact';

export function attendanceMath(attended: number, missed: number, requirement: string) {
  const total = attended + missed, percent = total ? Q.of(attended).mul(100).div(total) : null;
  let state = 'Requirement not set', advice = 'Set a requirement to see a prediction.', allowance: number | null = null, recovery: number | null = null;
  if (!total) { state = 'No attendance recorded'; advice = 'Record a class to calculate attendance.'; }
  else if (requirement !== '') {
    const q = Q.of(requirement), scaled = Q.of(attended).mul(100), required = q.mul(total);
    if (!q.cmp(0)) { state = 'No minimum'; advice = 'No minimum attendance requirement is configured.'; }
    else if (scaled.cmp(required) < 0) {
      state = 'Below requirement';
      if (!q.cmp(100)) advice = 'No finite recovery to 100% after a missed class.';
      else { recovery = Number(required.sub(scaled).div(Q.of(100).sub(q)).ceil()); advice = `Attend the next ${recovery} consecutive ${recovery === 1 ? 'class' : 'classes'} to reach ${requirement}%.`; }
    } else {
      state = percent!.cmp(q.add(5)) <= 0 ? 'Close to limit' : 'On track';
      allowance = Number(Q.of(attended).mul(100).div(q).sub(total).floor());
      advice = `${allowance} immediate ${allowance === 1 ? 'miss' : 'misses'} allowed by the recorded ratio.`;
    }
  }
  return { attended, missed, total, percent: percent?.number() ?? null, state, advice, allowance, recovery, margin: percent && requirement !== '' ? percent.sub(requirement).number() : null };
}
export function attendanceSummary(data: StudyData, course: Course, now: number) {
  const past = data.classOccurrences.filter(o => o.courseId === course.id && !o.cancelled && Date.parse(o.start) <= now);
  const attended = past.filter(o => o.attendance === 'attended').length, missed = past.filter(o => o.attendance === 'missed').length;
  const result = attendanceMath(attended,missed,course.attendanceRequirement);
  if (course.attendancePolicy) { result.state = 'Unsupported attendance policy'; result.advice = 'This course does not use equal-session attendance. Predictions are withheld.'; result.allowance = null; result.recovery = null; }
  return { ...result, course, unmarked: past.length-attended-missed };
}
export function attendanceRisks(data: StudyData, now: number, period = 'all') {
  const rank = (s: string) => ['Below requirement','Close to limit','Requirement not set','No attendance recorded','Unsupported attendance policy','On track','No minimum'].indexOf(s);
  return data.courses.filter(c => !c.archived && (period === 'all' || c.periodId === period)).map(c => attendanceSummary(data,c,now)).sort((a,b) => rank(a.state)-rank(b.state) || (a.margin ?? 0)-(b.margin ?? 0) || a.course.name.localeCompare(b.course.name) || a.course.id.localeCompare(b.course.id));
}
export function mapGrade(raw: Q, rule: GradeRule) {
  const mapped = rule.rounding === 'half-up' ? new Q(raw.add('0.5').floor()) : raw;
  const band = [...rule.bands].reverse().find(b => mapped.cmp(b.lower) >= 0);
  return band ? { raw, mapped, label: band.label, points: band.points, rule } : null;
}
export function gradeMinimum(rule: GradeRule, label: string): Q | null {
  const band = rule.bands.find(b => b.label === label);
  if (!band) return null;
  const lower = Q.of(band.lower);
  if (rule.rounding === 'none') return lower;
  const minimum = new Q(lower.ceil()).sub('0.5');
  return minimum.cmp(0) < 0 ? Q.of(0) : minimum;
}
export function courseCalculation(data: StudyData, course: Course) {
  const rows = data.assessments.filter(a => a.courseId === course.id);
  const scored = rows.filter(a => a.score !== ''), pending = rows.filter(a => a.score === '');
  const total = sum(rows.map(a => Q.of(a.weight))), earned = sum(scored.map(a => Q.of(a.score).div(a.max).mul(a.weight)));
  const completed = sum(scored.map(a => Q.of(a.weight))), remaining = sum(pending.map(a => Q.of(a.weight))), lost = completed.sub(earned);
  const rule = data.gradeRules.find(r => r.id === course.gradeRuleId);
  const valid = rows.length > 0 && total.cmp(100) === 0;
  const final = valid && pending.length === 0;
  const grade = final && rule && !course.gradingPolicy ? mapGrade(earned,rule) : null;
  const target = !course.target ? null : course.target.kind === 'raw' ? Q.of(course.target.value) : rule ? gradeMinimum(rule,course.target.value) : null;
  let state = 'Set a course target', advice = 'Choose a raw percentage or a grade from your saved rules.';
  let required: Q | null = null, minimumMark: Q | null = null, resultingScore: Q | null = null, targetMet: boolean | null = null;
  if (course.gradingPolicy) { state = 'Unsupported grading policy'; advice = 'This course has institutional exceptions. Definitive target and GPA results are withheld.'; }
  else if (!valid) { state = 'Incomplete assessment weights'; advice = `Weights total ${total.fixed()}%. ${total.cmp(100) < 0 ? Q.of(100).sub(total).fixed()+'% missing' : total.sub(100).fixed()+'% excess'}. Targets are withheld until the total is exactly 100%.`; }
  else if (course.target?.kind === 'grade' && target === null) { state = 'Grade target needs review'; advice = 'Choose a target grade from the course’s current grading version.'; }
  else if (final) { state = 'Final result'; targetMet = target ? earned.cmp(target) >= 0 : null; advice = `Final raw percentage ${earned.fixed(4)}%.${targetMet === null ? '' : targetMet ? ' Course target met.' : ' Course target not met.'}`; }
  else if (target) {
    const needed = target.sub(earned);
    if (needed.cmp(0) <= 0) { state = 'Target secured under configured rules'; advice = 'Earned contribution already meets the target, assuming no penalties, hurdles, or later score reductions.'; }
    else if (needed.cmp(remaining) > 0) { state = 'Target unreachable'; advice = `Short by ${needed.sub(remaining).fixed(2,true)} weighted points even with full remaining marks.`; }
    else {
      state = 'Remaining work needed'; required = needed.mul(100).div(remaining);
      advice = `Need at least ${required.fixed(2,true)}% on remaining work: ${needed.fixed(4)} of ${remaining.fixed()} weighted points.`;
      if (pending.length === 1 && pending[0].increment !== '') {
        const assessment = pending[0];
        minimumMark = new Q(needed.mul(assessment.max).div(assessment.weight).div(assessment.increment).ceil()).mul(assessment.increment);
        resultingScore = earned.add(minimumMark.div(assessment.max).mul(assessment.weight));
        advice += ` Minimum ${minimumMark.fixed()}/${assessment.max} on ${assessment.title} (steps of ${assessment.increment}), producing ${resultingScore.fixed(4)}%.`;
      } else if (pending.length > 1) advice += ' This is an aggregate weighted condition, not a minimum on each assessment.';
    }
  }
  const needed = target ? target.sub(earned) : Q.of(0);
  const chartNeeded = needed.cmp(0) < 0 ? Q.of(0) : needed.cmp(remaining) > 0 ? remaining : needed;
  return { rows, total, earned, completed, remaining, lost, maximum: earned.add(remaining), gradedAverage: completed.cmp(0) ? earned.mul(100).div(completed) : null, rule, valid, final, grade, target, state, advice, required, minimumMark, resultingScore, targetMet,
    chart: valid ? [{label:'Earned',value:earned.number()},{label:needed.cmp(remaining)>0 ? 'Available remaining' : 'Needed',value:chartNeeded.number()},{label:'Remaining surplus',value:remaining.sub(chartNeeded).number()},{label:'Already lost',value:lost.number()}] : [] };
}
export function semesterCalculation(data: StudyData, periodId: string) {
  const period = data.periods.find(p => p.id === periodId), courses = data.courses.filter(c => c.periodId === periodId);
  const excluded: { course: Course; reason: string }[] = [];
  const included: {course: Course; points: Q; credits: Q; rule: GradeRule}[] = [];
  for (const course of courses) {
    const calc = courseCalculation(data,course);
    let reason = course.gradingPolicy ? 'Unsupported grading or course inclusion policy' : !course.credits ? 'Credits missing' : !calc.valid ? 'Assessment weights incomplete' : !calc.final ? 'Awaiting assessment results' : !calc.rule ? 'Grading system not set' : calc.rule.scale === 'percentage' ? 'Percentage-only course; no grade points' : '';
    if (!reason && !calc.grade) reason = 'Final mapping unavailable';
    if (reason) excluded.push({course,reason});
    else included.push({course,points:Q.of(calc.grade!.points),credits:Q.of(course.credits),rule:calc.rule!});
  }
  // Numeric maxima alone do not establish institutional compatibility; versions share a scale lineage.
  const goalRule = data.gradeRules.find(r => r.id === period?.goalRuleId);
  const scales = new Set([...included.map(i => `${i.rule.familyId}/${i.rule.scale}/${i.rule.maxPoints}`),...(goalRule && period?.goal !== '' ? [`${goalRule.familyId}/${goalRule.scale}/${goalRule.maxPoints}`] : [])]);
  const incompatible = scales.size > 1;
  const credits = sum(included.map(i => i.credits)), quality = sum(included.map(i => i.points.mul(i.credits)));
  const gpa = included.length && !incompatible ? quality.div(credits) : null;
  const complete = courses.length > 0 && excluded.length === 0 && !incompatible;
  const targetMet = gpa && period?.goal !== '' && period?.goal !== undefined ? gpa.cmp(period.goal) >= 0 : null;
  return { courses, included, excluded, credits, quality, gpa, complete, incompatible, targetMet, period, label: complete ? 'Final semester GPA' : 'GPA from completed courses' };
}
