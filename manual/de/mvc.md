[Resource-Bundle](message.md) | [Inhalt](README.md#model-view-controller) | [SiteMap](sitemap.md)
- - -

# Model-View-Controller

Der Model-View-Controller (MVC) ist ein Entwurfsmuster zur Trennung von
Interaktion, Daten und Darstellung. Hier muss zwischen I/O-Controller und
Applikations-Controller unterschieden werden. Das reine MVC-Entwurfsmuster meint
den I/O-Controller zur &Uuml;bermittlung der Interaktionen. Da dies von
Betriebssystem und Browser &uuml;bernommen wird, bezieht sich Seanox aspect-js
vordergr&uuml;ndig auf den Applikations-Controller.

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

Models sind statische JavaScript-Objekte, die vergleichbar mit managed Beans und
DTOs (Data Transfer Objects) Daten, Zust&auml;nde und Funktionen f&uuml;r die
View bereitstellen. Als Singletons/Facades/Delegates k&ouml;nnen sie weitere
Komponenten und Abstraktionen nutzen, selbst Gesch&auml;ftslogik enthalten und
sind ein Bindeglied zwischen View und Middleware. Das erforderliche
View-Model-Binding ist Bestandteil vom Composite-API, was im Abschnitt
[Model-View-Controller - Binding](mvc.md#binding) detailliert beschrieben wird.


## View

Die View, welche durch das Markup repr&auml;sentiert wird, ist ausschliesslich
f&uuml;r die Darstellung bzw. Projektion von Modellen verantwortlich. Wobei
Projektion eine gute Beschreibung ist, da die Art der Darstellung eines Modells
nicht eingeschr&auml;nkt ist.


## Controller

Der (Applikations-)Controller steuert Abl&auml;ufe innerhalb einer Applikation
(Face-Flow) und &uuml;bernimmt mit dem View-Model-Binding den Datenfluss
zwischen View und Model, wobei hier auch von MVVM (Model-View-ViewModel) und
MVCS (Model-View-Controller-Service) gesprochen werden kann.


## Inhalt

* [Model](#model)
* [View](#view)
* [Controller](#controller)
* [View-Model-Binding](#view-model-binding)
  * [Composite](#composite)
  * [Binding](#binding)
  * [Dock](#dock)
  * [Undock](#undock)
  * [Synchronization](#synchronization)
  * [Validation](#validation)
  * [Events](#events)


## View-Model-Binding

Das View-Model-Binding &uuml;bernimmt die bidirektionale Verkn&uuml;pfung der
HTML-Elemente der View mit den Modellen als statische JavaScript-Objekte und
organisiert so den Datenfluss, kommuniziert Ereignisse sowie Zust&auml;nde und
bindet Funktionen an.


### Composite

Die Grundlage f&uuml;r das View-Model-Binding bilden Composites, was funktional
eigenst&auml;ndige Komponenten sind, die sich aus Markup, CSS und JavaScript
sowie optional aus weiteren Ressourcen zusammensetzen. Die Bindung alle
Bestandteile erfolgt &uuml;ber die auch als Composite-ID bezeichnete ID vom
HTML-Konstrukt, dem namensgleichen Model im JavaScript sowie der zum HTML 
korrespondierenden ID im CSS.

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

Die Composite-ID ist somit ein eindeutiger Bezeichner innerhalb der Anwendung.
Sie ist eine Zeichenfolge, die aus Buchstaben, Zahlen und Unterstrichen besteht,
mindestens ein Zeichen lang ist, mit einem Unterstrich oder einem Buchstaben
beginnt und sich durch die Kombination der Attribute `id` und `composite` bei
einem HTML-Element bildet.

Composites oder besser deren Composite-ID, definieren den Punkt im globalen
Objektbaum, wo sich das korrespondierende JavaScript-Model befindet. Alle von
einem Composite eingeschlossenen HTML-Elemente mit einer ID werden dann im
korrespondierenden JavaScript-Model als Zweige reflektiert, wenn diese im Model
entsprechend implementiert sind.

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

Beim View-Model-Binding geht es um die Verbindung von Markup/HTML (View) mit dem
entsprechenden JavaScript-Objekt (Model). Das Binding leitet Interaktionen und
Status&auml;nderungen der View an das Model weiter und stellt eine
Schnittstelle f&uuml;r Middleware-Funktionen und Services f&uuml;r die View
bereit. Womit keine manuelle Implementierung von Ereignissen, Synchronisation
und Interaktion zwischen View und Anwendungslogik erforderlich ist.

```javascript
const model = {
    message: "Hello", 
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

Wird ein Composite im DOM verwendet/eingef&uuml;gt, wird das entsprechende
JavaScript-Objekt (Model) angedockt/verkn&uuml;pft und beim Entfernen aus dem
DOM abgedockt/entkn&uuml;pft. In beiden F&auml;llen kann das Modell optional
geeignete Methoden implementieren. Die Methode `dock` wird vor dem Rendern, vor
dem Einf&uuml;gen des Composites in das DOM oder nach dem Laden der Seite beim
ersten Rendern ausgef&uuml;hrt und kann zur Vorbereitung der Darstellung
verwendet werden. Die Methode `undock` wird ausgef&uuml;hrt, nachdem das
Composite aus dem DOM entfernt wurde und kann zur Nachbereitung bzw. Bereinigung
der Darstellung verwendet werden.

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

Bei Composites, die mit dem Attribut [condition](markup.md#condition) deklariert
werden, h&auml;ngt der Aufruf der Methoden vom Ergebnis der Bedingung ab.


### Undock

Details werden im Abschnitt [Dock](#undock) beschrieben.


### Synchronization

Das View-Model-Binding umfasst neben der statischen Verkn&uuml;pfung und
Zuordnung von HTML-Elementen (View) zum JavaScript-Objekt (Model) auch die
Synchronisation von Werten zwischen den HTML-Elementen und den Feldern im
JavaScript-Objekt. Die Synchronisation h&auml;ngt von Ereignissen ab, die
f&uuml;r das HTML-Element mit dem Attribut [events](markup.md#events) deklariert
sind und wird nur ausgef&uuml;hrt, wenn eines der definierten Ereignisse
eintritt.

Details zur Funktionsweise werden im Abschnitt [events](markup.md#events)
beschrieben.


### Validation

Die Synchronisation der Werte zwischen den HTML-Elementen (View) und den Feldern
vom JavaScript-Objekt (Model) kann durch Validierung &uuml;berwacht und
gesteuert werden. Die Validierung wird in HTML durch die Kombination der
Attribute [validate](markup.md#validate) und [events](markup.md#events)
deklariert und erfordert eine entsprechende Validierungsmethode im
JavaScript-Objekt.

Details zur Funktionsweise werden im Abschnitt [validate](markup.md#validate)
beschrieben.


### Events

Ereignisse, genauer gesagt die Interaktion zwischen View und Modell, werden beim
View-Model-Binding ebenfalls ber&uuml;cksichtigt. Die Methoden zur Interaktion
werden nur im Model implementiert. Im Markup selbst ist keine Deklaration
erforderlich. Das View-Model-Binding kennt die verf&uuml;gbaren Ereignisse im
HTML und so wird beim Binding das Model nach entsprechenden Methoden durchsucht,
die dann als Event-Listener registriert werden.

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
    <div id="contact" composite>
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

[Resource-Bundle](message.md) | [Inhalt](README.md#model-view-controller) | [SiteMap](sitemap.md)
