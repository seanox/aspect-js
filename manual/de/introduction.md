[Motivation](motivation.md) | [Inhalt](README.md#einf-hrung) | [Markup](markup.md)
- - -

# Einführung


## Was ist Seanox aspect-js?

Geprägt durch die guten Erfahrungen mit JSF (Java Server Faces) in Bezug auf
Funktion und einfache Integration ins Markup, entstand der Wunsch nach einer
ähnlichen client-seitigen Full-Stack Lösung.
Bei Seanox aspect-js steht ein minimalistischer Ansatz zur Implementierung von
Single-Page Applications (SPAs) im Vordergrund.  

Das Framework greift den deklarativen Ansatz von HTML auf und erweitert ihn um
Expression Language, Rendering mit zusätzlichen Attributen,
Object/Model-Binding, Model View Controller, Resource Bundle (i18n),
NoSQL-Datasource, Testumgebung und vieles mehr.


# Merkmale
* Einfache Integration in Markup und JavaScript (sauberer Code)
* Leichtgewichtige Implementierung (erfordert keine zusätzlichen Frameworks)
* Leicht zu integrieren und mit anderen JavaScript-Frameworks kombinierbar  
  wenn die Frameworks nicht das gleiche tun oder die gleiche Syntax verwenden
* Komponentenbasierte Architektur
* Modularisierung (unterstützt Importe zur Laufzeit)  
  Komponentenkonzept für das intelligente/automatische Laden von Ressourcen
* Event handling
* Expression Language  
  Meta-Sprach-Erweiterung mit voller JavaScript-Unterstützung
* Markup-Rendering  
  unterstützt: condition, custom tags, events, filter, interval, iterate,
  rendering, resources messages, validation, ...
* Markup-Härtung  
  erschwert die Manipulation der Attribute im Markup  
  Nicht sichtbare Komponenten werden aus dem DOM entfernt und erst bei
  Verwendung eingesetzt  
* Model View Controller    
  unterstützt: Ereignisse, virtuelle Pfade, Sitemap, Berechtigungskonzept, ...
* Resource-Bundle / Resource-Messages   
  Lokalisierung, Internationalisierung (i18n) und Text-Auslagerung
* NoSQL-DataSource auf Basis von XML  
  leichtgewichtiges Datenmanagement für Aggregation / Projektion / Transformation
* Testumgebung  
  für automatisierte Unit-Tests und Integrationatests
* ... 


## Inhalt

* [Erste Schritte](#erste-schritte)
* [Arbeitsbereich](#arbeitsbereich)
* [Expression Language](#expression-language)
* [Attribute](#attribute)
  * [output](#output)
  * [import](#import)
  * [condition](#condition)
  * [interval](#interval)
  * [id](#id)
  * [composite](#composite)
  * [events](#events)
  * [validate](#validate)
  * [message](#message)
  * [notification](#notification)
  * [render](#render)
  * [release](#release)
* [DataSource](#datasource)
* [Resource Bundle (Messages / i18n)](#resource-bundle-messages--i18n)
* [Model View Controller](#model-view-controller)
  * [Controller](#controller)
  * [Model](#model)
  * [View](#view)
* [SiteMap](#sitemap)
  * [Virtual Paths](#virtual-paths)
  * [Object/Model-Binding](#objectmodel-binding)
* [Komponenten](#komponenten)
  * [Object/Model-Binding](#objectmodel-binding-1)
* [Erweiterung](#erweiterung)
* [Ereignisse](#ereignisse)
* [Test](#test)
  * [Testfall](#testfall)
  * [Szenario](#szenario)
  * [Suite](#suite)
  * [Assert](#assert)
  * [Konfiguration](#konfiguration)
  * [Monitoring](#monitoring)
  * [Control](#control)
  * [Events](#events-1)


## Erste Schritte

Das Framework besteht aus reinem JavaScript.

Die Releases werden heruntergeladen oder über einen Release-Channel eingebunden.
Release-Channel stellen kontinuierlich die neuesten finalen Hauptversionen zur
Verfügung, diese sind abwärtskompatibel zur Hauptversion. Seanox aspect-js ist
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

Expressions bzw. die Expression Language (EL) ist ein einfacher Zugang zum
clientseitigen JavaScrript und damit zu den Modellen und Komponenten im Seanox
aspect-js. In den Expressions wird die komplette JavaScript-API unterstützt, die
mit zusätzliche Schlüsselwörtern angereichert ist, womit auch die zahlreichen
arithmetischen und logischen Operatoren verwendet werden können.

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
[output](markup.md#output) und [import](markup.md#import) verwendet werden,
welche eine direkte Ausgabe in das innere HTML vom Element bewirken. 

```html
<p output="Today is {{new Date().toDateString()}}
    and it's {{new Date().toLocaleTimeString()}} o'clock.">
</p>
```

Oder mit der Verwendung vom Attribut [release](markup.md#release) werden
Element und Ausgabe erst mit Abschluss vom Rendering sichtbar.

```html
<p release>
  Today is {{new Date().toDateString()}}
  and it's {{new Date().toLocaleTimeString()}} o'clock.
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

Der deklarative Ansatz ist in Seanox aspect-js vorrangig mit Attributen
umgesetzt und kann mit allen HTML-Elementen und in Kombination verwendet werden.
Ausgenommen sind `SCRIPT`, was nur mit dem Typ `composite/javascript`
unterstützt wird, sowie `STYLE`, welches nicht unterstützt wird. Die Werte der
Attribute können statisch oder mit Verwendung der Expression-Language dynamisch
sein. Enthält ein Attribut eine Expression, werden das Attribut und der Wert
unveränderlich, da der Renderer diese bei jeder Auffrischung (Render-Zyklus)
erneut mit dem aktualisierten Wert der initialen Expression setzen wird.

[Mehr erfahren](markup.md#attribute)


### output

Das Attribut setzt den Wert oder das Ergebnis seines Ausdrucks als inneren
HTML-Code bei einem HTML-Element. Als Wert werden Text, ein Element oder mehre
Elemente als NodeList bzw. Array erwartet, welche dann direkt eingefügt werden.
Zudem wird auch die [DataSource-URL (locator)](datasource.md#locator) unterstützt,
womit ein Inhalt aus der [DataSource](datasource.md) geladen und transformiert
eingefügt wird.

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
`import` entfernt. Das Attribut erwartet als Wert ein Element oder mehre
Elemente als NodeList bzw. Array, welche dann direkt eingefügt werden. Auch die
Verwendung einer absoluten oder relativen URL zu einer entfernten Ressource wird
unterstützt, die per HTTP-Methode GET nachgeladen und eingefügt wird. Zudem wird
auch die [DataSource-URL (locator)](datasource.md#locator) unterstützt, womit
ein Inhalt aus der [DataSource](datasource.md) geladen und transformiert
eingefügt wird.

```html
<p import="Today is {{new Date().toDateString()}}
    and it's {{new Date().toLocaleTimeString()}} o'clock.">
</p>

<p import="xml:/example/content">
  loading resource...  
</p>

<p import="xml:/example/data xslt:/example/style">
  loading resource...  
</p>

<p import="https://raw.githubusercontent.com/seanox/aspect-js/master/test/resources/import_c.htmlx">
  loading resource...  
</p>
```

[Mehr erfahren](markup.md#import)


### condition

Das condition-Attribut legt fest, ob ein Element im DOM enthalten bleibt.  
Der mit dem Attribut angegebene Ausdruck muss explizit `true` zurückliefern,
damit das Element im DOM erhalten bleibt. Bei abweichenden Rückgabewerten wird
das Element temporär aus dem DOM entfernt und lässt sich später durch das
Auffrischen des __Eltern-Elements__ wieder einfügen, wenn der Ausdruck `true`
zurückliefert.  

```html
<article condition="{{Model.visible}}">
  ...
</article>
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
verursacht eine Konsolenausgabe. Das Intervall beginnt automatisch mit dem
Auffrischen vom deklarierten HTML-Element und bleibt so lange aktiv, wie das
Element im DOM existiert.

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


### id

Die ID (Bezeichner) hat in Seanox aspect-js eine elementare Bedeutung.   
Sie wird u.a. von der SiteMap als Faces und Facets, also als Ziel für virtuelle
Pfade im Face-Flow sowie für das Object/Model-Binding verwendet.

Wie bei allen Attributen ist hier die Expression-Language verwendbar, jedoch mit
einer Besonderheit, da das Attribut nur initial verarbeitet wird. Änderungen zur
Laufzeit an einem existierenden Element haben wegen dem Object/Model-Binding
keine Auswirkungen, solange es im DOM existiert.

[Mehr erfahren](markup.md#id)


### composite

Kennzeichnet im Markup ein Element als [Composite](composites.md).  
Composites sind modulare Komponente die in Seanox aspect-js eine elementare
Bedeutung haben und die zwingend einen Bezeichner (ID) benötigen.  
Sie werden von der [SiteMap](mvc.md#sitemap) als Faces, also als Ziele für
virtuelle Pfade im Face-Flow verwendet, was direkten Einfluss auf die
Sichtbarkeit der Composites hat.
Der [Model View Controller](mvc.md#sitemap) unterstützt für Composites ein
automatisches [Object/Model-Binding](object-binding.md).  
Die Ressourcen (CSS, JS, Markup) lassen sich für Composites in das
Modul-Verzeichnis auslagern und werden erst bei Bedarf automatisch nachgeladen. 

```html
<article id="example" composite>
  ...
</article>
```

Details zur Verwendung von Composites / modularen Komponente werden in den
Abschnitten [Composites](composites.md) und [Model View Controller](mvc.md)
beschrieben.

[Mehr erfahren](markup.md#composite)


### events

Diese Deklaration bindet ein oder mehre Ereignisse (siehe
https://www.w3.org/TR/DOM-Level-3-Events) an ein HTML-Element. Ereignisse
eröffnen primäre Funktionen zur ereignisgesteuerten Auffrischung von anderen
HTML-Elementen (mehr dazu im Abschnitt [render](#render)), sowie zur Validierung
und Synchronisation von HTML-Elementen und dem korrespondierenden
JavaScript-Model (mehr dazu im Abschnitt [validate](#validate)).  

```html
<span id="output1">{{#text1.value}}</span>
<input id="text1" type="text"
    events="input change" render="#output1"/>
```

[Mehr erfahren](markup.md#events)


### validate

Das Attribut `validate` erfordert die Kombination mit dem Attribut `events`.
Zusammen definieren und steuern sie die Synchronisation zwischen dem Markup
eines Composites und dem korrespondierenden JavaScript-Model.  
Die Validierung funktioniert dabei zweistufig und nutzt zu Beginn die Standard
HTML5-Validierung. Kann diese keine Abweichungen vom erwarteten Ergebnis
ermitteln oder wurde keine HTML5-Validierung festgelegt, wird die Validierung
vom JavaScript-Model aufgerufen, wenn das Modell eine entsprechende
validate-Methode `boolean validate(element, value)` bereitstellt und das zu
validierende Element in einem Composite eingebettet ist.

```html
<form id="Model" composite>
  <input id="text1" type="text" placeholder="e-mail address"
      pattern="^\w+([\w\.\-]*\w)*@\w+([\w\.\-]*\w{2,})$"
      validate events="input change" render="#Model"/>
  <input type="submit" value="submit" validate events="click"/>
</form>
```

[Mehr erfahren](markup.md#validate)


### message

Message ist ein optionaler Bestandteil der Validierung und wird zur
Text-/Fehler-Ausgabe im Fall einer unbestätigten Validierung verwendet.  
Das Attribut erfordert die Kombination mit den Attributen `validate` und
`events`. 

```html
<form id="Model" composite>
  <input id="text1" type="text" placeholder="e-mail address"
      pattern="^\w+([\w\.\-]*\w)*@\w+([\w\.\-]*\w{2,})$"
      validate message="Valid e-mail address required"
      events="input change" render="#Model"/>
  <input type="submit" value="submit" validate events="click"/>
</form>
```

```html
<form id="Model" composite>
  <input id="text1" type="text" placeholder="e-mail address"
      pattern="^\w+([\w\.\-]*\w)*@\w+([\w\.\-]*\w{2,})$"
      validate message="{{Messages['Model.text1.validation.message']}}"
      events="input change" render="#Model"/>
  <input type="submit" value="submit" validate events="click"/>
</form>
```

[Mehr erfahren](markup.md#message)


### notification

Notification ist ein optionaler Bestandteil der Validierung und zeigt die
Fehlerausgabe als Info-Box (Browser-Feature) am entsprechenden Element an.  
Das Attribut erfordert die Kombination mit den Attributes `validate`, `events`
und `message`.

```html
<form id="Model" composite>
  <input id="text1" type="text" placeholder="e-mail address"
      pattern="^\w+([\w\.\-]*\w)*@\w+([\w\.\-]*\w{2,})$"
      validate message="Valid e-mail address required" notification
      events="input change" render="#Model"/>
  <input type="submit" value="submit" validate events="click"/>
</form>
```

[Mehr erfahren](markup.md#notification)


### render

Das Attribut `render` erfordert die Kombination mit dem Attribut `events`.
Zusammen definieren sie, welche Ziele mit welchen auftretenden Ereignissen
aufgefrischt werden.  
Als Wert erwartet das `render` Attribut einen CSS-Selector bzw. Query-Selector
welche die Ziele festlegen.

```html
<span id="output1">{{#text1.value}}</span>
<input id="text1" type="text"
    events="input change" render="#output1"/>
```

[Mehr erfahren](markup.md#render)


### release

Inverser Indikator dafür, dass ein Element gerendert wurde.  
Der Renderer entfernt dieses Attribut, wenn ein Element gerendert wird. Dieser
Effekt kann für CSS verwendet werden, um Elemente nur im gerenderten Zustand
anzuzeigen. Eine entsprechende CSS-Regel wird dem HEAD automatisch mit dem
Laden der Seite hinzugefügt. 

```html
<span release>{{'Show me after rendering.'}}</span>
```

[Mehr erfahren](markup.md#release)


## DataSource

DataSource ist ein NoSQL-Ansatz zur Datenspeicherung auf Basis von XML-Daten in
Kombination mit mehrsprachiger Datentrennung, optionaler Aggregation und
Transformation. Es ist eine Kombination von Ansätzen einer read-only-Datenbank
und einem CMS.  
Die DataSource basiert auf statischen Daten, die per XPath abgefragt werden und
das Ergebnis verkettet, aggregiert und per XSLT transformiert werden kann.

[Mehr erfahren](datasource.md#datasource)


## Resource Bundle (Messages / i18n)

(Resource)Messages ist eine statische Erweiterung der
[DataSource](datasource.md) für Internationalisierung, Lokalisierung (i18n)
sowie für Mandanten bezogene Texte.  
Die Implementierung basiert auf einer Menge von Schlüssel-Wert-Paaren in Form
von Label-Elementen, die in der Datei `locales.xml` im DataSource-Verzeichnis
definiert werden.

[Mehr erfahren](messages.md)


## Model View Controller

Der Model View Controller (MVC) ist ein Entwurfsmuster zur Trennung von
Interaktion, Daten und Darstellung.

```
+------------------------------------------+--------------+-----------------------+
|  View                                    |  Controller  |  Model                |
+------------------------------------------+--------------+-----------------------+
|  Markup                                  |  Composite   |  JavaScript           |
|                                          |  Path        |                       |
|                                          |  SiteMap     |                       |
+------------------------------------------+--------------+-----------------------+
|  <form id="model" composite>             |  aspect-js   |  var model = {        |
|    <input id="message" events="input"/>  |              |      message: "",     | 
|    <button id="submit"/>                 |              |      submit: {        |
|  </form>                                 |              |          onClick() {  |
|                                          |              |          }            |
|                                          |              |      }                |
|                                          |              |  }                    |
+------------------------------------------+--------------+-----------------------+
```

[Mehr erfahren](mvc.md)


### Controller

Hier muss zwischen I/O-Controller und Applikations-Controller unterschieden
werden. Das reine MVC-Entwurfsmuster meint den I/O-Controller zur Übermittlung
der Interaktionen. Da dieser durch Betriebssystem und Browser bereitgestellt
wird, bezieht sich der Controller in Seanox aspect-js vordergründig auf den
Applikations-Controller, der Abläufe innerhalb einer Applikation (Face-Flow)
steuert und das Binding von Markup und JavaScript sowie die Steuerung vom
Datenfluss zwischen View und Model übernimmt.  
In Seanox aspect-js ist der Controller die Zusammenarbeit von Composite, Paths
und SiteMap.


### Model

Das Modell ist ein darstellbares/projezierbares Objekt.  
Es empfängt (Status)Änderungen und Interaktionen der View, die durch den 
Controller übermittelt werden, bzw. bietet der View eine Schnittstelle zu Daten
sowie Funktionen und Diensten der Middelware. Das Modell dient vorrangig der
View zur Darstellung und Verwaltung der Zustände, für fachliche Funktionalität
nimmt es weitere Komponenten in Anspruch.  
In Seanox aspect-js werden die Modelle durch statische JavaScript-Objekte
repräsentiert. Konzeptionell ist die Implementierung der Entwurfsmuster Fassade
und Delegation angedacht, so dass die statischen Modelle intern weitere
Komponenten und Abstraktion verwenden.


### View

Die View ist ausschliesslich für die Darstellung bzw. Projektion eines Modells
verantwortlich.  
Projektion ist ein wichtiger Begriff, da die Art der Darstellung eines Modells
nicht eingeschränkt ist.  
In Seanox aspect-js werden die Views durch das Markup repräsentiert.


## SiteMap

Die Darstellung in Seanox aspect-js ist mehrschichtig und die Ansichten sind als
Page, Faces und Facets organisiert, auf die über virtuelle Pfade zugegriffen
wird. Zu diesem Zweck stellt SiteMap eine hierarchische Verzeichnisstruktur zur
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

Virtuelle Pfade werden für die Navigation und Kontrolle vom Face-Flow verwendet.  
Das Ziel kann ein Face, ein Facet oder eine Funktion sein.  
Bei SPAs (Single-Page-Applikationen) wird der Ankerteil der URL für die Pfade
verwendet.

```
https://example.local/example/#path
```

In Anlehnung an das Dateisystem werden auch hier absolute, relative und
zusätzlich funktionale Pfade unterstützt.  
Pfade bestehen ausschliesslich aus Wortzeichen, Unterstrichen und optional dem
Minus-Zeichen (basierend auf zusammengesetzten IDs). Als Separator und Root wird
das Hash-Zeichen verwendet.

[Mehr erfahren](mvc.md#virtual-paths)


### Object/Model-Binding

TODO:


## Komponenten

TODO:

Seanox aspect-js zielt auf eine modulare und auf Komponenten basierte
Architektur. Das Framework unterstützt dazu eine deklarative Kennzeichnung von
Komponenten im Markup, die Auslagerung und das automatische Laden von
Ressourcen, sowie ein automatisches Object/Model-Binding.

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

Das Laden der Ressourcen und die Object/Model-Binding erfolgt partiell, wenn die
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

[Mehr erfahren](composite.md)


### Object/Model-Binding

TODO:


## Erweiterung

Die JavaScript-API wurde für Seanox aspect-js um einige allgemeine Funktionen
erweitert.

[Mehr erfahren](extension.md)


## Ereignisse

Seanox aspect-js stellt verschiede Ereignisse bereit, die u.a. zur
Implementierung von Erweiterungen sowie als Benachrichtigung der Anwendung über
bestimmte Betriebszustände des Frameworks und der Laufzeitumgebung genutzt
werden können.

[Mehr erfahren](events.md)


## Test

Die Test-API unterstützt die Implementierung und Ausführung von
Integrationstests und kann für Suiten (suite), Szenarien (scenario) und einzelne
Testfälle (case) verwendet werden.

Als modularer Bestandteil von Seanox aspect-js ist die Test-API in jedem Release
enthalten, der sich ohne Probleme entfernen lässt. Da die Test-API einige
Besonderheiten in Bezug auf Fehlerbehandlung und Konsolen-Ausgabe bewirkt, muss
die Test-API zur Laufzeit bewusst aktiviert werden.

```javascript
Test.activate();

Test.create({test() {
    ...
}});

Test.start();
```

[Mehr erfahren](test.md)


### Testfall

Der kleinste Bestandteil in einem Integrationstest, der hier als "Task"
verwendet wird, da "Case" ein Schlüsselwort im JavaScript ist. Es kann allein
implementiert werden, wird aber immer in einem Szenario verwendet.

```javascript
Test.activate();

Test.create({test() {
    Assert.assertTrue(true);
}});

Test.start();
```

Task ist primär ein Meta-Objekt.  

```
{name:..., test:..., timeout:..., expected:..., ignore:...}
```

[Mehr erfahren](test.md#testfall)


### Szenario

Ein Szenario ist eine Abfolge von vielen Testfällen (Tasks).

```javascript
Test.activate();

Test.create({test() {
    Assert.assertTrue(true);
}});
Test.create({name:"example", timeout:1000, test() {
    Assert.assertTrue(true);
}});
Test.create({error:Error test() {
    throw new Error();
}});
Test.create({error:/^My Error/i, test() {
    throw new Error("My Error");
}});
Test.create({ignore:true, test() {
    Assert.assertTrue(true);
}});

Test.start();
```

[Mehr erfahren](test.md#szenario)


### Suite 

Eine Suite ist ein komplexes Paket aus verschiedenen Testfällen, Szenarien und
anderen Suiten. In der Regel besteht eine Suite aus verschiedenen Dateien, die
dann einen komplexen Test darstellen. Ein Beispiel für eine gute Suite ist eine
Kaskade von verschiedenen Dateien und wo der Test in jeder Datei und an jedem
Stelle gestartet werden kann. Dies ermöglicht einen Integrationstest auf
verschiedenen Ebenen und mit unterschiedlicher Komplexität.

[Mehr erfahren](test.md#suite)


### Assert

Die Testfälle werden mit Behauptungen (Assertions) implementiert. Die Test-API
bietet elementare Aussagen, die erweitert werden können. Die Funktion ist
einfach. Wenn eine Behauptung nicht wahr ist, tritt ein Fehler auf.

```javascript
Test.activate();

Test.create({test() {

    Assert.assertTrue(true);
    Assert.assertTrue("message", true);

    Assert.assertFalse(false);
    Assert.assertFalse("message", false);

    Assert.assertEquals(expected, value);
    Assert.assertEquals("message", expected, value);

    Assert.assertNotEquals(unexpected, value);
    Assert.assertNotEquals("message", unexpected, value);

    Assert.assertSame(expected, value);
    Assert.assertSame("message", expected, value);

    Assert.assertNotSame(unexpected, value);
    Assert.assertNotSame("message", unexpected, value);

    Assert.assertNull(null);
    Assert.assertNull("message", null);

    Assert.assertNotNull(null);
    Assert.assertNotNull("message", null);

    Assert.fail();
    Assert.fail("message");
}});

Test.start();
```

[Mehr erfahren](test.md#assert)


### Konfiguration

Optional kann die Test-API mit jedem Start konfiguriert werden.  
Als Parameter wird ein Meta-Objekt erwartet. Die darin enthaltene Konfiguration
wird partiell übernommen und unbekanntes wird ignoriert.

```javascript
Test.start({auto: boolean, ouput: {...}, monitor: {...}});
```

[Mehr erfahren](test.md#konfiguration)


### Monitoring

Das Monitoring überwacht den Testablauf während der Ausführung und wird über die
verschiedenen Schritte und Status informiert. Der Monitor ist optional. Ohne
diesen werden Informationen zum Testverlauf in der Konsole ausgegeben.

[Mehr erfahren](test.md#monitoring)


### Control

Der Testverlauf und die Verarbeitung der einzelnen Tests kann per Test-API
gesteuert werden.

```javascript
Test.start();
Test.start({auto: boolean});
```

Der Start kann manuell oder bei Verwendung von `auto = true` durch das Laden
der Seite erfolgen. Wenn die Seite bereits geladen ist, wird der Parameter
`auto` ignoriert und der Start sofort ausgeführt.

```javascript
Test.suspend();
```

Unterbricht die aktuelle Testausführung, die mit `Test.resume()` vom aktuellen
Test fortgesetzt werden kann.

```javascript
Test.resume();
```

Setzt die Testausführung fort, wenn sie zuvor unterbrochen wurde.

```javascript
Test.interrupt();
```

Unterbricht die aktuelle Testausführung und verwirft alle ausstehenden Tests.
Der Testlauf kann mit `Test.start()` neu gestartet werden.

```javascript
Test.status();
```

Macht eine Momentaufnahme des Status des aktuellen Tests.  
Der Status enthält Details zum aktuellen Test und zur Warteschlange.

[Mehr erfahren](test.md#control)


### Events

Ereignisse (Events) bzw. deren Callback-Methoden sind ein weitere Form zur
Überwachung der Testausführung. Die Callback-Methoden werden für entsprechende
Ereignisse bei der Test-API registriert und funktionieren dann ähnlich dem
Monitor.

```javascript
Test.listen(Test.EVENT_START, function(event, status) {
    ...
});  
  
Test.listen(Test.EVENT_PERFORM, function(event, status) {
    ...
});  
  
Test.listen(Test.EVENT_FINISH, function(event, status) {
    ...
});  
```

[Mehr erfahren](test.md#events)


- - -

[Motivation](motivation.md) | [Inhalt](README.md#einf-hrung) | [Markup](markup.md)
