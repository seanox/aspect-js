[Model View Controler](mvc.md) | [TOC](README.md#components) | [Extension](extension.md)
- - -

# Components

The implementation of Seanox aspect-js focuses on a modular and component-based
architecture. The framework supports a declarative designation of components in
the markup, the outsourcing and automatic loading of resources, as well as an
automatic object/model binding.


## Contents Overview

* [Terms](#terms)
  * [Module](#module)
  * [Component](#component)
  * [Composite](#composite)
* [Structure](#structure)
* [Outsourcing](#outsourcing)
* [Loading](#loading)
  * [CSS](#css)
  * [JavaScript](#javascript)
  * [HTML](#html)
* [Common Standard Component](#common-standard-component)    
  
  
# Terms


## Module

A module represents a closed functional program unit, which is usually provided
as a program library.


## Component

A component describes a functionally and/or technically independent part, which
may consist of one or more modules, or a module may provide one or more components.


## Composite

A composite is a functionally independent component that can consist of markup,
CSS and JavaScript(-Model) and optionally other resources.
  

## Structure

The initial markup of a component consists of an HTML element with a unique ID
that is marked as composite.

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


## Outsourcing

The inner markup, CSS and JavaScript can be stored in the file system.  
The default directory `./modules` can be changed with the property
`Composite.MODULES`.  
The file name of the outsourced resources is derived from the ID of the as
composite marked HTML element. Which resources or parts of the component are
swapped out can be decided individually for each component. 

```
+- modules
|  |
|  +- example.css
|  +- example.js
|  +- example.html
|
+- index.html
```


## Loading

The loading of resources and the object/model binding takes place partially when
the component is needed in the UI -- i.e. with the first visibility, which is
controlled via the [SiteMap](sitemap.md) as the central face-flow management and
thus minimizes the loading time considerably, since only the resources required
for the active UI components are loaded.  
The outsourcing and loading of resources at runtime is optional and can be
applied completely, partially and not at all. There is a fixed order for loading
and embedding: CSS, JS, HTML/Markup.  
If the request for a resource is answered with status 404, it is assumed that
this resource has not been swapped out. If requests are not answered with status
200 or 404, an error is assumed.  
The loading of resources is only performed once with the first request of the
component for the UI.


### CSS

CSS is inserted into the HEAD element as a style element. Without a HEAD
element, the insertion causes an error.


### JavaScript

JavaScript is not inserted as an element, but executed directly with the eval
method. Because the eval method can use its own namespace for variables, it is
important to initialize the global variable better with `window[...]`.

```javascript
window['login'] = {
    validate(element, value) {
    }
    logon: {
        onClick(event) {
        }
    }
}
```


### HTML

HTML/Markup is only loaded for a component if the HTML element of the component
itself has no internal HTML and for which elements have not been declared with
the attributes `import` or `output`. Only in this case an empty component with
outsourced HTML/Markup is assumed.


## Common Standard Component

When the page is loaded and the framework and application are initialized, the
commons component is automatically loaded in the module directory, which can
consist of the JavaScript file `common.js` and/or the CSS stylesheet
`common.css`. Both files are intended for storing initial and application-wide
logic or styles.

```
+- modules
|  |
|  +- common.css
|  +- common.js
|  +- ...
|
+- index.html
```

## Object/Model-Binding

TODO:


- - -

[Model View Controler](mvc.md) | [TOC](README.md#components) | [Extension](extension.md)
