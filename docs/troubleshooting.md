# Troubleshooting

## "Init tag fires but no events arrive at my Sensor"

1. **Check Sensor Endpoint URL**: must be HTTPS, must end without trailing slash. Example: `https://analytics.acme.com` ✓
2. **Browser DevTools → Network**: filter for `/collect/batch`. Are POST requests being sent?
   - If no requests: SDK may not be initialized. Enable Debug Mode and check console for `[dwb]` logs.
   - If requests are CORS-blocked: your Sensor needs to accept the origin. Configure CORS in Sensor's `system-config.json`.
3. **Check Sensor logs**: `docker logs dwb-sensor` should show `Received data point` entries.

## "Send Event tag fires but `dwb` is undefined"

The Init tag hasn't loaded yet. Possibilities:
- Init tag's trigger condition doesn't match this page → fix the trigger to **All Pages**
- Init tag is deferred waiting for consent → check `analytics_storage` consent state in DevTools (`gtag('consent', 'default')` config)
- Script load was blocked by CSP → check console for CSP violations; allowlist `cdn.chip-hosting.com` in your `script-src` directive

## "Page views are double-counted"

You probably have **both** Auto-track Page Views ON in Init **and** a separate Send Event tag firing `page_view` on History Change. See [SPA Guide](spa-guide.md). Pick one, not both.

## "Click tracking fires too often / not at all"

- Default selector is `[data-track]` — only elements with `data-track` attribute are tracked
- To track all links and buttons: change selector to `a, button, [role="button"]`
- To track only specific elements: use a more restrictive selector like `[data-track], .track-this`

## "I see [dwb] logs but Sensor never sees the requests"

- The SDK posts to whatever URL you set in **Sensor Endpoint URL**. Double-check it's reachable from the browser (try opening it directly).
- If your Sensor is behind Twingate / VPN, the visitor's browser cannot reach it. Use a public Sensor URL.

## "Marver — Visitor ID variable returns a different value than `dwb.getVisitorId()`"

The variable reads cookies only (`_dwb_id`, `_dwb_vid`, `dwb_vid` — in that order). The SDK has dual persistence and may read its visitor ID from `localStorage._dwb_id` when the cookie is absent. The two diverge in two scenarios:

- **Cross-domain Sensor.** The SDK posts to your Sensor and the Sensor's `Set-Cookie` response sets `_dwb_id`. That cookie only sticks if the Sensor's domain is the same registrable domain as the page (e.g., `sensor.acme.com` ↔ `acme.com`). In Vercel preview deployments — or any setup where the Sensor and app are on different registrable domains — the cookie is dropped, the SDK falls back to localStorage, and the GTM variable returns empty (or the legacy `dwb_vid` if present from an older install).
- **Mid-migration from the legacy `dwb_vid` paste-a-tag install.** The variable returns the legacy ID until the SDK writes a fresh `_dwb_id` cookie. If the SDK is using a cross-domain Sensor (above) it never will, and the variable will keep returning the legacy ID.

To diagnose: run `localStorage.getItem('_dwb_id')` in the console. If that returns a value but `document.cookie` doesn't contain `_dwb_id`, you're hitting the cross-domain case. The fix lives in the SDK (proactively write `_dwb_id` to cookie during `init()`) or in your deployment topology (host the Sensor on a subdomain of the page's domain).

## Getting help

- File an issue: https://github.com/Chip-Hosting-Solutions/marver-gtm-templates/issues
- Include: GTM container ID, browser console output, Network tab screenshot
