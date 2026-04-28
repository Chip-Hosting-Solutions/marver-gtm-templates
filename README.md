# Marver — GTM Community Templates

Google Tag Manager templates for Marver — Data Workbench's analytics platform.

## What you get

- **Marver — Tag** (Tag Template): single tag with three modes — Configure, Send Event, Identify User
- **Marver — Visitor ID** (Variable Template): exposes the persistent visitor ID for use in other tags

## Quick install

1. Open your GTM container → **Templates** → **New** → **Tag Template** → **Edit as Code**
2. Paste contents of `templates/marver-tag.tpl`
3. Repeat for Variable Template using `templates/marver-visitor-id.tpl`
4. Create a tag instance, set Mode = "Configure Marver", point at your Sensor URL

Full guide: [docs/installation.md](docs/installation.md)

## Architecture

The template injects `dwb-analytics.min.js` from `cdn.chip-hosting.com/marver/v1/`. Your events flow only to **your** Sensor URL — no third-party data is collected by Marver.

## Status

- v0.1.0 — private template release. Submit issues at GitHub.
- Community Gallery submission planned after 4–6 weeks of soak.
