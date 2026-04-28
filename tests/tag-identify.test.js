import { describe, it, expect, beforeEach } from 'vitest';
import { createMockGTM } from './fixtures/mockGTM.js';
import { runIdentifyMode } from '../src/tag-identify.js';

describe('Identify mode', () => {
  let gtm;

  beforeEach(() => {
    gtm = createMockGTM();
  });

  it('calls dwb.identify directly when SDK initialized', () => {
    gtm.setInWindow('dwb', { identify: () => {}, isInitialized: () => true });
    runIdentifyMode({ userId: 'u_123', traits: { email: 'a@b.com' } }, gtm);
    expect(gtm.callInWindow).toHaveBeenCalledWith('dwb.identify', 'u_123', { email: 'a@b.com' });
  });

  it('queues to dwbq when SDK undefined', () => {
    runIdentifyMode({ userId: 'u_456', traits: { plan: 'pro' } }, gtm);
    expect(gtm.getWindowGlobal('dwbq')).toEqual([['identify', 'u_456', { plan: 'pro' }]]);
  });

  it('handles missing traits gracefully', () => {
    gtm.setInWindow('dwb', { identify: () => {}, isInitialized: () => true });
    runIdentifyMode({ userId: 'u_789' }, gtm);
    expect(gtm.callInWindow).toHaveBeenCalledWith('dwb.identify', 'u_789', {});
  });

  it('calls gtmOnFailure when userId missing', () => {
    runIdentifyMode({}, gtm);
    expect(gtm.gtmOnFailure).toHaveBeenCalled();
  });
});
