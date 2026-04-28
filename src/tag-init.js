const CDN_URL = 'https://cdn.chip-hosting.com/marver/v1/dwb-analytics.min.js';

export function runInitMode(config, gtm) {
  // Idempotent guard: check if dwb already initialized
  const dwb = gtm.copyFromWindow('dwb');
  if (dwb && gtm.callInWindow('dwb.isInitialized')) {
    if (config.debug) gtm.logToConsole('[dwb] already initialized — skipping');
    gtm.gtmOnSuccess();
    return;
  }

  const proceed = () => doInject(config, gtm);

  // Check consent gate
  if (config.waitForConsent && !gtm.isConsentGranted('analytics_storage')) {
    if (config.debug) gtm.logToConsole('[dwb] deferring init — waiting for analytics_storage consent');
    gtm.addConsentListener('analytics_storage', (state) => {
      if (state === 'granted') proceed();
    });
    return; // deferred — gtmOnSuccess fires later when consent grants
  }

  proceed();
}

function doInject(config, gtm) {
  gtm.injectScript(
    CDN_URL,
    () => onScriptLoaded(config, gtm),
    () => {
      if (config.debug) gtm.logToConsole('[dwb] script load failed');
      gtm.gtmOnFailure();
    },
  );
}

function onScriptLoaded(config, gtm) {
  const sdkConfig = {
    endpoint: config.endpoint,
    clientId: config.clientId,
    debug: !!config.debug,
    autoTrack: config.autoTrack || {},
  };
  if (config.cookieDomain) sdkConfig.cookieDomain = config.cookieDomain;

  gtm.callInWindow('dwb.init', sdkConfig);

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
