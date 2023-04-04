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
sind ein Bindeglied zwischen View und Middelware. Das erforderliche
View-Model-Binding ist Bestandteil vom Composite-API, was im Abschnitt
[Model-View-Controller - Binding](mvc.md#binding) detailierter beschrieben wird.


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
  * [Begriffe](#begriffe)
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


## View-Model-Binding

Das View-Model-Binding &uuml;bernimmt die bidirektionale Verkn&uuml;pfung der
HTML-Elemente der View mit den Modellen als statische JavaScript-Objekte und
organisiert so den Datenfluss, kommuniziert Ereignisse sowie Zust&auml;nde und
bindet Funktionen an.


### Begriffe


#### Composite

TODO:


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

[Resource-Bundle](message.md) | [Inhalt](README.md#model-view-controller) | [SiteMap](sitemap.md)
