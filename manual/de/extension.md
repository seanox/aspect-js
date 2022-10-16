[Komponenten](composite.md) | [Inhalt](README.md#erweiterung) | [Ereignisse](events.md)
- - -

# Erweiterung

Die JavaScript-API wurde f&uuml;r Seanox aspect-js um einige allgemeine Funktionen
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
Vergleichbar mit Paketen in anderen Programmiersprachen k&ouml;nnen Namensr&auml;ume zur
Abbildung hierarchischer Strukturen und zur Gruppierung thematisch verwandter
Komponenten und Ressourcen genutzt werden.  
Die Implementierung erfolgt in JavaScript auf Objektebene.  
Das heisst, es ist kein reales Element der Programmiersprache, sondern wird
durch das Verketten statischer Objekte abgebildet.  
Jede Ebene in dieser Objektkette repr&auml;sentiert einen Namensraum.  
Wie f&uuml;r die Bezeichner von Objekten typisch, verwenden auch Namensr&auml;ume
Buchstaben, Zahlen und Unterstriche, die durch Punkte getrennt werden. Als
Besonderheit werden auch Arrays unterst&uuml;tzt. Wenn eine Objektebene im Namensraum
eine reine Zahl ist, wird ein Array angenommen


### Namespace.using

Erstellt einen Namensraum aus der &uuml;bergeben Zeichenkette.  
Ohne Argumente gibt die Methode den globale Namensraum `window` zur&uuml;ck.  
Die Methode hat verschiedene Signaturen.

```javascript
Namespace.using("app.example");
app.example {
    ...
}

Namespace.using("app.example", "more");
app.example.more {
    ...
}

Namespace.using()
    returns window
```
  

### Namespace.locate

Validiert einen angeforderten Namensraum und erzeugt ein entsprechendes
Meta-Objekt.  
Die Methode hat verschiedene Signaturen.

```javascript
Namespace.using("app.example.more");

Namespace.locate("app.example.more")
    returns {scope:app.example.more, namespace:"app.example.more"}

Namespace.locate(app.example, "more")
    returns {scope:app.example.more, namespace:"app.example.more"}

Namespace.locate()
    returns window
```


### Namespace.lookup

L&ouml;st einen Namensraum auf und ermittelt das Objekt.  
Wenn der Namensraum nicht existiert, wird `null` zur&uuml;ckgegeben.  
Ohne Argumente gibt die Methode den globale Namensraum `window` zur&uuml;ck.  
Die Methode hat verschiedene Signaturen.

```javascript
Namespace.using("app.example.more");

Namespace.lookup("app.example.more")
    returns app.example.more

Namespace.lookup(app.example, "more")
    returns app.example.more

Namespace.lookup()
    returns window
```


### Namespace.exists

Pr&uuml;ft, ob ein Namensraum existiert.  
Die Methode hat verschiedene Signaturen.

```javascript
Namespace.using("app.example.more");

Namespace.exists("app.example.more")
    returns true

Namespace.exists(app.example, "more")
    returns true
  
Namespace.exists(app.example, "nothing")
    returns false

Namespace.exists()
    returns true
```


## Element

### Element.prototype.appendChild

&Auml;ndert die urspr&uuml;ngliche Methode zur Unterst&uuml;tzung von Knoten als NodeList und
Array. Wenn die Option `exclusive` verwendet wird, werden bestehende Kinder
zuerst entfernt.

```javascript
const nodes = [];
nodes.push(document.createElement("a"));
nodes.push(document.createElement("a"));
nodes.push(document.createElement("a"));

document.body.appendChild(nodes);

document.body.appendChild(nodes, true);
```


## Math

### Math.uniqueId

Statische Funktion zur Erzeugung einer alhpanumerischen (U)UID mit fester L&auml;nge.  
Die Qualit&auml;t der (U)UID ist abh&auml;ngig von ihrer L&auml;nge.

```javascript
Math.uniqueId()
    returns e.g. "42X3IUW7622CKY02"
  
Math.uniqueId(32)
    returns e.g. "SPH507D0C5SQ1EP5107HD3514K08T8H1"
```


### Math.uniqueSerialId

Statische Funktion zur Erzeugung einer alhpanumerischen (U)UID mit fester L&auml;nge
und einem seriellen Bezug zur Zeit.  
Die Qualit&auml;t der (U)UID ist abh&auml;ngig von ihrer L&auml;nge.

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
eindeutige ID ben&ouml;tigt wird.

```javascript
const object1 = {};
const object2 = {};

object1.ordinal() != object2.ordinal();

const element1 = document.createElement("a");
const element2 = element1.cloneNode(true);

element1.ordinal() != element2.ordinal();
```


### Object.lookup

Statische Funktion zum Bestimmen eines Objekts &uuml;ber den Namensraum.

```javascript
const earth = {
    europe: {
        germany: {
            countPopulation() {
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

Statische Funktion, um zu pr&uuml;fen, ob ein Objekt in einem Namensraum existiert.

```javascript
const earth = {
    europe: {
        germany: {
            countPopulation() {
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


### Object.using

&Auml;quivalent zu [Namespace.using](#namespaceusing) als statische Object-Funktion.  
Erstellt einen Namensraum aus der &uuml;bergeben Zeichenkette.  
Ohne Argumente gibt die Methode den globale Namensraum `window` zur&uuml;ck.  
Die Methode hat verschiedene Signaturen.

```javascript
Object.using("app.example");
app.example {
    ...
}

Object.using("app.example", "more");
app.example.more {
    ...
}

Object.using()
    returns window
```


## RegExp

### RegExp.quote

Erstellt ein literales Muster f&uuml;r den angegebenen Text.  
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


### String.prototype.uncapitalize

Funktion zur Dekapitalisierung von String-Objekten.

```javascript
("Hello World").capitalize();
    returns "hello World"
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

Funktion zur Kodierung von String-Objekten als Base64.

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

Funktion zur Berechnung eines alhpanumerischen Hash-Wertes f&uuml;r String-Objekte.

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

Eigenschaft mit der UID f&uuml;r Instanz vom window-Objekt.

```javascript
window.serial
  returns e.g. "2YG490NMYY87TSF1I9R"
```


### window.location.combine

Kombiniert Pfade zu einem neuen Pfad.  
Die Methode hat eine optimierende Wirkung auf die Verwendung von Slash und
Backslash. Das Ergebnis beginnt immer mit einem Slash, endet aber ohne diesen.

```javascript
window.location.combine("a", "b", "c")
    returns "/a/b/c"
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

XMLHttpRequest wurde indirekt um Composite-HTTP-Events erweitert.  

```javascript
Composite.EVENT_HTTP_START
Composite.EVENT_HTTP_PROGRESS
Composite.EVENT_HTTP_RECEIVE
Composite.EVENT_HTTP_LOAD
Composite.EVENT_HTTP_ABORT
Composite.EVENT_HTTP_TIMEOUT
Composite.EVENT_HTTP_ERROR
Composite.EVENT_HTTP_END
```

Mit diesen kann zentral und anwendungsweit auf HTTP-Ereignisse reagiert werden.

```javascript
Composite.listen(Composite.EVENT_HTTP_START, function(...varargs) {
    show spinner
});

Composite.listen(Composite.EVENT_HTTP_END, function(...varargs) {
    hide spinner
});
```

Zu jedem Events lassen sich mehrere Callback-Methoden registrieren, die dann
entsprechend der Reihenfolge bei der Registrierung aufgerufen werden.


- - -

[Komponenten](composite.md) | [Inhalt](README.md#erweiterung) | [Ereignisse](events.md)
