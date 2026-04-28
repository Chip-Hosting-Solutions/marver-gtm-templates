___INFO___

{
  "type": "TAG",
  "id": "cvt_temp_public_id",
  "version": 1,
  "securityGroups": [],
  "displayName": "Marver — Tag",
  "categories": ["ANALYTICS"],
  "brand": {
    "id": "brand_dummy",
    "displayName": "Marver",
    "thumbnail": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
  },
  "description": "Send analytics events to Data Workbench (Marver) — fully self-hosted analytics. Configure once, then fire events from any GTM trigger. Supports Consent Mode v2.",
  "containerContexts": ["WEB"]
}


___TEMPLATE_PARAMETERS___

[
  {
    "type": "SELECT",
    "name": "mode",
    "displayName": "Mode",
    "macrosInSelect": false,
    "selectItems": [
      { "value": "init", "displayValue": "Configure Marver" },
      { "value": "event", "displayValue": "Send Event" },
      { "value": "identify", "displayValue": "Identify User" }
    ],
    "simpleValueType": true,
    "defaultValue": "init"
  },
  {
    "type": "GROUP",
    "name": "connection",
    "displayName": "Connection",
    "groupStyle": "ZIPPY_OPEN",
    "enablingConditions": [
      { "paramName": "mode", "paramValue": "init", "type": "EQUALS" }
    ],
    "subParams": [
      {
        "type": "TEXT",
        "name": "endpoint",
        "displayName": "Sensor Endpoint URL",
        "simpleValueType": true,
        "valueValidators": [
          { "type": "NON_EMPTY" },
          { "type": "REGEX", "args": ["^https://.+"] }
        ]
      },
      {
        "type": "TEXT",
        "name": "clientId",
        "displayName": "Client ID",
        "simpleValueType": true,
        "valueValidators": [
          { "type": "NON_EMPTY" },
          { "type": "REGEX", "args": ["^[a-zA-Z0-9_-]+$"] }
        ]
      }
    ]
  },
  {
    "type": "GROUP",
    "name": "autoTrack",
    "displayName": "Auto-tracking",
    "groupStyle": "ZIPPY_OPEN",
    "enablingConditions": [
      { "paramName": "mode", "paramValue": "init", "type": "EQUALS" }
    ],
    "subParams": [
      { "type": "CHECKBOX", "name": "trackPageView", "checkboxText": "Track Page Views (incl. SPA pushState)", "simpleValueType": true, "defaultValue": true },
      { "type": "LABEL", "name": "spaWarning", "displayName": "⚠ The SDK auto-tracks page views including SPA route changes. Do not create additional GTM tags that send page_view — you'll double-count.", "enablingConditions": [{ "paramName": "trackPageView", "paramValue": true, "type": "EQUALS" }] },
      { "type": "CHECKBOX", "name": "trackClick", "checkboxText": "Track Clicks", "simpleValueType": true, "defaultValue": false },
      { "type": "TEXT", "name": "clickSelector", "displayName": "Click Selector", "simpleValueType": true, "defaultValue": "[data-track]", "enablingConditions": [{ "paramName": "trackClick", "paramValue": true, "type": "EQUALS" }] },
      { "type": "CHECKBOX", "name": "trackForm", "checkboxText": "Track Form Submits", "simpleValueType": true, "defaultValue": false },
      { "type": "TEXT", "name": "formSelector", "displayName": "Form Selector", "simpleValueType": true, "defaultValue": "form", "enablingConditions": [{ "paramName": "trackForm", "paramValue": true, "type": "EQUALS" }] }
    ]
  },
  {
    "type": "GROUP",
    "name": "consent",
    "displayName": "Consent",
    "groupStyle": "ZIPPY_OPEN",
    "enablingConditions": [{ "paramName": "mode", "paramValue": "init", "type": "EQUALS" }],
    "subParams": [
      { "type": "CHECKBOX", "name": "waitForConsent", "checkboxText": "Wait for analytics_storage consent before tracking", "simpleValueType": true, "defaultValue": true }
    ]
  },
  {
    "type": "GROUP",
    "name": "advanced",
    "displayName": "Advanced",
    "groupStyle": "ZIPPY_CLOSED",
    "enablingConditions": [{ "paramName": "mode", "paramValue": "init", "type": "EQUALS" }],
    "subParams": [
      { "type": "TEXT", "name": "cookieDomain", "displayName": "Cookie Domain (optional)", "simpleValueType": true, "defaultValue": "" },
      { "type": "CHECKBOX", "name": "debug", "checkboxText": "Debug Mode (console logs)", "simpleValueType": true, "defaultValue": false }
    ]
  },
  {
    "type": "TEXT", "name": "eventName", "displayName": "Event Name", "simpleValueType": true,
    "valueValidators": [{ "type": "NON_EMPTY" }],
    "enablingConditions": [{ "paramName": "mode", "paramValue": "event", "type": "EQUALS" }]
  },
  {
    "type": "PARAM_TABLE", "name": "eventProperties", "displayName": "Event Properties",
    "paramTableColumns": [
      { "param": { "type": "TEXT", "name": "key", "simpleValueType": true }, "isUnique": true },
      { "param": { "type": "TEXT", "name": "value", "simpleValueType": true }, "isUnique": false }
    ],
    "enablingConditions": [{ "paramName": "mode", "paramValue": "event", "type": "EQUALS" }]
  },
  {
    "type": "TEXT", "name": "userId", "displayName": "User ID", "simpleValueType": true,
    "valueValidators": [{ "type": "NON_EMPTY" }],
    "enablingConditions": [{ "paramName": "mode", "paramValue": "identify", "type": "EQUALS" }]
  },
  {
    "type": "PARAM_TABLE", "name": "userTraits", "displayName": "User Traits",
    "paramTableColumns": [
      { "param": { "type": "TEXT", "name": "key", "simpleValueType": true }, "isUnique": true },
      { "param": { "type": "TEXT", "name": "value", "simpleValueType": true }, "isUnique": false }
    ],
    "enablingConditions": [{ "paramName": "mode", "paramValue": "identify", "type": "EQUALS" }]
  }
]


