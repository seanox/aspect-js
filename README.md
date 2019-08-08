# Description
Influenced by the good experiences from JSF (Java Server Faces) with regard to
function and an easy integration into the markup, arose a similar client-side
fullstack solution.  
Seanox aspect-js focuses on a minimalist approach to implementing
Single-Page Applications (SPAs). 
This framework takes the declarative approach of HTML and extends this with
expression language, rendering with addional attributes, object/model-binding,
Model View Controller, Resource Bundle, NoSQL datasource, test environment and
much more.


# Features
- Easy integration in markup and JavaScript (clean code)
- Lightweight implementation (requires no additional frameworks)  
  less than 64kB for all (so the plan, but there will be a few more bytes)
- Component based architecture
- Modularization (supports imports at the runtime)  
  component concept for smart/automatic loading of composite resources
- Event handling
- Expression Language  
  meta-language extension in combination with full JavaScript
- Markup rendering  
  supports: condition, custom tags, events, filter, interval, iterate,
  rendering, resources messages, validation, ...
- Markup hardening  
  hardening makes it difficult to manipulate the attributes in the markup  
  Non-visible components are removed from the DOM and only reinserted when used  
- Model View Controller  
  supports: events, virtual paths, sitemap, permission concept, ...
- Resource Bundle / Resource Messages  
  localization and internationalization (i18n) as well for the outsourcing of
  texts 
- NoSQL datasource based on XML  
  lightweight data management for aggregation / projection / transformation
- Test environment  
  something like JUnit for automated unit tests
- ... 


# Licence Agreement
Seanox Software Solutions ist ein Open-Source-Projekt, im Folgenden
Seanox Software Solutions oder kurz Seanox genannt.

Diese Software unterliegt der Version 2 der GNU General Public License.

Copyright (C) 2019 Seanox Software Solutions

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
  Engines (tested): Blink, Gecko, Goanna, WebKit, Edge, ...


# Downloads
[Seanox aspect-js 1.1.0](https://raw.githubusercontent.com/seanox/aspect-js/master/releases/aspect-js-1.1.0.zip)  
[Seanox aspect-js 1.1.0 Sources](https://raw.githubusercontent.com/seanox/aspect-js/master/releases/aspect-js-1.1.0-src.zip)


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

# Changes (Change Log)
## 1.2.0 2019xxxx (summary of the next version)  
BF: Composite: Wrapper of XMLHttpRequest.open correction for using all passed arguments  
BF: Composite Asynchron: Corection of passed arguments  
BF: Composite Events: Composite.EVENT_RENDER_END now includes the mounting of models  
BF: Extension Capitalize: Correction for use with empty strings  
BF: MVC: Correction of the embedded use of SiteMap.accept(path)  
CR: Test: (Re)Move of Assert.assertEqualsTo as Assert.assertSameTo in /test/modules/common.js  
CR: Test: Enhancement of console output monitoring  
CR: Test: Optimization of console forwarding  
CR: Test: Extension of console forwarding by listeners  
CR: Test: Extension for passing events (Test + Console) to the enclosing object when using frames  
CR: Test: Extension for central catching of errors with activated Test-AP  
CR: Test Suite: Optimization of error output  
CR: Composite Object Lookup: Added support now for arrays (also associative)  
CR: Composite Render: Extension with the attribute 'release' as an indicator that an element was rendered.  
CR: Composite Scan: Omission of the intermediate step between render and mount  
CR: Composite Mount: Revision of the object/model binding  
CR: Composite Mount Validation: Change to two-phase validation (HTML5 + model-based validation)  
CR: Composite Mount Validation: Has a direct effect on synchronization, action and default action of the browser  
CR: Composite Mount Synchronization: Optimization  
CR: Composite Mount Action: The return value false can cancel the default action of the browser  
CR: Composite Mount: Stricter use of the hierarchy of IDs in the DOM  
CR: Composite Mount Locate: Stricter use of the hierarchy of IDs in the DOM  
CR: Build: Optimization of target 'changes'  
CR: Composite Mount Synchronization: Extension by the detection and use of setter (object accessors)  
CR: Composite Hardening: Added optional hardening from markup  
CR: Extension Uncapitalize: Adds a uncapitalize function to the String objects  

[Read more](https://raw.githubusercontent.com/seanox/aspect-js/master/CHANGES)


# Contact
[Support](http://seanox.de/contact?support)  
[Development](http://seanox.de/contact?development)  
[Project](http://seanox.de/contact?service)  
[Page](http://seanox.de/contact)


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
