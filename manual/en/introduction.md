[Motivation](motivation.md) | [TOC](README.md#introduction) | [Markup](markup.md)
- - -

# Introduction


## What is Seanox aspect-js?

Inspired by the good experiences with JSF (Java Server Faces) in terms of
functionality and easy integration into the markup, the idea for a similar
client-side full-stack solution with a minimalistic and lightweight approach for
the implementation of single-page applications (SPAs) was born.

Seanox aspect-js takes the declarative approach of HTML and extends it with
expression language, reactive rendering with additional attributes, object/model
binding, model view controller, resource bundle (i18n), NoSQL datasource, test
environment and much more.


# Features
* Easy integration in markup and JavaScript (clean code)  
  combinable with other JavaScript frameworks if they don't do the same thing do
  and use a different syntax
* Lightweight implementation (requires no additional frameworks)
* Component based architecture
* Modularization (supports imports at the runtime)  
  component concept for smart/automatic loading of composite resources
* Event handling
* Expression Language  
  meta-language extension with full JavaScript support
* Reactivity rendering  
  rendering reacts to changes in data objects and triggers partial rendering on
  consumers
* Markup rendering  
  supports: condition, custom tags, events, filter, interval, iterate,
  rendering, resources messages, validation, ...
* Markup hardening  
  makes it difficult to manipulate the attributes in the markup  
  non-visible components are removed from the DOM and only reinserted when used  
* Model View Controller  
  supports: events, virtual paths, sitemap, permission concept, view
  object/model binding, ...
* Resource Bundle / Resource Messages  
  localization, internationalization (i18n) and text outsourcing 
* NoSQL datasource based on XML  
  lightweight data management for aggregation / projection / transformation
* Test environment  
  for automated unit tests and integration tests
* ... 


## Contents Overview

* [Getting Started](#getting-started)
* [Scope](#scope)
* [Expression Language](#expression-language)
* [Attributes](#attributes)
  * [output](#output)
  * [import](#import)
  * [condition](#condition)
  * [interval](#interval)
  * [iterate](#iterate)
  * [id](#id)
  * [composite](#composite)
  * [strict](#strict)
  * [events](#events)
  * [validate](#validate)
  * [message](#message)
  * [notification](#notification)
  * [render](#render)
  * [release](#release)
* [DataSource](#datasource)
* [Resource Bundle (Messages / i18n)](#resource-bundle-messages--i18n)
* [Model View Controller](#model-view-controller)
  * [Controller](#controller)
  * [Model](#model)
  * [View](#view)
* [SiteMap](#sitemap)
  * [Virtual Paths](#virtual-paths)
  * [Object/Model Binding](#objectmodel-binding)
* [Components](#components)
  * [Object/Model Binding](#objectmodel-binding-1)
* [Reactivity Rendering](#reactivity-rendering)
* [Extension](#extension)
* [Events](#events-1)
* [Test](#test)
  * [Task](#task)
  * [Scenario](#scenario)
  * [Suite](#suite)
  * [Assert](#assert)
  * [Configuration](#configuration)
  * [Monitoring](#monitoring)
  * [Control](#control)
  * [Events](#events-2)


## Getting Started

The framework consists of one JavaScript file and is included via the URL of a
release channel or downloaded as releases.

Release channels continuously provide the latest final main versions, which are
backward compatible to the main version. This way Seanox aspect-js is always up
to date.

Each release consists of two versions. The developer version includes extensive
comments on design, function, operation and usage. The production version is
optimized in size but not obfuscated.

Create an HTML file, such as _index.html_ and include Seanox apect-js via the
release channel.

```html
<!-- development version, includes helpful comments -->
<script src="https://cdn.jsdelivr.net/npm/@seanox/aspect-js/releases/aspect-js.js"></script>
```

or

```html
<!-- production version, optimized in size but not obfuscated -->
<script src="https://cdn.jsdelivr.net/npm/@seanox/aspect-js/releases/aspect-js-min.js"></script>
```

__The framework has been developed for the implementation of modular and__
__component-based single-page applications. The automatic loading of__
__resources, modules, and data requires the use of a web server.__


## Scope

Seanox aspect-js works exclusively in the BODY tag, which itself is included.


## Expression Language

Expressions or the Expression Language (EL) is a simple access to the
client-side JavaScript and thus to the models and components. In the expressions
the complete JavaScript API is supported, which is enhanced with additional
keywords, so that the numerous arithmetic and logical operators are also usable.

The expression language can be used in the markup as free text and in the
attributes of the HTML elements. JavaScript and CSS elements are excluded. The
expression language is not supported here. When used as free text, pure text
(plain text) is always generated as output. The addition of markup, especially
HTML code, is not possible and is only supported with the attributes `output`
and `import`.
 
```html
<body lang="{{DataSource.locale}}">
  <p>
    Today is {{new Date().toDateString()}}
    and it's {{new Date().toLocaleTimeString()}} o'clock.
  </p>
</body>
```

The Expression Language is temporarily visible, since the renderer only becomes
active after the page has been loaded. Alternatively, the attributes
[output](markup.md#output) and [import](markup.md#import) can be used, which
cause a direct output into the inner HTML of the element. 

```html
<p output="Today is {{new Date().toDateString()}}
    and it's {{new Date().toLocaleTimeString()}} o'clock.">
</p>
```

Or by using the [release](markup.md#release) attribute, the element and output
only become visible when the rendering is complete.

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

The declarative approach is primarily implemented using attributes in Seanox
aspect-js and can be used with all HTML elements and in combination. Excluded
are `SCRIPT`,  which is only supported with the type `composite/javascript`,
and `STYLE`, which is not supported. The values of the attributes can be static
or dynamic when the expression language is used.  
If an attribute contains an expression, the attribute and the value become
unchangeable, because the renderer sets them again with the updated value of the
initial expression each time it is refreshed (render cycle).

[Learn more](markup.md#attributes)


### output

The attribute output the value or result of its expression as an inner HTML code
for an HTML element. As value are expected one element or more elements as
NodeList or Array, which are then inserted directly.  
The [DataSource-URL (locator)](datasource.md#locator) is also supported, which
loads and inserts transformed content from the [DataSource](datasource.md).

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

This declaration loads content dynamically and replaces the inner HTML code of
an element. If the content was successfully loaded, the `import` attribute is
removed. The attribute expects as value one element or more elements as NodeList
or Array these are then inserted directly. Also supported is the use of an
absolute or relative URL to a remote resource, which is reloaded and inserted by
HTTP method GET. The [DataSource URL (locator)](datasource.md#locator) is also
supported, which loads and inserts transformed content from the
[DataSource](datasource.md).

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

The condition attribute decides whether an element is kept in the DOM.  
The expression specified with the attribute must explicitly return `true` for
the element to be retained in the DOM. If the return value differs, the element
is temporarily removed from the DOM and can be reinserted later by refreshing
the __parent element__ if the expression returns `true`.  

```html
<article condition="{{Model.visible}}">
  ...
</article>
```

The use of the condition attribute in combination with embedded JavaScript is
possible as composite JavaScript.

```html
<script type="composite/javascript" condition="{{Model.visible}}">
    ...
</script>
```

[Learn more](markup.md#condition)


### interval

This declaration activates an interval-controlled refresh of an HTML element
without having to trigger the refresh manually.
As value an interval in milliseconds is expected, which can also be formulated
as expression. Processing is concurrent or asynchronous, but not parallel. Means
that the processing is to start after the set time interval, but this does not
start until a JavaScript procedure started before has been completed. For this
reason, the interval is to be understood as near real-time, but not as exact.  
The interval attribute expects a value in milliseconds. An invalid value causes
console output. The interval starts automatically and is active as long as the
element exists in the DOM.   

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

The iterative output is based on lists, enumerations and arrays.  
If an HTML element is declared as iterative, the initial inner HTML code is used
as template and during the iteration the inner HTML code is removed first, the
template is generated individually with each iteration and the result is added
to the inner HTML code.
The iterate attribute expects a
[variable expression](expression.md#variable-expression), as well as a
meta-object that allows access to the iteration.  
So the variable expression `iterate={tempA:Model.list}}` creates the
meta-object `tempA = {item, index, data}`.

```javascript
const Model = {
    months: ["Spring", "Summer", "Autumn", "Winter"]
};
```

```html
<select iterate={{months:Model.months}}>
  <option id="{{months.index}}">
    {{months.item}}
  </option>
</select>
```
[Learn more](markup.md#iterate)


### id

The ID (identifier) has an elementary meaning in Seanox aspect-js.   
It is used by the SiteMap as faces and facets, i.e. as targets for virtual paths
in face flow and for the object/model binding.

As with all attributes, the expression language can be used, with the difference
that the attribute is only read at the beginning. Due to the object/model 
binding, changes to an existing element at runtime have no effect as long as it
exists in the DOM.

[Learn more](markup.md#id)


### composite

Marks an element in the markup as [Composite](composites.md).  
Composites are modular components that have an elementary meaning in Seanox
aspect-js and necessarily require an identifier (ID).  
They are used by the [SiteMap](mvc.md#sitemap) as faces, so as targets for
virtual paths in the face-flow, which has a direct effect of the visibility of
the composites.
The [Model View Controller](mvc.md#sitemap) supports automatic
[object/model binding](object-binding.md) for composites.  
The resources (CSS, JS, Markup) for composites can be outsourced to the module
directory and are only loaded automatically when necessary.

```html
<article id="example" composite>
  ...
</article>
```

Details about using composites / modular components are described in
[Composites](composites.md) and [Model View Controller](mvc.md).

[Learn more](markup.md#composite)


### strict

The attribute is used in combination with the attribute [composite](#composite)
and specifies that when loading the resources (CSS, JS, HTML) for a component,
the file name is used in its original notation. The default behavior without
the [strict](#strict) attribute uses the composite id with lower case at the
beginning.

[Learn more](markup.md#strict)


### events

This declaration binds one or more events
(see https://www.w3.org/TR/DOM-Level-3-Events) to an HTML element. Events
provide primary functions for event-driven refreshing of other HTML elements
(see [render](#render) for more information), and for validating and
synchronizing and synchronization of HTML elements with the corresponding
JavaScript models (see [validate](#validate) for more information).

```html
<span id="output1">{{#text1.value}}</span>
<input id="text1" type="text"
    events="input change" render="#output1"/>
```

[Learn more](markup.md#events)


### validate

The attribute `validate` requires the combination with the attribute `events`.
Together they define and control the synchronization between the markup of a
composite and the corresponding JavaScript model, where a property with the
same name must exist as a target for synchronization.

The validation works in two steps and uses the standard HTML5 validation at the
beginning. If this cannot determine deviations from the expected result or if no
HTML5 validation is specified, the validation of the JavaScript model is used if
the model provides a corresponding validate method
`boolean validate(element, value)` and the element to be validated is
embedded in a composite.

```html
<form id="Model" composite>
  <input id="text1" type="text" placeholder="e-mail address"
      pattern="^\w+([\w\.\-]*\w)*@\w+([\w\.\-]*\w{2,})$"
      validate events="input change" render="#Model"/>
  <input type="submit" value="submit" validate events="click"/>
</form>
```

[Learn more](markup.md#validate)


### message

Message is an optional part of [Validation](#validate) and is used for
text/error output in case of an unconfirmed validation.  
This requires a combination with the attributes `validate` and `events`. 

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


### notification

Notification is an optional part of [Validation](#validate) and displays the
error output as an info box (browser feature) on the corresponding element.  
This requires a combination with the attributes `validate`, `events` and
`message`.

```html
<form id="Model" composite>
  <input id="text1" type="text" placeholder="e-mail address"
      pattern="^\w+([\w\.\-]*\w)*@\w+([\w\.\-]*\w{2,})$"
      validate message="Valid e-mail address required" notification
      events="input change" render="#Model"/>
  <input type="submit" value="submit" validate events="click"/>
</form>
```

[Learn more](markup.md#notification)


### render

The `render` attribute requires the combination with the `events` attribute.
Together they define which targets with which occurring events
be refreshed.  
The `render` attribute expects a CSS selector or query selector as value.
which sets the targets.

```html
<span id="output1">{{#text1.value}}</span>
<input id="text1" type="text"
    events="input change" render="#output1"/>
```

[Learn more](markup.md#render)


### release

Inverse indicator that an element was rendered.  
The renderer removes this attribute when an element is rendered. This effect can
be used for CSS to display elements only in rendered state. A corresponding CSS
rule is automatically added to the HEAD when the page is loaded. 

```html
<span release>{{'Show me after rendering.'}}</span>
```

[Learn more](markup.md#release)


## DataSource

DataSource is a NoSQL approach to data storage based on XML data in combination
with multilingual data separation, optional aggregation and transformation. A
combination of the approaches of a read only database and a CMS. 
The data is queried via XPath, the result can be concatenated and aggregated and
the result can be transformed with XSLT.

[Learn more](datasource.md#datasource)


## Resource Bundle (Messages / i18n)

(Resource)Messages is a static [DataSource](datasource.md) extension for
internationalization, localization (i18n) and client-related texts.  
The implementation is based on a set of key-value or label-value data which is
stored in the `locales.xml` in the DataSource directory.

[Learn more](messages.md)


## Model View Controller

The Model View Controller (MVC) is a design pattern for separating interaction,
data, and presentation.

```
+------------------------------------------+--------------+-----------------------+
|  View                                    |  Controller  |  Model                |
+------------------------------------------+--------------+-----------------------+
|  Markup                                  |  Composite   |  JavaScript           |
|                                          |  Path        |                       |
|                                          |  SiteMap     |                       |
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

[Learn more](mvd.md)


### Controller

For this we have to distinguish between I/O controller and application
controller. The original MVC design pattern refers to the I/O controller for
transmitting the interactions. Because this I/O controller is part of the
operating system and the browser, the controller in Seanox aspect-js refers to
the application controller. The application controller controls the flow within
an application (face-flow) and takes over the binding of markup and JavaScript
as well as the control of the data flow between view and model.  
In Seanox aspect-js the controller is the collaboration of Composite, Paths and
SiteMap.


### Model

The model is a displayable/projectable object.  
It receives (status) changes and interactions of the view, which are transmitted
by the controller, or provides the view with an interface to data as well as
functions and services of the middleware. The model primarily serves the view
for the representation and management of the states, for business functionality
it uses additional components.  
In Seanox aspect-js the models are represented by static JavaScript objects.  
Conceptually the implementation of the design pattern facade and delegation is
planned, so that the static models internally use additional components and
abstraction.


### View

The view is exclusively responsible for the presentation or projection of a
model.  
Projection is an important term because the way in which a model is
presented is not restricted.  
In the context of Seanox aspect-js, terms face and factes are used for the
visual representation/projection, which will be explained later.  
In Seanox aspect-js the views are represented by the markup.


## SiteMap

The representation in Seanox aspect-js is multilayered and the views are
organized as page, faces and facets which are accessed with virtual paths. For
this purpose, SiteMap provides a hierarchical directory structure based on the
virtual paths for all views. The SiteMap then controls the access and the
visualization (show and hide) of the views, which is termed face-flow.  
Face-flow and visualization are resolute and uses the DOM to insert and remove
the views (faces and facets).

```
+-----------------------------------------------+
|  Page                                         |
|  +-----------------------------------------+  |
|  |  Face A / Partial Face A                |  |
|  |  +-------------+       +-------------+  |  |
|  |  |  Facet A1   |  ...  |  Facet An   |  |  |
|  |  +-------------+       +-------------+  |  |
|  |                                         |  |
|  |  +-----------------------------------+  |  |
|  |  |  Face AA                          |  |  |
|  |  |  +-----------+     +-----------+  |  |  |
|  |  |  | Facet AA1 | ... | Facet AAn |  |  |  |
|  |  |  +-----------+     +-----------+  |  |  |
|  |  +-----------------------------------+  |  |
|  |  ...                                    |  |
|  +-----------------------------------------+  |
|  ...                                          |
|  +-----------------------------------------+  |
|  |  Face n                                 |  |
|  |  ...                                    |  |
|  +-----------------------------------------+  |
+-----------------------------------------------+
```

Further components of the SiteMap are the navigation and a permission concept.

[Learn more](mvc.md#sitemap)


### Virtual Paths

Virtual paths are used for navigation and control of face-flow.  
The target can be a face, a facet or a function.  
For SPAs (Single-Page-Applications) the anchor part of the URL is used for the
paths.

```
https://example.local/example/#path
```

According to the file system, absolute, relative and additionally functional
paths are also supported here.  
Paths consist exclusively of word characters, underscores and optionally the
minus character (based on combined) IDs. The hash character is used as separator
and root. Spaces are not supported.

[Learn more](mvc.md#virtual-paths)


### Object/Model Binding

TODO:


## Components

TODO:

Seanox aspect-js aims at a modular and component-based architecture. The
framework supports declarative marking of components in the markup, outsourcing
and automatic loading of resources, as well as automatic object/model binding.

The initial markup of a component consists of an HTML element marked as
composite and with a unique ID.

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

The inner markup, CSS and JavaScript can be stored in the file system.  
The default directory `./modules` can be changed with the property
`Composite.MODULES`.

```
+ modules
  - example.css
  - example.js
  - example.html
- index.html
```

The loading of resources and the object/model binding are partial if the
component is required in the UI -- means with the first use, which is controlled
via the [SiteMap](sitemap.md) as central face flow management and thus minimizes
the loading time, because only resources required for the active UI components
are loaded selectively. 
The outsourcing and loading of resources at runtime is optional and can be
applied completely, partially and not at all. There is a fixed order for loading
and embedding: CSS, JS, HTML/Markup. 
  
If the request for a resource is answered with status 404, it is assumed that
this resource has not been outsourced. If requests are not answered with status
200 or 404, an error is assumed.  
The loading of resources is only executed once with the first request of the
component for the UI.

From the concept's point of view, the design patterns facade and delegation,
which internally use additional components and abstraction, are considered for
the implementation of components.

[Learn more](composite.md)


### Object/Model Binding

TODO:


## Reactivity Rendering

In the reactive approach, changes to the data objects of models trigger a
partial refresh of the consumers in the view. Consumers are all expressions that
have read access to the changed value of a data object. The expressions can be
used in elements and in free text. For reactive rendering, the data objects must
use the ReactProxy, for which `ReactProxy.create(object)` or
`Object.prototype.toReactProxy()`, which provides each object instance, are
used.

```javascript
let Model = {
    value: ...
}.toReactProxy();
```

In this example, the renderer will automatically update all elements in the DOM,
which includes free-text that uses the property value from the model directly or
indirectly in an expression when the value of the property `value` changes or
more exactly, if the value in the data object was set final, which can be
relevant when using getters and setters.

The ReactProxy works permanently recursively on all object levels and also on
objects that are added later as values, even if they do not explicitly use the
ReactProxy, new instances are created for the referenced objects.

[Learn more](reactive.md)


## Extension

The JavaScript API for Seanox aspect-js has been extended by some general
functions.

[Learn more](extension.md)


## Events

Seanox aspect-js provides various events that can be used to implement
extensions and to notify the application of certain operating states of the
framework and runtime environment.

[Learn more](events.md)


## Test

The Test API supports the implementation and execution of integration tests and
can be used for suites, scenarios and single test cases.

As a modular component of Seanox aspect-js, the Test API is included in every
release that can be easily removed. Because the Test API has some special
features regarding error handling and console output, the Test API must be
activated deliberately at runtime.

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

Task is primarily a meta object.  

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
A meta object is expected as parameter. The configuration contained in it is
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

```javascript
Test.suspend();
```

Suspends the current test execution, which can be continued from the current
test with `Test.resume()`.

```javascript
Test.resume();
```

Continues the test execution if it was stopped before.

```javascript
Test.interrupt();
```

Interrupts the current test run and discards all outstanding tests.
The test run can be restarted with `Test.start()`.

```javascript
Test.status();
```

Makes a snapshot of the status of the current test.  
The status contains details of the current task and the queue.

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

[Motivation](motivation.md) | [TOC](README.md#introduction) | [Markup](markup.md)
