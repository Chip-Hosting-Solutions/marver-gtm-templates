# Single Page Application (SPA) Guide

The Marver SDK has built-in SPA support — you don't need to do anything special for React, Vue, Angular, or Next.js apps.

## What's automatic

- **Initial page load**: `page_view` fires immediately
- **SPA route changes**: SDK hooks `history.pushState` and the `popstate` event, fires `page_view` automatically with the new path

## What to avoid

⚠ **Do not create a separate GTM tag that fires `page_view` on a History Change trigger.** You'll double-count.

If you've turned **off** Auto-track Page Views in the Marver Init tag and want to handle page-views manually via GTM:
1. Disable Marver's auto page-view (uncheck **Track Page Views** in Init tag)
2. Create a GTM trigger of type **History Change**
3. Create a Marver Send Event tag with **Event Name** = `page_view`, attached to the History Change trigger

## Long-lived sessions

In SPAs where users keep tabs open for hours, the session ID (`dwb_sid`) rotates after 30 minutes of inactivity. The visitor ID (`dwb_vid`) is stable for 2 years.
