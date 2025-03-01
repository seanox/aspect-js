&#9665; [Introduction](introduction.md)
&nbsp;&nbsp;&nbsp;&nbsp; &#8801; [Table of Contents](README.md#expression-language)
&nbsp;&nbsp;&nbsp;&nbsp; [Markup](markup.md) &#9655;
- - -

# Expression Language
Expressions or the Expression Language (EL) is a simple access to the
client-side JavaScript and thus to the models and components in Seanox
aspect-js. In the expressions the complete JavaScript API is supported, which
is enhanced with additional keywords, so that also the numerous arithmetic and
logical operators can be used.

```
{{'Hello World!'}}
```

The expression language can be used from the HTML element `BODY` on in the
complete markup as free text, as well as in all attributes. Exceptions are the
HTML elements `STYLE` and `SCRIPT` whose content is not supported by the
expression Language.

The renderer interprets the expression syntax `{{...}}` hard and therefore the
character sequence `{{` as well as `}}` must be used inside the expression via
escape sequence `\{\{` and/or `\}\}`.

## Contents Overview
- [Elements](#elements)
  - [Text](#text)
  - [Literal](#literal)
  - [Keyword](#keyword)
  - [Value](#value)
  - [Method](#method)
  - [Logic](#logic)
- [Expressions](#expressions)
  - [Value-Expression](#value-expression)
  - [Method-Expression](#method-expression)
  - [Element-Expression](#element-expression)
  - [Variable-Expression](#variable-expression)
  - [Combination](#combination)
  - [(?...) tolerate](#-tolerate)
- [Supplement](#supplement)

## Elements
An expression is a set of words, where the words are classified according to
their characteristics as parts of a phrase.

```
+-------------------------------------------------------------+
|            Words (all elements of an expression)            |
+--------+----------------------------------------------------+
|  Text  |                     Expression                     |
|        +-----------+----------------------------------------+
|        |  Literal  |                 Script                 |
|        |           +-----------+----------------------------+
|        |           |  Keyword  |           Others           |
|        |           |           +---------+----------+-------+
|        |           |           |  Value  |  Method  | Logic |
+--------+-----------+-----------+---------+----------+-------+
```

### Text
Text is not a regular element of the expression. This occurs for attributes when
the Expression Language is combined with text.

```html
<p output="Today is {{Calendar.weekday}} and it's {{Clock.time}}."></p>
```

### Literal
Literals are text embedded in an expression via single or double quotation marks
that supports the usual control characters and escape sequences.

```
{{'Hello World!'}}
{{"Hello World!"}}
{{`Hello World!`}}
```

### Keyword
The following standard JavaScript syntax keywords are supported in the
Expression Language:

```
true
false
null
instanceof
typeof
undefined
new
```

To simplify and formulate valid markup, the JavaScript syntax for the Expression
Language has been extended of the following keywords:

| Keyword | Function                  |
|---------|---------------------------|
| `and`   | `&&`                      |
| `div`   | `/`                       |
| `empty` | `!`                       |
| `eeq`   | `===`                     |
| `eq`    | `==`                      |
| `ge`    | `>=`                      |
| `gt`    | `> `                      |
| `le`    | `<=`                      |
| `lt`    | `<`                       |
| `mod`   | `%`                       |  
| `ne`    | `!=`                      |
| `nee`   | `!==`                     |
| `not`   | `!`                       |  
| `or`    | <code>&#124;&#124;</code> |

### Value
Anything that is not a literal and keyword is potentially a Value. Value
represents the value of an object property or a variable. In the case of object
properties, this is referred to directly or, if available, to a corresponding
getter. If neither an object property nor a variable can be determined, a method
or other logic is assumed.

### Method
Everything that is not literal, keyword and value is potentially a method. If no
method can be determined, other logic is assumed.

### Logic
Everything that is not literal, keyword, value and method is potentially
executable logic.

## Expressions
There are different types of expressions that can be combined. In the following
these are explained with their differences and peculiarities.

Expressions will always output all values, except for the value `undefined`. But
this does not apply to the string `undefined`, which is interpreted as normal
text.

### Value-Expression
Anything that is not a literal and keyword is potentially a Value. Value
represents the value of an object property or a variable. In the case of object
properties, this is referred to directly or, if available, to a corresponding
getter.

```
{{Example.object.field}}
```

### Method-Expression
Everything that is not literal, keyword and value is potentially a method

```
{{Example.getData()}}
```

### Element-Expression
If a variable starts with `#` in an expression, this variable refers to an HTML
element with the same ID. If no matching HTML element can be found, the value of
the variable corresponds to `undefined`.

```
{{#ExampleElement.value}}

<input type="text" id="ExampleElement"/>
```

More complex IDs which do not only contain word characters (`_ a-z A-Z 0-9`) can
be be enclosed in square brackets.

```
{{#[ExampleElement:1].value}}

<input type="text" id="ExampleElement:1"/>
```

### Variable-Expression
With the expression language, variables in the page scope can also be created
and set at the runtime. The expression must begin with the name of a variable
(identifier), which use the word characters `_ a-z A-Z 0-9` and is separated
from the actual expression by a colon.

```
{{foo:1 +2 +3 + 'x hello'}}
```

Creates or sets the value for variable `foo` in the page scope with `6x hello`.

The expression corresponds to the JavaScript syntax:
    `var foo = 1 +2 +3 + 'x hello';`

> [!IMPORTANT]
> __Page Scope:__ Refers to the fact that variables can only be used in the
> markup and are isolated from the rest of the JavaScript. These variables are
> specifically intended for the display and processing of data in HTML markup
> and are not accessible in general JavaScript code.

### Combination
All types of expressions can be combined.

```
{{foo:not empty Foo.data and not empty Foo.data.items ? String(Foo.data.items[0].fieldA).substring(2) : ''}}
```

### (?...) tolerate
Expressions are executed like JavaScript and can lead to corresponding errors.
In addition, object-based approaches often require checking the existence of
specific object levels, which makes expressions unclear.

For these cases the tolerating syntax `(?...)` can be used in the expressions.
The logic enclosed in the brackets, in case of an error, will not cause an
error and there will be no output to the browser console. Instead, the brackets
will represent the value `false`. Syntax errors are excluded from this
tolerating behavior.

```
{{"Expression with an error " + (?object.that.does.not.exist()) + "!"}}
```

## Supplement
Expressions are interpreted by the renderer that starts after loading the page.
So expressions can be visible when loading the page. It is recommended to use
the attribute [release](markup.md#release).

```html
<h1 release>{{'Hello World!'}}</h1>
```

Alternatively, content can be stored in the DataSource in combination with the
attributes [output](markup.md#output) and [import](markup.md#import).

```css
h1:after {
  content:attr(title)
}
```

```html
<h1 title="{{'Hello World!'}}"/>

<h1 output="{{'Hello World!'}}"/>
<h1 output="{{'xml://example/content'}}"/>
<h1 output="xml://example/content"/>
<h1 output="{{Messages['hello']}}"/>

<h1 import="{{'Hello World!'}}"/>
<h1 import="{{'xml://example/content'}}"/>
<h1 import="xml://example/content"/>
<h1 import="{{Messages['hello']}}"/>
```



- - -
&#9665; [Introduction](introduction.md)
&nbsp;&nbsp;&nbsp;&nbsp; &#8801; [Table of Contents](README.md#expression-language)
&nbsp;&nbsp;&nbsp;&nbsp; [Markup](markup.md) &#9655;
