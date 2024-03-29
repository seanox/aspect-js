[Expression Language](expression.md) | [Inhalt](README.md#markup) | [Scripting](scripting.md)
- - -

# Markup

Mit Seanox aspect-js wird der deklarative Ansatz von HTML aufgegriffen und
erweitert. Neben der Expression-Language werden den HTML-Elementen
zus&auml;tzliche Attribute f&uuml;r Funktionen und dem View-Model-Binding
bereitgestellt. Der entsprechende Renderer ist in der Composite-Implementierung
enthalten und &uuml;berwacht das DOM ab dem BODY Element aktiv &uuml;ber den
MutationObserver und funktioniert und reagiert rekursiv auf Ver&auml;nderungen.


## Inhalt

* [Attribute](#attribute)
  * [composite](#composite)
  * [condition](#condition)
  * [events](#events)
  * [id](#id)
  * [import](#import)
  * [interval](#interval)
  * [iterate](#iterate)
  * [message](#message)
  * [namespace](#namespace)
  * [notification](#notification)
  * [output](#output)
  * [release](#release)
  * [strict](#strict)
  * [render](#render)
  * [validate](#validate)
* [@-Attribute](#-attribute)
* [Expression Language](#expression-language)
* [Scripting](#scripting)
* [Customizing](#customizing)
  * [Tag](#tag)
  * [Selector](#selector)
  * [Acceptor](#acceptor)
* [H&auml;rtung](markup.md#h&aumlrtung)


## Attribute

Der deklarative Ansatz wird in Seanox aspect-js mit Attributen umgesetzt, die
sich ab dem HTML-Element `BODY`, welches mit eingeschlossen ist, in allen
HTML-Elementen verwenden und kombinieren lassen. Die Werte der Attribute
k&ouml;nnen statisch oder mit Verwendung der Expression-Language dynamisch sein.
Enth&auml;lt ein Attribut eine Expression, wird der Wert durch den Renderer mit
jeder Auffrischung (Renderzyklus) auf Basis der initialen Expression
aktualisiert.


### composite

Kennzeichnet im Markup ein Element als [Composite](composite.md). Composites
sind essenzielle Bestandteile, die zwingend einen Bezeichner (ID / Composite-ID)
ben&ouml;tigen.

```html
<article id="example" composite>
  ...
</article>
```

Als Komponente setzen sich Composites aus verschiedenen [Ressourcen](
    composite.md#ressourcen) (Markup, CSS, JS) zusammen, die sich auf Basis der
(Composite-)ID in das Modul-Verzeichnis auslagern lassen und erst bei Bedarf zur
Laufzeit nachgeladen werden.

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

```html
<article id="example" composite static>
  ...
</article>
```

Details zur Verwendung von Composites / modularen Komponenten werden in den
Abschnitten [Composites](composite.md) und [Model-View-Controller](mvc.md)
beschrieben.


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

Bei der Kombination mit dem Attribut [interval](#interval) ist zu beachten, dass
mit dem Entfernen des Elements aus dem DOM auch der zugeh&ouml;rige Timer
beendet wird. Wird das Element mit einer sp&auml;teren Auffrischung wieder in
das DOM aufgenommen, startet ein neuer Timer, wird also nicht fortgesetzt.

```html
<article interval="{{1000}}" condition="{{Model.visible}}">
  ...
</article>
```

Die Verwendung vom condition-Attribut in Verbindung mit eingebettetem JavaScript
ist als SCRIPT element mit dem Typ `composite/javascript` als
Composite-JavaScript m&ouml;glich, da hier der Renderer die Kontrolle &uuml;ber
die Skript-Ausf&uuml;hrung hat und nicht der Browser.

```html
<script type="composite/javascript" condition="{{Model.visible}}">
    ...
</script>
```

Details zur Verwendung von eingebettetem JavaScript werden im Abschnitt
[Scripting](#scripting) beschrieben.


### events

Bindet ein oder mehrere [Ereignisse](https://www.w3.org/TR/DOM-Level-3-Events)
an ein HTML-Element. Das erm&ouml;glicht die ereignisgesteuerte Synchronisation
von HTML-Elementen mit korrespondierenden JavaScript-Objekten (Models), sowie
die Validierung der zu synchronisierenden Daten (mehr dazu im Abschnitt
[validate](#validate)) und das ereignisgesteuerte Ansteuern und Auffrischen
anderer HTML-Elemente (mehr dazu im Abschnitt [render](#render)).

Wie bei allen Attributen ist hier die Expression-Language anwendbar, mit der
Besonderheit, dass &Auml;nderungen zur Laufzeit keine Auswirkungen haben, da das
Attribut bzw. der Wert f&uuml;r das View-Model-Binding nur initial verarbeitet
wird, solange das HTML-Element im DOM existiert.

```html
<span id="output1">{{#text1.value}}</span>
<input id="text1" type="text"
    events="input change" render="#output1"/>
```

Beispiel zur synchronen Auffrischung vom HTML-Element _output1_ mit den
Ereignissen _Input_ oder _Change_ beim HTML-Element _text1_. In dem Beispiel
wird der Eingabewert von _text1_ synchron mit _output1_ ausgegeben.

```javascript
const Model = {
    validate(element, value) {
        return true;
    },
    text1: ""
};
```

```html
<form id="Model" composite>
  <input id="text1" type="text"
      validate events="input change"/>
  <input type="submit" value="submit"
      validate events="click"/>
</form>
```

Beispiel zur Implementierung und kombinierten Verwendung der Attribute `events`
und `validate`. In dem Beispiel wird der Eingabewert vom Composite-Feld _text1_
nur dann in das gleichnamige Feld im JavaScript-Objekt &uuml;bernommen und die
Validierung durchgef&uuml;hrt, wenn mindestens eines der Ereignisse: _Input_
oder _Change_ eintritt.


### id

Die ID (Bezeichner) hat in Seanox aspect-js eine elementare Bedeutung. Sie
bildet die Grundlage f&uuml;r das [View-Model-Binding](
    mvc.md#view-model-binding) und wird von der [SiteMap](sitemap.md#sitemap)
f&uuml;r [Faces](sitemap.md#face) und [Facets](sitemap.md#facet) im [Face-Flow](
    sitemap.md#face-flow) und somit als Ziel f&uuml;r virtuelle Pfade verwendet.

Wie bei allen Attributen ist hier die Expression-Language anwendbar, mit der
Besonderheit, dass &Auml;nderungen zur Laufzeit keine Auswirkungen haben, da das
Attribut bzw. der Wert f&uuml;r das View-Model-Binding nur initial verarbeitet
wird, solange das HTML-Element im DOM existiert.


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

```javascript
const Model = {
    publishForm() {
        const form = document.createElement("form");
        const label = document.createElement("label");
        label.textContent = "Input";
        form.appendChild(label);
        const input = document.createElement("input");
        input.value = "123";
        input.type = "text";
        form.appendChild(input);
        const submit = document.createElement("input");
        submit.type = "submit";
        form.appendChild(submit);
        return form;
    },
    publishImg() {
        const img = document.createElement("img");
        img.src = "https://raw.githubusercontent.com/seanox/aspect-js/master/test/resources/smile.png";
        return img;
    }
};
```

```html
<article import="{{Model.publishImg()}}">
  loading image...
</article>
<article import="{{Model.publishForm()}}">
  loading form...
</article>
```

Beispiel f&uuml;r den Import einer entfernten Ressource per HTTP-Methode GET.

```html
<article import="{{'https://raw.githubusercontent.com/seanox/aspect-js/master/test/resources/import_c.htmlx'}}">
  loading resource...
</article>

<article import="https://raw.githubusercontent.com/seanox/aspect-js/master/test/resources/import_c.htmlx">
  loading resource...
</article>
```

Beispiel f&uuml;r den Import per DataSource-URL. Wird nur eine URL angegeben,
wird die URL f&uuml;r Daten und Transformation daraus abgeleitet. 

```html
<article import="{{'xml:/example/content'}}">
  loading resource...
</article>

<article import="xml:/example/content">
  loading resource...
</article>
```

Beispiel f&uuml;r den Import per DataSource-URL mit spezifischer Daten- und
Transformations-URL. Als Wert sind die Daten-URL (locator der XML-Datei) und
nachfolgend getrennt durch ein Leerzeichen die Transformations-URL (locator vom
XSLT-Template) angegeben. 

```html
<article import="{{'xml:/example/data xslt:/example/style'}}">
  loading resource...
</article>

<article import="xml:/example/data xslt:/example/style">
  loading resource...
</article>
```

Beim Einf&uuml;gen von Inhalten aus der DataSource, wird der Typ von
JavaScript-Bl&ouml;cken automatisch in `composite/javascript` ge&auml;ndert und
erst durch den Renderer ausgef&uuml;hrt. So wird gew&auml;hrleistet, dass das
JavaScript ggf. abh&auml;ngig vom umschliessenden condition-Attribut
ausgef&uuml;hrt wird.


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
<span interval="1000">
  ...
</span>

<span interval="{{1000 +500}}">
  ...
</span>
```

Das interval-Attribut kann f&uuml;r einfache HTML-Elemente und auch komplexe
HTML-Konstrukte verwendet werden. So wird das SPAN-Element alle 1000ms
aktualisiert. Ein aktives Intervall reagiert dabei dynamisch auf
Ver&auml;nderungen im DOM und beginnt automatisch wenn das HTML-Element im DOM
hinzugef&uuml;gt wird und endet wenn es aus dem DOM entfernt wird. Womit sich
das interval-Attribut gut in Kombination mit dem condition-Attribut verwenden
und steuern l&auml;sst.

```html
<span interval="1000" condition="{{IntervalModel.isVisible()}}">
  ...
</span>
```

Mit der Kombination von Intervall und Variablen-Expression ist z.B. die
Umsetzung eines permanenten Z&auml;hlers einfach.

```html
{{counter:0}}
<p interval="1000">
  {{counter:parseInt(counter) +1}}
  {{counter}}
</p>
```

Auch die Verwendung vom interval-Attribut in Verbindung mit eingebettetem
JavaScript ist als Composite-JavaScript m&ouml;glich.

```html
<script type="composite/javascript" interval="1000">
    ...
</script>
```

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


### message

Message ist ein optionaler Bestandteil der [Validierung](#validate) und wird zur
Text- bzw. Fehler-Ausgabe im Fall einer unbest&auml;tigten Validierung verwendet.
Das Attribut erfordert die Kombination mit den Attributen [validate](#validate)
und [events](#events). 

```html
<form id="Model" composite>
  <input id="email" type="text" placeholder="email address"
      pattern="^\w+([\w\.\-]*\w)*@\w+([\w\.\-]*\w{2,})$"
      validate message="Valid e-mail address required"
      events="input change" render="#Model"/>
  <input type="submit" value="submit" validate events="click"/>
</form>
```

```html
<form id="Model" composite>
  <input id="text1" type="text" placeholder="email address"
      pattern="^\w+([\w\.\-]*\w)*@\w+([\w\.\-]*\w{2,})$"
      validate message="{{Messages['Model.email.validation.message']}}"
      events="input change" render="#Model"/>
  <input type="submit" value="submit" validate events="click"/>
</form>
```


### namespace

Vergleichbar mit Packages in anderen Programmiersprachen, lassen sich Namespaces
(Namensr&auml;ume) zur hierarchischen Strukturierung von Komponenten, Ressourcen
und Gesch&auml;ftslogik nutzen.

Auch wenn Packages kein Merkmal von JavaScript sind, lassen sich diese auf
Objektebene durch das Verketten von Objekten zu einem Objektbaum abbilden. Dabei
bildet jede Ebene des Objektbaums einen Namespace, was auch als Domain
betrachtet werden kann.

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
ein korrespondierendes JavaScript-Objekt (Model) existieren und verwendet
werden. Im Markup wird lediglich die Syntax der Namespaces gepr&uuml;ft. Ist
diese g&uuml;ltig, werden die Namespaces direkt auf den Pfad von Modulen und
deren Ressourcen angewendet und erweitern den Pfad ab dem Modul-Verzeichnis.

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

Details zu Namespaces werden auch in den Abschnitten [Erweiterung - Namespace](
    extension.md#namespace) und [Composites - Namespace](composite.md#namespace)
beschrieben. 


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

```javascript
const Model = {
    publishForm() {
        const form = document.createElement("form");
        const label = document.createElement("label");
        label.textContent = "Input";
        form.appendChild(label);
        const input = document.createElement("input");
        input.value = "123";
        input.type = "text";
        form.appendChild(input);
        const submit = document.createElement("input");
        submit.type = "submit";
        form.appendChild(submit);
        return form;
    },
    publishImg() {
        const img = document.createElement("img");
        img.src = "https://raw.githubusercontent.com/seanox/aspect-js/master/test/resources/smile.png";
        return img;
    }
};
```

```html
<article output="{{Model.publishImg()}}">
  loading image...
</article>
<article output="{{Model.publishForm()}}">
  loading form...
</article>
```

Beispiel f&uuml;r den Output einer entfernten Ressource per HTTP-Methode GET.

```html
<article output="{{'https://raw.githubusercontent.com/seanox/aspect-js/master/test/resources/import_c.htmlx'}}">
  loading resource...
</article>

<article output="https://raw.githubusercontent.com/seanox/aspect-js/master/test/resources/import_c.htmlx">
  loading resource...
</article>
```

Beispiel f&uuml;r den Output per DataSource-URL. Wird nur eine URL angegeben,
wird die URL f&uuml;r Daten und Transformation daraus abgeleitet.

```html
<article output="{{'xml:/example/content'}}">
  loading resource...
</article>

<article output="xml:/example/content">
  loading resource...
</article>
```

Beispiel f&uuml;r den Output per DataSource-URL mit spezifischer Daten- und
Transformations-URL. Als Wert sind die Daten-URL (locator der XML-Datei) und
nachfolgend getrennt durch ein Leerzeichen die Transformations-URL (locator vom
XSLT-Template) angegeben.

```html
<article output="{{'xml:/example/data xslt:/example/style'}}">
  loading resource...
</article>

<article output="xml:/example/data xslt:/example/style">
  loading resource...
</article>
```

Beim Einf&uuml;gen von Inhalten aus der DataSource, wird der Typ von
JavaScript-Bl&ouml;cken automatisch in `composite/javascript` ge&auml;ndert und
erst durch den Renderer ausgef&uuml;hrt. So wird gew&auml;hrleistet, dass das
JavaScript ggf. abh&auml;ngig vom umschliessenden condition-Attribut
ausgef&uuml;hrt wird.


### release

Inverser Indikator daf&uuml;r, dass ein Element gerendert wurde. Der Renderer
entfernt dieses Attribut, wenn ein HTML-Element gerendert wurde. Dieser Effekt
kann f&uuml;r CSS verwendet werden, um HTML-Elemente nur im gerenderten Zustand
anzuzeigen. Eine entsprechende CSS-Regel wird dem HEAD automatisch mit dem Laden
der Seite hinzugef&uuml;gt. 

```html
<span release>{{'Show me after rendering.'}}</span>
```


### render

Das Attribut erfordert die Kombination mit dem Attribut [events](#events).
Zusammen definieren sie, welche Ziele mit welchen auftretenden [Ereignissen](
    https://www.w3.org/TR/DOM-Level-3-Events) vom Renderer aufgefrischt werden.
Als Wert werden ein oder mehrere durch Leerzeichen getrennte CSS- bzw.
Query-Selectoren erwartet, welche die Ziele festlegen.

```javascript
const Model = {
    _status1: 0,
    getStatus1() {
        return ++Model._status1;
    },
    _status2: 0,
    getStatus2() {
        return ++Model._status2;
    },
    _status3: 0,
    getStatus3() {
        return ++Model._status3;
    }
};
```

```html
Target #1:
<span id="outputText1">{{Model.status1}}</span>
Events: Wheel
<input id="text1" type="text"
    events="wheel"
    render="#outputText1, #outputText2, #outputText3"/>

Target #2:
<span id="outputText2">{{Model.status2}}</span>
Events: MouseDown KeyDown
<input id="text1" type="text"
    events="mousedown keydown"
    render="#outputText2, #outputText3"/>

Target #3:
<span id="outputText3">{{Model.status3}}</span>
Events: MouseUp KeyUp
<input id="text1" type="text"
    events="mouseup keyup"
    render="#outputText3"/> 
```

Das Beispiel enth&auml;lt 3 Eingabefelder mit unterschiedlichen Ereignissen
(`events`) und Zielen (`render`), die jeweils hochz&auml;hlende Textausgaben
darstellen und auf entsprechende Ereignisse reagieren.

__Alternativ kann auch das [reaktive Rendering](reactive.md) verwendet werden,
wo &Auml;nderungen in den Datenobjekten eine partielle Aktualisierung der View
ausl&ouml;sen.__


### strict

Das Attribut ist mit den Attributen [composite](#composite) und [validate](
    #validate) kombinierbar.

In Kombination mit dem Attribut [composite](#composite) legt es fest, dass beim
Laden der Ressourcen (JS, CSS, HTML) zu einer Komponente, der Dateiname in der
originalen Schreibweise verwendet wird. Das Standardverhalten ohne das Attribut
[strict](#strict) verwendet die Composite-Id mit einem Kleinbuchstaben am
Anfang.

Beispiel zum Standardverhalten:
```html
<div id="SmallExample" composite>
```
```
+ modules
  - smallExample.css
  - smallExample.js
  - smallExample.html
- index.html
```

Beispiel mit dem Attribut [strict](#strict):
```html
<div id="SmallExample" composite strict>
```
```
+ modules
  - SmallExample.css
  - SmallExample.js
  - SmallExample.html
- index.html
```

Die Kombination mit dem Attribut [validate](#validate) beeinflusst das
Synchronisieren der Daten so, dass die Synchronisation nur ausgef&uuml;hrt wird,
wenn die Validierung explizit true zur&uuml;ckgibt. In allen anderen F&auml;llen
wird der Wert nicht synchronisiert. Womit im zu synchronisierenden Ziel nach
einer Benutzereingabe nur zul&auml;ssige Werte vorhanden sind, was z.B. bei
einem als erforderlich (required) deklarierten Eingabefeld beachtet werden muss,
wenn der Benutzer die Eingabe zeichenweise l&ouml;scht. So bleibt in diesem
konstruierten Beispiel das letzte Zeichen im zu synchronisierenden Ziel
erhalten.

```javascript
const Model = {
    validate(element, value) {
        return !!value.trim();
    },
    text1: ""
};
```

```html
<form id="Model" composite>
  <input id="text1" type="text"
      validate strict events="input change"/>
  <input type="submit" value="submit"
      validate events="click"/>
</form>
```


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

Die Synchronisation und das Standard-Verhalten (action) vom Browser werden durch
die Validierung direkt beeinflusst, die dazu vier Zust&auml;nde als
R&uuml;ckgabewert nutzen kann: `true`, `not true`, `text`, `undefined/void`.


#### true

Die Validierung war erfolgreich. Es wird kein Fehler angezeigt und das
Standard-Verhalten (action) vom Browser wird verwendet. Wenn m&ouml;glich wird
der Wert mit dem Modell synchronisiert.


#### not true and not undefined/void

Die Validierung ist fehlgeschlagen und es wird ein Fehler angezeigt. Der
R&uuml;ckgabewert gibt an, dass das Standard-Verhalten (action) vom Browser
nicht ausgef&uuml;hrt werden soll und somit blockiert wird. Bei Kombination mit
dem Attribut [strict](#strict), wird ein m&ouml;glicher Wert nicht mit dem
Modell synchronisiert.


#### text

Die Validierung ist mit einer Fehlermeldung fehlgeschlagen. Sollte die
Fehlermeldung leer sein, wird alternativ die Meldung vom message-Attribut
verwendet. Bei Kombination mit dem Attribut [strict](#strict), wird ein
m&ouml;glicher Wert nicht mit dem Modell synchronisiert.


#### undefined/void

Die Validierung ist fehlgeschlagen und es wird ein Fehler angezeigt. Ohne einen
R&uuml;ckgabewert wird das Standard-Verhalten (action) vom Browser
ausgef&uuml;hrt. Dieses Verhalten ist z.B. f&uuml;r die Validierung von
Eingabefeldern wichtig, damit die Eingabe zur Benutzeroberfl&auml;che gelangt.
Bei Kombination mit dem Attribut [strict](#strict), wird ein m&ouml;glicher Wert
nicht mit dem Modell synchronisiert.

Eine allgemeine Strategie oder Standard-Implementierung zur Fehlerausgabe wird
bewusst nicht bereitgestellt, da diese in den meisten F&auml;llen zu starr ist
und mit geringem Aufwand als zentrale L&ouml;sung individuell implementiert
werden kann.

```css
input[type='text']:not([title]) {
    background:#EEEEFF;
    border-color:#7777AA;
}
input[type='text'][title=''] {
    background:#EEFFEE;
    border-color:#77AA77;
}
input[type='text'][title]:not([title='']) {
    background:#FFEEEE;
    border-color:#AA7777;
}
```

```javascript
const Model = {
    validate(element, value) {
        const PATTER_EMAIL_SIMPLE = /^\w+([\w\.\-]*\w)*@\w+([\w\.\-]*\w{2,})$/;
        const test = PATTER_EMAIL_SIMPLE.test(value);
        return test || ("Invalid " + element.getAttribute("placeholder"));
    },
    text1: ""
};
```

```html
<form id="Model" composite>
  <input id="text1" type="text" placeholder="e-mail address"
      validate events="input change" render="#Model"/>
  Model.text1: {{Model.text1}}
  <input type="submit" value="submit" validate events="click"/>
</form>
```

In dem Beispiel erwartet das Eingabefeld eine E-Mail-Adresse. Der Wert wird
fortlaufend bei der Eingabe &uuml;berpr&uuml;ft und bei einem ung&uuml;ltigen
Wert wird eine Fehlermeldung in das Attribut `title` geschrieben, bzw. bei einem
g&uuml;ltigen Wert wird der Inhalt vom Attribut `title` gel&ouml;scht. Unterhalb
vom Eingabefeld ist die Kontrollausgabe vom korrespondierenden Feld im
JavaScript-Objekt (Model). Ohne das Attribut [strict](#strict) wird das Feld
fortlaufend mit der Eingabe synchronisiert.


## @-Attribute

Expressions werden erst nach dem Laden der Seite durch den Renderer
aufgel&ouml;st. Bei einigen HTML-Elementen kann das st&ouml;rend sein, wenn die
Attribute bereits durch den Browser interpretiert werden. So z.B. das
src-Attribute bei Ressourcen wie dem img-Tag. F&uuml;r diese F&auml;lle lassen
sich @-Attribute nutzen. Diese funktionieren wie Templates f&uuml;r Attribute.
Der Renderer wird deren Wert aufl&ouml;sen und dann die gleichnamigen Attribute
zum Element hinzuf&uuml;gen. Danach verhalten sich diese wie alle anderen
Attribute, inkl. dem Aktualisieren durch den Renderer, wenn die Attribute
Expressions beinhalten.

```html
<img @src="{{...}}"/>
```


## Expression Language

Die Expression Language kann ab dem HTML-Element `BODY` im kompletten Markup als
Freitext, sowie in allen Attributen verwendet werden. Ausgenommen sind die
HTML-Elemente `STYLE` und `SCRIPT`, deren Inhalt von der Expression Language
nicht unterst&uuml;tzt wird. Bei der Verwendung als Freitext wird als Ausgabe
reiner Text (plain text) erzeugt. Das Hinzuf&uuml;gen von Markup, insbesondere
HTML-Code, ist so nicht m&ouml;glich und wird nur mit den Attributen `output`
und `import` unterst&uuml;tzt.

```html
<article title="{{Model.title}}">
  {{'Hello World!'}}
  ...
</article>
```

Details zu Syntax und Verwendung werden im Abschnitt
[Expression Language](expression.md) beschrieben.


## Scripting

Eingebettetes Scripting bringt einige Besonderheiten mit sich. Das
Standard-Scripting wird vom Browser automatisch und unabh&auml;ngig vom
Rendering ausgef&uuml;hrt. Daher wurde das Markup f&uuml;r das Rendering um den
zus&auml;tzlichen Skript-Typ `composite/javascript` erweitert, der das normale
JavaScript verwendet, im Vergleich zum Typ `text/javascript` vom Browser aber
nicht erkannt und somit nicht direkt ausgef&uuml;hrt wird. Der Renderer hingegen
erkennt den JavaScript-Code und f&uuml;hrt diesen mit jedem relevanten
Renderzyklus aus. Auf diese Weise kann die Ausf&uuml;hrung vom SCRIPT-Element
auch mit dem Attribut `condition` kombiniert werden.

```html
<script type="composite/javascript">
    ...
</script>
```

Details zur Verwendung vom Composite-JavaScript inkl. Modulen wird im Abschnitt
[Scripting](scripting.md) beschrieben.


## Customizing


### Tag

Benutzerdefinierte HTML-Elemente (Tags) &uuml;bernehmen das komplette Rendering
in Eigenverantwortung. Der R&uuml;ckgabewert bestimmt, ob die Standardfunktionen
des Renderers verwendet werden oder nicht. Nur der R&uuml;ckgabewert `false`
(nicht void, nicht leer) beendet das Rendering f&uuml;r ein benutzerdefiniertes
HTML-Element, ohne die Standardfunktionen des Renderers zu verwenden.

```javascript
Composite.customize("foo", function(element) {
    ...
});
```

```html
<article>
  <foo/>
</article>
```

### Selector

Selektoren funktionieren &auml;hnlich wie benutzerdefinierte Tags. Im Vergleich
zu diesen, verwenden Selektoren einen CSS-Selektor um Elemente zu erkennen.
Dieser Selektor muss das Element aus Sicht des &uuml;bergeordneten
Eltern-Elements ansprechen. Selektoren sind flexibler und multifunktionaler. Auf
diese Art k&ouml;nnen verschiedene Selektoren mit unterschiedlichen Funktionen
f&uuml;r ein Element zutreffen.

Selectoren werden nach der Reihenfolge ihrer Registrierung iterativ durchlaufen
und deren Callback-Methoden ausgef&uuml;hrt. Der R&uuml;ckgabewert der
Callback-Methode bestimmt dabei, ob die Iteration abgebrochen wird oder nicht.
Nur der R&uuml;ckgabewert `false` (nicht void, nicht leer) beendet die Iteration
&uuml;ber andere Selektoren und das Rendering f&uuml;r den Selektor wird ohne
Verwendung der Standardfunktionen beendet.

```javascript
Composite.customize("a:not([href])", function(element) {
    ...
});

Composite.customize("a.foo", function(element) {
    ...
});
```

```html
<article>
  <a class="foo"></a>
</article>
```

### Acceptor

Acceptors sind eine besondere Art der Anpassung vom Rendering. Im Vergleich zu
den anderen M&ouml;glichkeiten, geht es hier um die Manipulation von Elementen
vor dem Rendering. Dies erm&ouml;glicht individuelle &Auml;nderungen an
Attributen und/oder dem Markup, bevor der Renderer sie verarbeitet. Damit hat
ein Acceptor keinen Einfluss auf die Implementierung vom Rendering.

```javascript
Composite.customize(function(element) {
    ...
});
```

## H&auml;rtung

In Seanox aspect-js ist eine H&auml;rtung vom Markup vorgesehen, was die
Manipulation vom Markup zur Laufzeit erschwert. Zum einen wird mit einer
Condition ausgeblendetes Markup physisch aus dem DOM entfernt und zum anderen
&uuml;berwacht der Renderer Manipulationen an Attributen zur Laufzeit. Diese
&Uuml;berwachung basiert auf einem Filter mit statischen Attributen. Statische
Attribute werden mit dem Anlegen eines Elements im DOM gelesen und bei
Manipulation (L&ouml;schen / &Auml;ndern) wieder hergestellt.

Zur Konfiguration statischer Attribute wird die Methode
`Composite.customize(...)` mit dem Parameter `@ATTRIBUTES-STATICS` verwendet.
Die Konfiguration kann mehrfach erfolgen. Die einzelnen statischen Attribute
werden dann zusammengefasst. Dabei sind alle @-Parameter unabh&auml;ngig von der
Gross- und Kleinschreibung.

```javascript
Composite.customize("@ATTRIBUTES-STATICS", "action name src type");
Composite.customize("@Attributes-Statics", "required");
Composite.customize("@attributes-statics", "method action");
...
```

```html
<form method="POST" action="/service">
  <input type="user" name="user"
  <input type="password" name="password"/>
  <input type="submit"/>
</form>
```


- - -

[Expression Language](expression.md) | [Inhalt](README.md#markup) | [Scripting](scripting.md)
