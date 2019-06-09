[Resource Bundle](messages.md) | [Inhalt](README.md#model-view-controller) | [Komponenten](composite.md)
- - -

# Model View Controller

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


## Controller

Hier muss zwischen I/O-Controller und Applikations-Controller unterschieden
werden. Das reine MVC-Entwurfsmuster meint den I/O-Controller zur �bermittlung
der Interaktionen. Da dieser durch Betriebssystem und Browser bereitgestellt
wird, bezieht sich der Controler in Seanox aspect-js vordergr�ndig auf den
Applikations-Controller, der Abl�ufe innerhalb einer Applikation (Face-Flow)
steuert und das Binding von Markup und JavaScript sowie die Steuerung vom
Datenfluss zwischen View und Model �bernimmt.  
In Seanox aspect-js ist der Controller die Zusammenarbeit von Composite, Paths
und SiteMap.


## Model

Das Modell ist ein darstellbares/projezierbares Objekt.  
Es empf�ngt (Status)�nderungen und Interaktionen der View, die durch den 
Controler �bermittelt werden, bzw. bietet der View eine Schnittstelle zu Daten
sowie Funktionen und Diensten der Middelware. Das Modell dient vorrangig der
View zur Darstellung und Verwaltung der Zust�nde, f�r fachliche Funktionalit�t
nimmt es weitere Komponenten in Anspruch.    
In Seanox aspect-js werden die Modelle durch statische JavaScript-Objekte
repr�sentiert. Konzeptionell ist die Implementierung der Entwurfsmuster Fassade
und Delegation angedacht, so dass die statischen Modelle intern weitere
Komponenten und Abstraktion verwenden.


## View

Die View ist ausschliesslich f�r die Darstellung bzw. Projektion eines Modells
verantwortlich.  
Projektion ist ein wichtiger Begriff, da die Art der Darstellung eines Models
nicht eingeschr�nkt ist.  
In Seanox aspect-js werden die Views durch das Markup repr�sentiert.


## Inhalt

* [Controller](#controller)
* [Model](#model)
* [View](#view)
* [SiteMap](#sitemap)
  * [Terms](#terms)
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
  * [Functional Path](#functional-path)
  * [Root Path](#root-path)
  * [Relative Path](#relative-path)
  * [Absolute Path](#absolute-path)
* [Object-/Model-Binding](#object-model-binding)
  * [Terms](#terms)
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
Page, Faces und Facets organisiert, auf die �ber virtuelle Pfade zugegriffen
wird. Zu diesem Zweck stellt SiteMap eine hierarchische Verzeichnisstruktur zur
Verf�gung, die auf den virtuellen Pfaden f�r alle Ansichten basiert. Die SiteMap
steuert den Zugriff und die Visualisierung (Ein- und Ausblenden) der Ansichten,
den sogenannten Face-Flow.  
Face-Flow und Visualisierung funktionieren resolut und verwenden das DOM zum
Einf�gen und Entfernen der Ansichten (Faces und Facets).

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


### Terms


#### Page

In einer Single-Page-Application bildet die Page den elementaren Rahmen und die
Laufzeitumgebung der gesamten Anwendung.


#### Face

Ein Face ist die prim�re Projektion von Modellen/Komponenten/Inhalten. Diese
Projektion kann zus�tzliche Unterstrukturen in Form von Facets und Sub-Faces
enthalten.  
Faces sind Komponenten, die verschachtelt werden k�nnen.  
So werden �bergeordneten Faces zu partiellen Faces, wenn sich der Pfad auf ein
Sub-Face bezieht.
Ein Sub-Face wird mit allen seinen �bergeordneten Faces angezeigt. Wenn die
�bergeordneten Faces zus�tzliche Facets enthalten, werden diese Facets nicht
angezeigt. Die �bergeordneten Faces werden dann nur teilweise/partiell
dargestellt.


#### Facets

Facets sind Teile eines Faces (Projektion) und sind in der Regel keine
eigenst�ndige Ansicht. So k�nnen z.B. bei einem Such-Formular die Eingabemaske
und die Ergebnistabelle separate Facets eines Faces sein, ebenso wie Article 
und/oder Section in einem Face. Sowohl Face als auch Facets sind �ber virtuelle
Pfade erreichbar. Der Pfad zu Facets bewirkt, dass das umschliessende Face mit
allen seinen �bergeordneten Faces angezeigt und das adressiert Facets in den
sichtbaren Bereich geholt und fokussiert wird.


#### Face Flow

Face-Flow beschreibt die Zugriffssteuerung und die Visualisierung von Ansichten.  
Die SiteMap stellt daf�r Schnittstellen f�r Berechtigungskonzepte und Akzeptoren
zur Verf�gung, mit denen der Face-Flow kontrolliert und beeinflusst werden kann.
Auf diese Weise kann der Zugriff auf Pfade/Ansichten mit eigener Logik gestoppt
und/oder umgeleitet bzw. weitergeleitet werden.


### Konfiguration

F�r die Konfiguration der SiteMap wird die Methode `SiteMap.customize(....)`
verwendet. Mit dieser Methode ist es m�glich, den Face-Flow (Pfade, Faces,
Facets), die Berechtigungen zu definieren und Akzeptoren zu registrieren, wof�r
die die Methode unterschiedliche Signaturen bereitstellt.  

Die Konfiguration kann mehrfach aufgerufen werden, auch zur Laufzeit. Die
SiteMap sammelt alle Konfigurationen kumulativ. Alle Pfade, Faces und Facets
werden zusammengefasst, Akzeptoren und permit-Methoden in der Reihenfolge ihrer
Registrierung gesammelt. Da die Konfiguration immer einen kumulativen Zustand
verwendet, ist es sp�ter nicht nachvollziehbar, wie die Konfiguration erstellt
wurde.

Die Konfiguration der SiteMap greift nur, wenn ein fehlerfreies Meta-Objekt
�bergeben wird und keine Fehler bei der Verarbeitung auftreten.


#### Face Flow

Die Konfiguration basiert auf einem Meta-Objekt, das an die Methode
`SiteMap.customize({meta})` �bergeben wird.  
Die Schl�ssel (string) entsprechen den Pfaden und ein Pfad hat immer ein
existierendes Face als Ziel, Teilpfade ohne Face werden ignoriert. Die Werte
sind Arrays mit den g�ltigen Facets f�r einen Pfad/Face. Facets ben�tigen keinen
eigenen Pfad, da diese automatisch abgeleitet/erstellt werden.

```javascript
SiteMap.customize({...});
```

```javascript
var map = {
    "#": ["news", "products", "about", "contact", "legal"],
    "products#papers": ["paperA4", "paperA5", "paperA6"],
    "products#envelope": ["envelopeA4", "envelopeA5", "envelopeA6"],
    "products#pens": ["pencil", "ballpoint", "stylograph"],
    "legal": ["terms", "privacy"],
    ...
};

SiteMap.customize(map);
```

Oder etwas k�rzer als direkter Aufruf der Customize-Methode:

```javascript
SiteMap.customize({
    "#": ["news", "products", "about", "contact", "legal"],
    "products#papers": ["paperA4", "paperA5", "paperA6"],
    "products#envelope": ["envelopeA4", "envelopeA5", "envelopeA6"],
    "products#pens": ["pencil", "ballpoint", "stylograph"],
    "legal": ["terms", "privacy"],
    ...
});
```

__Die Navigation akzeptiert nur Pfade, die im Face-Flow definiert sind.__
__Ung�ltige Pfade werden basierend auf dem angeforderten Pfad zum n�chst__
__h�heren bekannten/berechtigten Pfad weitergeleitet.__

__Ohne Face-Flow gibt es keine g�ltigen Pfade. Wird eine Benutzeroberfl�che__
__oder Komponenten ohne Face-Flow verwendet, m�ssen diese als statisch__
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


TODO:


- - -

[Resource Bundle](messages.md) | [Inhalt](README.md#model-view-controller) | [Komponenten](composite.md)
