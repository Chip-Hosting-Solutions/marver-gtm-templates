import { describe, it, expect, beforeEach } from 'vitest';
import { createMockGTM } from './fixtures/mockGTM.js';
import { runInitMode } from '../src/tag-init.js';

const CDN_URL = 'https://cdn.chip-hosting.com/marver/v1/dwb-analytics.min.js';

describe('Init mode (Configure Marver)', () => {
  let gtm;
  let baseConfig;

  beforeEach(() => {
    gtm = createMockGTM();
    baseConfig = {
      endpoint: 'https://analytics.acme.com',
      clientId: 'acme-web',
      autoTrack: { pageView: true, click: false, formSubmit: false },
      waitForConsent: true,
      cookieDomain: '',
      debug: false,
    };
  });

  it('injects SDK script from canonical CDN URL', () => {
    runInitMode(baseConfig, gtm);
    expect(gtm.injectScript).toHaveBeenCalledWith(CDN_URL, expect.any(Function), expect.any(Function));
  });

  it('calls dwb.init with normalized config after script loads', () => {
    runInitMode(baseConfig, gtm);
    gtm.setInWindow('dwb', { init: () => {}, isInitialized: () => true });
    gtm.triggerInjectSuccess();
    expect(gtm.callInWindow).toHaveBeenCalledWith(
      'dwb.init',
      expect.objectContaining({ endpoint: 'https://analytics.acme.com', clientId: 'acme-web' })
    );
  });

  it('drains window.dwbq queue after init', () => {
    gtm.setInWindow('dwbq', [['track', 'early_event', { foo: 'bar' }]]);
    runInitMode(baseConfig, gtm);
    gtm.setInWindow('dwb', { init: () => {}, track: () => {}, isInitialized: () => true });
    gtm.triggerInjectSuccess();
    expect(gtm.callInWindow).toHaveBeenCalledWith('dwb.track', 'early_event', { foo: 'bar' });
  });

  it('skips init when dwb already initialized (idempotent)', () => {
    gtm.setInWindow('dwb', { init: () => {}, isInitialized: () => true });
    runInitMode(baseConfig, gtm);
    expect(gtm.injectScript).not.toHaveBeenCalled();
    expect(gtm.gtmOnSuccess).toHaveBeenCalled();
  });

  it('defers init when consent denied + waitForConsent on', () => {
    gtm = createMockGTM({ consent: { analytics_storage: 'denied' } });
    runInitMode(baseConfig, gtm);
    expect(gtm.injectScript).not.toHaveBeenCalled();
    expect(gtm.addConsentListener).toHaveBeenCalledWith('analytics_storage', expect.any(Function));
  });

  it('proceeds when consent denied but waitForConsent off', () => {
    gtm = createMockGTM({ consent: { analytics_storage: 'denied' } });
    runInitMode({ ...baseConfig, waitForConsent: false }, gtm);
    expect(gtm.injectScript).toHaveBeenCalled();
  });

  it('runs deferred init when consent transitions denied → granted', () => {
    gtm = createMockGTM({ consent: { analytics_storage: 'denied' } });
    runInitMode(baseConfig, gtm);
    gtm.grantConsent('analytics_storage');
    expect(gtm.injectScript).toHaveBeenCalled();
  });

  it('calls gtmOnFailure when injectScript fails', () => {
    runInitMode(baseConfig, gtm);
    gtm.triggerInjectFailure();
    expect(gtm.gtmOnFailure).toHaveBeenCalled();
  });
});
