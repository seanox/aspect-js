[Model View Controller](mvc.md) | [TOC](README.md#components) | [Reactivity Rendering](reactive.md)
- - -

# Components

The implementation of Seanox aspect-js focuses on a modular and component-based
architecture. The framework supports a declarative designation of components in
the markup, the outsourcing and automatic loading of resources, as well as an
automatic object/model binding.


## Contents Overview

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
* [Object/Model Binding](#objectmodel-binding)
  * [Namespace](#namespace)
  * [Scope](#scope)
  * [Model](#model)
  * [Property](#property)
  * [Qualifier](#qualifier)
  * [Binding](#binding)
  * [Events](#events)
  * [Synchronization](#synchronization)
  * [Validation](#validation)


## Module

A module represents a closed functional program unit, which is usually provided
as a program library.


## Component

A component describes a functionally and/or technically independent part, which
may consist of one or more modules, or a module may provide one or more components.


## Composite

A composite is a functionally independent component that can consist of markup,
CSS and JavaScript(-Model) and optionally other resources.  
In relation to the model-view-controller approach, a composite can provide model
and view.

__This distinguishes the composite concept from the JavaScript module concept,__
__which can also be used. Another important difference concerns the loading__
__and execution of JavaScript. With composites it is done in a render cycle__
__linear/sequential and therefore synchronous.__


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

The inner markup, CSS and JavaScript of composites can be outsourced.  
The default directory `./modules` can be changed with the property
`Composite.MODULES`. The file name of the outsourced resources is derived from
the ID of the as composite marked HTML element. Which resources or parts of the
component are swapped out can be decided individually for each component. 

```
+ modules
  - example.css
  - example.js
  - example.html
- index.html
```

The default behavior derives the name of the resources from the Composite ID
and then uses it as the lower case at the beginning. This behavior can be
changed with the attribute [strict](markup.md#strict) so that the Composite ID
is used unchanged for the resources.


## Loading

The loading of resources and the object/model binding is done partially when the
composite is needed in the UI, which controls the [SiteMap](sitemap.md) as a
central face flow management and thus minimizes the loading time considerably,
because depending on the situation, only the resources of the actively used
composites are loaded by the UI. 
The outsourcing and loading of resources at runtime is optional and can be used
completely, partially or not at all. There is a fixed sequence for reloading and
including: CSS, JavaScript, HTML/Markup.  
If the request of a resource with status 404 is answered, it is assumed that
this resource has not been outsourced. If requests are not answered with status
200 or 404, an error is assumed.  
Resources are loaded only once with the first request of the component for the
UI and the content is then cached.


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
    },
    logon: {
        onClick(event) {
        }
    }
}
```


### HTML

HTML/Markup is only loaded for a composite if the HTML element of the component
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
+ modules
  - common.css
  - common.js
  - ...
- index.html
```


## Object/Model Binding


#### Namespace

Similar to packages in other programming languages, namespaces can be used to
map hierarchical structures and group thematically related components and
resources.  
The implementation is realized in JavaScript on the object level.  
Because it is not a real element of the programming language, this is
represented by chaining objects to an object tree.  
Each level in this object tree represents a namespace.  
As typical for object identifiers, namespaces use letters, numbers and
underscores separated by a dot. As a special feature, arrays are also supported.
If a level in the namespace is a pure number, an array is assumed.

The object/model binding is based on the IDs of the composites and their
position and order in the DOM.    
The root of the namespace always forms a composite ID.  
The namespace can be absolute, that is, the namespace corresponds to a composite
ID, or it can be based on the namespace of a parent composite in the DOM.

```html
<html>
  <body>
    <div id="A">
      <div id="B">
        <div id="C">
        </div>
      </div>
    </div>
  </body>
</html>  
```

Examples of possible namespaces:

`a` + `a.b` + `a.b.c`  
`b` + `b.c`  
`c`


#### Scope

The scope is based on the namespace as a description text and maps this on the
object level.  


### Model

A model is a JavaScript object in any namespace that stores the states of the
user interface/view and provides an interface for the transition from the user
interface/view to the business logic and/or backend.  
Conceptually, the implementation of the design patterns facade and delegation is
intended, so that models internally use further components and abstraction.


#### Property

It is a property inside a model that references HTML elements inside a composite
with the corresponding ID.  
The elements of the properties use relative identifiers (ID). The namespace is
based on the namespace of the composite and can be extended by additional parent
elements with IDs.

```javascript
const model = {
    foo: {
        fieldA: null
    }
};
```

```html
<html>
  <body>
    <div id="model" composite>
      <div id="foo">
        <input id="fieldA" type="text" events="change"/>
      </div>
    </div>
  </body>
</html>
```

The Composite API synchronizes the property in the model with the value of the
HTML element event-driven. For an HTML element, the corresponding events are
defined by an attribute with the same name.


### Qualifier

In some cases an identifier (ID) is not unique. For example, when properties are
arrays or an iteration is used in the markup. In these cases the identifier can
be extended by an additional unique qualifier separated by a colon.   
Qualifiers have the effect of properties in the object/model binding and extend
the namespace.

```html
<input type="text" id="identifier">
<input type="text" id="identifier:qualifier">
```
 
```html
<html>
  <body>
    <form id="model" composite static iterate="{{set:['A','B','C']}}">
      <input type="text" id="fieldA:{{set.value}}">
      ...
    </form>
  </body>
</html>
```


### Binding

The linking or binding of markup and JavaScript (model) is done via the
Composite API. For this purpose, an HTML element must have the attribute
`composite` and a valid and unique ID that meets the requirements of the
namespace.
The Composite API detects and monitors the existence of composite markup in the
DOM. Thus, the corresponding (JavaScript) model can be informed via the `dock`
`undock` methods when the composite is added to or removed from the DOM as a
component.  

The implementation of both methods is optional.

```javascript
const model = {
    dock() {
    },
    undock() {
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

The dock method is executed before rendering, before inserting the composite
into the DOM, or after loading the page during the first render, and can be used
to prepare model and view.  
The undock method is executed after the composite is removed from the DOM and
can be used for postprocessing, cleanup and finalization of the model.

For a composite in combination with a condition, the method call depends on the
result of the condition.


### Events

TODO:

```javascript
TODO:
```

```html
TODO:
```


### Synchronization

TODO:

```javascript
TODO:
```

```html
TODO:
```


### Validation

TODO:

```javascript
TODO:
```

```html
TODO:
```


- - -

[Model View Controller](mvc.md) | [TOC](README.md#components) | [Reactivity Rendering](reactive.md)