___SANDBOXED_JS_FOR_WEB_TEMPLATE___

// HAND-SYNCED FROM src/tag-init.js, src/tag-send-event.js, src/tag-identify.js
// When updating, copy the corresponding logic from those source files.

const copyFromWindow = require('copyFromWindow');
const setInWindow = require('setInWindow');
const callInWindow = require('callInWindow');
const injectScript = require('injectScript');
const isConsentGranted = require('isConsentGranted');
const addConsentListener = require('addConsentListener');
const logToConsole = require('logToConsole');

const CDN_URL = 'https://cdn.chip-hosting.com/marver/v1/dwb-analytics.min.js';

function tableToObject(table) {
  const out = {};
  if (!table) return out;
  for (let i = 0; i < table.length; i++) {
    if (table[i].key) out[table[i].key] = table[i].value;
  }
  return out;
}

if (data.mode === 'init') {
  const config = {
    endpoint: data.endpoint,
    clientId: data.clientId,
    debug: !!data.debug,
    cookieDomain: data.cookieDomain || '',
    waitForConsent: !!data.waitForConsent,
    autoTrack: {
      pageView: !!data.trackPageView,
      click: !!data.trackClick,
      formSubmit: !!data.trackForm,
      selectors: {
        click: data.clickSelector || undefined,
        form: data.formSelector || undefined
      }
    }
  };

  const dwb = copyFromWindow('dwb');
  if (dwb && callInWindow('dwb.isInitialized')) {
    if (config.debug) logToConsole('[dwb] already initialized — skipping');
    data.gtmOnSuccess();
  } else {
    const proceed = function () {
      injectScript(CDN_URL, function () {
        const sdkConfig = {
          endpoint: config.endpoint,
          clientId: config.clientId,
          debug: config.debug,
          autoTrack: config.autoTrack
        };
        if (config.cookieDomain) sdkConfig.cookieDomain = config.cookieDomain;
        callInWindow('dwb.init', sdkConfig);

        // Snapshot existing queue, install shim, then drain.
        const queue = copyFromWindow('dwbq') || [];
        setInWindow('dwbq', { push: function (call) {
          callInWindow('dwb.' + call[0], call[1], call[2], call[3]);
        }}, true);
        for (let i = 0; i < queue.length; i++) {
          const call = queue[i];
          if (call && call.length > 0) callInWindow('dwb.' + call[0], call[1], call[2], call[3]);
        }
        data.gtmOnSuccess();
      }, function () {
        if (config.debug) logToConsole('[dwb] script load failed');
        data.gtmOnFailure();
      });
    };

    if (config.waitForConsent && !isConsentGranted('analytics_storage')) {
      if (config.debug) logToConsole('[dwb] deferring init — waiting for analytics_storage consent');
      addConsentListener('analytics_storage', function (state) { if (state === 'granted') proceed(); });
    } else {
      proceed();
    }
  }
} else if (data.mode === 'event') {
  const props = tableToObject(data.eventProperties);
  const dwb2 = copyFromWindow('dwb');
  const ready = dwb2 && callInWindow('dwb.isInitialized');
  if (ready) {
    callInWindow('dwb.track', data.eventName, props);
  } else {
    const queue2 = copyFromWindow('dwbq') || [];
    queue2.push(['track', data.eventName, props]);
    setInWindow('dwbq', queue2, true);
  }
  data.gtmOnSuccess();
} else if (data.mode === 'identify') {
  if (!data.userId) {
    logToConsole('[dwb] identify called without userId');
    data.gtmOnFailure();
  } else {
    const traits = tableToObject(data.userTraits);
    const dwb3 = copyFromWindow('dwb');
    const ready3 = dwb3 && callInWindow('dwb.isInitialized');
    if (ready3) {
      callInWindow('dwb.identify', data.userId, traits);
    } else {
      const queue3 = copyFromWindow('dwbq') || [];
      queue3.push(['identify', data.userId, traits]);
      setInWindow('dwbq', queue3, true);
    }
    data.gtmOnSuccess();
  }
}


