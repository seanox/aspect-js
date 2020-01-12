[Ereignisse](events.md) | [Inhalt](README.md#test)
- - -

# Test

Die Test-API unterst�tzt die Implementierung und Ausf�hrung von
Integrationstests und kann f�r Suiten (suite), Szenarien (scenario) und einzelne
Testf�lle (case) verwendet werden.

Als modularer Bestandteil von Seanox aspect-js ist die Test-API in jedem Release
enthalten, der sich ohne Probleme entfernen l�sst. Da die Test-API einige
Besonderheiten in Bezug auf Fehlerbehandlung und Konsolen-Ausgabe bewirkt, muss
die Test-API zur Laufzeit bewusst aktiviert werden.

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

Der kleinste Bestandteil in einem Integrationstest, der hier als "Task"
verwendet wird, da "Case" ein Schl�sselwort im JavaScript ist. Es kann allein
implementiert werden, wird aber immer in einem Szenario verwendet.

```javascript
Test.activate();

Test.create({test() {
    Assert.assertTrue(true);
}});

Test.start();
```

Task ist prim�r ein Meta-Objekt.  

```
{name:..., test:..., timeout:..., expected:..., ignore:...}
```


### name

Optionaler Name vom Testfall.


### test

Die implementierte Methode, die als Testfall ausgef�hrt werden soll.


### timeout

Optionale Angabe der maximalen Laufzeit des Testfalls in Millisekunden.  
Das �berschreiten von diesem Wert f�hrt zum Ausfall des Tests.  
Es wird ein Wert gr�sser als 0 erwartet, ansonsten wird der Timeout ignoriert.


### expected

Optional, um das Auftreten von definierten Fehlern zu testen.  
Der Fehler muss auftreten, damit der Test erfolgreich ist.  
Als Wert wird ein Fehlerobjekt oder ein RegExp erwartet.

### ignore

Optional true, wenn der Test ignoriert werden soll.


## Szenario

Ein Szenario ist eine Abfolge von vielen Testf�llen (Tasks).

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

Eine Suite ist ein komplexes Paket aus verschiedenen Testf�llen, Szenarien und
anderen Suiten. In der Regel besteht eine Suite aus verschiedenen Dateien, die
dann einen komplexen Test darstellen. Ein Beispiel f�r eine gute Suite ist eine
Kaskade von verschiedenen Dateien und wo der Test in jeder Datei und an jedem
Stelle gestartet werden kann. Dies erm�glicht einen Integrationstest auf
verschiedenen Ebenen und mit unterschiedlicher Komplexit�t.


## Assert

Die Testf�lle werden mit Behauptungen (Assertions) implementiert. Die Test-API
bietet elementare Aussagen, die erweitert werden k�nnen. Die Funktion ist
einfach. Wenn eine Behauptung nicht wahr ist, tritt ein Fehler auf.


### assertTrue

Behauptet, dass ein Wert `true` ist.  
Ist die Behauptung unwahr, f�hrt dies zu einem Fehler mit optionaler Meldung.  
Die Methode hat unterschiedliche Signaturen.

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

Behauptet, dass ein Wert `false` ist, als Negation von `Assert.assertTrue(....)`.  
Ist die Behauptung unwahr, f�hrt dies zu einem Fehler mit optionaler Meldung.  
Die Methode hat unterschiedliche Signaturen.

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
Unterschied zwischen identisch und gleich: `=== / ==` oder `!== / !=`  
Ist die Behauptung unwahr, f�hrt dies zu einem Fehler mit optionaler Meldung.  
Die Methode hat unterschiedliche Signaturen.

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
  
Behauptet, dass zwei Werte nicht identisch sind, als Negation von `Assert.assertEquals(....)`.  
Unterschied zwischen identisch und gleich: `=== / ==` oder `!== / !=`  
Ist die Behauptung unwahr, f�hrt dies zu einem Fehler mit optionaler Meldung.  
Die Methode hat unterschiedliche Signaturen.

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
Ist die Behauptung unwahr, f�hrt dies zu einem Fehler mit optionaler Meldung.  
Die Methode hat unterschiedliche Signaturen.

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
  
Behauptet, dass zwei Werte nicht gleich sind, als Negation von `Assert.assertSame(....)`.  
Unterschied zwischen identisch und gleich: `=== / ==` oder `!== / !=`  
Ist die Behauptung unwahr, f�hrt dies zu einem Fehler mit optionaler Meldung.  
Die Methode hat unterschiedliche Signaturen.

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
Ist die Behauptung unwahr, f�hrt dies zu einem Fehler mit optionaler Meldung.  
Die Methode hat unterschiedliche Signaturen.

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

Behauptet, dass ein Wert nicht `null` ist, als Negation von `Assert.assertNull(....)`.  
Ist die Behauptung unwahr, f�hrt dies zu einem Fehler mit optionaler Meldung.  
Die Methode hat unterschiedliche Signaturen.

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


### fail

Verusacht das Scheitern eines Test mit einer optionaler Meldung.  
Die Methode hat unterschiedliche Signaturen.

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

Optional kann die Test-API mit jedem Start konfiguriert werden.  
Als Parameter wird ein Meta-Objekt erwartet. Die darin enthaltene Konfiguration
wird partiell �bernommen und unbekanntes wird ignoriert.

```javascript
Test.start({auto: boolean, ouput: {...}, monitor: {...}});
```


### auto

Option die den Start beim Laden der Seite ausl�st.  
Wenn die Seite bereits geladen ist, wird der Parameter auto ignoriert und der
Start sofort ausgef�hrt.

```javascript
Test.start({auto: true});
```


### output

Funktion oder Objekt zur Ausgabe von Meldungen und Fehlern.  
Wenn nicht angegeben, wird das console-Objekt verwendet.

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

�berwacht den Testablauf und wird w�hrend der Ausf�hrung �ber die verschiedenen
Schritte und Status informiert. Der Monitor kann auch f�r die Datenausgabe
verwendet werden und z.B. die Ausgabe in ein DOM-Element umleiten.  
Der Monitor ist optional. Ohne diesen werden Informationen zum Testverlauf in
der Konsole ausgegeben.

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
        Aufruf der Methode bevor eine Testaufgabe ausgef�hrt wird.
    },
  
    response(status) {
        Aufruf der Methode nach der Ausf�hrung einer Testaufgabe.
        Hier ist das Ergebnis der Testaufgabe enthalten.
    },
  
    finish(status) {
        Aufruf der Methode, wenn alle Testaufgaben abgeschlossen sind.
    }
}});
```

Allen Monitor-Methoden wird der aktuelle Status als Meta-Objekt �bergeben.  
Der Status enth�lt Details zum aktuellen Test und zur Warteschlange. Die Details
sind schreibgesch�tzt und k�nnen nicht ge�ndert werden.

```javascript
{
    task: {
        title:
            Titel der Testaufgabe,
        meta:
            Meta-Informationen zum Test (name, test, timeout, expected,
            serial),
        running:
            Kennzeichen, wenn die Testaufgabe ausgef�hrt wird.
        timing:
            Zeitpunkt vom Beginn der Testaufgabe in Millisekunden.
        timeout:
            Optionale Zeit in Millisekunden, zu der ein Timeout
            erwartet wird.
        duration:
            Gesamtausf�hrungszeit der Testaufgabe in Millisekunden nach
            dem Ende der Testaufgabe.
        error:
            Optional, wenn ein unerwarteter Fehler (auch Assertion-Fehler)
            aufgetreten ist, der die Testaufgabe beendet hat.
    },
    queue: {
        timing:
            Zeitpunkt vom Beginn in Millisekunden,
        size:
            urspr�ngliche Anzahl von Testf�llen,
        length:
            Anzahl ausstehender Tests,
        progress:
            Anzahl durchgef�hrter Tests,
        lock:
            Indikator, wenn die Queue zur Ausf�hrung eines Test wartet,
        faults:
            Anzahl der erkannten Fehler  
    }
}
```


## Output

Als Entwicklungswerkzeug stellen Browser eine Konsolenausgabe bereit, die zur
Protokollierung von Informationen verwendet werden kann.  
Die Protokollierung unterst�tzt verschiedene Kan�le bzw. Stufen (Level): LOG,
WARN, ERROR und INFO.

```javascript
console.log(message);
console.warn(message);
console.error(message);
console.info(message);
```

Um die Konsolenausgabe in Tests einbeziehen zu k�nnen, unterst�tzt die
aktivierte Test-API Weiterleitungen (Forwarding), Listener und Puffer (Buffer)
f�r die Konsolenausgabe.


### Forwarding

Das Forwarding l�uft komplett im Hintergrund und verteilt die Ausgaben an die
Browser-Konsolenausgabe und an die Komponenten der Test-API. Bei (I)Frames wird
die Ausgabe an umschliessende bzw. �bergeordnete Window-Objekte weitergeleitet
und ist dort mit aktivierter Test-API per Buffer und Listener zug�nglich.


### Buffer

Bei aktivierter Test-API wird die JavaScript-API vom console-Objekt um den
Buffer output erweitert. Der Buffer enth�lt Zwischenspeicher f�r die Level: LOG,
WARN, ERROR und INFO sowie eine Methode zum Leeren.

```javascript
var log   = console.output.log;
var warn  = console.output.warn;
var error = console.output.error;
var info  = console.output.info;

