export function getVisitorId(gtm) {
  const values = gtm.getCookieValues('dwb_vid');
  return values && values.length > 0 ? values[0] : '';
}
