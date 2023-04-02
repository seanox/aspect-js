[Markup](markup.md) | [TOC](README.md#scripting) | [DataSource](datasource.md)
- - -

# Scripting

TODO:


## Contents Overview

* [Embedded Composite-JavaScript](#embedded-composite-javascript)
* [Moduls](#moduls)
* [Macros](#macros)
    * [#export](#export)
    * [#import](#import)
    * [#module](#module)
    * [(?...) tolerate](#-tolerate)
* [Debugging](#debugging)


## Embedded Composite JavaScript

TODO:


## Moduls

TODO:


## Macros

Macros are a simple meta-syntax that fits into the existing JavaScript syntax.
At their core, they are abbreviated notations or paraphrases for common
JavaScript statements.

### #export

Composite JavaScript, which includes the modules, is not inserted as an element,
but executed directly with the eval method. Since an isolated scope and not the
global scope is used for this, variables, constants and methods cannot be used
directly globally or across scopes.

Here variables, constants and methods can be made globally usable with the macro
`#export`. After the name of the macro, a space-separated list with the names of
the elements that are to be made publicly accessible is expected up to the end
of the line or up to the next semicolon.

```javascript
const connector = {
    ...
};

const utilities = {
    ...
};

#export connector utilities;
```

The names of the elements can be extended by namespaces for export, so that they
are explicitly added there.

```javascript
const connector = {
    ...
};

const utilities = {
    ...
};

#export connector@io.example utilities@io.example;
```

### #import

The macro loads one or separated by spaces several (Composite-)JavaScript
modules from the module directory. JavaScript modules are loaded only once, no
matter if directly via [#import](#import) or indirectly as a resource to a
composite.

__When calling modules, the file extension is omitted.__

```javascript
#import moduleA
#import moduleA moduleB moduleC
```

It should be noted that the macro will result in an error if the server state is
different from 200. Since the macro integrates into the general JavaScript
syntax, the error can be caught as usual with try-catch.

```javascript
try {#import moduleA;
} catch (error) {
    ...    
}    
```

In the module directory subdirectories are also supported, which is represented
in the module names by the slash.

```javascript
#import example/io/connector;
```


### #module

TODO:

### (?...) tolerate

A very special macro is the tolerating syntax `(?...)`. Thus, in case of an
error, the logic enclosed in the brackets will not cause an error and there will
be no output in the browser console. Instead, the brackets will represent the
value `false`. Syntax errors are excluded from this tolerating behavior.

```javascript
const value = (?object.that.does.not.exist());
```


## Debugging

Since resources and modules, which includes JavaScript, are loaded only at
runtime, the browser does not know the sources and so the modules are not
displayed in the developer tools of the browsers, which is important for the use
of break points, among other things. Therefore, the entry point into the
JavaScript must be used here via the browser console, which, in addition to the
text output, also contains a link to the source of the output. And via this link
the source code of the modules can also be opened in the debugger and used as
usual with break points.

Therefore, modules should generate appropriate console output for debugging.
This can be done manually via the `console` object or alternatively with the
macro [#module](#module).

```javascript
#module example;
...
```


- - -

[Markup](markup.md) | [TOC](README.md#scripting) | [DataSource](datasource.md)
