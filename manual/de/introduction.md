[Motivation](motivation.md) | [Inhalt](README.md#einf-hrung) | [Markup](markup.md)
- - -

# Einf&uuml;hrung


## Was ist Seanox aspect-js?

Gepr&auml;gt durch die guten Erfahrungen mit JSF (Java Server Faces) in Bezug
auf Funktion und einfache Integration ins Markup, entstand die Idee f&uuml;r
einen &auml;hnliche client-seitigen Full-Stack L&ouml;sung mit minimalistischem
und leichtgewichtigem Ansatz zur Implementierung von Single-Page Applications
(SPAs).  

Seanox aspect-js greift dazu den deklarativen Ansatz von HTML auf und erweitert
ihn um Expression Language, reaktives Rendering mit zus&auml;tzlichen
Attributen, Object/Model-Binding, Model View Controller, Resource Bundle (i18n),
NoSQL-Datasource, Testumgebung und vieles mehr.


# Merkmale
* Einfache Integration in Markup und JavaScript (sauberer Code)  
  kombinierbar mit anderen JavaScript-Frameworks, wenn diese nicht das Gleiche
  und eine andere Syntax verwenden
* Leichtgewichtige Implementierung (erfordert keine zus&auml;tzlichen Frameworks)
* Komponentenbasierte Architektur
* Modularisierung (unterst&uuml;tzt Importe zur Laufzeit)  
  Komponentenkonzept f&uuml;r das intelligente/automatische Laden von Ressourcen
* Event handling
* Expression Language  
  Meta-Sprach-Erweiterung mit voller JavaScript-Unterst&uuml;tzung
* Reaktives Rendering  
  das Rendering reagiert auf &Auml;nderungen in Datenobjekten l&ouml;st ein
  partielles Rendering der Konsumenten aus 
* Markup-Rendering  
  unterst&uuml;tzt: condition, custom tags, events, filter, interval, iterate,
  rendering, resources messages, validation, ...
* Markup-H&auml;rtung  
  erschwert die Manipulation der Attribute im Markup  
  nicht sichtbare Komponenten werden aus dem DOM entfernt und erst bei
  Verwendung eingesetzt  
* Model View Controller    
  unterst&uuml;tzt: Ereignisse, virtuelle Pfade, Sitemap, Berechtigungskonzept,
  View Object/Model Binding, ......
* Resource-Bundle / Resource-Messages   
  Lokalisierung, Internationalisierung (i18n) und Text-Auslagerung
* NoSQL-DataSource auf Basis von XML  
  leichtgewichtiges Datenmanagement f&uuml;r Aggregation / Projektion / Transformation
* Testumgebung  
  f&uuml;r automatisierte Unit- und Integration-Tests
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
  * [iterate](#iterate)
  * [id](#id)
  * [composite](#composite)
  * [strict](#strict)
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
* [Reaktives Rendering](#reaktives-rendering)
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

Die Releases werden heruntergeladen oder &uuml;ber einen Release-Channel eingebunden.
Release-Channel stellen kontinuierlich die neuesten finalen Hauptversionen zur
Verf&uuml;gung, diese sind abw&auml;rtskompatibel zur Hauptversion. Seanox aspect-js ist
somit immer auf dem neuesten Stand.

Jedes Release besteht aus zwei Versionen.  
Die Entwickler-Version beinhaltet umfangreiche Kommentare zu Konzeption,
Funktion, Arbeitsweise und Verwendung.  
Die Produktions-Version ist in der Gr&ouml;sse optimiert aber nicht verschleiert
(obfuscated).

Erstelle eine HTML-Datei, z.B. _index.html_ und f&uuml;ge Seanox apect-js ein.

```html
<!-- development version, includes helpful comments -->
<script src="https://cdn.jsdelivr.net/npm/@seanox/aspect-js/releases/aspect-js.js"></script>
```

oder

```html
<!-- production version, optimized in size but not obfuscated -->
<script src="https://cdn.jsdelivr.net/npm/@seanox/aspect-js/releases/aspect-js-min.js"></script>
```

__Das Framework ist zur Implementierung modularer und komponentenbasierter__
__Single-Page-Applications entwickelt worden. Durch das automatische Laden__
__von Ressourcen, Modulen und Daten ist die Verwendung eines Web-Servers__
__erforderlich.__


## Arbeitsbereich

Seanox aspect-js agiert ausschliesslich im BODY-Tag, welches selbt mit
einbezogen wird.


## Expression Language

Expressions bzw. die Expression Language (EL) oder in der vorliegenden Dokumentation
auch Ausdruck bzw. Ausdr&uml;cke genannt, ist ein einfacher Zugang zum clientseitigen
JavaScript und damit zu den Modellen und Komponenten im Seanox aspect-js. In den
Expressions wird die komplette JavaScript-API unterst&uuml;tzt, die mit zus&auml;tzliche
Schl&uuml;sselw&ouml;rtern angereichert ist, womit auch die zahlreichen arithmetischen
und logischen Operatoren verwendet werden k&ouml;nnen.

Die Expression-Language kann im Markup als Freitext und in den Attributen der
HTML-Elemente verwendet werden. Ausgenommen sind JavaScript- und CSS-Elemente.
Hier wird die Expression-Language nicht unterst&uuml;tzt. Bei der Verwendung als
Freitext wird als Ausgabe immer reiner Text (plain text) erzeugt. Das Hinzuf&uuml;gen
von Markup, insbesondere HTML-Code, ist so nicht m&ouml;glich und wir nur mit den
Attributen `output` und `import` unterst&uuml;tzt.

```html
<body lang="{{DataSource.locale}}">
  <p>
    Today is {{new Date().toDateString()}}
    and it's {{new Date().toLocaleTimeString()}} o'clock.
  </p>
</body>
```

Die Expression Language ist zeitweise sichtbar, da der Renderer erst nach dem
Laden der Page aktiv wird. Alternativ k&ouml;nnen die Attribute
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

Expressions k&ouml;nnen zur Laufzeit globale Variablen erzeugen und nutzen.

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
unterst&uuml;tzt wird, sowie `STYLE`, welches nicht unterst&uuml;tzt wird. Die Werte der
Attribute k&ouml;nnen statisch oder mit Verwendung der Expression-Language dynamisch
sein. Enth&auml;lt ein Attribut eine Expression, werden das Attribut und der Wert
unver&auml;nderlich, da der Renderer diese bei jeder Auffrischung (Render-Zyklus)
erneut mit dem aktualisierten Wert der initialen Expression setzen wird.

[Mehr erfahren](markup.md#attribute)


### output

Das Attribut setzt den Wert oder das Ergebnis seines Ausdrucks als inneren
HTML-Code bei einem HTML-Element. Als Wert werden Text, ein Element oder mehre
Elemente als NodeList bzw. Array erwartet, welche dann direkt eingef&uuml;gt werden.
Zudem wird auch die [DataSource-URL (locator)](datasource.md#locator) unterst&uuml;tzt,
womit ein Inhalt aus der [DataSource](datasource.md) geladen und transformiert
eingef&uuml;gt wird.

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

Diese Deklaration l&auml;dt Inhalte dynamisch nach und ersetzt den inneren HTML-Code
eines Elements. Wenn der Inhalt erfolgreich geladen wurde, wird das Attribut
`import` entfernt. Das Attribut erwartet als Wert ein Element oder mehre
Elemente als NodeList bzw. Array, welche dann direkt eingef&uuml;gt werden. Auch die
Verwendung einer absoluten oder relativen URL zu einer entfernten Ressource wird
unterst&uuml;tzt, die per HTTP-Methode GET nachgeladen und eingef&uuml;gt wird. Zudem wird
auch die [DataSource-URL (locator)](datasource.md#locator) unterst&uuml;tzt, womit
ein Inhalt aus der [DataSource](datasource.md) geladen und transformiert
eingef&uuml;gt wird.

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
Der mit dem Attribut angegebene Ausdruck muss explizit `true` zur&uuml;ckliefern,
damit das Element im DOM erhalten bleibt. Bei abweichenden R&uuml;ckgabewerten wird
das Element tempor&auml;r aus dem DOM entfernt und l&auml;sst sich sp&auml;ter durch das
Auffrischen des __Eltern-Elements__ wieder einf&uuml;gen, wenn der Ausdruck `true`
zur&uuml;ckliefert.  

```html
<article condition="{{Model.visible}}">
  ...
</article>
```

Die Verwendung vom condition-Attribut in Verbindung mit eingebettetem JavaScript
ist als Composite-JavaScript m&ouml;glich.

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
formuliert werden kann. Die Verarbeitung erfolgt nebenl&auml;ufig bzw. asynchron aber
nicht parallel. Bedeutet, dass die Verarbeitung nach dem gesetzten
Zeit-Intervall starten soll, diese aber erst beginnt, wenn eine zuvor begonnen
JavaScript-Prozedur beendet wurde. Daher ist das Intervall als zeitnah, nicht
aber als exakt zu verstehen.  
Das interval-Attribut erwartet einen Wert in Millisekunden. Ein ung&uuml;ltiger Wert
verursacht eine Konsolenausgabe. Das Intervall beginnt automatisch mit dem
Auffrischen vom deklarierten HTML-Element und bleibt so lange aktiv, wie das
Element im DOM existiert.

```html
<p interval="1000">
  {{new Date().toLocaleTimeString()}}
</p>
```

Mit der Kombination von Intervall und Variablen-Expression ist die Umsetzung
eines permanenten Z&auml;hlers sehr einfach.

```html
{{counter:0}}
<p interval="1000">
  {{counter:parseInt(counter) +1}}^
  {{counter}}
</p>
```

Die Verwendung vom interval-Attribut in Verbindung mit eingebettetem JavaScript
ist als Composite-JavaScript m&ouml;glich.

```html
<script type="composite/javascript" interval="1000">
    console.log(new Date().toLocaleTimeString());
</script>
```

[Mehr erfahren](markup.md#interval)


### iterate

Die iterative Ausgabe basiert auf Listen, Aufz&auml;hlungen und Arrays.  
Wird ein HTML-Element als iterativ deklariert, wird der initiale innerer
HTML-Code als Vorlage verwendet und w&auml;hrend der Iteration der innere HTML-Code
zun&auml;chst entfernt, die Vorlage mit jeder Iteration einzeln generiert und das
Ergebnis dem inneren HTML-Code hinzugef&uuml;gt.  
Das iterate-Attribut erwartet einen [Variablen-Ausdruck](expression.md#variable-expression),
zu dem ein Meta-Objekt erstellt wird, dass den Zugriff auf die Iteration erm&ouml;glich.  
So erzeugt der Variablen-Ausdruck `iterate={{tempA:Model.list}}` das Meta-Objekt
`tempA = {item, index, data}`.

```javascript
const Model = {
    months: ["Spring", "Summer", "Autumn", "Winter"]
};
```

```html
<select iterate={{months:Model.months}}>
  <option id="{{months.index}}">
    {{months.item}}
  </option>
</select>
```

[Mehr erfahren](markup.md#iterate)


### id

Die ID (Bezeichner) hat in Seanox aspect-js eine elementare Bedeutung.   
Sie wird u.a. von der SiteMap als Faces und Facets, also als Ziel f&uuml;r virtuelle
Pfade im Face-Flow sowie f&uuml;r das Object/Model-Binding verwendet.

Wie bei allen Attributen ist hier die Expression-Language verwendbar, jedoch mit
einer Besonderheit, da das Attribut nur initial verarbeitet wird. &Auml;nderungen zur
Laufzeit an einem existierenden Element haben wegen dem Object/Model-Binding
keine Auswirkungen, solange es im DOM existiert.

[Mehr erfahren](markup.md#id)


### composite

Kennzeichnet im Markup ein Element als [Composite](composites.md).  
Composites sind modulare Komponente die in Seanox aspect-js eine elementare
Bedeutung haben und die zwingend einen Bezeichner (ID) ben&ouml;tigen.  
Sie werden von der [SiteMap](mvc.md#sitemap) als Faces, also als Ziele f&uuml;r
virtuelle Pfade im Face-Flow verwendet, was direkten Einfluss auf die
Sichtbarkeit der Composites hat.
Der [Model View Controller](mvc.md#sitemap) unterst&uuml;tzt f&uuml;r Composites ein
automatisches [Object/Model-Binding](object-binding.md).  
Die Ressourcen (CSS, JS, Markup) lassen sich f&uuml;r Composites in das
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


### strict

Das Attribut wird in Kombination mit dem Attribut [composite](#composite)
verwendent und legt fest, dass beim Laden der Ressourcen (CSS, JS, HTML) zu
einer Komponente der Dateiname in der originalen Schreibweise verwendet wird.
Das Standardverhalten ohne das Attribut [strict](#strict) verwendet die
Composite-Id mit einem Kleinbuchstaben am Anfang.

[Mehr erfahren](markup.md#strict)


### events

Diese Deklaration bindet ein oder mehre Ereignisse (siehe
https://www.w3.org/TR/DOM-Level-3-Events) an ein HTML-Element. Ereignisse
er&ouml;ffnen prim&auml;re Funktionen zur ereignisgesteuerten Auffrischung von anderen
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
eines Composites und dem korrespondierenden JavaScript-Model, wo eine
gleichnamige Eigenschaft als Ziel f&uuml;r die Synchronisation vorhanden sein muss.

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
Text-/Fehler-Ausgabe im Fall einer unbest&auml;tigten Validierung verwendet.  
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

Inverser Indikator daf&uuml;r, dass ein Element gerendert wurde.  
Der Renderer entfernt dieses Attribut, wenn ein Element gerendert wird. Dieser
Effekt kann f&uuml;r CSS verwendet werden, um Elemente nur im gerenderten Zustand
anzuzeigen. Eine entsprechende CSS-Regel wird dem HEAD automatisch mit dem
Laden der Seite hinzugef&uuml;gt. 

```html
<span release>{{'Show me after rendering.'}}</span>
```

[Mehr erfahren](markup.md#release)


## DataSource

DataSource ist ein NoSQL-Ansatz zur Datenspeicherung auf Basis von XML-Daten in
Kombination mit mehrsprachiger Datentrennung, optionaler Aggregation und
Transformation. Es ist eine Kombination von Ans&auml;tzen einer read-only-Datenbank
und einem CMS.  
Die DataSource basiert auf statischen Daten, die per XPath abgefragt werden und
das Ergebnis verkettet, aggregiert und per XSLT transformiert werden kann.

[Mehr erfahren](datasource.md#datasource)


## Resource Bundle (Messages / i18n)

(Resource)Messages ist eine statische Erweiterung der
[DataSource](datasource.md) f&uuml;r Internationalisierung, Lokalisierung (i18n)
sowie f&uuml;r Mandanten bezogene Texte.  
Die Implementierung basiert auf einer Menge von Schl&uuml;ssel-Wert-Paaren in Form
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
|  <form id="model" composite>             |  aspect-js   |  const model = {      |
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
werden. Das reine MVC-Entwurfsmuster meint den I/O-Controller zur &Uuml;bermittlung
der Interaktionen. Da dieser durch Betriebssystem und Browser bereitgestellt
wird, bezieht sich der Controller in Seanox aspect-js vordergr&uuml;ndig auf den
Applikations-Controller, der Abl&auml;ufe innerhalb einer Applikation (Face-Flow)
steuert und das Binding von Markup und JavaScript sowie die Steuerung vom
Datenfluss zwischen View und Model &uuml;bernimmt.  
In Seanox aspect-js ist der Controller die Zusammenarbeit von Composite, Paths
und SiteMap.


### Model

Das Modell ist ein darstellbares/projezierbares Objekt.  
Es empf&auml;ngt (Status)&Auml;nderungen und Interaktionen der View, die durch den 
Controller &uuml;bermittelt werden, bzw. bietet der View eine Schnittstelle zu Daten
sowie Funktionen und Diensten der Middelware. Das Modell dient vorrangig der
View zur Darstellung und Verwaltung der Zust&auml;nde, f&uuml;r fachliche Funktionalit&auml;t
nimmt es weitere Komponenten in Anspruch.  
In Seanox aspect-js werden die Modelle durch statische JavaScript-Objekte
repr&auml;sentiert. Konzeptionell ist die Implementierung der Entwurfsmuster Fassade
und Delegation angedacht, so dass die statischen Modelle intern weitere
Komponenten und Abstraktion verwenden.


### View

Die View ist ausschliesslich f&uuml;r die Darstellung bzw. Projektion eines Modells
verantwortlich.  
Projektion ist ein wichtiger Begriff, da die Art der Darstellung eines Modells
nicht eingeschr&auml;nkt ist.  
In Seanox aspect-js werden die Views durch das Markup repr&auml;sentiert.


## SiteMap

Die Darstellung in Seanox aspect-js ist mehrschichtig und die Ansichten sind als
Page, Faces und Facets organisiert, auf die &uuml;ber virtuelle Pfade zugegriffen
wird. Zu diesem Zweck stellt SiteMap eine hierarchische Verzeichnisstruktur zur
Verf&uuml;gung, die auf den virtuellen Pfaden f&uuml;r alle Ansichten basiert. Die SiteMap
steuert den Zugriff und die Visualisierung (Ein- und Ausblenden) der Ansichten,
den sogenannten Face-Flow.  
Face-Flow und Visualisierung funktionieren resolut und verwenden das DOM zum
Einf&uuml;gen und Entfernen der Ansichten (Faces und Facets).

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

Virtuelle Pfade werden f&uuml;r die Navigation und Kontrolle vom Face-Flow verwendet.  
Das Ziel kann ein Face, ein Facet oder eine Funktion sein.  
Bei SPAs (Single-Page-Applikationen) wird der Ankerteil der URL f&uuml;r die Pfade
verwendet.

```
https://example.local/example/#path
```

In Anlehnung an das Dateisystem werden auch hier absolute, relative und
zus&auml;tzlich funktionale Pfade unterst&uuml;tzt.  
Pfade bestehen ausschliesslich aus Wortzeichen, Unterstrichen und optional dem
Minus-Zeichen (basierend auf zusammengesetzten IDs). Als Separator und Root wird
das Hash-Zeichen verwendet.

[Mehr erfahren](mvc.md#virtual-paths)


### Object/Model-Binding

TODO:


## Komponenten

TODO:

Seanox aspect-js zielt auf eine modulare und auf Komponenten basierte
Architektur. Das Framework unterst&uuml;tzt dazu eine deklarative Kennzeichnung von
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
Das Standard-Verzeichnis `./modules` kann &uuml;ber die Eigenschaft
`Composite.MODULES` ge&auml;ndert werden.

```
+ modules
  - example.css
  - example.js
  - example.html
- index.html
```

Das Laden der Ressourcen und die Object/Model-Binding erfolgt partiell, wenn die
Komponente im UI ben&ouml;tigt wird -- also mit der ersten Anzeige, was &uuml;ber die
[SiteMap](sitemap.md) als zentrales Face-Flow-Management gesteuert wird und so
die Ladezeit stark minimiert, da punktuell jeweils nur f&uuml;r die aktiven
UI-Komponenten ben&ouml;tigten Ressourcen geladen werden.  
Das Auslagern und Laden der Ressourcen zur Laufzeit ist optional und l&auml;sst sich
komplett, teilweise und nicht anwenden. Beim Nachladen und Einbinden gibt es
eine feste Reihenfolge: CSS, JS, HTML/Markup.  
Wird die Anfrage einer Ressourcen mit Status 404 beantwortet, wird davon
ausgegangen, dass diese Ressource nicht ausgelagert wurde. Werden Anfragen weder
mit Status 200 oder 404 beantwortet wird von einem Fehler ausgegangen.  
Das Laden von Ressourcen wird nur einmalig mit der ersten Anforderung der
Komponente f&uuml;r das UI ausgef&uuml;hrt.

Konzeptionell sind f&uuml;r die Implementierung von Komponenten die Entwurfsmuster
Fassade und Delegation angedacht, die intern weitere Komponenten und Abstraktion
verwenden.

[Mehr erfahren](composite.md)


### Object/Model-Binding

TODO:


## Reaktives Rendering

Beim reaktiven Ansatz reagiert das Rendering auf &Auml;nderungen der Datenobjekte
von Modellen und l&ouml;st ein partielles Rendern bei den Konsumenten der &Auml;nderungen
aus. Konsumenten sind alle Ausdr&uuml;cke, die lesend auf den ge&auml;nderten Wert
eines Datenobjekts zugreifen. Die Ausdr&uuml;cke k&ouml;nnen in Elementen, wie auch
im Freitext verwendet werden. Ob dabei das reaktive Rendering verwendet wird, ist
abh&auml;ngig vom Datenobjekt, was dazu den ReactProxy nutzen muss. Der ReactProxy
kann mit der toReactProxy-Methode, die jede Objekt-Instanz bereitstellt, oder &uuml;ber
den Konstruktor per `new ReactProxy(...)` angewendet werden.   

```javascript
let Model = {
    value: ...
}.toReactProxy();
```

In diesem Beispiel wird der Renderer automatisch alle Elemente im DOM aktualisieren,
was Freitexte einschliesst, welche die Eigenschaft `value` vom Model direkt oder indirekt
in einem Ausdruck verwenden, wenn sich der Wert der Eigenschaft `value` &auml;ndert.

Der ReactProxy wirkt permanent rekursiv auf alle Objekte, in allen Ebenen eines Models
und auch auf die Objekte die sp&auml;ter als Wert hinzugef&uuml;gt werden, auch wenn
diese Objekte nicht explizit den ReactProxy nutzen.

[Mehr erfahren](reactive.md)


## Erweiterung

Die JavaScript-API wurde f&uuml;r Seanox aspect-js um einige allgemeine Funktionen
erweitert.

[Mehr erfahren](extension.md)


## Ereignisse

Seanox aspect-js stellt verschiede Ereignisse bereit, die u.a. zur
Implementierung von Erweiterungen sowie als Benachrichtigung der Anwendung &uuml;ber
bestimmte Betriebszust&auml;nde des Frameworks und der Laufzeitumgebung genutzt
werden k&ouml;nnen.

[Mehr erfahren](events.md)


## Test

Die Test-API unterst&uuml;tzt die Implementierung und Ausf&uuml;hrung von
Integrationstests und kann f&uuml;r Suiten (suite), Szenarien (scenario) und einzelne
Testf&auml;lle (case) verwendet werden.

Als modularer Bestandteil von Seanox aspect-js ist die Test-API in jedem Release
enthalten, der sich ohne Probleme entfernen l&auml;sst. Da die Test-API einige
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
verwendet wird, da "Case" ein Schl&uuml;sselwort im JavaScript ist. Es kann allein
implementiert werden, wird aber immer in einem Szenario verwendet.

```javascript
Test.activate();

Test.create({test() {
    Assert.assertTrue(true);
}});

Test.start();
```

Task ist prim&auml;r ein Meta-Objekt.  

```
{name:..., test:..., timeout:..., expected:..., ignore:...}
```

[Mehr erfahren](test.md#testfall)


### Szenario

Ein Szenario ist eine Abfolge von vielen Testf&auml;llen (Tasks).

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

Eine Suite ist ein komplexes Paket aus verschiedenen Testf&auml;llen, Szenarien und
anderen Suiten. In der Regel besteht eine Suite aus verschiedenen Dateien, die
dann einen komplexen Test darstellen. Ein Beispiel f&uuml;r eine gute Suite ist eine
Kaskade von verschiedenen Dateien und wo der Test in jeder Datei und an jedem
Stelle gestartet werden kann. Dies erm&ouml;glicht einen Integrationstest auf
verschiedenen Ebenen und mit unterschiedlicher Komplexit&auml;t.

[Mehr erfahren](test.md#suite)


### Assert

Die Testf&auml;lle werden mit Behauptungen (Assertions) implementiert. Die Test-API
bietet elementare Aussagen, die erweitert werden k&ouml;nnen. Die Funktion ist
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
wird partiell &uuml;bernommen und unbekanntes wird ignoriert.

```javascript
Test.start({auto: boolean, ouput: {...}, monitor: {...}});
```

[Mehr erfahren](test.md#konfiguration)


### Monitoring

Das Monitoring &uuml;berwacht den Testablauf w&auml;hrend der Ausf&uuml;hrung und wird &uuml;ber die
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
`auto` ignoriert und der Start sofort ausgef&uuml;hrt.

```javascript
Test.suspend();
```

Unterbricht die aktuelle Testausf&uuml;hrung, die mit `Test.resume()` vom aktuellen
Test fortgesetzt werden kann.

```javascript
Test.resume();
```

Setzt die Testausf&uuml;hrung fort, wenn sie zuvor unterbrochen wurde.

```javascript
Test.interrupt();
```

Unterbricht die aktuelle Testausf&uuml;hrung und verwirft alle ausstehenden Tests.
Der Testlauf kann mit `Test.start()` neu gestartet werden.

```javascript
Test.status();
```

Macht eine Momentaufnahme des Status des aktuellen Tests.  
Der Status enth&auml;lt Details zum aktuellen Test und zur Warteschlange.

[Mehr erfahren](test.md#control)


### Events

Ereignisse (Events) bzw. deren Callback-Methoden sind ein weitere Form zur
&Uuml;berwachung der Testausf&uuml;hrung. Die Callback-Methoden werden f&uuml;r entsprechende
Ereignisse bei der Test-API registriert und funktionieren dann &auml;hnlich dem
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
