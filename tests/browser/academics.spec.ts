import { test, expect, type Page } from '@playwright/test';

const bands=[['F','0','0'],['D','50','1'],['C','60','2'],['C+','65','2.5'],['B','70','3'],['B+','75','3.33'],['A−','80','3.67'],['A','85','4']].map(([label,lower,points])=>({label,lower,points}));
async function writer(page:Page) {
  await page.goto('/attendance');await page.getByRole('button',{name:'Continue as guest'}).click();
  await expect(page.getByRole('heading',{name:'Attendance',exact:true})).toBeVisible();
  return async (kind:string,payload:Record<string,unknown>)=>{
    const data=await (await page.request.get('/api/workspace')).json();
    const response=await page.request.post('/api/workspace',{headers:{Origin:'http://localhost:3000'},data:{kind,payload,revision:data.revision,requestId:crypto.randomUUID()}});
    expect(response.ok(),await response.text()).toBeTruthy();return response.json();
  };
}
async function seed(page:Page) {
  const write=await writer(page);
  await write('course',{id:'calculus',name:'Calculus II',code:'MAT201',color:'#6763d9',credits:'3'});
  await write('period',{id:'fall',name:'Fall 2026',start:'2026-09-01',end:'2026-12-31'});
  await write('course-academic',{id:'calculus',periodId:'fall',credits:'3',requirement:'75',attendancePolicy:false,gradingPolicy:false});
  return write;
}

test('attendance fixture, same-day correction, future denial, canonical Overview, mobile and keyboard',async({page})=>{
  const write=await seed(page);
  for(let i=0;i<20;i++){
    await write('dated-class',{id:`held-${i}`,courseId:'calculus',date:`2020-09-${String(i+1).padStart(2,'0')}`,start:'09:00',end:'10:00',timezone:'UTC',room:'B-204'});
    await write('attendance',{id:`held-${i}`,status:i<18?'attended':'missed'});
  }
  for(const [id,start,end,date] of [['same-1','09:00','10:00','2020-10-01'],['same-2','11:00','12:00','2020-10-01'],['future','09:00','10:00','2099-10-01']]) await write('dated-class',{id,courseId:'calculus',date,start,end,timezone:'UTC',room:'B-205'});
  await page.reload();
  const course=page.locator('.attendance-course');
  await expect(course).toContainText('18 attended / 20 recorded');await expect(course).toContainText('4 immediate misses');await expect(course).toContainText('2 known past classes unmarked');
  await expect(course.locator('.attendance-track>span')).toHaveAttribute('style','width: 90%;');
  const future=page.locator('.attendance-event').filter({hasText:'Future — marking unavailable'});
  await expect(future.getByRole('button',{name:'Attended',exact:true})).toBeDisabled();
  const historical=page.locator('.attendance-event').filter({hasText:'B-205'}).filter({hasNotText:'Future — marking unavailable'}).first();
  await historical.getByRole('button',{name:'Attended',exact:true}).focus();await page.keyboard.press('Enter');
  await expect(course).toContainText('19 attended / 21 recorded');await expect(course).toContainText('4 immediate misses');
  await historical.getByRole('button',{name:'Missed',exact:true}).click();await expect(course).toContainText('18 attended / 21 recorded');await expect(course).toContainText('3 immediate misses');
  await historical.getByRole('button',{name:'Clear record'}).click();await expect(course).toContainText('18 attended / 20 recorded');
  await page.reload();await expect(course).toContainText('18 attended / 20 recorded');
  await page.getByRole('link',{name:'Overview',exact:true}).click();
  await expect(page.locator('.academic-preview').filter({hasText:'Attendance'})).toContainText('18/20 recorded');
  await page.getByRole('link',{name:'Attendance',exact:true}).click();
  await page.setViewportSize({width:320,height:850});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await page.screenshot({path:'test-results/attendance-mobile.png',fullPage:true});
  await page.setViewportSize({width:1440,height:1100});await page.screenshot({path:'test-results/attendance-desktop.png',fullPage:true});
});

