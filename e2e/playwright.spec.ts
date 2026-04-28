import { test, expect } from '@playwright/test';

// The mock collector endpoint — must be on localhost so the browser can reach it
// and so Playwright's route interception works reliably.
const MOCK_ENDPOINT = 'http://localhost:8766';

test('SDK loads from CDN and fires page_view + click events', async ({ page }) => {
  const events: any[] = [];

  // Intercept all requests to the mock collector (handles /collect and /collect/batch)
  await page.route(`${MOCK_ENDPOINT}/**`, async (route) => {
    const req = route.request();
    let body: any = null;
    try { body = req.postDataJSON(); } catch {}
    events.push({ url: req.url(), body });
    await route.fulfill({ status: 200, body: '{}', contentType: 'application/json' });
  });

  // Inject the endpoint before the page HTML runs
  await page.addInitScript((endpoint: string) => {
    (window as any).ENDPOINT = endpoint;
  }, MOCK_ENDPOINT);

  await page.goto('/test-page.html');
  await page.waitForFunction(() => (window as any).dwb && (window as any).dwb.isInitialized());

  // flushInterval is 100ms — wait generously for the first flush
  await page.waitForTimeout(600);

  const pvEvents = events.filter(e => {
    // SDK batches into { events: [...] } or sends single { eventType: ... }
    if (e.body?.eventType === 'page_view') return true;
    if (Array.isArray(e.body?.events)) {
      return e.body.events.some((ev: any) => ev.eventType === 'page_view');
    }
    return false;
  });
  expect(pvEvents.length).toBeGreaterThanOrEqual(1);

  // Click should fire
  await page.click('#cta');
  await page.waitForTimeout(600);

  const clickEvents = events.filter(e => {
    if (e.body?.eventType === 'click') return true;
    if (Array.isArray(e.body?.events)) {
      return e.body.events.some((ev: any) => ev.eventType === 'click');
    }
    return false;
  });
  expect(clickEvents.length).toBeGreaterThanOrEqual(1);

  // Verify the click event carries the data-track value
  const clickBody = clickEvents[0].body;
  const clickEvent = clickBody?.eventType === 'click'
    ? clickBody
    : clickBody?.events?.find((ev: any) => ev.eventType === 'click');
  expect(clickEvent?.properties?.trackId).toBe('cta');
});
