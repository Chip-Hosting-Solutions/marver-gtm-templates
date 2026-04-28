# Private Rollout Checklist (per customer)

Use this when onboarding a customer onto the GTM template before Community Gallery submission.

## Before kickoff

- [ ] Customer's Sensor is provisioned and reachable at HTTPS URL
- [ ] Customer's Sensor has CORS configured for the customer's web origin(s)
- [ ] Marver SDK published to `cdn.chip-hosting.com/marver/v1/dwb-analytics.min.js`
- [ ] Smoke-tested SDK loads via direct script tag from the customer's site

## During kickoff (1-hour call)

- [ ] Walk customer through importing both `.tpl` files into their GTM container
- [ ] Configure the Init tag together — set their Sensor URL and Client ID
- [ ] Set up first Event tag together — typically `purchase` or `signup_completed`
- [ ] Test in GTM Preview Mode — confirm events arrive at their Sensor
- [ ] Show the Visitor ID variable in action

## First 48 hours

- [ ] Monitor customer's Sensor logs daily
- [ ] Check event volume matches their expectations (if 5M/day expected and 50K showing up, something's wrong)
- [ ] Customer's Slack/email is open for any quick fixes

## First 2 weeks

- [ ] Weekly check-in call (15 min)
- [ ] Track issues in private GitHub issues (don't make repo public yet if customer is sensitive)
- [ ] Patch SDK bugs same-day; ship via CDN — no template re-publication needed for non-breaking fixes

## After 4-6 weeks of stable operation

- [ ] Pre-Gallery checklist (next phase) → submit to Community Gallery
