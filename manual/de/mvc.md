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
|                                          |  Path        |                       |
|                                          |  SiteMap     |                       |
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
ein Bindeglied zwischen Benutzeroberfl&auml;che und Middelware sein.

Das erforderliche View-Model-Binding ist Bestandteil vom Model-View-Controller
und dem Composite-API.

Details zum View-Model-Binding werden im Abschnitt
[Model-View-Controller - Binding](mvc.md#binding) beschrieben.


## View

Die View ist ausschliesslich f&uuml;r die Darstellung bzw. Projektion eines
Modells verantwortlich. Wobei Projektion ein wichtiger Begriff ist, da die Art
der Darstellung eines Modells nicht eingeschr&auml;nkt ist.

In Seanox aspect-js werden die Views durch das Markup repr&auml;sentiert.


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

Beim View Model Binding geht es um die Verkn&uuml;pfung von HTML-Elementen mit
entsprechenden vorhandenen statischen JavaScript-Objekten (Models), was in
Seanox aspect-js ein Teil vom Model-View-Controller und dem Composite-API ist.

SiteMap ist eine Erweiterung und basiert auf dem Composite-API. F&uuml;r ein
besseres Verst&auml;ndnis wird die Funktionalit&auml;t hier im
Model-View-Controller beschrieben.


### Begriffe


#### Namespace

TODO:


#### Model

Models sind statische JavaScript-Objekte, die vergleichbar mit managed Beans und
DTOs (Data Transfer Objects) Daten, Zust&auml;nde und Funktionen f&uuml;r die
View bereitstellen. Als Singletons/Facades/Delegates k&ouml;nnen sie weitere
Komponenten und Abstraktionen nutzen, selbst Gesch&auml;ftslogik enthalten und
ein Bindeglied zwischen Benutzeroberfl&auml;che und Middelware sein.

Das erforderliche View-Model-Binding ist Bestandteil vom Model-View-Controller
und dem Composite-API.


#### Property

Referenziert ein Element mit einer ID innerhalb vom DOM eines Composites mit
einer korrespondierenden Eigenschaft im Modell. Der Namensraum basiert auf dem
vom Composite und erweitert sich um ggf. weitere &uuml;bergeordnete Elemente mit
IDs im DOM.

```javascript
const model = {
    foo: {
        fieldA: null
    }
};
```

```html
<html>
  <body>
    <div id="model" composite>
      <div id="foo">
        <input id="fieldA" type="text" events="change"/>
      </div>
    </div>
  </body>
</html>
```

Das Composite-API synchronisiert ereignisgesteuert die Eigenschaft im Modell mit
dem Wert vom HTML-Element. F&uuml;r ein HTML-Element werden die entsprechenden
Ereignisse &uuml;ber das gleichnamige Attribut definiert.


#### Qualifier

In einigen F&auml;llen ist ein Bezeichner (ID) nicht eindeutig. Zum Beispiel
wenn Eigenschaften Arrays sind oder eine Iteration verwendet wird. In diesen
F&auml;llen kann der Bezeichner durch einen zus&auml;tzlichen eindeutigen
Qualifier, getrennt durch einen Doppelpunkt, erweitert werden. Qualifier wirken
beim View-Model-Binding wie Properties und verl&auml;ngern den Namensraum.

```html
<input type="text" id="identifier">
<input type="text" id="identifier:qualifier">
```

```html
<html>
  <body>
    <form id="model" composite static iterate="{{set:['A','B','C']}}">
      <input type="text" id="fieldA:{{set.value}}">
      ...
    </form>
  </body>
</html>
```


#### Unique Identifier

TODO:


#### Composite

Composite ist ein Konstrukt aus Markup (View), JavaScript-Objekt (Model), CSS
und eventuell weiteren Ressourcen. Es beschreibt eine Komponente/Modul ohne
direkten Bezug auf die Darstellung.


#### Composite-ID

Die Composite-ID ist ein anwendungsweit eindeutiger Bezeichner. Sie ist eine
Zeichenfolge, die aus Buchstaben, Zahlen und Unterstrichen besteht. Eine
Composite-ID ist mindestens ein Zeichen lang und wird durch die Kombination der
Attribute `ID` und `Composite` gebildet.

```html
<html>
  <body>
    <form id="model" composite>
      ...
    </form>
  </body>
</html>
```

Die Composite-ID wird beim MVC, View-Model-Binding sowie zur Synchronisation und
Validierung ben&ouml;tigt und muss daher eine g&uuml;ltige und eindeutige
Zeichenfolge innerhalb des JavaScript-Namensraums sein. Der Bezeichner wird auch
f&uuml;r den Face-Flow verwendet, um Faces und Facets sowie allgemein
Modelle/Komponenten zu identifizieren und zu kontrollieren.


### Binding

In Seanox aspect-js werden Komponenten auch Composites oder Module genannt, da
diese aus Markup (View), korrespondierendem JavaScript Objekt (Model) und mehr
bestehen.

Beim View-Model-Binding geht es um die Verbindung von View/Markup/HTML mit dem
entsprechenden JavaScript-Objekt. Das Binding leitet Interaktionen und
Status&auml;nderungen der View an das Model weiter und stellt eine Schnittstelle
f&uuml;r Middleware-Funktionen und Services f&uuml;r die View bereit. Womit
keine manuelle Implementierung und Deklaration von Ereignissen sowie die
Synchronisation und Interaktion zwischen View und Anwendungslogik erforderlich
ist.

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

```html
<html>
  <body>
    <form id="model" composite>
      <input type="text" id="message" value="{{model.text.value}}" events="change"/>
      <input type="submit" id="submit"/>
      ...
    </form>
  </body>
</html>
```

Das View-Model-Binding basiert auf den IDs der HTML-Elemente im Markup (View).
Diese IDs definieren den Namensraum und das zu verwendende JavaScript-Objekt
(Model). IDs k&ouml;nnen relative und absolute Namensr&auml;ume verwenden,
basieren aber prim&auml;r auf der Position eines Elements im DOM und einer
korrespondierenden Objektstruktur im JavaScript.


### Dock

Wenn ein Composite im DOM verwendet/eingef&uuml;gt wird, wird das entsprechende
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

Bei einem Composite in Kombination mit einer Bedingung (condition) h&auml;ngt
der Aufruf der Methoden vom Ergebnis der Bedingung ab.


### Undock

Details werden im Abschnitt [Dock](#undock) beschrieben.


### Synchronization

Das View-Model-Binding umfasst neben der statischen Verkn&uuml;pfung und
Zuordnung von HTML-Elementen (View) zum JavaScript-Objekt (Model) auch die
Synchronisation von Werten zwischen den HTML-Elementen und den Feldern im
JavaScript-Objekt. Die Synchronisation h&auml;ngt von Ereignissen ab, die
f&uuml;r das HTML-Element mit dem Attribut `events` deklariert sind und wird nur
ausgef&uuml;hrt, wenn eines der definierten Ereignisse eintritt.

Details zur Funktionsweise werden im Abschnitt [events](markup.md#events)
beschrieben.


### Validation

Die Synchronisation der Werte zwischen den HTML-Elementen (View) und den Feldern
vom JavaScript-Objekt (Model) kann durch Validierung &uuml;berwacht und
gesteuert werden. Die Validierung wird in HTML durch die Kombination der
Attribute `validate` und `events` deklariert und erfordert eine entsprechende
Validierungsmethode im JavaScript-Objekt.

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
    <div id="contact" composite static>
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
