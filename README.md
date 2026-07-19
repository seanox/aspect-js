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
Influenced by the good experiences from JSF (JavaServer Faces) with regard to
function and an easy integration into the markup, arose a similar client-side
application runtime.

The separation of web applications into frontend and backend, together with
browser-based applications and distributed services, changed the structure of
client-side applications. Seanox aspect-js investigates the application of
concepts derived from JavaServer Faces (JSF) and microservices to browser-based
applications, including declarative markup, component structures, view-model
binding and modular resources.

Seanox aspect-js focuses on a minimalist approach to implementing Single-Page
Applications (SPAs) and Micro-Frontends. This application runtime extends the
declarative nature of HTML with expression language, reactive rendering,
additional declarative attributes, Model-View-Controller (MVC), view-model
binding, events, interceptors, resource bundles, an immutable XML data source,
an integrated test environment, and more.

__Recommendations for UI frameworks:__
- https://bulma.io/
- https://picocss.com/
- https://vanillaframework.io/
- https://fomantic-ui.com/
- https://getbootstrap.com/
- https://getuikit.com/

# Features
- __Easy Integration in Markup and JavaScript (Clean Code)__ Combinable with
  other JavaScript frameworks if they don't do the same thing and use a
  different syntax.
- __Lightweight Implementation__ Requires no additional frameworks.
- __Component-Based Architecture__
- __Namespaces and Domain Concept__ For better structuring of components,
  modules, and business logic.
- __Modularization (Supports Macros and Imports at Runtime)__ Component concept 
  for smart/automatic loading of composite resources at runtime.
- __Event Handling__
- __Expression Language__ Extension of the markup language with support for
  JavaScript expressions.
- __Reactivity Rendering__ Responds to changes in data objects and performs
  partial updates of affected consumers in the view.
- __Markup Rendering__ Supports: conditions, custom tags, events, filter,
  interval, interceptors, iterate, rendering, resource messages, validation, ...
- __Markup Protection__ Makes it difficult to manipulate the attributes in the
  markup. Non-visible components are removed from the DOM and only reinserted
  when used.
- __Model View Controller (MVC) / Model View ViewModel (MVVM)__ Supports view
  model binding, event handling, and interceptors.
- __Routing for View and Page Organization__ Supports routes, interceptors, and
  permission concepts.
- __Resource Bundle / Resource Messages__ Supports internationalization (i18n),
  localization (l10n), and externalization of text resources.
- __Immutable XML Data Source__ Read-only data management for structured
  multilingual storage, aggregation, projection, and transformation via
  XPath/XSLT.
- __Micro-Frontends and Single-Page Applications (SPAs)__ Platform and runtime
  environment for implementing micro-frontends and single-page applications.
- __Test Environment__ Supports automated unit and integration testing.
- ... 

# License Terms
Seanox Software Solutions is an open-source project, hereinafter referred to as
__Seanox__.

This software is licensed under the __Apache License, Version 2.0__.

__Copyright (C) 2026 Seanox Software Solutions__

Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at

https://www.apache.org/licenses/LICENSE-2.0

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

[Seanox aspect-js 1.9.0](https://github.com/seanox/aspect-js/releases/download/1.9.0/aspect-js-1.9.0.zip)  
[Seanox aspect-js 1.9.0 Sources](https://github.com/seanox/aspect-js/archive/refs/tags/1.9.0.zip)

# Release Channels
The release channels continuously provide the latest final versions, so Seanox
aspect-js is always up to date.

## Version 1.9.0
- https://cdn.jsdelivr.net/npm/@seanox/aspect-js/release/aspect-js.js  
  __for deployment without Test API__

- https://cdn.jsdelivr.net/npm/@seanox/aspect-js/release/aspect-js-max.js  
  __for deployment without Test API__ not minimized and with comments

- https://cdn.jsdelivr.net/npm/@seanox/aspect-js/release/aspect-js-testing.js  
  for development and testing

- https://cdn.jsdelivr.net/npm/@seanox/aspect-js/release/aspect-js-testing-max.js  
  for development and testing not minimized and with comments

# Manuals
- [Getting Started](https://github.com/seanox/aspect-js/blob/master/manuals/introduction.md#getting-started)
- [Tutorial + Demo](https://github.com/seanox/aspect-js-tutorial#description)
- [Manual](https://github.com/seanox/aspect-js/tree/master/manuals/#readme)

# Changes
## 1.9.0 20260717  
BF: Composite: Validation corrections and optimization  
BF: DataSource: Correction for the use of locator/path with (sub)directories  
BF: DataSource: Correction of the method fetch when using the cache  
BF: Extensions: Correction of window.location.contextPath  
BF: Routing: Correction / workaround if the hashchange event is missing  
CR: Composite: Switch to microtasks-based scheduling  
CR: Composite: Renaming Composite.asynchron to Composite.asynchronous  
CR: Composite: Renaming Markup Hardening to Markup Protection  
CR: DataSource: Optimization and extension  
CR: Markup: iterate also supports numbers  
CR: Markup: import / output optimization and extension for DateSource  
CR: Message: Optimization and extension  
CR: Test: Update web server to version 5.9.0  

[Read more](https://raw.githubusercontent.com/seanox/aspect-js/master/CHANGES)

# Contact
[Issues](https://github.com/seanox/aspect-js-tutorial/issues)  
[Requests](https://github.com/seanox/aspect-js-tutorial/pulls)  
[Mail](http://seanox.com/contact)
