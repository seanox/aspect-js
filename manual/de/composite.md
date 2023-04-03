[Sitemap](sitemap.md) | [Inhalt](README.md#komponenten) | [Reaktives Rendering](reactive.md)
- - -

# Komponenten

Die Implementierung von Seanox aspect-js ist auf eine modulare und auf
Komponenten basierte Architektur ausgerichtet. Das Framework unterst&uuml;tzt dazu
eine deklarative Kennzeichnung von Komponenten im Markup, die Auslagerung und
das automatische Laden von Ressourcen zur Laufzeit, sowie ein automatisches
View-Model-Binding.


## Inhalt

* [Modul](#modul)
* [Komponente](#komponente)
* [Composite](#composite)
* [Aufbau](#aufbau)
* [Ressourcen](#ressourcen)
* [Laden](#laden)
  * [CSS](#css)
  * [JavaScript](#javascript)
  * [HTML](#html)
* [Common Standard-Komponente](#common-standard-komponente)
* [View-Model-Binding](#view-model-binding)
  * [Namespace](#namespace)
  * [Model](#model)
  * [Property](#property)
  * [Qualifier](#qualifier)
  * [Binding](#binding)
  * [Events](#events)
  * [Synchronization](#synchronization)
  * [Validation](#validation)


## Modul

Ein Modul stellt eine geschlossene funktionale Programmeinheit dar, die meist
als Programmbibliothek bereitgestellt wird.


## Komponente

Eine Komponente bezeichnet einen funktional und/oder technisch eigenst&auml;ndigen
Bestandteil, der aus einem oder mehreren Modulen bestehen kann oder ein Modul
kann eine oder mehrere Komponenten bereitstellen.


## Composite

Ein Composite bezeichnet eine funktional eigenst&auml;ndige Komponente die sich
aus Markup, CSS und JavaScript(-Model) sowie optional aus weiteren Ressourcen
zusammensetzen kann. Im Hinblick auf den Model-View-Controller-Ansatz, lassen
sich mit einem Composite Model und View bereitstellen.

__Damit unterscheidet sich das Composite-Konzept vom JavaScript-Modul-Konzept,
was aber ebenfalls verwendet werden kann. Ein anderer wichtiger Unterschied
besteht beim Laden und Ausf&uuml;hren von JavaScript, was bei Composites in
einem Renderzyklus linear/sequenziell und somit synchron erfolgt.__


## Aufbau

Eine Komponente besteht im Markup aus einem als Composite gekennzeichneten
HTML-Element mit einer eindeutigen Id.

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


## Ressourcen

Das innere Markup, CSS und JavaScript von Composites lassen sich auslagern. Das
Standard-Verzeichnis `./modules` kann &uuml;ber die Eigenschaft
`Composite.MODULES` ge&auml;ndert werden. Der Dateiname der ausgelagerten
Ressourcen leitet sich von der ID des als Composite gekennzeichneten
HTML-Elements ab. Welche Ressourcen bzw. Teile der Komponente ausgelagert
werden, kann f&uuml;r jede Komponente individuell entschieden werden. 

```
+ modules
  - example.css
  - example.js
  - example.html
- index.html
```

Beim Standardverhalten wird der Name der Ressourcen von der Composite-ID
abgeleitet und nutzt diese dann als Kleinschreibung am Anfang. Dieses Verhalten
kann mit dem Attribute [strict](markup.md#strict) ge&auml;ndert werden, so dass
die Composite-ID unver&auml;ndert f&uuml;r die Ressourcen verwendet werden.



## Laden

Das Laden der Ressourcen und das View-Model-Binding erfolgt partiell, wenn das
Composite in der View ben&ouml;tigt wird, was die [SiteMap](sitemap.md) als
zentrales Face-Flow-Management steuert und so die Ladezeit stark minimiert, da
situationsabh&auml;ngig vom UI nur die Ressourcen der aktiv verwendeten
Composites geladen werden.

Das Auslagern und Laden der Ressourcen zur Laufzeit ist optional und l&auml;sst
sich komplett, teilweise und nicht anwenden. Beim Nachladen und Einbinden gibt
es eine feste Reihenfolge: CSS, JavaScript, HTML/Markup.

Wird die Anfrage einer Ressourcen mit Status 404 beantwortet, wird davon
ausgegangen, dass diese Ressource nicht ausgelagert wurde. Werden Anfragen weder
mit Status 200 oder 404 beantwortet wird von einem Fehler ausgegangen.

Das Laden von Ressourcen wird nur einmalig mit der ersten Anforderung der
Komponente f&uuml;r die View ausgef&uuml;hrt und der Inhalt dann
zwischengespeichert.


### CSS

CSS wird als Style-Element in das HEAD-Element eingef&uuml;gt. Ohne ein
HEAD-Element verursacht das Einf&uuml;gen einen Fehler.


### JavaScript

JavaScript wird nicht als Element eingef&uuml;gt, sondern direkt mit der
eval-Methode ausgef&uuml;hrt. Da hierbei ein eigener und nicht der globale
Namenspace verwendet wird, m&uuml;ssen globale Variablen bewusst im globalen
Namespace angelegt werden, wof&uuml;r das window- oder Namespace-API genutzt
werden sollte.

```javascript
Namespace.create("login", {
    validate(element, value) {
    },
    logon: {
        onClick(event) {
        }
    }
}
```


### HTML

HTML/Markup wird f&uuml;r ein Composite nur geladen, wenn das HTML-Element der
Komponente selbst kein inneres HTML besitzt und f&uuml;r das Elemente auch nicht
die Attribute `import` oder `output` deklariert wurden. Nur in diesem Fall wird
von einer leeren Komponente mit ausgelagertem HTML/Markup ausgegangen.


## Common Standard-Komponente

Mit dem Laden der Seite und der Initialisierung des Frameworks und der Anwendung
wird automatisch auch die Commons-Komponente im Modul-Verzeichnis geladen, die
aus der JavaScript-Datei `common.js` und/oder dem CSS-Stylesheet `common.css`
bestehen kann. Beide Dateien sind zur Ablage initialer und anwendungsweiter
Logik bzw. Styles gedacht.

```
+ modules
  - common.css
  - common.js
  - ...
- index.html
```


## View-Model-Binding


### Namespace

Vergleichbar mit Packages in anderen Programmiersprachen, lassen sich Namespaces
(Namensr&auml;ume) zur hierarchischen Strukturierung von Komponenten, Ressourcen
und Gesch&auml;ftslogik nutzen.

Auch wenn Packages kein Merkmal von JavaScript sind, lassen sich diese auf
Objektebene durch das Verketten von Objekten zu einem Objektbaum abbilden. Dabei
bildet jede Ebene des Objektbaums einen Namespace, was auch als Domain
betrachtet werden kann.

Seanox aspect-js erweitert dazu das JavaScript-API um das Namespace-API.

```javascript
Namespace.use(...);
Namespace.create(...);
Namespace.lookup(...);
Namespace.exists(...);
```

Wie f&uuml;r die Bezeichner von Objekten typisch, verwenden auch Namespaces
Buchstaben, Zahlen und Unterstriche, die durch einen Punkt getrennt werden. Als
Besonderheit werden auch Arrays unterst&uuml;tzt. Nutzt eine Ebene im Namespace
eine Ganzzahl, wird diese Ebene als Array verwendet.

Composites bzw. Datenobjekte (Models) sind vergleichbar mit managed Beans, die
statisch als Singletons/Facades/Delegates den globalen Namespace nutzen. Um
diese Datenobjekte zu strukturieren und Domain-Konzepte umzusetzen, sind
entsprechende Namespaces erforderlich.

__Wenn Namespaces die IDs von Composites reflektieren und somit HTML-Elemente
die IDs als ID-Attribut verwenden, wird der Browser zu diesen IDs die
HTML-Elemente als Variablen im globalen Namespace anlegen. Interessanterweise
ignoriert der Browser gleichnamige Konstanten und &uuml;berschreibt diese mit
den HTML-Elementen. Daher sollten Namespaces nach dem HTML-Element `BODY` im
JavaScript erstellt werden oder besser das Namespace-API verwenden, die den
globalen Namespace von _window_ nutzt, den der Browser nicht
&uuml;berschreibt.__

__Auch f&uuml;r Module und JavaScript-Ressourcen die zur Laufzeit nachgeladen
werden, ist die Verwendung vom Namespace-API der einfachste Weg. Da das
Nachladen eigene Namespaces nutzt, m&uuml;ssen Variablen die &uuml;bergreifend
genutzt werden sollen, bewusst den globalen Namespace nutzen, was das
Namespace-API &uuml;bernimmt.__

```javascript
Namespace.create("masterdata", {
    regions: {
        ...
    },
    languages: {
        ...
    }
};
```

Im Markup bilden sich Namespaces aus den IDs verschachtelter Composites, wenn
diese das Attribut `namespace` verwenden.

```html
<div id="masterdata" composite namespace>
  <div id="regions" composite namespace>
    Namespace: masterdata.regions
  </div>
</div>
```

Befinden sich weitere Elemente mit einer ID zwischen den Composites, haben diese
keine Auswirkungen.

```html
<div id="masterdata" composite namespace>
  <section id="section">
    <form id="form">
      <div id="regions" composite namespace>
        Namespace: masterdata.regions
        Elements section and form are ignored 
      </div>
    </form>
  </section>
</div>
```

Noch spezieller sind in einer Namespace-Kette Composites ohne das Attribut
`namespace`. Diese Composites wirken entkoppelnd und haben selbst keinen
Namespace. Innerhalb dieser Composites k&ouml;nnen dann neue Namespaces begonnen
werden, unabh&auml;ngig von &uuml;bergeordneten Namespaces.

```html
<div id="Imprint" composite namespace>
  Namespace: Imprint
  <div id="Contact" composite>
    Namespace: Contact
    <div id="Support" composite namespace>
      Namespace: Support
      <div id="Mail" composite namespace>
        Namespace: Support.Mail
      </div>
      <div id="Channel" composite namespace>
        Namespace: Support.Channel
      </div>
      ...
    </div>
    <div id="Community" composite namespace>
      Namespace: Community
      <div id="Channel" composite namespace>
        Namespace: Community.Channel
      </div>
      ...
    </div>
  </div>
</div>
```

Eingef&uuml;hrt wurde dieses Verhalten mit dem Gedanken an Micro-Frontends,
welche eigene Domains nutzen und an verschiedenen Stellen wiederverwendet werden
sollen. So lassen sich in der statischen Welt von Seanox aspect-js
Domain-bezogene Komponenten umsetzen.

Namespaces haben zudem Auswirkungen auf Ressourcen und Module. So haben
Namespaces im Markup erstmal nur textuellen Charakter und k&ouml;nnen auch ohne
ein korrespondierendes JavaScript-Objekt existieren und verwendet werden. Im
Markup wird lediglich die Syntax der Namespaces geprk&uuml;ft. Ist diese
g&uuml;ltig, werden die Namespaces direkt auf den Pfad von Modulen und deren
Ressourcen angewendet und erweitern den Pfad ab dem Modul-Verzeichnis.

```
+ modules
  - common.css
  - common.js
  + community
    - channel.css
    - channel.html
    - channel.js
    - ...
  - imprint.css
  - imprint.html
  - imprint.js
  + support
    - mail.css
    - mail.html
    - mail.js
    - ...
  - ...
- index.html
```


### Model

Models sind statische JavaScript-Objekte, die vergleichbar mit managed Beans und
DTOs (Data Transfer Objects) Daten, Zust&auml;nde und Funktionen f&uuml;r die
View bereitstellen. Als Singletons/Facades/Delegates k&ouml;nnen sie weitere
Komponenten und Abstraktionen nutzen, selbst Gesch&auml;ftslogik enthalten und
ein Bindeglied zwischen Benutzeroberfl&auml;che und Middelware sein.

Das erforderliche View-Model-Binding ist Bestandteil vom Model-View-Controller
und dem Composite-API.

Details zum View-Model-Binding werden im Abschnitt
[Model-View-Controller - Binding](mvc.md#binding) beschrieben.


### Property

Es ist eine Eigenschaft innerhalb eines Models, die HTML-Elements innerhalb
eines Composites mit gleichnamiger ID referenziert. Elemente der Properties
nutzen relativen Bezeichner (ID). Der Namensraum basiert auf dem vom Composite
und erweitert sich um ggf. weitere &uuml;bergeordnete Element mit IDs.

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


### Qualifier

In einigen F&auml;llen ist ein Bezeichner (ID) nicht eindeutig. Zum Beispiel
wenn Eigenschaften Arrays sind oder im Markup eine Iteration verwendet wird. In
diesen F&auml;llen kann der Bezeichner, getrennt durch einen Doppelpunkt, um
einen zus&auml;tzlichen eindeutigen Qualifier erweitert werden. Qualifier wirken
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


### Binding

Die Verkn&uuml;pfung bzw. Bindung von Markup und JavaScript(-Model) erfolgt
&uuml;ber das Composite-API. Dazu muss ein HTML-Element das Attribut `composite`
und eine g&uuml;ltige sowie eindeutige ID besitzen, die den Anforderungen des
Namensraums entspricht.

Das Composite-API erkennt und &uuml;berwacht die Existenz von Markup der
Composites im DOM. So kann das korrespondierende (JavaScript-)Model &uuml;ber
die Methoden `dock` und `undock` informiert werden, wenn das Composite als
Komponente dem DOM hinzugef&uuml;gt bzw. aus diesem entfernt wird.

Die Implementierung beider Methoden ist optional.

```javascript
const model = {
    dock() {
    },
    undock() {
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

Die dock-Methode wird vor dem Rendern, vor dem Einf&uuml;gen des Composites in
das DOM oder nach dem Laden der Seite beim ersten Rendern ausgef&uuml;hrt und
kann das zur Vorbereitung von Model und Darstellung verwendet werden.

Die undock-Methode wird ausgef&uuml;hrt, nachdem das Composite aus dem DOM
entfernt wurde und l&auml;sst f&uuml;r Nachbereitung, Bereinigung un
Finalisierung des Models nutzen.

Bei einem Composite in Kombination mit einer Bedingung (condition) h&auml;ngt
der Aufruf der Methoden vom Ergebnis der Bedingung ab.


### Events

TODO:

```javascript
TODO:
```

```html
TODO:
```


### Synchronization

TODO:

```javascript
TODO:
```

```html
TODO:
```


### Validation

TODO:

```javascript
TODO:
```

```html
TODO:
```


- - -

[Sitemap](sitemap.md) | [Inhalt](README.md#komponenten) | [Reaktives Rendering](reactive.md)
