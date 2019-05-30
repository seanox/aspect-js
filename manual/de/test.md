[Erweiterung](extension.md) | [Inhalt](README.md)

# Test

Das Test-API unterstützt die Implementierung und Ausführung von
Integrationstests und kann für Suiten (suite), Szenarien (scenario) und einzelne
Testfälle (case) verwendet werden.

Als modularer Bestandteil von Seanox aspect-js ist das Test-API in jedem Release
enthalten ist, der sich ohne Probleme entfernen lässt. Da das Test-API einige
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
  * [assertSameTo](#assertsameto)
  * [assertNotSame](#assertnotsame)
  * [assertNull](#assertnull)
  * [assertNotNull](#assertnotnull)
  * [fail](#fail)
* [Output](#output)
* [Monitoring](#monitoring)
* [Control](#control)
* [Events](#events)


### Testfall

Der kleinste Bestandteil in einem Integrationstest, der hier als "Task"
verwendet wird, da "Case" ein Schlüsselwort im JavaScript ist. Es kann allein
implementiert werden, wird aber immer in einem Szenario verwendet.

```javascript
Test.activate();

Test.create({test:function() {
    Assert.assertTrue(true);
}});

Test.start();
```

Task ist primär ein Meta-Objekt.  

```
{name:..., test:..., timeout:..., expected:..., ignore:...}
```


#### name

Optionaler Name vom Testfall.


#### test

Die implementierte Methode, die als Testfall ausgeführt werden soll.


#### timeout

Optional Angabe der maximalen Laufzeit des Testfalls in Millisekunden.
Das Überschreiten von diesem Wetr führt zum Ausfall des Tests.  
Es wird ein Wert größer als 0 erwartet, ansonsten wird der Timeout ignoriert.


#### expected

Optional, um das Auftreten von definierten Fehlern zu testen.
Der Fehler muss auftreten, damit der Test erfolgreich ist.
Als Wert wird ein Fehlerobjekt oder eine RegExp erwartet.

#### ignore

Optional true, wenn der Test ignoriert werden so


### Szenario

Ein Szenario ist eine Abfolge von vielen Testfällen (Tasks).

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

Eine Suite ist ein komplexes Paket aus verschiedenen Testfällen, Szenarien und
anderen Suiten. In der Regel besteht eine Suite aus verschiedenen Dateien, die
dann einen komplexen Test darstellen. Ein Beispiel für eine gute Suite ist eine
Kaskade von verschiedenen Dateien und wo der Test in jeder Datei und an jedem
Stelle gestartet werden kann. Dies ermöglicht einen Integrationstest auf
verschiedenen Ebenen und mit unterschiedlicher Komplexität.

 
### Assert

Die Testfälle werden mit Behauptungen (Assertions) implementiert. Das Test-API
bietet elementare Aussagen, die erweitert werden können. Die Funktion ist
einfach. Wenn eine Behauptung nicht wahr ist, tritt ein Fehler auf.


### assertTrue

Behauptet, dass ein Wert `true` ist.  
Ist die Behauptung unwahr, führt dies zu einem Fehler mit optionaler Meldung.   
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
Ist die Behauptung unwahr, führt dies zu einem Fehler mit optionaler Meldung.   
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
Ist die Behauptung unwahr, führt dies zu einem Fehler mit optionaler Meldung.   
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
Ist die Behauptung unwahr, führt dies zu einem Fehler mit optionaler Meldung.   
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
Ist die Behauptung unwahr, führt dies zu einem Fehler mit optionaler Meldung.   
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


### assertSameTo

Spezielle Erweiterung basierend auf `Assert.assertSame(....)`.  
Der erwartete Wert wird hierbei mit einen QuerySelector aus DOM ermittelt. Diese
Methode ist für die Verwendung von Vorlagen, die im DOM enthalten sind. Der
Vergleich von Leerzeichen/Whitespaces ist entsprechend tolerant und vergleicht
diese nur ungenau innerhalb des Wertes.  
Ist die Behauptung unwahr, führt dies zu einem Fehler mit optionaler Meldung.

```javascript
Test.activate();

Test.create({test:function() {
    Assert.assertSameTo(selector, value);
}});

Test.start();
```


### assertNotSame        
    
Behauptet, dass zwei Werte nicht gleich sind, als Negation von `Assert.assertSame(....)`.
Unterschied zwischen identisch und gleich: `=== / ==` oder `!== / !=`  
Ist die Behauptung unwahr, führt dies zu einem Fehler mit optionaler Meldung.   
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
Ist die Behauptung unwahr, führt dies zu einem Fehler mit optionaler Meldung.   
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
Ist die Behauptung unwahr, führt dies zu einem Fehler mit optionaler Meldung.   
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

TODO:


### Monitoring

TODO:


### Control

TODO:


### Events

TODO:


[Erweiterung](extension.md) | [Inhalt](README.md)
