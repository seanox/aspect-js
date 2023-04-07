[Model-View-Controller](mvc.md) | [Inhalt](README.md#sitemap) | [Komponenten](composite.md)
- - -

# SiteMap

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


## Inhalt

* [Begriffe](#begriffe)
  * [Page](#page)
  * [Face](#face)
  * [Facet](#facet)
  * [Face-Flow](#face-flow)
* [Konfiguration](#konfiguration)
  * [Face-Flow](#face-flow-1)
  * [Permissions](#permissions)
  * [Acceptors](#acceptors)
* [Navigation](#navigation)
* [Berechtigungskonzept](#berechtigungskonzept)
* [Acceptors](#acceptors)
* [Virtual Paths](#virtual-paths)
  * [Root Path](#root-path)
  * [Relative Path](#relative-path)
  * [Absolute Path](#absolute-path)
  * [Variable Path](#variable-path)
  * [Functional Path](#functional-path)


## Begriffe


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


## Konfiguration

Standardm&auml;ssig ist die SiteMap inaktiv und muss mit der Konfiguration
aktiviert werden.

F&uuml;r die Konfiguration der SiteMap wird die Methode
`SiteMap.customize(....)`verwendet. Mit dieser Methode ist es m&ouml;glich, den
Face-Flow (Pfade, Faces, Facets) sowie die Berechtigungen zu definieren und
Akzeptoren zu registrieren, wof&uuml;r die Methode unterschiedliche Signaturen
bereitstellt.

Die Konfiguration kann mehrfach aufgerufen werden, auch zur Laufzeit. Die
SiteMap sammelt alle Konfigurationen kumulativ. Alle Pfade, Faces und Facets
werden zusammengefasst, Akzeptoren und permit-Methoden in der Reihenfolge ihrer
Registrierung gesammelt. Da die Konfiguration immer einen kumulativen Zustand
verwendet, ist es sp&auml;ter nicht nachvollziehbar, wie die Konfiguration
erstellt wurde.

Die Konfiguration der SiteMap greift nur, wenn ein fehlerfreies Meta-Objekt
&uuml;bergeben wird und keine Fehler bei der Verarbeitung auftreten.


### Face-Flow

Die Konfiguration basiert auf einem Meta-Objekt, das an die Methode
`SiteMap.customize({meta})` &uuml;bergeben wird. Die Schl&uuml;ssel (string)
entsprechen den Pfaden und ein Pfad hat immer ein existierendes Face als Ziel,
Teilpfade ohne Face werden ignoriert. Die Werte sind Arrays mit den
g&uuml;ltigen Facets f&uuml;r einen Pfad bzw. Face. Facets ben&ouml;tigen keinen
eigenen Pfad, da diese automatisch abgeleitet und erstellt werden.

```javascript
SiteMap.customize({...});
```

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

__Die Navigation akzeptiert nur Pfade die im Face-Flow definiert sind.
Ung&uuml;ltige Pfade werden basierend auf dem angeforderten Pfad zum n&auml;chst
h&ouml;heren bekannten/berechtigten Pfad weitergeleitet.__

__Ohne Face-Flow gibt es keine g&uuml;ltigen Pfade. Sollen bei aktivierter
SiteMap in einer Page, Komponenten ohne Face-Flow verwendet werden, m&uuml;ssen
diese als _static_ deklariert werden, da die Komponenten sonst ausgeblendet und
somit aus dem DOM entfernt werden.__

```html
<html>
  <body>
    <form id="model" composite static>
      ...
    </form>
  </body>
</html>
```


### Permissions

Das Berechtigungskonzept basiert auf einer oder mehreren permit-Methoden, die
zusammen mit dem Meta-Objekt zum Face-Flow &uuml;bergeben werden.

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
entscheiden was mit dem Pfad passiert. Von jeder permit-Methode wird einer der
folgenden R&uuml;ckgabewerte erwartet:

`boolean true` Die Validierung ist erfolgreich und die Iteration &uuml;ber
weitere permit-Methoden wird fortgesetzt. Wenn alle permit-Methoden wahr sind
und damit den Pfad best&auml;tigen, wird er verwendet.

`string` Die Validierung (Iteration &uuml;ber weitere permit-Methoden) wird
abgebrochen und es folgt eine Weiterleitung an die zur&uuml;ckgegebene
Zeichenkette. 

`otherwise` Der Pfad gilt als ung&uuml;ltig/unautorisiert, die Validierung
(Iteration &uuml;ber weitere permit-Methoden) wird abgebrochen und es folgt eine
Weiterleitung an den urspr&uuml;nglichen Pfad.


### Acceptors

Akzeptoren arbeiten &auml;hnlich wie die permit-Methoden. Im Unterschied dazu
werden die Methoden der Akzeptoren nur bei den Pfaden aufgerufen, deren
RegExp-Muster dem angefragten Pfad entsprechen. Auch von den Methoden der
Akzeptoren werden die gleichen Arten von R&uuml;ckgabewerten wie bei den
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

```javascript
SiteMap.navigate("x#y#z");
```


## Berechtigungskonzept

Das Berechtigungskonzept basiert auf permit-Methoden, die als Callback-Methoden
mit der Konfiguration des Face-Flows definiert werden. Es k&ouml;nnen mehrere
permit-Methoden definiert werden, die mit jedem angeforderten Pfad
&uuml;berpr&uuml;ft werden. Nur wenn alle permit-Methoden den angeforderten Pfad
mit `true` best&auml;tigen, wird er verwendet und der Renderer macht die
abh&auml;ngigen Faces und Facets sichtbar.
 
Details werden im Abschnitt [Permissions](#permissions) beschrieben.


## Acceptors

Akzeptoren werden zusammen mit dem Berechtigungskonzept ausgef&uuml;hrt. Sie
haben die gleiche Wirkung, betreffen aber nur Pfade, die einem regul&auml;ren
Ausdruck entsprechen. Akzeptoren k&ouml;nnen zur Best&auml;tigung von
Berechtigungen und/oder f&uuml;r versteckte Hintergrundaktivit&auml;ten
verwendet werden.

Details werden im Abschnitt [Acceptors](#acceptors) beschrieben.


## Virtual Paths

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

```
#a#b#c#d
```

Pfade verwenden nur Kleinbuchstaben. Grossbuchstaben werden beim Normalisieren
automatisch durch Kleinbuchstaben ersetzt.

```
#a#b#c#d == #A#b#C#d
```

Zwischen den Pfadsegmenten kann das Hash-Zeichen (`#`) auch als R&uuml;ck- /
Eltern-Sprunganweisung verwendet werden. Die Weite vom R&uuml;cksprung
entspricht dann der Anzahl der zus&auml;tzlichen Hash-Zeichen.

```
#a#b#c#d##x   -> #a#b#c#x
#a#b#c#d###x  -> #a#b#x
#a#b#c#d####x -> #a#x
```

Die Navigation kann durch &Auml;nderung des URL-Hash im Browser (direkte
Eingabe), durch Verwendung von Hash-Links und in JavaScript mit
`window.location.hash`, `window.location.href`, `SiteMap.navigate(path)` und
`SiteMap.forward(path)` erfolgen.

Es gibt verschiedene Arten von Pfaden, die im Folgenden erl&auml;utert werden.


### Root Path

Diese Pfade sind leer oder enthalten nur ein Hash-Zeichen.

```html
<a href="#">Back to the root</a>
```


### Relative Path

Diese Pfade beginnen ohne Hash oder mit zwei oder mehr Hash-Zeichen (`##+`) und
sind relativ zum aktuellen Pfad.

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

Diese Pfade beginnen mit einem Hash-Zeichen. Alle Pfade werden ausgeglichen,
d.h. die Direktiven mit mehreren Hash-Zeichen werden aufgel&ouml;st.

```html
<a href="#">Back to the root</a>
<a href="#a#b#c">Back to the root + a + b + c</a>
```


### Variable Path

Variable Pfade sind eine Abbildung (Mapping) von virtuellen auf physische Pfade.
Die Erkl&auml;rung klingt im Kontext der SiteMap und derer virtueller Pfade
etwas verwirrend und meint hier eine weitere zus&auml;tzliche virtuelle
Abbildung von Pfaden innerhalb der SiteMap. Dabei bildet ein Pfad der SiteMap
ein festes Ziel, welches ein Face und Facet sein kann. Der Pfad kann nun
beliebig erweitert werden ohne dass sich das Ziel &auml;ndert. Das Ziel kann den
erweiterten Pfad dann z.B. zur Parameter&uuml;bergabe nutzen, was vergleichbar
mit `PATH_TRANSLATED` und `PATH_INFO` im CGI ist. 

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
k&ouml;nnen somit beliebig erweitert werden. Das Ziel ist in beiden F&auml;llen
fest und die Anfragen werden von `#contact` bzw. `#project` verarbeitet. Die
Erweiterung vom Pfad kann mit der Methode `SiteMap.lookup(path)` ermittelt
werden. Das zur&uuml;ckgegebene Meta-Objekt enth&auml;lt bei variablen Pfaden
den erweiterten Pfad als data-Property. 

```
SiteMap.lookup("#contact#support");
    returns {path:"#contact#support", face:"#", facet:"contact", data:"#support"}

SiteMap.lookup("#project#a#b#c");
    returns {path:"#contact#support", face:"#project", facet:"", data:"#a#b#c"}
```


### Functional Path

Der Pfad besteht aus drei oder mehr Hash-Zeichen (`###+`) und ist nur
tempor&auml;r, er dient einem Funktionsaufruf, ohne den aktuellen Pfad
(URL-Hash) zu &auml;ndern. Dies ist n&uuml;tzlich f&uuml;r funktionale Links,
z.B. um ein Popup zu &ouml;ffnen oder eine Mail im Hintergrund zu senden.

```html
<a href="###">Do something, the logic is in the model</a>
```


- - -

[Model-View-Controller](mvc.md) | [Inhalt](README.md#sitemap) | [Komponenten](composite.md)
