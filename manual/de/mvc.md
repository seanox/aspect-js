[Resource Bundle](messages.md) | [Inhalt](README.md#model-view-controller) | [Komponenten](composite.md)
- - -

# Model View Controller

Der Model View Controler (MVC) ist ein Entwurfsmuster zur Trennung von
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


## Controller

Hier muss zwischen I/O-Controller und Applikations-Controller unterschieden
werden. Das reine MVC-Entwurfsmuster meint den I/O-Controller zur Übermittlung
der Interaktionen. Da dieser durch Betriebssystem und Browser bereitgestellt
wird, bezieht sich der Controler in Seanox aspect-js vordergründig auf den
Applikations-Controller, der Abläufe innerhalb einer Applikation (Face-Flow)
steuert und das Binding von Markup und JavaScript sowie die Steuerung vom
Datenfluss zwischen View und Model übernimmt.  
In Seanox aspect-js ist der Controller die Zusammenarbeit von Composite, Paths
und SiteMap.


## Model

Das Modell ist ein darstellbares/projezierbares Objekt.  
Es empfängt (Status)Änderungen und Interaktionen der View, die durch den 
Controler übermittelt werden, bzw. bietet der View eine Schnittstelle zu Daten
sowie Funktionen und Diensten der Middelware. Das Modell dient vorrangig der
View zur Darstellung und Verwaltung der Zustände, für fachliche Funktionalität
nimmt es weitere Komponenten in Anspruch.    
In Seanox aspect-js werden die Modelle durch statische JavaScript-Objekte
repräsentiert. Konzeptionell ist die Implementierung der Entwurfsmuster Fassade
und Delegation angedacht, so dass die statischen Modelle intern weitere
Komponenten und Abstraktion verwenden.


## View

Die View ist ausschliesslich für die Darstellung bzw. Projektion eines Modells
verantwortlich.  
Projektion ist ein wichtiger Begriff, da die Art der Darstellung eines Modells
nicht eingeschränkt ist.  
In Seanox aspect-js werden die Views durch das Markup repräsentiert.


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
* [Object-/Model-Binding](#object-model-binding)
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


### Begriffe


#### Page

In einer Single-Page-Application bildet die Page den elementaren Rahmen und die
Laufzeitumgebung der gesamten Anwendung.


#### Face

Ein Face ist die primäre Projektion von Modellen/Komponenten/Inhalten. Diese
Projektion kann zusätzliche Unterstrukturen in Form von Facets und Sub-Faces
enthalten.  
Faces sind Komponenten, die verschachtelt werden können.  
So werden übergeordneten Faces zu partiellen Faces, wenn sich der Pfad auf ein
Sub-Face bezieht.
Ein Sub-Face wird mit allen seinen übergeordneten Faces angezeigt. Wenn die
übergeordneten Faces zusätzliche Facets enthalten, werden diese Facets nicht
angezeigt. Die übergeordneten Faces werden dann nur teilweise/partiell
dargestellt.


#### Facets

Facets sind Teile eines Faces (Projektion) und sind in der Regel keine
eigenständige Ansicht. So können z.B. bei einem Such-Formular die Eingabemaske
und die Ergebnistabelle separate Facets eines Faces sein, ebenso wie Article 
und/oder Section in einem Face. Sowohl Face als auch Facets sind über virtuelle
Pfade erreichbar. Der Pfad zu Facets bewirkt, dass das umschliessende Face mit
allen seinen übergeordneten Faces angezeigt wird.


#### Face Flow

Face-Flow beschreibt die Zugriffssteuerung und die Visualisierung von Ansichten.  
Die SiteMap stellt dafür Schnittstellen für Berechtigungskonzepte und Akzeptoren
zur Verfügung, mit denen der Face-Flow kontrolliert und beeinflusst werden kann.
Auf diese Weise kann der Zugriff auf Pfade/Ansichten mit eigener Logik gestoppt
und/oder umgeleitet bzw. weitergeleitet werden.


### Konfiguration

Für die Konfiguration der SiteMap wird die Methode `SiteMap.customize(....)`
verwendet. Mit dieser Methode ist es möglich, den Face-Flow (Pfade, Faces,
Facets) sowie die Berechtigungen zu definieren und Akzeptoren zu registrieren,
wofür die die Methode unterschiedliche Signaturen bereitstellt.  

Die Konfiguration kann mehrfach aufgerufen werden, auch zur Laufzeit. Die
SiteMap sammelt alle Konfigurationen kumulativ. Alle Pfade, Faces und Facets
werden zusammengefasst, Akzeptoren und permit-Methoden in der Reihenfolge ihrer
Registrierung gesammelt. Da die Konfiguration immer einen kumulativen Zustand
verwendet, ist es später nicht nachvollziehbar, wie die Konfiguration erstellt
wurde.

Die Konfiguration der SiteMap greift nur, wenn ein fehlerfreies Meta-Objekt
übergeben wird und keine Fehler bei der Verarbeitung auftreten.


#### Face Flow

Die Konfiguration basiert auf einem Meta-Objekt, das an die Methode
`SiteMap.customize({meta})` übergeben wird.  
Die Schlüssel (string) entsprechen den Pfaden und ein Pfad hat immer ein
existierendes Face als Ziel, Teilpfade ohne Face werden ignoriert. Die Werte
sind Arrays mit den gültigen Facets für einen Pfad/Face. Facets benötigen keinen
eigenen Pfad, da diese automatisch abgeleitet/erstellt werden.

```javascript
SiteMap.customize({...});
```

```javascript
var map = {
    "#": ["news", "products", "about", "contact", "legal"],
    "#products#papers": ["paperA4", "paperA5", "paperA6"],
    "#products#envelope": ["envelopeA4", "envelopeA5", "envelopeA6"],
    "#products#pens": ["pencil", "ballpoint", "stylograph"],
    "#legal": ["terms", "privacy"],
    ...
};

SiteMap.customize(map);
```

Oder etwas kürzer als direkter Aufruf der Customize-Methode:

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
__Ungültige Pfade werden basierend auf dem angeforderten Pfad zum nächst__
__höheren bekannten/berechtigten Pfad weitergeleitet.__

__Ohne Face-Flow gibt es keine gültigen Pfade. Werden eine Benutzeroberfläche__
__oder Komponenten ohne Face-Flow verwendet, müssen diese als statisch__
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
zusammen mit dem Face-Flow-Meta-Objekt übergeben werden.

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
Rückgabewerte erwartet:

__True__ Die Validierung ist erfolgreich und die Iteration über weitere
permit-Methoden wird fortgesetzt. Wenn alle permit-Methoden wahr sind und damit
den Pfad bestätigen, wird er verwendet.

__String__ Die Validierung (Iteration über weitere permit-Merhoden) wird
abgebrochen und es folgt einen Weiterleitung an die zurückgegebene Zeichenkette. 

__Otherwise__ Der Pfad gilt als ungültig/unautorisiert, die Validierung
(Iteration über weitere permit-Merhoden) wird abgebrochen und an den
ursprünglichen Pfad weitergeleitet.


#### Acceptors

Akzeptoren arbeiten ähnlich wie die permit-Methoden.  
Im Unterschied dazu werden die Methoden der Akzeptoren nur bei den Pfaden
aufgerufen, deren RegExp-Muster dem angefragten Pfad entsprechen. Auch von den
Methoden der Akzeptoren werden die gleiche Arten von Rückgabewerte wie bei den
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

Die Navigation kann durch Änderung des URL-Hash im Browser (direkte Eingabe),
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

Im Unterschied zur navigate-Methode wird die Weiterleitung direkt ausgeführt,
anstatt eine asynchrone Weiterleitung durch Änderung des Location-Hashes
auszulösen.

Relative Pfade ohne Hash am Anfang sind möglich, funktionieren aber nur mit
`SiteMap.navigate(path)`.

```javascript
SiteMap.navigate("x#y#z");
```


### Permission Concept

Das Berechtigungskonzept basiert auf permit-Methoden, die als Callback-Methoden
mit der Konfiguration des Face-Flows definiert werden. Es können mehrere
permit-Methoden definiert werden, die mit jedem angeforderten Pfad überprüft
werden. Nur wenn alle permit-Methoden den angeforderten Pfad mit "wahr"
bestätigen, wird er verwendet und der Renderer macht die abhängigen Faces und
Facets sichtbar.
 
Details werden im Abschnitt [Permissions](#permissions) beschrieben.


### Acceptors

Akzeptoren werden zusammen mit dem Berechtigungskonzept ausgeführt.  
Sie haben die gleiche Wirkung, betreffen aber nur Pfade, die einem regulären
Ausdruck entsprechen. Akzeptoren können zur Bestätigung von Berechtigungen
und/oder für versteckte Hintergrundaktivitäten verwendet werden.  

Details werden im Abschnitt [Acceptors](#acceptors) beschrieben.


## Virtual Paths

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
das Hash-Zeichen verwendet. Leerzeichen werden nicht unterstützt.

```
#a#b#c#d
```

Pfade verwenden nur Kleinbuchstaben. Grossbuchstaben werden beim Normalisieren
automatisch durch Kleinbuchstaben ersetzt.

```
#a#b#c#d == #A#b#C#d
```

Zwischen den Pfadsegmenten kann das Hash-Zeichen (`#`) auch als Rück- /
Eltern-Sprunganweisung verwendet werden. Die Weite vom Rücksprung entspricht
dann der Anzahl der zusätzlichen Hash-Zeichen.

```
#a#b#c#d##x   -> #a#b#c#x
#a#b#c#d###x  -> #a#b#x
#a#b#c#d####x -> #a#x
```

Die Navigation kann durch Änderung des URL-Hash im Browser (direkte Eingabe),
durch Verwendung von Hash-Links und in JavaScript mit `window.location.hash`,
`window.location.href`, `SiteMap.navigate(path)` und
`SiteMap.forward(path)`. erfolgen.

Es gibt verschiedene Arten von Pfaden, die im Folgenden erläutert werden.


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

Relative Pfade ohne Hash am Anfang sind möglich, funktionieren aber nur mit
`SiteMap.navigate(path)`.

```javascript
SiteMap.navigate("x#y#z");
```


### Absolute Path

Diese Pfade beginnen mit einem Hash-Zeichen.
Alle Pfade werden ausgeglichen, d.h. die Direktiven mit mehreren Hash-Zeichen
werden aufgelöst.

```html
<a href="#">Back to the root</a>
<a href="#a#b#c">Back to the root + a + b + c</a>
```


### Variable Path

Variable Pfade sind eine Abbildung (Mapping) von virtuellen auf physische Pfade.  
Die Erklärung klingt im Kontext der SiteMap und derer virtueller Pfade etwas
verwirrend und meint hier eine weitere zusätzliche virtuelle Abbildung von
Pfaden innerhalb der SiteMap.  
Dabei bildet ein Pfad der SiteMap ein festes Ziel, welches Face und Facet sein
können. Der Pfad kann nun beliebig erweitert werden ohne dass sich das Ziel
ändert. Das Ziel kann den erweiterten Pfad dann z.B. zur Parameterübergabe
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
können somit beliebig erweitert werden. Das Ziel ist in beiden Fällen fest und
die Anfragen werden von `#contact` bzw. `#project` verarbeitet.  
Die Erweitertung vom Pfad kann mit der Methode `SiteMap.lookup(path)`
ermittelt werden. Das zurückgegebene Meta-Objekt enthält bei variablen Pfaden
mit erweiterten Pfaden diesen im data-Property. 

```
SiteMap.lookup("#contact#support");
    returns {path:"#contact#support", face:"#", facet:"contact", data:"#support"}
    
SiteMap.lookup("#project#a#b#c");
    returns {path:"#contact#support", face:"#project", facet:"", data:"#a#b#c"}
```


### Functional Path

Der Pfad besteht aus drei oder mehr Hash-Zeichen (`###+`) und ist nur
temporär, er dient einem Funktionsaufruf, ohne den aktuellen Pfad (URL-Hash) zu
ändern.  
Dies ist nützlich für funktionale Links, z.B. um ein Popup zu öffnen oder eine
Mail im Hintergrund zu senden.

```html
<a href="###">Do something, the logic is in the model</a>
```


## Object-/Model-Binding

Bei der Objektbindung geht es darum, HTML-Elemente mit entsprechenden
Modell-Objekten zu verknüpfen, die im JavaScript existieren.

Das Object-/Model-Binding gehört ebenfalls zum Model View Controller und ist in
Seanox aspect-js im Composite API implementiert, auf der SiteMap als Erweiterung
und basiert.    
Zum besseren Verständnis ist die Funktionalität hier im Model View Controller
beschrieben.


### Begriffe


#### namespace

Vergleichbar mit Paketen in anderen Programmiersprachen können Namensräume zur
Abbildung hierarchischer Strukturen und zur Gruppierung thematisch verwandter
Komponenten und Ressourcen genutzt werden.  
Die Implementierung erfolgt in JavaScript auf Objektebene.  
Das heisst, es ist kein reales Element der Programmiersprache, sondern wird
durch das Verketten statischer Objekte abgebildet.  
Jede Ebene in dieser Objektkette repräsentiert einen Namensraum.  
Wie für die Bezeichner von Objekten typisch, verwenden auch Namensräume
Buchstaben, Zahlen und Unterstriche, die durch Punkte getrennt werden. Als
Besonderheit werden auch Arrays unterstützt. Wenn eine Objektebene im Namensraum
eine reine Zahl ist, wird ein Array angenommen.

Das Object-/Model-Binding basiert auf den IDs der Composites und deren Position
und Reihenfolge im DOM.  
Die Wurzel vom Namensraum bildet immer eine Composite-ID.  
Der Namensraum kann dabei absolut sein, also der Namensraum entspricht einer
Composite-ID, oder er basiert auf dem Namensraum einer im DOM übergeordneten
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

Beispiele möglicher Namesräume:

`a` + `a.b` + `a.b.c`  
`b` + `b.c`  
`c`


#### scope

Der Scope basiert auf dem Namensraum und stellt diesen auf der Objektebene dar.  
Das heisst, der Namensraum ist der Beschreibungstext, der Scope ist das Objekt,
wenn der Namensraum im Objektbaum aufgelöst wurde.


#### model

Das Modell (Modell-Komponente / Komponente) ist ein statisches JavaScript-Objekt
in einem beliebigen Namensraum und stellt die Logik für die
Benutzerschnittstelle (UI-Komponente) und den Übergang von der
Benutzerschnittstelle zur Geschäftslogik und/oder zum Backend zur Verfügung.  
Die Verknüpfung bzw. Bindung von Markup und JavaSchript-Model erfolgt über das
Composite-API. Dazu muss ein HTML-Element eine gültige und eindeutige ID haben.
Die ID muss die Anforderungen des Namensraums erfüllen.

Details werden im Abschnitt [Binding](#binding) beschrieben.

Das Composite-API erkennt die Existenz der Modell-Komponenten im DOM, bzw. deren
Abwesenheit. So kann das Modell der Komponente über die statischen Methoden
`dock` und `undock` informiert werden, wenn die Komponente dem DOM hinzugefügt
bzw. aus diesem entfernt wird, womit sich das Modell vorbereiten bzw.
finalisieren lässt.  
Die Implementierung beider Methoden ist optional.

```javascript
var model = {
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
und erweitert sich um ggf. weitere übergeordnete Elemente mit IDs im DOM.

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

Das Composite-API synchronisiert ereignisgesteuert die Eigenschaft im Modell mit
dem Wert vom HTML-Element. Für ein HTML-Element werden die entsprechenden
Ereignisse über das gleichnamige Attribut definiert.


#### qualifier

In einigen Fällen ist ein Bezeichner (ID) nicht eindeutig. Zum Beispiel wenn 
Eigenschaften Arrays sind oder eine Iteration verwendet wird. In diesen Fällen
kann der Bezeichner durch einen zusätzlichen eindeutigen Qualifier, getrennt
durch einen Doppelpunkt, erweitert werden.  
Qualifier wirken beim Object-/Model-Binding wie Properties und verlängern den
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
und optional auch das Minus-Zeichen unterstützt, wenn es nicht am Anfang oder am
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

Die Composite-ID wird beim MVC, Object-/Model-Binding sowie zur  Synchronisation
und Validierung benötigt und muss daher eine gültige und eindeutige Zeichenfolge
innerhalb des JavaScript-Namensraums sein. Der Bezeichner  wird auch für den
Face-Flow verwendet, um Faces und Facets sowie allgemein Modelle/Komponenten zu
identifizieren und zu kontrollieren.


### Binding

In Seanox Aspect-js werden Komponenten auch Composites oder Module genannt, da
diese aus Markup (View), korrespondierendem JavaScript (Model) und mehr
bestehen.  

Beim Object-/Model-Binding geht es um die Verbindung von View/Markup/HTML mit
dem entsprechenden JavaScript-Model.  
Das Binding leitet Interaktionen und Statusänderungen der View an das Model
weiter und stellt eine Schnittstelle für Middleware-Funktionen und Services
für die View bereit. Womit keine manuelle Implementierung und Deklaration von
Ereignissen sowie die Synchronisation und Interaktion zwischen UI und
Anwendungslogik erforderlich ist.

```javascript
var model = {
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
definieren den Namensraum und das zu verwendende JavaScript-Model. IDs können
relative und absolute Namensräume verwenden, basieren aber primär auf der
Position eines Elements im DOM und einer korrespondierenden Objektstruktur als
JavaScript-Model.


### Dock

Wenn ein Composite im DOM verwendet/eingefügt wird, wird das entsprechende
JavaScript-Model angedockt/verknüpft und beim Entfernen aus dem DOM
abgedockt/entknüpft.  
In beiden Fällen kann das Modell optional geeignete Methoden implementieren.  
Die Dock-Methode wird vor dem Rendern, vor dem Einfügen des Composites in das
DOM oder nach dem Laden der Seite beim ersten Rendern ausgeführt und kann zur
Vorbereitung der Darstellung verwendet werden. Die Undock-Methode wird
ausgeführt, nachdem das Composite aus dem DOM entfernt wurde und kann zur
Nachbereitung bzw. Bereiningung der Darstellung verwendet werden.  

```javascript
var model = {
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

Bei einem Composite in Kombination mit einer Bedingung (condition) hängt der
Aufruf der Methoden vom Ergebnis der Bedingung ab.


### Undock

Details werden im Abschnitt [Dock](#undock) beschrieben.


### Synchronization

Die Objekt-Bindung umfasst neben der statischen Verknüpfung und Zuordnung von
HTML-Elementen (View) zum JavaScript-Model auch die Synchronisation von Werten
zwischen den HTML-Elementen und den Feldern im JavaScript-Model.  
Die Synchronisation hängt von Ereignissen ab, die für das HTML-Element mit dem
Attribut `events` deklariert sind und wird nur ausgeführt, wenn eines der
definierten Ereignisse eintritt.

Details zur Funktionsweise werden im Abschnitt [events](markup.md#events)
beschrieben.


### Validation

Die Synchronisation der Werte zwischen den HTML-Elementen (View) und den Feldern
vom JavaScript-Model kann durch Validierung überwacht und gesteuert werden.   
Die Validierung wird in HTML durch die Kombination der Attribute `validate` und
`events` deklariert und erfordert eine entsprechende Validierungsmethode im
JavaScript-Model.    

Details zur Funktionsweise werden im Abschnitt [validate](markup.md#validate)
beschrieben.


### Events

Ereignisse, genauer gesagt die Interaktion zwischen View und Modell, werden bei
der Object-/Model-Binding ebenfalls berücksichtigt. Die Methoden zur Interaktion
werden nur im Model implementiert. Im Markup selbst ist keine Deklaration
erforderlich. Das Object-/Model-Binding kennt die verfügbaren Ereignisse im
HTML und so wird beim Binding das Model nach entsprechenden Methoden durchsucht,
die dann als Event-Listener registriert werden.

```javascript
var contact= {
    mail: {
        onClick(event) {
            var mail = "mailto:mail@local?subject=Test&body=Greetings";
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

[Resource Bundle](messages.md) | [Inhalt](README.md#model-view-controller) | [Komponenten](composite.md)
