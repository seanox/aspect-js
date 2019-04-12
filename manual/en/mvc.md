# Model View Controller

The Model View Controller (MVC) is a design pattern for separating interaction,
data, and presentation.

```
+-------------------------------+--------------+-----------------------------+
|  View                         |  Controller  |  Model                      |
+-------------------------------+--------------+-----------------------------+
|  Markup                       |  Composite   |  JavaScript                 |
|                               |  SiteMap     |                             |
+-------------------------------+--------------+-----------------------------+
|  <form id="model" composite>  |  aspect-js   |  var model = {              |
|    <input id="message"/>      |              |    message:"",              | 
|    <button id="submit"/>      |              |    submit: {                |
|  </form>                      |              |      onClick: function() {  |
|                               |              |      }                      |
|                               |              |    }                        |
|                               |              |  }                          |
+-------------------------------+--------------+-----------------------------+
```


## Controller

For this we have to distinguish between I/O controller and application
controller. The original MVC design pattern refers to the I/O controller for
transmitting the interactions. Because the this I/O controller is part of the
operating system and the browser, the controller in aspect-js refers to the
application controller. The application controller controls the flow within an
application (face flow), takes over the binding of markup and JavaScript as well
as the control of the data flow between view and model.


## Model
The model is a displayable/projectable object.  
It receives (status) changes and interactions of the view, which are transmitted
by the controller, or provides the view with an interface to data as well as
functions and services of the middleware. The model primarily serves the view
for the representation and management of the states, for business functionality
it uses additional components.  
In aspect-js the models are represented by static JavaScript objects.  
Conceptually the implementation of the design pattern facade and delegation is
planned, so that the static models internally use additional components and
abstraction.


## View
The view is exclusively responsible for the presentation or projection of a
model. Projection is an important term because the way in which a model is
presented is not restricted.  
In aspect-js the views are represented by the markup.


## Contents Overview

* [Virtual Paths](#virtual-paths)
  * [Functional Path](#functional-path)
  * [Root Path](#root-path)
  * [Relative Path](#relative-path)
  * [Absolute Path](#absolute-path)
* [SiteMap](#sitemap)
  * [Configuration](#configuration)
    * [Face Flow](#face-flow)
    * [Permissions](#permissions)
    * [Acceptors](#acceptors)
  * [Navigation](#navigation)
  * [Permission Concept](#permission-concept)
  * [Acceptors](#acceptors-1)
* [Object-/Model-Binding](#object-model-binding)
  * [Terms](#terms)
    * [namespace](#namespace)
    * [scope](#scope)
    * [model](#model)
    * [field](#field)
    * [composite-id](#composite-id)
    * [identifier](#identifier)
    * [qualifier](#qualifier)
    * [composite](#composite)
  * [Binding](#binding)
  * [Dock](#dock)
  * [Undock](#undock)
  * [Synchronization](#synchronization)
  * [Validation](#validation)
  * [Events](#events)


## Virtual Paths

Paths are a reference to a target in face flow.  
The target can be a face, a facet or a function.

Paths consist exclusively of word characters and underscores (based on composite
IDs) and must begin with a letter and use the hash character as separator and
root.

```
#a#b#c#d
```

Paths use as lowercase letters. Upper case letters are automatically replaced by
lower case letters when normalizing.

```
#a#b#c#d == #A#b#C#d
```

Between the path segments, the hash character can also be used as a back jump
(parent) directive. The back jump then corresponds to the number of additional
hash characters.

```
#a#b#c#d##x   -> #a#b#c#x
#a#b#c#d###x  -> #a#b#x
#a#b#c#d####x -> #a#x
```

The navigation can be effected by changing the URL hash in the browser (direct
input), by using hash links, and in JavaScript with `window.location.hash`,
`window.location.href` and `SiteMap.navigate(path)`.

There are different types of paths, which are explained below.


### Functional Path

The path consists of three or more hash characters (`###+`) and are only
temporary, they serve a function call without changing the current path (URL
hash).  
This is useful for functional links, e.g. to open a popup or to send a
mail in the background.

```
<a href="###">Do something, the logic is in the model</a>
```


### Root Path

These paths are empty or contain only one hash character.

```
<a href="#">Back to the root</a>
```


### Relative Path

These paths begin without hash or begin with two or more hash (`##+`)
characters and are relative to the current path.
     
```
<a href="##">Back to the parent</a>
<a href="##x">Back to the parent + z</a>
```

Relative paths without hash at the beginning are possible, but only work with
`SiteMap.navigate(path)`.

```javascript
SiteMap.navigate("x#y#z");
```


### Absolute Path

These paths begin with one hash characters.
All paths will be balanced, meaning the directives with multiple hash characters
are resolved.

```
<a href="#">Back to the root</a>
<a href="#a#b#c">Back to the root + a + b + c</a>
```


## SiteMap

Static component for the use of a SiteMap for virtual paths.
SiteMap is a directory consisting of faces and facets that are addressed by
paths.

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

A face is the primary projection of the content. This projection may contain
additional sub-components, in form of facets and sub-faces.

Facets are parts of a face (projection) and are not normally a standalone
component. For example, the input mask and result table of a search can be
separate facets of a face, as can articles or sections of a face. Both face and
facet can be accessed via virtual paths. The path to a facet has the effect that
the face is displayed with any other faces, but the requested facet is displayed
in the visible area and focused.

Faces are also components that can be nested.  
Thus, parent faces become partial faces when the path refers to a sub-face.
A sub-face is presented with all its parent partial faces. If the parent faces
contain additional facets, these facets are not displayed. The parent faces are
therefore only partially presented.

With the SiteMap the structure of faces, facets and the corresponding paths are
described. The SiteMap controls the face flow and the presentation of the
components corresponding to a path.  
This means that you don't have to take care of showing and hiding components
yourself.

The show and hide is hard realized in the DOM.  
This means that if a component is hidden, it is physically removed from the DOM
and only added again when it is displayed.

When it comes to controlling face flow, the SiteMap provides hooks for
permission concepts and acceptors. With both things the face flow can be
controlled and influenced. This way, the access to paths can be stopped and/or
redirected/forwarded  with own logic.


### Configuration

For the configuration of the SiteMap the method `SiteMap.customize(...)` is
used. With this method it is possible to define and register the face flow
(paths, faces, facets), the permissions and the acceptors, for which the method
has different signatures.  

The configuration can be called several times, even at runtime. The SiteMap
collects all configurations cumulatively. All paths and facets are summarized,
acceptors and permit methods are collected in the order of their registration.  
However, a later determination of which metadata was registered with which
permit methods is not possible.

The configuration of the SiteMap is only applied if an error-free meta object is
passed and no errors occur during processing.


#### Face Flow

The configuration is based on a meta object that is passed to method
`SiteMap.customize({meta})`.  
The keys (string) correspond to the paths, the values are arrays with the valid
facets for a path. Facets do not need their own path, which is automatically
derived/created. Paths are only needed for faces.

```javascript
SiteMap.customize({...});
```

```javascript
var map = {
    "#": ["news", "products", "about", "contact", "legal"],
    "products#papers": ["paperA4", "paperA5", "paperA6"],
    "products#envelope": ["envelopeA4", "envelopeA5", "envelopeA6"],
    "products#pens": ["pencil", "ballpoint", "stylograph"],
    "legal": ["terms", "privacy"],
    ...
};

SiteMap.customize(map);
```

Or a littel shorter the direct call of the customize method:

```javascript
SiteMap.customize({
    "#": ["news", "products", "about", "contact", "legal"],
    "products#papers": ["paperA4", "paperA5", "paperA6"],
    "products#envelope": ["envelopeA4", "envelopeA5", "envelopeA6"],
    "products#pens": ["pencil", "ballpoint", "stylograph"],
    "legal": ["terms", "privacy"],
    ...
});
```

__The navigation only accepts paths that are defined in face-flow. Invalid__
__paths are forwarded to the next higher known/permitted path, based on the__
__requested path.__

__Without a face-flow there will be no valid paths. Should a user interface or__
__components be used without face-flow, they must be marked as ___static___,__
__otherwise the components will be hidden (removed from the DOM).__

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
with the face flow meta object.

```javascript
SiteMap.customize({...}, function(path) {...});
```

```javascript
SiteMap.customize({
    "#": ["news", "products", "about", "contact", "legal"],
    "products#papers": ["paperA4", "paperA5", "paperA6"],
    "products#envelope": ["envelopeA4", "envelopeA5", "envelopeA6"],
    "products#pens": ["pencil", "ballpoint", "stylograph"],
    "legal": ["terms", "privacy"], ...},
    
    function(path) {
        ...
});
```

All requested paths pass through the permit method(s). This can decide what
happens to the path. From the permit method a return value is expected, which
can have the following characteristics:

__True__ The validation is successful and the iteration via further permit
method is continued. If all permit methods return true and thus confirm the
path, it is used.

__String__ The validation (iteration over further permit-merhodes) will be
aborted and it will be forwarded to the path corresponding to the string. 

__Otherwise__ The path is regarded as invalid/unauthorized, the validation
(iteration over further permit-merhodes) will be aborted and is forwarded to the
original path.


#### Acceptors

Acceptors work in a similar way to permit methods.  
In difference, permit methods are called for each path and acceptors are only
called for those that match the RegExp pattern. Also from the permit method a
return value is expected, which have the same characteristics of
[Permissions](#permissions). 

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
`window.location.href` and `SiteMap.navigate(path)`.

```
<a href="#a#b#c">Goto root + a + b + c</a>
<a href="##">Back to the parent</a>
<a href="##x">Back to the parent + z</a>
```

```javascript
SiteMap.navigate("#a#b#c");
SiteMap.navigate("##");
SiteMap.navigate("##x");
```

Relative paths without hash at the beginning are possible, but only work with
`SiteMap.navigate(path)`.

```javascript
SiteMap.navigate("x#y#z");
```


### Permission Concept

The permission concept is based on permit methods, which are defined as callback
methods with the configuration of the face flow. Several permit methods can be
defined, which are verified with each requested path. Only if all permit methods
confirm the requested path with `true`, it will be used and the renderer will
render the dependent faces and facets and makes them visible.
 
More details can be found in chapter [Permissions](#permissions).


### Acceptors

Acceptors are executed together with the permission concept.  
They have the same effect, but only affect paths that correspond to a regular
expression. Acceptors can be used to confirm permissions and/or for hidden
background activities.  

More details can be found in chapter [Acceptors](#acceptors).


## Object-/Model-Binding

Object binding is about linking and assigning HTML elements that contain the
`composite` attribute and for which corresponding model objects exist in
JavaScript.

The Object-/Model-Binding part also belongs to the Model View Controller and  is
taken over by the Composite API in this implementation. SiteMap is an extension
and is based on the Composite API.  
For a better understanding, the functionality is described here in the Model
View Controler.


### Terms


#### namespace

The namespace is a sequence of characters or words consisting of letters,
numbers, and an underscore that describes the path in an object tree.  
The dot is used as a separator, it defines the boundary from one level to the
next in the object tree.  
Each element in the namespace must contain at least one character, begin with a
letter, and end with a letter or number.


#### scope

The scope is based on namespace and represents it on the object level.  
Means the namespace is the description text, the scope is the result if the
namespace was resolved in the object tree.


#### model

The model (model component / component) is a static JavaScript object in any
namespace and provides the logic for the user interface (UI component) and the
transition from user interface to business logic and/or the backend.  
The linking and/or binding of markup and JavaSchript model is done by the
Composite-API. For this purpose, an HTML element must be marked with the
attribute `composite` and have a valid Composite-ID. The Composite-ID must
meet the requirements of the namespace.

More details about the binding of object, field and value can be found in
chapter [Binding](#binding).

The Composite-API can distinguish between the presence and absence of model
components in the user interface due to their existence in the DOM. The model
component is informed about the static method `dock` when it appears in the DOM
and about the static method `undock` when it is removed from the DOM. With
which the model component can be prepared or finalized.  
The implementation of both methods is optional.

```javascript
var model = {
    dock: function() {
    },
    undock: function() {
    }
};
```


#### field

A field is a property of a static model (model component / component). It
corresponds to an HTML element with the same ID in the same namespace. The ID of
the field can be relative or use an absolute namespace. If the ID is relative,
the namespace is defined by the parent composite element.

```javascript
var model = {
    fieldA: null
};
```

```html
<html>
  <body>
    <div id="model" composite>
      <input id="fieldA" type="text" events="change"/>
    </div>
  </body>
</html>
```

The Composite-API synchronizes event-driven between the HTML element and the
model component property. For an HTML element, the corresponding events are
defined using the attribute of the same name.  
Synchronization only works in one direction, from the HTML element to the
property of the model component.
  

#### composite-id

The Composite-ID is an application-wide unique identifier.  
It is a sequence of characters or words consisting of letters, numbers, and
underscores that contains at least one character, begins with a letter, and ends
with a letter or number. A Composite-ID is formed by combining the attributes
`ID` and `composite`.

```html
<html>
  <body>
    <form id="model" composite>
      ...
    </form>
  </body>
</html>
```

The Composite-ID is important for MVC and is required for object/model binding,
synchronization and validation. Therefore, it is important that the sequence of
characters within the JavaScript namespace is valid and unique. The identifier
is also used for face flow to identify and control faces and facets and in
general to identify and control models/components.


#### identifier

The identifier is a unique value with the same requirements as a Composite-ID.
It is important for the assignment and binding of fields and properties for
object/model binding, validation and synchronization.

```html
<html>
  <body>
    <form id="model" composite static>
      <input type="text" id="fieldA">
      ...
    </form>
  </body>
</html>
```


#### qualifier

In some cases the identifier cannot be uniquely named, so in cases where the
target in the object is an array and/or the identifier is used in an iteration.
In these cases, the identifier can be extended by an additional unique
qualifier, separated by a colon.
Qualifiers are ignored during object/model binding. 

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

Composite describes the construct of markup, JavaScript model, and possibly
existing module resources. It describes a component/module without direct
reference to a concrete perspective.
 

### Binding

The object/model binding is about connecting markup/HTML elements with
JavaScript models. The models, also known as components, are static
constructs/classes in which properties and logic corresponding to the markup/DOM
are implemented. This avoids manual implementation and declaration of events as
well as synchronization and interaction between UI and the application logic.

__The binding requires a composite. Only elements of the type composite or__
__their children are included for the object/model binding.__

TODO:

Example for a relative namespace `a.b.c`:

```html
<html>
  <body>
    <div id="a">
      <div id="b">
        <div id="c"></div>
      </div>
    </div>
  </body>
</html>
```

```javascript
var a = {
    b: {
        c: {}
    }
};
```

Example for a mix of relative and absolute namespaces `a.b` and `b.c.d`:

```html
<html>
  <body>
    <div id="a">
      <div id="b">
        <div id="b.c">
          <div id="d"></div>
        </div>
      </div>
    </div>
  </body>
</html>
```

```javascript
var a = {
    b: {
    }
};

var b = {
    c: {
        d: {}
    }
};
```

### Dock

Models are static components and consist of Markup as composite and JavaScript
and more. Models therefore have no instances. If a composite is used in the DOM,
the corresponding module is docked and if the composite is removed from the DOM,
the corresponding module is undocked.  
In both cases, the model can implement appropriate methods.  
The dock-method is executed before rendering, before inserting the composite
into the DOM, or after loading the page during initial rendering, and can be
used to prepare the view. The undock-method is executed after the composite is
removed from the DOM and can be used to postprocess/clean the view.   

```javascript
var model = {
    dock: function() {
        ...
    },
    undock: function() {
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

Models are static components and consist of Markup as composite and JavaScript
and more. Models therefore have no instances. If a composite is used in the DOM,
the corresponding module is docked and if the composite is removed from the DOM,
the corresponding module is undocked.  
In both cases, the model can implement appropriate methods.  
The dock-method is executed before rendering, before inserting the composite
into the DOM, or after loading the page during initial rendering, and can be
used to prepare the view. The undock-method is executed after the composite is
removed from the DOM and can be used to postprocess/clean the view.   

```javascript
var model = {
    dock: function() {
        ...
    },
    undock: function() {
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


### Synchronization

In addition to the static linking and assignment of HTML elements to JavaScript
models, the object binding also includes the synchronization of values between
the HTML elements and the fields of the JavaScript models.  
The synchronization depends on events that are defined for the HTML element with
the attribute `events` and so the synchronization is executed only when one of
the defined events occurs.

More details about the usage can be found in chapter
[events](markup.md#events).


### Validation

The synchronization of values between the HTML elements and the fields of the 
JavaScript models can be monitored and controlled by validation.  
The use of validation is defined in the HTML element via the `validate`
attribute and requires the `events` attribute and a corresponding validate
method in the JavaScript model.
  
More details about the usage can be found in chapter
[validate](markup.md#validate).


### Events

TODO:


```javascript
var contact= {
    mail: {
        onClick: function(event) {
            var mail = "mailto:mail@local?subject=Test&body=Greetings";
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
