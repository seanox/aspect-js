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
Projektion ist ein wichtiger Begriff, da die Art der Darstellung eines Models
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
allen seinen übergeordneten Faces angezeigt.


#### Face Flow

Face-Flow beschreibt die Zugriffssteuerung und die Visualisierung von Ansichten.  
Die SiteMap stellt dafür Schnittstellen für Berechtigungskonzepte und Akzeptoren
zur Verfügung, mit denen der Face-Flow kontrolliert und beeinflusst werden kann.
Auf diese Weise kann der Zugriff auf Pfade/Ansichten mit eigener Logik gestoppt
und/oder umgeleitet bzw. weitergeleitet werden.


### Konfiguration

Für die Konfiguration der SiteMap wird die Methode `SiteMap.customize(....)`
verwendet. Mit dieser Methode ist es möglich, den Face-Flow (Pfade, Faces,
Facets), die Berechtigungen zu definieren und Akzeptoren zu registrieren, wofür
die die Methode unterschiedliche Signaturen bereitstellt.  

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

__Ohne Face-Flow gibt es keine gültigen Pfade. Wird eine Benutzeroberfläche__
__oder Komponenten ohne Face-Flow verwendet, müssen diese als statisch__
__gekennzeichnet werden, da die Komponenten sind ausgeblendet (aus dem DOM__
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

Das Berechtigungskonzept basiert auf einer oder mehreren permit-Methode, die
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

Alle angeforderten Pfade durchlaufen die permit-Methode(n). Diese entscheiden,
was mit dem Pfad passiert. Von jeder permit-Methode werden folgende
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
`window.location.href` und `SiteMap.navigate(path)` erfolgen.

```
<a href="#a#b#c">Goto root + a + b + c</a>
<a href="##">Back to the parent</a>
<a href="##x">Back to the parent + x</a>
```

```javascript
SiteMap.navigate("#a#b#c");
SiteMap.navigate("##");
SiteMap.navigate("##x");
```

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

In Anlehung an das Dateisystem werden auch hier absolute und relative Pfade
sowie Funktionspfade unterstützt.  
Pfade bestehen ausschließlich aus Wortzeichen und Unterstrichen (basierend auf
zusammengesetzten IDs) und müssen mit einem Buchstaben beginnen. Als Separator
und Root wird das Hash-Zeichen verwenden. Leerzeichen werden nicht unterstützt.

```
#a#b#c#d
```

Pfade verwenden nur Kleinbuchstaben. Grossbuchstaben werden beim Normalisieren
automatisch durch Kleinbuchstaben ersetzt.

```
#a#b#c#d == #A#b#C#d
```

Zwischen den Pfadsegmenten kann das Hash-Zeichen (`#`) auch als Rück- /
Eltern-Sprunganweisung verwendet werden. Der Weite vom Rücksprung entspricht
dann der Anzahl der zusätzlichen Hash-Zeichen.

```
#a#b#c#d##x   -> #a#b#c#x
#a#b#c#d###x  -> #a#b#x
#a#b#c#d####x -> #a#x
```

Die Navigation kann durch Änderung des URL-Hash im Browser (direkte Eingabe),
durch Verwendung von Hash-Links und in JavaScript mit `window.location.hash`,
`window.location.href` und `SiteMap.navigate(path)` erfolgen.

Es gibt verschiedene Arten von Pfaden, die im Folgenden erläutert werden.


### Root Path

Diese Pfade sind leer oder enthalten nur ein Hash-Zeichen.

```
<a href="#">Back to the root</a>
```


### Relative Path

Diese Pfade beginnen ohne Hash oder mit zwei oder mehr Hash-Zeichen (`###+`)
und sind relativ zum aktuellen Pfad.
     
```
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

```
<a href="#">Back to the root</a>
<a href="#a#b#c">Back to the root + a + b + c</a>
```


### Variable Path

TODO:


### Functional Path

Der Pfad besteht aus drei oder mehr Hash-Zeichen (`#####+`) und ist nur
temporär, er dient einem Funktionsaufruf, ohne den aktuellen Pfad (URL-Hash) zu
ändern.  
Dies ist nützlich für funktionale Links, z.B. um ein Popup zu öffnen oder eine
Mail im Hintergrund zu senden.

```
<a href="###">Do something, the logic is in the model</a>
```


## Object-/Model-Binding

Bei der Objektbindung geht es darum, HTML-Elemente mit entsprechenden
Modell-Objekten zu verknüpfen, die im JavaScript existieren.

Das Object-/Model-Binding gehört ebenfalls zum Model View Controller und ist in
Seanox aspect-js in der Composite API implementiert, auf der SiteMap als
Erweiterung und basiert.    
Zum besseren Verständnis ist die Funktionalität hier im Model View Controller
beschrieben.


### Begriffe


#### namespace

Der Namensraum ist eine Folge von Zeichen oder Wörtern, die aus Buchstaben,
Zahlen und Unterstrichen besteht und den Pfad in einem Objektbaum beschreibt.  
Der Punkt wird als Trennzeichen verwendet, er definiert die Grenze von einer
Ebene zur nächsten im Objektbaum.  
Jedes Element im Namensraum muss mindestens ein Zeichen enthalten und mit einem
Buchstaben beginnen.

TODO:


- - -

[Resource Bundle](messages.md) | [Inhalt](README.md#model-view-controller) | [Komponenten](composite.md)
