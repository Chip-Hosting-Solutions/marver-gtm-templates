// tests/fixtures/mockGTM.js
// Mock harness for GTM sandboxed-JS template APIs.
// Runs the template logic in a controlled test environment.

import { vi } from 'vitest';

export function createMockGTM(initial = {}) {
  const windowGlobals = { ...initial.windowGlobals };
  const cookies = { ...initial.cookies };
  const consent = { analytics_storage: 'granted', ...initial.consent };
  const consentListeners = [];
  const injectedScripts = [];
  const logs = [];
  let injectScriptCallback = null;

  const api = {
    // GTM sandbox APIs
    copyFromWindow: vi.fn((name) => windowGlobals[name]),
    setInWindow: vi.fn((name, value, override) => {
      if (override || !(name in windowGlobals)) windowGlobals[name] = value;
      return true;
    }),
    callInWindow: vi.fn((path, ...args) => {
      const parts = path.split('.');
      let target = windowGlobals;
      let context = windowGlobals;
      for (const part of parts) {
        if (!target) return undefined;
        context = target;
        target = target[part];
      }
      return typeof target === 'function' ? target.apply(context, args) : target;
    }),
    injectScript: vi.fn((url, onSuccess, onFailure) => {
      injectedScripts.push(url);
      injectScriptCallback = { onSuccess, onFailure };
    }),
    getCookieValues: vi.fn((name) => (cookies[name] !== undefined ? [cookies[name]] : [])),
    isConsentGranted: vi.fn((type) => consent[type] === 'granted'),
    addConsentListener: vi.fn((type, listener) => {
      consentListeners.push({ type, listener });
    }),
    logToConsole: vi.fn((...args) => logs.push(args)),
    gtmOnSuccess: vi.fn(),
    gtmOnFailure: vi.fn(),

    // Test helpers (not part of GTM API)
    triggerInjectSuccess: () => injectScriptCallback?.onSuccess?.(),
    triggerInjectFailure: () => injectScriptCallback?.onFailure?.(),
    grantConsent: (type) => {
      consent[type] = 'granted';
      consentListeners
        .filter((l) => l.type === type)
        .forEach((l) => l.listener('granted'));
    },
    setCookie: (name, value) => { cookies[name] = value; },
    getInjectedScripts: () => injectedScripts,
    getLogs: () => logs,
    getWindowGlobal: (name) => windowGlobals[name],
  };

  return api;
}