___WEB_PERMISSIONS___

[
  {
    "instance": { "key": { "publicId": "inject_script", "versionId": "1" }, "param": [{ "key": "urls", "value": { "type": 2, "listItem": [{ "type": 1, "string": "https://cdn.chip-hosting.com/marver/v1/dwb-analytics.min.js" }] } }] }
  },
  {
    "instance": { "key": { "publicId": "access_globals", "versionId": "1" }, "param": [{ "key": "keys", "value": { "type": 2, "listItem": [
      { "type": 3, "mapKey": [{"type":1,"string":"key"},{"type":1,"string":"read"},{"type":1,"string":"write"},{"type":1,"string":"execute"}], "mapValue":[{"type":1,"string":"dwb"},{"type":8,"boolean":true},{"type":8,"boolean":true},{"type":8,"boolean":true}] },
      { "type": 3, "mapKey": [{"type":1,"string":"key"},{"type":1,"string":"read"},{"type":1,"string":"write"},{"type":1,"string":"execute"}], "mapValue":[{"type":1,"string":"dwbq"},{"type":8,"boolean":true},{"type":8,"boolean":true},{"type":8,"boolean":false}] }
    ] } }] }
  },
  {
    "instance": { "key": { "publicId": "read_consent_state", "versionId": "1" }, "param": [{ "key": "consentTypes", "value": { "type": 2, "listItem": [{ "type": 1, "string": "analytics_storage" }] } }] }
  },
  {
    "instance": { "key": { "publicId": "subscribe_to_consent_state", "versionId": "1" }, "param": [{ "key": "consentTypes", "value": { "type": 2, "listItem": [{ "type": 1, "string": "analytics_storage" }] } }] }
  },
  {
    "instance": { "key": { "publicId": "logging", "versionId": "1" }, "param": [{ "key": "environments", "value": { "type": 1, "string": "all" } }] }
  }
]


___TESTS___

scenarios: []

