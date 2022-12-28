[Model View Controller](mvc.md) | [Inhalt](README.md#komponenten) | [Reaktives Rendering](reactive.md)
- - -

# Komponenten

Die Implementierung von Seanox aspect-js ist auf eine modulare und auf
Komponenten basierte Architektur ausgerichtet. Das Framework unterst&uuml;tzt dazu
eine deklarative Kennzeichnung von Komponenten im Markup, die Auslagerung und
das automatische Laden von Ressourcen, sowie ein automatisches
Object/Model-Binding.


## Inhalt

* [Modul](#modul)
* [Komponente](#komponente)
* [Composite](#composite)
* [Aufbau](#aufbau)
* [Auslagerung](#auslagerung)
* [Laden](#laden)
  * [CSS](#css)
  * [JavaScript](#javascript)
  * [HTML](#html)
* [Common Standard-Komponente](#common-standard-komponente)  
* [Object/Model-Binding](#objectmodel-binding)
  * [Namespace](#namespace)
  * [Scope](#scope)
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

Ein Composite bezeichnet eine funktional eigenst&auml;ndige Komponente die sich aus
Markup, CSS und JavaScript(-Model) sowie optional aus weiteren Ressourcen
zusammensetzen kann.  
Im Hinblick auf den Model-View-Controller-Ansatz, lassen sich mit einem Composite
Model und View bereitstellen.

__Damit unterscheidet sich das Composite-Konzept vom JavaScript-Modul-Konzept,__
__was aber ebenfalls verwendet werden kann. Ein anderer wichtiger Unterschied__
__besteht beim Laden und Ausf&uuml;hren von JavaScript, was bei Composites in__
__einem Render-Zyklus linear/sequenziell und somit synchron erfolgt.__


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


## Auslagerung

Das innere Markup, CSS und JavaScript von Composites lassen sich auslagern.  
Das Standard-Verzeichnis `./modules` kann &uuml;ber die Eigenschaft
`Composite.MODULES` ge&auml;ndert werden. Der Dateiname der ausgelagerten Ressourcen
leitet sich von der ID des als Composite gekennzeichneten HTML-Elements ab.
Welche Ressourcen bzw. Teile der Komponente ausgelagert werden, kann f&uuml;r jede
Komponente individuell entschieden werden. 

```
+ modules
  - example.css
  - example.js
  - example.html
- index.html
```

Beim Standardverhalten wird der Name der Ressourcen von der Composite-ID
abgeleitet und nutzt diese dann als Kleinschreibung am Anfang. Dieses Verhalten
kann mit dem Attribute [strict](markup.md#strict) ge&auml;ndert werden, so dass die
Composite-ID unver&auml;ndert f&uuml;r die Ressourcen verwendet werden.



## Laden

Das Laden der Ressourcen und das Object/Model-Binding erfolgt partiell, wenn das
Composite im UI ben&ouml;tigt wird, was die [SiteMap](sitemap.md) als zentrales
Face-Flow-Management steuert und so die Ladezeit stark minimiert, da
situationsabh&auml;ngig vom UI nur die Ressourcen der aktiv verwendeten Composites
geladen werden.  
Das Auslagern und Laden der Ressourcen zur Laufzeit ist optional und l&auml;sst sich
komplett, teilweise und nicht anwenden. Beim Nachladen und Einbinden gibt es
eine feste Reihenfolge: CSS, JavaScript, HTML/Markup.  
Wird die Anfrage einer Ressourcen mit Status 404 beantwortet, wird davon
ausgegangen, dass diese Ressource nicht ausgelagert wurde. Werden Anfragen weder
mit Status 200 oder 404 beantwortet wird von einem Fehler ausgegangen.  
Das Laden von Ressourcen wird nur einmalig mit der ersten Anforderung der
Komponente f&uuml;r das UI ausgef&uuml;hrt und der Inhalt dann zwischengespeichert.


### CSS

CSS wird als Style-Element in das HEAD-Element eingef&uuml;gt. Ohne ein HEAD-Element
verursacht das Einf&uuml;gen einen Fehler.


### JavaScript

JavaScript wird nicht als Element eingef&uuml;gt, sondern direkt mit der eval-Methode 
ausgef&uuml;hrt. Da die eval-Methode ggf. einen eigenen Namensraum f&uuml;r Variablen
bilden kann, ist es wichtig, die globale Variable mit `window[...]` zu
initialisieren.

```javascript
window['login'] = {
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
Komponente selbst kein inneres HTML besitzt und f&uuml;r das Elemente auch nicht die
Attribute `import` oder `output` deklariert wurden. Nur in diesem Fall wird
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


## Object/Model-Binding


### Namespace

Vergleichbar mit Paketen in anderen Programmiersprachen k&ouml;nnen Namensr&auml;ume zur
Abbildung hierarchischer Strukturen und zur Gruppierung thematisch verwandter
Komponenten und Ressourcen genutzt werden.  
Die Implementierung erfolgt in JavaScript auf Objektebene.  
Da es kein reales Element der Programmiersprache ist, wird dies durch das
Verketten von Objekten zu einem Objektbaum abgebildet.  
Jede Ebene in dieser Objektbaum repr&auml;sentiert einen Namensraum.  
Wie f&uuml;r die Bezeichner von Objekten typisch, verwenden auch Namensr&auml;ume
Buchstaben, Zahlen und Unterstriche, die durch einen Punkt getrennt werden. Als
Besonderheit werden auch Arrays unterst&uuml;tzt. Wenn eine Ebene im Namensraum eine
reine Zahl ist, wird ein Array angenommen.

Das Object/Model-Binding basiert auf den IDs der Composites sowie deren Position
und Reihenfolge im DOM.  
Die Wurzel vom Namensraum bildet immer eine Composite-ID.  
Der Namensraum kann dabei absolut sein, also der Namensraum entspricht einer
Composite-ID, oder er basiert auf dem Namensraum eines im DOM &uuml;bergeordneten
Composites.

```html
<html>
  <body>
    <div id="A">
      <div id="B">
        <div id="C">
        </div>
      </div>
    </div>
  </body>
</html>  
```

Beispiele m&ouml;glicher Namesr&auml;ume:

`a` + `a.b` + `a.b.c`  
`b` + `b.c`  
`c`


### Scope

Der Scope basiert auf dem Namensraum als Beschreibungstext und bildet diesen auf
der Objektebene ab.  


### Model

Ein Model ist ein JavaScript-Objekt in einem beliebigen Namensraum, dass die
Zust&auml;nde vom User-Interface/View speichert und eine Schnittstelle f&uuml;r den
&Uuml;bergang von der Benutzerschnittstelle (User-Interface/View) zur Gesch&auml;ftslogik
und/oder zum Backend zur Verf&uuml;gung stellt.  
Konzeptionell ist die Implementierung der Entwurfsmuster Fassade und Delegation
angedacht, so dass Models intern weitere Komponenten und Abstraktion verwenden.


### Property

Es ist eine Eigenschaft innerhalb eines Models, die HTML-Elements innerhalb
eines Composites mit gleichnamiger ID referenziert.  
Elemente der Properties nutzen relativen Bezeichner (ID). Der Namensraum basiert
auf dem vom Composite und erweitert sich um ggf. weitere &uuml;bergeordnete Element
mit IDs.

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

Die Composite-API synchronisiert ereignisgesteuert die Eigenschaft im Modell mit
dem Wert vom HTML-Element. F&uuml;r ein HTML-Element werden die entsprechenden
Ereignisse &uuml;ber das gleichnamige Attribut definiert.


### Qualifier

In einigen F&auml;llen ist ein Bezeichner (ID) nicht eindeutig. Zum Beispiel wenn 
Eigenschaften Arrays sind oder im Markup eine Iteration verwendet wird. In
diesen F&auml;llen kann der Bezeichner, getrennt durch einen Doppelpunkt, um einen
zus&auml;tzlichen eindeutigen Qualifier erweitert werden. Qualifier wirken beim
Object/Model-Binding wie Properties und verl&auml;ngern den Namensraum.

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

Die Verkn&uuml;pfung bzw. Bindung von Markup und JavaScript(-Model) erfolgt &uuml;ber die
Composite-API. Dazu muss ein HTML-Element das Attribut `composite` und eine
g&uuml;ltige sowie eindeutige ID besitzen, die den Anforderungen des Namensraums
entspricht.

Die Composite-API erkennt und &uuml;berwacht die Existenz von Markup der Composites
im DOM. So kann das korrespondierende (JavaScript-)Model &uuml;ber die Methoden
`dock` und `undock` informiert werden, wenn das Composite als Komponente dem
DOM hinzugef&uuml;gt bzw. aus diesem entfernt wird.  

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

Die dock-Methode wird vor dem Rendern, vor dem Einf&uuml;gen des Composites in das
DOM oder nach dem Laden der Seite beim ersten Rendern ausgef&uuml;hrt und kann das
zur Vorbereitung von Model und Darstellung verwendet werden.  
Die undock-Methode wird ausgef&uuml;hrt, nachdem das Composite aus dem DOM entfernt
wurde und l&auml;sst f&uuml;r Nachbereitung, Bereiningung und Finalisierung des Models
nutzen.

Bei einem Composite in Kombination mit einer Bedingung (condition) h&auml;ngt der
Aufruf der Methoden vom Ergebnis der Bedingung ab.


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

[Model View Controller](mvc.md) | [Inhalt](README.md#komponenten) | [Reaktives Rendering](reactive.md)
