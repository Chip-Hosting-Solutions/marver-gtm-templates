import { describe, it, expect, beforeEach } from 'vitest';
import { createMockGTM } from './fixtures/mockGTM.js';
import { runSendEventMode } from '../src/tag-send-event.js';

describe('Send Event mode', () => {
  let gtm;

  beforeEach(() => {
    gtm = createMockGTM();
  });

  it('calls dwb.track directly when SDK initialized', () => {
    gtm.setInWindow('dwb', { track: () => {}, isInitialized: () => true });
    runSendEventMode({ eventName: 'purchase', properties: { sku: 'X-1' } }, gtm);
    expect(gtm.callInWindow).toHaveBeenCalledWith('dwb.track', 'purchase', { sku: 'X-1' });
    expect(gtm.gtmOnSuccess).toHaveBeenCalled();
  });

  it('queues to dwbq when SDK undefined', () => {
    runSendEventMode({ eventName: 'click', properties: { id: 'cta' } }, gtm);
    const queue = gtm.getWindowGlobal('dwbq');
    expect(queue).toEqual([['track', 'click', { id: 'cta' }]]);
    expect(gtm.gtmOnSuccess).toHaveBeenCalled();
  });

  it('queues to dwbq when SDK loaded but not initialized', () => {
    gtm.setInWindow('dwb', { track: () => {}, isInitialized: () => false });
    runSendEventMode({ eventName: 'view', properties: {} }, gtm);
    const queue = gtm.getWindowGlobal('dwbq');
    expect(queue).toEqual([['track', 'view', {}]]);
  });

  it('appends to existing dwbq queue', () => {
    gtm.setInWindow('dwbq', [['track', 'a', {}]]);
    runSendEventMode({ eventName: 'b', properties: {} }, gtm);
    expect(gtm.getWindowGlobal('dwbq')).toEqual([
      ['track', 'a', {}],
      ['track', 'b', {}],
    ]);
  });

  it('handles missing properties gracefully (defaults to empty)', () => {
    gtm.setInWindow('dwb', { track: () => {}, isInitialized: () => true });
    runSendEventMode({ eventName: 'tick' }, gtm);
    expect(gtm.callInWindow).toHaveBeenCalledWith('dwb.track', 'tick', {});
  });
});
