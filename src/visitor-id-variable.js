// Reads the visitor ID cookie set by the Marver SDK.
//
// Cookie precedence (matches SDK CookieManager fallback order):
//   1. _dwb_id   — canonical (server-set, npm SDK + GTM-installed SDK)
//   2. _dwb_vid  — legacy (older npm SDK versions)
//   3. dwb_vid   — BC tier (dwb.min.js paste-a-tag installs)
//
// Returns empty string if none are set.
export function getVisitorId(gtm) {
  const candidates = ['_dwb_id', '_dwb_vid', 'dwb_vid'];
  for (const name of candidates) {
    const values = gtm.getCookieValues(name);
    if (values && values.length > 0 && values[0]) return values[0];
  }
  return '';
}
