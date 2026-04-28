export function runIdentifyMode(config, gtm) {
  if (!config.userId) {
    gtm.logToConsole('[dwb] identify called without userId');
    gtm.gtmOnFailure();
    return;
  }

  const traits = config.traits || {};
  const dwb = gtm.copyFromWindow('dwb');
  const isReady = dwb && gtm.callInWindow('dwb.isInitialized');

  if (isReady) {
    gtm.callInWindow('dwb.identify', config.userId, traits);
  } else {
    const queue = gtm.copyFromWindow('dwbq') || [];
    queue.push(['identify', config.userId, traits]);
    gtm.setInWindow('dwbq', queue, true);
  }

  gtm.gtmOnSuccess();
}
