# Introduction


## What is Seanox aspect-js?

Influenced by the good experiences from JSF (Java Server Faces) with regard to
function and an easy integration into the markup, arose a similar client-side
fullstack solution.  
Seanox aspect-js focuses on a minimalist approach to implementing
Single-Page Applications (SPAs).   
This framework takes the declarative approach of HTML and extends this with
expression language, rendering with addional attributes, object/model-binding,
Model View Controller, Resource Bundle, NoSQL datasource, test environment and
much more.


## Getting Started

The framework consists of pure JavaScript.

The releases consist of one file that can be downloaded or integrated via a
release channel.  
The release channels continuously provide the newest final major versions, which
are downward compatible to the major version. Seanox aspect-js is always up to
date when using the release channels.
 
Each release consists of two versions. The development version contains comments
on conception, function and usage. The production version is optimized in size
but not obfuscated.

Create an HTML file, such as _index.html_ and include Seanox apect-js via the
release channel.

```html
<!-- development version, includes helpful comments -->
<script src="https://cdn.jsdelivr.net/npm/seanox/releases/aspect-js.js"></script>
```

or

```html
<!-- production version, optimized in size but not obfuscated -->
<script src="https://cdn.jsdelivr.net/npm/seanox/releases/aspect-js-min.js"></script>
```

__The framework has been developed for the implementation of modular and__
__component-based single-page applications. The automatic loading of__
__resources, modules, and data requires the use of a web server.__


## Scope

