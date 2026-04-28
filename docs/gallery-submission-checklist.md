# Community Gallery Submission Checklist

Run this checklist before submitting templates to GTM Community Gallery. Submission process docs: https://developers.google.com/tag-platform/tag-manager/templates/gallery

## Code

- [ ] All sandboxed-JS unit tests pass: `npm test`
- [ ] All Playwright E2E tests pass: `npm run test:e2e`
- [ ] CDN URL in templates' `inject_script` permission is the canonical (non-placeholder) URL
- [ ] Permissions block declares only what's actually used
- [ ] No `console.log` in sandboxed code without `data.debug` gating

## Manual smoke tests

- [ ] Test in Chrome — Init + Send Event + Identify all work
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test consent denied → granted flow
- [ ] Test SPA navigation auto-page-view

## Documentation

- [ ] README has install screenshots
- [ ] Consent Mode guide written
- [ ] SPA guide written
- [ ] Troubleshooting guide covers top 5 customer issues
- [ ] Privacy summary in template `description` field clearly states "events flow only to customer's configured endpoint"

## Versioning

- [ ] Template internal version field bumped (in `___INFO___` block: `"version": N`)
- [ ] CHANGELOG.md updated
- [ ] GitHub release tagged: `git tag v1.0.0 && git push --tags`

## Real-world soak

- [ ] At least one paying customer has been on the private template for ≥ 4 weeks
- [ ] No critical bugs reported in the last 2 weeks
- [ ] CDN uptime ≥ 99.9% (Cloudflare R2 status page)

## Submission

- [ ] GitHub repo is public
- [ ] `repository.url` field added to template's `___INFO___`
- [ ] Submit via GTM dashboard: **Community Template Gallery** → **Submit** → paste GitHub URL
- [ ] Respond to Google reviewer feedback within 3 business days

## Post-submission

- [ ] Once approved, listed at `https://tagmanager.google.com/gallery/`
- [ ] Update README with Gallery install link
- [ ] Announce on Chip Hosting blog / LinkedIn
