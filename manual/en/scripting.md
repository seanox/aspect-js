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
    * [Tolerant syntax](#tolerant-syntax)
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

#export connector@io utilities@io;
```

### #import

TODO:

### #module

TODO:

### Tolerant syntax

TODO:


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
