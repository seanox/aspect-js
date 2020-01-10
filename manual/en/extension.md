[Components](composite.md) | [TOC](README.md#extension) | [Events](events.md)
- - -

# Extension

The JavaScript API for Seanox aspect-js has been extended by some general
functions.


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
Comparable to packages in other programming languages, namespaces can be used to
map hierarchical structures and to group thematically related components and
resources.  
The implementation happens in JavaScript at object level.  
This means that it is not a real element of the programming language, but is
represented by chained static objects. Each level in this object chain
represents a namespace.  
As is typical for object identifiers, namespaces also use letters, numbers, and
underscores separated by dots. As a special feature, arrays are also supported.
If an object level in the namespace is a pure number, an array is assumed.


### Namespace.using

Creates a namespace to pass string.  
Without arguments, the method returns the global namespace window.  
The method has different signatures.

```javascript
Namespace.using("app.example");
app.example {
    ...
}

Namespace.using("app.example", "more");
app.example.more {
    ...
}

Namespace.using()
    returns window
```
  

### Namespace.locate

Validates a requested namespace and creates a corresponding meta object.  
The method has different signatures.

```javascript
Namespace.using("app.example.more");

Namespace.locate("app.example.more")
    returns {scope:app.example.more, namespace:"app.example.more"}

Namespace.locate(app.example, "more")
    returns {scope:app.example.more, namespace:"app.example.more"}

Namespace.locate()
    returns window
```


### Namespace.lookup

Resolves a namespace and returns the determined object(-level).  
If the namespace does not exist, `null` is returned.  
Without arguments, the method returns the global namespace `window`.  
The method has different signatures.

```javascript
Namespace.using("app.example.more");

Namespace.lookup("app.example.more")
    returns app.example.more

Namespace.lookup(app.example, "more")
    returns app.example.more

Namespace.lookup()
    returns window
```


### Namespace.exists

Checks whether a namespace exists.  
The method has different signatures.

```javascript
Namespace.using("app.example.more");

Namespace.exists("app.example.more")
    returns true

Namespace.exists(app.example, "more")
    returns true
  
Namespace.exists(app.example, "nothing")
    returns false

Namespace.exists()
    returns true
```


## Element

### Element.prototype.appendChild

Modifies the original method to support node and nodes as NodeList and Array.
If the option `exclusive` is used, existing children will be removed first.

```javascript
var nodes = [];
nodes.push(document.createElement("a"));
nodes.push(document.createElement("a"));
nodes.push(document.createElement("a"));

document.body.appendChild(nodes);

document.body.appendChild(nodes, true);
```


## Math

### Math.uniqueId

Static function for creating a alhpanumeric (U)UID with fixed size.  
The quality of the ID is dependent of the length.

```javascript
Math.uniqueId()
    returns e.g. "42X3IUW7622CKY02"
  
Math.uniqueId(32)
    returns e.g. "SPH507D0C5SQ1EP5107HD3514K08T8H1"
```

### Math.uniqueSerialId

Static function for creating a alhpanumeric (U)UID with fixed size and a serial
relation to time.  
The quality of the ID is dependent of the length.

```javascript
Math.uniqueSerialId()
    returns e.g. "0GQ96VN87ZZ2JTYY"
  
Math.uniqueSerialId(32)
    returns e.g. "65RQR5X5URNGO3H087ZZ2JTYZ"
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
            countPopulation() {
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
            countPopulation() {
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


### Object.using

Equivalent to [Namespace.using](#namespaceusing) as a static object function.  
Creates a namespace to pass string.  
Without arguments, the method returns the global namespace window.  
The method has different signatures.

```javascript
Object.using("app.example");
app.example {
    ...
}

Object.using("app.example", "more");
app.example.more {
    ...
}

Object.using()
    returns window
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


### String.prototype.uncapitalize

Function for uncapitalize string objects.

```javascript
("Hello World").capitalize();
    returns "hello World"
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
  returns e.g. "2YG490NMYY87TSF1I9R"
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
Composite.listen(Composite.EVENT_AJAX_START, function(...varargs) {
    show spinner
});

Composite.listen(Composite.EVENT_AJAX_END, function(...varargs) {
    hide spinner
});
```

Several callback methods can be registered for each event, which are then called
according to the order in which they were registered.


- - -

[Components](composite.md) | [TOC](README.md#extension) | [Events](events.md)
