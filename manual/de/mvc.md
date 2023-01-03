[Resource Bundle](message.md) | [Inhalt](README.md#model-view-controller) | [Komponenten](composite.md)
- - -

# Model View Controller

Der Model View Controller (MVC) ist ein Entwurfsmuster zur Trennung von
Interaktion, Daten und Darstellung. Hier muss zwischen I/O-Controller und
Applikations-Controller unterschieden werden. Das reine MVC-Entwurfsmuster meint
den I/O-Controller zur &Uuml;bermittlung der Interaktionen. Da dieser durch
Betriebssystem und Browser bereitgestellt wird, bezieht sich der Controller in
Seanox aspect-js vordergr&uuml;ndig auf den Applikations-Controller.

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


## Controller

Der (Applikations-)Controller steuert Abl&auml;ufe innerhalb einer Applikation
(Face-Flow) und das Binding von Markup und JavaScript sowie die Steuerung vom
Datenfluss zwischen View und Model was durch die Zusammenarbeit von Composite,
Paths und SiteMap &uuml;bernommen wird. Womit hier auch von MVVM (Model View
ViewModel) und MVCS (Model View Controller Service) gesprochen werden kann.


## Model

Das Modell ist ein darstellbares/projezierbares Objekt. Es empf&auml;ngt
(Status)&Auml;nderungen und Interaktionen der View, die durch den Controller
&uuml;bermittelt werden, bzw. bietet der View eine Schnittstelle zu Daten sowie
Funktionen und Diensten der Middelware. Das Modell dient vorrangig der View zur
Darstellung und Verwaltung der Zust&auml;nde, f&uuml;r fachliche
Funktionalit&auml;t nimmt es weitere Komponenten in Anspruch.

In Seanox aspect-js werden Modelle durch statische JavaScript-Objekte
repr&auml;sentiert, die vergleichbar mit Managed Beans als Singletons / Facades
/ Delegates genutzt werden, so dass dieses intern weitere Komponenten und
Abstraktion verwenden k&ouml;nnen.


## View

Die View ist ausschliesslich f&uuml;r die Darstellung bzw. Projektion eines
Modells verantwortlich. Wobei Projektion ist ein wichtiger Begriff ist, da die
Art der Darstellung eines Modells nicht eingeschr&auml;nkt ist.  

In Seanox aspect-js werden die Views durch das Markup repr&auml;sentiert.


## Inhalt

* [Controller](#controller)
* [Model](#model)
* [View](#view)
* [SiteMap](#sitemap)
  * [Begriffe](#begriffe)
    * [Page](#page)
    * [Face](#face)
    * [Facets](#facets)
    * [Face Flow](#face-flow)
  * [Konfiguration](#konfiguration)
    * [Face Flow](#face-flow-1)
    * [Permissions](#permissions)
    * [Acceptors](#acceptors)
  * [Navigation](#navigation)
  * [Permission Concept](#permission-concept)
  * [Acceptors](#acceptors)
* [Virtual Paths](#virtual-paths)
  * [Root Path](#root-path)
  * [Relative Path](#relative-path)
  * [Absolute Path](#absolute-path)
  * [Variable Path](#variable-path)
  * [Functional Path](#functional-path)
* [Object/Model-Binding](#object-model-binding)
  * [Begriffe](#begriffe)
    * [namespace](#namespace)
    * [scope](#scope)
    * [model](#model)
    * [property](#property)
    * [qualifier](#qualifier)
    * [composite](#composite)
    * [composite-id](#composite-id)
  * [Binding](#binding)
  * [Dock](#dock)
  * [Undock](#undock)
  * [Synchronization](#synchronization)
  * [Validation](#validation)
  * [Events](#events)


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


### Begriffe


#### Page

In einer Single-Page-Application bildet die Page den elementaren Rahmen und die
Laufzeitumgebung der gesamten Anwendung.


#### Face

Ein Face ist die prim&auml;re Projektion von Modellen/Komponenten/Inhalten. Diese
Projektion kann zus&auml;tzliche Unterstrukturen in Form von Facets und Sub-Faces
enthalten.  
Faces sind Komponenten, die verschachtelt werden k&ouml;nnen.  
So werden &uuml;bergeordneten Faces zu partiellen Faces, wenn sich der Pfad auf ein
Sub-Face bezieht.
Ein Sub-Face wird mit allen seinen &uuml;bergeordneten Faces angezeigt. Wenn die
&uuml;bergeordneten Faces zus&auml;tzliche Facets enthalten, werden diese Facets nicht
angezeigt. Die &uuml;bergeordneten Faces werden dann nur teilweise/partiell
dargestellt.


#### Facets

Facets sind Teile eines Faces (Projektion) und sind in der Regel keine
eigenst&auml;ndige Ansicht. So k&ouml;nnen z.B. bei einem Such-Formular die Eingabemaske
und die Ergebnistabelle separate Facets eines Faces sein, ebenso wie Article 
und/oder Section in einem Face. Sowohl Face als auch Facets sind &uuml;ber virtuelle
Pfade erreichbar. Der Pfad zu Facets bewirkt, dass das umschliessende Face mit
allen seinen &uuml;bergeordneten Faces angezeigt wird.


#### Face Flow

Face-Flow beschreibt die Zugriffssteuerung und die Visualisierung von Ansichten.  
Die SiteMap stellt daf&uuml;r Schnittstellen f&uuml;r Berechtigungskonzepte und Akzeptoren
zur Verf&uuml;gung, mit denen der Face-Flow kontrolliert und beeinflusst werden kann.
Auf diese Weise kann der Zugriff auf Pfade/Ansichten mit eigener Logik gestoppt
und/oder umgeleitet bzw. weitergeleitet werden.


### Konfiguration

F&uuml;r die Konfiguration der SiteMap wird die Methode `SiteMap.customize(....)`
verwendet. Mit dieser Methode ist es m&ouml;glich, den Face-Flow (Pfade, Faces,
Facets) sowie die Berechtigungen zu definieren und Akzeptoren zu registrieren,
wof&uuml;r die die Methode unterschiedliche Signaturen bereitstellt.  

Die Konfiguration kann mehrfach aufgerufen werden, auch zur Laufzeit. Die
SiteMap sammelt alle Konfigurationen kumulativ. Alle Pfade, Faces und Facets
werden zusammengefasst, Akzeptoren und permit-Methoden in der Reihenfolge ihrer
Registrierung gesammelt. Da die Konfiguration immer einen kumulativen Zustand
verwendet, ist es sp&auml;ter nicht nachvollziehbar, wie die Konfiguration erstellt
wurde.

Die Konfiguration der SiteMap greift nur, wenn ein fehlerfreies Meta-Objekt
&uuml;bergeben wird und keine Fehler bei der Verarbeitung auftreten.


#### Face Flow

Die Konfiguration basiert auf einem Meta-Objekt, das an die Methode
`SiteMap.customize({meta})` &uuml;bergeben wird.  
Die Schl&uuml;ssel (string) entsprechen den Pfaden und ein Pfad hat immer ein
existierendes Face als Ziel, Teilpfade ohne Face werden ignoriert. Die Werte
sind Arrays mit den g&uuml;ltigen Facets f&uuml;r einen Pfad/Face. Facets ben&ouml;tigen keinen
eigenen Pfad, da diese automatisch abgeleitet/erstellt werden.

```javascript
SiteMap.customize({...});
```

```javascript
const map = {
    "#": ["news", "products", "about", "contact", "legal"],
    "#products#papers": ["paperA4", "paperA5", "paperA6"],
    "#products#envelope": ["envelopeA4", "envelopeA5", "envelopeA6"],
    "#products#pens": ["pencil", "ballpoint", "stylograph"],
    "#legal": ["terms", "privacy"],
    ...
};

SiteMap.customize(map);
```

Oder etwas k&uuml;rzer als direkter Aufruf der Customize-Methode:

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

__Die Navigation akzeptiert nur Pfade, die im Face-Flow definiert sind.__
__Ung&uuml;ltige Pfade werden basierend auf dem angeforderten Pfad zum n&auml;chst__
__h&ouml;heren bekannten/berechtigten Pfad weitergeleitet.__

__Ohne Face-Flow gibt es keine g&uuml;ltigen Pfade. Werden eine Benutzeroberfl&auml;che__
__oder Komponenten ohne Face-Flow verwendet, m&uuml;ssen diese als statisch__
__gekennzeichnet werden, da die Komponenten sonst ausgeblendet (aus dem DOM__
__entfernt) werden.__

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
zusammen mit dem Face-Flow-Meta-Objekt &uuml;bergeben werden.

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
entscheiden, was mit dem Pfad passiert. Von jeder permit-Methode werden folgende
R&uuml;ckgabewerte erwartet:

__True__ Die Validierung ist erfolgreich und die Iteration &uuml;ber weitere
permit-Methoden wird fortgesetzt. Wenn alle permit-Methoden wahr sind und damit
den Pfad best&auml;tigen, wird er verwendet.

__String__ Die Validierung (Iteration &uuml;ber weitere permit-Merhoden) wird
abgebrochen und es folgt einen Weiterleitung an die zur&uuml;ckgegebene Zeichenkette. 

__Otherwise__ Der Pfad gilt als ung&uuml;ltig/unautorisiert, die Validierung
(Iteration &uuml;ber weitere permit-Merhoden) wird abgebrochen und an den
urspr&uuml;nglichen Pfad weitergeleitet.


#### Acceptors

Akzeptoren arbeiten &auml;hnlich wie die permit-Methoden.  
Im Unterschied dazu werden die Methoden der Akzeptoren nur bei den Pfaden
aufgerufen, deren RegExp-Muster dem angefragten Pfad entsprechen. Auch von den
Methoden der Akzeptoren werden die gleiche Arten von R&uuml;ckgabewerte wie bei den
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

Die Navigation kann durch &Auml;nderung des URL-Hash im Browser (direkte Eingabe),
durch Verwendung von Hash-Links und in JavaScript mit `window.location.hash`,
`window.location.href`, `SiteMap.navigate(path)` und
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

Im Unterschied zur navigate-Methode wird die Weiterleitung direkt ausgef&uuml;hrt,
anstatt eine asynchrone Weiterleitung durch &Auml;nderung des Location-Hashes
auszul&ouml;sen.

Relative Pfade ohne Hash am Anfang sind m&ouml;glich, funktionieren aber nur mit
`SiteMap.navigate(path)`.

```javascript
SiteMap.navigate("x#y#z");
```


### Permission Concept

Das Berechtigungskonzept basiert auf permit-Methoden, die als Callback-Methoden
mit der Konfiguration des Face-Flows definiert werden. Es k&ouml;nnen mehrere
permit-Methoden definiert werden, die mit jedem angeforderten Pfad &uuml;berpr&uuml;ft
werden. Nur wenn alle permit-Methoden den angeforderten Pfad mit "wahr"
best&auml;tigen, wird er verwendet und der Renderer macht die abh&auml;ngigen Faces und
Facets sichtbar.
 
Details werden im Abschnitt [Permissions](#permissions) beschrieben.


### Acceptors

Akzeptoren werden zusammen mit dem Berechtigungskonzept ausgef&uuml;hrt.  
Sie haben die gleiche Wirkung, betreffen aber nur Pfade, die einem regul&auml;ren
Ausdruck entsprechen. Akzeptoren k&ouml;nnen zur Best&auml;tigung von Berechtigungen
und/oder f&uuml;r versteckte Hintergrundaktivit&auml;ten verwendet werden.  

Details werden im Abschnitt [Acceptors](#acceptors) beschrieben.


## Virtual Paths

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
das Hash-Zeichen verwendet. Leerzeichen werden nicht unterst&uuml;tzt.

```
#a#b#c#d
```

Pfade verwenden nur Kleinbuchstaben. Grossbuchstaben werden beim Normalisieren
automatisch durch Kleinbuchstaben ersetzt.

```
#a#b#c#d == #A#b#C#d
```

Zwischen den Pfadsegmenten kann das Hash-Zeichen (`#`) auch als R&uuml;ck- /
Eltern-Sprunganweisung verwendet werden. Die Weite vom R&uuml;cksprung entspricht
dann der Anzahl der zus&auml;tzlichen Hash-Zeichen.

```
#a#b#c#d##x   -> #a#b#c#x
#a#b#c#d###x  -> #a#b#x
#a#b#c#d####x -> #a#x
```

Die Navigation kann durch &Auml;nderung des URL-Hash im Browser (direkte Eingabe),
durch Verwendung von Hash-Links und in JavaScript mit `window.location.hash`,
`window.location.href`, `SiteMap.navigate(path)` und
`SiteMap.forward(path)`. erfolgen.

Es gibt verschiedene Arten von Pfaden, die im Folgenden erl&auml;utert werden.


### Root Path

Diese Pfade sind leer oder enthalten nur ein Hash-Zeichen.

```html
<a href="#">Back to the root</a>
```


### Relative Path

Diese Pfade beginnen ohne Hash oder mit zwei oder mehr Hash-Zeichen (`##+`)
und sind relativ zum aktuellen Pfad.
  
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

Diese Pfade beginnen mit einem Hash-Zeichen.
Alle Pfade werden ausgeglichen, d.h. die Direktiven mit mehreren Hash-Zeichen
werden aufgel&ouml;st.

```html
<a href="#">Back to the root</a>
<a href="#a#b#c">Back to the root + a + b + c</a>
```


### Variable Path

Variable Pfade sind eine Abbildung (Mapping) von virtuellen auf physische Pfade.  
Die Erkl&auml;rung klingt im Kontext der SiteMap und derer virtueller Pfade etwas
verwirrend und meint hier eine weitere zus&auml;tzliche virtuelle Abbildung von
Pfaden innerhalb der SiteMap.  
Dabei bildet ein Pfad der SiteMap ein festes Ziel, welches Face und Facet sein
k&ouml;nnen. Der Pfad kann nun beliebig erweitert werden ohne dass sich das Ziel
&auml;ndert. Das Ziel kann den erweiterten Pfad dann z.B. zur Parameter&uuml;bergabe
nutzen, was vergleichbar mit PATH_TRANSLATED und PATH_INFO im CGI ist. 

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
k&ouml;nnen somit beliebig erweitert werden. Das Ziel ist in beiden F&auml;llen fest und
die Anfragen werden von `#contact` bzw. `#project` verarbeitet.  
Die Erweitertung vom Pfad kann mit der Methode `SiteMap.lookup(path)`
ermittelt werden. Das zur&uuml;ckgegebene Meta-Objekt enth&auml;lt bei variablen Pfaden
mit erweiterten Pfaden diesen im data-Property. 

```
SiteMap.lookup("#contact#support");
    returns {path:"#contact#support", face:"#", facet:"contact", data:"#support"}
  
SiteMap.lookup("#project#a#b#c");
    returns {path:"#contact#support", face:"#project", facet:"", data:"#a#b#c"}
```


### Functional Path

Der Pfad besteht aus drei oder mehr Hash-Zeichen (`###+`) und ist nur
tempor&auml;r, er dient einem Funktionsaufruf, ohne den aktuellen Pfad (URL-Hash) zu
&auml;ndern.  
Dies ist n&uuml;tzlich f&uuml;r funktionale Links, z.B. um ein Popup zu &ouml;ffnen oder eine
Mail im Hintergrund zu senden.

```html
<a href="###">Do something, the logic is in the model</a>
```


## Object/Model-Binding

Bei der Objekt-Bindung geht es darum, HTML-Elemente mit entsprechenden
Modell-Objekten zu verkn&uuml;pfen, die im JavaScript existieren.

Das Object/Model-Binding geh&ouml;rt ebenfalls zum Model View Controller und ist in
Seanox aspect-js in der Composite-API implementiert, auf der SiteMap als
Erweiterung und basiert.  
Zum besseren Verst&auml;ndnis ist die Funktionalit&auml;t hier im Model View Controller
beschrieben.


### Begriffe


#### namespace

Vergleichbar mit Paketen in anderen Programmiersprachen k&ouml;nnen Namensr&auml;ume zur
Abbildung hierarchischer Strukturen und zur Gruppierung thematisch verwandter
Komponenten und Ressourcen genutzt werden.  
Die Implementierung erfolgt in JavaScript auf Objektebene.  
Das heisst, es ist kein reales Element der Programmiersprache, sondern wird
durch das Verketten statischer Objekte abgebildet.  
Jede Ebene in dieser Objektkette repr&auml;sentiert einen Namensraum.  
Wie f&uuml;r die Bezeichner von Objekten typisch, verwenden auch Namensr&auml;ume
Buchstaben, Zahlen und Unterstriche, die durch Punkte getrennt werden. Als
Besonderheit werden auch Arrays unterst&uuml;tzt. Wenn eine Objektebene im Namensraum
eine reine Zahl ist, wird ein Array angenommen.

Das Object/Model-Binding basiert auf den IDs der Composites und deren Position
und Reihenfolge im DOM.  
Die Wurzel vom Namensraum bildet immer eine Composite-ID.  
Der Namensraum kann dabei absolut sein, also der Namensraum entspricht einer
Composite-ID, oder er basiert auf dem Namensraum einer im DOM &uuml;bergeordneten
Composite-ID.

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


#### scope

Der Scope basiert auf dem Namensraum und stellt diesen auf der Objektebene dar.  
Das heisst, der Namensraum ist der Beschreibungstext, der Scope ist das Objekt,
wenn der Namensraum im Objektbaum aufgel&ouml;st wurde.


#### model

Das Modell (Modell-Komponente / Komponente) ist ein statisches JavaScript-Objekt
in einem beliebigen Namensraum und stellt die Logik f&uuml;r die
Benutzerschnittstelle (UI-Komponente) und den &Uuml;bergang von der
Benutzerschnittstelle zur Gesch&auml;ftslogik und/oder zum Backend zur Verf&uuml;gung.  
Die Verkn&uuml;pfung bzw. Bindung von Markup und JavaScript-Model erfolgt &uuml;ber die
Composite-API. Dazu muss ein HTML-Element eine g&uuml;ltige und eindeutige ID haben.
Die ID muss die Anforderungen des Namensraums erf&uuml;llen.

Details werden im Abschnitt [Binding](#binding) beschrieben.

Die Composite-API erkennt die Existenz der Modell-Komponenten im DOM, bzw. deren
Abwesenheit. So kann das Modell der Komponente &uuml;ber die statischen Methoden
`dock` und `undock` informiert werden, wenn die Komponente dem DOM hinzugef&uuml;gt
bzw. aus diesem entfernt wird, womit sich das Modell vorbereiten bzw.
finalisieren l&auml;sst.  
Die Implementierung beider Methoden ist optional.

```javascript
const model = {
    dock() {
    },
    undock() {
    }
};
```


#### property

Referenziert ein Element mit einer ID innerhalb vom DOM eines Composites und die
korrespondierende Eigenschaft im Modell. Die Elemente der Properties nutzen
einen relativen Bezeichner (ID). Der Namensraum basiert auf dem vom Composite
und erweitert sich um ggf. weitere &uuml;bergeordnete Elemente mit IDs im DOM.

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


#### qualifier

In einigen F&auml;llen ist ein Bezeichner (ID) nicht eindeutig. Zum Beispiel wenn 
Eigenschaften Arrays sind oder eine Iteration verwendet wird. In diesen F&auml;llen
kann der Bezeichner durch einen zus&auml;tzlichen eindeutigen Qualifier, getrennt
durch einen Doppelpunkt, erweitert werden.  
Qualifier wirken beim Object/Model-Binding wie Properties und verl&auml;ngern den
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


#### composite

Composite ist ein Konstrukt aus Markup, JavaScript-Model, CSS und eventuell
weiteren Ressourcen. Es beschreibt eine Komponente/Modul ohne direkten Bezug auf
die Darstellung.


#### composite-id

Die Composite-ID ist ein anwendungsweit eindeutiger Bezeichner.  
Sie ist eine Zeichenfolge, die aus Buchstaben, Zahlen und Unterstrichen besteht
und optional auch das Minus-Zeichen unterst&uuml;tzt, wenn es nicht am Anfang oder am
Ende benutzt wird.  
Eine Composite-ID ist mindestens ein Zeichen lang und wird durch die Kombination
der Attribute `ID` und `Composite` gebildet.

```html
<html>
  <body>
    <form id="model" composite>
      ...
    </form>
  </body>
</html>
```

Die Composite-ID wird beim MVC, Object/Model-Binding sowie zur Synchronisation
und Validierung ben&ouml;tigt und muss daher eine g&uuml;ltige und eindeutige Zeichenfolge
innerhalb des JavaScript-Namensraums sein. Der Bezeichner wird auch f&uuml;r den
Face-Flow verwendet, um Faces und Facets sowie allgemein Modelle/Komponenten zu
identifizieren und zu kontrollieren.


### Binding

In Seanox Aspect-js werden Komponenten auch Composites oder Module genannt, da
diese aus Markup (View), korrespondierendem JavaScript (Model) und mehr
bestehen.  

Beim Object/Model-Binding geht es um die Verbindung von View/Markup/HTML mit dem
entsprechenden JavaScript-Model.  
Das Binding leitet Interaktionen und Status&auml;nderungen der View an das Model
weiter und stellt eine Schnittstelle f&uuml;r Middleware-Funktionen und Services
f&uuml;r die View bereit. Womit keine manuelle Implementierung und Deklaration von
Ereignissen sowie die Synchronisation und Interaktion zwischen UI und
Anwendungslogik erforderlich ist.

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

Die Bindung basiert auf den IDs der HTML-Elemente im Markup (View). Diese IDs
definieren den Namensraum und das zu verwendende JavaScript-Model. IDs k&ouml;nnen
relative und absolute Namensr&auml;ume verwenden, basieren aber prim&auml;r auf der
Position eines Elements im DOM und einer korrespondierenden Objektstruktur als
JavaScript-Model.


### Dock

Wenn ein Composite im DOM verwendet/eingef&uuml;gt wird, wird das entsprechende
JavaScript-Model angedockt/verkn&uuml;pft und beim Entfernen aus dem DOM
abgedockt/entkn&uuml;pft.  
In beiden F&auml;llen kann das Modell optional geeignete Methoden implementieren.  
Die Dock-Methode wird vor dem Rendern, vor dem Einf&uuml;gen des Composites in das
DOM oder nach dem Laden der Seite beim ersten Rendern ausgef&uuml;hrt und kann zur
Vorbereitung der Darstellung verwendet werden. Die Undock-Methode wird
ausgef&uuml;hrt, nachdem das Composite aus dem DOM entfernt wurde und kann zur
Nachbereitung bzw. Bereiningung der Darstellung verwendet werden.  

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

Bei einem Composite in Kombination mit einer Bedingung (condition) h&auml;ngt der
Aufruf der Methoden vom Ergebnis der Bedingung ab.


### Undock

Details werden im Abschnitt [Dock](#undock) beschrieben.


### Synchronization

Die Objekt-Bindung umfasst neben der statischen Verkn&uuml;pfung und Zuordnung von
HTML-Elementen (View) zum JavaScript-Model auch die Synchronisation von Werten
zwischen den HTML-Elementen und den Feldern im JavaScript-Model.  
Die Synchronisation h&auml;ngt von Ereignissen ab, die f&uuml;r das HTML-Element mit dem
Attribut `events` deklariert sind und wird nur ausgef&uuml;hrt, wenn eines der
definierten Ereignisse eintritt.

Details zur Funktionsweise werden im Abschnitt [events](markup.md#events)
beschrieben.


### Validation

Die Synchronisation der Werte zwischen den HTML-Elementen (View) und den Feldern
vom JavaScript-Model kann durch Validierung &uuml;berwacht und gesteuert werden.  
Die Validierung wird in HTML durch die Kombination der Attribute `validate` und
`events` deklariert und erfordert eine entsprechende Validierungsmethode im
JavaScript-Model.  

Details zur Funktionsweise werden im Abschnitt [validate](markup.md#validate)
beschrieben.


### Events

Ereignisse, genauer gesagt die Interaktion zwischen View und Modell, werden bei
der Object/Model-Binding ebenfalls ber&uuml;cksichtigt. Die Methoden zur Interaktion
werden nur im Model implementiert. Im Markup selbst ist keine Deklaration
erforderlich. Das Object/Model-Binding kennt die verf&uuml;gbaren Ereignisse im HTML
und so wird beim Binding das Model nach entsprechenden Methoden durchsucht, die
dann als Event-Listener registriert werden.

```javascript
const contact= {
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

[Resource Bundle](message.md) | [Inhalt](README.md#model-view-controller) | [Komponenten](composite.md)
