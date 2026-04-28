import { describe, it, expect, beforeEach } from 'vitest';
import { createMockGTM } from './fixtures/mockGTM.js';
import { getVisitorId } from '../src/visitor-id-variable.js';

describe('Visitor ID variable', () => {
  let gtm;

  beforeEach(() => {
    gtm = createMockGTM();
  });

  it('returns dwb_vid cookie value when present', () => {
    gtm.setCookie('dwb_vid', 'v_abc123');
    expect(getVisitorId(gtm)).toBe('v_abc123');
  });

  it('returns empty string when cookie missing', () => {
    expect(getVisitorId(gtm)).toBe('');
  });
});
