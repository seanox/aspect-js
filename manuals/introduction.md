&#9665; [Motivation](motivation.md)
&nbsp;&nbsp;&nbsp;&nbsp; &#8801; [Table of Contents](README.md#introduction)
&nbsp;&nbsp;&nbsp;&nbsp; [Expression Language](expression.md) &#9655;
- - -

# Introduction

## What is Seanox aspect-js?
Seanox aspect-js is a browser-native application runtime for Single-Pag
Applications (SPAs) and Micro-Frontends.

Applications remain composed of HTML, CSS and JavaScript resources that are
loaded, connected and managed by the runtime. Native browser technologies are 
extended with declarative application concepts such as expression language,
component composition, view-model binding, routing and reactive rendering
without requiring compilation.

The programming model applies established enterprise UI concepts such as
declarative views, expression language, component composition and view-model
binding directly in the browser while preserving HTML as the primary view
language and JavaScript as the application language.

## Getting Started

### Prerequisites
- Browser with ECMAScript 6 support or higher
- Web server for hosting (required for runtime loading of modules, resources,
  and data)

### Choose a Runtime Variant
The runtime consists of one JavaScript file that can be included via the URL of
a release channel or downloaded as a release.

Release channels continuously provide the latest final major versions.

Each release consists of different versions for different purposes. These
versions are also always available in two variants. The standard is the
compressed version for production environments. Optionally, the uncompressed and
documented max variant is also available for development and error analysis.

- https://cdn.jsdelivr.net/npm/@seanox/aspect-js/release/aspect-js.js  
  __for deployment without Test API__

- https://cdn.jsdelivr.net/npm/@seanox/aspect-js/release/aspect-js-max.js  
  __for deployment without Test API__ not minimized and with comments

- https://cdn.jsdelivr.net/npm/@seanox/aspect-js/release/aspect-js-testing.js  
  for development and testing

- https://cdn.jsdelivr.net/npm/@seanox/aspect-js/release/aspect-js-testing-max.js  
  for development and testing not minimized and with comments

### First Composite (Explicit Rendering Flow)

Create `index.html` and declare one composite:

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://cdn.jsdelivr.net/npm/@seanox/aspect-js/release/aspect-js-testing-max.js"></script>
  </head>
  <body>
    <div id="example" composite></div>
  </body>
</html>
```

Add module resources in the default module directory:

```text
+ modules
  - example.css
  - example.js
  - example.html
- index.html
```

Implement the model in `modules/example.js`:

```javascript
const example = {
    message: "",
    validate(element, value) {
        return true;
    }
};

#export example;
```

Implement the view in `modules/example.html`:

```html
<input id="message" type="text"
    events="input change" validate render="#preview"/>
<p id="preview">{{example.message}}</p>
```

Optional style in `modules/example.css`:

```css
#example {
  padding: 8px;
}
```

This example shows the explicit data/render flow: `events` triggers
synchronization from input to model, `validate` controls the sync result, and
 `render` refreshes selected targets (`#preview`). The expression
 `{{example.message}}` outputs model data into the markup.

### What the Runtime Does Here
When the page is rendered, the composite `id="example"` is used as the component
key. aspect-js resolves resources by that ID and loads CSS, JavaScript, and HTML
in this order. The JavaScript model and markup are then connected through
view-model binding, based on matching IDs and model properties.

`#export example;` is required because Composite JavaScript runs in an isolated
scope. Without export, the model is not published to the runtime namespace used
by the binding.

The HTML resource (`modules/example.html`) is auto-loaded only if the composite
element has no inner HTML and does not use `import` or `output`.

### Optional Next Step: Reactive Model
The first example intentionally uses explicit `render`, so the update mechanism
is visible. As a next step, you can make the model reactive and remove `render`
for this case.

```javascript
const example = {
    message: "",
    validate(element, value) {
        return true;
    }
}.reactive();

#export example;
```

```html
<input id="message" type="text"
    events="input change" validate/>
<p>{{example.message}}</p>
```

With this setup, changes to reactive model values update consumers
automatically.

### Learning Path

The following tutorials provide separate learning paths for Micro Frontends and
Single-Page Applications. Each path consists of incremental steps that extend or
modify the previous result. The differences between consecutive steps illustrate
the implementation of individual concepts.

