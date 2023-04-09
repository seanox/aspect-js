[Motivation](motivation.md) | [Inhalt](README.md#einf-hrung) | [Expression Language](expression.md)
- - -

# Einf&uuml;hrung


## Was ist Seanox aspect-js?

Gepr&auml;gt durch die guten Erfahrungen mit JSF (Java Server Faces) in Bezug
auf Funktion und einfache Integration ins Markup, entstand die Idee f&uuml;r
eine &auml;hnliche client-seitige Full-Stack L&ouml;sung mit minimalistischem
und leichtgewichtigem Ansatz zur Implementierung von Single-Page-Applications
(SPAs).

Seanox aspect-js greift dazu den deklarativen Ansatz von HTML auf und erweitert
ihn um Expression Language, reaktives Rendering, zus&auml;tzliche Attribute,
Model-View-Controller, View-Model-Binding, Resource-Bundle (i18n/l10n),
NoSQL-Datasource, Testumgebung und vieles mehr.


# Merkmale
* Einfache Integration in Markup und JavaScript (sauberer Code)  
  kombinierbar mit anderen JavaScript-Frameworks, wenn diese nicht dasselbe tun
  und eine andere Syntax verwenden
* Leichtgewichtige Implementierung  
  erfordert keine zus&auml;tzlichen Frameworks
* Komponentenbasierte Architektur
* Namespaces und Domain-Konzept  
  zur besseren Strukturierung von Komponenten, Modulen und Gesch&auml;ftslogik
* Modularisierung (unterst&uuml;tzt Importe zur Laufzeit)  
  Komponentenkonzept f&uuml;r das intelligente/automatische Laden von Ressourcen
* Event handling
* Expression Language  
  Meta-Sprach-Erweiterung mit voller JavaScript-Unterst&uuml;tzung
* Reaktives Rendering  
  das Rendering reagiert auf &Auml;nderungen in Datenobjekten und l&ouml;st ein
  partielles Rendering der Konsumenten aus 
* Markup-Rendering  
  unterst&uuml;tzt: condition, custom tags, events, filter, interval, iterate,
  rendering, resources messages, validation, ...
* Markup-H&auml;rtung  
  erschwert die Manipulation der Attribute im Markup  
  nicht sichtbare Komponenten werden aus dem DOM entfernt und erst bei
  Verwendung eingesetzt  
* Model-View-Controller (MVC) / Model-View-ViewModel (MVVM)
  unterst&uuml;tzt  View-Model-Binding und Ereignisse
* Sitemap zur Organisation der Darstellung in Pages, Faces und Facets  
  unterst&uuml;tzt virtuelle Pfade und Berechtigungskonzepte
* Resource-Bundle / Resource-Messages   
  Internationalisierung (i18n), Lokalisierung (l10n) und Text-Auslagerung
* NoSQL-DataSource auf Basis von XML  
  leichtgewichtiges Datenmanagement f&uuml;r Aggregation / Projektion / Transformation
* Micro Frontends  
  Platform und Framework zur Implementierung von Micro-Frontends
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
* [Resource-Bundle (Messages/i18n/l10n)](#resource-bundle-messages-i18n-l10n)
* [Model-View-Controller](#model-view-controller)
  * [Composite](#composite)
  * [Binding](#binding)
  * [Dock / Undock](#dock--undock)
  * [Synchronization](#synchronization)
  * [Validation](#validation)
  * [Events](#events)
* [SiteMap](#sitemap)
  * [Page](#page)
  * [Face](#face)
  * [Facet](#facet)
  * [Face-Flow](#face-flow)
  * [Navigation](#navigation)
  * [Berechtigungskonzept](#berechtigungskonzept)
  * [Virtual Paths](#virtual-paths)
* [Komponenten](#komponenten)
* [Scripting](#scripting)
* [Reaktives Rendering](#reaktives-rendering)
* [API-Erweiterungen](#api-erweiterungen)
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

Das Framework besteht aus einer JavaScript-Datei, die &uuml;ber die URL eines
Release-Channels eingebunden oder als Release heruntergeladen wird.

Release-Channel stellen kontinuierlich die neuesten finalen Hauptversionen zur
Verf&uuml;gung. So ist Seanox aspect-js immer auf dem neuesten Stand.

Jedes Release besteht aus verschiedenen Versionen f&uuml;r unterschiedliche
Einsatzzwecke. Diese Versionen gibt es zudem immer in zwei Varianten. Der
Standard ist die komprimierte Version f&uuml;r den produktiven Einsatz. Optional
ist auch die unkomprimierte und dokumentierte max-Variante f&uuml;r Entwicklung
und Fehleranalyse verf&uuml;gbar.

Zu Beginn erstelle eine HTML-Datei, z.B. _index.html_ und f&uuml;ge Seanox
apect-js ein.

```html
<!-- development version, includes helpful comments -->
<script src="https://cdn.jsdelivr.net/npm/@seanox/aspect-js/release/aspect-js-max.js"></script>
```

oder

```html
<!-- production and minimized version -->
<script src="https://cdn.jsdelivr.net/npm/@seanox/aspect-js/release/aspect-js.js"></script>
```

__Das Framework ist zur Implementierung modularer und komponentenbasierter
Single-Page-Applications entwickelt worden. Durch das automatische Laden von
Ressourcen, Modulen und Daten ist f&uuml;r die Verwendung ein Web-Server
erforderlich.__


## Arbeitsbereich

Seanox aspect-js agiert ausschliesslich im HTML-Element `BODY`, welches selbst
mit einbezogen wird.


## Expression Language

Expressions bzw. die Expression Language (EL) ist ein einfacher Zugang zum
clientseitigen JavaScript und damit zu den Modellen und Komponenten im Seanox
aspect-js. Expressions unterst&uuml;tzen das komplette JavaScript-API, das mit
zus&auml;tzlichen Schl&uuml;sselw&ouml;rtern angereichert ist, womit sich auch
die zahlreichen arithmetischen und logischen Operatoren verwenden lassen.

Die Expression Language kann ab dem HTML-Element `BODY` im kompletten Markup als
Freitext, sowie in allen Attributen verwendet werden. Ausgenommen sind die
HTML-Elemente `STYLE` und `SCRIPT`, deren Inhalt von der Expression Language
nicht unterst&uuml;tzt wird. Bei der Verwendung als Freitext wird als Ausgabe
reiner Text (plain text) erzeugt. Das Hinzuf&uuml;gen von Markup, insbesondere
HTML-Code, ist so nicht m&ouml;glich und wird nur mit den Attributen `output`
und `import` unterst&uuml;tzt.

```html
<body lang="{{DataSource.locale}}">
  <p>
    Today is {{new Date().toDateString()}}
    and it's {{new Date().toLocaleTimeString()}} o'clock.
  </p>
</body>
```

Expressions werden durch den Renderer interpretiert, der nach dem Laden der
Seite startet. Somit k&ouml;nnen Expressions beim Laden der Seite sichtbar sein.
Hier empfiehlt sich die Verwendung der Attribute [output](markup.md#output) und
[import](markup.md#import), welche eine direkte Ausgabe in das innere HTML vom
Element bewirken.  

```html
<p output="Today is {{new Date().toDateString()}}
    and it's {{new Date().toLocaleTimeString()}} o'clock.">
</p>
```

Oder die Verwendung vom Attribut [release](markup.md#release), welches
HTML-Elemente und deren Inhalte erst nach dem Rendern sichtbar macht.

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

Der deklarative Ansatz wird in Seanox aspect-js mit Attributen umgesetzt, die
sich ab dem HTML-Element `BODY`, welches mit eingeschlossen ist, in allen
HTML-Elementen verwenden und kombinieren lassen. Die Werte der Attribute
k&ouml;nnen statisch oder mit Verwendung der Expression-Language dynamisch sein.
Enth&auml;lt ein Attribut eine Expression, wird der Wert durch den Renderer mit
jeder Auffrischung (Renderzyklus) auf Basis der initialen Expression
aktualisiert.

[Mehr erfahren](markup.md#attribute)


### output

Setzt beim HTML-Element den Wert oder das Ergebnis seines Ausdrucks als inneres
HTML ein. Das Verhalten ist vergleichbar mit dem Attribut [import](#import), nur
erfolgt mit jedem Renderzyklus eine aktualisierte Ausgabe. Als Wert werden Text,
ein oder mehrere Elemente als NodeList bzw. Array, sowie absolute oder relative
URLs zu einer entfernten Ressource und auch die [DataSource-URL (locator)](
datasource.md#locator) f&uuml;r transformierte Inhalte aus der [DataSource](
datasource.md) unterst&uuml;tzt.

Das output-Attribut l&auml;sst sich mit dem condition-Attribut kombinieren und
wird dann erst ausgef&uuml;hrt, wenn die Bedingung `true` ist.

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

L&auml;dt den Inhalt f&uuml;r das HTML-Element zur Laufzeit und f&uuml;gt diesen
als inneres HTML ein. Das Verhalten ist vergleichbar mit dem Attribut [output](
#output), nur erfolgt der Import einmalig und das import-Attribut wird nach
dem erfolgreichen Laden entfernt. Als Wert werden ein oder mehrere Elemente als
NodeList bzw. Array, sowie absolute oder relative URLs zu einer entfernten
Ressource und auch die [DataSource-URL (locator)](datasource.md#locator)
f&uuml;r transformierte Inhalte aus der [DataSource](datasource.md)
unterst&uuml;tzt.

Das import-Attribut l&auml;sst sich mit dem condition-Attribut kombinieren und
wird dann erst ausgef&uuml;hrt, wenn die Bedingung `true` ist.

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

Als Bedingung legt das Attribut fest, ob ein Element im DOM enthalten bleibt.
Der als Wert angegebene Ausdruck muss explizit `true` zur&uuml;ckliefern, damit
das Element erhalten bleibt. Bei abweichenden R&uuml;ckgabewerten wird das
Element tempor&auml;r aus dem DOM entfernt und l&auml;sst sich sp&auml;ter durch
das Auffrischen des __Eltern-Elements__ wieder einf&uuml;gen, wenn der Ausdruck
`true` zur&uuml;ckliefert.

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

Aktiviert eine intervallgesteuerte Auffrischung des HTML-Elements, ohne dass die
Auffrischung aktiv angestossen werden muss. Das Intervall nutzt das innere HTML
als Vorlage, aus der mit jedem Intervallzyklus aktueller Inhalt erzeugt und
eingef&uuml;gt wird. Das Attribut erwartet als Wert Millisekunden, die auch als
Expression formuliert werden k&ouml;nnen, wobei ung&uuml;ltige Werte eine
Konsolenausgabe verursachen. Die Verarbeitung erfolgt nebenl&auml;ufig bzw.
asynchron aber nicht parallel. Die Verarbeitung wird nach der vorgegebenen Zeit
starten, wenn eine zuvor begonnene JavaScript-Prozedur beendet wurde. Daher ist
das Intervall als zeitnah, nicht aber als exakt zu verstehen. Das Intervall
beginnt mit dem Auffrischen automatisch und endet wenn:
- das Element nicht mehr im DOM existiert
- das condition-Attribut verwendet wird, dass nicht `true` ist

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
  {{counter:parseInt(counter) +1}}
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

Die iterative Ausgabe basiert auf Listen, Aufz&auml;hlungen und Arrays. Wird ein
HTML-Element als iterativ deklariert, wird das innerer HTML als Vorlage
verwendet, aus der mit jedem Iterationszyklus aktueller Inhalt erzeugt und als
inneres HTML eingef&uuml;gt wird. Als Wert wird f&uuml;r das Attribut ein
[Variablen-Ausdruck](expression.md#variable-expression) erwartet, zu dem ein
Meta-Objekt erstellt wird, was in der Vorlage den Zugriff auf die Iteration
erm&ouml;glicht. So erzeugt der Variablen-Ausdruck `iterate={{
tempA:Model.list}}` das Meta-Objekt `tempA = {item, index, data}`.

```javascript
const Model = {
    months: ["Spring", "Summer", "Autumn", "Winter"]
};
```

```html
<select iterate={{months:Model.months}}>
  <option value="{{months.index}}">
    {{months.item}}
  </option>
</select>
```

[Mehr erfahren](markup.md#iterate)


### id

Die ID (Bezeichner) hat in Seanox aspect-js eine elementare Bedeutung. Sie
bildet die Grundlage f&uuml;r das [View-Model-Binding](
sitemap.md#view-model-binding) und wird von der [SiteMap](sitemap.md#sitemap)
f&uuml;r [Faces](sitemap.md#face) und [Facets](sitemap.md#facet) im [Face-Flow](
sitemap.md#face-flow) und somit als Ziel f&uuml;r virtuelle Pfade verwendet.

Wie bei allen Attributen ist hier die Expression-Language anwendbar, mit der
Besonderheit, dass &Auml;nderungen zur Laufzeit keine Auswirkungen haben, da das
Attribut bzw. der Wert f&uuml;r das View-Model-Binding nur initial verarbeitet
wird, solange das HTML-Element im DOM existiert.

[Mehr erfahren](markup.md#id)


### composite

Kennzeichnet im Markup ein Element als [Composite](composite.md). Composites
sind essenzielle Bestandteile, die zwingend einen Bezeichner (ID / Composite-ID)
ben&ouml;tigen.

```html
<article id="example" composite>
  ...
</article>
```

Composites sind auch die Grundlage f&uuml;r das [View-Model-Binding](
mvc.md#view-model-binding), was die Verbindung von HTML-Elementen im Markup
(View) mit korrespondierenden JavaScript-Objekten (Models) umfasst. Models sind
statische JavaScript-Objekte, die vergleichbar mit managed Beans und DTOs (Data
Transfer Objects) Daten, Zust&auml;nde und Funktionen f&uuml;r die View
bereitstellen. Die View als Pr&auml;sentationsfl&auml;che und
Benutzer-Schnittstelle f&uuml;r Interaktionen und das Model sind prim&auml;r
entkoppelt. F&uuml;r den MVVM (Model-View-ViewModel) Ansatz, als Erweiterung zum
MVC ([Model-View-Controller](mvc.md#model-view-controller)), verbindet der
Controller Views und Models auf Basis der Composite-IDs bidirektional, womit
keine manuelle Implementierung und Deklaration von Ereignissen, Interaktion oder
Synchronisation erforderlich ist.

Von der [SiteMap](sitemap.md#sitemap) werden Composites als [Faces](
    sitemap.md#face) zur prim&auml;ren Projektion von JavaScript-Objekten
(Models) genutzt, womit sich diese als Ziele f&uuml;r virtuelle Pfade im
[Face-Flow](sitemap.md#face-flow) verwenden lassen, was direkten Einfluss auf
die Sichtbarkeit der Composites hat. Bei aktiver SiteMap lassen sich Composites
mit dem Attribut [static](#static) kennzeichnen, womit ein Composite als Face
unabh&auml;ngig von virtuellen Pfaden permanent sichtbar ist.

Details zur Verwendung von Composites / modularen Komponente werden in den
Abschnitten [Composites](composite.md) und [Model-View-Controller](mvc.md)
beschrieben.

[Mehr erfahren](markup.md#composite)


### strict

Das Attribut ist mit den Attributen [composite](#composite) und [validate](
#validate) kombinierbar.

In Kombination mit dem Attribut [composite](#composite) legt es fest, dass beim
Laden der Ressourcen (JS, CSS, HTML) zu einer Komponente, der Dateiname in der
originalen Schreibweise verwendet wird. Das Standardverhalten ohne das Attribut
[strict](#strict) verwendet die Composite-Id mit einem Kleinbuchstaben am
Anfang.

[Mehr erfahren](markup.md#strict)


### events

Bindet ein oder mehrere [Ereignisse](https://www.w3.org/TR/DOM-Level-3-Events)
an ein HTML-Element. Das erm&ouml;glicht die ereignisgesteuerte Synchronisation
von HTML-Elementen mit korrespondierenden JavaScript-Objekten (Models), sowie
die Validierung der zu synchronisierenden Daten (mehr dazu im Abschnitt
[validate](#validate)) und das ereignisgesteuerte Ansteuern und Auffrischen
anderer HTML-Elemente (mehr dazu im Abschnitt [render](#render)).

```html
<span id="output1">{{#text1.value}}</span>
<input id="text1" type="text"
    events="input change" render="#output1"/>
```

Wie bei allen Attributen ist hier die Expression-Language anwendbar, mit der
Besonderheit, dass &Auml;nderungen zur Laufzeit keine Auswirkungen haben, da das
Attribut bzw. der Wert f&uuml;r das View-Model-Binding nur initial verarbeitet
wird, solange das HTML-Element im DOM existiert.

[Mehr erfahren](markup.md#events)


### validate

Das Attribut `validate` erfordert die Kombination mit dem Attribut `events`.
Zusammen definieren und steuern sie die Synchronisation zwischen dem Markup
eines Composites und dem korrespondierenden JavaScript-Objekt (Model), wo eine
gleichnamige Eigenschaft als Ziel f&uuml;r die Synchronisation vorhanden sein
muss.

Die Validierung funktioniert dabei zweistufig und nutzt zu Beginn die Standard
HTML5-Validierung. Kann diese keine Abweichungen vom erwarteten Ergebnis
ermitteln oder wurde keine HTML5-Validierung festgelegt, wird die Validierung
vom JavaScript-Objekt aufgerufen, wenn das Modell eine entsprechende
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

Die Synchronisation und das Standard-Verhalten (action) vom Browser werden durch
die Validierung direkt beeinflusst, die dazu vier Zust&auml;nde als
R&uuml;ckgabewert nutzen kann: `true`, `not true`, `text`, `undefined/void`.

[Mehr erfahren](markup.md#validate)


### message

Message ist ein optionaler Bestandteil der [Validierung](#validate) und wird zur
Text- bzw. Fehler-Ausgabe im Fall einer unbest&auml;tigten Validierung verwendet.
Das Attribut erfordert die Kombination mit den Attributen [validate](#validate)
und [events](#events).

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

Notification ist ein optionaler Bestandteil der [Validierung](#validate) und
legt fest, dass der Inhalt vom message-Attribut als Info-Box (Browser-Feature)
am entsprechenden Element angezeigt wird, wenn die Validierung nicht erfolgreich
ist. Das Attribut erfordert die Kombination mit den Attributen [validate](
#validate), [events](#events) und [message](#message).

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

Das Attribut erfordert die Kombination mit dem Attribut [events](#events).
Zusammen definieren sie, welche Ziele mit welchen auftretenden [Ereignissen](
https://www.w3.org/TR/DOM-Level-3-Events) vom Renderer aufgefrischt werden.
Als Wert werden ein oder mehrere durch Leerzeichen getrennte CSS- bzw.
Query-Selectoren erwartet, welche die Ziele festlegen.

```html
<span id="output1">{{#text1.value}}</span>
<input id="text1" type="text"
    events="input change" render="#output1"/>
```

__Alternativ kann auch das [reaktive Rendering](reactive.md) verwendet werden,
wo &Auml;nderungen in den Datenobjekten eine partielle Aktualisierung der View
ausl&aouml;sen.__

[Mehr erfahren](markup.md#render)


### release

Inverser Indikator daf&uuml;r, dass ein Element gerendert wurde. Der Renderer
entfernt dieses Attribut, wenn ein HTML-Element gerendert wurde. Dieser Effekt
kann f&uuml;r CSS verwendet werden, um HTML-Elemente nur im gerenderten Zustand
anzuzeigen. Eine entsprechende CSS-Regel wird dem HEAD automatisch mit dem Laden
der Seite hinzugef&uuml;gt.

```html
<span release>{{'Show me after rendering.'}}</span>
```

[Mehr erfahren](markup.md#release)


## DataSource

DataSource ist ein NoSQL-Ansatz zur Datenspeicherung auf Basis von XML-Daten in
Kombination mit mehrsprachiger Datentrennung, optionaler Aggregation und
Transformation. Es ist eine Kombination von Ans&auml;tzen einer
read-only-Datenbank und einem CMS.

Die DataSource basiert auf statischen Daten. Daher verwendet die Implementierung
einen Cache, um den Netzwerkzugriff zu minimieren.

Die Daten werden per XPath abgefragt. Das Ergebnis kann verkettet, aggregiert
und per XSLT transformiert werden.

[Mehr erfahren](datasource.md#datasource)


## Resource-Bundle (Messages/i18n/l10n)

(Resource)Messages ist eine statische Erweiterung der [DataSource](
datasource.md) f&uuml;r Internationalisierung (i18n), Lokalisierung (l10n)
sowie f&uuml;r Mandanten bezogene Texte. Die Implementierung basiert auf einer
Menge von Schl&uuml;ssel-Wert-Paaren in Form von Label-Elementen, die in der
Datei `locales.xml` im DataSource-Verzeichnis definiert werden.

[Mehr erfahren](message.md)


## Model-View-Controller

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

[Mehr erfahren](mvc.md)


### Model

Models sind statische JavaScript-Objekte, die vergleichbar mit managed Beans und
DTOs (Data Transfer Objects) Daten, Zust&auml;nde und Funktionen f&uuml;r die
View bereitstellen. Als Singletons/Facades/Delegates k&ouml;nnen sie weitere
Komponenten und Abstraktionen nutzen, selbst Gesch&auml;ftslogik enthalten und
sind ein Bindeglied zwischen View und Middleware.

[Mehr erfahren](mvc.md#model)


### View

Die View, welche durch das Markup repr&auml;sentiert wird, ist ausschliesslich
f&uuml;r die Darstellung bzw. Projektion von Modellen verantwortlich. Wobei
Projektion eine gute Beschreibung ist, da die Art der Darstellung eines Modells
nicht eingeschr&auml;nkt ist.

[Mehr erfahren](mvc.md#view)


### Controller

Der (Applikations-)Controller steuert Abl&auml;ufe innerhalb einer Applikation
(Face-Flow) und &uuml;bernimmt mit dem View-Model-Binding den Datenfluss
zwischen View und Model, wobei hier auch von MVVM (Model-View-ViewModel) und
MVCS (Model-View-Controller-Service) gesprochen werden kann.

[Mehr erfahren](mvc.md#controller)


### View-Model-Binding

Das View-Model-Binding &uuml;bernimmt die bidirektionale Verkn&uuml;pfung der
HTML-Elemente der View mit den Modellen als statische JavaScript-Objekte und
organisiert so den Datenfluss, kommuniziert Ereignisse sowie Zust&auml;nde und
bindet Funktionen an.

[Mehr erfahren](mvc.md#view-model-binding)


#### Composite

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

```javascript
const model = {
    message: "Hello", 
    submit: {
        ...    
    }
};
```

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

[Mehr erfahren](mvc.md#composite)


#### Binding

Beim View-Model-Binding geht es um die Verbindung von Markup/HTML (View) mit dem
entsprechenden JavaScript-Objekt (Model). Das Binding leitet Interaktionen und
Status&auml;nderungen der View an das Model weiter und stellt eine
Schnittstelle f&uuml;r Middleware-Funktionen und Services für die View bereit.
Womit keine manuelle Implementierung von Ereignissen, Synchronisation und
Interaktion zwischen View und Anwendungslogik erforderlich ist.

```javascript
const model = {
    message: "Hello", 
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
      <input type="text" id="message" value="{{model.message}}" events="change"/>
      <input type="submit" id="submit"/>
      ...
    </form>
  </body>
</html>
```

[Mehr erfahren](mvc.md#binding)


#### Dock / Undock

Wird ein Composite im DOM verwendet/eingef&uuml;gt, wird das entsprechende
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

Bei Composites, die mit dem Attribut [condition](markup.md#condition) deklariert
werden, h&auml;ngt der Aufruf der Methoden vom Ergebnis der Bedingung ab.

[Mehr erfahren](mvc.md#dock)


#### Synchronization

Das View-Model-Binding umfasst neben der statischen Verkn&uuml;pfung und
Zuordnung von HTML-Elementen (View) zum JavaScript-Objekt (Model) auch die
Synchronisation von Werten zwischen den HTML-Elementen und den Feldern im
JavaScript-Objekt. Die Synchronisation h&auml;ngt von Ereignissen ab, die
f&uuml;r das HTML-Element mit dem Attribut [events](markup.md#events) deklariert
sind und wird nur ausgef&uuml;hrt, wenn eines der definierten Ereignisse
eintritt.

[Mehr erfahren](mvc.md#synchronization)


#### Validation

Die Synchronisation der Werte zwischen den HTML-Elementen (View) und den Feldern
vom JavaScript-Objekt (Model) kann durch Validierung &uuml;berwacht und
gesteuert werden. Die Validierung wird in HTML durch die Kombination der
Attribute [validate](markup.md#validate) und [events](markup.md#events)
deklariert und erfordert eine entsprechende Validierungsmethode im
JavaScript-Objekt.

[Mehr erfahren](mvc.md#validation)


#### Events

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
    <div id="contact" composite>
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

[Mehr erfahren](mvc.md#events)


## SiteMap

Die Darstellung der Page l&auml;sst sich in Seanox aspect-js mit der SiteMap in
Faces sowie Facets organisieren und &uuml;ber virtuelle Pfade ansprechen. Zu
diesen Zweck stellt SiteMap eine hierarchische Verzeichnisstruktur bereit, die
auf den virtuellen Pfaden aller Faces und Facets basiert. Die SiteMap steuert
den Zugriff und die Visualisierung (Ein- und Ausblenden) der Element -- der
sogenannte Face-Flow. Face-Flow und Visualisierung funktionieren resolut und
verwenden aktiv das DOM zum Einf&uuml;gen und Entfernen der Faces und Facets.

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


### Page

In einer Single-Page-Application bildet die Page den elementaren Rahmen und die
Laufzeitumgebung der gesamten Anwendung.


### Face

Ein Face ist die prim&auml;re Projektion von Modellen/Komponenten/Inhalten.
Diese Projektion kann zus&auml;tzliche Unterstrukturen in Form von Facets und
Sub-Faces enthalten. So werden &uuml;bergeordnete Faces zu partiellen Faces,
wenn sich der Pfad auf ein Sub-Face bezieht. In dem Fall werden alle
&uuml;bergeordneten Faces teilweise/partiell angezeigt, also ohne deren evtl.
enthaltenen Facets.


### Facet

Facets sind Teile eines Faces (Projektion) und meist keine eigenst&auml;ndige
Darstellung. So k&ouml;nnen z.B. bei einem Such-Formular die Eingabemaske und
die Ergebnistabelle separate Facets eines Faces sein. Sowohl Faces als auch
Facets sind &uuml;ber virtuelle Pfade erreichbar. Der Pfad zu Facets bewirkt,
dass das umschliessende Face mit all seinen &uuml;bergeordneten Faces angezeigt
wird.


### Face-Flow

Face-Flow beschreibt die Zugriffssteuerung und die Abfolge von Faces und Facets.
Die SiteMap stellt dazu Schnittstellen, Berechtigungskonzepte und Akzeptoren
bereit, mit denen der Face-Flow kontrolliert und beeinflusst werden kann.

[Mehr erfahren](sitemap.md#sitemap)


## Navigation

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

[Mehr erfahren](sitemap.md#navigation)


## Berechtigungskonzept

Das Berechtigungskonzept basiert auf permit-Methoden, die als Callback-Methoden
mit der Konfiguration des Face-Flows definiert werden. Es k&ouml;nnen mehrere
permit-Methoden definiert werden, die mit jedem angeforderten Pfad
&uuml;berpr&uuml;ft werden. Nur wenn alle permit-Methoden den angeforderten Pfad
mit `true` best&auml;tigen, wird er verwendet und der Renderer macht die
abh&auml;ngigen Faces und Facets sichtbar.

[Mehr erfahren](sitemap.md#berechtigungskonzept)


### Virtual Paths

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

[Mehr erfahren](sitemap.md#virtual-paths)


## Komponenten

Seanox aspect-js ist auf eine modulare und komponentenbasierte Architektur
ausgerichtet. Das Framework unterst&uuml;tzt dazu eine deklarative Kennzeichnung
von Komponenten im Markup sowie automatische Mechanismen f&uuml;r das
View-Model-Binding und das Laden von ausgelagerten Ressourcen zur Laufzeit.

[Mehr erfahren](composite.md)


## Scripting

Seanox aspect-js nutzt Composite-JavaScript. Ein Dialekt, basierend auf dem
JavaScript des Browsers, das um Makros -- einer einfachen Meta-Syntax,
angereichert wurde.

Composite-JavaScript, was auch die Module einschliesst, wird nicht als Element
eingef&uuml;gt, sondern direkt mit der eval-Methode ausgef&uuml;hrt. Da hierzu
ein isolierter und nicht der globale G&uuml;ltigkeitsbereich (Scope) verwendet
wird, sind Variablen, Konstanten und Methoden nicht direkt global oder
&uuml;bergreifend nutzbar, weshalb u.a. das Composite-JavaScript mit [Makros](
#makros) angereichert wurde, welche u.a. solche Aufgaben &uuml;bernehmen.

[Mehr erfahren](scripting.md)


## Reaktives Rendering

Beim reaktiven Ansatz l&ouml;sen &Auml;nderungen an den Datenobjekten (Models)
ein partielles Auffrischen der Konsumenten in der View aus. Konsumenten sind
alle Ausdr&uuml;cke, die lesend auf den ge&auml;nderten Wert eines Datenobjekts
zugreifen. In der View lassen sich Ausdr&uuml;cke in den HTML-Elementen und im
Freitext verwenden. Die Datenobjekte m&uuml;ssen dann f&uuml;r das reaktive
Rendering `Reactive(object)` oder `Object.prototype.reactive()` nutzen.

```javascript
const Model = {
    value: ...
}.reactive();
```

In diesem Beispiel aktualisiert der Renderer automatisch alle HTML-Elemente im
DOM, was Freitexte einschliesst, welche die Eigenschaft `value` vom `Model`
direkt oder indirekt in einem Ausdruck verwenden, wenn sich der Wert der
Eigenschaft `value` &auml;ndert oder genauer, wenn ein ge&auml;nderter Wert im
Datenobjekt final gesetzt wurde, was bei der Verwendung von Getter und Setter
relevant sein kann.

Reactive wirkt permanent rekursiv auf allen Objektebenen und auch auf die
Objekte welche sp&auml;ter als Wert hinzugef&uuml;gt werden. Auch wenn diese
Objekte nicht explizit Reactive nutzen, werden f&uuml;r die referenzierten
Objekte neue Instanzen gebildet. Initiierende Objekte und reaktive Models sind
logisch entkoppelt und werden bidirektional synchronisiert. Im Unterschied dazu
nutzen Views und reaktive Models, wie auch die Models intern, Proxies, die sich
wie die initiierenden Originale verhalten und verwenden lassen. Jedoch sind
Proxies eigenst&aumkl;ndige Instanzen, die kompatibel aber nicht identisch zum
initiierenden Objekt sind. Notwendig ist diese logische Trennung, damit der
Renderer bei Daten&auml;nderungen entsprechende Notifications erzeugen und damit
die Konsumenten in der View aktualisieren kann.

[Mehr erfahren](reactive.md)


## API-Erweiterungen

Das JavaScript-API wurde f&uuml;r Seanox aspect-js um einige allgemeine
Funktionen erweitert.

- [Namespace](extension.md#namespace)
- [Element](extension.md#element)
- [Math](extension.md#math)
- [Object](extension.md#object)
- [RegExp](extension.md#regexp)
- [String](extension.md#string)
- [window](extension.md#window)
- [XMLHttpRequest](extension.md#xmlhttprequest)

[Mehr erfahren](extension.md)


## Ereignisse

Seanox aspect-js stellt verschiedene Ereignisse bereit, die u.a. zur
Implementierung von Erweiterungen sowie als Benachrichtigung der Anwendung
&uuml;ber bestimmte Betriebszust&auml;nde des Frameworks und der
Laufzeitumgebung genutzt werden k&ouml;nnen.

[Mehr erfahren](events.md)


## Test

Das Test-API unterst&uuml;tzt die Implementierung und Ausf&uuml;hrung von
Integrationstests und kann f&uuml;r Suiten (suite), Szenarien (scenario) und
einzelne Testf&auml;lle (test case) verwendet werden.

Als modularer Bestandteil von Seanox aspect-js ist das Test-API, mit Ausnahme
der core-Versionen, in allen Releases enthalten. Da das Test-API einige
Besonderheiten in Bezug auf Fehlerbehandlung und Konsolen-Ausgabe bewirkt, muss
das Test-API zur Laufzeit bewusst aktiviert werden.

```javascript
Test.activate();

Test.create({test() {
    ...
}});

Test.start();
```

[Mehr erfahren](test.md)


### Testfall

Der kleinste Bestandteil in einem Integrationstest, der hier als _Task_
verwendet wird, da _case_ ein Schl&uuml;sselwort im JavaScript ist. Tasks
k&ouml;nnen allein implementiert werden, werden aber meist in einem Szenario
verwendet.

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

Eine Suite ist ein komplexes Paket aus verschiedenen Testf&auml;llen, Szenarien
und anderen Suiten. In der Regel besteht eine Suite aus verschiedenen Dateien,
die dann einen komplexen Test darstellen. Ein Beispiel f&uuml;r eine gute Suite
ist eine Kaskade von verschiedenen Dateien und wo der Test in jeder Datei und an
jeder Stelle gestartet werden kann. Dies erm&ouml;glicht einen Integrationstest
auf verschiedenen Ebenen und mit unterschiedlicher Komplexit&auml;t.

[Mehr erfahren](test.md#suite)


### Assert

Die Testf&auml;lle werden mit Behauptungen (Assertions) implementiert. Das
Test-API bietet elementare Aussagen, die erweitert werden k&ouml;nnen. Die
Funktionsweise ist einfach: Wenn eine Behauptung nicht wahr ist, tritt ein
Fehler auf, optional mit einer individuellen Fehlermeldung.

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

Optional kann das Test-API mit jedem Start konfiguriert werden. Als Parameter
wird ein Meta-Objekt erwartet. Die darin enthaltene Konfiguration wird partiell
&uuml;bernommen und unbekanntes wird ignoriert.

```javascript
Test.start({auto: boolean, ouput: {...}, monitor: {...}});
```

[Mehr erfahren](test.md#konfiguration)


### Monitoring

Das Monitoring &uuml;berwacht den Testablauf w&auml;hrend der Ausf&uuml;hrung
und wird &uuml;ber die verschiedenen Schritte und Status informiert. Der Monitor
ist optional. Ohne diesen werden Informationen zum Testverlauf in der Konsole
ausgegeben.

[Mehr erfahren](test.md#monitoring)


### Control

Der Testverlauf und die Verarbeitung der einzelnen Tests kann per Test-API
gesteuert werden.

```javascript
Test.start();
Test.start({auto: boolean});
```

Der Start kann manuell oder bei Verwendung von `auto = true` durch das Laden der
Seite erfolgen. Wenn die Seite bereits geladen ist, wird der Parameter `auto`
ignoriert und der Start sofort ausgef&uuml;hrt.

Weitere Methoden zur Steuerung und Kontrolle der Testausf&uuml;hrung sind
verf&uuml;gbar.

[Mehr erfahren](test.md#control)


### Events

Ereignisse (Events) bzw. deren Callback-Methoden sind eine weitere Form zur
&Uuml;berwachung der Testausf&uuml;hrung. Die Callback-Methoden werden f&uuml;r
entsprechende Ereignisse beim Test-API registriert und funktionieren dann
&auml;hnlich dem Monitor.

```javascript
Test.listen(Test.EVENT_***, function(event, status) {
    ...
});
```

[Mehr erfahren](test.md#events)


- - -

[Motivation](motivation.md) | [Inhalt](README.md#einf-hrung) | [Expression Language](expression.md)
