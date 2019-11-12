[Komponenten](composite.md) | [Inhalt](README.md#erweiterung) | [Test](test.md)
- - -

# Erweiterung

Das JavaScript-API wurde für Seanox aspect-js um einige allgemeine Funktionen
erweitert.


## Inhalt

* [Namespace](#namespace)
* [Element](#element)
* [Math](#math)
* [Object](#object)
* [RegExp](#regexp)
* [String](#string)
* [window](#window)
* [XMLHttpRequest](#xmlhttprequest)


## Namespace

Namespace zu deutsch Namensraum auf Objektebene.  
Namespace kann, vergleichbar mit Paketen in anderen Programmiersprachen,
verwendet werden, um hierarchische Strukturen abzubilden und thematisch
verwandte Komponenten und Ressourcen zu gruppieren. Die Implementierung erfolgt
in JavaScript auf Objektebene. Das bedeutet, dass es kein reales Element der
Programmiersprache ist, sondern durch verkettete statische Objekte repräsentiert
wird. Jede Ebene in dieser Objektkette repräsentiert einen Namensraum. Wie bei
Objekten üblich, werden die Namensräume durch einen Punkt getrennt. 

```javascript
Namespace.using("app.example");
app.example.Model {
    ...
}
```


## Element

### Element.prototype.appendChild

Ändert die ursprüngliche Methode zur Unterstützung von Knoten als NodeList und
Array. Wenn die Option `exclusive` verwendet wird, werden bestehende Kinder
zuerst entfernt.

```javascript
var nodes = [];
nodes.push(document.createElement("a"));
nodes.push(document.createElement("a"));
nodes.push(document.createElement("a"));

document.body.appendChild(nodes);

document.body.appendChild(nodes, true);
```


## Math

### Math.uniqueId

Statische Funktion zur Erzeugung einer alhpanumerischen (U)UID mit fester Länge.  
Die Qualität der (U)UID ist abhängig von ihrer Länge.

```javascript
Math.uniqueId()
    returns e.g. "42X3IUW7622CKY02"
    
Math.uniqueId(32)
    returns e.g. "SPH507D0C5SQ1EP5107HD3514K08T8H1"
```


### Math.uniqueSerialId

Statische Funktion zur Erzeugung einer alhpanumerischen (U)UID mit fester Länge
und einem seriellen Bezug zur Zeit.  
Die Qualität der (U)UID ist abhängig von ihrer Länge.

```javascript
Math.uniqueSerialId()
    returns e.g. "0GQ96VN87ZZ2JTYY"
    
Math.uniqueSerialId(32)
    returns e.g. "65RQR5X5URNGO3H087ZZ2JTYZ"
```


## Object

### Object.prototype.ordinal

Funktion zum Abrufen der ID eines Objekts.  
Die ID wird kontinuierlich erstellt und soll helfen, wenn zur Laufzeit eine
eindeutige ID benötigt wird.

```javascript
var object1 = {};
var object2 = {};

object1.ordinal() != object2.ordinal();

var element1 = document.createElement("a");
var element2 = element1.cloneNode(true);

element1.ordinal() != element2.ordinal();
```


### Object.lookup

Statische Funktion zum Bestimmen eines Objekts über den Namensraum.

```javascript
var earth = {
    europe: {
        germany: {
            countPopulation: function() {
                return 83000000;
            }
        } 
    }   
}

Object.lookup("earth");
    returns object earth
     
Object.lookup("earth.europe.germany");
    returns object earth.europe.germany

Object.lookup("earth.europe.germany.countPopulation");
    returns function earth.europe.germany.countPopulation

Object.lookup("foo");
    returns null
```
 

### Object.exists

Statische Funktion, um zu prüfen, ob ein Objekt in einem Namensraum existiert.

```javascript
var earth = {
    europe: {
        germany: {
            countPopulation: function() {
                return 83000000;
            }
        } 
    }   
}

Object.exists("earth");
    returns true
     
Object.exists("earth.europe.germany");
    returns true

Object.exists("earth.europe.germany.countPopulation");
    returns true

Object.exists("foo");
    returns false
```


## RegExp

### RegExp.quote

Erstellt ein literales Muster für den angegebenen Text.  
Metazeichen oder Escape-Sequenzen im Text verlieren dadurch ihre Bedeutung.

```javascript
RegExp.quote("only a text with a + b (as an example)");
    returns "only a text with a \+ b \(as an example\)"
```


## String

### String.prototype.capitalize

Funktion zur Kapitalisierung von String-Objekten.

```javascript
("hello world").capitalize();
    returns "Hello world"
```


### String.prototype.encodeHex

Funktion zur Kodierung von String-Objekten im Hexadezimalcode.

```javascript
("hello world").encodeHex();
    returns "0x68656C6C6F20776F726C64"
```


### String.prototype.decodeHex

Funktion zur Dekodierung von Hexadezimalcode in String-Objekten.

```javascript
("0x68656C6C6F20776F726C64").decodeHex();
    returns "hello world"
```


### String.prototype.encodeBase64

Funktion zur Codierung von String-Objekten als Base64.

```javascript
("hello world").encodeBase64();
    returns "aGVsbG8gd29ybGQ="
```


### String.prototype.decodeBase64

Funktion zur Dekodierung von Base64 in String-Objekten.

```javascript
("aGVsbG8gd29ybGQ=").decodeBase64();
    returns "hello world"
```


### String.prototype.encodeHtml

Funktion zur Kodierung von HTML-Zeichen in String-Objekten.

```javascript
("<hello world> & abc").encodeHtml();
    returns "&lt;hello world&gt; &amp; abc"
```


### String.prototype.hashCode

Funktion zur Berechnung eines alhpanumerischen Hash-Wertes für String-Objekte.

```javascript
("hello world").hashCode();
    returns "B1OQGUCARUTF1"
```


### String.prototype.unescape

Funktion zur Dekodierung von Slash-Sequences (Steuerzeichen) in String-Objekten.

```javascript
("a\\tb").unescape();
    returns "a   b"
```


## window

### window.serial

Eigenschaft mit der UID für Instanz vom window-Objekt.

```javascript
window.serial
  returns e.g. "2YG490NMYY87TSF1I9R"
```


### window.location.pathcontext

Eigenschaft mit dem Kontextpfad.  
Der Kontextpfad ist Teil der Request-URI und kann mit dem aktuellen
Arbeitsverzeichnis verglichen werden.

```javascript
window.location.pathcontext
  returns e.g. /apps/test for URL https://example.local/apps/test/index.html
```


## XMLHttpRequest

XMLHttpRequest wurde indirekt um Composite-AJAX-Events erweitert.  

```javascript
Composite.EVENT_AJAX_START
Composite.EVENT_AJAX_PROGRESS
Composite.EVENT_AJAX_RECEIVE
Composite.EVENT_AJAX_LOAD
Composite.EVENT_AJAX_ABORT
Composite.EVENT_AJAX_TIMEOUT
Composite.EVENT_AJAX_ERROR
Composite.EVENT_AJAX_END
```

Mit diesen kann zentral und anwendungsweit auf AJAX-Ereignisse reagiert werden.

```javascript
Composite.listen(Composite.EVENT_AJAX_START, function(varargs) {
    show spinner
});

Composite.listen(Composite.EVENT_AJAX_END, function(varargs) {
    hide spinner
});
```

Zu jdem Events lassen sich mehrere Callback-Methoden registrieren, die dann
entsprechend der Reihenfolge bei der Registrierung aufgerufen werden.


- - -

[Komponenten](composite.md) | [Inhalt](README.md#erweiterung) | [Test](test.md)
