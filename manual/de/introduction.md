# Einführung

## Was ist Seanox aspect-js?

Geprägt durch die guten Erfahrungen aus JSF (Java Server Faces) in Bezug auf
Funktion und einfache Integration ins Markup, entstand der Wunsch nach einer
ähnlichen client-seitigen fullstack Lösung
Bei Seanox aspect-js steht ein minimalistischer Ansatz zur Implementierung von
Single-Page Applications (SPAs) im Vordergrund.  

Das Framework greift den deklarativen Ansatz von HTML auf und erweitert ihn um
Expression Language, Rendering mit zusätzlichen Attributen,
Objekt/Modell-Bindung, Model View Controller, Resource Bundle, NoSQL-Datasource,
Testumgebung und vieles mehr.


## Erste Schritte

Das Framework besteht aus reinem JavaScript.

Die Releases werden heruntergeladen oder über einen Release-Channel eingebunden.
Release-Channel stellen kontinuierlich die neuesten endgültigen Hauptversionen
zur Verfügung, die sind abwärtskompatibel zur Hauptversion. Seanox aspect-js ist
somit immer auf dem neuesten Stand.

Jedes Release besteht aus zwei Versionen.  
Die Entwickler-Version beinhaltet umfangreiche Kommentare zu Konzeption,
Funktion, Arbeitsweise und Verwendung.  
Die Produktions-Version ist in der Grösse optimiert aber nicht verschleiert
(obfuscated).

Erstelle eine HTML-Datei, z.B. _index.html_ und füge Seanox apect-js ein.

```html
<!-- development version, includes helpful comments -->
<script src="https://cdn.jsdelivr.net/npm/seanox/releases/aspect-js.js"></script>
```

oder

```html
<!-- production version, optimized in size but not obfuscated -->
<script src="https://cdn.jsdelivr.net/npm/seanox/releases/aspect-js-min.js"></script>
```

__Das Framework ist zur Implementierung modularer und komponentenbasierter__
__Single-Page-Applications entwickelt worden. Durch das automatische Laden__
__von Ressourcen, Modulen und Daten ist die Verwendung eines Web-Servers__
__erforderlich.__


## Arbeitsbereich

Seanox aspect-js agiert ausschliesslich im BODY-Tag, welches selbt mit
einbezogen wird.


## Expression Language

Expressions bzw. die [Expression Language (EL)](expression.md) ist ein einfacher
Zugang zum clientseitigen JavaScrript und damit zu den Modellen und Komponenten
im aspect-js. In den Expressions wird die komplette JavaScript-API unterstützt,
die mit zusätzliche Schlüsselwörtern angereichert ist, womit auch die
zahlreichen arithmetische und logische Operatoren verwendet werden können.

Die Expression-Language kann im Markup als Freitext und in den Attributen der
HTML-Elemente verwendet werden. Ausgenommen sind JavaScript- und CSS-Elemente.
Hier wird die Expression-Language nicht unterstützt.  
Bei der Verwendung als Freitext wird als Ausgabe immer reiner Text (plain text)
erzeugt. Das Hinzufügen von Markup, insbesondere HTML-Code, ist so nicht möglich
und wir nur mit den Attributen `output` und `import` unterstützt.

```html
<body lang="{{DataSource.locale}}">
  <p>
    Today is {{new Date().toDateString()}}
    and it's {{new Date().toLocaleTimeString()}} o'clock.
  </p>
</body>
```

