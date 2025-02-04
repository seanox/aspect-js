&#9665; [Motivation](motivation.md)
&nbsp;&nbsp;&nbsp;&nbsp; &#8801; [Table of Contents](README.md#introduction)
&nbsp;&nbsp;&nbsp;&nbsp; [Expression Language](expression.md) &#9655;
- - -

# Introduction

## What is Seanox aspect-js?
Inspired by the good experiences with JSF (Java Server Faces) in terms of
functionality and easy integration into the markup, the idea for a similar
client-side full-stack solution with a minimalistic and lightweight approach for
the implementation of single-page applications (SPAs) was born.

Seanox aspect-js takes the declarative approach of HTML and extends this with
expression language, reactivity rendering with additional attributes, Model View
Controller, view model binding, events, interceptors, resource bundle, NoSQL
datasource, test environment and much more.

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
- Micro Frontends  
  platform and framework for the implementation of micro-frontends
- Test environment  
  for automated unit tests and integration tests
- ...

## Contents Overview
- [Getting Started](#getting-started)
- [Scope](#scope)
- [Expression Language](#expression-language)
- [Attributes](#attributes)
  - [output](#output)
  - [import](#import)
  - [condition](#condition)
  - [interval](#interval)
  - [iterate](#iterate)
  - [id](#id)
  - [composite](#composite)
  - [route](#route)
  - [events](#events)
  - [validate](#validate)
  - [message](#message)
  - [render](#render)
  - [release](#release)
- [DataSource](#datasource)
- [Resource Bundle (Messages/i18n/l10n)](#resource-bundle-messages--i18n-l10n)
- [Model View Controller](#model-view-controller)
  - [Model](#model)
  - [View](#view)
  - [Controller](#controller)
  - [View Model Binding](#view-model-binding)
    - [Composite](#composite)
    - [Binding](#binding)
    - [Dock / Undock](#dock--undock)
    - [Synchronization](#synchronization)
    - [Validation](#validation)
    - [Events](#events)
- [Routing](#routing)
  - [Page](#page)
  - [View](#view)
  - [View-Flow](#view-flow)
  - [Navigation](#navigation)
  - [Permission Concept](#permission-concept)
  - [Interceptors](#interceptors)
  - [Paths](#paths)
- [Components](#components)
- [Scripting](#scripting)
- [Reactivity Rendering](#reactivity-rendering)
- [API Extensions](#api-extensions)
- [Events](#events-1)
- [Test](#test)
  - [Task](#task)
  - [Scenario](#scenario)
  - [Suite](#suite)
  - [Assert](#assert)
  - [Configuration](#configuration)
  - [Monitoring](#monitoring)
  - [Control](#control)
  - [Events](#events-2)

## Getting Started
The framework consists of one JavaScript file that can be included via the URL
of a release channel or downloaded as a release.

Release channels continuously provide the latest final major versions. This way,
Seanox aspect-js is always up to date.

Each release consists of different versions for different purposes. These
versions are also always available in two variants. The standard is the
compressed version for productive use. Optionally, the uncompressed and
documented max variant is also available for development and error analysis.

To begin, create an HTML file, e.g. _index.html_ and insert Seanox apect-js.

```html
<!-- development version, includes helpful comments -->
<script src="https://cdn.jsdelivr.net/npm/@seanox/aspect-js/release/aspect-js-max.js"></script>
```

or

```html
<!-- production and minimized version -->
<script src="https://cdn.jsdelivr.net/npm/@seanox/aspect-js/release/aspect-js.js"></script>
```

__The framework has been developed for the implementation of modular and
component-based single-page applications. Due to the automatic loading of
resources, modules and data, a web server is required for use.__

## Scope
Seanox aspect-js works exclusively in the HTML element `BODY`, which itself is
included.

## Expression Language
Expressions or the Expression Language (EL) is a simple access to the
client-side JavaScript and thus to the models and components in Seanox
aspect-js. In the expressions the complete JavaScript API is supported, which
is enhanced with additional keywords, so that also the numerous arithmetic and
logical operators can be used.

The expression language can be used from the HTML element `BODY` on in the
complete markup as free text, as well as in all attributes. Exceptions are the
HTML elements `STYLE` and `SCRIPT` whose content is not supported by the
expression Language. When used as free text, plain text is generated as output.
Adding markup, especially HTML code, is not possible this way and is only
supported with the attributes `output` and `import`.
 
```html
<body lang="{{DataSource.locale}}">
  <p>
    Today is {{new Date().toDateString()}}
    and it's {{new Date().toLocaleTimeString()}} o'clock.
  </p>
</body>
```

Expressions are interpreted by the renderer that starts after the page is
loaded. Thus, expressions may be visible when the page is loaded. Here it is
recommended to use the attributes [output](markup.md#output) and [import](
    markup.md#import), which cause a direct output to the inner HTML of the
element.

```html
<p output="Today is {{new Date().toDateString()}}
    and it's {{new Date().toLocaleTimeString()}} o'clock.">
</p>
```

Or the use of the attribute [release](markup.md#release), which makes HTML
elements and their contents visible only after rendering.

```html
<p release>
  Today is {{new Date().toDateString()}}
  and it's {{new Date().toLocaleTimeString()}} o'clock.
</p>
```

Expressions can create and use global variables at runtime.

```html
{{now:new Date()}}
<p>
  Today is {{now.toDateString()}}
  and it's {{now.toLocaleTimeString()}} o'clock.
</p>
```

[Learn more](expression.md)

## Attributes
In Seanox aspect-js, the declarative approach is implemented with attributes
that can be used and combined in all HTML elements starting from the HTML
element `BODY`, which is included. The values of the attributes can be static or
dynamic with the use of the expression language. If an attribute contains an
expression, the value is updated by the renderer with each refresh (render
cycle) based on the initial expression.

[Learn more](markup.md#attributes)

### output
Sets for the HTML element the value or result of its expression as inner HTML.
The behavior is similar to the [import](#import) attribute, except that the
output is updated with each render cycle. Supported values are text, one or more
elements as NodeList or Array, as well as absolute or relative URLs to a remote
resource and also the [DataSource-URL (locator)](datasource.md#locator) for
transformed content from the [DataSource](datasource.md).

The output attribute can be combined with the condition attribute and will then
only be executed if the condition is `true`.

```html
<p output="Today is {{new Date().toDateString()}}
    and it's {{new Date().toLocaleTimeString()}} o'clock.">
</p>

<p output="xml:/example/content">
  loading resource...
</p>

<p output="xml:/example/data xslt:/example/style">
  loading resource...
</p>
```

[Learn more](markup.md#output)

### import
Loads the content for the HTML element at runtime and inserts it as inner HTML.
The behavior is similar to the [output](#output) attribute, except that the
import is done once and the import attribute is removed after successful
loading. As value one or more elements are supported as NodeList or Array, as
well as absolute or relative URLs to a remote resource and also the [DataSource
    URL (locator)](datasource.md#locator) for transformed content from the
[DataSource](datasource.md).

The import attribute can be combined with the condition attribute and will then
only be executed if the condition is `true`.

```html
<p import="Today is {{new Date().toDateString()}}
    and it's {{new Date().toLocaleTimeString()}} o'clock.">
</p>

<p import="xml:/example/content">
  loading resource...
</p>

<p import="xml:/example/data xslt:/example/style">
  loading resource...
</p>

<p import="https://raw.githubusercontent.com/seanox/aspect-js/master/test/resources/import_c.htmlx">
  loading resource...
</p>
```

[Learn more](markup.md#import)

### condition
As a condition, the attribute specifies whether an element remains contained in
the DOM. The expression specified as the value must explicitly return `true` to
retain the element. If the return value is different, the element is temporarily
removed from the DOM and can be reinserted later by refreshing the __parent
element__ if the expression returns `true`.

```html
<article condition="{{Model.visible}}">
  ...
</article>
```

The use of the condition attribute in combination with embedded JavaScript is
possible as SCRIPT element with the type `composite/javascript` as Composite
JavaScript, because here the renderer has control over the script execution and
not the browser.

```html
<script type="composite/javascript" condition="{{Model.visible}}">
    ...
</script>
```

[Learn more](markup.md#condition)

### interval
Activates an interval-controlled refresh of the HTML element without the need to
actively trigger the refresh. The interval uses the inner HTML as a template
from which updated content is generated and inserted with each interval cycle.
The attribute expects milliseconds as value, which can also be formulated as
expression, where invalid values cause console output. Processing is concurrent
or asynchronous but not parallel. Processing will start after the specified time
when a previously started JavaScript procedure has finished. Therefore, the
interval should be understood as timely but not exact. The interval starts
refreshing automatically and ends when:
- the element no longer exists in the DOM
- the condition attribute is used that is not true

```html
<p interval="1000">
  {{new Date().toLocaleTimeString()}}
</p>
```

With the combination of interval and variable expression, the implementation of
a permanent counter is very simple.

```html
{{counter:0}}
<p interval="1000">
  {{counter:parseInt(counter) +1}}
  {{counter}}
</p>
```

The interval attribute can be used in combination with embedded JavaScript as
composite JavaScript.

```html
<script type="composite/javascript" interval="1000">
    console.log(new Date().toLocaleTimeString());
</script>
```

[Learn more](markup.md#interval)

### iterate
Iterative output is based on lists, enumerations and arrays. If an HTML element
is declared as iterative, the inner HTML is used as a template from which
updated content is generated and inserted as inner HTML with each render cycle.
as inner HTML. As value for the attribute a [variable expression](
    expression.md#variable-expression) is expected, for which a meta-object will
be created, which allows access to the iteration in the template. Thus, the
variable expression `iterate={{tempA:Model.list}}` creates the meta-object
`tempA = {item, index, data}`.

```javascript
const Model = {
    months: ["Spring", "Summer", "Autumn", "Winter"]
};
```

```html
<select iterate={{months:Model.months}}>
  <option value="{{months.index}}">
    {{months.item}}
  </option>
</select>
```
[Learn more](markup.md#iterate)

### id
The ID (identifier) has an elementary meaning in Seanox aspect-js. It is the
basis for [view model binding](mvc.md#view-model-binding) and is used by
[Routing](routing.md#routing) for [views](routing.md#view) in the [view flow](
    routing.md#view-flow) and thus as a destination for paths.

As with all attributes, the expression language can be used, with the difference
that the attribute is only read at the beginning. Due to the view model binding,
changes to an existing element at runtime have no effect as long as it exists in
the DOM.

[Learn more](markup.md#id)

### composite
Marks an element in the markup as a [Composite](composite.md). Composites are
essential components that require an identifier (ID / Composite ID).

```html
<article id="example" composite>
  ...
</article>
```

As a component, composites are composed of various [Ressourcen](
    composite.md#ressourcen) (markup, CSS, JS) that can be outsourced to the
module directory based on the (composite) ID and are only loaded at runtime when
used.

Composites are also the basis for [view model binding](
    mvc.md#view-model-binding), which involves connecting HTML elements in the
markup (view) with corresponding JavaScript objects (models). Models are static
JavaScript objects that provide data, states, and functions for the view,
similar to managed beans and DTOs (Data Transfer Objects). The view as
presentation and user interface for interactions and the model are primarily
decoupled. For the MVVM (Model-View-ViewModel) approach, as an extension to the
MVC ([Model View Controller](mvc.md#model-view-controller)), the controller
links views and models bidirectionally based on the composite IDsand so no
manual implementation and declaration of events, interaction or synchronization
is required.

The [Routing](routing.md#routing) uses composites as [views](routing.md#view)
for the primary projection of JavaScript objects (models), which means that they
can be used as targets for paths in the [view flow](routing.md#view-flow), which
has a direct influence on the visibility of the composites.  When routing is
active, composites can be marked with attribute [route](#route) so that their
visibility is controlled by routing through paths and the permission concept.

[Learn more](markup.md#composite)

### events
Binds one or more [events](https://www.w3.org/TR/DOM-Level-3-Events) to an HTML
element. This allows event-driven synchronization of HTML elements with
corresponding JavaScript objects (models), as well as validation of the data to
be synchronized (see [validate](#validate) for more information) and
event-driven control and refreshing of other HTML elements (see [render](
#render) for more information).

```html
<span id="output1">{{#text1.value}}</span>
<input id="text1" type="text"
    events="input change" render="#output1"/>
```

As with all attributes, the expression language is applicable here, with the
difference that changes at runtime have no effect, since the attribute or the
value for the view model binding is only processed initially as long as the HTML
element exists in the DOM.

[Learn more](markup.md#events)

### validate
The attribute `validate` requires the combination with the attribute `events`.
Together they define and control the synchronization between the markup of a
composite and the corresponding JavaScript object (model), where a property with
the same name must exist as a target for synchronization.

The validation works in two steps and uses the standard HTML5 validation at the
beginning. If this cannot determine deviations from the expected result or if no
HTML5 validation is specified, the validation of the JavaScript object is used
if the model provides a corresponding validate method
`boolean validate(element, value)` and the element to be validated is embedded
in a composite.

```html
<form id="Model" composite>
  <input id="text1" type="text" placeholder="e-mail address"
      pattern="^\w+([\w\.\-]*\w)*@\w+([\w\.\-]*\w{2,})$"
      validate events="input change" render="#Model"/>
  <input type="submit" value="submit" validate events="click"/>
</form>
```

The synchronization and the default action of the browser are directly
influenced by the validation. This can use for it four states as return values:
`true`, `not true`, `text`, `undefined/void`.

[Learn more](markup.md#validate)

### message
Message is an optional part of [Validation](#validate) and is used for text and
error output in case of an unconfirmed validation. This requires a combination
with the attributes [validate](#validate) and [events](#events).

```html
<form id="Model" composite>
  <input id="text1" type="text" placeholder="e-mail address"
      pattern="^\w+([\w\.\-]*\w)*@\w+([\w\.\-]*\w{2,})$"
      validate message="Valid e-mail address required"
      events="input change" render="#Model"/>
  <input type="submit" value="submit" validate events="click"/>
</form>
```

```html
<form id="Model" composite>
  <input id="text1" type="text" placeholder="e-mail address"
      pattern="^\w+([\w\.\-]*\w)*@\w+([\w\.\-]*\w{2,})$"
      validate message="{{Messages['Model.text1.validation.message']}}"
      events="input change" render="#Model"/>
  <input type="submit" value="submit" validate events="click"/>
</form>
```

[Learn more](markup.md#message)

### render
The attribute requires the combination with the [events](#events) attribute.
Together they define which targets are refreshed by the renderer with which
occurring events. The expected value is one or more space-separated CSS or Query
selectors that define the targets.

```html
<span id="output1">{{#text1.value}}</span>
<input id="text1" type="text"
    events="input change" render="#output1"/>
```

__Alternatively, [reactive rendering](reactive.md) can be used, where changes in
the data objects trigger a partial update of the view.__

[Learn more](markup.md#render)

### release
Inverse indicator that an HTML element was rendered. The renderer removes this
attribute when an HTML element is rendered. This effect can be used for CSS to
display elements only in rendered state. A corresponding CSS rule is
automatically added to the HEAD when the page is loaded.

```html
<span release>{{'Show me after rendering.'}}</span>
```

[Learn more](markup.md#release)

## DataSource
DataSource is a NoSQL approach to data storage based on XML data in combination
with multilingual data separation, optional aggregation and transformation. A
combination of the approaches of a read only database and a CMS.

DataSource is based on static data. Therefore, the implementation uses a cache
to minimize network access.

The data is queried via XPath. The result can be concatenated and aggregated and
the result can be transformed with XSLT.

[Learn more](datasource.md#datasource)

## Resource Bundle (Messages/i18n/l10n)
(Resource)Messages is a static [DataSource](datasource.md) extension for
internationalization (i18n), localization (l10n) and client-related texts. The
implementation is based on a set of key-value or label-value data which is
stored in the `locales.xml` in the DataSource directory.

[Learn more](message.md)

## Model View Controller
The Model View Controller (MVC) is a design pattern for separating interaction,
data and presentation. A distinction should be made between I/O controller and
application controller. The pure MVC design pattern means the I/O controller for
the transmission of interactions. Since this is provided by the operating system
and browser, Seanox aspect-js ostensibly refers to the application controller.

```
+------------------------------------------+--------------+-----------------------+
|  View                                    |  Controller  |  Model                |
+------------------------------------------+--------------+-----------------------+
|  Markup                                  |  Composite   |  JavaScript           |
|                                          |  Reactive    |                       |
+------------------------------------------+--------------+-----------------------+
|  <form id="model" composite>             |  aspect-js   |  const model = {      |
|    <input id="message" events="input"/>  |              |      message: "",     | 
|    <button id="submit"/>                 |              |      submit: {        |
|  </form>                                 |              |          onClick() {  |
|                                          |              |          }            |
|                                          |              |      }                |
|                                          |              |  }                    |
+------------------------------------------+--------------+-----------------------+
```

[Learn more](mvc.md)

### Model
Models are representable/projectable static JavaScript objects that can provide
and receive data, states and interactions for views, comparable to managed beans
and DTOs (Data Transfer Objects). As singletons/facades/delegates, they can use
other components and abstractions, contain business logic themselves, and be a
link between the user interface (view) and middleware (backend).

[Learn more](mvc.md#model)

### View
The view is exclusively responsible for the representation or projection of a
model. Where projection is an important term because the way a model is
represented is not restricted.

[Learn more](mvc.md#view)

### Controller
The (application)controller controls internal processes within an application
(view flow) and takes over the data flow between view and model with the
view-model binding, whereby we can also speak of MVVM (Model-View-ViewModel) and
MVCS (Model-View-Controller-Service) here.

[Learn more](mvc.md#controller)

### View Model Binding
The view-model binding takes over the bidirectional linking of the HTML elements
of the view with the models as static JavaScript objects and thus organizes the
data flow, communicates events as well as states and binds functions.

[Learn more](mvc.md#view-model-binding)

#### Composite
The basis for view-model binding is formed by composites, which are functionally
independent components consisting of markup, CSS, JavaScript, and optionally
other resources. All components are bound via, the also called Composite ID, ID
of the HTML construct, the model with the same name in JavaScript and the ID
corresponding to the HTML in CSS.

```html
<!DOCTYPE HTML>
<html>
  <head>
    <script src="aspect-js.js"></script>
  </head>
  <body>
    <div id="example" composite></div>
  </bod>
</html>
```

```javascript
const example = {
    ...    
}
```

```css
#example {
  ...    
}
```

The Composite ID is thus a unique identifier within the application. It is a
string of letters, numbers, and underscores that is at least one character long,
begins with an underscore or a letter, and is formed by combining the id and
composite attributes on an HTML element.

Composites, or better their composite ID, define the point in the global object
tree where the corresponding JavaScript model is located. All HTML elements with
an ID enclosed by a composite are then reflected as branches in the
corresponding JavaScript model if they are implemented accordingly in the model.

```javascript
const model = {
    message: "Hello", 
    submit: {
        ...    
    }
};
```

```html
<html>
  <body>
    <form id="model" composite>
      <input type="text" id="message"/>
      <input type="submit" id="submit"/>
      ...
    </form>
  </body>
</html>
```

[Learn more](mvc.md#composite)

#### Binding
View-model binding is about linking markup/HTML (view) to the corresponding
JavaScript object (model). The binding passes interactions and state changes of
the view to the model and provides an interface for middleware functions and
services for the view. In this way, no manual implementation of events,
synchronization and interaction between view and application logic is required.

```javascript
const model = {
    message: "Hello", 
    dock() {
        ...
    },
    undock() {
        ...
    },
    submit: {
        onClick(event) {
            ...
        }
    }
};
```

```html
<html>
  <body>
    <form id="model" composite>
      <input type="text" id="message" value="{{model.message}}" events="change"/>
      <input type="submit" id="submit"/>
      ...
    </form>
  </body>
</html>
```

[Learn more](mvc.md#binding)

#### Dock / Undock
If a composite is used/inserted in the DOM, the corresponding model is
docked/linked and when removing from the DOM, the corresponding model is
undocked/unlinked. In both cases the model can optionally implement appropriate
methods. The method `dock` is executed before rendering, before inserting the
composite into the DOM, or after loading the page during initial rendering, and
can be used to prepare the view. The method `undock` is executed after the
composite is removed from the DOM and can be used to postprocess/clean the view.

```javascript
const model = {
    dock() {
        ...
    },
    undock() {
        ...
    }
};
```

```html
<html>
  <body>
    <div id="model" composite>
      ...
    </div>
  </body>
</html>
```

For  composites in combination with a [condition](markup.md#condition), the call
of the methods depends on the result of the condition.

[Learn more](mvc.md#dock)

#### Synchronization
In addition to the static linking and assignment of HTML elements to JavaScript
objects (models), the view model binding also includes the synchronization of
values between the HTML elements and the fields of the JavaScript object. The
synchronization depends on events that are declared for the HTML element with
the attribute [events](markup.md#events) and so the synchronization is executed
only when one of the defined events occurs.

[Learn more](mvc.md#synchronization)

#### Validation
The synchronization of values between view (HTML elements) and the fields of
JavaScript models can be monitored and controlled by validation. Validation is
declared in HTML via the [validate](markup.md#validate) attribute in combination
with the [events](markup.md#events) attribute and requires a corresponding
validation method in the JavaScript object (model).

[Learn more](mvc.md#validation)

#### Events
Events, more precisely the interaction between view and model, are also
considered during view model binding. The methods for interaction will be
implemented only in the model. In the markup itself, no declaration is required.
The view model binding knows the available events for HTML. During binding, the
model is searched for corresponding methods that will be registered as event
listeners.

```javascript
const contact = {
    mail: {
        onClick(event) {
          const mail = "mailto:mail@local?subject=Test&body=Greetings";
            document.location.href = mail;
            return false;
        }
    }
};
```

```html
<html>
  <body>
    <div id="contact" composite>
      <p>
        Example for use of events.
      </p>
      <button id="mail">
        Click Me!
      </button>
    </div>
  </body>
</html>
```

[Learn more](mvc.md#events)

## Routing
The presentation of the page can be organized in Seanox aspect-js in views,
which are addressed via paths (routes). For this purpose, the routing supports a
hierarchical directory structure based on the IDs of the nested composites in
the markup. The routing then controls the visibility and permission for
accessing the views via paths - the so-called view flow. For the view flow and
the permission, the routing actively uses the DOM to insert and remove the views
depending on the situation.

```
+-----------------------------------------------+
|  Page (#)                                     |
|  +-----------------------------------------+  |
|  |  View A (#A)                            |  |
|  |  +-----------------------------------+  |  |
|  |  |  View B (#A#B)                    |  |  |
|  |  |  +-----------------------------+  |  |  |
|  |  |  |  View C (#A#B#C)            |  |  |  |
|  |  |  +-----------------------------+  |  |  |
|  |  +-----------------------------------+  |  |
|  +-----------------------------------------+  |
+-----------------------------------------------+
```

### Page
In a single page application, the page is the elementary framework and runtime
environment of the entire application.

### View
A view is the primary projection of models/components/content. This projection
can contain additional substructures in the form of views and sub-views. Views
can be static or path-controlled. Paths address the complete chain of nested
views and display the parent views in addition to the target view.

### View Flow
View flow describes the access control and the sequence of views. The routing
provides interfaces, events, permission concepts and interceptors with which the
view flow can be controlled and influenced.

[Learn more](routing.md#routing)

## Navigation
Navigation is based on paths that use the hash in the URL. It is effected by
changing the URL hash in the browser (direct input), by using hash links and in
JavaScript with `window.location.hash`, `window.location.href`,
`Routing.route(path)` and `Routing.forward(path)`.

```html
<a href="#a#b#c">Goto root + a + b + c</a>
<a href="##">Back to the parent</a>
<a href="##x">Back to the parent + x</a>
```

```javascript
Routing.route("#a#b#c");
Routing.route("##");
Routing.route("##x");
```

```javascript
Routing.forward("#a#b#c");
Routing.forward("##");
Routing.forward("##x");
```

In difference to the navigate method, the forwarding is executed directly
instead of triggering an asynchronous forwarding by changing the location hash.

Relative paths without hash at the beginning are possible, but only work with
`Routing.route(path)` and `Routing.forward(path)`.

```javascript
Routing.route("x#y#z");
Routing.forward("x#y#z");
```

[Learn more](routing.md#navigation)

## Permission Concept
The permission concept is based on permit methods in the models, which are
called each (re-)rendering if the model has implemented the permit method.

[Learn more](routing.md#permission-concept)

## Interceptors
TODO:

Interceptors take effect very early and before the path is checked and optimized
by routing. The passed parameter is a meta-object with the triggered oldHash and
newHash.

Interceptors are designed to execute according to the order in which they are
registered. Each interceptor is always evaluated and executed if it matches the
specified criteria. Notably, interceptors do not create any entries in the
browser history. They have the capability to modify the new hash/path, e.g.
using the methods `window.history.replaceState()` or `window.location.replace()`
for such modifications. Following interceptors will operate on this potentially
altered hash/path. If any interceptor returns false explicitly, it will
terminate the logic within the hashchange event.

[Learn more](routing.md#interceptors)

### Paths
Paths are used for navigation, routing and controlling the view flow. The target
can be a view or a function if using interceptors. For SPAs (single-page
applications), the anchor part of the URL is used for navigation and routes.

```
https://example.local/example/#path
```

Similar to a file system, absolute and relative paths are also supported here.
Paths consist of case-sensitive words that only use 7-bit ASCII characters above
the space character. Characters outside this range are URL encoded. The words
are separated by the hash character (`#`).

[Learn more](routing.md#paths)

## Components
Seanox aspect-js is designed for a modular and component-based architecture. For
this purpose, the framework supports declarative marking of components in the
markup as well as automatic mechanisms for view-model binding and loading of
outsourced resources at runtime.

[Learn more](composite.md)

## Scripting
Seanox aspect-js uses composite JavaScript. A dialect based on the browser
JavaScript, enriched with [macros](#macros) -- a simple meta-syntax.

Composite JavaScript, which includes the modules, is not inserted as an element,
but executed directly with the eval method. Since an isolated and not the global
scope is used for this, variables, constants and methods are not directly usable
globally or across, which is why, among other things, the Composite-JavaScript
was enriched with [macros](#macros), which take over such tasks, among other
things.

[Learn more](scripting.md)

## Reactivity Rendering
In the reactive approach, changes to the data objects (models) trigger a partial
refresh of the consumers in the view. Consumers are all expressions that have
read access to the changed value of a data object. In the view, expressions can
be used in the HTML elements and in the free text. The data objects must then
use `Reactive(object)` or `Object.prototype.reactive()` for reactive rendering.

```javascript
const Model = {
    value: ...
}.reactive();
```

In this example, the renderer automatically updates all HTML elements in the
DOM, which includes free-text that uses the value property from the model
directly or indirectly in an expression when the value of the value property
changes or, more precisely, when a changed value has been set final in the data
object, which can be relevant when using getters and setters.

Reactive works permanently recursively on all object levels and also on the
objects which are added later as values. Even if these objects do not explicitly
use Reactive, new instances are created for the referenced objects. Initiating
objects and reactive models are logically decoupled and are synchronized
bidirectionally. In contrast, views and reactive models, like models internally,
use proxies that behave and can be used like the initiating originals. However,
proxies are separate instances that are compatible but not identical to the
initiating object. This logical separation is necessary so that the renderer can
generate appropriate notifications when data changes and thus update the
consumers in the view.

[Learn more](reactive.md)

## API Extensions
The JavaScript API for Seanox aspect-js has been extended by some general
functions.

- [Namespace](extension.md#namespace)
- [Element](extension.md#element)
- [Math](extension.md#math)
- [Object](extension.md#object)
- [RegExp](extension.md#regexp)
- [String](extension.md#string)
- [window](extension.md#window)
- [XMLHttpRequest](extension.md#xmlhttprequest)

[Learn more](extension.md)

## Events
Seanox aspect-js provides various events that can be used to implement
extensions and to notify the application of certain operating states of the
framework and runtime environment.

[Learn more](events.md)

## Test
The Test API supports the implementation and execution of integration tests and
can be used for suites, scenarios and single test cases.

As a modular part of Seanox aspect-js, the Test API is included in all releases
except the core versions. Because the test API causes some special features in
terms of error handling and console output, the test API has to be activated
consciously at runtime.

```javascript
Test.activate();

Test.create({test() {
    ...
}});

Test.start();
```

[Learn more](test.md)

### Task
The smallest component in an integration test, used here as 'task', because
'case' is a keyword in JavaScript. It can be implemented alone, but is always
used in a scenario.

```javascript
Test.activate();

Test.create({test() {
    Assert.assertTrue(true);
}});

Test.start();
```

Task is primarily a meta-object.

```
{name:..., test:..., timeout:..., expected:..., ignore:...}
```

[Learn more](test.m#task)

### Scenario
A scenario is a sequence of a lot of test cases (tasks).

```javascript
Test.activate();

Test.create({test() {
    Assert.assertTrue(true);
}});
Test.create({name:"example", timeout:1000, test() {
    Assert.assertTrue(true);
}});
Test.create({error:Error test() {
    throw new Error();
}});
Test.create({error:/^My Error/i, test() {
    throw new Error("My Error");
}});
Test.create({ignore:true, test() {
    Assert.assertTrue(true);
}});

Test.start();
```

[Learn more](test.md#szenario)

### Suite
A suite is a complex bundle of different test cases, scenarios and other suites.
Usually a suite consists of different files, which then represent a complex
test. An example of a good suite is a cascade of different files und the test
can be started in any file and place. This makes it possible to perform the
integration test on different levels and with different complexity.

[Learn more](test.m#suite)

### Assert
The test cases are implemented with assertions. The Test API provides elementary
assertions, you can implement more. The function is simple. If an assertion was
not `true`, an error is thrown.

```javascript
Test.activate();

Test.create({test() {

    Assert.assertTrue(true);
    Assert.assertTrue("message", true);

    Assert.assertFalse(false);
    Assert.assertFalse("message", false);

    Assert.assertEquals(expected, value);
    Assert.assertEquals("message", expected, value);

    Assert.assertNotEquals(unexpected, value);
    Assert.assertNotEquals("message", unexpected, value);

    Assert.assertSame(expected, value);
    Assert.assertSame("message", expected, value);

    Assert.assertNotSame(unexpected, value);
    Assert.assertNotSame("message", unexpected, value);

    Assert.assertNull(null);
    Assert.assertNull("message", null);

    Assert.assertNotNull(null);
    Assert.assertNotNull("message", null);

    Assert.fail();
    Assert.fail("message");
}});

Test.start();
```

[Learn more](test.m#assert)

### Configuration
Optionally, the Test API can be configured with each start. 
A meta-object is expected as parameter. The configuration contained in it is
partially adopted and the unknown is ignored.

```javascript
Test.start({auto: boolean, ouput: {...}, monitor: {...}});
```

[Learn more](test.m#configuration)

### Monitoring
Monitoring monitors the progress of the test and is informed of the various
steps and statuses during execution. The monitor is optional. Without this, the
console is used to output information about the test process.

[Learn more](test.m#monitoring)

### Control
The test progress and the execution of the tests can be controlled by the
Test API.

```javascript
Test.start();
Test.start({auto: boolean});
```

The start can be done manually or when using `auto = true`, by loading the
page. If the page is already loaded, the parameter `auto` is ignored and the
start is executed immediately.

Further methods for controlling and monitoring test execution are available.

[Learn more](test.m#control)

### Events
Events and their callback methods are another way of monitoring test execution.
The callback methods are registered at the Test API for corresponding events and
then work similar to the monitor.

```javascript
Test.listen(Test.EVENT_START, function(event, status) {
    ...
});

Test.listen(Test.EVENT_PERFORM, function(event, status) {
    ...
});

Test.listen(Test.EVENT_FINISH, function(event, status) {
    ...
});
```

[Learn more](test.m#events)



- - -
&#9665; [Motivation](motivation.md)
&nbsp;&nbsp;&nbsp;&nbsp; &#8801; [Table of Contents](README.md#introduction)
&nbsp;&nbsp;&nbsp;&nbsp; [Expression Language](expression.md) &#9655;
