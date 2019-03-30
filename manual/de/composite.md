# Composite

TODO:


## Inhalt

* [Ereignisse](#ereignisse)
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

  
## Ereignisse

Für eine ereignisorientierte Programmierung werden in aspect-js zahlreiche
Ereignisse und Funktionen bereitgestellt, die vorrangig mit Statusänderungen und
Fehlern bei der Verarbeitung, Kommunikation und dem Rendering ausgelöst werden.


### Composite Render Events

Diese Ereignisse treten bei Statusänderungen beim Rendering auf.  
Der Callback-Methode wird der aktuelle Selector übergeben. Sie kann diesen
und/oder das korrespondierende Element beeinflussen, nicht aber das Rendering.

```javascript
Composite.listen(Composite.EVENT_RENDER_***, function(selector) {
    ...
});
```


#### Composite.EVENT_RENDER_START

Das Ereignis tritt mit Start des Renderings auf.  
Die Verarbeitung selbst beginnt erst nach dem Ereignis.


#### Composite.EVENT_RENDER_NEXT

Das Ereignis tritt bei rekursiver Iteration beim Renderings auf.  
Die Verarbeitung selbst beginnt erst nach dem Ereignis.


#### Composite.EVENT_RENDER_END

Das Ereignis tritt mit finalen Ende des Renderings auf.  
Die Verarbeitung selbst endet vor dem Ereignis.


### Composite Scan Events

Diese Ereignisse treten bei Statusänderungen beim Scannen für das
Objekt-/Model-Bindung auf.  
Der Callback-Methode wird der aktuelle Selector übergeben. Sie kann diesen
und/oder das korrespondierende Element beeinflussen, nicht aber das Scannen.

```javascript
Composite.listen(Composite.EVENT_SCAN_***, function(selector) {
    ...
});
```


#### Composite.EVENT_SCAN_START

Das Ereignis tritt mit Start des Scanns auf.  
Die Verarbeitung selbst beginnt erst nach dem Ereignis.


#### Composite.EVENT_SCAN_NEXT

Das Ereignis tritt mit finalen Ende des Scanns auf.  
Die Verarbeitung selbst beginnt erst nach dem Ereignis.


#### Composite.EVENT_SCAN_END

Das Ereignis tritt mit finalen Ende des Scanns auf.  
Die Verarbeitung selbst endet vor dem Ereignis.


### Composite Mount Events

Diese Ereignisse treten bei Statusänderungen bei der Objekt-/Model-Bindung auf.  
Der Callback-Methode wird der aktuelle Selector übergeben. Sie kann diesen
und/oder das korrespondierende Element beeinflussen, nicht aber die
Objekt-/Model-Bindung.

```javascript
Composite.listen(Composite.EVENT_MOUNT_***, function(selector) {
    ...
});
```

#### Composite.EVENT_MOUNT_START

Das Ereignis tritt mit Start der Objekt-/Model-Bindung auf.  
Die Verarbeitung selbst beginnt erst nach dem Ereignis.


#### Composite.EVENT_MOUNT_NEXT

Das Ereignis tritt mit finalen Ende Objekt-/Model-Bindung auf.  
Die Verarbeitung selbst beginnt erst nach dem Ereignis.


#### Composite.EVENT_MOUNT_END

Das Ereignis tritt mit finalen Ende der Objekt-/Model-Bindung auf.  
Die Verarbeitung selbst endet vor dem Ereignis.


### Composite AJAX Events

Die Composite-API unterstützt ein anwendungsweites Event-Management für den
XMLHttpRequest zur Implementierung Request-bezogener Anwendungslogik, z.B. für
Logging oder Spinner. 

```javascript
Composite.listen(Composite.EVENT_AJAX_***, function(XMLHttpRequest) {
    ...
});
```


#### Composite.EVENT_AJAX_START

Entspricht dem XMLHttpRequest-Event: `loadstart` und wird ausgelöst, wenn eine
Anforderung zum Laden von Daten gestartet wurde.


#### Composite.EVENT_AJAX_PROGRESS

Entspricht dem XMLHttpRequest-Event: `progress`.  
Das Fortschrittsereignis wird periodisch ausgelöst, wenn eine Anforderung
weitere Daten empfängt.


#### Composite.EVENT_AJAX_RECEIVE

Entspricht dem XMLHttpRequest-Event: `readystatechange` und wird ausgelöst,
wenn sich der Status vom Request/Response ändert.


#### Composite.EVENT_AJAX_LOAD

Entspricht dem XMLHttpRequest-Event: `load` und wird ausgelöst, wenn eine
Ressource geladen wurde.


#### Composite.EVENT_AJAX_ABORT

Entspricht dem XMLHttpRequest-Event: `abort` und wird ausgelöst, wenn das Laden
einer Ressource abgebrochen wurde.


#### Composite.EVENT_AJAX_TIMEOUT

Entspricht dem XMLHttpRequest-Event: `timeout` und wird ausgelöst, wenn das
Laden einer Ressource wegen Überschreitung der maximalen Ladezeit abgebrochen
wurde.


#### Composite.EVENT_AJAX_ERROR

Entspricht dem XMLHttpRequest-Event: `error` und wird ausgelöst, wenn ein
Fehler aufgetreten ist.


#### Composite.EVENT_AJAX_END

Entspricht dem XMLHttpRequest-Event: `loadend` und wird ausgelöst, wenn der
Request abgeschlossen ist, unabhängig von evtl. Fehlern oder erfolgreichem
Verlauf.


### Composite Error Events

Die Composite-API unterstützt ein anwendungsweites Event-Management für
Laufzeitfehler zur Implementierung Ereignis-bezogener Anwendungslogik, z.B. für
Logging oder Fehlerausgaben. 

```javascript
Composite.listen(Composite.EVENT_ERROR, function(Event) {
    ...
});
```


#### Composite.EVENT_ERROR

Das Fehlerereignis wird bei unbehandelten Laufzeitfehlern ausgelöst.  
Syntaktische Fehler die eine generelle Ausführung von JavaScript verhindern,
können das Fehlerereignis nicht auslösen.
