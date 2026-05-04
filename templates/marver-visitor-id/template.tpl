___INFO___

{
  "type": "MACRO",
  "id": "cvt_temp_public_id",
  "version": 2,
  "securityGroups": [],
  "displayName": "Marver — Visitor ID",
  "description": "Returns the value of the Marver SDK visitor ID cookie. Use to forward the same visitor ID to other tags. Reads _dwb_id (canonical), _dwb_vid (legacy npm SDK), and dwb_vid (BC tier paste-a-tag) in that order.",
  "containerContexts": ["WEB"]
}


___TEMPLATE_PARAMETERS___

[]


___SANDBOXED_JS_FOR_WEB_TEMPLATE___

// Copyright 2026 Andrew Chepurny / Chip Hosting Solutions
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
// implied. See the License for the specific language governing
// permissions and limitations under the License.

const getCookieValues = require('getCookieValues');

const candidates = ['_dwb_id', '_dwb_vid', 'dwb_vid'];
for (let i = 0; i < candidates.length; i++) {
  const values = getCookieValues(candidates[i]);
  if (values && values.length > 0 && values[0]) return values[0];
}
return '';


___WEB_PERMISSIONS___

[
  {
    "instance": { "key": { "publicId": "get_cookies", "versionId": "1" }, "param": [{ "key": "cookieAccess", "value": { "type": 1, "string": "specific" } }, { "key": "cookieNames", "value": { "type": 2, "listItem": [{ "type": 1, "string": "_dwb_id" }, { "type": 1, "string": "_dwb_vid" }, { "type": 1, "string": "dwb_vid" }] } }] }
  }
]


___TESTS___

scenarios: []

