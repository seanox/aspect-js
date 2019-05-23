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


## Attribute

The declarative approach is primarily implemented using attributes in aspect-js
and can be used with all HTML elements and in combination. Excluded are
`SCRIPT`,  which is only supported with the type `composite/javascript`, and
`STYLE`, which is not supported. The values of the attributes can be static or
dynamic when the expression language is used.   
If an attribute contains an expression, the attribute and the value become
unchangeable, because the renderer sets them again with the updated value of the
initial expression each time it is refreshed (render cycle).

TODO:
