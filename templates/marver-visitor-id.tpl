___INFO___

{
  "type": "MACRO",
  "id": "cvt_temp_public_id",
  "version": 1,
  "securityGroups": [],
  "displayName": "Marver — Visitor ID",
  "description": "Returns the value of the dwb_vid cookie set by the Marver SDK. Use to forward the same visitor ID to other tags.",
  "containerContexts": ["WEB"]
}


___TEMPLATE_PARAMETERS___

[]


___SANDBOXED_JS_FOR_WEB_TEMPLATE___

const getCookieValues = require('getCookieValues');
const values = getCookieValues('dwb_vid');
return values && values.length > 0 ? values[0] : '';


___WEB_PERMISSIONS___

[
  {
    "instance": { "key": { "publicId": "get_cookies", "versionId": "1" }, "param": [{ "key": "cookieAccess", "value": { "type": 1, "string": "specific" } }, { "key": "cookieNames", "value": { "type": 2, "listItem": [{ "type": 1, "string": "dwb_vid" }] } }] }
  }
]


___TESTS___

scenarios: []

