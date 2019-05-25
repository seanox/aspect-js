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


## Expression Language

Expressions or the Expression Language (EL) is a simple access to the
client-side JavaScrript and thus to the models and components in aspect-js. In
the expressions the complete JavaScript API is supported, which is enhanced with
additional keywords, so that also the numerous arithmetic and logical operators
can be used.

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


## Attributes

The declarative approach is primarily implemented using attributes in aspect-js
and can be used with all HTML elements and in combination. Excluded are
`SCRIPT`,  which is only supported with the type `composite/javascript`, and
`STYLE`, which is not supported. The values of the attributes can be static or
dynamic when the expression language is used.   
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
console output. The interval starts automatically with refreshing the declared
HTML element and will terminated and/or removed when:  
- The element no longer exists in the DOM.
- the condition attribute is `false  

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
Composites are modular components and have a versatile meaning in aspect-js.  
They are used by the [SiteMap](mvc.md#sitemap) as faces, so as targets for
virtual paths in the face flow, which has a direct effect of the visibility of
the composites.
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

TODO:
