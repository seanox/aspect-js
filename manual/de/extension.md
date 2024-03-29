[Reaktives Rendering](reactive.md) | [Inhalt](README.md#api-erweiterungen) | [Ereignisse](events.md)
- - -

# API-Erweiterungen

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
eine Ganzzahl, wird diese Ebene als Array interpretiert.


### Namespace.use

Erstellt einen Namensraum zur &uuml;bergebenen Zeichenkette und gibt diesen als
Objekt zur&uuml;ck. Ohne Argument gibt die Methode den globalen Namensraum
`window` zur&uuml;ck.

```javascript
Namespace.use("app.example");
// creates window["app", {example: {}}]
// returns window["app"] / {example: {}}

Namespace.use("app.example", "more");
// creates window["app", {example: {more: {}}}]
// returns window["app"] / {example: {more: {}}}

Namespace.use()
// returns window
```


### Namespace.lookup

L&ouml;st einen Namensraum auf und ermittelt das Objekt. Wenn der Namensraum
nicht existiert, wird `undefined` zur&uuml;ckgegeben. Ohne Argument gibt die
Methode den globale Namensraum `window` zur&uuml;ck.

```javascript
Namespace.use("app.example.more");

Namespace.lookup("app.example.more")
// returns object window["app"] / {example: {more: {}}}

Namespace.lookup(app.example, "more")
// returns object window["app"] / {example: {more: {}}}

Namespace.lookup()
// returns object window
```


### Namespace.exists

Pr&uuml;ft, ob ein Namensraum existiert.

```javascript
Namespace.use("app.example.more");

Namespace.exists("app.example.more")
// returns boolean true

Namespace.exists(app.example, "more")
// returns boolean true

Namespace.exists(app.example, "nothing")
// returns boolean false

Namespace.exists()
// returns boolean true
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

### Math.unique

Erzeugt eine alphanumerische (U)UID mit fester L&auml;nge, wobei die L&auml;nge
Einfluss auf die Qualit&auml;t der (U)UID hat.

```javascript
Math.unique()
// returns string e.g. "42X3IUW7622CKY02"

Math.unique(32)
// returns string e.g. "SPH507D0C5SQ1EP5107HD3514K08T8H1"
```


### Math.serial

Erzeugt eine zeitbasierte eindeutige alphanumerische UID, die als Text
chronologisch sortierbar ist und die Uhrzeit sowie einen Z&auml;hler
enth&auml;lt, wenn UIDs zeitgleich erstellt werden.

```javascript
Math.serial()
// returns string e.g. "89BFASDV910"
```


## Object

### Object.prototype.ordinal

Gibt die ID eines Objekts zur&uuml;ck. Die ID wird kontinuierlich erstellt und
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
// returns object window["earth"] / {europe: {germany: {countPopulation() {return 83000000;}}}}

Object.lookup("earth.europe.germany");
// returns object window["earth.europe.germany"] / {countPopulation() {return 83000000;}}

Object.lookup("earth.europe.germany.countPopulation");
// returns function window["earth.europe.germany.countPopulation"] / () => {return 83000000;}

Object.lookup("foo");
// returns null
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
// returns booelan true

Object.exists("earth.europe.germany");
// returns booelan true

Object.exists("earth.europe.germany.countPopulation");
// returns booelan true

Object.exists("foo");
// returns booelan false
```


### Object.use

&Auml;quivalent zu [Namespace.use](#namespaceusing). Erstellt einen Namensraum
zur &uuml;bergebenen Zeichenkette. Ohne Argument gibt die Methode den globalen
Namensraum `window` zur&uuml;ck.

```javascript
Object.use("app.example");
// returns object window["app.example"] / {}

Object.use("app.example", "more");
// returns object window["app.example.more"] / {}

Object.use()
// returns object window
```


## RegExp

### RegExp.quote

Erstellt ein literales Muster f&uuml;r den angegebenen Text. Metazeichen oder
Escape-Sequenzen im Text verlieren dadurch ihre Bedeutung.

```javascript
RegExp.quote("only a text with a + b (as an example)");
// returns string "only a text with a \+ b \(as an example\)"
```


## String

### String.prototype.capitalize

Beginnt den String in Grossschreibung.

```javascript
("hello world").capitalize();
// returns string "Hello world"
```


### String.prototype.uncapitalize

Beginnt den String in Kleinschreibung.

```javascript
("Hello World").capitalize();
// returns string "hello World"
```


### String.prototype.encodeHex

Kodiert den String hexadezimal.

```javascript
("hello world").encodeHex();
// returns string "0x68656C6C6F20776F726C64"
```


### String.prototype.decodeHex

Dekodiert den hexadezimalen String.

```javascript
("0x68656C6C6F20776F726C64").decodeHex();
// returns string "hello world"
```


### String.prototype.encodeBase64

Kodiert den String in Base64.

```javascript
("hello world").encodeBase64();
// returns string "aGVsbG8gd29ybGQ="
```


### String.prototype.decodeBase64

Dekodiert den Base64 kodierten String.

```javascript
("aGVsbG8gd29ybGQ=").decodeBase64();
// returns string "hello world"
```


### String.prototype.encodeHtml

Kodiert HTML-Zeichen im String.

```javascript
("<hello world> & abc").encodeHtml();
// returns string "&lt;hello world&gt; &amp; abc"
```


### String.prototype.hashCode

Berechnet einen alphanumerischen Hash-Wert f&uuml;r den String.

```javascript
("hello world").hashCode();
// returns string "B1OQGUCARUTF1"
```


### String.prototype.unescape

Dekodiert Slash-Sequences (Steuerzeichen) im String.

```javascript
("a\\tb").unescape();
// returns string "a   b"
```


## window

### window.serial

Eigenschaft mit der UID f&uuml;r die Instanz vom window-Objekt.

```javascript
window.serial
// returns string e.g. "2YG490NMYY87TSF1I9R"
```


### window.compliant

Erstellt Variablen, Objekte oder Funktionen zu einem definierten Namensraum.
Existiert dazu bereits ein gleichnamiger Eintrag in der API, wird die Methode zu
einem Fehler f&uuml;hren.

Urspr&uuml;nglich wurde die Methode als interner Helfer eingef&uuml;hrt, um
sicherzustellen, dass Manipulationen und Erweiterungen des JavaScript-API
konform sind und es keine Kollisionen mit existierenden API-Bestandteilen gibt.
Da sich die Methode als allgemein hilfreich zur Entwicklung von Modulen erwiesen
hat, wurde sie offiziell in das API von Seanox apect-js aufgenommen.

```javascript
window.compliant("example.variable", "...");
```

Erstellt die Variable `example.variable`. Die Methode f&uuml;hrt zu Fehlern,
wenn das Basis-Objekt `example` nicht existiert oder das Objekt `example` schon
einen Eintrag `variable` enth&auml;lt.

```javascript
window.compliant("example.object", {...});
```

Erstellt das Objekt `example.object`. Die Methode f&uuml;hrt zu Fehlern, wenn
das Basis-Objekt `example` nicht existiert oder das Objekt `example` schon einen
Eintrag `object` enth&auml;lt.

```javascript
window.compliant("example.function", (param1, param2, param3) => {...});
```

Erstellt die Methode `example.function`. Die Methode f&uuml;hrt zu Fehlern, wenn
das Basis-Objekt `example` nicht existiert oder das Objekt `example` schon einen
Eintrag `function` enth&auml;lt.


### window.location.combine

Kombiniert Text-Elemente zu einem Pfad. Die Methode hat eine optimierende
Wirkung auf die Verwendung von Slash und Backslash. Das Ergebnis beginnt immer
mit einem Slash, endet aber ohne diesen.

```javascript
window.location.combine("a", "b", "c")
// returns string "/a/b/c"
```


### window.location.pathcontext

Eigenschaft mit dem Kontextpfad. Der Kontextpfad ist Teil der Request-URI und
kann mit dem aktuellen Arbeitsverzeichnis verglichen werden.

```javascript
window.location.pathcontext
// returns string e.g. /apps/test for URL https://example.local/apps/test/index.html
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
    // show spinner
});

Composite.listen(Composite.EVENT_HTTP_END, function(event, ...varargs) {
    // hide spinner
});
```

Zu allen Ereignissen lassen sich mehrere Callback-Methoden registrieren, die
dann entsprechend der Reihenfolge bei der Registrierung aufgerufen werden.


- - -

[Reaktives Rendering](reactive.md) | [Inhalt](README.md#api-erweiterungen) | [Ereignisse](events.md)