- [Micro Frontend](https://github.com/seanox/aspect-js-tutorial#micro-frontend)
- [SPA (Single Page Application)](https://github.com/seanox/aspect-js-tutorial#spa-single-page-application)

## Contents Overview
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


## Scope
Seanox aspect-js works exclusively in the HTML element `BODY`, which itself is
included.

## Expression Language
Expressions or the expression language (EL) is a simple access to the
client-side JavaScript and thus to the models and components in Seanox
aspect-js. In the expressions the complete JavaScript API is supported, which
is enhanced with additional keywords, so that also the numerous arithmetic and
logical operators can be used.

The expression language can be used from the HTML element `BODY` on in the
complete markup as free text, as well as in all attributes. Exceptions are the
HTML elements `STYLE` and `SCRIPT` whose content is not supported by the
expression language.
 
```html
<body lang="{{DataSource.locale}}">
  <p>
    Today is {{new Date().toDateString()}}
    and it's {{new Date().toLocaleTimeString()}} o'clock.
  </p>
</body>
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

<p output="xml://example/content">
  loading resource...
</p>

<p output="xml://example/content?count(//item)">
  loading resource...
</p>

<p output="xml://example/data + xslt://example/style">
  loading resource...
</p>

<p output="xml://example/data">
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

<p import="xml://example/content">
  loading resource...
</p>

<p import="xml://example/content?count(//item)">
  loading resource...
</p>

<p import="xml://example/data + xslt://example/style">
  loading resource...
</p>

<p import="xml://example/data + xslt">
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
show elements only in rendered state. A corresponding CSS rule is automatically
added to the HEAD when the page is loaded.

```html
<span release>{{'Show me after rendering.'}}</span>
```

[Learn more](markup.md#release)

## DataSource
Immutable XML data source for static application data, combining structured XML
storage with multilingual data separation, optional aggregation, and
transformation capabilities via XPath and XSLT. The concept combines the
characteristics of a read-only database and a content management system,
targeting application-provided data that is accessed primarily through queries
and transformations.

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
The (application) controller controls internal processes within an application
(view flow) and takes over the data flow between the view and modules through
the view-model binding. The modules define the responsibilities of the
application layer. Depending on whether a module represents a model,
view-model, controller-related logic, or service-oriented functionality,
different architectural patterns such as MVC, MVVM, or MVCS can be implemented.

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
views and show the parent views in addition to the target view.

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

[Learn more](routing.md#navigation)

## Permission Concept
The permission concept is based on permit methods in the models, which are
called each (re-)rendering if the model has implemented the permit method.

[Learn more](routing.md#permission-concept)

## Interceptors
Interceptors allow custom logic to be executed during navigation before the
target path is evaluated and the view flow is processed by routing. They are
intended to react to specific paths and can influence whether the navigation
continues.

An interceptor is registered with `Routing.customize(path, actor)`. The `path`
can be either an exact route string or a regular expression. The `actor` is a
function that is executed when the specified path matches the requested
navigation target. The actor is a callback that receives the previous hash and
the new hash as parameters.

Interceptors are processed before routing checks the path validity, resolves the
target view and updates the view flow. They are therefore suitable for tasks
such as authentication checks, redirects, route migration or custom navigation
handling.

[Learn more](routing.md#interceptors)

### Paths
Paths are used for navigation, routing and controlling the view flow. The target
can be a view or a function if using interceptors. For SPAs (Single-Page
Applications), the anchor part of the URL is used for navigation and routes.

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
this purpose, the runtime supports declarative marking of components in the
markup as well as automatic mechanisms for view-model binding and loading of
outsourced resources at runtime.

[Learn more](composite.md)

## Scripting
Seanox aspect-js uses Composite JavaScript, a JavaScript dialect for browsers
extended with a small set of [macros](#macros).

Composite JavaScript is executed directly in an isolated runtime scope rather
than as a script-element. Variables, constants and functions declared in a
module are local to that module and are not automatically available in the
global scope or in other modules. The [macros](#macros) provide language
extensions for tasks such as importing modules, exporting declarations and
creating namespaces.

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

[Learn more](reactive.md)

## API Extensions
The JavaScript API for Seanox aspect-js has been extended by some general
functions.

- [Namespace](extensions.md#namespace)
- [Element](extensions.md#element)
- [Math](extensions.md#math)
- [Object](extensions.md#object)
- [RegExp](extensions.md#regexp)
- [String](extensions.md#string)
- [window](extensions.md#window)
- [XMLHttpRequest](extensions.md#xmlhttprequest)

[Learn more](extensions.md)

## Events
Seanox aspect-js provides various events that can be used to implement
extensions and to notify the application of certain operating states of the
runtime environment.

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
    Assert.assertTrue(true);
}});

Test.start();
```

[Learn more](test.md)

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
