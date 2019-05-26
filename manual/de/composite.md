[Model View Controler](mvc.md) | [Inhalt](README.md) | [Erweiterung](extension.md)

# Komponenten

Die Implementierung von aspect-js zielt auf eine modulare und auf Komponenten
basierte Architektur. Das Framework unterstützt dazu eine deklarative
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
Das Standard-Verzeichnis `./modules` kann über die Eigenschaft
`Composite.MODULES` geändert werden.

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
Komponente im UI benötigt wird -- also mit der ersten Anzeige, was über die
[SiteMap](sitemap.md) als zentrales Face-Flow-Management gesteuert wird und so
die Ladezeit stark minimiert, da punktuell jeweils nur für die aktiven
UI-Komponenten benötigten Ressourcen geladen werden.  
Das Auslagern und Laden der Ressourcen zur Laufzeit ist optional und lässt sich
komplett, teilweise und nicht anwenden. Beim Nachladen und Einbinden gibt es
eine feste Reihenfolge: CSS, JS, HTML/Markup.  
Wird die Anfrage einer Ressourcen mit Status 404 beantwortet, wird davon
ausgegangen, dass diese Ressource nicht ausgelagert wurde. Werden Anfragen weder
mit Status 200 oder 404 beantwortet wird von einem Fehler ausgegangen.  
Das Laden von Ressourcen wird nur einmalig mit der ersten Anforderung der
Komponente für das UI ausgeführt.

### CSS

CSS wird als Style-Element in das HEAD-Element eingefügt. Ohne ein HEAD-Element
verursacht das Einfügen einen Fehler.

### JavaScript

JavaScript wird nicht als Element eingefügt, sondern direkt mit der eval-Methode 
ausgeführt. Da die eval-Methode ggf. einen eigenen Namensraum für Variablen
bilden kann, ist es wichtig, die globale Variable besser mit `window[...]` zu
initialisieren.

### HTML

HTML/Markup wird für eine Komponente nur geladen, wenn das HTML-Element der
Komponente selbst kein inneres HTML besitzt und für das Elemente auch nicht die
Attribute `import` oder `output` deklariert wurden. Nur in diesem Fall wird
von einer leeren Komponente mit ausgelagertem HTML/Markup ausgegangen.

TODO:

[Model View Controler](mvc.md) | [Inhalt](README.md) | [Erweiterung](extension.md)
