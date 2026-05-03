const CDN_URL = 'https://cdn.chip-hosting.com/marver/v1/dwb-analytics.min.js';

export function runInitMode(config, gtm) {
  // Always-on entry log: surfaces the loader's path even when debug is off.
  // Without this, every failure mode (deferred, idempotent skip, init throw)
  // is invisible from the page console.
  gtm.logToConsole('[dwb] init mode: clientId=', config.clientId, 'waitForConsent=', !!config.waitForConsent);

  // Idempotent guard: check if dwb already initialized
  const dwb = gtm.copyFromWindow('dwb');
  if (dwb && gtm.callInWindow('dwb.isInitialized')) {
    gtm.logToConsole('[dwb] already initialized — skipping');
    gtm.gtmOnSuccess();
    return;
  }

  const proceed = () => doInject(config, gtm);

  // Check consent gate
  if (config.waitForConsent && !gtm.isConsentGranted('analytics_storage')) {
    gtm.logToConsole('[dwb] deferring init — waiting for analytics_storage consent');
    gtm.addConsentListener('analytics_storage', (state) => {
      if (state === 'granted') proceed();
    });
    return; // deferred — gtmOnSuccess fires later when consent grants
  }

  proceed();
}

function doInject(config, gtm) {
  gtm.logToConsole('[dwb] injecting SDK from', CDN_URL);
  gtm.injectScript(
    CDN_URL,
    () => onScriptLoaded(config, gtm),
    () => {
      gtm.logToConsole('[dwb] script load failed');
      gtm.gtmOnFailure();
    },
  );
}

function onScriptLoaded(config, gtm) {
  gtm.logToConsole('[dwb] script loaded, calling dwb.init');

  const sdkConfig = {
    endpoint: config.endpoint,
    clientId: config.clientId,
    debug: !!config.debug,
    autoTrack: config.autoTrack || {},
  };
  if (config.cookieDomain) sdkConfig.cookieDomain = config.cookieDomain;

  try {
    gtm.callInWindow('dwb.init', sdkConfig);
    gtm.logToConsole('[dwb] dwb.init returned, isInitialized=', gtm.callInWindow('dwb.isInitialized'));
  } catch (e) {
    gtm.logToConsole('[dwb] dwb.init threw:', e);
    gtm.gtmOnFailure();
    return;
  }

  // Snapshot the existing queue, then install the shim before draining
  // so any concurrent pushes during drain go through the shim, not the
  // stranded array.
  const queue = gtm.copyFromWindow('dwbq') || [];
  gtm.setInWindow('dwbq', { push: function (call) {
    gtm.callInWindow('dwb.' + call[0], ...call.slice(1));
  }}, true);

  // Drain the snapshotted queue
  for (const call of queue) {
    if (Array.isArray(call) && call.length > 0) {
      gtm.callInWindow('dwb.' + call[0], ...call.slice(1));
    }
  }

  gtm.gtmOnSuccess();
}
