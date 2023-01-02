[Reactivity Rendering](reactive.md) | [TOC](README.md#extension) | [Events](events.md)
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

Comparable to packages in other programming languages, namespaces can be used
for hierarchical structuring of components, resources and business logic.

Although packages are not a feature of JavaScript, they can be mapped at the
object level by concatenating objects into an object tree. Here, each level of
the object tree forms a namespace, which can also be considered a domain.

As is typical for the identifiers of objects, namespaces also use letters,
numbers and underscores separated by a dot. As a special feature, arrays are
also supported. If a layer in the namespace uses an integer, this layer is used
as an array.


### Namespace.using

Creates a namespace to pass string. Without arguments, the method returns the
global namespace window.  

```javascript
Namespace.using("app.example");
    creates window["app", {example: {}}]
    returns window["app"] / {example: {}}

Namespace.using("app.example", "more");
    creates window["app", {example: {more: {}}}]
    returns window["app"] / {example: {more: {}}}

Namespace.using()
    returns window
```


### Namespace.lookup

Resolves a namespace and returns the determined object(-level). If the namespace
does not exist, `undefined` is returned. Without arguments, the method returns
the global namespace `window`.  

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

```javascript
Namespace.using("app.example.more");

Namespace.exists("app.example.more")
    returns boolean true

Namespace.exists(app.example, "more")
    returns boolean true

Namespace.exists(app.example, "nothing")
    returns boolean false

Namespace.exists()
    returns boolean true
```


## Element

### Element.prototype.appendChild

Modifies the original method to support node and nodes as NodeList and Array.
If the option `exclusive` is used, existing children will be removed first.

```javascript
const nodes = [];
nodes.push(document.createElement("a"));
nodes.push(document.createElement("a"));
nodes.push(document.createElement("a"));

document.body.appendChild(nodes);

document.body.appendChild(nodes, true);
```


## Math

### Math.uniqueId

Creates an alphanumeric (U)UID with fixed size, where the length influences the
quality of the (U)UID. 

```javascript
Math.uniqueId()
    returns string e.g. "42X3IUW7622CKY02"

Math.uniqueId(32)
    returns string e.g. "SPH507D0C5SQ1EP5107HD3514K08T8H1"
```

### Math.uniqueSerialId

Creates an alphanumeric (U)UID with fixed size and a serial relation to time,
where the length influences the quality of the (U)UID.

```javascript
Math.uniqueSerialId()
    returns string e.g. "0GQ96VN87ZZ2JTYY"

Math.uniqueSerialId(32)
    returns string e.g. "65RQR5X5URNGO3H087ZZ2JTYZ"
```


## Object

### Object.prototype.ordinal

Gets the serial ID to the objects. The ID is created continuously and should
help if a unique ID is needed at runtime.

```javascript
const object1 = {};
const object2 = {};

object1.ordinal() != object2.ordinal();

const element1 = document.createElement("a");
const element2 = element1.cloneNode(true);

element1.ordinal() != element2.ordinal();
```


### Object.lookup

Equivalent to [Namespace.lookup](#namespacelookup). Determines an object for a
namespace.

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
    returns object window["earth"] / {europe: {germany: {countPopulation() {return 83000000;}}}}

Object.lookup("earth.europe.germany");
    returns object window["earth.europe.germany"] / {countPopulation() {return 83000000;}}

Object.lookup("earth.europe.germany.countPopulation");
    returns function window["earth.europe.germany.countPopulation"] / () => {return 83000000;}

Object.lookup("foo");
    returns null
```
 

### Object.exists

equivalent to [namespace.exists](#namespaceexists). Determines whether an object
exists in a namespace. object exists in a namespace.

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
    returns booelan true

Object.exists("earth.europe.germany");
    returns booelan true

Object.exists("earth.europe.germany.countPopulation");
    returns booelan true

Object.exists("foo");
    returns booelan false
```


### Object.using

Equivalent to [Namespace.using](#namespaceusing). Creates a namespace to the
passed string. Without arguments, the method returns the global namespace
window.  

```javascript
Object.using("app.example");
    returns object window["app.example"] / {}

Object.using("app.example", "more");
    returns object window["app.example.more"] / {}
}

Object.using()
    returns object window
```


## RegExp

### RegExp.quote

Creates a literal pattern for the specified text. Metacharacters or escape
sequences in the text thus lose their meaning.

```javascript
RegExp.quote("only a text with a + b (as an example)");
    returns string "only a text with a \+ b \(as an example\)"
```


## String

### String.prototype.capitalize

Capitalized the string.

```javascript
("hello world").capitalize();
    returns string "Hello world"
```


### String.prototype.uncapitalize

Uncapitalized the string.

```javascript
("Hello World").capitalize();
    returns string "hello World"
```


### String.prototype.encodeHex

Encodes the string hexadecimal.

```javascript
("hello world").encodeHex();
    returns string "0x68656C6C6F20776F726C64"
```


### String.prototype.decodeHex

Decodes the hexadecimal string.

```javascript
("0x68656C6C6F20776F726C64").decodeHex();
    returns string "hello world"
```


### String.prototype.encodeBase64

Encodes the string in Base64.

```javascript
("hello world").encodeBase64();
    returns string "aGVsbG8gd29ybGQ="
```


### String.prototype.decodeBase64

Decodes the Base64 encoded string.

```javascript
("aGVsbG8gd29ybGQ=").decodeBase64();
    returns string "hello world"
```


### String.prototype.encodeHtml

Escapes HTML characters in the string.

```javascript
("<hello world> & abc").encodeHtml();
    returns string "&lt;hello world&gt; &amp; abc"
```


### String.prototype.hashCode

Calculates an alphanumeric hash value for the string.

```javascript
("hello world").hashCode();
    returns string "B1OQGUCARUTF1"
```


### String.prototype.unescape

Decodes slash sequences (control characters) in the string.

```javascript
("a\\tb").unescape();
    returns string "a   b"
```


## window

### window.serial

Property to get the UID for the window instance.

```javascript
window.serial
    returns string e.g. "2YG490NMYY87TSF1I9R"
```


### window.location.combine

Combines text elements to a path. The method has an optimizing effect in the use
of slash and backslash. The result will always start with a slash but ends
without it.

```javascript
window.location.combine("a", "b", "c")
    returns string "/a/b/c"
```


### window.location.pathcontext

Property to get the context path. The context path is a part of the request URI
and can be compared with the current working directory.

```javascript
window.location.pathcontext
    returns string e.g. /apps/test for URL https://example.local/apps/test/index.html
```


## XMLHttpRequest

XMLHttpRequest was indirectly extended by Composite HTTP events.  

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

These can be used to react centrally and application-wide at HTTP events.

```javascript
Composite.listen(Composite.EVENT_HTTP_START, function(event, ...varargs) {
    show spinner
});

Composite.listen(Composite.EVENT_HTTP_END, function(event, ...varargs) {
    hide spinner
});
```

For each event, multiple callback methods can be registered, which are then
called according to the order in which they were registered.


- - -

[Reactivity Rendering](reactive.md) | [TOC](README.md#extension) | [Events](events.md)
