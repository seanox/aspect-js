# Einführung

## Was ist Seanox aspect-js?

Geprägt durch die guten Erfahrungen aus JSF (Java Server Faces) in Bezug auf
Funktion und einfache Integration ins Markup, entstand der Wunsch nach einer
ähnlichen client-seitigen fullstack Lösung
Bei Seanox aspect-js steht ein minimalistischer Ansatz zur Implementierung von
Single-Page Applications (SPAs) im Vordergrund.  

Das Framework greift den deklarativen Ansatz von HTML auf und erweitert ihn um
Expression Language, Rendering mit zusätzlichen Attributen,
Objekt/Modell-Bindung, Model View Controller, Resource Bundle, NoSQL-Datasource,
Testumgebung und vieles mehr.


## Erste Schritte

Das Framework besteht aus reinem JavaScript.

Die Releases werden heruntergeladen oder über einen Release-Channel eingebunden.
Release-Channel stellen kontinuierlich die neuesten endgültigen Hauptversionen
zur Verfügung, die sind abwärtskompatibel zur Hauptversion. Seanox aspect-js ist
somit immer auf dem neuesten Stand.

Jedes Release besteht aus zwei Versionen.  
Die Entwickler-Version beinhaltet umfangreiche Kommentare zu Konzeption,
Funktion, Arbeitsweise und Verwendung.  
Die Produktions-Version ist in der Grösse optimiert aber nicht verschleiert
(obfuscated).

Erstelle eine HTML-Datei, z.B. _index.html_ und füge Seanox apect-js ein.

```html
<!-- development version, includes helpful comments -->
<script src="https://cdn.jsdelivr.net/npm/seanox/releases/aspect-js.js"></script>
```

oder

```html
<!-- production version, optimized in size but not obfuscated -->
<script src="https://cdn.jsdelivr.net/npm/seanox/releases/aspect-js-min.js"></script>
```

__Das Framework ist zur Implementierung modularer und komponentenbasierter__
__Single-Page-Applications entwickelt worden. Durch das automatische Laden__
__von Ressourcen, Modulen und Daten ist die Verwendung eines Web-Servers__
__erforderlich.__


## Arbeitsbereich

Seanox aspect-js agiert ausschliesslich im BODY-Tag, welches selbt mit
einbezogen wird.


## Expression Language

Expressions bzw. die [Expression Language (EL)](expression.md) ist ein einfacher
Zugang zum clientseitigen JavaScrript und damit zu den Modellen und Komponenten
im aspect-js. In den Expressions wird die komplette JavaScript-API unterstützt,
die mit zusätzliche Schlüsselwörtern angereichert ist, womit auch die
zahlreichen arithmetische und logische Operatoren verwendet werden können.

Die Expression-Language kann im Markup als Freitext und in den Attributen der
HTML-Elemente verwendet werden. Ausgenommen sind JavaScript- und CSS-Elemente.
Hier wird die Expression-Language nicht unterstützt.  
Bei der Verwendung als Freitext wird als Ausgabe immer reiner Text (plain text)
erzeugt. Das Hinzufügen von Markup, insbesondere HTML-Code, ist so nicht möglich
und wir nur mit den Attributen `output` und `import` unterstützt.

```html
<body lang="{{DataSource.locale}}">
  <p>
    Today is {{new Date().toDateString()}}
    and it's {{new Date().toLocaleTimeString()}} o'clock.
  </p>
</body>
```

