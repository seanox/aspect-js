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
* [Object/Model Binding](#objectmodel-binding)
  * [Composite.EVENT_MOUNT_START](#compositeevent_mount_start)
  * [Composite.EVENT_MOUNT_NEXT](#compositeevent_mount_next)
  * [Composite.EVENT_MOUNT_END](#compositeevent_mount_end)
* [AJAX](#ajax)
  * [Composite.EVENT_AJAX_START](#compositeevent_ajax_start)
  * [Composite.EVENT_AJAX_PROGRESS](#compositeevent_ajax_progress)
  * [Composite.EVENT_AJAX_RECEIVE](#compositeevent_ajax_receive)
  * [Composite.EVENT_AJAX_LOAD](#compositeevent_ajax_load)
  * [Composite.EVENT_AJAX_ABORT](#compositeevent_ajax_abort)
  * [Composite.EVENT_AJAX_TIMEOUT](#compositeevent_ajax_timeout)
  * [Composite.EVENT_AJAX_ERROR](#compositeevent_ajax_error)
  * [Composite.EVENT_AJAX_END](#compositeevent_ajax_end)
* [Error](#error)
  * [Composite.EVENT_ERROR](#compositeevent_error)


# Rendering

These events occur during rendering.  
The callback method is passed the current selector. It can influence this and/or
the corresponding element, but not the rendering.

```javascript
Composite.listen(Composite.EVENT_RENDER_***, function(selector) {
    ...
});
```


## Composite.EVENT_RENDER_START

The event occurs when the rendering is started.  
The processing itself does not start until after the event.


## Composite.EVENT_RENDER_NEXT

The event occurs during recursive iteration during rendering.  
The processing itself does not start until after the event.


## Composite.EVENT_RENDER_END

The event occurs at the final end of the rendering.  
The processing itself ends before the event.


# Object/Model Binding

These events occur during object/model binding. 
The callback method is passed the current selector. It can influence this and/or
the corresponding element, but not the object/model binding.

```javascript
Composite.listen(Composite.EVENT_MOUNT_***, function(selector) {
    ...
});
```


## Composite.EVENT_MOUNT_START

The event occurs when the object/model binding is started.  
Processing itself does not start until after the event.


## Composite.EVENT_MOUNT_NEXT

The event occurs with the final end of the object/model binding.  
The processing itself ends before the event.


## Composite.EVENT_MOUNT_END

The event occurs with the final end of the object/model binding.  
The processing itself ends before the event.


# AJAX

The Composite API supports application-wide event management for the
XMLHttpRequest to implement request-related application logic, e.g. for logging or spinners. 

```javascript
Composite.listen(Composite.EVENT_AJAX_***, function(XMLHttpRequest) {
    ...
});
```


## Composite.EVENT_AJAX_START

Corresponds to the XMLHttpRequest event: `loadstart` and is triggered when a
request to load data is started.


## Composite.EVENT_AJAX_PROGRESS

Corresponds to the XMLHttpRequest event: `progress`.  
The progress event is triggered periodically when a request receives further
data.


## Composite.EVENT_AJAX_RECEIVE

Corresponds to the XMLHttpRequest-Event: `readystatechange` and is triggered
when the status of the request/response changes.


## Composite.EVENT_AJAX_LOAD

Corresponds to the XMLHttpRequest event: `load` and is triggered when a
resource is loaded.


## Composite.EVENT_AJAX_ABORT

Corresponds to the XMLHttpRequest event: `abort` and is triggered when the
loading of a resource is aborted.


## Composite.EVENT_AJAX_TIMEOUT

Corresponds to the XMLHttpRequest event: `timeout` and is triggered when the
loading of a resource is aborted because the maximum loading time has been
exceeded.


## Composite.EVENT_AJAX_ERROR

Corresponds to the XMLHttpRequest event: `error` and is triggered when an error
occurs.


## Composite.EVENT_AJAX_END

Corresponds to the XMLHttpRequest event: `loading` and is triggered when the
request is completed, regardless of any errors or successful completion.


# Error

The Composite API supports application-wide event management for runtime errors
to implement event-related application logic, for example, for logging or error
output. 

```javascript
Composite.listen(Composite.EVENT_ERROR, function(Event) {
    ...
});
```


## Composite.EVENT_ERROR

The error event is triggered for unhandled runtime errors.  
Syntax errors that prevent JavaScript from being executed generally cannot
trigger the error event.


- - -
[Extension](extension.md) | [TOC](README.md#events) | [Test](test.md)
