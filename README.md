<p>
  <a href="https://github.com/seanox/aspect-js/pulls
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
Single-Page Applications (SPAs). 
This framework takes the declarative approach of HTML and extends this with
expression language, rendering with addional attributes, object/model binding,
Model View Controller, Resource Bundle, NoSQL datasource, test environment and
much more.


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
- Markup rendering  
  supports: condition, custom tags, events, filter, interval, iterate,
  rendering, resources messages, validation, ...
- Markup hardening  
  makes it difficult to manipulate the attributes in the markup  
  Non-visible components are removed from the DOM and only reinserted when used  
- Model View Controller  
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

Diese Software unterliegt der Version 2 der GNU General Public License.

Copyright (C) 2020 Seanox Software Solutions

This program is free software; you can redistribute it and/or modify it under
the terms of version 2 of the GNU General Public License as published by the
Free Software Foundation.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
this program; if not, write to the Free Software Foundation, Inc., 51 Franklin
Street, Fifth Floor, Boston, MA 02110-1301, USA.


# System Requirement
- ECMAScript 6 support or higher (normally the current browsers)  
  Engines (tested): Blink, Edge, Gecko, Goanna, WebKit, ...
- Web server for hosting  


# Downloads
[Seanox aspect-js 1.3.1](https://raw.githubusercontent.com/seanox/aspect-js/master/releases/aspect-js-1.3.1.zip)  
[Seanox aspect-js 1.3.1 Sources](https://raw.githubusercontent.com/seanox/aspect-js/master/releases/aspect-js-1.3.1-src.zip)


# Release Channels

## latest release
[https://cdn.jsdelivr.net/npm/seanox/releases/aspect-js.js](https://cdn.jsdelivr.net/npm/seanox/releases/aspect-js.js)  
[https://cdn.jsdelivr.net/npm/seanox/releases/aspect-js-min.js](https://cdn.jsdelivr.net/npm/seanox/releases/aspect-js-min.js)

## latest release of major version 1.x
[https://cdn.jsdelivr.net/npm/seanox/releases/aspect-js-1.x.js](https://cdn.jsdelivr.net/npm/seanox/releases/aspect-js-1.x.js)  
[https://cdn.jsdelivr.net/npm/seanox/releases/aspect-js-1.x-min.js](https://cdn.jsdelivr.net/npm/seanox/releases/aspect-js-1.x-min.js)

The release channels continuously provide the newest final major versions, which
are downward compatible to the major version. Seanox aspect-js is always up to
date when using the release channels.


# Manuals
- [DE Introduction](https://github.com/seanox/aspect-js/blob/master/manual/de/introduction.md)
- [DE Manual](https://github.com/seanox/aspect-js/blob/master/manual/de)
- [EN Introduction](https://github.com/seanox/aspect-js/blob/master/manual/en/introduction.md)
- [EN Manual](https://github.com/seanox/aspect-js/blob/master/manual/en)
- [EN Tutorial + Demo](https://github.com/seanox/aspect-js-tutorial#description)


# Changes (Change Log)
## 1.3.1 20200202 (summary of the current version)  
BF: Composite Expression Parse: Correction in the detection/processing of escape sequences  
BF: DataSource Collect: Correction of the cache usage with a collector  
BF: DataSource Fetch: Correction of the pattern of schema switching  
BF: DataSource Fetch: Optimization of the language determination  
BF: MVC SiteMap: Optimization to focus from the current target after changing the path  
BF: Modules: Optimization of JavaScript processing to support import and export  
BF: Composite Render: Optimization of JavaScript processing to support import and export  
BF: Composite Events: Correction of the callback of HTTP events  
BF: Composite Mount: Correction to find event methods also in prototypes  
BF: Composite Modules: Correction of the script processing of the #import meta-directive  
BF: Composite MutationObserver: Correction for recognition of expressions in text nodes  
CR: MVC Path: Simplification of the syntax restrictions  
CR: DataSource Locator: Simplification of the syntax restrictions  
CR: Composite Render Condition: Added console error output for faulty expression  
CR: Composite Render Condition: Added console error output for faulty expression  
CR: Composite Render: Optimization in the detection and validation of expressions  
CR: Composite Render: Simplification of the syntax restrictions for variable expressions  
CR: Composite Render: Simplification of the syntax restrictions for composite IDs  
CR: Composite Render: Simplification of the syntax restrictions for element IDs  
CR: Composite Render: Simplification of the syntax restrictions for custom tags  
CR: Composite Modules: Change so that the common composite is now loaded before the first rendering  
CR: Composite Modules: Added the meta directive #import to import additional composites/modules  
CR: Composite Events: Renaming of EVENT_AJAX... in EVENT_HTTP...  
CR: DataSource Fetch: Omission of the parameter raw  
CR: DataSource Fetch: Added optional parameters for the transformation  
CR: DataSource Transform: Omission of the parameter raw  
CR: DataSource Transform: Added optional parameters for the transformation  
CR: DataSource Transform: Change of return value from NodeList to DocumentFragment  

[Read more](https://raw.githubusercontent.com/seanox/aspect-js/master/CHANGES)


# Contact
[Issues](https://github.com/seanox/aspect-js-tutorial/issues)  
[Requests](https://github.com/seanox/aspect-js-tutorial/pulls)  
[Mail](http://seanox.de/contact)  


# Thanks!
<img src="https://raw.githubusercontent.com/seanox/seanox/master/sources/resources/images/thanks.png">

[JetBrains](https://www.jetbrains.com/?from=seanox)  
Sven Lorenz  
Andreas Mitterhofer  
[novaObjects GmbH](https://www.novaobjects.de)  
Leo Pelillo  
Gunter Pfannm&uuml;ller  
Annette und Steffen Pokel  
Edgar R&ouml;stle  
Michael S&auml;mann  
Markus Schlosneck  
[T-Systems International GmbH](https://www.t-systems.com)
