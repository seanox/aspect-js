[SiteMap](sitemap.md) | [TOC](README.md#components) | [Reactivity Rendering](reactive.md)
- - -

# Components

The implementation of Seanox aspect-js focuses on a modular and component-based
architecture. The framework supports a declarative designation of components in
the markup, the outsourcing and automatic loading of resources at runtime, as
well as an automatic view model binding.


## Contents Overview

* [Module](#module)
* [Component](#component)
* [Composite](#composite)
* [Structure](#structure)
* [Resources](#resources)
* [Loading](#loading)
  * [CSS](#css)
  * [JavaScript](#javascript)
  * [HTML](#html)
* [Common Standard Component](#common-standard-component) 
* [View Model Binding](#view-model-binding)
  * [Namespace](#namespace)
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
CSS and JavaScript(-Model) and optionally other resources. In relation to the
model-view-controller approach, a composite can provide model and view.

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


## Resources

The inner markup, CSS and JavaScript of composites can be outsourced. The
default directory `./modules` can be changed with the property
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

The default behavior derives the name of the resources from the Composite ID and
then uses it as the lower case at the beginning. This behavior can be changed
with the attribute [strict](markup.md#strict) so that the Composite ID is used
unchanged for the resources.


## Loading

The loading of resources and the view model binding is done partially when the
composite is needed in the view, which controls the [SiteMap](sitemap.md) as a
central face flow management and thus minimizes the loading time considerably,
because depending on the situation, only the resources of the actively used
composites are loaded by the view.

The outsourcing and loading of resources at runtime is optional and can be used
completely, partially or not at all. There is a fixed sequence for reloading and
including: CSS, JavaScript, HTML/Markup.

If the request of a resource with status 404 is answered, it is assumed that
this resource has not been outsourced. If requests are not answered with status
200 or 404, an error is assumed.

Resources are loaded only once with the first request of the component for the
view and the content is then cached.


### CSS

CSS is inserted into the HEAD element as a style element. Without a HEAD
element, the insertion causes an error.


### JavaScript

JavaScript is not inserted as an element, but executed directly with the eval
method. Since this uses a custom namespace and not the global namespace, global
variables must be deliberately created in the global namespace, for which the
window or Namespace API should be used.

```javascript
Namespace.create("login", {
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


## View Model Binding


#### Namespace

Comparable to packages in other programming languages, namespaces can be used
for hierarchical structuring of components, resources and business logic.

Although packages are not a feature of JavaScript, they can be mapped at the
object level by concatenating objects into an object tree. Here, each level of
the object tree forms a namespace, which can also be considered a domain.

Seanox aspect-js extends the JavaScript API with the Namespace API for this
purpose.

```javascript
Namespace.use(...);
Namespace.create(...);
Namespace.lookup(...);
Namespace.exists(...);
```

As is typical for the identifiers of objects, namespaces also use letters,
numbers and underscores separated by a dot. As a special feature, arrays are
also supported. If a layer in the namespace uses an integer, this layer is used
as an array.

Composites or their data objects (models) are comparable with static managed
beans that use the global namespace as singletons/facades/delegates. In order to
structure these data objects and implement domain concepts, corresponding
namespaces are required.

__If namespaces reflect the IDs of composites and thus HTML elements use the IDs
as ID attributes, the browser will create the HTML elements as variables in the
global namespace for these IDs. Interestingly, the browser ignores constants of
the same name and overwrites them with the HTML elements. Therefore, namespaces
should be created after the HTML element `BODY` in JavaScript or better use the
namespace API that uses the global namespace of window that the browser does not
overwrite.__

__Also for modules and JavaScript resources that are reloaded at runtime, using
the namespace API is the easiest way. Since reloading uses its own namespaces,
variables that are to be used across the board must consciously use the global
namespace, which the namespace API takes care of.__

```javascript
Namespace.create("masterdata", {
    regions: {
        ...
    },
    languages: {
        ...
    }
};
```

In markup, namespaces are formed from the IDs of nested composites if they use
the attribute `namespace`.

```html
<div id="masterdata" composite namespace>
  <div id="regions" composite namespace>
    Namespace: masterdata.regions
  </div>
</div>
```

If there are other elements with an ID between the composites, they have no
effect.

```html
<div id="masterdata" composite namespace>
  <section id="section">
    <form id="form">
      <div id="regions" composite namespace>
        Namespace: masterdata.regions
        Elements section and form are ignored 
      </div>
    </form>
  </section>
</div>
```

Even more special in a namespace chain are composites without the attribute
`namespace.` These composites have a decoupling effect and have no namespace
themselves. New namespaces can then be started within these composites,
independent of parent namespaces.

```html
<div id="Imprint" composite namespace>
  namespace: Imprint
  <div id="Contact" composite>
    namespace: Contact
    <div id="Support" composite namespace>
      namespace: Support
      <div id="Mail" composite namespace>
        namespace: Support.Mail
      </div>
      <div id="Channel" composite namespace>
        namespace: Support.Channel
      </div>
      ...
    </div>
    <div id="Community" composite namespace>
      namespace: Community
      <div id="Channel" composite namespace>
        namespace: Community.Channel
      </div>
      ...
    </div>
  </div>
</div>
```

This behavior was introduced with the idea of micro-frontends, which use their
own domains and are to be reused in various places. This way, domain-related
components can be implemented in the static world of Seanox aspect-js.

Namespaces also have effects on resources and modules. Thus, namespaces in the
markup initially have only a textual character and can also exist and be used
without a corresponding JavaScript object. Only the syntax of the namespaces is
checked in the markup. If this is valid, the namespaces are applied directly to
the path of modules and their resources and extend the path from the module
directory.


### Model

Models are representable/projectable static JavaScript objects that can provide
and receive data, states and interactions for views, comparable to managed beans
and DTOs (Data Transfer Objects). As singletons/facades/delegates, they can use
other components and abstractions, contain business logic themselves, and be a
link between the user interface (view) and middleware (backend).

The required view model binding is part of the Model View Controller and the
Composite API.

Details about view-model binding are described in chapter
[Model-View-Controller - Binding](mvc.md#binding).


#### Property

It is a property inside a model that references HTML elements inside a composite
with the corresponding ID. The elements of the properties use relative
identifiers (ID). The namespace is based on the namespace of the composite and
can be extended by additional parent elements with IDs.

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
be extended by an additional unique qualifier separated by a colon. Qualifiers
have the effect of properties in the view model binding and extend the
namespace.

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

The linking or binding of markup and JavaScript object (model) is done via the
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

[SiteMap](sitemap.md) | [TOC](README.md#components) | [Reactivity Rendering](reactive.md)