Die Expression Language ist zeitweise sichtbar, da der Renderer erst nach dem
Laden der Page aktiv wird. Alternativ können die Attribute
[output](markup.md#output) und [import](markup.md#import) vewendet werden,
welche eine direkte Ausgabe in das innere HTML vom Element bewirken. 

```html
<p output="Today is {{new Date().toDateString()}}
    and it's {{new Date().toLocaleTimeString()}} o'clock.">
</p>
```

Expressions können zur Laufzeit globale Variablen erzeugen und nutzen.

```html
{{now:new Date()}}
<p>
  Today is {{now.toDateString()}}
  and it's {{now.toLocaleTimeString()}} o'clock.
</p>
```

[Mehr erfahren](expression.md)


## Attribute

Der deklarative Ansatz ist in aspect-js vorrangig mit Attributen umgesetzt und
kann mit allen HTML-Elementen und in Kombination verwendet werden. Ausgenommen
sind `SCRIPT`, was nur mit dem Typ `composite/javascript` unterstützt wird,
sowie `STYLE`, welches nicht unterstützt wird. Die Werte der Attribute können
statische oder mit Verwendung der Expression-Language dynamisch sein.
Enthält ein Attribut eine Expression, werden das Attribut und der Wert
unveränderlich, da der Renderer diese bei jeder Auffrischung (Render-Zyklus)
erneut mit dem aktualisierten Wert der initialen Expression setzen wird.

[Mehr erfahren](markup.md#attribute)


### output

Das Attribut setzt den Wert oder das Ergebnis seines Ausdrucks als inneren
HTML-Code bei einem HTML-Element. Als Wert werden Text, ein Elemente oder mehre
Elemente als NodeList bzw. Array -- diese werden dann direkt eingefügt, oder
eine [DataSource-URL (locator)](datasource.md#locator) die einen Inhalt aus der
[DataSource](datasource.md) lädt und transformiert, erwartet.

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

Diese Deklaration lädt Inhalte dynamisch nach und ersetzt den inneren HTML-Code
eines Elements. Wenn der Inhalt erfolgreich geladen wurde, wird das Attribut
`import` entfernt. Das Attribut erwartet als Wert ein Elemente oder mehre
Elemente als NodeList bzw. Array -- diese werden dann direkt eingefügt, oder
eine absolute oder relative URL zu einer entfernten Ressource, die per
HTTP-Methode GET nachgeladen wird, oder eine
[DataSource-URL (locator)](datasource.md#locator) die einen Inhalt aus der
[DataSource](datasource.md) lädt und transformiert, erwartet.

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

<p import="https://raw.githubusercontent.com/seanox/aspect-js/master/test/resources/import_c.htmlx">
  loading resource...  
</p>

```

[Mehr erfahren](markup.md#import)


### condition

Das condition-Attribut legt fest, ob ein Element im DOM erhalten bleibt.  
Der mit dem Attribut angegebene Ausdruck muss explizit `true` oder `false`
zurückliefern. Mit `false` wird ein Element temporär aus dem DOM entfernt und
lässt sich später durch das Auffrischen des __Eltern-Elements__ wieder einfügen,
wenn der Ausdruck `true` zurückliefert.  
Eine Besonderheit stellt die Kombination mit dem Attribut [interval](#interval)
dar, da mit dem Entfernen des Elements aus dem DOM auch der zugehörige Timer
beendet wird. Wird das Element mit einer späteren Auffrischung wieder in das DOM
aufgenommen, startet der Timer von vorn, wird also nicht fortgesetzt.

```html
<p condition="{{Model.visible}}">
  ...
</p>
```

Die Verwendung vom condition-Attribut in Verbindung mit eingebettetem JavaScript
ist als Composite-JavaScript möglich.

```html
<script type="composite/javascript" condition="{{Model.visible}}">
  ...
</script>
```

[Mehr erfahren](markup.md#condition)


### interval

Diese Deklaration aktiviert eine intervallgesteuerte Auffrischung eines
HTML-Elements, ohne dass die Auffrischung aktiv angestossen werden muss. Als
Wert wird ein Intervall in Millisekunden erwartet, der auch als Expression
formuliert werden kann. Ein ungültiger Wert verursacht eine Konsolenausgabe.
Das Intervall beginnt automatisch mit dem Auffrischen vom deklarierten
HTML-Element und wird beendet bzw. entfernt wenn:
- das Element nicht mehr im DOM existiert
- das condition-Attribut `false` ist

```html
<p interval="1000">
  {{new Date().toLocaleTimeString()}}
</p>
```

Mit der Kombination von Intervall und Variablen-Expression ist die Umsetzung
eines permanenten Zählers sehr einfach.

```html
{{counter:0}}
<p interval="1000">
  {{counter:parseInt(counter) +1}}^
  {{counter}}
</p>
```

Die Verwendung vom interval-Attribut in Verbindung mit eingebettetem JavaScript
ist als Composite-JavaScript möglich.

```html
<script type="composite/javascript" interval="1000">
  console.log(new Date().toLocaleTimeString());
</script>
```

[Mehr erfahren](markup.md#interval)


### composite

Kennzeichnet im Markup ein Element als [Composite](composites.md).  
Composites sind modulare Komponente und haben in aspect-js eine vielseitige
Bedeutung.  
Sie werden von der [SiteMap](mvc.md#sitemap) als Faces, also als Ziele für
virtuelle Pfade im Face-Flow verwendet, was direkten Einfluss auf die
Sichtbarkeit der Composites hat.
Der [Model View Controler](mvc.md#sitemap) unterstützt für Composites eine
automatisches [Objekt-/Model-Binding](object-binding.md).  
Die Ressourcen (CSS, JS, Markup) lassen sich für Composite in das
Modul-Verzeichnis auslagern und werden erst bei Bedarf automatisch nachgeladen. 

```html
<article composite>
  ...
</article>
```

Details zur Verwendung von Composites / modularen Komponente werden in den
Abschnitten [Composites](composites.md) und [Model View Controler](mvc.md)
beschrieben.

[Mehr erfahren](markup.md#composite)


### events

Diese Deklaration bindet ein oder mehre Ereignisse (siehe
https://www.w3.org/TR/DOM-Level-3-Events) an ein HTML-Element. Ereignisse
eröffnen primäre Funktionen zur ereignisgesteuerte Auffrischung von anderen
HTML-Elementen (mehr dazu im Abschnitt [render](#render)), sowie zur Validierung
und Synchronisation von HTML-Elementen und den korrespondierenden
JavaScript-Modellen (mehr dazu im Abschnitt [validate](#validate).  

```html
<span id="output1">{{#text1.value}}</span>
<input id="text1" type="text"
    events="mouseup keyup change" render="#output1"/>
```

[Mehr erfahren](markup.md#events)


### render

Das Attribut `render` erfordert die Kombination mit dem Attribut `events`.
Zusammen definieren sie, welche Ziele mit welchen auftretenden Events
aufgefrischt werden.  
Als Wert erwartet das `render` Attribut einen CSS-Selector bzw. Query-Selector
welche die Ziele festlegt.

```html
<span id="output1">{{#text1.value}}</span>
<input id="text1" type="text"
    events="mouseup keyup change" render="#output1"/>
```

[Mehr erfahren](markup.md#render)
 

### validate  

TODO:
