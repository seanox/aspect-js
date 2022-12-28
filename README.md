<p>
  <a href="https://github.com/seanox/aspect-js/pulls"
      title="Development is waiting for new issues / requests / ideas">
    <img src="https://img.shields.io/badge/development-passive-blue?style=for-the-badge">
  </a>  
  <a href="https://github.com/seanox/aspect-js/issues">
    <img src="https://img.shields.io/badge/maintenance-active-green?style=for-the-badge">
  </a>
  <a href="http://seanox.de/contact">
    <img src="https://img.shields.io/badge/support-active-green?style=for-the-badge">
  </a>
</p>


# Description
Influenced by the good experiences from JSF (Java Server Faces) with regard to
function and an easy integration into the markup, arose a similar client-side
fullstack solution.

Seanox aspect-js focuses on a minimalist approach to implementing
Single-Page Applications (SPAs). This framework takes the declarative approach
of HTML and extends this with expression language, reactivity rendering with
additional attributes, object/model binding, Model View Controller, Resource
Bundle, NoSQL datasource, test environment and much more.


# Features
- Easy integration in markup and JavaScript (clean code)
- Lightweight implementation (requires no additional frameworks)
- Easy to integrate and combine with other JavaScript frameworks  
  if the frameworks do not do the same or use the same syntax
- Component based architecture
- Modularization (supports imports at the runtime)  
  component concept for smart/automatic loading of composite resources
- Event handling
- Expression Language  
  meta-language extension with full JavaScript support
- Reactivity rendering  
  Rendering reacts to changes in data objects and triggers partial rendering on
  consumers
- Markup rendering  
  supports: condition, custom tags, events, filter, interval, iterate,
  rendering, resources messages, validation, ...
- Markup hardening  
  makes it difficult to manipulate the attributes in the markup  
  non-visible components are removed from the DOM and only reinserted when used  
- Model View Controller (MVC) / Model View ViewModel (MVVM)  
  supports: events, virtual paths, sitemap, permission concept, ...
- Resource Bundle / Resource Messages  
  localization, internationalization (i18n) and text outsourcing 
- NoSQL datasource based on XML  
  lightweight data management for aggregation / projection / transformation
- Test environment  
  for automated unit tests and integration tests
- ... 


# Licence Agreement
Seanox Software Solutions ist ein Open-Source-Projekt, im Folgenden
Seanox Software Solutions oder kurz Seanox genannt.

Diese Software unterliegt der Version 2 der Apache License.

Copyright (C) 2022 Seanox Software Solutions

Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed
under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.


# System Requirement
- ECMAScript 6 support or higher (normally the current browsers)  
  Engines (tested): Blink, Gecko, Goanna, WebKit, ...  
  Browsers used for testing: Basilisk, Firefox, Microsoft Edge, Google Chrome, Safari (MacOS/iOS) 
- Web server for hosting


# Downloads
[Seanox aspect-js 1.4.0](https://github.com/seanox/aspect-js/releases/download/1.4.0/aspect-js-1.4.0.zip)  
[Seanox aspect-js 1.4.0 Sources](https://github.com/seanox/aspect-js/archive/refs/tags/1.4.0.zip)


# Release Channels

## Latest Release
[https://cdn.jsdelivr.net/npm/@seanox/aspect-js/releases/aspect-js.js](https://cdn.jsdelivr.net/npm/@seanox/aspect-js/releases/aspect-js.js)  
[https://cdn.jsdelivr.net/npm/@seanox/aspect-js/releases/aspect-js-min.js](https://cdn.jsdelivr.net/npm/@seanox/aspect-js/releases/aspect-js-min.js)

## Latest Release of Major Version 1.x
[https://cdn.jsdelivr.net/npm/@seanox/aspect-js/releases/aspect-js-1.x.js](https://cdn.jsdelivr.net/npm/@seanox/aspect-js/releases/aspect-js-1.x.js)  
[https://cdn.jsdelivr.net/npm/@seanox/aspect-js/releases/aspect-js-1.x-min.js](https://cdn.jsdelivr.net/npm/@seanox/aspect-js/releases/aspect-js-1.x-min.js)

The release channels continuously provide the newest final major versions, which
are downward compatible to the major version. Seanox aspect-js is always up to
date when using the release channels.


# Manuals
- [DE Getting Started](https://github.com/seanox/aspect-js/blob/master/manual/de/introduction.md#einführung)
- [DE Manual](https://github.com/seanox/aspect-js/blob/master/manual/de#readme)
- [EN Getting Started](https://github.com/seanox/aspect-js/blob/master/manual/en/introduction.md#introduction)
- [EN Manual](https://github.com/seanox/aspect-js/blob/master/manual/en#readme)
- [EN Tutorial + Demo](https://github.com/seanox/aspect-js-tutorial#description)


# Changes
## 1.4.0 20211210
BF: Composite: Correction in the use of attributes  
BF: Composite Expression Language: Line breaks in the expressions are supported  
BF: Composite: Correction for a URL without a file  
BF: DataSource: Correction for a URL without a file  
BF: MVC SiteMap: Correction of the method customize when using variable paths  
BF: Review: Correction/optimization JavaScript (no functional change)  
BF: Test: Correction in determining the browser engine for WebKit and Blink  
CR: Composite Expression Language: Added keywords eeq (===), nee (!==)  
CR: Composite: Added attribute strict for loading of modules/composites  
CR: Extension Namespace: Added method create  
CR: Extension: Added method window.location.combine to combine paths  
CR: License: Changed to Apache License Version 2.0  
CR: Test: Integration of a web server  
CR: Test: Removal of the Edge engine after switching to Chromium  
CR: Test: Removal of the distinction between MacOS and iOS

[Read more](https://raw.githubusercontent.com/seanox/aspect-js/master/CHANGES)


# Contact
[Issues](https://github.com/seanox/aspect-js-tutorial/issues)  
[Requests](https://github.com/seanox/aspect-js-tutorial/pulls)  
[Mail](http://seanox.de/contact)
