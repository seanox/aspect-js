[Resource-Bundle](message.md) | [Inhalt](README.md#model-view-controller) | [Komponenten](composite.md)
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
* [SiteMap](#sitemap)
  * [Begriffe](#begriffe)
    * [Page](#page)
    * [Face](#face)
    * [Facet](#facet)
    * [Face-Flow](#face-flow)
  * [Konfiguration](#konfiguration)
    * [Face-Flow](#face-flow-1)
    * [Permissions](#permissions)
    * [Acceptors](#acceptors)
  * [Navigation](#navigation)
  * [Berechtigungskonzept](#berechtigungskonzept)
  * [Acceptors](#acceptors)
* [Virtual Paths](#virtual-paths)
  * [Root Path](#root-path)
  * [Relative Path](#relative-path)
  * [Absolute Path](#absolute-path)
  * [Variable Path](#variable-path)
  * [Functional Path](#functional-path)


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


## SiteMap

Die Darstellung in Seanox aspect-js ist in Views organisiert, welche Pages,
Faces sowie Facets nutzen und &uuml;ber virtuelle Pfade angesprochen werden.
F&uuml;r diesen Zweck stellt SiteMap eine hierarchische Verzeichnisstruktur zur
Verf&uuml;gung, die auf den virtuellen Pfaden aller Views basiert. Die SiteMap
steuert den Zugriff und die Visualisierung (Ein- und Ausblenden) der Views --
der sogenannte Face-Flow. Face-Flow und Visualisierung funktionieren resolut und
verwenden aktiv das DOM zum Einf&uuml;gen und Entfernen der Views (Faces und
Facets).

```
+-----------------------------------------------+
|  Page                                         |
|  +-----------------------------------------+  |
|  |  Face A / Partial Face A                |  |
|  |  +-------------+       +-------------+  |  |
|  |  |  Facet A1   |  ...  |  Facet An   |  |  |
|  |  +-------------+       +-------------+  |  |
|  |                                         |  |
|  |  +-----------------------------------+  |  |
|  |  |  Face AA                          |  |  |
|  |  |  +-----------+     +-----------+  |  |  |
|  |  |  | Facet AA1 | ... | Facet AAn |  |  |  |
|  |  |  +-----------+     +-----------+  |  |  |
|  |  +-----------------------------------+  |  |
|  |  ...                                    |  |
|  +-----------------------------------------+  |
|  ...                                          |
|  +-----------------------------------------+  |
|  |  Face n                                 |  |
|  |  ...                                    |  |
|  +-----------------------------------------+  |
+-----------------------------------------------+
```


### Begriffe


#### Page

In einer Single-Page-Application bildet die Page den elementaren Rahmen und die
Laufzeitumgebung der gesamten Anwendung.


#### Face

Ein Face ist die prim&auml;re Projektion von Modellen/Komponenten/Inhalten.
Diese Projektion kann zus&auml;tzliche Unterstrukturen in Form von Facets und
Sub-Faces enthalten. So werden &uuml;bergeordnete Faces zu partiellen Faces,
wenn sich der Pfad auf ein Sub-Face bezieht. In dem Fall werden alle
&uuml;bergeordneten Faces teilweise/partiell angezeigt, also ohne deren evtl.
enthaltenen Facets.


#### Facet

Facets sind Teile eines Faces (Projektion) und sind in der Regel keine
eigenst&auml;ndige View. So k&ouml;nnen z.B. bei einem Such-Formular die
Eingabemaske und die Ergebnistabelle separate Facets eines Faces sein, ebenso
wie Article und/oder Section in einem Face. Sowohl Face als auch Facets sind
&uuml;ber virtuelle Pfade erreichbar. Der Pfad zu Facets bewirkt, dass das
umschliessende Face mit allen seinen &uuml;bergeordneten Faces angezeigt wird.


#### Face-Flow

Face-Flow beschreibt die Zugriffssteuerung und die Visualisierung von Ansichten
(Views). Die SiteMap stellt daf&uuml;r Schnittstellen f&uuml;r
Berechtigungskonzepte und Akzeptoren zur Verf&uuml;gung, mit denen der Face-Flow
kontrolliert und beeinflusst werden kann. Auf diese Weise kann der Zugriff auf
Pfade/Ansichten mit eigener Logik gestoppt und/oder umgeleitet bzw.
weitergeleitet werden.


### Konfiguration

Standardm&auml;ssig ist die SiteMap inaktiv und muss mit der Konfiguration
aktiviert werden.

F&uuml;r die Konfiguration der SiteMap wird die Methode
`SiteMap.customize(....)`verwendet. Mit dieser Methode ist es m&ouml;glich, den
Face-Flow (Pfade, Faces, Facets) sowie die Berechtigungen zu definieren und
Akzeptoren zu registrieren, wof&uuml;r die Methode unterschiedliche Signaturen
bereitstellt.

Die Konfiguration kann mehrfach aufgerufen werden, auch zur Laufzeit. Die
SiteMap sammelt alle Konfigurationen kumulativ. Alle Pfade, Faces und Facets
werden zusammengefasst, Akzeptoren und permit-Methoden in der Reihenfolge ihrer
Registrierung gesammelt. Da die Konfiguration immer einen kumulativen Zustand
verwendet, ist es sp&auml;ter nicht nachvollziehbar, wie die Konfiguration
erstellt wurde.

Die Konfiguration der SiteMap greift nur, wenn ein fehlerfreies Meta-Objekt
&uuml;bergeben wird und keine Fehler bei der Verarbeitung auftreten.


#### Face-Flow

Die Konfiguration basiert auf einem Meta-Objekt, das an die Methode
`SiteMap.customize({meta})` &uuml;bergeben wird. Die Schl&uuml;ssel (string)
entsprechen den Pfaden und ein Pfad hat immer ein existierendes Face als Ziel,
Teilpfade ohne Face werden ignoriert. Die Werte sind Arrays mit den
g&uuml;ltigen Facets f&uuml;r einen Pfad/Face. Facets ben&ouml;tigen keinen
eigenen Pfad, da diese automatisch abgeleitet/erstellt werden.

```javascript
SiteMap.customize({...});
```

```javascript
SiteMap.customize({
    "#": ["news", "products", "about", "contact", "legal"],
    "#products#papers": ["paperA4", "paperA5", "paperA6"],
    "#products#envelope": ["envelopeA4", "envelopeA5", "envelopeA6"],
    "#products#pens": ["pencil", "ballpoint", "stylograph"],
    "#legal": ["terms", "privacy"],
    ...
});
```

__Die Navigation akzeptiert nur Pfade, die im Face-Flow definiert sind.
Ung&uuml;ltige Pfade werden basierend auf dem angeforderten Pfad zum n&auml;chst
h&ouml;heren bekannten/berechtigten Pfad weitergeleitet.__

__Ohne Face-Flow gibt es keine g&uuml;ltigen Pfade. Werden eine
Benutzeroberfl&auml;che oder Komponenten bei aktivierte SiteMap ohne Face-Flow
verwendet, m&uuml;ssen diese als _static_ gekennzeichnet werden, da die
Komponenten sonst ausgeblendet (aus dem DOM entfernt) werden.__

```html
<html>
  <body>
    <form id="model" composite static>
      ...
    </form>
  </body>
</html>
```


#### Permissions

Das Berechtigungskonzept basiert auf einer oder mehreren permit-Methoden, die
zusammen mit dem Meta-Objekt zum Face-Flow &uuml;bergeben werden.

```javascript
SiteMap.customize({...}, function(path) {...});
```

```javascript
SiteMap.customize({
    "#": ["news", "products", "about", "contact", "legal"],
    "#products#papers": ["paperA4", "paperA5", "paperA6"],
    "#products#envelope": ["envelopeA4", "envelopeA5", "envelopeA6"],
    "#products#pens": ["pencil", "ballpoint", "stylograph"],
    "#legal": ["terms", "privacy"], ...},

    function(path) {
        ...
    }
});
```

Alle angeforderten Pfade durchlaufen die registrierten permit-Methoden. Diese
entscheiden, was mit dem Pfad passiert. Von jeder permit-Methode wird einer der
folgenden R&uuml;ckgabewerte erwartet:

`boolean true` Die Validierung ist erfolgreich und die Iteration &uuml;ber
weitere permit-Methoden wird fortgesetzt. Wenn alle permit-Methoden wahr sind
und damit den Pfad best&auml;tigen, wird er verwendet.

`string` Die Validierung (Iteration &uuml;ber weitere permit-Methoden) wird
abgebrochen und es folgt eine Weiterleitung an die zur&uuml;ckgegebene
Zeichenkette. 

`otherwise` Der Pfad gilt als ung&uuml;ltig/unautorisiert, die Validierung
(Iteration &uuml;ber weitere permit-Methoden) wird abgebrochen und es folgt eine
Weiterleitung an den urspr&uuml;nglichen Pfad.


#### Acceptors

Akzeptoren arbeiten &auml;hnlich wie die permit-Methoden. Im Unterschied dazu
werden die Methoden der Akzeptoren nur bei den Pfaden aufgerufen, deren
RegExp-Muster dem angefragten Pfad entsprechen. Auch von den Methoden der
Akzeptoren werden die gleichen Arten von R&uuml;ckgabewerten wie bei den
[Permissions](#permissions) erwartet.

```javascript
SiteMap.customize(RegExp, function(path) {...});
```

```javascript
SiteMap.customize(/^phone.*$/i, function(path) {
    dial the phone number
});
SiteMap.customize(/^mail.*$/i, function(path) {
    send a mail
});
```


### Navigation

Die Navigation kann durch &Auml;nderung des URL-Hash im Browser (direkte
Eingabe), durch Verwendung von Hash-Links und in JavaScript mit
`window.location.hash`, `window.location.href`, `SiteMap.navigate(path)` und
`SiteMap.forward(path)` erfolgen.

```html
<a href="#a#b#c">Goto root + a + b + c</a>
<a href="##">Back to the parent</a>
<a href="##x">Back to the parent + x</a>
```

```javascript
SiteMap.navigate("#a#b#c");
SiteMap.navigate("##");
SiteMap.navigate("##x");
```

```javascript
SiteMap.forward("#a#b#c");
SiteMap.forward("##");
SiteMap.forward("##x");
```

Im Unterschied zur navigate-Methode wird die Weiterleitung direkt
ausgef&uuml;hrt, anstatt eine asynchrone Weiterleitung durch &Auml;nderung des
Location-Hashes auszul&ouml;sen.

Relative Pfade ohne Hash am Anfang sind m&ouml;glich, funktionieren aber nur mit
`SiteMap.navigate(path)`.

```javascript
SiteMap.navigate("x#y#z");
```


### Berechtigungskonzept

Das Berechtigungskonzept basiert auf permit-Methoden, die als Callback-Methoden
mit der Konfiguration des Face-Flows definiert werden. Es k&ouml;nnen mehrere
permit-Methoden definiert werden, die mit jedem angeforderten Pfad
&uuml;berpr&uuml;ft werden. Nur wenn alle permit-Methoden den angeforderten Pfad
mit "wahr" best&auml;tigen, wird er verwendet und der Renderer macht die
abh&auml;ngigen Faces und Facets sichtbar.
 
Details werden im Abschnitt [Permissions](#permissions) beschrieben.


### Acceptors

Akzeptoren werden zusammen mit dem Berechtigungskonzept ausgef&uuml;hrt. Sie
haben die gleiche Wirkung, betreffen aber nur Pfade, die einem regul&auml;ren
Ausdruck entsprechen. Akzeptoren k&ouml;nnen zur Best&auml;tigung von
Berechtigungen und/oder f&uuml;r versteckte Hintergrundaktivit&auml;ten
verwendet werden.

Details werden im Abschnitt [Acceptors](#acceptors) beschrieben.


## Virtual Paths

Virtuelle Pfade werden f&uuml;r die Navigation und Kontrolle vom Face-Flow
verwendet. Das Ziel kann ein Face, ein Facet oder eine Funktion sein. Bei SPAs
(Single-Page-Applikationen) wird der Ankerteil der URL f&uuml;r die Pfade
verwendet.

```
https://example.local/example/#path
```

In Anlehnung an das Dateisystem werden auch hier absolute, relative und
zus&auml;tzlich funktionale Pfade unterst&uuml;tzt. Pfade bestehen
ausschliesslich aus Wortzeichen, Unterstrichen und optional dem Minus-Zeichen
(basierend auf zusammengesetzten IDs). Als Separator und Root wird das
Hash-Zeichen verwendet. Leerzeichen werden nicht unterst&uuml;tzt.

```
#a#b#c#d
```

Pfade verwenden nur Kleinbuchstaben. Grossbuchstaben werden beim Normalisieren
automatisch durch Kleinbuchstaben ersetzt.

```
#a#b#c#d == #A#b#C#d
```

Zwischen den Pfadsegmenten kann das Hash-Zeichen (`#`) auch als R&uuml;ck- /
Eltern-Sprunganweisung verwendet werden. Die Weite vom R&uuml;cksprung
entspricht dann der Anzahl der zus&auml;tzlichen Hash-Zeichen.

```
#a#b#c#d##x   -> #a#b#c#x
#a#b#c#d###x  -> #a#b#x
#a#b#c#d####x -> #a#x
```

Die Navigation kann durch &Auml;nderung des URL-Hash im Browser (direkte
Eingabe), durch Verwendung von Hash-Links und in JavaScript mit
`window.location.hash`, `window.location.href`, `SiteMap.navigate(path)` und
`SiteMap.forward(path)`. erfolgen.

Es gibt verschiedene Arten von Pfaden, die im Folgenden erl&auml;utert werden.


### Root Path

Diese Pfade sind leer oder enthalten nur ein Hash-Zeichen.

```html
<a href="#">Back to the root</a>
```


### Relative Path

Diese Pfade beginnen ohne Hash oder mit zwei oder mehr Hash-Zeichen (`##+`) und
sind relativ zum aktuellen Pfad.

```html
<a href="##">Back to the parent</a>
<a href="##x">Back to the parent + x</a>
```

Relative Pfade ohne Hash am Anfang sind m&ouml;glich, funktionieren aber nur mit
`SiteMap.navigate(path)`.

```javascript
SiteMap.navigate("x#y#z");
```


### Absolute Path

Diese Pfade beginnen mit einem Hash-Zeichen. Alle Pfade werden ausgeglichen,
d.h. die Direktiven mit mehreren Hash-Zeichen werden aufgel&ouml;st.

```html
<a href="#">Back to the root</a>
<a href="#a#b#c">Back to the root + a + b + c</a>
```


### Variable Path

Variable Pfade sind eine Abbildung (Mapping) von virtuellen auf physische Pfade.
Die Erkl&auml;rung klingt im Kontext der SiteMap und derer virtueller Pfade
etwas verwirrend und meint hier eine weitere zus&auml;tzliche virtuelle
Abbildung von Pfaden innerhalb der SiteMap. Dabei bildet ein Pfad der SiteMap
ein festes Ziel, welches ein Face und Facet sein kann. Der Pfad kann nun
beliebig erweitert werden ohne dass sich das Ziel &auml;ndert. Das Ziel kann den
erweiterten Pfad dann z.B. zur Parameter&uuml;bergabe nutzen, was vergleichbar
mit `PATH_TRANSLATED` und `PATH_INFO` im CGI ist. 

Zur Konfiguration variabler Pfade wird die Zeichenfolge `...` verwendet, die
einem Facet nachgestellt wird oder direkt als Facet verwendet werden kann.

```javascript
SiteMap.customize({
    "#": ["home", "projects", "about", "contact..."],
    "#project": ["..."],
    ...
});
```

Die Pfade `#contact` und `#project` sind in diesem Beispiel variabel und
k&ouml;nnen somit beliebig erweitert werden. Das Ziel ist in beiden F&auml;llen
fest und die Anfragen werden von `#contact` bzw. `#project` verarbeitet. Die
Erweiterung vom Pfad kann mit der Methode `SiteMap.lookup(path)` ermittelt
werden. Das zur&uuml;ckgegebene Meta-Objekt enth&auml;lt bei variablen Pfaden
den erweiterten Pfaden als data-Property. 

```
SiteMap.lookup("#contact#support");
    returns {path:"#contact#support", face:"#", facet:"contact", data:"#support"}

SiteMap.lookup("#project#a#b#c");
    returns {path:"#contact#support", face:"#project", facet:"", data:"#a#b#c"}
```


### Functional Path

Der Pfad besteht aus drei oder mehr Hash-Zeichen (`###+`) und ist nur
tempor&auml;r, er dient einem Funktionsaufruf, ohne den aktuellen Pfad
(URL-Hash) zu &auml;ndern. Dies ist n&uuml;tzlich f&uuml;r funktionale Links,
z.B. um ein Popup zu &ouml;ffnen oder eine Mail im Hintergrund zu senden.

```html
<a href="###">Do something, the logic is in the model</a>
```


- - -

[Resource-Bundle](message.md) | [Inhalt](README.md#model-view-controller) | [Komponenten](composite.md)
