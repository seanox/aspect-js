[Resource Bundle](message.md) | [TOC](README.md#model-view-controller) | [Components](composite.md)
- - -

# Model View Controller

The Model View Controller (MVC) is a design pattern for separating interaction,
data and presentation. A distinction should be made between I/O controller and
application controller. The pure MVC design pattern means the I/O controller for
the transmission of interactions. Since this is provided by the operating system
and browser, the controller in Seanox aspect-js primarily refers to the
application controller.

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


## Controller

The (application)controller controls internal processes of an application (face
flow) and the binding of markup and JavaScript as well as the control of the
data flow between view and model, which is taken over by Composite, Paths and
SiteMap. This means that we can also speak of MVVM (Model View ViewModel) and 
MVCS (Model View Controller Service).


## Model

The model is a representable/projectable object. It receives (status)changes and
interactions of the view, which are transmitted by the controller, or offers the
view an interface to data as well as functions and services of the middleware.
The model serves primarily the view for the representation and management of the
states, for functional functionality it takes up further components.

In Seanox aspect-js models are represented by static JavaScript objects, which
are used as singletons/facades/delegates comparable to managed beans, so that
this can use further components and abstraction internally.


## View

The view is exclusively responsible for the representation or projection of a
model. Where projection is an important term because the way a model is
represented is not restricted.

In Seanox aspect-js the views are represented by the markup.


## Contents Overview

* [Controller](#controller)
* [Model](#model)
* [View](#view)
* [SiteMap](#sitemap)
  * [Terms](#terms)
    * [Page](#page)
    * [Face](#face)
    * [Facets](#facets)
    * [Face Flow](#face-flow)
  * [Configuration](#configuration)
    * [Face Flow](#face-flow-1)
    * [Permissions](#permissions)
    * [Acceptors](#acceptors)
  * [Navigation](#navigation)
  * [Permission Concept](#permission-concept)
  * [Acceptors](#acceptors)
* [Virtual Paths](#virtual-paths)
  * [Root Path](#root-path)
  * [Relative Path](#relative-path)
  * [Absolute Path](#absolute-path)
  * [Variable Path](#variable-path)
  * [Functional Path](#functional-path)
* [View Model Binding](#view-model-binding)
  * [Terms](#terms)
    * [namespace](#namespace)
    * [model](#model)
    * [property](#property)
    * [qualifier](#qualifier)
    * [composite](#composite)
    * [composite-id](#composite-id)
  * [Binding](#binding)
  * [Dock](#dock)
  * [Undock](#undock)
  * [Synchronization](#synchronization)
  * [Validation](#validation)
  * [Events](#events)


## SiteMap

The representation in Seanox aspect-js is multilayered and the views are
organized as page, faces and facets which are accessed with virtual paths. For
this purpose, SiteMap provides a hierarchical directory structure based on the
virtual paths for all views. The SiteMap then controls the access and the
visualization (show and hide) of the views, which is termed face-flow. Face-flow
and visualization are resolute and uses the DOM to insert and remove the views
(faces and facets).

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


### Terms


#### Page

In a single page application, the page is the elementary framework and runtime
environment of the entire application.


#### Face

A face is the primary projection of models/components/content. This projection
can contain additional substructures in the form of faces and sub-faces. Thus,
parent faces become partial faces if the path refers to a sub-face. In this
case, all parent faces are displayed partially, i.e. without their possibly
contained faces.


#### Facets

Facets are parts of a face (projection) and are not normally a standalone view.
For example, the input mask and result table of a search can be separate facets
of a face, as can articles or sections of a face. Both face and facet can be
accessed via virtual paths. The path to facets causes the surrounding face with
all its superordinate faces to be displayed.


#### Face Flow

Face-flow described the control of access and the visualization of views. The
SiteMap provides hooks for permission concepts and acceptors. With both things
the face-flow can be controlled and influenced. This way, the access to
paths/views can be stopped and/or redirected/forwarded with own logic.


### Configuration

For the configuration of the SiteMap the method `SiteMap.customize(...)` is
used. With this method it is possible to define and register the face-flow 
(paths, faces, facets), the permissions and the acceptors, for which the method
has different signatures.

The configuration can be called several times, even at runtime. The SiteMap
collects all configurations cumulatively. All paths, faces and facets are
summarized, acceptors and permit methods are collected in the order of their
registration. Because the configuration always uses a cumulative state, it is
later not comprehensible how the configuration was created.

The configuration of the SiteMap is only applied if an error-free meta object is
passed and no errors occur during processing.


#### Face Flow

The configuration is based on a meta object that is passed to method
`SiteMap.customize({meta})`. The keys (string) correspond to the paths and a
path always has a existing face as its target, partial paths without face can be
ignored. The values are arrays with the valid facets for a path/face. Facets do
not need their own path, which is automatically derived/created.

```javascript
SiteMap.customize({...});
```

```javascript
SiteMap.customize({
    "#": ["news", "products", "about", "contact", "legal"],
    "#products#papers": ["paperA4", "paperA5", "paperA6"],
    "#products#envelope": ["envelopeA4", "envelopeA5", "envelopeA6"],
    "#products#pens": ["pencil", "ballpoint", "stylograph"],
    "#legal": ["terms", "privacy"],
    ...
});
```

__The navigation only accepts paths that are defined in the face-flow. Invalid
paths are forwarded to the next higher known/permitted path, based on the
requested path.__

__Without a face flow there are no valid paths. If a user interface or
components without face flow are used, they must be marked as _static_
otherwise the components are hidden (removed from the DOM).__

```html
<html>
  <body>
    <form id="model" composite static>
      ...
    </form>
  </body>
</html>
```


#### Permissions

The permission concept is based on permit method(s) that are passed together
with the face-flow meta object.

```javascript
SiteMap.customize({...}, function(path) {...});
```

```javascript
SiteMap.customize({
    "#": ["news", "products", "about", "contact", "legal"],
    "#products#papers": ["paperA4", "paperA5", "paperA6"],
    "#products#envelope": ["envelopeA4", "envelopeA5", "envelopeA6"],
    "#products#pens": ["pencil", "ballpoint", "stylograph"],
    "#legal": ["terms", "privacy"], ...},

    function(path) {
        ...
    }
});
```

All requested paths pass through the registered permit methods. These decide
what happens to the path. The following return values are expected from each
permit method:

`boolean true` The validation is successful and the iteration via further permit
methods is continued. If all permit methods return true and thus confirm the
path, it is used.

`string` The validation (iteration over further permit-methods) will be aborted
and it will be forwarded to the path corresponding to the string. 

`otherwise` The path is regarded as invalid/unauthorized, the validation
(iteration over further permit-methods) will be aborted and is forwarded to the
original path.


#### Acceptors

Acceptors work in a similar way to permit methods. In difference to this, the
methods of the acceptors are only called for those paths whose RegExp pattern
corresponds to the requested path. Also the methods of the acceptors are
expected to return the same kind of values as the [Permissions](#permissions)
methods. 

```javascript
SiteMap.customize(RegExp, function(path) {...});
```

```javascript
SiteMap.customize(/^phone.*$/i, function(path) {
    dial the phone number
});
SiteMap.customize(/^mail.*$/i, function(path) {
    send a mail
});
```


### Navigation

The navigation can be effected by changing the URL hash in the browser (direct
input), by using hash links, and in JavaScript with `window.location.hash`,
`window.location.href`, `SiteMap.navigate(path)` and `SiteMap.forward(path)`.

```html
<a href="#a#b#c">Goto root + a + b + c</a>
<a href="##">Back to the parent</a>
<a href="##x">Back to the parent + x</a>
```

```javascript
SiteMap.navigate("#a#b#c");
SiteMap.navigate("##");
SiteMap.navigate("##x");
```

```javascript
SiteMap.forward("#a#b#c");
SiteMap.forward("##");
SiteMap.forward("##x");
```

In difference to the navigate method, the forwarding is executed directly
instead of triggering an asynchronous forwarding by changing the location hash.

Relative paths without hash at the beginning are possible, but only work with
`SiteMap.navigate(path)`.

```javascript
SiteMap.navigate("x#y#z");
```


### Permission Concept

The permission concept is based on permit methods, which are defined as callback
methods with the configuration of the face-flow. Several permit methods can be
defined, which are verified with each requested path. Only if all permit methods
confirm the requested path with `true`, it will be used and the renderer will
render the dependent faces and facets and makes them visible.
 
More details can be found in chapter [Permissions](#permissions).


### Acceptors

Acceptors are executed together with the permission concept. They have the same
effect, but only affect paths that correspond to a regular expression. Acceptors
can be used to confirm permissions and/or for hidden background activities.

More details can be found in chapter [Acceptors](#acceptors).


## Virtual Paths

Virtual paths are used for navigation and control of face-flow. The target can
be a face, a facet or a function. For SPAs (Single-Page-Applications) the anchor
part of the URL is used for the paths.

```
https://example.local/example/#path
```

According to the file system, absolute, relative and additionally functional
paths are also supported here. Paths consist exclusively of word characters,
underscores and optionally the minus character (based on combined) IDs. The hash
character is used as separator and root. Spaces are not supported.

```
#a#b#c#d
```

Paths use as lowercase letters. Upper case letters are automatically replaced by
lower case letters when normalizing.

```
#a#b#c#d == #A#b#C#d
```

Between the path segments, the hash character (`#`) can also be used as a
back/parent jump directive. The back jump then corresponds to the number of
additional hash characters.

```
#a#b#c#d##x   -> #a#b#c#x
#a#b#c#d###x  -> #a#b#x
#a#b#c#d####x -> #a#x
```

The navigation can be effected by changing the URL hash in the browser (direct
input), by using hash links, and in JavaScript with `window.location.hash`,
`window.location.href`, `SiteMap.navigate(path)` and `SiteMap.forward(path)`.

There are different types of paths, which are explained below.


### Root Path

These paths are empty or contain only one hash character.

```html
<a href="#">Back to the root</a>
```


### Relative Path

These paths begin without hash or begin with two or more hash characters (`##+`)
and are relative to the current path.

```html
<a href="##">Back to the parent</a>
<a href="##x">Back to the parent + x</a>
```

Relative paths without hash at the beginning are possible, but only work with
`SiteMap.navigate(path)`.

```javascript
SiteMap.navigate("x#y#z");
```


### Absolute Path

These paths begin with one hash characters. All paths will be balanced, meaning
the directives with multiple hash characters are resolved.

```html
<a href="#">Back to the root</a>
<a href="#a#b#c">Back to the root + a + b + c</a>
```


### Variable Path

Variable paths are a mapping from virtual to physical paths. This explanation
sounds a bit confusing in the context of the SiteMap and its virtual paths.
Here, it means another additional virtual mapping of paths inside of the
SiteMap. A path of the SiteMap represents a fixed target, which can be Face and
Facet. The path can now be extended without changing the target. The target can
then use the extended path, for example, to pass parameters, which is comparable
to `PATH_TRANSLATED` and `PATH_INFO` in CGI. 

To configure variable paths, the character string `...` is used, which can
follow a facet or be used directly as a facet.

```javascript
SiteMap.customize({
    "#": ["home", "projects", "about", "contact..."],
    "#project": ["..."],
    ...
});
```

The paths `#contact` and `#project` are variable in this example and can
therefore be extended as required. The target is fixed in both cases and the
requests are answered by `#contact` and `#project`. The extension of the path
can be determined with the method `SiteMap.lookup(path)`. The returned meta
object contains the extended path in the data property for variable paths with
extended paths.

```
SiteMap.lookup("#contact#support");
    returns {path:"#contact#support", face:"#", facet:"contact", data:"#support"}

SiteMap.lookup("#project#a#b#c");
    returns {path:"#contact#support", face:"#project", facet:"", data:"#a#b#c"}
```


### Functional Path

The path consists of three or more hash characters (`###+`) and are only 
temporary, they serve a function call without changing the current path (URL 
hash). This is useful for functional links, e.g. to open a popup or to send a
mail in the background.

```html
<a href="###">Do something, the logic is in the model</a>
```


## View Model Binding

View model binding is about linking HTML elements with corresponding existing
static JavaScript objects (models), which in Seanox aspect-js is a part of the
Model View Controller and the Composite API.

SiteMap is an extension and is based on the Composite API. For a better
understanding, the functionality is described here in the Model View Controller.


### Terms


#### namespace

TODO:


#### model

The model (model component / component) is a static JavaScript object in any
namespace and provides the logic for the user interface (UI component) and the
transition from user interface to business logic and/or the backend. The linking
and/or binding of markup and JavaScript model is done by the Composite API. For
this purpose, an HTML element must have a valid and unique ID. The ID must meet
the requirements of the namespace.

More details about the binding of object, field and value can be found in
chapter [Binding](#binding).

The Composite API can distinguish between the presence and absence of model
components in the user interface due to their existence in the DOM. The model
component is informed about the static method `dock` when it appears in the DOM
and about the static method `undock` when it is removed from the DOM. With which
the model component can be prepared or finalized. The implementation of both
methods is optional.

```javascript
const model = {
    dock() {
    },
    undock() {
    }
};
```

TODO:


#### property

Is a property in a static model (model component / component). It corresponds to
an HTML element with the same ID in the same namespace. The ID of the property
can be relative or use an absolute namespace. If the ID is relative, the
namespace is defined by the parent composite element.

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

The Composite API synchronizes event-driven the property in the model with the
value of the HTML element. For an HTML element, the relevant events are defined
using the attribute of the same name.


#### qualifier

In some cases, the identifier (ID) may not be unique. For example, in cases
where properties are arrays or an iteration is used. In these cases the 
identifier can be extended by an additional unique qualifier separated by a
colon. Qualifiers behave like properties during view model binding and extend
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


#### composite

Composite is a construct of markup, JavaScript model, CSS and possibly other
resources. It describes a component/module without direct relation to the
representation.


#### composite-id

It is a character sequence consisting of letters, numbers and underscores and
optionally supports the minus sign if it is not used at the beginning or end. A
composite ID is at least one character long and is composed by combining the
attributes `ID` and `composite`.

```html
<html>
  <body>
    <form id="model" composite>
      ...
    </form>
  </body>
</html>
```

The composite ID is required for MVC, view model binding, synchronization and
validation and must therefore be a valid and unique identifier within the 
JavaScript namespace. The identifier is also used for face flow to identify and
control faces and facets and generally models/components.


### Binding

In Seanox Aspect-js, components are also termed composites or modules because
they consist of markup (view), corresponding JavaScript (model) and more.

The view model binding is about the connection of view/markup/HTML with the
corresponding JavaScript model. The binding forwards interactions and status
changes of the view to the model and established an interface for middleware
functions and services for the view. This avoids a manual implementation and
declaration of events as well as synchronization and interaction between UI and
application logic.

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
      <input type="text" id="message" value="{{model.text.value}}" events="change"/>
      <input type="submit" id="submit"/>
      ...
    </form>
  </body>
</html>
```

The binding is based on the IDs of the HTML elements in the markup. These IDs
define the namespace and the JavaScript model to be used. IDs can use relative
and absolute namespaces, but are primarily based on the position of an element
in the DOM and a corresponding object structure as a JavaScript model.


### Dock

If a composite is used/inserted in the DOM, the corresponding model is
docked/linked and when removing from the DOM, the corresponding model is
undocked/unlinked. In both cases the model can optionally implement appropriate
methods. The dock-method is executed before rendering, before inserting the
composite into the DOM, or after loading the page during initial rendering, and
can be used to prepare the view. The undock-method is executed after the
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

For a composite in combination with a condition, the call of the methods depends
on the result of the condition.


### Undock

More details can be found in chapter [Dock](#undock)


### Synchronization

In addition to the static linking and assignment of HTML elements to JavaScript
models, the view model binding also includes the synchronization of values
between the HTML elements and the fields of the JavaScript models. The
synchronization depends on events that are declared for the HTML element with
the attribute `events` and so the synchronization is executed only when one of
the defined events occurs.

More details about the usage can be found in chapter
[events](markup.md#events).


### Validation

The synchronization of values between view (HTML elements) and the fields of
JavaScript models can be monitored and controlled by validation. Validation is
declared in HTML via the `validate` attribute in combination with the `events`
attribute and requires a corresponding validation method in the JavaScript
model.

More details about the usage can be found in chapter
[validate](markup.md#validate).


### Events

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
    <div id="contact" composite static>
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


- - -

[Resource Bundle](message.md) | [TOC](README.md#model-view-controller) | [Components](composite.md)
