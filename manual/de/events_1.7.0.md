[Erweiterung](extension.md) | [Inhalt](README.md#ereignisse) | [Test](test.md)
- - -

# Ereignisse

Seanox aspect-js stellt verschiedene Ereignisse bereit, die u.a. zur
Implementierung von Erweiterungen sowie als Benachrichtigung der Anwendung
&uuml;ber bestimmte Betriebszust&auml;nde des Frameworks und der
Laufzeitumgebung genutzt werden k&ouml;nnen.


## Inhalt

* [Rendering](#rendering)
  * [Composite.EVENT_RENDER_START](#compositeevent_render_start)
  * [Composite.EVENT_RENDER_NEXT](#compositeevent_render_next)
  * [Composite.EVENT_RENDER_END](#compositeevent_render_end)
* [View-Model-Binding](#view-model-binding)
  * [Composite.EVENT_MOUNT_START](#compositeevent_mount_start)
  * [Composite.EVENT_MOUNT_NEXT](#compositeevent_mount_next)
  * [Composite.EVENT_MOUNT_END](#compositeevent_mount_end)
* [Modules](#modules)
  * [Composite.EVENT_MODULE_LOAD](#compositeevent_module_load)
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

Die nachfolgenden Ereignisse treten w&auml;hrend dem Rendering auf. Der
Callback-Methode wird dazu der aktuelle Selector &uuml;bergeben. Die Methode
kann dann den Selector, wie auch das korrespondierende Element beeinflussen,
nicht aber das Rendering.

```javascript
Composite.listen(Composite.EVENT_RENDER_***, function(event, selector) {
    ...
});
```


## Composite.EVENT_RENDER_START

Das Ereignis tritt mit dem Start des Renderings auf. Die Verarbeitung selbst
beginnt erst nach dem Ereignis.


## Composite.EVENT_RENDER_NEXT

Das Ereignis tritt bei rekursiver Iteration beim Rendering auf, wenn
w&auml;hrend eines Renderzyklus, das Rendering eines weiteren Elements startet.
Die Verarbeitung selbst beginnt erst nach dem Ereignis.


## Composite.EVENT_RENDER_END

Das Ereignis tritt mit dem finalen Ende des Renderings auf. Die Verarbeitung
selbst endet vor dem Ereignis.


# View-Model-Binding

Die nachfolgenden Ereignisse treten w&auml;hrend dem View-Model-Binding auf. Der
Callback-Methode wird dazu der aktuelle Selector &uuml;bergeben. Die Methode
kann den Selector wie auch das korrespondierende Element beeinflussen, nicht
aber das View-Model-Binding.

```javascript
Composite.listen(Composite.EVENT_MOUNT_***, function(event, selector) {
    ...
});
```


## Composite.EVENT_MOUNT_START

Das Ereignis tritt mit dem Start vom View-Model-Binding auf. Die Verarbeitung
selbst beginnt erst nach dem Ereignis.


## Composite.EVENT_MOUNT_NEXT

Das Ereignis tritt bei rekursiver Iteration beim View-Model-Binding auf, wenn
w&auml;hrend eines Renderzyklus, das View-Model-Binding eines weiteren Elements
startet. Die Verarbeitung selbst beginnt erst nach dem Ereignis.


## Composite.EVENT_MOUNT_END

Das Ereignis tritt mit dem finalen Ende vom View-Model-Binding auf. Die
Verarbeitung selbst endet vor dem Ereignis.


# Module

Die nachfolgenden Ereignisse treten w&auml;hrend der Verwendung von Modulen auf.
Der Callback-Methode werden dazu der Ausl&ouml;ser und das ermittelte Modul
&uuml;bergeben. Auslöser k&ouml;nnen HTML-Elemente sein, wenn Module &uuml;ber
das Markup angesprochen werden, oder es k&ouml;nnen Strings sein, wenn Module im
JavaScript programmatisch angesprochen werden.

```javascript
Composite.listen(Composite.EVENT_MODULE_***, function(event, context, module) {
    ...
});
```


## Composite.EVENT_MODULE_LOAD

Tritt auf, wenn ein Modul initial geladen wird. Wird ein Modul zur Laufzeit
mehrfach geladen und entladen, wird dieses Ereignis nur einmalig auftreten. 


# HTTP

Das Composite-API unterst&uuml;tzt ein anwendungsweites Event-Management
f&uuml;r den XMLHttpRequest zur Implementierung Request-bezogener
Anwendungslogik, z.B. f&uuml;r Logging oder Spinner. 

```javascript
Composite.listen(Composite.EVENT_HTTP_***, function(event, XMLHttpRequest) {
    ...
});
```


## Composite.EVENT_HTTP_START

Entspricht dem XMLHttpRequest-Event: `loadstart` und wird ausgel&ouml;st, wenn
eine Anforderung zum Laden von Daten gestartet wurde.


## Composite.EVENT_HTTP_PROGRESS

Entspricht dem XMLHttpRequest-Event: `progress`. Das Fortschrittsereignis wird
periodisch ausgel&ouml;st, wenn eine Anforderung weitere Daten empf&auml;ngt.


## Composite.EVENT_HTTP_RECEIVE

Entspricht dem XMLHttpRequest-Event: `readystatechange` und wird ausgel&ouml;st,
wenn sich der Status vom Request/Response &auml;ndert.


## Composite.EVENT_HTTP_LOAD

Entspricht dem XMLHttpRequest-Event: `load` und wird ausgel&ouml;st, wenn eine
Ressource geladen wurde.


## Composite.EVENT_HTTP_ABORT

Entspricht dem XMLHttpRequest-Event: `abort` und wird ausgel&ouml;st, wenn das
Laden einer Ressource abgebrochen wurde.


## Composite.EVENT_HTTP_TIMEOUT

Entspricht dem XMLHttpRequest-Event: `timeout` und wird ausgel&ouml;st, wenn das
Laden einer Ressource wegen &Uuml;berschreitung der maximalen Ladezeit
abgebrochen wurde.


## Composite.EVENT_HTTP_ERROR

Entspricht dem XMLHttpRequest-Event: `error` und wird ausgel&ouml;st, wenn ein
Fehler aufgetreten ist.


## Composite.EVENT_HTTP_END

Entspricht dem XMLHttpRequest-Event: `loadend` und wird ausgel&ouml;st, wenn der
Request abgeschlossen ist, unabh&auml;ngig von evtl. Fehlern oder erfolgreichem
Verlauf.


# Error

Das Composite-API unterst&uuml;tzt ein anwendungsweites Event-Management
f&uuml;r Laufzeitfehler zur Implementierung Ereignis-bezogener Anwendungslogik,
z.B. f&uuml;r Logging oder Fehlerausgaben. 

```javascript
Composite.listen(Composite.EVENT_ERROR, function(event, Error) {
    ...
});
```


## Composite.EVENT_ERROR

Das Fehlerereignis wird bei unbehandelten Laufzeitfehlern ausgel&ouml;st.
Syntaktische Fehler die eine generelle Ausf&uuml;hrung von JavaScript
verhindern, k&ouml;nnen das Fehlerereignis nicht ausl&ouml;sen.


- - -
[Erweiterung](extension.md) | [Inhalt](README.md#ereignisse) | [Test](test.md)