console.output.clear();
```


### Listener

F�r die Konsolenausgabe k�nnen Callback-Methoden als Listener etabliert werden.

```javascript
console.listen(function(level, message) {
    message = Array.from(arguments).slice(1);
    ...
});
```

Die Callback-Methoden werden dann bei jeder Konsolenausgabe unter Angabe vom
Log-Level, der als erster Parameter �bergeben wird, aufgerufen. Die weitere
Anzahl von Parametern ist variabel und abh�ngig vom initialen Aufruf der
korrespondierenden console-Methoden. Womit es oft einfacher ist `arguments` zu
verwenden.


## Monitoring

Das Monitoring �berwacht den Testablauf w�hrend der Ausf�hrung und wird �ber die
verschiedenen Schritte und Status informiert. Der Monitor ist optional. Ohne
diesen werden Informationen zum Testverlauf in der Konsole ausgegeben.

Details zur Konfiguration und und Verwendung werden im Abschnitt
[Konfiguration - monitor](#monitor) beschrieben.


## Control

Der Testverlauf und die Verarbeitung der einzelnen Tests kann per Test-API
gesteuert werden.

```javascript
Test.start();
Test.start({auto: boolean});
```

Der Start kann manuell oder bei Verwendung von `auto = true` durch das Laden
der Seite erfolgen. Wenn die Seite bereits geladen ist, wird der Parameter
`auto` ignoriert und der Start sofort ausgef�hrt.

```javascript
Test.suspend();
```

Unterbricht die aktuelle Testausf�hrung, die mit `Test.resume()` vom aktuellen
Test fortgesetzt werden kann.

```javascript
Test.resume();
```

Setzt die Testausf�hrung fort, wenn sie zuvor unterbrochen wurde.

```javascript
Test.interrupt();
```

Unterbricht die aktuelle Testausf�hrung und verwirft alle ausstehenden Tests.
Der Testlauf kann mit `Test.start()` neu gestartet werden.

```javascript
Test.status();
```

Macht eine Momentaufnahme des Status des aktuellen Tests.  
Der Status enth�lt Details zum aktuellen Test und zur Warteschlange. Die Details
sind schreibgesch�tzt und k�nnen nicht ge�ndert werden. Wenn kein Test
ausgef�hrt wird, wird `false` zur�ckgegeben.

```javascript
{
    task: {
        title:
            Titel der Testaufgabe,
        meta:
            Meta-Informationen zum Test (name, test, timeout, expected,
            serial),
        running:
            Kennzeichen, wenn die Testaufgabe ausgef�hrt wird.
        timing:
            Zeitpunkt vom Beginn der Testaufgabe in Millisekunden.
        timeout:
            Optionale Zeit in Millisekunden, zu der ein Timeout
            erwartet wird.
        duration:
            Gesamtausf�hrungszeit der Testaufgabe in Millisekunden nach
            dem Ende der Testaufgabe.
        error:
            Optional, wenn ein unerwarteter Fehler (auch Assertion-Fehler)
            aufgetreten ist, der die Testaufgabe beendet hat.
    },
    queue: {
        timing:
            Zeitpunkt vom Beginn in Millisekunden,
        size:
            urspr�ngliche Anzahl von Testf�llen,
        length:
            Anzahl ausstehender Tests,
        progress:
            Anzahl durchgef�hrter Tests,
        lock:
            Indikator, wenn die Queue zur Ausf�hrung eines Test wartet,
        faults:
            Anzahl der erkannten Fehler  
    }
}
```


## Events

Ereignisse (Events) bzw. deren Callback-Methoden sind ein weitere Form zur
�berwachung der Testausf�hrung. Die Callback-Methoden werden f�r entsprechende
Ereignisse bei der Test-API registriert und funktionieren dann �hnlich dem
Monitor.

Liste der verf�gbaren Ereignisse:

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

Mit der Test-API werden auch Erweiterungen des JavaScript-API aktiv.

### Element

#### Element.prototype.typeValue

Methode, die Tastatureingaben f�r Element-Objekte simuliert.
Folgende Ereignisse werden w�hrend der Simulation ausgel�st: 
    focus, keydown, keyup, change

```html
<form action="/api/example" methode="POST">
  <input type="text" id="inputText"/>
  <input type="submit"/> 
