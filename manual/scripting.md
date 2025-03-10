&#9665; [Markup](markup.md)
&nbsp;&nbsp;&nbsp;&nbsp; &#8801; [Table of Contents](README.md#scripting)
&nbsp;&nbsp;&nbsp;&nbsp; [DataSource](datasource.md) &#9655;
- - -

# Scripting
Seanox aspect-js uses composite JavaScript. A dialect based on the browser
JavaScript, enriched with [macros](#macros) -- a simple meta-syntax.

Composite JavaScript, which includes the modules, is not inserted as an element,
but executed directly with the eval method. Since an isolated and not the global
scope is used for this, variables, constants and methods are not directly usable
globally or across, which is why, among other things, the Composite-JavaScript
was enriched with [macros](#macros), which take over such tasks, among other
things.

## Contents Overview
- [Embedded Composite-JavaScript](#embedded-composite-javascript)
- [Moduls](#moduls)
- [Macros](#macros)
  - [#export](#export)
  - [#import](#import)
  - [#module](#module)
  - [#use](#use)
  - [(?...) tolerate](#-tolerate)
- [Debugging](#debugging)

## Embedded Composite JavaScript
Embedded scripting brings some peculiarity with it. The standard scripting is
executed automatically by the browser and independently of the rendering.
Therefore, markup for rendering has been extended by the additional script type
`composite/javascript`, which uses the normal JavaScript but is not recognized
by the browser in comparison to `text/javascript` and therefore not executed
directly. But the renderer recognizes the JavaScript code and executes it in
every relevant render cycle. In this way, the SCRIPT element can be combined
with other composite attributes to control execution.

```html
<script type="composite/javascript">
    ...
</script>
```

## Moduls
Modules are an integral part of the composite concept. This concept assumes that
the resources for a composite (JS, CSS, HTML) are outsourced to the module
directory and loaded at runtime. Which, among other things, should shorten the
startup time and avoid linking or binding the modules to one application file,
which is based on the idea for micro-frontend, so that platform and modules can
be deployed independently.

Modules can also be used in JavaScript without composites. For this purpose, the
logic is also stored in individual files in the module directory and, if
necessary, in further subdirectories.

```
+ modules
  + example
    - moduleE.js
    - moduleF.js
    - ...
  - moduleA.js
  - moduleB.js
  - ...
- index.html
```

The modules are then loaded programmatically with `Compoiste.include(...)`,
`Compoiste.load(...)` or preferably with the macro [#import](#import).

__When calling modules, the file extension is omitted.__

```javascript
#import moduleA moduleB
#import example/moduleE example/moduleF
```

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
This macro has been implemented as an aid for debugging. It expects text to the
end of the line or to the next semicolon, which is output in the browser
console in the debug level.

```javascript
#module some text;
```

As a special feature, the string expression syntax of JavaScript is also
supported, which allows the use of variables.

```javascript
const value = "Hallo Welt!";
#module some more complex text: ${value} ... ${1 + 2};
```

### #use
The marko expects one or more space-separated namespaces to be created at the
object level if they do not already exist.

```javascript
#use a
#use a b c
#use a.b.c d.e.f g.h.i
```

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
runtime, the browser does not know the sources and so the modules are not shown
in the developer tools of the browsers, which is important for the use of break
points, among other things. Therefore, the entry point into the JavaScript must
be used here via the browser console, which, in addition to the text output,
also contains a link to the source of the output. And via this link the source
code of the modules can also be opened in the debugger and used as usual with
break points.

Therefore, modules should generate appropriate console output for debugging.
This can be done manually via the `console` object or alternatively with the
macro [#module](#module).

```javascript
#module example;
...
```



- - -
&#9665; [Markup](markup.md)
&nbsp;&nbsp;&nbsp;&nbsp; &#8801; [Table of Contents](README.md#scripting)
&nbsp;&nbsp;&nbsp;&nbsp; [DataSource](datasource.md) &#9655;
