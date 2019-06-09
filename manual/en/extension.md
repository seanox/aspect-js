[Components](composite.md) | [TOC](README.md#extension) | [Test](test.md)
- - -

# Extension

TODO:


## Contents Overview

* [Namespace](#namespace)
* [Element](#element)
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

## Element

TODO:


## Math

### Math.uniqueId

Static function for creating a alhpanumeric (U)UID with fixed size.

```javascript
Math.uniqueId()
    returns e.g. 42X3IUW7622CKY02
    
Math.uniqueId(32)
    returns e.g. SPH507D0C5SQ1EP5107HD3514K08T8H1
```


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
            countPopulation: function() {
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

Static function to check whether an object exists in a namespace.

```javascript
var earth = {
    europe: {
        germany: {
            countPopulation: function() {
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


## RegExp

### RegExp.quote

Creates a literal pattern for the specified text.  
Metacharacters or escape sequences in the text thus lose their meaning.

```javascript
RegExp.quote("only a text with a + b (as an example)");
    returns "only a text with a \+ b \(as an example\)"
```


## String

### String.prototype.capitalize

Function for capitalizing string objects.

```javascript
("hello world").capitalize();
    returns "Hello world"
```


### String.prototype.encodeHex

Function for encoding string objects in hexadecimal code.

```javascript
("hello world").encodeHex();
    returns "0x68656C6C6F20776F726C64"
```


### String.prototype.decodeHex

Function for decoding hexadecimal code to string objects.

```javascript
("0x68656C6C6F20776F726C64").decodeHex();
    returns "hello world"
```


### String.prototype.encodeBase64

Function for encoding string objects as Base64.

```javascript
("hello world").encodeBase64();
    returns "aGVsbG8gd29ybGQ="
```


### String.prototype.decodeBase64

Function for decoding Base64 to string objects.

```javascript
("aGVsbG8gd29ybGQ=").decodeBase64();
    returns "hello world"
```


### String.prototype.encodeHtml

Function for encoding HTML characters in string objects.

```javascript
("<hello world> & abc").encodeHtml();
    returns "&lt;hello world&gt; &amp; abc"
```


### String.prototype.hashCode

Function for calculating a alhpanumeric hash value for string objects.

```javascript
("hello world").hashCode();
    returns "B1OQGUCARUTF1"
```


### String.prototype.unescape

Function for decoding of slash sequences (control characters) in string objects.

```javascript
("a\\tb").unescape();
    returns "a   b"
```


## window

### window.serial

Property to get the UID for the window instance.

```javascript
window.serial
  returns e.g. 2YG490NMYY87TSF1I9R
```


### window.location.pathcontext

Property to get the context path.  
The context path is a part of the request URI and can be compared with the
current working directory.

```javascript
window.location.pathcontext
  returns e.g. /apps/test for URL https://example.local/apps/test/index.html
```


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
