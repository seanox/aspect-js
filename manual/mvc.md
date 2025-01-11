&#9665; [Resource Bundle](message.md)
&nbsp;&nbsp;&nbsp;&nbsp; &#8801; [Table of Contents](README.md#model-view-controller)
&nbsp;&nbsp;&nbsp;&nbsp; [Routing](routing.md) &#9655;
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


## Model

Models are representable/projectable static JavaScript objects that can provide
and receive data, states and interactions for views, comparable to managed beans
and DTOs (Data Transfer Objects). As singletons/facades/delegates, they can use
other components and abstractions, contain business logic themselves, and be a
link between the user interface (view) and middleware (backend). The required
view model binding is part of the Model View Controller and the Composite API.
Details about view-model binding are described in chapter [Model-View-Controller
    - Binding](mvc.md#binding).


## View

The view is exclusively responsible for the representation or projection of a
model. Where projection is an important term because the way a model is
represented is not restricted.

In Seanox aspect-js the views are represented by the markup.


## Controller

The (application)controller controls internal processes within an application
(face flow) and takes over the data flow between view and model with the
view-model binding, whereby we can also speak of MVVM (Model-View-ViewModel) and
MVCS (Model-View-Controller-Service) here.


## Contents Overview

- [Model](#model)
- [View](#view)
- [Controller](#controller)
- [View Model Binding](#view-model-binding)
  - [Composite](#composite)
  - [Binding](#binding)
  - [Dock](#dock)
  - [Undock](#undock)
  - [Synchronization](#synchronization)
  - [Validation](#validation)
  - [Events](#events)


## View Model Binding

The view-model binding takes over the bidirectional linking of the HTML elements
of the view with the models as static JavaScript objects and thus organizes the
data flow, communicates events as well as states and binds functions.


### Composite

The basis for view-model binding is formed by composites, which are functionally
independent components consisting of markup, CSS, JavaScript, and optionally
other resources. All components are bound via, the also called Composite ID, ID
of the HTML construct, the model with the same name in JavaScript and the ID
corresponding to the HTML in CSS.

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

```javascript
const example = {
    ...    
}
```

```css
#example {
  ...    
}
```

The Composite ID is thus a unique identifier within the application. It is a
string of letters, numbers, and underscores that is at least one character long,
begins with an underscore or a letter, and is formed by combining the id and
composite attributes on an HTML element.

Composites, or better their composite ID, define the point in the global object
tree where the corresponding JavaScript model is located. All HTML elements with
an ID enclosed by a composite are then reflected as branches in the
corresponding JavaScript model if they are implemented accordingly in the model.

```javascript
const model = {
    message: "Hello", 
    submit: {
        ...    
    }
};
```

```html
<html>
  <body>
    <form id="model" composite>
      <input type="text" id="message"/>
      <input type="submit" id="submit"/>
      ...
    </form>
  </body>
</html>
```


### Binding

View-model binding is about linking markup/HTML (view) to the corresponding
JavaScript object (model). The binding passes interactions and state changes of
the view to the model and provides an interface for middleware functions and
services for the view. In this way, no manual implementation of events,
synchronization and interaction between view and application logic is required.

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
      <input type="text" id="message" value="{{model.message}}" events="change"/>
      <input type="submit" id="submit"/>
      ...
    </form>
  </body>
</html>
```


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

For  composites in combination with a [condition](markup.md#condition), the call
of the methods depends on the result of the condition.


### Undock

More details can be found in chapter [Dock](#undock)


### Synchronization

In addition to the static linking and assignment of HTML elements to JavaScript
objects (models), the view model binding also includes the synchronization of
values between the HTML elements and the fields of the JavaScript object. The
synchronization depends on events that are declared for the HTML element with
the attribute [events](markup.md#events) and so the synchronization is executed
only when one of the defined events occurs.

More details about the usage can be found in chapter [events](
    markup.md#events).


### Validation

The synchronization of values between view (HTML elements) and the fields of
JavaScript models can be monitored and controlled by validation. Validation is
declared in HTML via the [validate](markup.md#validate) attribute in combination
with the [events](markup.md#events) attribute and requires a corresponding
validation method in the JavaScript object (model).

More details about the usage can be found in chapter [validate](
    markup.md#validate).


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
&#9665; [Resource Bundle](message.md)
&nbsp;&nbsp;&nbsp;&nbsp; &#8801; [Table of Contents](README.md#model-view-controller)
&nbsp;&nbsp;&nbsp;&nbsp; [Routing](routing.md) &#9655;
