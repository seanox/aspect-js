[Resource Bundle](messages.md) | [Inhalt](README.md) | [Komponenten](composite.md)

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
wird, bezieht sich der Controler in aspect-js vordergr�ndig auf den
Applikations-Controller, der Abl�ufe innerhalb einer Applikation (Face-Flow)
steuert und das Binding von Markup und JavaScript sowie die Steuerung vom
Datenfluss zwischen View und Model �bernimmt.  
In aspect-js ist der Controller die Zusammenarbeit von Composite, Paths und
SiteMap.


## Model

Das Modell ist ein darstellbares/projezierbares Objekt.  
Es empf�ngt (Status)�nderungen und Interaktionen der View, die durch den 
Controler �bermittelt werden, bzw. bietet der View eine Schnittstelle zu Daten
sowie Funktionen und Diensten der Middelware. Das Modell dient vorrangig der
View zur Darstellung und Verwaltung der Zust�nde, f�r fachliche Funktionalit�t
nimmt es weitere Komponenten in Anspruch.    
In aspect-js werden die Modelle durch statische JavaScript-Objekte
repr�sentiert. Konzeptionell ist die Implementierung der Entwurfsmuster Fassade
und Delegation angedacht, so dass die statischen Modelle intern weitere
Komponenten und Abstraktion verwenden.


## View

Die View ist ausschliesslich f�r die Darstellung bzw. Projektion eines Modells
verantwortlich.  
Projektion ist ein wichtiger Begriff, da die Art der Darstellung eines Models
nicht eingeschr�nkt ist.  
In aspect-js werden die Views durch das Markup repr�sentiert.


## Contents Overview

* [Controller](#controller)
* [Model](#model)
* [View](#view)
* [SiteMap](#sitemap)
  * [Terms](#terms)
    * [Page](#page)
    * [Face](#face)
    * [Facets](#facets)
    * [Face Flow](#face-flow)
  * [Configuration](#configuration)
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

Die Darstellung in aspect-js ist mehrschichtig und die Ansichten sind als Page,
Faces und Facets organisiert, auf die �ber virtuelle Pfade zugegriffen wird. Zu
diesem Zweck stellt SiteMap eine hierarchische Verzeichnisstruktur zur
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


TODO:

[Resource Bundle](messages.md) | [Inhalt](README.md) | [Komponenten](composite.md)