Die Expression Language ist zeitweise sichtbar, da der Renderer erst nach dem
Laden der Page aktiv wird. Alternativ können die Attribute
[output](markup.md#output) und [import](markup.md#import) vewendet werden,
welche eine direkte Ausgabe in das innere HTML vom Element bewirken. 

```html
<p output="Today is {{new Date().toDateString()}}
    and it's {{new Date().toLocaleTimeString()}} o'clock.">
</p>
```

Expressions können zur Laufzeit globale Variablen erzeugen und nutzen.

```html
{{now:new Date()}}
<p>
  Today is {{now.toDateString()}}
  and it's {{now.toLocaleTimeString()}} o'clock.
</p>
```

[Mehr erfahren](expression.md)


## Attribute

Der deklarative Ansatz ist in aspect-js vorrangig mit Attributen umgesetzt und
kann mit allen HTML-Elementen und in Kombination verwendet werden. Ausgenommen
sind `SCRIPT`, was nur mit dem Typ `composite/javascript` unterstützt wird,
sowie `STYLE`, welches nicht unterstützt wird. Die Werte der Attribute können
statische oder mit Verwendung der Expression-Language dynamisch sein.
Enthält ein Attribut eine Expression, werden das Attribut und der Wert
unveränderlich, da der Renderer diese bei jeder Auffrischung (Render-Zyklus)
erneut mit dem aktualisierten Wert der initialen Expression setzen wird.

[Mehr erfahren](markup.md#attribute)


### output

Das Attribut setzt den Wert oder das Ergebnis seines Ausdrucks als inneren
HTML-Code bei einem HTML-Element. Als Wert werden Text, ein Elemente oder mehre
Elemente als NodeList bzw. Array -- diese werden dann direkt eingefügt, oder
eine [DataSource-URL (locator)](datasource.md#locator) die einen Inhalt aus der
[DataSource](datasource.md) lädt und transformiert, erwartet.

```html
<p output="Today is {{new Date().toDateString()}}
    and it's {{new Date().toLocaleTimeString()}} o'clock.">
</p>

<p output="xml:/example/content">
  loading resource...  
</p>

<p output="xml:/example/data xslt:/example/style">
  loading resource...  
</p>
```

[Mehr erfahren](markup.md#output)


### import

Diese Deklaration lädt Inhalte dynamisch nach und ersetzt den inneren HTML-Code
eines Elements. Wenn der Inhalt erfolgreich geladen wurde, wird das Attribut
`import` entfernt. Das Attribut erwartet als Wert ein Elemente oder mehre
Elemente als NodeList bzw. Array -- diese werden dann direkt eingefügt, oder
eine absolute oder relative URL zu einer entfernten Ressource, die per
HTTP-Methode GET nachgeladen wird, oder eine
[DataSource-URL (locator)](datasource.md#locator) die einen Inhalt aus der
[DataSource](datasource.md) lädt und transformiert, erwartet.

```html
<p output="Today is {{new Date().toDateString()}}
    and it's {{new Date().toLocaleTimeString()}} o'clock.">
</p>

<p output="xml:/example/content">
  loading resource...  
</p>

<p output="xml:/example/data xslt:/example/style">
  loading resource...  
</p>

<p import="https://raw.githubusercontent.com/seanox/aspect-js/master/test/resources/import_c.htmlx">
  loading resource...  
</p>

```

[Mehr erfahren](markup.md#import)


### condition

Das condition-Attribut legt fest, ob ein Element im DOM erhalten bleibt.  
Der mit dem Attribut angegebene Ausdruck muss explizit `true` oder `false`
zurückliefern. Mit `false` wird ein Element temporär aus dem DOM entfernt und
lässt sich später durch das Auffrischen des __Eltern-Elements__ wieder einfügen,
wenn der Ausdruck `true` zurückliefert.  
Eine Besonderheit stellt die Kombination mit dem Attribut [interval](#interval)
dar, da mit dem Entfernen des Elements aus dem DOM auch der zugehörige Timer
beendet wird. Wird das Element mit einer späteren Auffrischung wieder in das DOM
aufgenommen, startet der Timer von vorn, wird also nicht fortgesetzt.

```html
<p condition="{{Model.visible}}">
  ...
</p>
```

Die Verwendung vom condition-Attribut in Verbindung mit eingebettetem JavaScript
ist als Composite-JavaScript möglich.

```html
<script type="composite/javascript" condition="{{Model.visible}}">
  ...
</script>
```

[Mehr erfahren](markup.md#condition)


### interval

Diese Deklaration aktiviert eine intervallgesteuerte Auffrischung eines
HTML-Elements, ohne dass die Auffrischung aktiv angestossen werden muss.  
Als Wert wird ein Intervall in Millisekunden erwartet, der auch als Expression
formuliert werden kann. Die Verarbeitung erfolgt nebenläufig bzw. asynchron aber
nicht parallel. Bedeutet, dass die Verarbeitung nach dem gesetzten
Zeit-Intervall starten soll, diese aber erst beginnt, wenn eine zuvor begonnen
JavaScript-Prozedur beendet wurde. Daher ist das Intervall als zeitnah, nicht
aber als exakt zu verstehen.
Das interval-Attribut erwartet einen Wert in Millisekunden. Ein ungültiger Wert
verursacht eine Konsolenausgabe. Das Intervall beginnt automatisch und aktiv, so
lange das Element im DOM existiert.

```html
<p interval="1000">
  {{new Date().toLocaleTimeString()}}
</p>
```

Mit der Kombination von Intervall und Variablen-Expression ist die Umsetzung
eines permanenten Zählers sehr einfach.

```html
{{counter:0}}
<p interval="1000">
  {{counter:parseInt(counter) +1}}^
  {{counter}}
</p>
```

Die Verwendung vom interval-Attribut in Verbindung mit eingebettetem JavaScript
ist als Composite-JavaScript möglich.

```html
<script type="composite/javascript" interval="1000">
  console.log(new Date().toLocaleTimeString());
</script>
```

[Mehr erfahren](markup.md#interval)


### composite

Kennzeichnet im Markup ein Element als [Composite](composites.md).  
Composites sind modulare Komponente und haben in aspect-js eine vielseitige
Bedeutung.  
Sie werden von der [SiteMap](mvc.md#sitemap) als Faces, also als Ziele für
virtuelle Pfade im Face-Flow verwendet, was direkten Einfluss auf die
Sichtbarkeit der Composites hat.
Der [Model View Controler](mvc.md#sitemap) unterstützt für Composites eine
automatisches [Objekt-/Model-Binding](object-binding.md).  
Die Ressourcen (CSS, JS, Markup) lassen sich für Composite in das
Modul-Verzeichnis auslagern und werden erst bei Bedarf automatisch nachgeladen. 

```html
<article composite>
  ...
</article>
```

Details zur Verwendung von Composites / modularen Komponente werden in den
Abschnitten [Composites](composites.md) und [Model View Controler](mvc.md)
beschrieben.

[Mehr erfahren](markup.md#composite)


### events

Diese Deklaration bindet ein oder mehre Ereignisse (siehe
https://www.w3.org/TR/DOM-Level-3-Events) an ein HTML-Element. Ereignisse
eröffnen primäre Funktionen zur ereignisgesteuerte Auffrischung von anderen
HTML-Elementen (mehr dazu im Abschnitt [render](#render)), sowie zur Validierung
und Synchronisation von HTML-Elementen und den korrespondierenden
JavaScript-Modellen (mehr dazu im Abschnitt [validate](#validate).  

```html
<span id="output1">{{#text1.value}}</span>
<input id="text1" type="text"
    events="mouseup keyup change" render="#output1"/>
```

[Mehr erfahren](markup.md#events)


### render

Das Attribut `render` erfordert die Kombination mit dem Attribut `events`.
Zusammen definieren sie, welche Ziele mit welchen auftretenden Events
aufgefrischt werden.  
Als Wert erwartet das `render` Attribut einen CSS-Selector bzw. Query-Selector
welche die Ziele festlegt.

```html
<span id="output1">{{#text1.value}}</span>
<input id="text1" type="text"
    events="mouseup keyup change" render="#output1"/>
```

[Mehr erfahren](markup.md#render)
 

### validate

Das Attribut `validate` erfordert die Kombination mit dem Attribut `events`.
Zusammen definieren und steuert sie die Synchronisation zwischen dem Markup
eines Composites und dem korrespondierenden JavaScript-Model.  
Wird `validate` verwendet, muss das JavaScript-Model eine entsprechende
validate-Methode implementieren: `boolean Model.validate(element, value)`. 
Der Rückgabewert muss ein boolescher Wert sein und so wird nur beim Rückgabewert
`true` der Wert aus dem Composite in das JavaScript-Model synchronisiert. 

```html
<form id="Model" composite>
  <input id="text1" type="text" placeholder="e-mail address"
      validate events="mouseup keyup change" render="#Model"/>
  <input type="submit" value="submit" validate events="click"/>
</form>
```

[Mehr erfahren](markup.md#validate)


## DataSource

DataSource ist ein NoSQL-Ansatz zur Datenspeicherung auf Basis von XML-Daten in
Kombination mit mehrsprachiger Datentrennung, optionaler Aggregation und
Transformation. Es ist eine Kombination von Ansätzen einer read-only-Datenbank
und einem CMS.  
Die DataSource basiert auf statischen Daten, die per XPath abgefragt werden und
das Ergebnis verkettet, aggregiert und per XSLT transformiert werden kann.

[Mehr erfahren](datasource.md)


## Resource Bundle (Messages)

(Resource)Messages ist eine statische Erweiterung der
[DataSource](datasource.md) für Internationalisierung und Lokalisierung.  
Die Implementierung basiert auf einer Menge von Schlüssel-Wert-Paaren in Form
von Label-Elementen, die in der Datei `locales.xml` in der DataSource
definiert werden.

[Mehr erfahren](messages.md)


## Model View Controller

Der Model View Controler (MVC) ist ein Entwurfsmuster zur Trennung von
Interaktion, Daten und Darstellung.

```
+-------------------------------------------+--------------+---------------------------------+
|  View                                     |  Controller  |  Model                          |
+-------------------------------------------+--------------+---------------------------------+
|  Markup                                   |  Composite   |  JavaScript                     |
|                                           |  Path        |                                 |
|                                           |  SiteMap     |                                 |
+-------------------------------------------+--------------+---------------------------------+
|  <form id="model" composite>              |  aspect-js   |  var model = {                  |
|    <input id="message" events="change"/>  |              |      message:"",                | 
|    <button id="submit"/>                  |              |      submit: {                  |
|  </form>                                  |              |          onClick: function() {  |
|                                           |              |          }                      |
|                                           |              |      }                          |
|                                           |              |  }                              |
+-------------------------------------------+--------------+---------------------------------+
```

[Mehr erfahren](mvc.md)


### Controller

Hier muss zwischen I/O-Controller und Applikations-Controller unterschieden
werden. Das reine MVC-Entwurfsmuster meint den I/O-Controller zur Übermittlung
der Interaktionen. Da dieser durch Betriebssystem und Browser bereitgestellt
wird, bezieht sich der Controler in aspect-js vordergründig auf den
Applikations-Controller, der Abläufe innerhalb einer Applikation (Face-Flow)
steuert und das Binding von Markup und JavaScript sowie die Steuerung vom
Datenfluss zwischen View und Model übernimmt.  
In aspect-js ist der Controller die Zusammenarbeit von Composite, Paths und
SiteMap.


### Model

Das Modell ist ein darstellbares/projezierbares Objekt.  
Es empfängt (Status)Änderungen und Interaktionen der View, die durch den 
Controler übermittelt werden, bzw. bietet der View eine Schnittstelle zu Daten
sowie Funktionen und Diensten der Middelware. Das Modell dient vorrangig der
View zur Darstellung und Verwaltung der Zustände, für fachliche Funktionalität
nimmt es weitere Komponenten in Anspruch.    
In aspect-js werden die Modelle durch statische JavaScript-Objekte
repräsentiert. Konzeptionell ist die Implementierung der Entwurfsmuster Fassade
und Delegation angedacht, so dass die statischen Modelle intern weitere
Komponenten und Abstraktion verwenden.


### View

Die View ist ausschliesslich für die Darstellung bzw. Projektion eines Modells
verantwortlich.  
Projektion ist ein wichtiger Begriff, da die Art der Darstellung eines Models
nicht eingeschränkt ist.  
In aspect-js werden die Views durch das Markup repräsentiert.


## SiteMap

Die Darstellung in aspect-js ist mehrschichtig und die Ansichten sind als Page,
Faces und Facets organisiert, auf die über virtuelle Pfade zugegriffen wird. Zu
diesem Zweck stellt SiteMap eine hierarchische Verzeichnisstruktur zur
Verfügung, die auf den virtuellen Pfaden für alle Ansichten basiert. Die SiteMap
steuert den Zugriff und die Visualisierung (Ein- und Ausblenden) der Ansichten,
den sogenannten Face-Flow.  
Face-Flow und Visualisierung funktionieren resolut und verwenden das DOM zum
Einfügen und Entfernen der Ansichten (Faces und Facets).

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

Weitere Bestandteile der SiteMap sind die Navigation und ein Permission Concept.

[Mehr erfahren](mvc.md#sitemap)


### Virtual Paths

Virtuelle Pfade werden für die Navigation und zur Kontrolle des Face-Flow
verwendet.  
Das Ziel kann ein Face, eine Facet oder eine Funktion sein.  
Bei SPAs (Single-Page-Application) wird das Fragment (anchor part) der URL für
die Pfade verwendet.

```
https://example.local/example/#path
```

Entsprechend dem Dateisystem werden auch hier absolute und relative Pfade sowie
Funktionspfade unterstützt.  
Pfade bestehen ausschliesslich aus Wortzeichen und Unterstrichen (basierend auf
zusammengesetzten IDs) und müssen mit einem Buchstaben beginnen und verwenden
das Doppelkreuz (#) als Separator und Wuruel.

[Mehr erfahren](mvc.md#virtual-paths)


### Object-/Model-Binding

TODO:


## Komponenten

Die Implementierung von aspect-js zielt auf eine modulare und auf Komponenten
basierte Architektur. Das Framework unterstützt dazu eine deklarative
Kennzeichnung von Komponenten im Markup, die Auslagerung und das automatische
Laden von Ressourcen, sowie ein automatisches Objekt/Model-Bindung.

Eine Komponente besteht im initialen Markup aus einem als Composite
gekennzeichneten HTML-Element mit einer eindeutigen Id.

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

Das innere Markup, CSS und JavaScript lassen sich ins Dateisystem auslagern.  
Das Standard-Verzeichnis `./modules` kann über die Eigenschaft
`Composite.MODULES` geändert werden.

```
+- modules
|  |
|  +- example.css
|  +- example.js
|  +- example.html
|
+- index.html
```

Das Laden der Ressourcen und die Objekt/Model-Bindung erfolgt partiell, wenn die
Komponente im UI benötigt wird -- also mit der ersten Anzeige, was über die
[SiteMap](sitemap.md) als zentrales Face-Flow-Management gesteuert wird und so
die Ladezeit stark minimiert, da punktuell jeweils nur für die aktiven
UI-Komponenten benötigten Ressourcen geladen werden.  
Das Auslagern und Laden der Ressourcen zur Laufzeit ist optional und lässt sich
komplett, teilweise und nicht anwenden. Beim Nachladen und Einbinden gibt es
eine feste Reihenfolge: CSS, JS, HTML/Markup.  
Wird die Anfrage einer Ressourcen mit Status 404 beantwortet, wird davon
ausgegangen, dass diese Ressource nicht ausgelagert wurde. Werden Anfragen weder
mit Status 200 oder 404 beantwortet wird von einem Fehler ausgegangen.  
Das Laden von Ressourcen wird nur einmalig mit der ersten Anforderung der
Komponente für das UI ausgeführt.

Konzeptionell sind für die Implementierung von Komponenten die Entwurfsmuster
Fassade und Delegation angedacht, die intern weitere Komponenten und Abstraktion
verwenden.

### Object-/Model-Binding

TODO:


## Unit Test

Das Test-API unterstützt die Implementierung und Ausführung von
Integrationstests und kann für Suiten (suite), Szenarien (scenario) und einzelne
Testfälle (case) verwendet werden.

Als modularer Bestandteil von Seanox aspect-js ist das Test-API in jedem Release
enthalten ist, der sich ohne Probleme entfernen lässt. Da das Test-API einige
Besonderheiten in Bezug auf Fehlerbehandlung und Konsolen-Ausgabe bewirkt, muss
das Test-API zur Laufzeit bewusst aktiviert werden.

```javascript
Test.activate();

Test.create({test:function() {
    ...
}});

Test.start();
```


### Testfall

Der kleinste Bestandteil in einem Integrationstest, der hier als "Task"
verwendet wird, da "Case" ein Schlüsselwort im JavaScript ist. Es kann allein
implementiert werden, wird aber immer in einem Szenario verwendet.

```javascript
Test.activate();

Test.create({test:function() {
    Assert.assertTrue(true);
}});

Test.start();
```

### Szenario

Ein Szenario ist eine Abfolge von vielen Testfällen (Tasks).

```javascript
Test.activate();

Test.create({test:function() {
    Assert.assertTrue(true);
}});
Test.create({name:"example", timeout:1000, test:function() {
    Assert.assertTrue(true);
}});
Test.create({error:Error test:function() {
    throw new Error();
}});
Test.create({error:/^My Error/i, test:function() {
    throw new Error("My Error");
}});
Test.create({ignore:true, test:function() {
    Assert.assertTrue(true);
}});

Test.start();
```

### Suite 

Eine Suite ist ein komplexes Paket aus verschiedenen Testfällen, Szenarien und
anderen Suiten. In der Regel besteht eine Suite aus verschiedenen Dateien, die
dann einen komplexen Test darstellen. Ein Beispiel für eine gute Suite ist eine
Kaskade von verschiedenen Dateien und wo der Test in jeder Datei und an jedem
Stelle gestartet werden kann. Dies ermöglicht einen Integrationstest auf
verschiedenen Ebenen und mit unterschiedlicher Komplexität.

 
### Assert

Die Testfälle werden mit Behauptungen (Assertions) implementiert. Das Test-API
bietet elementare Aussagen, die erweitert werden können. Die Funktion ist
einfach. Wenn eine Behauptung nicht wahr ist, tritt ein Fehler auf.


### Console

TODO:


### Monitoring

TODO:


### Control

TODO:


### Events

TODO:
