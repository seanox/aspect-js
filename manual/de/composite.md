[SiteMap](sitemap.md) | [Inhalt](README.md#komponenten) | [Reaktives Rendering](reactive.md)
- - -

# Komponenten

Seanox aspect-js ist auf eine modulare und komponentenbasierte Architektur
ausgerichtet. Das Framework unterst&uuml;tzt dazu eine deklarative Kennzeichnung
von Komponenten im Markup sowie automatische Mechanismen f&uuml;r das
View-Model-Binding und das Laden von ausgelagerten Ressourcen zur Laufzeit. 


## Inhalt

* [Modul](#modul)
* [Komponente](#komponente)
* [Composite](#composite)
* [Aufbau](#aufbau)
* [Ressourcen](#ressourcen)
* [Laden](#laden)
  * [CSS](#css)
  * [JavaScript](#javascript)
  * [HTML](#html)
* [Common Standard-Komponente](#common-standard-komponente)
* [Namespace](#namespace)
* [Erg&auml;nzung](#erg%C3%A4nzung)


## Modul

Ein Modul stellt eine geschlossene funktionale Programmeinheit dar, die meist
als Programmbibliothek bereitgestellt wird.


## Komponente

Eine Komponente bezeichnet einen funktional oder technisch eigenst&auml;ndigen
Bestandteil, der aus einem oder mehreren Modulen bestehen kann.


## Composite

Ein Composite bezeichnet eine funktional eigenst&auml;ndige Komponente die sich
aus Markup, CSS und JavaScript sowie optional aus weiteren Ressourcen
zusammensetzen. Im Hinblick auf den Model-View-Controller-Ansatz stellt ein
Composite Komponenten f&uuml;r Model und View bereit.

__Damit unterscheidet sich das Composite-Konzept vom JavaScript-Modul-Konzept,
dsa aber ebenfalls verwendet werden kann. Ein anderer wichtiger Unterschied
besteht beim Laden und Ausf&uuml;hren von JavaScript, was bei Composites in
einem Renderzyklus linear/sequenziell und somit synchron erfolgt.__


## Aufbau

Eine Komponente besteht im Markup aus einem als Composite gekennzeichneten
HTML-Element mit einer eindeutigen Id.

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

Im JavaScript wird die ID vom HTML-Element, das als Composite deklariert wurde,
als Name f&uuml;r das korrespondierende Model verwendet.

```javascript
const example = {
    ...    
}
```

Und auch im CSS wird die ID vom HTML-Element des Composites als Zuordnung
verwendet.

```css
#example {
  ...    
}
```


## Ressourcen

Das innere Markup, CSS und JavaScript von Composites lassen sich auslagern. Das
Standard-Verzeichnis `./modules` kann &uuml;ber die Eigenschaft
`Composite.MODULES` ge&auml;ndert werden. Die Dateinamen der ausgelagerten
Ressourcen leiten sich von der ID des als Composite gekennzeichneten
HTML-Elements ab. Welche Ressourcen bzw. Teile der Komponente ausgelagert
werden, kann f&uuml;r jede Komponente individuell entschieden werden. 

```
+ modules
  - example.css
  - example.js
  - example.html
- index.html
```

Beim Standardverhalten wird der Name der Ressourcen von der Composite-ID
abgeleitet und nutzt diese dann als Kleinschreibung am Anfang. Dieses Verhalten
kann mit dem Attribute [strict](markup.md#strict) ge&auml;ndert werden, so dass
die Composite-ID unver&auml;ndert f&uuml;r die Ressourcen verwendet werden.


## Laden

Das Laden der Ressourcen und das View-Model-Binding erfolgen partiell, wenn das
Composite in der View ben&ouml;tigt wird, was die Ladezeit stark minimiert, da
situationsabh&auml;ngig nur Ressourcen geladen werden, welche im Moment der
Darstellung verwendet werden.

Das Auslagern und Laden der Ressourcen zur Laufzeit ist optional und l&auml;sst
sich komplett, teilweise und nicht anwenden. Beim Nachladen und Einbinden gibt
es eine feste Reihenfolge: CSS, JavaScript, HTML/Markup.

Wird die Anfrage einer Ressource mit Status 404 beantwortet, wird angenommen,
dass diese Ressource nicht ausgelagert wurde. Andere Status als 200 oder 404
f&uuml;hren zu einem Fehler.

Das Laden von Ressourcen wird nur einmalig mit der ersten Anforderung der
Komponente f&uuml;r die View ausgef&uuml;hrt und der Inhalt dann
zwischengespeichert.


### CSS

CSS wird als Style-Element in das HEAD-Element eingef&uuml;gt. Ohne ein
HEAD-Element verursacht das Einf&uuml;gen einen Fehler.


### JavaScript

JavaScript wird nicht als Element eingef&uuml;gt, sondern direkt mit der
eval-Methode in einem immer wieder frischen isolierten G&uuml;ltigkeitsbereich
ausgef&uuml;hrt. Da die dort erstellten Konstanten, Variablen und Methoden nicht
global verf&uuml;gbar sind, m&uuml;ssen diese z.b. mit dem Makro [#export](
    scripting.md#export) publiziert werden.

```javascript
const login = {
    validate(element, value) {
    },
    logon: {
        onClick(event) {
        }
    }    
};

#export login;
```


### HTML

HTML/Markup wird f&uuml;r ein Composite nur geladen, wenn das HTML-Element der
Komponente selbst kein inneres HTML besitzt und f&uuml;r das Element nicht die
Attribute `import` oder `output` deklariert wurden. Nur dann wird von einer
leeren Komponente mit ausgelagertem HTML/Markup ausgegangen.


## Common Standard-Komponente

Mit dem Laden der Seite und der Initialisierung des Frameworks und der Anwendung
wird automatisch auch die Commons-Komponente im Modul-Verzeichnis geladen, die
aus der JavaScript-Datei `common.js` und/oder dem CSS-Stylesheet `common.css`
bestehen kann. Beide Dateien sind zur Ablage initialer und anwendungsweiter
Logik bzw. Styles gedacht.

```
+ modules
  - common.css
  - common.js
  - ...
- index.html
```


## Namespace

Vergleichbar mit Packages in anderen Programmiersprachen, lassen sich Namespaces
(Namensr&auml;ume) zur hierarchischen Strukturierung von Komponenten, Ressourcen
und Gesch&auml;ftslogik nutzen.

Auch wenn Packages kein Merkmal von JavaScript sind, lassen sich diese auf
Objektebene durch das Verketten von Objekten zu einem Objektbaum abbilden. Dabei
bildet jede Ebene des Objektbaums einen Namespace, was auch als Domain betrachtet
werden kann.

Wie f&uuml;r die Bezeichner von Objekten typisch, verwenden auch Namespaces
Buchstaben, Zahlen und Unterstriche, die durch einen Punkt getrennt werden. Als
Besonderheit werden auch Arrays unterst&uuml;tzt. Nutzt eine Ebene im Namespace
eine Ganzzahl, wird diese Ebene als Array interpretiert.

Composites bzw. Datenobjekte (Models) sind vergleichbar mit managed Beans, die
statisch als Singletons/Facades/Delegates den globalen Namespace nutzen. Um
diese Datenobjekte zu strukturieren und Domain-Konzepte umzusetzen, sind
entsprechende Namespaces erforderlich.

__F&uuml;r Module wird auch hier die Verwendung vom Makro [#export](
    scripting.md#export) empfhohlen, da dieses neben dem zu publizierenden
JavaScript-Element auch ein Namespace als Ziel enthalten kann.__

```javascript
const masterdata = {
    regions: {
        ...
    },
    languages: {
        ...
    }
};

#use example.administration;
#export masterdata@example.administration;
```

Das Beispiel erstellt mit [#use](scripting.md#use), wenn noch nicht existent,
den Namensraum `example.administration` und exportiert dann mit [#export](
    scripting.md#export) `masterdata` nach `example.administration.masterdata`.

Im Markup bilden sich Namespaces aus den IDs verschachtelter Composites, wenn
diese das Attribut `namespace` verwenden.

```html
<div id="example" composite namespace>
  <div id="administration" composite namespace>
    <div id="masterdata" composite namespace>
      <div id="regions" composite namespace>
        Namespace: masterdata.regions
      </div>
    </div>
  </div>
</div>
```

Befinden sich weitere Elemente mit einer ID zwischen den Composites, haben diese
keine Auswirkungen.

```html
<div id="example" composite namespace>
  <div id="administration" composite namespace>
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
  </div>
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
ein korrespondierendes JavaScript-Objekt existieren und verwendet werden. Im
Markup wird lediglich die Syntax der Namespaces gepr&uuml;ft. Ist diese
g&uuml;ltig, werden die Namespaces direkt auf den Pfad von Modulen und deren
Ressourcen angewendet und erweitern den Pfad ab dem Modul-Verzeichnis.

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

## Erg&auml;nzung

Wegen der engen Verkn&auuml;pfung sei an dieser Stelle bewusst auf die
weiterf&uuml;hrenden Abschnitte [Model-View-Controler](mvc.md) und
[View-Model-Binding](mvc.md#view-model-binding) verwiesen.


- - -

[SiteMap](sitemap.md) | [Inhalt](README.md#komponenten) | [Reaktives Rendering](reactive.md)
