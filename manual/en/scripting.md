[Markup](markup.md) | [TOC](README.md#scripting) | [DataSource](datasource.md)
- - -

# Scripting

TODO:


## Contents Overview

TODO:


## Embedded Composite JavaScript

TODO:


## Moduls

TODO:


## Macros

TODO:

## #export

TODO:

## #import

TODO:

## #module

TODO:

## Tolerant syntax

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