test('weighted planner UI creates scores and target, saves rules, preserves versions, and shows partial GPA',async({page})=>{
  const write=await seed(page);
  await page.goto('/gpa-planner?period=fall&course=calculus');
  const add=page.locator('details').filter({has:page.locator('summary').filter({hasText:/^Add an assessment$/})}).last();
  for(const [title,max,weight,score,increment] of [['Quiz','20','20','18','1'],['Midterm','50','20','45','1'],['Final','100','60','','1']]) {
    await add.getByLabel('Assessment title',{exact:true}).fill(title);
    await add.getByLabel('Maximum raw marks',{exact:true}).fill(max);
    await add.getByLabel('Weight in final course (%)').fill(weight);
    await add.getByLabel('Earned score (blank = ungraded)').fill(score);
    await add.getByLabel('Allowed mark increment (optional)').fill(increment);
    await add.getByRole('button',{name:'Add assessment',exact:true}).click();
    await expect(page.locator('.assessment-row').filter({hasText:title}).first()).toBeVisible();
  }
  await page.getByLabel('Target type').selectOption('raw');await page.getByLabel('Raw percentage target').fill('80');await page.getByRole('button',{name:'Save course target'}).click();
  await expect(page.getByTestId('course-advice')).toContainText('73.34%');await expect(page.getByTestId('course-advice')).toContainText('74.00/100');
  await expect(page.getByRole('img',{name:/Earned: 36.0000/})).toHaveAttribute('aria-label','Earned: 36.0000 weighted points; Needed: 44.0000 weighted points; Remaining surplus: 16.0000 weighted points; Already lost: 4.0000 weighted points');
  await page.getByText('University grading systems and versions',{exact:true}).click();
  await page.getByRole('button',{name:'Load labelled example'}).click();
  await page.getByLabel('Grading system name',{exact:true}).fill('My reviewed rules');
  await page.getByRole('checkbox',{name:/Calculus II · currently/}).check();
  await page.getByRole('checkbox',{name:/I reviewed these ranges/}).check();
  await page.getByRole('button',{name:'Save grading version',exact:true}).click();
  await expect(page.getByLabel('Course grading version')).not.toBeVisible();
  await expect(page.getByText('Saved versions (read-only)',{exact:true})).toBeVisible();
  await page.getByText('University grading systems and versions',{exact:true}).click();
  await page.reload();await expect(page.getByTestId('course-advice')).toContainText('73.34%');
  await page.setViewportSize({width:320,height:850});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();await page.screenshot({path:'test-results/gpa-mobile.png',fullPage:true});
  await page.setViewportSize({width:1440,height:1100});await page.screenshot({path:'test-results/gpa-desktop.png',fullPage:true});
  const final=page.locator('.assessment-row').filter({has:page.getByText('Final',{exact:true})});await final.getByText('Edit assessment or score',{exact:true}).click();await final.getByLabel('Earned score (blank = ungraded)').fill('80');await final.getByRole('button',{name:'Save assessment'}).click();
  await expect(page.locator('.final-trail')).toContainText('84.0000%');await expect(page.locator('.final-trail')).toContainText('A−');
  await expect(page.locator('.gpa-summary')).toContainText('3.67');await expect(page.locator('.gpa-summary')).toContainText('FINAL SEMESTER GPA');
  await write('course',{id:'pending-course',name:'Physics',code:'PHY',color:'#558877',credits:''});
  await write('course-academic',{id:'pending-course',periodId:'fall',credits:'',requirement:'',attendancePolicy:false,gradingPolicy:false});
  await page.reload();await expect(page.locator('.gpa-summary')).toContainText('GPA FROM COMPLETED COURSES');await expect(page.locator('.gpa-summary')).toContainText('Physics: Credits missing');
});

test('academic failure retains draft; stale tab cannot overwrite scores',async({page,context})=>{
  const write=await seed(page);await write('assessment',{id:'one',courseId:'calculus',title:'Final',type:'exam',max:'100',weight:'100',score:'',increment:'1',due:''});
  await page.goto('/gpa-planner?period=fall&course=calculus');
  await page.getByLabel('Target type').selectOption('raw');await page.getByLabel('Raw percentage target').fill('80');
  await page.route('**/api/workspace',async route=>{if(route.request().method()==='POST')await route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'Academic save temporarily unavailable'})});else await route.continue();});
  await page.getByRole('button',{name:'Save course target'}).click();await expect(page.getByLabel('Raw percentage target')).toHaveValue('80');await expect(page.getByRole('alert').first()).toContainText('temporarily unavailable');
  await page.unroute('**/api/workspace');await page.getByRole('button',{name:'Save course target'}).click();await expect(page.getByTestId('course-advice')).toContainText('80.00%');
  const old=await (await page.request.get('/api/workspace')).json();await write('assessment',{...old.assessments[0],score:'75'});
  const stale=await page.request.post('/api/workspace',{headers:{Origin:'http://localhost:3000'},data:{kind:'assessment',requestId:crypto.randomUUID(),revision:old.revision,payload:{...old.assessments[0],score:'90'}}});expect(stale.status()).toBe(409);
  await page.reload();await expect(page.locator('.final-trail')).toContainText('75.0000%');
  const other=await context.newPage();await other.goto('/attendance');await expect(other.getByRole('heading',{name:'Attendance',exact:true})).toBeVisible();
  await page.request.post('/api/workspace',{headers:{Origin:'http://localhost:3000'},data:{kind:'delete',confirmation:'DELETE'}});
  await other.reload();await expect(other.getByRole('button',{name:'Continue as guest'})).toBeVisible();await other.close();
});
