[Reaktives Rendering](reactive.md) | [Inhalt](README.md#erweiterung) | [Ereignisse](events.md)
- - -

# Erweiterung

Das JavaScript-API wurde f&uuml;r Seanox aspect-js um einige allgemeine
Funktionen erweitert.


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
eine Ganzzahl, wird diese Ebene als Array verwendet.


### Namespace.using

Erstellt einen Namensraum zur &uuml;bergebenen Zeichenkette und gibt diesen als
Objekt zur&uuml;ck. Ohne Argumente gibt die Methode den globalen Namensraum
`window` zur&uuml;ck.

```javascript
Namespace.using("app.example");
    creates window["app", {example: {}}]
    returns window["app"] / {example: {}}

Namespace.using("app.example", "more");
    creates window["app", {example: {more: {}}}]
    returns window["app"] / {example: {more: {}}}

Namespace.using()
    returns window
```


### Namespace.lookup

L&ouml;st einen Namensraum auf und ermittelt das Objekt. Wenn der Namensraum
nicht existiert, wird `undefined` zur&uuml;ckgegeben. Ohne Argumente gibt die
Methode den globale Namensraum `window` zur&uuml;ck.

```javascript
Namespace.using("app.example.more");

Namespace.lookup("app.example.more")
    returns object window["app"] / {example: {more: {}}}

Namespace.lookup(app.example, "more")
    returns object window["app"] / {example: {more: {}}}

Namespace.lookup()
    returns object window
```


### Namespace.exists

Pr&uuml;ft, ob ein Namensraum existiert.

```javascript
Namespace.using("app.example.more");

Namespace.exists("app.example.more")
    returns boolean true

Namespace.exists(app.example, "more")
    returns boolean true

Namespace.exists(app.example, "nothing")
    returns boolean false

Namespace.exists()
    returns boolean true
```


## Element

### Element.prototype.appendChild

&Auml;ndert die urspr&uuml;ngliche Methode zur Unterst&uuml;tzung von Knoten als
NodeList und Array. Wenn die Option `exclusive` verwendet wird, werden 
bestehende Kinder zuerst entfernt.

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

Erzeugt eine alphanumerische (U)UID mit fester L&auml;nge, wobei die L&auml;nge
Einfluss auf die Qualit&auml;t der (U)UID hat.

```javascript
Math.uniqueId()
    returns string e.g. "42X3IUW7622CKY02"

Math.uniqueId(32)
    returns string e.g. "SPH507D0C5SQ1EP5107HD3514K08T8H1"
```


### Math.uniqueSerialId

Erzeugt eine alphanumerische (U)UID mit fester L&auml;nge und einem seriellen
Bezug zur Zeit, wobei die L&auml;nge Einfluss auf die Qualit&auml;t der (U)UID
hat.

```javascript
Math.uniqueSerialId()
    returns string e.g. "0GQ96VN87ZZ2JTYY"

Math.uniqueSerialId(32)
    returns string e.g. "65RQR5X5URNGO3H087ZZ2JTYZ"
```


## Object

### Object.prototype.ordinal

Git die ID eines Objekts zur&uuml;ck. Die ID wird kontinuierlich erstellt und
soll helfen, wenn zur Laufzeit eine eindeutige ID ben&ouml;tigt wird.

```javascript
const object1 = {};
const object2 = {};

object1.ordinal() != object2.ordinal();

const element1 = document.createElement("a");
const element2 = element1.cloneNode(true);

element1.ordinal() != element2.ordinal();
```


### Object.lookup

&Auml;quivalent zu [Namespace.lookup](#namespacelookup). Ermittelt ein Objekt zu
einem Namensraum.

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
    returns object window["earth"] / {europe: {germany: {countPopulation() {return 83000000;}}}}

Object.lookup("earth.europe.germany");
    returns object window["earth.europe.germany"] / {countPopulation() {return 83000000;}}

Object.lookup("earth.europe.germany.countPopulation");
    returns function window["earth.europe.germany.countPopulation"] / () => {return 83000000;}

Object.lookup("foo");
    returns null
```
 

### Object.exists

&Auml;quivalent zu [Namespace.exists](#namespaceexists). Pr&uuml;ft, ob ein
Objekt in einem Namensraum existiert.

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
    returns booelan true

Object.exists("earth.europe.germany");
    returns booelan true

Object.exists("earth.europe.germany.countPopulation");
    returns booelan true

Object.exists("foo");
    returns booelan false
```


### Object.using

&Auml;quivalent zu [Namespace.using](#namespaceusing). Erstellt einen Namensraum
zur &uuml;bergebenen Zeichenkette. Ohne Argumente gibt die Methode den globalen
Namensraum `window` zur&uuml;ck.

```javascript
Object.using("app.example");
    returns object window["app.example"] / {}

Object.using("app.example", "more");
    returns object window["app.example.more"] / {}
}

Object.using()
    returns object window
```


## RegExp

### RegExp.quote

Erstellt ein literales Muster f&uuml;r den angegebenen Text. Metazeichen oder
Escape-Sequenzen im Text verlieren dadurch ihre Bedeutung.

```javascript
RegExp.quote("only a text with a + b (as an example)");
    returns string "only a text with a \+ b \(as an example\)"
```


## String

### String.prototype.capitalize

Beginnt den String in Grossschreibung.

```javascript
("hello world").capitalize();
    returns string "Hello world"
```


### String.prototype.uncapitalize

Beginnt den String in Kleinschreibung.

```javascript
("Hello World").capitalize();
    returns string "hello World"
```


### String.prototype.encodeHex

Kodiert den String hexadezimal.

```javascript
("hello world").encodeHex();
    returns string "0x68656C6C6F20776F726C64"
```


### String.prototype.decodeHex

Dekodiert den hexadezimalen String.

```javascript
("0x68656C6C6F20776F726C64").decodeHex();
    returns string "hello world"
```


### String.prototype.encodeBase64

Kodiert den String in Base64.

```javascript
("hello world").encodeBase64();
    returns string "aGVsbG8gd29ybGQ="
```


### String.prototype.decodeBase64

Dekodiert den Base64 kodierten String.

```javascript
("aGVsbG8gd29ybGQ=").decodeBase64();
    returns string "hello world"
```


### String.prototype.encodeHtml

Kodiert HTML-Zeichen im String.

```javascript
("<hello world> & abc").encodeHtml();
    returns string "&lt;hello world&gt; &amp; abc"
```


### String.prototype.hashCode

Berechnet einen alphanumerischen Hash-Wert f&uuml;r den String.

```javascript
("hello world").hashCode();
    returns string "B1OQGUCARUTF1"
```


### String.prototype.unescape

Dekodiert Slash-Sequences (Steuerzeichen) im String.

```javascript
("a\\tb").unescape();
    returns string "a   b"
```


## window

### window.serial

Eigenschaft mit der UID f&uuml;r die Instanz vom window-Objekt.

```javascript
window.serial
    returns string e.g. "2YG490NMYY87TSF1I9R"
```


### window.location.combine

Kombiniert Text-Elemente zu einem Pfad. Die Methode hat eine optimierende
Wirkung auf die Verwendung von Slash und Backslash. Das Ergebnis beginnt immer
mit einem Slash, endet aber ohne diesen.

```javascript
window.location.combine("a", "b", "c")
    returns string "/a/b/c"
```


### window.location.pathcontext

Eigenschaft mit dem Kontextpfad. Der Kontextpfad ist Teil der Request-URI und
kann mit dem aktuellen Arbeitsverzeichnis verglichen werden.

```javascript
window.location.pathcontext
    returns string e.g. /apps/test for URL https://example.local/apps/test/index.html
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
Composite.listen(Composite.EVENT_HTTP_START, function(event, ...varargs) {
    show spinner
});

Composite.listen(Composite.EVENT_HTTP_END, function(event, ...varargs) {
    hide spinner
});
```

Zu allen Ereignissen lassen sich mehrere Callback-Methoden registrieren, die
dann entsprechend der Reihenfolge bei der Registrierung aufgerufen werden.


- - -

[Reaktives Rendering](reactive.md) | [Inhalt](README.md#erweiterung) | [Ereignisse](events.md)
