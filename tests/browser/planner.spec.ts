import { test, expect } from '@playwright/test';

test('guest plans a course, class and deadline, reloads, completes and reopens work', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button',{name:'Continue as guest'}).click();
  await expect(page.getByRole('heading',{name:'A fresh start, a clearer day.'})).toBeVisible();
  await page.getByRole('button',{name:'Add course',exact:true}).click();
  await page.getByLabel('Course name').fill('Test Biology');
  await page.getByLabel('Course code').fill('BIO101');
  await page.getByRole('dialog').getByRole('button',{name:'Add course',exact:true}).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.getByRole('link',{name:'Timetable',exact:true}).click();
  await page.getByRole('button',{name:'Add class',exact:true}).click();
  await page.getByLabel('Room (optional)').fill('Science 204');
  await page.getByRole('dialog').getByRole('button',{name:'Add class',exact:true}).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByText('Science 204',{exact:false}).first()).toBeVisible();
  await page.getByRole('link',{name:'Deadlines',exact:true}).click();
  await page.getByRole('button',{name:'Add deadline',exact:true}).first().click();
  await page.getByLabel('Title',{exact:true}).fill('Cell structure essay');
  await page.getByRole('dialog').getByRole('button',{name:'Add deadline',exact:true}).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.reload();
  await expect(page.getByRole('button',{name:'Cell structure essay',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Complete Cell structure essay',exact:true}).click();
  await page.getByRole('button',{name:'completed (1)',exact:true}).click();
  await page.getByRole('button',{name:'Reopen Cell structure essay',exact:true}).click();
  await page.getByRole('button',{name:'pending (1)',exact:true}).click();
  await expect(page.getByRole('button',{name:'Cell structure essay',exact:true})).toBeVisible();
  await page.getByRole('link',{name:'Settings',exact:true}).click();
  await page.getByLabel('Display name').fill('Taylor');
  await page.getByLabel('Appearance').selectOption('dark');
  await page.getByRole('button',{name:'Save preferences'}).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await page.reload();
  await expect(page.getByLabel('Display name')).toHaveValue('Taylor');
  await page.setViewportSize({width:320,height:780});
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  await page.getByRole('link',{name:'Overview',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Welcome back, Taylor.'})).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  await page.screenshot({path:'test-results/overview-mobile.png',fullPage:true});
  await page.setViewportSize({width:1440,height:1000});
  await page.screenshot({path:'test-results/overview-desktop.png',fullPage:true});
});

test('API rejects unauthenticated reads and cross-origin mutations', async ({ request }) => {
  expect((await request.get('/api/workspace')).status()).toBe(401);
  expect((await request.post('/api/workspace',{headers:{Origin:'https://untrusted.example'},data:{kind:'guest',timezone:'UTC'}})).status()).toBe(403);
});

test('failed saves keep the draft and dialog focus; retry creates one course', async ({ page }) => {
  await page.goto('/courses');
  await page.getByRole('button',{name:'Continue as guest'}).click();
  await page.getByRole('button',{name:'Add course',exact:true}).click();
  await expect(page.getByLabel('Course name')).toBeFocused();
  await page.getByLabel('Course name').fill('Keep this draft');
  await page.route('**/api/workspace', async route => {
    if (route.request().method() === 'POST') await route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'Temporary save failure'})});
    else await route.continue();
  });
  await page.getByRole('dialog').getByRole('button',{name:'Add course',exact:true}).click();
  await expect(page.getByRole('dialog').getByRole('alert')).toHaveText('Temporary save failure');
  await expect(page.getByLabel('Course name')).toHaveValue('Keep this draft');
  await page.unroute('**/api/workspace');
  await page.getByRole('dialog').getByRole('button',{name:'Add course',exact:true}).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByRole('heading',{name:'Keep this draft',exact:true})).toHaveCount(1);
  await expect(page.getByRole('button',{name:'Add course',exact:true})).toBeFocused();
});

test('separate browser identities cannot read or mutate another guest course', async ({ browser }) => {
  const a = await browser.newContext(), b = await browser.newContext();
  try {
    const headers = {Origin:'http://localhost:3000'};
    await a.request.post('http://localhost:3000/api/workspace',{headers,data:{kind:'guest',timezone:'UTC'}});
    await b.request.post('http://localhost:3000/api/workspace',{headers,data:{kind:'guest',timezone:'UTC'}});
    const saved = await a.request.post('http://localhost:3000/api/workspace',{headers,data:{kind:'course',revision:0,requestId:'isolation-request',payload:{id:'private-course',name:'Private physics',code:'',color:'#6763d9',credits:''}}});
    expect(saved.status()).toBe(200);
    const other = await b.request.get('http://localhost:3000/api/workspace');
    expect((await other.json()).courses).toEqual([]);
    const attack = await b.request.post('http://localhost:3000/api/workspace',{headers,data:{kind:'archive',revision:0,requestId:'isolation-attempt',payload:{id:'private-course'}}});
    expect(attack.status()).toBe(400);
    const own = await a.request.get('http://localhost:3000/api/workspace');
    expect((await own.json()).courses[0].archived).toBe(false);
  } finally { await a.close(); await b.close(); }
});
