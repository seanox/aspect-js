[Komponenten](composite.md) | [Inhalt](README.md#erweiterung) | [Test](test.md)
- - -

# Erweiterung

TODO:


## Inhalt

* [Namespace](#namespace)
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


## Math

TODO:


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
            berlin: {
                countPopulation: function() {
                    return 3900000;
                }
            }
        } 
    }   
}

Object.lookup("earth");
    returns object earth
     
Object.lookup("earth.europe.germany");
    returns object earth.europe.germany

Object.lookup("earth.europe.germany.berlin.countPopulation");
    returns function earth.europe.germany.berlin.countPopulation

Object.lookup("foo");
    returns null
```
 

### Object.exists

Statische Funktion, um zu prüfen, ob ein Objekt in einem Namensraum existiert.

```javascript
var earth = {
    europe: {
        germany: {
            berlin: {
                countPopulation: function() {
                    return 3900000;
                }
            }
        } 
    }   
}

Object.exists("earth");
    returns true
     
Object.exists("earth.europe.germany");
    returns true

Object.exists("earth.europe.germany.berlin.countPopulation");
    returns true

Object.exists("foo");
    returns false
```

TODO:


## RegExp

TODO:


## String

TODO:


## window

TODO:


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
