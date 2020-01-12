[Erweiterung](extension.md) | [Inhalt](README.md#ereignisse) | [Test](test.md)
- - -

# Ereignisse

Seanox aspect-js stellt verschiede Ereignisse bereit, die u.a. zur
Implementierung von Erweiterungen sowie als Benachrichtigung der Anwendung �ber
bestimmte Betriebszust�nde des Frameworks und der Laufzeitumgebung genutzt
werden k�nnen.


## Inhalt

* [Rendering](#rendering)
  * [Composite.EVENT_RENDER_START](#compositeevent_render_start)
  * [Composite.EVENT_RENDER_NEXT](#compositeevent_render_next)
  * [Composite.EVENT_RENDER_END](#compositeevent_render_end)
* [Object/Model-Binding](#objectmodel-binding)
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

Diese Ereignisse treten w�hrend dem Rendering auf.  
Der Callback-Methode wird der aktuelle Selector �bergeben. Sie kann diesen
und/oder das korrespondierende Element beeinflussen, nicht aber das Rendering.

```javascript
Composite.listen(Composite.EVENT_RENDER_***, function(selector) {
    ...
});
```


## Composite.EVENT_RENDER_START

Das Ereignis tritt mit Start des Renderings auf.  
Die Verarbeitung selbst beginnt erst nach dem Ereignis.


## Composite.EVENT_RENDER_NEXT

Das Ereignis tritt bei rekursiver Iteration beim Renderings auf.  
Die Verarbeitung selbst beginnt erst nach dem Ereignis.


## Composite.EVENT_RENDER_END

Das Ereignis tritt mit finalen Ende des Renderings auf.  
Die Verarbeitung selbst endet vor dem Ereignis.


# Object/Model-Binding

Diese Ereignisse treten w�hrend dem Object/Model-Binding auf. 
Der Callback-Methode wird der aktuelle Selector �bergeben. Sie kann diesen
und/oder das korrespondierende Element beeinflussen, nicht aber das
Object/Model-Binding.

```javascript
Composite.listen(Composite.EVENT_MOUNT_***, function(selector) {
    ...
});
```


## Composite.EVENT_MOUNT_START

Das Ereignis tritt mit Start vom Object/Model-Binding auf.  
Die Verarbeitung selbst beginnt erst nach dem Ereignis.


## Composite.EVENT_MOUNT_NEXT

Das Ereignis tritt mit finalen Ende vom Object/Model-Binding auf.  
Die Verarbeitung selbst endet vor dem Ereignis.


## Composite.EVENT_MOUNT_END

Das Ereignis tritt mit finalen Ende vom Object/Model-Binding auf.  
Die Verarbeitung selbst endet vor dem Ereignis.


# AJAX

Die Composite-API unterst�tzt ein anwendungsweites Event-Management f�r den
XMLHttpRequest zur Implementierung Request-bezogener Anwendungslogik, z.B. f�r
Logging oder Spinner. 

```javascript
Composite.listen(Composite.EVENT_AJAX_***, function(XMLHttpRequest) {
    ...
});
```


## Composite.EVENT_AJAX_START

Entspricht dem XMLHttpRequest-Event: `loadstart` und wird ausgel�st, wenn eine
Anforderung zum Laden von Daten gestartet wurde.


## Composite.EVENT_AJAX_PROGRESS

Entspricht dem XMLHttpRequest-Event: `progress`.  
Das Fortschrittsereignis wird periodisch ausgel�st, wenn eine Anforderung
weitere Daten empf�ngt.


## Composite.EVENT_AJAX_RECEIVE

Entspricht dem XMLHttpRequest-Event: `readystatechange` und wird ausgel�st,
wenn sich der Status vom Request/Response �ndert.


## Composite.EVENT_AJAX_LOAD

Entspricht dem XMLHttpRequest-Event: `load` und wird ausgel�st, wenn eine
Ressource geladen wurde.


## Composite.EVENT_AJAX_ABORT

Entspricht dem XMLHttpRequest-Event: `abort` und wird ausgel�st, wenn das Laden
einer Ressource abgebrochen wurde.


## Composite.EVENT_AJAX_TIMEOUT

Entspricht dem XMLHttpRequest-Event: `timeout` und wird ausgel�st, wenn das
Laden einer Ressource wegen �berschreitung der maximalen Ladezeit abgebrochen
wurde.


## Composite.EVENT_AJAX_ERROR

Entspricht dem XMLHttpRequest-Event: `error` und wird ausgel�st, wenn ein
Fehler aufgetreten ist.


## Composite.EVENT_AJAX_END

Entspricht dem XMLHttpRequest-Event: `loadend` und wird ausgel�st, wenn der
Request abgeschlossen ist, unabh�ngig von evlt. Fehlern oder erfolgreichem
Verlauf.


# Error

Die Composite-API unterst�tzt ein anwendungsweites Event-Management f�r
Laufzeitfehler zur Implementierung Ereignis-bezogener Anwendungslogik, z.B. f�r
Logging oder Fehlerausgaben. 

```javascript
Composite.listen(Composite.EVENT_ERROR, function(Event) {
    ...
});
```


## Composite.EVENT_ERROR

Das Fehlerereignis wird bei unbehandelten Laufzeitfehlern ausgel�st.  
Syntaktische Fehler die eine generelle Ausf�hrung von JavaScript verhindern,
k�nnen das Fehlerereignis nicht ausl�sen.


- - -
[Erweiterung](extension.md) | [Inhalt](README.md#ereignisse) | [Test](test.md)
