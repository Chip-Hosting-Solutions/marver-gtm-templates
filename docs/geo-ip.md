# Geo-IP & Forwarding the Visitor IP

Marver can enrich events with **coarse geography** — country, region, city, and approximate latitude/longitude — derived from the visitor's IP address. This powers the **Globe** and any geography-based reporting. For it to work, your **Sensor** must receive the visitor's real public IP.

> **Nothing to configure in the GTM template.** A web template runs in the browser, which cannot read or set its own IP (`X-Forwarded-For` is a [forbidden header](https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_header_name) — the browser won't let JavaScript set it). IP handling is entirely a **Sensor / infrastructure** concern. This page documents that path; you don't edit the tag.

## How it works

1. The template injects the SDK, which sends events directly from the visitor's browser to **your** Sensor URL (the `endpoint` you set on the "Configure Marver" tag).
2. Because the browser connects to the Sensor directly, the visitor's public IP is simply the **source address of that request**.
3. The Sensor resolves that IP to coarse geography (offline, via a GeoLite2 database) and **stamps `geo_country` / `geo_region` / `geo_city` / `geo_lat` / `geo_lng`** on the event.
4. The **raw IP is never stored** — it is used only to derive geography and is then stripped. Resolution is consent-gated (see [Consent Mode](./consent-mode.md)): when consent is denied, no IP is forwarded and no geography is resolved.

How the Sensor reads the IP: it uses the **first entry of the `X-Forwarded-For` header** if present, otherwise the connection's remote address (`req.ip`).

## The one requirement: the Sensor must see the real client IP

### Direct (no proxy in front of the Sensor)
If the browser reaches the Sensor directly, geo works **out of the box** — the connection's remote address *is* the visitor's IP. No configuration needed.

### Behind a proxy / CDN / load balancer
If your Sensor sits behind Cloudflare, nginx, an AWS ALB/ELB, Fastly, a Kubernetes ingress, etc., that hop terminates the visitor's connection — so the Sensor would otherwise see the **proxy's** IP, not the visitor's. The proxy must forward the visitor's IP in **`X-Forwarded-For`**, with the **original client as the first entry** (the standard `client, proxy1, proxy2` ordering). The Sensor reads that first entry.

Most proxies do this automatically, but verify it's enabled and not stripped:

| Proxy | What to set |
|-------|-------------|
| **nginx** | `proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;` |
| **Cloudflare** | Sends `CF-Connecting-IP` and appends `X-Forwarded-For` automatically — ensure no Transform Rule removes them. |
| **AWS ALB / ELB** | Adds `X-Forwarded-For` automatically (client first). No action needed. |
| **HAProxy** | `option forwardfor` |
| **Apache (mod_proxy)** | Adds `X-Forwarded-For` automatically. |

## What prevents geo (troubleshooting)

- **A proxy that strips `X-Forwarded-For`, or replaces the source with its own IP.** Every event then resolves to the proxy's location (or null). Fix the proxy config above.
- **Private / loopback / internal addresses** — `127.0.0.1`, `10.x`, `172.16–31.x`, `192.168.x`. These have no public geography, so `geo_*` is null. This is why **local testing shows no geo**, and why a Sensor that only ever sees an internal load-balancer IP resolves nothing.
- **No GeoLite2 database provisioned on the Sensor side.** Geo is off until an operator provisions a GeoLite2-City database and enables it (see the Marver Sensor/FSU docs — "Provisioning the GeoLite2 database"). With no database, events are still collected; they just carry null geography.
- **VPNs / mobile carriers / corporate proxies on the visitor's side** skew results. GeoLite2 is coarse and IP-based — fine for a distribution globe ("where, roughly"), not for precision.

## Verifying

Send a test hit with a known public IP and confirm the geography resolves. From a shell that can reach your Sensor:

```bash
curl -sS -X POST "https://<your-sensor-host>/collect" \
  -H "Content-Type: application/json" \
  -H "X-Client-ID: <your-clientId>" \
  -H "X-Forwarded-For: 8.8.8.8" \
  -d '{"eventType":"page_view","properties":{"page":"/geo-test"}}'
```

`8.8.8.8` should resolve to the United States. Then confirm `geo_country` (and the other `geo_*` columns) are populated on the event in your Marver dataset. In a real browser session there is no need to send the header — the visitor's IP arrives naturally; the header is only for this synthetic check (and for proxies, which set it for you).

## Privacy summary

- The raw IP is **transient** — used to derive coarse geography, then discarded; it is never persisted.
- Resolution is **consent-gated** — denied consent ⇒ no IP forwarded, no geography.
- The browser/template **cannot** set or spoof the IP; it is governed entirely by the network path to your Sensor and your Sensor's configuration.