</form>
```

```javascript
document.querySelector("#inputText").typeValue("Hello World!");
});  
```
  
  
#### Element.prototype.toPlainString

Methode, die eine einfache Zeichenkette f�r ein Element-Objekt erzeugt.
Die Zeichenkette bassiert auf `Element.prototype.outerHTML`.

```html
<form action="/api/example" methode="POST">
  <input type="text" id="inputText"/>
  <input type="submit"/> 
</form>
});  
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

Methode, um ein Ereignis f�r ein Element auszul�sen.

```javascript
document.queryElement("#button").trigger("click");
```

Aufruf der Methode mit der Option bubbles.  
Entscheidet ob das Ereignis durch die Ereigniskette laufen soll oder nicht.
Standardwert: false

```javascript
document.queryElement("#button").trigger("click", true);
```

Aufruf der Methode mit den Option bubbles und cancel.  
Damit wird festgelegt, ob das Ereignis abgebrochen werden kann.  
Standardwert: true

```javascript
document.queryElement("#button").trigger("click", true, false);
```

  
### Node

#### Node.prototype.toPlainString  

Methode, die eine einfache Zeichenkette f�r ein Knoten-Objekt erzeugt.
Die Zeichenkette bassiert auf `XMLSerializer.serializeToString(node)`.

```javascript
var text = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
         + "<note>"
         + "  <to>Tove</to>"
         + "  <from>Jani</from>"
         + "  <heading>Reminder</heading>"
         + "  <body>Don't forget me this weekend!</body>"
         + "</note>";
  
var parser = new DOMParser();
var xml = parser.parseFromString(text, "text/xml");

var nodes = xml.evaluate("/note", xml, null, XPathResult.ANY_TYPE, null);
var result = nodes.iterateNext();
console.log(result.toPlainString());
```

Output:

```
<note><to>Tove</to><from>Jani</from><heading>Reminder</heading><body>Don't forget me this weekend!</body></note>
```
  

### Object

#### Object.prototype.toPlainString

Methode, die eine einfache Zeichenkette f�r ein Objekt erzeugt.
Die Zeichenkette bassiert auf `JSON.stringify(object)`.

```javascript
var example = {a:1, b:2, c() {return;}};
console.log(example.toPlainString());
```

Output:

```
{"a":1,"b":2}
```


- - -

[Ereignisse](events.md) | [Inhalt](README.md#test)