Seanox aspect-js works exclusively in the BODY tag, which itself is included.


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
NodeList or Array -- these are then inserted directly, or a
[DataSource-URL (locator)](datasource.md#locator) which loads and transforms
content from the [DataSource](datasource.md).

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
or Array -- these are then inserted directly, or an absolute or relative URL to
a remote resource that is loaded by HTTP method GET, or a
[DataSource-URL (locator)](datasource.md#locator) that loads and transforms
content from the [DataSource](datasource.md).

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

<p import="https://raw.githubusercontent.com/seanox/aspect-js/master/test/resources/import_c.htmlx">
  loading resource...  
</p>

```

[Learn more](markup.md#import)


### condition

The condition attribute determines whether an element remains in the DOM. 
The expression passed to the attribute must explicitly return `true` or
`false`. With `false` an element is temporarily removed from the DOM and can
be re-inserted later by refreshing the __parent element__ if the expression
returns `true`.
A peculiarity is the combination with the attribute
[interval](markup.md#interval), because with the removal of the element from the
DOM also the corresponding timer is terminated. If the element is inserted into
the DOM again with a later refresh, the timer starts again from the beginning
and is therefore not continued.

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
  {{counter:parseInt(counter) +1}}^
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


### composite

Marks an element in the markup as [Composite](composites.md).  
Composites are modular components and have a versatile meaning in Seanox
aspect-js. They are used by the [SiteMap](mvc.md#sitemap) as faces, so as
targets for virtual paths in the face-flow, which has a direct effect of the
visibility of the composites.
The [Model View Controler](mvc.md#sitemap) supports automatic
[object/model binding](object-binding.md) for composites.  
The resources (CSS, JS, Markup) for composites can be outsourced to the module
directory and are only loaded automatically when necessary.

```html
<article composite>
  ...
</article>
```

[Learn more](markup.md#composite)


### events

This declaration binds one or more events
(see https://www.w3.org/TR/DOM-Level-3-Events) to an HTML element. Events
provide primary functions for event-driven refreshing of other HTML elements
(see [render](markup.md#render) for more information), and for validating and
synchronizing and synchronization of HTML elements with the corresponding
JavaScript models (see [validate](markup.md#validate) for more information). 

```html
<span id="output1">{{#text1.value}}</span>
<input id="text1" type="text"
    events="mouseup keyup change" render="#output1"/>
```

[Learn more](markup.md#events)


### render

The `render` attribute requires the combination with the `events` attribute.
Together they define which targets with which occurring events
be refreshed.  
The `render` attribute expects a CSS selector or query selector as value.
which sets the targets.

```html
<span id="output1">{{#text1.value}}</span>
<input id="text1" type="text"
    events="mouseup keyup change" render="#output1"/>
```

[Learn more](markup.md#render)


### validate

The `validate` attribute requires the combination with the `events` attribute.
Together they define and control the synchronization between the markup of a
Composites and the corresponding JavaScript model.  
If `validate` is used, the JavaScript model must implement a corresponding
validate method: `boolean Model.validate(element, value)`.  
The return value must be a Boolean value and so only the return value `true`
synchronizes the value from the composite into the JavaScript model.  
A general strategy or standard implementation for error output is deliberately
not provided, as this is too strict in most cases and can be implemented
individually as a central solution with little effort.

```html
<form id="Model" composite>
  <input id="text1" type="text" placeholder="e-mail address"
      validate events="mouseup keyup change" render="#Model"/>
  <input type="submit" value="submit" validate events="click"/>
</form>
```

[Learn more](markup.md#validate)


## Expression Language

Expressions or the Expression Language (EL) is a simple access to the
client-side JavaScrript and thus to the models and components in Seanox
aspect-js. In the expressions the complete JavaScript API is supported, which is
enhanced with additional keywords, so that also the numerous arithmetic and
logical operators can be used.

The expression language can be used in the markup as free text and in the
attributes of the HTML elements. JavaScript and CSS elements are excluded. The
expression language is not supported here.    
When used as free text, pure text (plain text) is always generated as output.
The addition of markup, especially HTML code, is not possible and is only
supported with the attributes `output` and `import`.
 
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

Expressions can create and use global variables at runtime.

```html
{{now:new Date()}}
<p>
  Today is {{now.toDateString()}}
  and it's {{now.toLocaleTimeString()}} o'clock.
</p>
```

[Learn more](expression.md)


## DataSource

DataSource is a NoSQL approach to data storage based on XML data in combination
with multilingual data separation, optional aggregation and transformation. A
combination of the approaches of a read only database and a CMS.  
The DataSource is based on static data that is queried using XPath and the
result can be concatenated, aggregated and transformed using XSLT.

[Learn more](datasource.md)


## Resource Bundle (Messages)

(Resource)Messages is a static [DataSource](datasource.md) extension for
internationalization and localization. The implementation is based on a set of
key-value or label-value data which is stored in the `locales.xml` of the
DataSource.

[Learn more](messages.md)


## Model View Controller

The Model View Controller (MVC) is a design pattern for separating interaction,
data, and presentation.

```
+-------------------------------------------+--------------+---------------------------------+
|  View                                     |  Controller  |  Model                          |
+-------------------------------------------+--------------+---------------------------------+
|  Markup                                   |  Composite   |  JavaScript                     |
|                                           |  Path        |                                 |
|                                           |  SiteMap     |                                 |
+-------------------------------------------+--------------+---------------------------------+
|  <form id="model" composite>              |  aspect-js   |  var model = {                  |
|    <input id="message" events="change"/>  |              |      message:"",                | 
|    <button id="submit"/>                  |              |      submit: {                  |
|  </form>                                  |              |          onClick: function() {  |
|                                           |              |          }                      |
|                                           |              |      }                          |
|                                           |              |  }                              |
+-------------------------------------------+--------------+---------------------------------+
```

[Learn more](mvc.md)

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

In accordance with the file system, also here absolute and relative paths as
well as functional paths are supported.  
Paths consist exclusively of word characters and underscores (based on composite
IDs) and must begin with a letter and use the hash character as separator and
root.

[Learn more](mvc.md#virtual-paths)


### Object-/Model-Binding

TODO:


## Components

TODO:


### Object-/Model-Binding

TODO:


## Test

The Test-API supports the implementation and execution of integration tests and
can be used for suites, scenarios and single test cases.

As a modular component of Seanox aspect-js, the Test-API is included in every
release that can be easily removed. Because the Test-API has some special
features regarding error handling and console output, the Test-API must be
activated deliberately at runtime.

```javascript
Test.activate();

Test.create({test:function() {
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

Test.create({test:function() {
    Assert.assertTrue(true);
}});

Test.start();
```

Task is primarily a meta object.  

```
{name:..., test:..., timeout:..., expected:..., ignore:...}
```


#### name

Optional name of the test task.


#### test

An implemented method to be executed as a test.


#### timeout

Optional the maximum runtime of the test item in milliseconds.
Exceeding this limit will cause the test to fail.  
A value greater than 0 is expected, otherwise the timeout is ignored.


#### expected

Optional to test the occurrence of defined errors.
The error must occur if the test is successful.
An error object or a RegExp is expected as value.


#### ignore

Optional true, if the test is to be ignored.

[Learn more](test.m#task)


### Scenario

A scenario is a sequence of a lot of test cases (tasks).

```javascript
Test.activate();

Test.create({test:function() {
    Assert.assertTrue(true);
}});
Test.create({name:"example", timeout:1000, test:function() {
    Assert.assertTrue(true);
}});
Test.create({error:Error test:function() {
    throw new Error();
}});
Test.create({error:/^My Error/i, test:function() {
    throw new Error("My Error");
}});
Test.create({ignore:true, test:function() {
    Assert.assertTrue(true);
}});

Test.start();
```

### Suite

A suite is a complex bundle of different test cases, scenarios and other suites.
Usually a suite consists of different files, which then represent a complex
test. An example of a good suite is a cascade of different files und the test
can be started in any file and place. This makes it possible toperform the
integration test on different levels and with different complexity.

[Learn more](test.m#suite)


### Assert

The test cases are implemented with assertions. The Test-API provides elementary
assertions, you can implement more. The function is simple. If an assertion was
not ´true´, a error is thrown.

```javascript
Test.activate();

Test.create({test:function() {

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


## Output

As a development tool, browsers provide console output that can be used to log
informations.  
Logging supports different channels or levels: LOG, WARN, ERROR and INFO.

```javascript
console.log(message);
console.warn(message);
console.error(message);
console.info(message);
```

To be able to include console output in tests, the activated Test-API supports
forwarding, listeners and buffers for console output.


```javascript
var log   = console.output.log;
var warn  = console.output.warn;
var error = console.output.error;
var info  = console.output.info;

console.output.clear();

console.listen(function(level, message) {
    message = Array.from(arguments).slice(1);
    ...
});
```

[Learn more](test.m#output)


### Monitoring

TODO:


### Control

TODO:


### Events

TODO:
