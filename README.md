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
of HTML and extends this with expression language, rendering with additional
attributes, object/model binding, Model View Controller, Resource Bundle, NoSQL
datasource, test environment and much more.


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

Copyright (C) 2021 Seanox Software Solutions

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
  Engines (tested): Blink, Gecko, Goanna, WebKit, ...  
  Browsers used for testing: Basilisk, Firefox, Microsoft Edge, Google Chrome, Safari (MacOS/iOS) 
- Web server for hosting


# Downloads
[Seanox aspect-js 1.3.1](https://raw.githubusercontent.com/seanox/aspect-js/master/releases/aspect-js-1.3.1.zip)  
[Seanox aspect-js 1.3.1 Sources](https://raw.githubusercontent.com/seanox/aspect-js/master/releases/aspect-js-1.3.1-src.zip)


# Release Channels

## Latest Release
[https://cdn.jsdelivr.net/npm/seanox/releases/aspect-js.js](https://cdn.jsdelivr.net/npm/seanox/releases/aspect-js.js)  
[https://cdn.jsdelivr.net/npm/seanox/releases/aspect-js-min.js](https://cdn.jsdelivr.net/npm/seanox/releases/aspect-js-min.js)

## Latest Release of Major Version 1.x
[https://cdn.jsdelivr.net/npm/seanox/releases/aspect-js-1.x.js](https://cdn.jsdelivr.net/npm/seanox/releases/aspect-js-1.x.js)  
[https://cdn.jsdelivr.net/npm/seanox/releases/aspect-js-1.x-min.js](https://cdn.jsdelivr.net/npm/seanox/releases/aspect-js-1.x-min.js)

The release channels continuously provide the newest final major versions, which
are downward compatible to the major version. Seanox aspect-js is always up to
date when using the release channels.


# Manuals
- [DE Getting Started](https://github.com/seanox/aspect-js/blob/master/manual/de/introduction.md)
- [DE Manual](https://github.com/seanox/aspect-js/blob/master/manual/de)
- [EN Getting Started](https://github.com/seanox/aspect-js/blob/master/manual/en/introduction.md)
- [EN Manual](https://github.com/seanox/aspect-js/blob/master/manual/en)
- [EN Tutorial + Demo](https://github.com/seanox/aspect-js-tutorial#description)


# Changes (Change Log)
## 1.4.0 2021xxxx (summary of the next version)  
BF: Composite: Correction in the use of attributes  
BF: Composite Expression Language: Line breaks in the expressions are supported  
BF: Composite: Correction for a URL without a file  
BF: Review: Correction/optimization JavaScript (no functional change)  
BF: MVC SiteMap: Correction of the method customize when using variable paths  
BF: DataSource: Correction for a URL without a file  
BF: Test: Correction in determining the browser engine for WebKit and Blink  
CR: Test: Integration of a web server  
CR: Test: Removal of the Edge engine after switching to Chromium  
CR: Test: Removal of the distinction between macOS and iOS  
CR: Composite Expression Language: Added keywords eeq (===), nee (!==)  
CR: Composite: Added attribute strict for loading of modules/composites  
CR: Extension Namespace: Added method create  
CR: Extension: Added method window.location.combine to combine paths  

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
