# Installation Guide

## Prerequisites

- Google Tag Manager container with edit access
- A running Data Workbench Sensor reachable at an HTTPS URL

## Step-by-step

### 1. Import the templates

In GTM:
1. **Templates** in the left sidebar
2. **New** under **Tag Templates**
3. Click the **⋮** menu → **Edit as Code**
4. Open `templates/marver-tag.tpl` from this repo and copy its contents
5. Paste into the GTM editor → **Save**

Repeat for **Variable Templates** using `templates/marver-visitor-id.tpl`.

### 2. Create the Init tag

1. **Tags** → **New** → choose **Marver — Tag**
2. Set **Mode** = `Configure Marver`
3. Fill in:
   - **Sensor Endpoint URL**: `https://analytics.your-company.com` (your Sensor)
   - **Client ID**: short slug for this site (e.g., `acme-marketing`)
4. Trigger: **All Pages**
5. **Save**

### 3. Create event tags

For each event you want to track:
1. **Tags** → **New** → **Marver — Tag**
2. Set **Mode** = `Send Event`
3. **Event Name**: e.g., `signup_completed`
4. **Event Properties**: add key-value rows (values can reference any GTM variable)
5. Trigger: whatever fires your event (Click, Custom Event, etc.)

### 4. Optional: Identify users

Create one Marver tag with **Mode** = `Identify User`, **User ID** referencing your logged-in user variable. Trigger on whatever event signals login.

### 5. Optional: Use the Visitor ID variable

**Variables** → **New** → **Marver — Visitor ID**. Now reference it in any other tag (e.g., to forward the same ID to a separate tool).

## Verifying

In GTM Preview Mode:
1. Click **Preview** in GTM
2. Enter your site URL
3. Watch the GTM debugger — you should see the Init tag fire on page load (green checkmark)
4. In your browser DevTools, Network tab — see POST requests to your Sensor's `/collect/batch` endpoint
