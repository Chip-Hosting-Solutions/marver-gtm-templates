export function runSendEventMode(config, gtm) {
  const props = config.properties || {};
  const dwb = gtm.copyFromWindow('dwb');
  const isReady = dwb && gtm.callInWindow('dwb.isInitialized');

  if (isReady) {
    gtm.callInWindow('dwb.track', config.eventName, props);
  } else {
    const queue = gtm.copyFromWindow('dwbq') || [];
    queue.push(['track', config.eventName, props]);
    gtm.setInWindow('dwbq', queue, true);
  }
  gtm.gtmOnSuccess();
}
