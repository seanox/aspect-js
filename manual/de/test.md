[Erweiterung](extension.md) | [Inhalt](README.md#test)
- - -

# Test

Das Test-API unterst�tzt die Implementierung und Ausf�hrung von
Integrationstests und kann f�r Suiten (suite), Szenarien (scenario) und einzelne
Testf�lle (case) verwendet werden.

Als modularer Bestandteil von Seanox aspect-js ist das Test-API in jedem Release
enthalten ist, der sich ohne Probleme entfernen l�sst. Da das Test-API einige
Besonderheiten in Bezug auf Fehlerbehandlung und Konsolen-Ausgabe bewirkt, muss
das Test-API zur Laufzeit bewusst aktiviert werden.

```javascript
Test.activate();

Test.create({test:function() {
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
  * [Output](#output)
  * [Monitor](#monitor)
* [Output](#output-1)
  * [Forwarding](#forwarding)
  * [Buffer](#buffer)
  * [Listener](#listener)
* [Monitoring](#monitoring)
* [Control](#control)
* [Events](#events)


### Testfall

Der kleinste Bestandteil in einem Integrationstest, der hier als "Task"
verwendet wird, da "Case" ein Schl�sselwort im JavaScript ist. Es kann allein
implementiert werden, wird aber immer in einem Szenario verwendet.

```javascript
Test.activate();

Test.create({test:function() {
    Assert.assertTrue(true);
}});

Test.start();
```

Task ist prim�r ein Meta-Objekt.  

```
{name:..., test:..., timeout:..., expected:..., ignore:...}
```


#### name

Optionaler Name vom Testfall.


#### test

Die implementierte Methode, die als Testfall ausgef�hrt werden soll.


#### timeout

Optional Angabe der maximalen Laufzeit des Testfalls in Millisekunden.
Das �berschreiten von diesem Wetr f�hrt zum Ausfall des Tests.  
Es wird ein Wert gr��er als 0 erwartet, ansonsten wird der Timeout ignoriert.


#### expected

Optional, um das Auftreten von definierten Fehlern zu testen.
Der Fehler muss auftreten, damit der Test erfolgreich ist.
Als Wert wird ein Fehlerobjekt oder eine RegExp erwartet.

#### ignore

Optional true, wenn der Test ignoriert werden so


### Szenario

Ein Szenario ist eine Abfolge von vielen Testf�llen (Tasks).

```javascript
Test.activate();

Test.create({test:function() {
    Assert.assertTrue(true);
}});
Test.create({name:"example", timeout:1000, test:function() {
    Assert.assertTrue(true);
}});
Test.create({error:Error test:function() {
    throw new Error();
}});
Test.create({error:/^My Error/i, test:function() {
    throw new Error("My Error");
}});
Test.create({ignore:true, test:function() {
    Assert.assertTrue(true);
}});

Test.start();
```


### Suite 

Eine Suite ist ein komplexes Paket aus verschiedenen Testf�llen, Szenarien und
anderen Suiten. In der Regel besteht eine Suite aus verschiedenen Dateien, die
dann einen komplexen Test darstellen. Ein Beispiel f�r eine gute Suite ist eine
Kaskade von verschiedenen Dateien und wo der Test in jeder Datei und an jedem
Stelle gestartet werden kann. Dies erm�glicht einen Integrationstest auf
verschiedenen Ebenen und mit unterschiedlicher Komplexit�t.

 
### Assert

Die Testf�lle werden mit Behauptungen (Assertions) implementiert. Das Test-API
bietet elementare Aussagen, die erweitert werden k�nnen. Die Funktion ist
einfach. Wenn eine Behauptung nicht wahr ist, tritt ein Fehler auf.


### assertTrue

Behauptet, dass ein Wert `true` ist.  
Ist die Behauptung unwahr, f�hrt dies zu einem Fehler mit optionaler Meldung.   
Die Methode hat unterschiedliche Signaturen.

```javascript
Test.activate();

Test.create({test:function() {
    Assert.assertTrue(true);
}});
Test.create({test:function() {
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

Test.create({test:function() {
    Assert.assertFalse(false);
}});
Test.create({test:function() {
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

Test.create({test:function() {
    Assert.assertEquals(expected, value);
}});
Test.create({test:function() {
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

Test.create({test:function() {
    Assert.assertNotEquals(unexpected, value);
}});
Test.create({test:function() {
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

Test.create({test:function() {
    Assert.assertSame(expected, value);
}});
Test.create({test:function() {
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

Test.create({test:function() {
    Assert.assertNotSame(unexpected, value);
}});
Test.create({test:function() {
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

Test.create({test:function() {
    Assert.assertNull(null);
}});
Test.create({test:function() {
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

Test.create({test:function() {
    Assert.assertNotNull(null);
}});
Test.create({test:function() {
    Assert.assertNotNull("message", null);
}});

Test.start();
```


### fail

Verusacht das Scheitern einen Test mit mit optionalen Meldung.
Die Methode hat unterschiedliche Signaturen.

```javascript
Test.activate();

Test.create({test:function() {
    Assert.fail();
}});
Test.create({test:function() {
    Assert.fail("message");
}});

Test.start();
```


## Konfiguration

Optional kann das Test-API, mit Fokus auf �berwachung konfiguriert werden.  
Die Konfiguration kann einmalig und mehrfach aufgerufen werden. Als Parameter
wird ein Meta-Objekt erwartet. Die darin enthaltene Konfiguration wird partiell
�bernommen und unbekanntes wird ignoriert.


```javascript
Test.configure({
    log:function(message) {
        ...
    },
    error:function(message) {
        ...
    },
    ...
});

Test.configure({
    start:function(status) {
        ...
    },
    perform:function(status) {
        ...
    },
    response:function(status) {
        ...
    },
    
    finish:function(status) {
        ...
    }
});

```


### Output

Funktion oder Objekt zur Ausgabe von Meldungen und Fehlern.  
Wenn nicht angegeben, wird das console-Objekt verwendet.

```javascript
Test.configure({
    log:function(message) {
        ...
    },
    error:function(message) {
        ...
    }
});
```


### Monitor

�berwacht den Testablauf und wird w�hrend der Ausf�hrung �ber die verschiedenen
Schritte und Status informiert. Der Monitor kann auch f�r die Datenausgabe
verwendet werden und z.B. die Ausgabe in ein DOM-Element umleiten.  
Der Monitor ist optional. Ohne diesen werden Informationen zum Testverlauf in
der Konsole ausgegeben.

```javascript
Test.configure({

    start:function(status) {
        Aufruf der Methode beim Start.
    },
    
    suspend:function(status) {
        Aufruf der Methode bei einer Unterbrechung.
    },
    
    resume:function(status) {
        Aufruf der Methode beim Fortgesetzt des Testverlaufs, wenn
        dieser zuvor unterbrochen wurde.
    },
    
    interrupt:function(status) {
        Aufruf der Methode beim Abbruch vom Testlauf.
        Der Testlauf kann nicht fortgesetzt werden.
    },
    
    perform:function(status) {
        Aufruf der Methode bevor eine Testaufgabe ausgef�hrt wird.
    },
    
    response:function(status) {
        Aufruf der Methode nach der Ausf�hrung einer Testaufgabe.
        Hier ist das Ergebnis der Testaufgabe enthalten.
    },
    
    finish:function(status) {
        Aufruf der Methode, wenn alle Testaufgaben abgeschlossen sind.
    }
});
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
            Optional, wenn ein unerwarteter Fehler (auch Asser-Fehler)
            aufgetreten ist, der die Testaufgabe beendet hat.
    },
    queue: {
        timing:
            Zeitpunkt vom Beginn in Millisekunden,
        size:
            urspr�ngliche Anzahl von Testf�llen,
        length:
            Anzahl ausstehenden Tests,
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

Um die Konsolenausgabe in Tests einbeziehen zu k�nnen, unterst�tzt das
aktivierte Test-API Weiterleitungen (Forwarding), Listener und Puffer (Buffer)
f�r die Konsolenausgabe.


### Forwarding

Das Forwarding l�uft komplett im Hintergrund ab und verteilt die Ausgaben an die
Browser-Konsolenausgabe und an die Komponenten der Test-API. Bei (I)Frames wird
die Ausgabe an umschliessende bzw. �bergeordnete Window-Objekte weitergeleitet
und ist dort mit aktiviertem Test-API per Buffer und Listener zug�nglich.


### Buffer

Bei aktiviertem Test-API wird das JavaScript-API vom console-Objekt um den
Buffer output erweitert. Der Buffer enth�lt Zwischenspeicher f�r die Level: LOG,
WARN, ERROR und INFO sowie eine Methoden zum Leeren.

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
Log-Level, das als erstes Parameter �bergeben wird, aufgerufen. Die weitere
Anzahl von Parametern ist variable und abh�ngig vom initialen Aufruf der
korrespondierenden console-Methoden. Womit es oft einfacher ist `arguments` zu
verwenden.


### Monitoring

Das Monitoring �berwacht den Testablauf w�hrend der Ausf�hrung wird �ber die
verschiedenen Schritte und Status informiert. Der Monitor ist optional. Ohne
diesen werden Informationen zum Testverlauf in der Konsole ausgegeben.

Details zur Konfiguration und und Verwendung werden im Abschnitt
[Konfiguration - Monitor](#monitor) beschrieben.


### Control

Der Testverlauf und die Verarbeitung der einzelnen Tests kann per Test-API
gesteuert werden.

```javascript
Test.start();
Test.start(boolean);
});
```

(Neu)Start der Testausf�hrung.  
Der Start kann manuell oder bei Verwendung von `auto = true` durch das Laden
der Seite erfolgen. Wenn die Seite bereits geladen ist, wird der Parameter
`auto` ignoriert und der Start sofort ausgef�hrt.

```javascript
Test.suspend();
});
```

Unterbricht die aktuelle Testausf�hrung, die mit `Test.resume()` vom aktuellen
Test fortgesetzt werden kann.

```javascript
Test.resume();
});
```

Setzt die Testausf�hrung fort, wenn sie zuvor unterbrochen wurde.

```javascript
Test.interrupt();
});
```

Unterbricht die aktuelle Testausf�hrung und verwirft alle ausstehenden Tests.
Der Testlauf kann mit `Test.start()` neu gestartet werden.

```javascript
Test.status();
});
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
            Optional, wenn ein unerwarteter Fehler (auch Asser-Fehler)
            aufgetreten ist, der die Testaufgabe beendet hat.
    },
    queue: {
        timing:
            Zeitpunkt vom Beginn in Millisekunden,
        size:
            urspr�ngliche Anzahl von Testf�llen,
        length:
            Anzahl ausstehenden Tests,
        progress:
            Anzahl durchgef�hrter Tests,
        lock:
            Indikator, wenn die Queue zur Ausf�hrung eines Test wartet,
        faults:
            Anzahl der erkannten Fehler        
    }
}
```


### Events

Ereignisse (Events) bzw. deren Callback-Methoden sind ein weitere Form zur
�berwachung der Testausf�hrung. Die Callback-Methoden werden f�r entsprechende
Ereignisse vom Test-API registriert und funktionieren dann �hnlich dem Monitor.

List der verf�gbaren Ereignisse:

```
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


- - -

[Erweiterung](extension.md) | [Inhalt](README.md#test)
