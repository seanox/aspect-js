# Composite

TODO:


## Contents Overview

* [Events](#events)
  * [Composite Render Events](#composite-render-events)
    * [Composite.EVENT_RENDER_START](#composite-event_render_start)
    * [Composite.EVENT_RENDER_NEXT](#composite-event_render_next)
    * [Composite.EVENT_RENDER_END](#composite-event_render_end)
  * [Composite Scan Events](#composite-scan-events)
    * [Composite.EVENT_SCAN_START](#composite-event_scan_start)
    * [Composite.EVENT_SCAN_NEXT](#composite-event_scan_next)
    * [Composite.EVENT_SCAN_END](#composite-event_scan_end)
  * [Composite Mount Events](#composite-mount-events)
    * [Composite.EVENT_MOUNT_START](#composite-event_mount_start)
    * [Composite.EVENT_MOUNT_NEXT](#composite-event_mount_next)
    * [Composite.EVENT_MOUNT_END](#composite-event_mount_end)
  * [Composite AJAX Events](#composite-ajax-events)
    * [Composite.EVENT_AJAX_START](#composite-event_ajax_start)
    * [Composite.EVENT_AJAX_PROGRESS](#composite-event_ajax_progress)
    * [Composite.EVENT_AJAX_RECEIVE](#composite-event_ajax_receive)
    * [Composite.EVENT_AJAX_LOAD](#composite-event_ajax_load)
    * [Composite.EVENT_AJAX_ABORT](#composite-event_ajax_abort)
    * [Composite.EVENT_AJAX_TIMEOUT](#composite-event_ajax_timeout)
    * [Composite.EVENT_AJAX_ERROR](#composite-event_ajax_error)
    * [Composite.EVENT_AJAX_END](#composite-event_ajax_end)
  * [Composite Error Events](#composite-error-events)
    * [Composite.EVENT_ERROR](#composite-event_error)

  
## Events

For an event oriented programming, aspect-js provides numerous events and
functions, which are primarily associated with status changes and errors during
processing, communication, and rendering.


### Composite Render Events

These events occur when status changes during rendering.  
The current selector is passed to the callback method. It can influence this
and/or the corresponding element, but not the rendering.

```javascript
Composite.listen(Composite.EVENT_RENDER_***, function(selector) {
    ...
});
```


#### Composite.EVENT_RENDER_START

The event occurs when the rendering is started.  
The work of the renderer starts after the event.


#### Composite.EVENT_RENDER_NEXT

The event occurs during recursive iteration during renderings.    
The work of the renderer starts after the event.


#### Composite.EVENT_RENDER_END

The event occurs with the final end of the rendering.       
The work of the renderer ends before the event.


### Composite Scan Events

These events occur when status changes occur during scanning for the
object/model binding.  
The current selector is passed to the callback method. It can influence this
and/or the corresponding element, but not the scanning.

```javascript
Composite.listen(Composite.EVENT_SCAN_***, function(selector) {
    ...
});
```


#### Composite.EVENT_SCAN_START

The event occurs when the scan is started.  
The work of the renderer starts after the event.


#### Composite.EVENT_SCAN_NEXT

The event occurs at the final end of the scan.  
The work of the renderer starts after the event.


#### Composite.EVENT_SCAN_END

The event occurs at the final end of the scan.  
The work of the renderer ends before the event.


### Composite Mount Events

These events occur when status is changed in the object/model binding.  
The current selector is passed to the callback method. It can influence this
and/or the corresponding element, but not the object/model binding.

```javascript
Composite.listen(Composite.EVENT_MOUNT_***, function(selector) {
    ...
});
```

#### Composite.EVENT_MOUNT_START

The event occurs when the object/model binding is started.  
The work of the renderer starts after the event.


#### Composite.EVENT_MOUNT_NEXT

The event occurs with final end of object/model binding.  
The work of the renderer starts after the event.


#### Composite.EVENT_MOUNT_END

The event occurs at the final end of the object/model binding.  
The work of the renderer ends before the event.


### Composite AJAX Events

The Composite API supports an application-wide Event Management for the
XMLHttpRequest for implementing request-related application logic, e.g. for
Logging or spinner. 

```javascript
Composite.listen(Composite.EVENT_AJAX_***, function(XMLHttpRequest) {
    ...
});
```


#### Composite.EVENT_AJAX_START

Corresponds to the XMLHttpRequest event: `loadstart` and is triggered when a
Request to load data was started.


#### Composite.EVENT_AJAX_PROGRESS

Corresponds to the XMLHttpRequest event: `progress`.  
The progress event is triggered periodically when a request receives additional
data.


#### Composite.EVENT_AJAX_RECEIVE

Corresponds to the XMLHttpRequest-Event: `readystatechange` and is triggered
when the status of the request/response changes.


#### Composite.EVENT_AJAX_LOAD

Corresponds to the XMLHttpRequest event: `load` and is triggered when a
resource is loaded.


#### Composite.EVENT_AJAX_ABORT

Corresponds to the XMLHttpRequest event: `abort` and is triggered if loading of
a resource was aborted.


#### Composite.EVENT_AJAX_TIMEOUT

Corresponds to the XMLHttpRequest event: `timeout` and is triggered if the
loading of a resource was terminated because the maximum loading time was
exceeded.


#### Composite.EVENT_AJAX_ERROR

Corresponds to the XMLHttpRequest event: `error` and is triggered when an error
occurs.


#### Composite.EVENT_AJAX_END

Corresponds to the XMLHttpRequest event: `loadend` and is triggered when the
request is completed, regardless of any errors or successful completion.


### Composite Error Events

The composite API supports an application-wide event management for runtime
errors to implement event-related application logic, e.g. for logging or error
output. 

```javascript
Composite.listen(Composite.EVENT_ERROR, function(Event) {
    ...
});
```


#### Composite.EVENT_ERROR

The error event is triggered if runtime errors are not handled.  
Syntactic errors that prevent the execution of JavaScript in general, cannot
trigger the error event.
