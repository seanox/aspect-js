[Model View Controler](mvc.md) | [Inhalt](README.md#komponenten) | [Erweiterung](extension.md)
- - -

# Komponenten

Die Implementierung von Seanox aspect-js ist auf eine modulare und auf
Komponenten basierte Architektur ausgerichtet. Das Framework unterstützt dazu
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

Eine Komponente bezeichnet einen funktional und/oder technisch eigenständigen
Bestandteil, der aus einem oder mehreren Modulen bestehen kann oder ein Modul
kann eine oder mehrere Komponenten bereitstellen.


## Composite

Ein Composite bezeichnet eine funktional eigenständige Komponente die sich aus
Markup, CSS und JavaScript(-Model) sowie optional aus weiteren Ressourcen
zusammensetzen kann.


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
Das Standard-Verzeichnis `./modules` kann über die Eigenschaft
`Composite.MODULES` geändert werden.  
Der Dateiname der ausgelagerten Ressourcen leitet sich von der ID des als
Composite gekennzeichneten HTML-Elements ab. Welche Ressourcen bzw. Teile der
Komponente ausgelagert werden kann für jede Komponente individuell entschieden
werden. 

```
+- modules
|  |
|  +- example.css
|  +- example.js
|  +- example.html
|
+- index.html
```


## Laden

Das Laden der Ressourcen und das Object/Model-Binding erfolgt partiell, wenn das
Composite im UI benötigt wird, was die [SiteMap](sitemap.md) als zentrales
Face-Flow-Management steuert und so die Ladezeit stark minimiert, da
situationsabhängig vom UI nur die Ressourcen der aktiv verwendeten Composites
geladen werden.  
Das Auslagern und Laden der Ressourcen zur Laufzeit ist optional und lässt sich
komplett, teilweise und nicht anwenden. Beim Nachladen und Einbinden gibt es
eine feste Reihenfolge: CSS, JavaScript, HTML/Markup.  
Wird die Anfrage einer Ressourcen mit Status 404 beantwortet, wird davon
ausgegangen, dass diese Ressource nicht ausgelagert wurde. Werden Anfragen weder
mit Status 200 oder 404 beantwortet wird von einem Fehler ausgegangen.  
Das Laden von Ressourcen wird nur einmalig mit der ersten Anforderung der
Komponente für das UI ausgeführt und der Inhalt dann zwischengespeichert.


### CSS

CSS wird als Style-Element in das HEAD-Element eingefügt. Ohne ein HEAD-Element
verursacht das Einfügen einen Fehler.


### JavaScript

JavaScript wird nicht als Element eingefügt, sondern direkt mit der eval-Methode 
ausgeführt. Da die eval-Methode ggf. einen eigenen Namensraum für Variablen
bilden kann, ist es wichtig, die globale Variable mit `window[...]` zu
initialisieren.

```javascript
window['login'] = {
    validate(element, value) {
    }
    logon: {
        onClick(event) {
        }
    }
}
```


### HTML

HTML/Markup wird für ein Composite nur geladen, wenn das HTML-Element der
Komponente selbst kein inneres HTML besitzt und für das Elemente auch nicht die
Attribute `import` oder `output` deklariert wurden. Nur in diesem Fall wird
von einer leeren Komponente mit ausgelagertem HTML/Markup ausgegangen.


## Common Standard-Komponente

Mit dem Laden der Seite und der Initialisierung des Frameworks und der Anwendung
wird automatisch auch die Commons-Komponente im Modul-Verzeichnis geladen, die
aus der JavaScript-Datei `common.js` und/oder dem CSS-Stylesheet `common.css`
bestehen kann. Beide Dateien sind zur Ablage initialer und anwendungsweiter
Logik bzw. Styles gedacht.

```
+- modules
|  |
|  +- common.css
|  +- common.js
|  +- ...
|
+- index.html
```


## Object/Model-Binding


### Namespace

Vergleichbar mit Paketen in anderen Programmiersprachen können Namensräume zur
Abbildung hierarchischer Strukturen und zur Gruppierung thematisch verwandter
Komponenten und Ressourcen genutzt werden.  
Die Implementierung erfolgt in JavaScript auf Objektebene.  
Da es kein reales Element der Programmiersprache ist, wird dies durch das
Verketten von Objekten zu einem Objektbaum abgebildet.  
Jede Ebene in dieser Objektbaum repräsentiert einen Namensraum.  
Wie für die Bezeichner von Objekten typisch, verwenden auch Namensräume
Buchstaben, Zahlen und Unterstriche, die durch einen Punkt getrennt werden. Als
Besonderheit werden auch Arrays unterstützt. Wenn eine Ebene im Namensraum eine
reine Zahl ist, wird ein Array angenommen.

Das Object/Model-Binding basiert auf den IDs der Composites sowie deren Position
und Reihenfolge im DOM.  
Die Wurzel vom Namensraum bildet immer eine Composite-ID.  
Der Namensraum kann dabei absolut sein, also der Namensraum entspricht einer
Composite-ID, oder er basiert auf dem Namensraum eines im DOM übergeordneten
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

Beispiele möglicher Namesräume:

`a` + `a.b` + `a.b.c`  
`b` + `b.c`  
`c`


### Scope

Der Scope basiert auf dem Namensraum als Beschreibungstext und bildet diesen auf
der Objektebene ab.  


### Model

Ein Model ist ein JavaScript-Objekt in einem beliebigen Namensraum und stellt
als Schnittstelle den Übergang von der Benutzerschnittstelle (User-Interface)
zur Geschäftslogik und/oder zum Backend zur Verfügung.  
Konzeptionell ist die Implementierung der Entwurfsmuster Fassade und Delegation
angedacht, so dass Models intern weitere Komponenten und Abstraktion verwenden.


### Property

Es ist eine Eigenschaft innerhalb eines Models, die HTML-Elements innerhalb
eines Composites mit gleichnamiger ID referenziert.  
Elemente der Properties nutzen relativen Bezeichner (ID). Der Namensraum basiert
auf dem vom Composite und erweitert sich um ggf. weitere übergeordnete Element
mit IDs.

```javascript
var model = {
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
dem Wert vom HTML-Element. Für ein HTML-Element werden die entsprechenden
Ereignisse über das gleichnamige Attribut definiert.


### Qualifier

In einigen Fällen ist ein Bezeichner (ID) nicht eindeutig. Zum Beispiel wenn 
Eigenschaften Arrays sind oder im Markup eine Iteration verwendet wird. In
diesen Fällen kann der Bezeichner durch einen zusätzlichen eindeutigen
Qualifier, getrennt durch einen Doppelpunkt, erweitert werden.  
Qualifier wirken beim Object/Model-Binding wie Properties und verlängern den
Namensraum.

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

Die Verknüpfung bzw. Bindung von Markup und JavaScript(-Model) erfolgt über die
Composite-API. Dazu muss ein HTML-Element das Attribut `composite` und eine
gültige sowie eindeutige ID besitzen, die den Anforderungen des Namensraums
entspricht.

Die Composite-API erkennt und überwacht die Existenz von Markup der Composites
im DOM. So kann das korrespondierende (JavaScript-)Model über die Methoden
`dock` und `undock` informiert werden, wenn das Composite als Komponente dem
DOM hinzugefügt bzw. aus diesem entfernt wird.  

Die Implementierung beider Methoden ist optional.

```javascript
var model = {
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

Die dock-Methode wird vor dem Rendern, vor dem Einfügen des Composites in das
DOM oder nach dem Laden der Seite beim ersten Rendern ausgeführt und kann das
zur Vorbereitung von Model und Darstellung verwendet werden.  
Die undock-Methode wird ausgeführt, nachdem das Composite aus dem DOM entfernt
wurde und lässt für Nachbereitung, Bereiningung und Finalisierung des Models
nutzen.

Bei einem Composite in Kombination mit einer Bedingung (condition) hängt der
Aufruf der Methoden vom Ergebnis der Bedingung ab.


### Events

TODO:


### Synchronization

TODO:


### Validation

TODO:


- - -

[Model View Controler](mvc.md) | [Inhalt](README.md#komponenten) | [Erweiterung](extension.md)
