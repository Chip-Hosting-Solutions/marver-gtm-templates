import { describe, it, expect, beforeEach } from 'vitest';
import { createMockGTM } from './fixtures/mockGTM.js';
import { getVisitorId } from '../src/visitor-id-variable.js';

describe('Visitor ID variable', () => {
  let gtm;

  beforeEach(() => { gtm = createMockGTM(); });

  it('returns _dwb_id cookie value when present (canonical)', () => {
    gtm.setCookie('_dwb_id', 'pv_abc123');
    expect(getVisitorId(gtm)).toBe('pv_abc123');
  });

  it('falls back to _dwb_vid when _dwb_id missing', () => {
    gtm.setCookie('_dwb_vid', 'v_legacy_npm');
    expect(getVisitorId(gtm)).toBe('v_legacy_npm');
  });

  it('falls back to dwb_vid (BC tier) when both _dwb_id and _dwb_vid missing', () => {
    gtm.setCookie('dwb_vid', 'v_bc_tier');
    expect(getVisitorId(gtm)).toBe('v_bc_tier');
  });

  it('prefers _dwb_id over _dwb_vid when both present', () => {
    gtm.setCookie('_dwb_id', 'pv_canonical');
    gtm.setCookie('_dwb_vid', 'v_legacy');
    expect(getVisitorId(gtm)).toBe('pv_canonical');
  });

  it('returns empty string when no visitor cookies set', () => {
    expect(getVisitorId(gtm)).toBe('');
  });
});
