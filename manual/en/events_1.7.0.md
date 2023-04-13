[Extension](extension.md) | [TOC](README.md#events) | [Test](test.md)
- - -

# Events

Seanox aspect-js provides various events that can be used to implement
extensions and to notify the application of certain operating states of the
framework and runtime environment.


## Contents Overview

* [Rendering](#rendering)
  * [Composite.EVENT_RENDER_START](#compositeevent_render_start)
  * [Composite.EVENT_RENDER_NEXT](#compositeevent_render_next)
  * [Composite.EVENT_RENDER_END](#compositeevent_render_end)
* [View Model Binding](#view-model-binding)
  * [Composite.EVENT_MOUNT_START](#compositeevent_mount_start)
  * [Composite.EVENT_MOUNT_NEXT](#compositeevent_mount_next)
  * [Composite.EVENT_MOUNT_END](#compositeevent_mount_end)
* [HTTP](#http)
  * [Composite.EVENT_HTTP_START](#compositeevent_http_start)
  * [Composite.EVENT_HTTP_PROGRESS](#compositeevent_http_progress)
  * [Composite.EVENT_HTTP_RECEIVE](#compositeevent_http_receive)
  * [Composite.EVENT_HTTP_LOAD](#compositeevent_http_load)
  * [Composite.EVENT_HTTP_ABORT](#compositeevent_http_abort)
  * [Composite.EVENT_HTTP_TIMEOUT](#compositeevent_http_timeout)
  * [Composite.EVENT_HTTP_ERROR](#compositeevent_http_error)
  * [Composite.EVENT_HTTP_END](#compositeevent_http_end)
* [Error](#error)
  * [Composite.EVENT_ERROR](#compositeevent_error)


# Rendering

The following events occur during rendering. The current selector is passed to
the callback method. The method can then influence the selector as well as the
corresponding element, but not the rendering.

```javascript
Composite.listen(Composite.EVENT_RENDER_***, function(event, selector) {
    ...
});
```


## Composite.EVENT_RENDER_START

The event occurs when the rendering is started. The processing itself does not
start until after the event.


## Composite.EVENT_RENDER_NEXT

The event occurs during recursive iteration during rendering, if during a render
cycle, the rendering of another element starts. The processing itself does not
start until after the event.


## Composite.EVENT_RENDER_END

The event occurs at the final end of the rendering. The processing itself ends
before the event.


# View Model Binding

The following events occur during the view model binding. The current selector
is passed to the callback method. The method can influence the selector as well
as the corresponding element, but not the view model binding.

```javascript
Composite.listen(Composite.EVENT_MOUNT_***, function(event, selector) {
    ...
});
```


## Composite.EVENT_MOUNT_START

The event occurs when the view model binding is started. Processing itself
does not start until after the event.


## Composite.EVENT_MOUNT_NEXT

The event occurs during recursive iteration during view model binding, if during
a render cycle, the view model binding of another element starts. The processing
itself does not start until after the event.


## Composite.EVENT_MOUNT_END

The event occurs with the final end of the view model binding. The processing
itself ends before the event.


# Modules

The following events occur during the use of modules. The callback method is
passed the trigger and the determined module. Triggers can be HTML elements, if
modules are addressed via markup, or they can be strings, if modules are
addressed programmatically in JavaScript.

```javascript
Composite.listen(Composite.EVENT_MODULE_***, function(event, context, module) {
    ...
});
```


## Composite.EVENT_MODULE_LOAD

Occurs when a module is initially loaded. If a module is loaded and unloaded
multiple times at runtime, this event will occur only once.


# HTTP

The Composite API supports application-wide event management for the
XMLHttpRequest to implement request-related application logic, e.g. for logging
or spinners. 

```javascript
Composite.listen(Composite.EVENT_HTTP_***, function(event, XMLHttpRequest) {
    ...
});
```


## Composite.EVENT_HTTP_START

Corresponds to the XMLHttpRequest event: `loadstart` and is triggered when a
request to load data is started.


## Composite.EVENT_HTTP_PROGRESS

Corresponds to the XMLHttpRequest event: `progress`. The progress event is
triggered periodically when a request receives further data.


## Composite.EVENT_HTTP_RECEIVE

Corresponds to the XMLHttpRequest-Event: `readystatechange` and is triggered
when the status of the request/response changes.


## Composite.EVENT_HTTP_LOAD

Corresponds to the XMLHttpRequest event: `load` and is triggered when a resource
is loaded.


## Composite.EVENT_HTTP_ABORT

Corresponds to the XMLHttpRequest event: `abort` and is triggered when the
loading of a resource is aborted.


## Composite.EVENT_HTTP_TIMEOUT

Corresponds to the XMLHttpRequest event: `timeout` and is triggered when the
loading of a resource is aborted because the maximum loading time has been
exceeded.


## Composite.EVENT_HTTP_ERROR

Corresponds to the XMLHttpRequest event: `error` and is triggered when an error
occurs.


## Composite.EVENT_HTTP_END

Corresponds to the XMLHttpRequest event: `loading` and is triggered when the
request is completed, regardless of any errors or successful completion.


# Error

The Composite API supports application-wide event management for runtime errors
to implement event-related application logic, for example, for logging or error
output. 

```javascript
Composite.listen(Composite.EVENT_ERROR, function(event, Error) {
    ...
});
```


## Composite.EVENT_ERROR

The error event is triggered for unhandled runtime errors. Syntax errors that
prevent JavaScript from being executed generally cannot trigger the error event.


- - -
[Extension](extension.md) | [TOC](README.md#events) | [Test](test.md)
