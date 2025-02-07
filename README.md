<p>
  <a href="https://github.com/seanox/aspect-js/pulls"
      title="Development is waiting for new issues / requests / ideas"
    ><img src="https://img.shields.io/badge/development-passive-blue?style=for-the-badge"
  ></a>  
  <a href="https://github.com/seanox/aspect-js/issues"
    ><img src="https://img.shields.io/badge/maintenance-active-green?style=for-the-badge"
  ></a>
  <a href="http://seanox.de/contact"
    ><img src="https://img.shields.io/badge/support-active-green?style=for-the-badge"
  ></a>
</p>

# Description
Influenced by the good experiences from JSF (Java Server Faces) with regard to
function and an easy integration into the markup, arose a similar client-side
fullstack solution.

Seanox aspect-js focuses on a minimalist approach to implementing Single-Page
Applications (SPAs) and Micro-Frontends. This framework takes the declarative
approach of HTML and extends this with expression language, reactivity rendering
with additional attributes, Model View Controller, view model binding, events,
interceptors, resource bundle, NoSQL datasource, test environment and much more.

# Features
- Easy integration in markup and JavaScript (clean code)  
  combinable with other JavaScript frameworks if they don't do the same thing do
  and use a different syntax
- Lightweight implementation  
  requires no additional frameworks
- Component based architecture
- Namespaces and domain concept  
  for better structuring of components, modules and business logic
- Modularization (supports macros and imports at the runtime)  
  component concept for smart/automatic loading of composite resources at runtime
- Event handling
- Expression Language  
  meta-language extension with full JavaScript support
- Reactivity rendering  
  rendering reacts to changes in data objects and triggers partial rendering on
  consumers
- Markup rendering  
  supports: conditions, custom tags, events, filter, interval, interceptors,
  iterate, rendering, resources messages, validation, ...
- Markup hardening  
  makes it difficult to manipulate the attributes in the markup  
  non-visible components are removed from the DOM and only reinserted when used  
- Model View Controller (MVC) / Model View ViewModel (MVVM)  
  supports view model binding, events and interceptors 
- Routing to organize the page into views  
  supports paths (routes), interceptors and permission concepts
- Resource Bundle / Resource Messages  
  internationalization (i18n), localization (l10n) and text outsourcing 
- NoSQL datasource based on XML  
  lightweight data management for aggregation / projection / transformation
- Micro-Frontends and Single-Page Applications (SPAs)  
  platform and framework for the implementation of Micro-Frontends and
  Single-Page Applications
- Test environment  
  for automated unit tests and integration tests
- ... 

# Licence Agreement
Seanox Software Solutions ist ein Open-Source-Projekt, im Folgenden
Seanox Software Solutions oder kurz Seanox genannt.

Diese Software unterliegt der Version 2 der Apache License.

Copyright (C) 2025 Seanox Software Solutions

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
- Web server for hosting

# Downloads
<p>
  <img src="https://img.shields.io/badge/Blink-tested-green?style=for-the-badge">
  <img src="https://img.shields.io/badge/Gecko-tested-green?style=for-the-badge">
  <img src="https://img.shields.io/badge/Goanna-tested-green?style=for-the-badge">
  <img src="https://img.shields.io/badge/WebKit-tested-green?style=for-the-badge">
</p>

[Seanox aspect-js 1.8.0](https://github.com/seanox/aspect-js/releases/download/1.8.0/aspect-js-1.8.0.zip)  
[Seanox aspect-js 1.8.0 Sources](https://github.com/seanox/aspect-js/archive/refs/tags/1.8.0.zip)

# Release Channels
The release channels continuously provide the latest final versions, so Seanox
aspect-js is always up to date.

## Version 1.8.0
- https://cdn.jsdelivr.net/npm/@seanox/aspect-js/release/aspect-js.js  
  __for deployment without Test API__

- https://cdn.jsdelivr.net/npm/@seanox/aspect-js/release/aspect-js-max.js  
  __for deployment without Test API__ not minimized and with comments

- https://cdn.jsdelivr.net/npm/@seanox/aspect-js/release/aspect-js-testing.js  
  for development and testing

- https://cdn.jsdelivr.net/npm/@seanox/aspect-js/release/aspect-js-testing-max.js  
  for development and testing not minimized and with comments

# Manuals
- [Getting Started](https://github.com/seanox/aspect-js/blob/master/manual/introduction.md#einf&uuml;hrung)
- [Manual](https://github.com/seanox/aspect-js/tree/master/manual/#readme)
- [Tutorial + Demo](https://github.com/seanox/aspect-js-tutorial#description)

# Changes
## 1.8.0 20250207  
BF: Review: Corrections and optimization  
BF: Test: Correction for the output of messages with timestamp  
BF: Test: Correction of Assert.assertSame(), incorrect implementation  
BF: Composite: Correction of partial rendering of iterate  
CR: Composite: Validation corrections and optimization  
CR: Composite: Added Composite.lookup(selector)  
CR: Composite: Conversion from acceptors to interceptors  
CR: Composite: Conversion to a separate scope page for expression variables  
CR: Extension: Review, corrections and optimization  
CR: Release: Review, corrections and optimization  
CR: Review: Corrections and optimization  
CR: SiteMap: Review, refactoring, corrections and optimization  
CR: Test: Change the start to ant -f development/build.xml run  

[Read more](https://raw.githubusercontent.com/seanox/aspect-js/master/CHANGES)

# Contact
[Issues](https://github.com/seanox/aspect-js-tutorial/issues)  
[Requests](https://github.com/seanox/aspect-js-tutorial/pulls)  
[Mail](http://seanox.com/contact)
