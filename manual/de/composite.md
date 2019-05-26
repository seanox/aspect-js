[Model View Controler](mvc.md) | [Inhalt](README.md) | [Erweiterung](extension.md)

# Komponenten

Die Implementierung von aspect-js zielt auf eine modulare und auf Komponenten
basierte Architektur. Das Framework unterst�tzt dazu eine deklarative
Kennzeichnung von Komponenten im Markup, die Auslagerung und das automatische
Laden von Ressourcen, sowie ein automatisches Objekt/Model-Bindung.


## Inhalt

* [Aufbau](#aufbau)
* [Auslagerung](#auslagerung)
* [Laden](#laden)
  * [CSS](#css)
  * [JavaScript](#javascript)
  * [HTML](#html)
  
  
## Aufbau

Eine Komponente besteht im initialen Markup aus einem als Composite
gekennzeichneten HTML-Element mit einer eindeutigen Id.

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
````


## Auslagerung

Das innere Markup, CSS und JavaScript lassen sich ins Dateisystem auslagern.  
Das Standard-Verzeichnis `./modules` kann �ber die Eigenschaft
`Composite.MODULES` ge�ndert werden.

```
+- modules
|  |
|  +- example.css
|  +- example.js
|  +- example.html
|
+- index.html
```


## Laden

Das Laden der Ressourcen und die Objekt/Model-Bindung erfolgt partiell, wenn die
Komponente im UI ben�tigt wird -- also mit der ersten Anzeige, was �ber die
[SiteMap](sitemap.md) als zentrales Face-Flow-Management gesteuert wird und so
die Ladezeit stark minimiert, da punktuell jeweils nur f�r die aktiven
UI-Komponenten ben�tigten Ressourcen geladen werden.  
Das Auslagern und Laden der Ressourcen zur Laufzeit ist optional und l�sst sich
komplett, teilweise und nicht anwenden. Beim Nachladen und Einbinden gibt es
eine feste Reihenfolge: CSS, JS, HTML/Markup.  
Wird die Anfrage einer Ressourcen mit Status 404 beantwortet, wird davon
ausgegangen, dass diese Ressource nicht ausgelagert wurde. Werden Anfragen weder
mit Status 200 oder 404 beantwortet wird von einem Fehler ausgegangen.  
Das Laden von Ressourcen wird nur einmalig mit der ersten Anforderung der
Komponente f�r das UI ausgef�hrt.

### CSS

CSS wird als Style-Element in das HEAD-Element eingef�gt. Ohne ein HEAD-Element
verursacht das Einf�gen einen Fehler.

### JavaScript

JavaScript wird nicht als Element eingef�gt, sondern direkt mit der eval-Methode 
ausgef�hrt. Da die eval-Methode ggf. einen eigenen Namensraum f�r Variablen
bilden kann, ist es wichtig, die globale Variable besser mit `window[...]` zu
initialisieren.

### HTML

HTML/Markup wird f�r eine Komponente nur geladen, wenn das HTML-Element der
Komponente selbst kein inneres HTML besitzt und f�r das Elemente auch nicht die
Attribute `import` oder `output` deklariert wurden. Nur in diesem Fall wird
von einer leeren Komponente mit ausgelagertem HTML/Markup ausgegangen.

TODO:

[Model View Controler](mvc.md) | [Inhalt](README.md) | [Erweiterung](extension.md)
