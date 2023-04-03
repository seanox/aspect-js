[Resource Bundle](message.md) | [TOC](README.md#model-view-controller) | [Components](composite.md)
- - -

# Model View Controller

The Model View Controller (MVC) is a design pattern for separating interaction,
data and presentation. A distinction should be made between I/O controller and
application controller. The pure MVC design pattern means the I/O controller for
the transmission of interactions. Since this is provided by the operating system
and browser, Seanox aspect-js ostensibly refers to the application controller.

```
+------------------------------------------+--------------+-----------------------+
|  View                                    |  Controller  |  Model                |
+------------------------------------------+--------------+-----------------------+
|  Markup                                  |  Composite   |  JavaScript           |
|                                          |  Reactive    |                       |
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

The (application)controller controls internal processes within an application
(face flow) and takes over the data flow between view and model with the
view-model binding, whereby we can also speak of MVVM (Model-View-ViewModel) and
MVCS (Model-View-Controller-Service) here.


## Model

Models are representable/projectable static JavaScript objects that can provide
and receive data, states and interactions for views, comparable to managed beans
and DTOs (Data Transfer Objects). As singletons/facades/delegates, they can use
other components and abstractions, contain business logic themselves, and be a
link between the user interface (view) and middleware (backend).

The required view model binding is part of the Model View Controller and the
Composite API.

Details about view-model binding are described in chapter
[Model-View-Controller - Binding](mvc.md#binding).


## View

The view is exclusively responsible for the representation or projection of a
model. Where projection is an important term because the way a model is
represented is not restricted.

In Seanox aspect-js the views are represented by the markup.


## Contents Overview

* [Controller](#controller)
* [Model](#model)
* [View](#view)
* [View Model Binding](#view-model-binding)
  * [Terms](#terms)
    * [Namespace](#namespace)
    * [Model](#model)
    * [Property](#property)
    * [Qualifier](#qualifier)
    * [Unique Identifier](#unique-identifier)
    * [Composite](#composite)
    * [Composite-ID](#composite-id)
  * [Binding](#binding)
  * [Dock](#dock)
  * [Undock](#undock)
  * [Synchronization](#synchronization)
  * [Validation](#validation)
  * [Events](#events)


## View Model Binding

View model binding is about linking HTML elements with corresponding existing
static JavaScript objects (models), which in Seanox aspect-js is a part of the
Model View Controller and the Composite API.

SiteMap is an extension and is based on the Composite API. For a better
understanding, the functionality is described here in the Model View Controller.


### Terms


#### Namespace

TODO:


#### Model

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

References an element with an ID within the DOM of a composite with a
corresponding property in the model. The namespace is based on that of the
composite, which can be extended by parent elements with IDs in the DOM.

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


#### Qualifier

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


#### Unique Identifier

TODO:


#### Composite

Composite is a construct of markup (view), JavaScript object (model), CSS and
possibly other resources. It describes a component/module without direct
relation to the representation.


#### Composite-ID

It is a character sequence consisting of letters, numbers and underscores. A
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

In Seanox aspect-js, components are also termed composites or modules because
they consist of markup (view), corresponding JavaScript object (model) and more.

The view model binding is about the connection of view/markup/HTML with the
corresponding JavaScript object. The binding forwards interactions and status
changes of the view to the model and established an interface for middleware
functions and services for the view. This avoids a manual implementation and
declaration of events as well as synchronization and interaction between view
and application logic.

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
define the namespace and the JavaScript object to be used. IDs can use relative
and absolute namespaces, but are primarily based on the position of an element
in the DOM and a corresponding object structure in JavaScript.


### Dock

If a composite is used/inserted in the DOM, the corresponding model is
docked/linked and when removing from the DOM, the corresponding model is
undocked/unlinked. In both cases the model can optionally implement appropriate
methods. The method `dock` is executed before rendering, before inserting the
composite into the DOM, or after loading the page during initial rendering, and
can be used to prepare the view. The method `undock` is executed after the
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
objects (models), the view model binding also includes the synchronization of
values between the HTML elements and the fields of the JavaScript object. The
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
object (model).

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
