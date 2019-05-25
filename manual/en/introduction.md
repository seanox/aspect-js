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

TODO:
