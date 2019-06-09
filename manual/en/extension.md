[Components](composite.md) | [TOC](README.md#extension) | [Test](test.md)
- - -

# Extension

TODO:


## Contents Overview

* [Namespace](#namespace)
* [Math](#math)
* [Object](#object)
* [RegExp](#regexp)
* [String](#string)
* [window](#window)
* [XMLHttpRequest](#xmlhttprequest)


## Namespace

Namespace at object level.  
Comparable to packages in other programming languages, namespace can be used to
map hierarchical structures and to group thematically related components and
resources. The implementation happens in JavaScript at object level. This means
that it is not a real element of the programming language, but is represented by
chained static objects. Each level in this object chain represents a namespace.
As is typical for objects, the namespace are separated by a dot. 

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

Function for getting the serial ID to the objects.  
The ID is created continuously and should help if a unique ID is needed at runtime.

```javascript
var object1 = {};
var object2 = {};

object1.ordinal() != object2.ordinal();

var element1 = document.createElement("a");
var element2 = element1.cloneNode(true);

element1.ordinal() != element2.ordinal();
```


### Object.lookup

Static function to determine an object via the namespace.

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

Static function to check whether an object exists in a namespace.

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

XMLHttpRequest was indirectly extended by Composite AJAX events.  

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

These can be used to react centrally and application-wide at AJAX events.

```javascript
Composite.listen(Composite.EVENT_AJAX_START, function(varargs) {
    show spinner
});

Composite.listen(Composite.EVENT_AJAX_END, function(varargs) {
    hide spinner
});
```

Several callback methods can be registered for each event, which are then called
according to the order in which they were registered.


- - -

[Components](composite.md) | [TOC](README.md#extension) | [Test](test.md)
