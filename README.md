<p>
  <a href="https://github.com/seanox/aspect-js/pulls">
    <img src="https://img.shields.io/badge/development-active-green?style=for-the-badge">
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
- Modularization (supports macros and imports at the runtime)  
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
- Routing to organize the page into views  
  supports paths (routes), interceptors and permission concepts
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

[Seanox aspect-js 1.7.0](https://github.com/seanox/aspect-js/releases/download/1.7.0/aspect-js-1.7.0.zip)  
[Seanox aspect-js 1.7.0 Sources](https://github.com/seanox/aspect-js/archive/refs/tags/1.7.0.zip)


# Release Channels

The release channels continuously provide the latest final versions, so Seanox
aspect-js is always up to date.

## Version 1.7.0

### Standard: Contains all minimized
- https://cdn.jsdelivr.net/npm/@seanox/aspect-js/release/aspect-js.js  
  for testing and deployment

### Standard Max: Contains all
- https://cdn.jsdelivr.net/npm/@seanox/aspect-js/release/aspect-js-max.js  
  for development and testing __not minimized and with comments__

### Core: Contains all minimized, except the Test API
- https://cdn.jsdelivr.net/npm/@seanox/aspect-js/release/aspect-js-core.js  
  for deployment without Test API

### Core Max: Contains all minimized, except the Test API
- https://cdn.jsdelivr.net/npm/@seanox/aspect-js/release/aspect-js-core-max.js  
  for deployment without Test API __not minimized and with comments__


# Manuals
- [Getting Started](https://github.com/seanox/aspect-js/blob/master/manual/introduction.md#einf&uuml;hrung)
- [Manual](https://github.com/seanox/aspect-js/tree/master/manual/#readme)
- [Tutorial + Demo](https://github.com/seanox/aspect-js-tutorial#description)


# Changes
## 1.7.0 20241228  
BF: Composite: Correction from mounting (dock/undock) composites with namespace  
BF: Composite: Correction when inserting markup into composites  
BF: Composite: Correction when loading CSS modules  
BF: Composite: Correction of the view model binding  
BF: Composite Mount Events: Correction of the unwanted assignment of child elements  
BF: Reactive: Correction of incorrect creation of proxies for HTML elements  
BF: Reactive: Correction of unwanted rendering when docking modules  
CR: Composite: Omission of the attribute namespace  
CR: Composite: Omission of attributes strict in combination with composite  
CR: Composite: Added EVENT_MODULE_LOAD when a module is loaded  
CR: Composite: Added EVENT_MODULE_DOCK/EVENT_MODULE_READY/EVENT_MODULE_UNDOCK  
CR: Composite Render Iterate: Optimization for updating markup  
CR: Composite Render Iterate: Optimization of the error output in the view  
CR: Composite Render Condition: Optimization of the error output in the view  
CR: Composite Render: Optimization of IDs before rendering  
CR: Datasource: Optimization of language selection  
CR: Documentation: Reduction to English  
CR: Expression: Optimization of the return of errors  
CR: Expression: Extension of the element expression by //...// for embedding logic  
CR: Expression: Optimization when interpreting in combination with text  
CR: Messages: Change in case of multiple keys, the first one wins  
CR: Messages: Added locales/messages for modules  
CR: Test: Update web server to version 5.7.1  

[Read more](https://raw.githubusercontent.com/seanox/aspect-js/master/CHANGES)


# Contact
[Issues](https://github.com/seanox/aspect-js-tutorial/issues)  
[Requests](https://github.com/seanox/aspect-js-tutorial/pulls)  
[Mail](http://seanox.com/contact)
