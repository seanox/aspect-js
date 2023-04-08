[Resource Bundle](message.md) | [TOC](README.md#model-view-controller) | [SiteMap](sitemap.md)
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

TODO:


#### Property

TODO:


#### Qualifier

TODO:


#### Unique Identifier

TODO:


#### Composite

TODO:


#### Composite-ID

TODO:


### Binding

TODO:


### Dock

TODO:


### Undock

TODO:


### Synchronization

TODO:


### Validation

TODO:


### Events

TODO:


- - -

[Resource Bundle](message.md) | [TOC](README.md#model-view-controller) | [SiteMap](sitemap.md)
