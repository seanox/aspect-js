[Model View Controler](mvc.md) | [Inhalt](README.md#komponenten) | [Erweiterung](extension.md)
- - -

# Komponenten

Die Implementierung von Seanox aspect-js ist auf eine modulare und auf
Komponenten basierte Architektur ausgerichtet. Das Framework unterstützt dazu
eine deklarative Kennzeichnung von Komponenten im Markup, die Auslagerung und
das automatische Laden von Ressourcen, sowie ein automatisches
Object/Model-Binding.


## Inhalt

* [Begriffe](#begriffe)
  * [Modul](#modul)
  * [Komponente](#komponente)
  * [Composite](#composite)
* [Aufbau](#aufbau)
* [Auslagerung](#auslagerung)
* [Laden](#laden)
  * [CSS](#css)
  * [JavaScript](#javascript)
  * [HTML](#html)
* [Common Standard-Komponente](#common-standard-komponente)  
  
  
# Begriffe


## Modul

Ein Modul stellt eine geschlossene funktionale Programmeinheit dar, die meist
als Programmbibliothek bereitgestellt wird.


## Komponente

Eine Komponente bezeichnet einen funktional und/oder technisch eigenständigen
Bestandteil, der aus einem oder mehreren Modulen bestehen kann oder ein Modul
kann eine oder mehrere Komponenten bereitstellen.


## Composite

Ein Composite bezeichnet eine funktional eigenständige Komponente die sich aus
Markup, CSS und JavaScript(-Model) sowie optional aus weiteren Ressourcen
zusammensetzen kann.

  
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


## Auslagerung

Das innere Markup, CSS und JavaScript lassen sich ins Dateisystem auslagern.  
Das Standard-Verzeichnis `./modules` kann über die Eigenschaft
`Composite.MODULES` geändert werden.  
Der Dateiname der ausgelagerten Ressourcen leitet sich von der ID des als
Composite gekennzeichneten HTML-Elements ab. Welche Ressourcen bzw. Teile der
Komponente ausgelagert werden kann für jede Komponente individuell entschieden
werden. 

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

Das Laden der Ressourcen und das Object/Model-Binding erfolgt partiell, wenn die
Komponente im UI benötigt wird, was die [SiteMap](sitemap.md) als zentrales
Face-Flow-Management steuert und so die Ladezeit stark minimiert, da
situationsabhängig nur die für die aktiven UI-Komponenten benötigten Ressourcen
geladen werden.  
Das Auslagern und Laden der Ressourcen zur Laufzeit ist optional und lässt sich
komplett, teilweise und nicht anwenden. Beim Nachladen und Einbinden gibt es
eine feste Reihenfolge: CSS, JS, HTML/Markup.  
Wird die Anfrage einer Ressourcen mit Status 404 beantwortet, wird davon
ausgegangen, dass diese Ressource nicht ausgelagert wurde. Werden Anfragen weder
mit Status 200 oder 404 beantwortet wird von einem Fehler ausgegangen.  
Das Laden von Ressourcen wird nur einmalig mit der ersten Anforderung der
Komponente für das UI ausgeführt und der Inhalt zwischengespeichert.


### CSS

CSS wird als Style-Element in das HEAD-Element eingefügt. Ohne ein HEAD-Element
verursacht das Einfügen einen Fehler.


### JavaScript

JavaScript wird nicht als Element eingefügt, sondern direkt mit der eval-Methode 
ausgeführt. Da die eval-Methode ggf. einen eigenen Namensraum für Variablen
bilden kann, ist es wichtig, die globale Variable mit `window[...]` zu
initialisieren.

```javascript
window['login'] = {
    validate(element, value) {
    }
    logon: {
        onClick(event) {
        }
    }
}
```


### HTML

HTML/Markup wird für eine Komponente nur geladen, wenn das HTML-Element der
Komponente selbst kein inneres HTML besitzt und für das Elemente auch nicht die
Attribute `import` oder `output` deklariert wurden. Nur in diesem Fall wird
von einer leeren Komponente mit ausgelagertem HTML/Markup ausgegangen.


## Common Standard-Komponente

Mit dem Laden der Seite und der Initialisierung des Frameworks und der Anwendung
wird automatisch auch die Commons-Komponente im Modul-Verzeichnis geladen, die
aus der JavaScript-Datei `common.js` und/oder dem CSS-Stylesheet `common.css`
bestehen kann. Beide Dateien sind zur Ablage initialer und anwendungsweiter
Logik bzw. Styles gedacht.

```
+- modules
|  |
|  +- common.css
|  +- common.js
|  +- ...
|
+- index.html
```

## Object/Model-Binding

TODO:


- - -

[Model View Controler](mvc.md) | [Inhalt](README.md#komponenten) | [Erweiterung](extension.md)
