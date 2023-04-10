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
additional attributes, Model View Controller, view model binding, resource
bundle, NoSQL datasource, test environment and much more.


# Features
- Easy integration in markup and JavaScript (clean code)  
  combinable with other JavaScript frameworks if they don't do the same thing do
  and use a different syntax
- Lightweight implementation  
  requires no additional frameworks
- Component based architecture
- Namespaces and domain concept  
  for better structuring of components, modules and business logic
- Modularization (supports imports at the runtime)  
  component concept for smart/automatic loading of composite resources at runtime
- Event handling
- Expression Language  
  meta-language extension with full JavaScript support
- Reactivity rendering  
  rendering reacts to changes in data objects and triggers partial rendering on
  consumers
- Markup rendering  
  supports: conditions, custom tags, events, filter, interval, iterate,
  rendering, resources messages, validation, ...
- Markup hardening  
  makes it difficult to manipulate the attributes in the markup  
  non-visible components are removed from the DOM and only reinserted when used  
- Model View Controller (MVC) / Model View ViewModel (MVVM)  
  supports view model binding and events
- Sitemap for organizing the view into pages, faces and facets  
  supports virtual paths and permission concepts
- Resource Bundle / Resource Messages  
  internationalization (i18n), localization (l10n) and text outsourcing 
- NoSQL datasource based on XML  
  lightweight data management for aggregation / projection / transformation
- Micro Frontends  
  platform and framework for the implementation of micro-frontends
- Test environment  
  for automated unit tests and integration tests
- ... 


# Licence Agreement
Seanox Software Solutions ist ein Open-Source-Projekt, im Folgenden
Seanox Software Solutions oder kurz Seanox genannt.

Diese Software unterliegt der Version 2 der Apache License.

Copyright (C) 2023 Seanox Software Solutions

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
[Seanox aspect-js 1.6.1](https://github.com/seanox/aspect-js/releases/download/1.6.1/aspect-js-1.6.1.zip)  
[Seanox aspect-js 1.6.1 Sources](https://github.com/seanox/aspect-js/archive/refs/tags/1.6.1.zip)

<p>
  <img src="https://img.shields.io/badge/Blink-tested-green?style=for-the-badge">
  <img src="https://img.shields.io/badge/Gecko-tested-green?style=for-the-badge">
  <img src="https://img.shields.io/badge/Goanna-tested-green?style=for-the-badge">
  <img src="https://img.shields.io/badge/WebKit-tested-green?style=for-the-badge">
</p>


# Release Channels

The release channels continuously provide the latest final versions, so Seanox
aspect-js is always up to date.

## Version 1.6.1

### Standard: Contains all minimized
- https://cdn.jsdelivr.net/npm/@seanox/aspect-js/release/aspect-js.js  
  for testing and deployment

### Standard Max: Contains all
- https://cdn.jsdelivr.net/npm/@seanox/aspect-js/release/aspect-js-max.js  
  not minimized and with comments  
  for development and testing

### Core: Contains all minimized, except the Test API
- https://cdn.jsdelivr.net/npm/@seanox/aspect-js/release/aspect-js-core.js  
  for deployment without Test API

### Core Max: Contains all minimized, except the Test API
- https://cdn.jsdelivr.net/npm/@seanox/aspect-js/release/aspect-js-core-max.js  
  not minimized and with comments  
  for deployment without Test API

### Micro: Contains all minimized, except SiteMap, minimized
- https://cdn.jsdelivr.net/npm/@seanox/aspect-js/release/aspect-js-micro.js  
  for testing and deployment of micro frontends without face-flow

### Micro Max: Contains all minimized, except SiteMap
- https://cdn.jsdelivr.net/npm/@seanox/aspect-js/release/aspect-js-micro-core.js  
  not minimized and with comments  
  for development and testing of micro frontends without face-flow

### Micro Core: Contains all minimized, except the Test API and SiteMap
- https://cdn.jsdelivr.net/npm/@seanox/aspect-js/release/aspect-js-micro-core-max.js  
  for deployment of micro frontends without face-flow and without Test API

### Micro Core Max: Contains all minimized, except the test API and SiteMap
- https://cdn.jsdelivr.net/npm/@seanox/aspect-js/release/aspect-js-micro-max.js  
  not minimized and with comments  
  for development of micro frontends without face-flow and without Test API


# Manuals
- [DE Getting Started](https://github.com/seanox/aspect-js/blob/master/manual/de/introduction.md#einf&uuml;hrung)
- [DE Manual](https://github.com/seanox/aspect-js/tree/master/manual/de#readme)
- [EN Getting Started](https://github.com/seanox/aspect-js/blob/master/manual/en/introduction.md#introduction)
- [EN Manual](https://github.com/seanox/aspect-js/tree/master/manual/en#readme)
- [EN Tutorial + Demo](https://github.com/seanox/aspect-js-tutorial#description)


# Changes
## 1.6.1 20230410  
BF: Composite: Added recursion detection for include of composite markup  
BF: Composite: Correction of validation with message and notification without model  
BF: Composite: Correction of mounting of child elements in a condition  
BF: Composite: Correction of the queue during rendering when a lock exists  
BF: Expression: Unification of the suppressed output  
BF: Reactive: Correction for the use of arrays  
BF: Reactive: Correction/optimization for elements with iterate  
BF: Reactive: Correction of recursive triggered updates  
BF: Review: Optimization and corrections  
BF: Test: Correction of wrong output of Element.prototype.toPlainString()  
CR: Reactive: Optimization of object-model-view decoupling  
CR: Reactive: Refactoring to distinguish from frameworks with similar name  
CR: SiteMap: Inactive by default  
CR: Expression: Extension of the syntax for elements and variables  
CR: Expression: Optimization (consequent new implementation)  
CR: Expression: Omission of automatic use of get and is methods for fields  
CR: Expression: omission of tolerance for undefined parts in object chains (like JSP EL)  
CR: Composite: Errors during rendering are output in the view  
CR: Composite: Renamed method Object.using(...) in Object.use(...)  
CR: Composite: Optimization when loading module resources  
CR: Composite: Extension of the element ID with a unique identifier  
CR: Composite: Added @-attributes as attribute templates for elements  
CR: Composite: Changing the behavior of the validation  
CR: Scripting: Outsourcing and isolating the execution of Composite JavaScript  
CR: Scripting: Optimization macros for Composite JavaScript  
CR: Scripting: Added macro #export for Composite JavaScript  
CR: Scripting: Added macro #use for Composite JavaScript  
CR: Scripting: Added macro (?...) for Composite JavaScript  
CR: Datasource: Optimization when loading module resources  
CR: Messages: Added messages as alternative object tree for associative array Messages  
CR: Messages: Added Messages.customize(label, ...values) to fill placeholders with values  
CR: Namespace: Renamed method Namespace.using(...) in Namespace.use(...)  
CR: Extension: Math.unique(...) replaces Math.uniqueId(...)  
CR: Extension: Math.serial() replaces Math.uniqueSerialId(...)  
CR: Release: Added the manual (de/en) to the release package (zip)  
CR: Release: Channels with major number are omitted  
CR: Release: Revision of the release channels  

[Read more](https://raw.githubusercontent.com/seanox/aspect-js/master/CHANGES)


# Contact
[Issues](https://github.com/seanox/aspect-js-tutorial/issues)  
[Requests](https://github.com/seanox/aspect-js-tutorial/pulls)  
[Mail](http://seanox.de/contact)
