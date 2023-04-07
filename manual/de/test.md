[Ereignisse](events.md) | [Inhalt](README.md#test) | [Entwicklung](development.md)
- - -

# Test

Das Test-API unterst&uuml;tzt die Implementierung und Ausf&uuml;hrung von
Integrationstests und kann f&uuml;r Suiten (suite), Szenarien (scenario) und
einzelne Testf&auml;lle (test case) verwendet werden.

Als modularer Bestandteil von Seanox aspect-js ist das Test-API, mit Ausnahme
der core-Versionen, in allen Releases enthalten. Da das Test-API einige
Besonderheiten in Bezug auf Fehlerbehandlung und Konsolen-Ausgabe bewirkt, muss
das Test-API zur Laufzeit bewusst aktiviert werden.

```javascript
Test.activate();

Test.create({test() {
    ...
}});

Test.start();
```


## Inhalt

* [Testfall](#testfall)
  * [name](#name)
  * [test](#test)
  * [timeout](#timeout)
  * [expected](#expected)
  * [ignore](#ignore)
* [Szenario](#szenario)
* [Suite](#suite)
* [Assert](#assert)
  * [assertTrue](#asserttrue)
  * [assertFalse](#assertfalse)
  * [assertEquals](#assertequals)
  * [assertNotEquals](#assertnotequals)
  * [assertSame](#assertsame)
  * [assertNotSame](#assertnotsame)
  * [assertNull](#assertnull)
  * [assertNotNull](#assertnotnull)
  * [assertUndefined](#assertundefined)
  * [assertNotUndefined](#assertnotundefined)
  * [fail](#fail)
* [Konfiguration](#konfiguration)
  * [auto](#auto)
  * [output](#output)
  * [monitor](#monitor)
* [Output](#output-1)
  * [Forwarding](#forwarding)
  * [Buffer](#buffer)
  * [Listener](#listener)
* [Monitoring](#monitoring)
* [Control](#control)
* [Events](#events)
* [Erweiterung](#erweiterung)


## Testfall

Der kleinste Bestandteil in einem Integrationstest, der hier als _Task_
verwendet wird, da _case_ ein Schl&uuml;sselwort im JavaScript ist. Tasks
k&ouml;nnen allein implementiert werden, werden aber meist in einem Szenario
verwendet.

```javascript
Test.activate();

Test.create({test() {
    Assert.assertTrue(true);
}});

Test.start();
```

Task ist prim&auml;r ein Meta-Objekt.

```
{name:..., test:..., timeout:..., expected:..., ignore:...}
```


### name

Optionaler Name vom Testfall.


### test

Die implementierte Methode, die als Testfall ausgef&uuml;hrt werden soll.


### timeout

Optionale Angabe der maximalen Laufzeit des Testfalls in Millisekunden. Das
&Uuml;berschreiten von diesem Wert f&uuml;hrt zum Ausfall des Tests. Es wird ein
Wert gr&ouml;sser als 0 erwartet, ansonsten wird der Timeout ignoriert.


### expected

Optional, um das Auftreten von definierten Fehlern zu testen. Der Fehler muss
auftreten, damit der Test erfolgreich ist. Als Wert wird ein Fehlerobjekt oder
ein RegExp erwartet.


### ignore

Optional true, wenn der Test ignoriert werden soll.


## Szenario

Ein Szenario ist eine Abfolge von vielen Testf&auml;llen (Tasks).

```javascript
Test.activate();

Test.create({test() {
    Assert.assertTrue(true);
}});
Test.create({name:"example", timeout:1000, test() {
    Assert.assertTrue(true);
}});
Test.create({error:Error test() {
    throw new Error();
}});
Test.create({error:/^My Error/i, test() {
    throw new Error("My Error");
}});
Test.create({ignore:true, test() {
    Assert.assertTrue(true);
}});

Test.start();
```


## Suite 

Eine Suite ist ein komplexes Paket aus verschiedenen Testf&auml;llen, Szenarien
und anderen Suiten. In der Regel besteht eine Suite aus verschiedenen Dateien,
die dann einen komplexen Test darstellen. Ein Beispiel f&uuml;r eine gute Suite
ist eine Kaskade von verschiedenen Dateien und wo der Test in jeder Datei und an
jeder Stelle gestartet werden kann. Dies erm&ouml;glicht einen Integrationstest
auf verschiedenen Ebenen und mit unterschiedlicher Komplexit&auml;t.


## Assert

Die Testf&auml;lle werden mit Behauptungen (Assertions) implementiert. Das
Test-API bietet elementare Aussagen, die erweitert werden k&ouml;nnen. Die
Funktionsweise ist einfach: Wenn eine Behauptung nicht wahr ist, tritt ein
Fehler auf, optional mit einer individuellen Fehlermeldung.

__Die Methoden verwenden verschiedene Signaturen, die in den nachfolgenden
Beispielen beschrieben werden.__


### assertTrue

Behauptet, dass ein Wert `true` ist.

```javascript
Test.activate();

Test.create({test() {
    Assert.assertTrue(true);
}});
Test.create({test() {
    Assert.assertTrue("message", true);
}});

Test.start();
```


### assertFalse

Behauptet, dass ein Wert `false` ist, als Negation von
`Assert.assertTrue(....)`.

```javascript
Test.activate();

Test.create({test() {
    Assert.assertFalse(false);
}});
Test.create({test() {
    Assert.assertFalse("message", false);
}});

Test.start();
```


### assertEquals

Behauptet, dass zwei Werte identisch sind.

Unterschied zwischen identisch und gleich: `=== / ==` oder `!== / !=`.

```javascript
Test.activate();

Test.create({test() {
    Assert.assertEquals(expected, value);
}});
Test.create({test() {
    Assert.assertEquals("message", expected, value);
}});

Test.start();
```


### assertNotEquals

Behauptet, dass zwei Werte nicht identisch sind, als Negation von
`Assert.assertEquals(....)`.

Unterschied zwischen identisch und gleich: `=== / ==` oder `!== / !=`

```javascript
Test.activate();

Test.create({test() {
    Assert.assertNotEquals(unexpected, value);
}});
Test.create({test() {
    Assert.assertNotEquals("message", unexpected, value);
}});

Test.start();
```


### assertSame

Behauptet, dass zwei Werte gleich sind.

Unterschied zwischen identisch und gleich: `=== / ==` oder `!== / !=`

```javascript
Test.activate();

Test.create({test() {
    Assert.assertSame(expected, value);
}});
Test.create({test() {
    Assert.assertSame("message", expected, value);
}});

Test.start();
```


### assertNotSame

Behauptet, dass zwei Werte nicht gleich sind, als Negation von
`Assert.assertSame(....)`.

Unterschied zwischen identisch und gleich: `=== / ==` oder `!== / !=`

```javascript
Test.activate();

Test.create({test() {
    Assert.assertNotSame(unexpected, value);
}});
Test.create({test() {
    Assert.assertNotSame("message", unexpected, value);
}});

Test.start();
```


### assertNull

Behauptet, dass ein Wert `null` ist.

```javascript
Test.activate();

Test.create({test() {
    Assert.assertNull(null);
}});
Test.create({test() {
    Assert.assertNull("message", null);
}});

Test.start();
```


### assertNotNull

Behauptet, dass ein Wert nicht `null` ist, als Negation von
`Assert.assertNull(....)`.

```javascript
Test.activate();

Test.create({test() {
    Assert.assertNotNull(null);
}});
Test.create({test() {
    Assert.assertNotNull("message", null);
}});

Test.start();
```


### assertUndefined

Behauptet, dass ein Wert `undefined` ist.

```javascript
Test.activate();

Test.create({test() {
    Assert.assertUndefined(undefined);
}});
Test.create({test() {
    Assert.assertUndefined("message", undefined);
}});

Test.start();
```


### assertNotUndefined

Behauptet, dass ein Wert nicht `undefined` ist, als Negation von
`Assert.assertUndefined(....)`.

```javascript
Test.activate();

Test.create({test() {
    Assert.assertNotUndefined(undefined);
}});
Test.create({test() {
    Assert.assertNotUndefined("message", undefined);
}});

Test.start();
```


### fail

Verursacht das Scheitern eines Tests mit einer optionalen Meldung.

```javascript
Test.activate();

Test.create({test() {
    Assert.fail();
}});
Test.create({test() {
    Assert.fail("message");
}});

Test.start();
```


## Konfiguration

Optional kann das Test-API mit jedem Start konfiguriert werden. Als Parameter
wird ein Meta-Objekt erwartet. Die darin enthaltene Konfiguration wird partiell
&uuml;bernommen und unbekanntes wird ignoriert.

```javascript
Test.start({auto: boolean, ouput: {...}, monitor: {...}});
```


### auto

Option die den Start beim Laden der Seite ausl&ouml;st. Wenn die Seite bereits
geladen ist, wird der Parameter _auto_ ignoriert und der Start sofort
ausgef&uuml;hrt.

```javascript
Test.start({auto: true});
```


### output

Funktion oder Objekt zur Ausgabe von Meldungen und Fehlern. Wenn nicht
angegeben, wird das console-Objekt verwendet.

```javascript
Test.start({output: {
    log(message) {
        ...
    },
    error(message) {
        ...
    }
}});
```


### monitor

&Uuml;berwacht den Testablauf und wird w&auml;hrend der Ausf&uuml;hrung
&uuml;ber die verschiedenen Schritte und Status informiert. Der Monitor kann
auch f&uuml;r die Datenausgabe verwendet werden und z.B. die Ausgabe in ein
DOM-Element umleiten. Der Monitor ist optional. Ohne diesen werden Informationen
zum Testverlauf in der Konsole ausgegeben.

```javascript
Test.start({monitor: {

    start(status) {
        Aufruf der Methode beim Start.
    },

    suspend(status) {
        Aufruf der Methode bei einer Unterbrechung.
    },

    resume(status) {
        Aufruf der Methode beim Fortsetzen des Testverlaufs, wenn
        dieser zuvor unterbrochen wurde.
    },

    interrupt(status) {
        Aufruf der Methode beim Abbruch vom Testlauf.
        Der Testlauf kann nicht fortgesetzt werden.
    },

    perform(status) {
        Aufruf der Methode bevor eine Testaufgabe ausgefuehrt wird.
    },

    response(status) {
        Aufruf der Methode nach der Ausfuehrung einer Testaufgabe.
        Hier ist das Ergebnis der Testaufgabe enthalten.
    },

    finish(status) {
        Aufruf der Methode, wenn alle Testaufgaben abgeschlossen sind.
    }
}});
```

Allen Monitor-Methoden wird der aktuelle Status als Meta-Objekt &uuml;bergeben.
Der Status enth&auml;lt Details zum aktuellen Test und zur Warteschlange. Die
Details sind schreibgesch&uuml;tzt und k&ouml;nnen nicht ge&auml;ndert werden.

```javascript
{
    task: {
        title:
            Titel der Testaufgabe,
        meta:
            Meta-Informationen zum Test (name, test, timeout, expected,
            serial),
        running:
            Kennzeichen, wenn die Testaufgabe ausgefuehrt wird.
        timing:
            Zeitpunkt vom Beginn der Testaufgabe in Millisekunden.
        timeout:
            Optionale Zeit in Millisekunden, zu der ein Timeout
            erwartet wird.
        duration:
            Gesamtausfuehrungszeit der Testaufgabe in Millisekunden nach
            dem Ende der Testaufgabe.
        error:
            Optional, wenn ein unerwarteter Fehler (auch Assertion-Fehler)
            aufgetreten ist, der die Testaufgabe beendet hat.
    },
    queue: {
        timing:
            Zeitpunkt vom Beginn in Millisekunden,
        size:
            urspruengliche Anzahl von Testfaellen,
        length:
            Anzahl ausstehender Tests,
        progress:
            Anzahl durchgefuehrter Tests,
        lock:
            Indikator, wenn die Queue zur Ausfuehrung eines Test wartet,
        faults:
            Anzahl der erkannten Fehler
    }
}
```


## Output

Als Entwicklungswerkzeug stellen Browser eine Konsolenausgabe bereit, die zur
Protokollierung von Informationen verwendet werden kann, wozu verschiedene
Kan&auml;le bzw. Stufen (Level) unterst&uuml;tzt werden:  
    _LOG_, _WARN_, _ERROR_, _INFO_

```javascript
console.log(message);
console.warn(message);
console.error(message);
console.info(message);
```

Um die Konsolenausgabe in Tests einbeziehen zu k&ouml;nnen, unterst&uuml;tzt das
aktivierte Test-API Weiterleitungen (Forwarding), Listener und Puffer (Buffer)
f&uuml;r die Konsolenausgabe.


### Forwarding

Das Forwarding l&auml;uft komplett im Hintergrund und verteilt die Ausgaben an
die Browser-Konsolenausgabe und an die Komponenten vom Test-API. Bei (I)Frames
wird die Ausgabe an umschliessende bzw. &uuml;bergeordnete Window-Objekte
weitergeleitet und ist dort mit aktiviertem Test-API per Buffer und Listener
zug&auml;nglich.


### Buffer

Bei aktiviertem Test-API wird das console-Objekt des JavaScript-API um den
Buffer _output_ erweitert. Der Buffer enth&auml;lt Zwischenspeicher f&uuml;r die
Level: _LOG_, _WARN_, _ERROR_ und _INFO_ sowie eine Methode zum Leeren.

```javascript
const log   = console.output.log;
const warn  = console.output.warn;
const error = console.output.error;
const info  = console.output.info;

console.output.clear();
```


### Listener

F&uuml;r die Konsolenausgabe k&ouml;nnen Callback-Methoden als Listener
etabliert werden.

```javascript
console.listen(function(level, ...parameters) {
    message = parameters[0];
    ...
});
```

Die Callback-Methoden werden dann bei jeder Konsolenausgabe unter Angabe vom
Log-Level, der als erster Parameter &uuml;bergeben wird, aufgerufen. Die weitere
Anzahl von Parametern ist variabel und abh&auml;ngig vom initialen Aufruf der
korrespondierenden console-Methoden. Womit es oft einfacher ist die Spread
Syntax `...` zu verwenden.


## Monitoring

Das Monitoring &uuml;berwacht den Testablauf w&auml;hrend der Ausf&uuml;hrung
und wird &uuml;ber die verschiedenen Schritte und Status informiert. Der Monitor
ist optional. Ohne diesen werden Informationen zum Testverlauf in der Konsole
ausgegeben.

Details zur Konfiguration und Verwendung werden im Abschnitt
[Konfiguration - monitor](#monitor) beschrieben.


## Control

Der Testverlauf und die Verarbeitung der einzelnen Tests kann per Test-API
gesteuert werden.

```javascript
Test.start();
Test.start({auto: boolean});
```

Der Start kann manuell oder bei Verwendung von `auto = true` durch das Laden der
Seite erfolgen. Wenn die Seite bereits geladen ist, wird der Parameter `auto`
ignoriert und der Start sofort ausgef&uuml;hrt.

```javascript
Test.suspend();
```

Unterbricht die aktuelle Testausf&uuml;hrung, die mit `Test.resume()` vom
aktuellen Test fortgesetzt werden kann.

```javascript
Test.resume();
```

Setzt die Testausf&uuml;hrung fort, wenn sie zuvor unterbrochen wurde.

```javascript
Test.interrupt();
```

Unterbricht die aktuelle Testausf&uuml;hrung und verwirft alle ausstehenden
Tests. Der Testlauf kann mit `Test.start()` neu gestartet werden.

```javascript
Test.status();
```

R&uuml;ckgabe einer Momentaufnahme des Status des aktuellen Tests. Der Status
enth&auml;lt Details zum aktuellen Test und zur Warteschlange. Die Details sind
schreibgesch&uuml;tzt und k&ouml;nnen nicht ge&auml;ndert werden. Wenn kein Test
ausgef&uuml;hrt wird, wird `false` zur&uuml;ckgegeben.

```javascript
{
    task: {
        title:
            Titel der Testaufgabe,
        meta:
            Meta-Informationen zum Test (name, test, timeout, expected,
            serial),
        running:
            Kennzeichen, wenn die Testaufgabe ausgefuehrt wird.
        timing:
            Zeitpunkt vom Beginn der Testaufgabe in Millisekunden.
        timeout:
            Optionale Zeit in Millisekunden, zu der ein Timeout
            erwartet wird.
        duration:
            Gesamtausfuehrungszeit der Testaufgabe in Millisekunden nach
            dem Ende der Testaufgabe.
        error:
            Optional, wenn ein unerwarteter Fehler (auch Assertion-Fehler)
            aufgetreten ist, der die Testaufgabe beendet hat.
    },
    queue: {
        timing:
            Zeitpunkt vom Beginn in Millisekunden,
        size:
            urspruengliche Anzahl von Testfuellen,
        length:
            Anzahl ausstehender Tests,
        progress:
            Anzahl durchgefuehrter Tests,
        lock:
            Indikator, wenn die Queue zur Ausfuehrung eines Test wartet,
        faults:
            Anzahl der erkannten Fehler
    }
}
```


## Events

Ereignisse (Events) bzw. deren Callback-Methoden sind eine weitere Form zur
&Uuml;berwachung der Testausf&uuml;hrung. Die Callback-Methoden werden f&uuml;r
entsprechende Ereignisse beim Test-API registriert und funktionieren dann
&auml;hnlich dem Monitor.

Liste der verf&uuml;gbaren Ereignisse:

```javascript
Test.EVENT_INTERRUPT
Test.EVENT_PERFORM
Test.EVENT_RESPONSE
Test.EVENT_RESUME
Test.EVENT_START
Test.EVENT_SUSPEND
```

Beispiele zur Verwendung:

```javascript
Test.listen(Test.EVENT_START, function(event, status) {
    ...
});

Test.listen(Test.EVENT_PERFORM, function(event, status) {
    ...
});

Test.listen(Test.EVENT_FINISH, function(event, status) {
    ...
});
```


## Erweiterung

Mit dem Test-API werden auch Erweiterungen des JavaScript-API aktiv.

### Element

#### Element.prototype.typeValue

Methode, die Tastatureingaben f&uuml;r Element-Objekte simuliert. Folgende
Ereignisse werden w&auml;hrend der Simulation ausgel&ouml;st: 
    _focus_, _keydown_, _keyup_, _change_

```html
<form action="/api/example" methode="POST">
  <input type="text" id="inputText"/>
  <input type="submit"/> 
</form>
```

```javascript
document.querySelector("#inputText").typeValue("Hello World!");
```


#### Element.prototype.toPlainString

Methode, die eine einfache Zeichenkette f&uuml;r ein Element-Objekt erzeugt.
Die Zeichenkette basiert auf `Element.prototype.outerHTML`.

```html
<form action="/api/example" methode="POST">
  <input type="text" id="inputText"/>
  <input type="submit"/> 
</form>
```

```javascript
console.log(document.querySelector("form").toPlainString());
```

Output:

```
<form xmlns="http://www.w3.org/1999/xhtml" action="/api/example" methode="POST">
  <input type="text" id="inputText"/>
  <input type="submit"/> 
</form>
```


#### Element.prototype.trigger

Methode, um ein Ereignis f&uuml;r ein Element auszul&ouml;sen.

```javascript
document.queryElement("#button").trigger("click");
```

Aufruf der Methode mit der Option bubbles. Entscheidet ob das Ereignis durch die
Ereigniskette laufen soll oder nicht.

Standardwert: false

```javascript
document.queryElement("#button").trigger("click", true);
```

Aufruf der Methode mit den Optionen bubbles und cancel. Damit wird festgelegt,
ob das Ereignis abgebrochen werden kann.

Standardwert: true

```javascript
document.queryElement("#button").trigger("click", true, false);
```


### Node

#### Node.prototype.toPlainString

Methode, die eine einfache Zeichenkette f&uuml;r ein Knoten-Objekt erzeugt. Die
Zeichenkette basiert auf `XMLSerializer.serializeToString(node)`.

```javascript
const text = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
         + "<note>"
         + "  <to>Tove</to>"
         + "  <from>Jani</from>"
         + "  <heading>Reminder</heading>"
         + "  <body>Don't forget me this weekend!</body>"
         + "</note>";

const parser = new DOMParser();
const xml = parser.parseFromString(text, "text/xml");

const nodes = xml.evaluate("/note", xml, null, XPathResult.ANY_TYPE, null);
const result = nodes.iterateNext();
console.log(result.toPlainString());
```

Output:

```
<note><to>Tove</to><from>Jani</from><heading>Reminder</heading><body>Don't forget me this weekend!</body></note>
```


### Object

#### Object.prototype.toPlainString

Methode, die eine einfache Zeichenkette f&uuml;r ein Objekt erzeugt. Die
Zeichenkette basiert auf `JSON.stringify(object)`.

```javascript
const example = {a:1, b:2, c() {return;}};
console.log(example.toPlainString());
```

Output:

```
{"a":1,"b":2}
```


- - -

[Ereignisse](events.md) | [Inhalt](README.md#test) | [Entwicklung](development.md)
