[Erweiterung](extension.md) | [Inhalt](README.md#test)

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
* [Output](#output)
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
Log-Level, das als erstes Argument �bergeben wird, aufgerufen. Die weitere
Anzahl von Argumenten ist variable und abh�ngig vom initialen Aufruf der
korrespondierenden console-Methoden. Womit es oft einfacher ist `arguments` zu
verwenden.


### Monitoring

TODO:


### Control

TODO:


### Events

TODO:


[Erweiterung](extension.md) | [Inhalt](README.md#test)
