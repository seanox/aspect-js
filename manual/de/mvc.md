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


## Controller

Der (Applikations-)Controller steuert Abl&auml;ufe innerhalb einer Applikation
(Face-Flow) und &uuml;bernimmt mit dem View-Model-Binding den Datenfluss
zwischen View und Model, wobei hier auch von MVVM (Model-View-ViewModel) und
MVCS (Model-View-Controller-Service) gesprochen werden kann.


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


## Inhalt

* [Controller](#controller)
* [Model](#model)
* [View](#view)
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

Die Grundlage für das View-Model-Binding bilden Composites, was funktional
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

```javascript
const model = {
    message: "Hello", 
    submit: {
        ...    
    }
};
```


### Binding

Beim View-Model-Binding geht es um die Verbindung von Markup/HTML (View) mit dem
entsprechenden JavaScript-Objekt (Model). Das Binding leitet Interaktionen und
Status&auml;nderungen der View an das Model weiter und stellt eine
Schnittstelle f&uuml;r Middleware-Funktionen und Services für die View bereit.
Womit keine manuelle Implementierung von Ereignissen, Synchronisation und
Interaktion zwischen View und Anwendungslogik erforderlich ist.

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

[Resource-Bundle](message.md) | [Inhalt](README.md#model-view-controller) | [SiteMap](sitemap.md)
