[Markup](markup.md) | [TOC](README.md#expression-language) | [DataSource](datasource.md)
- - -

# Expression Language

Expressions or the Expression Language (EL) is a simple access to the
client-side JavaScrript and thus to the models and components in Seanox
aspect-js. In the expressions the complete JavaScript API is supported, which is
enhanced with additional keywords, so that also the numerous arithmetic and
logical operators can be used.

```
{{'Hello World!'}}
```


The Expression Language can be used from the BODY tag on in the complete markup
as free text as well as in all attributes. Only in the STYLE and SCRIPT tags the
Expression Language is not supported.

The renderer interprets the expression syntax `{{...}}` hard and therefore the
character sequence `{{` as well as `}}` must be used inside of the
expression by escape sequence/escape symbol.

The renderer interprets the expression syntax `{{...}}` hard and therefore the
character sequence `{{` as well as `}}` must be used inside the expression via
escape sequence `\{\{` and/or `\}\}`.


## Contents Overview

* [Elements](#elements)
  * [Text](#text)
  * [Literal](#literal)
  * [Keyword](#keyword)
  * [Value](#value)
  * [Method](#method)
  * [Logic](#logic)
* [Expressions](#expressions)
  * [Value-Expression](#value-expression)
  * [Method-Expression](#method-expression)
  * [Element-Expression](#element-expression)
  * [Variable-Expression](#variable-expression)    
  * [Combination](#combination)    
* [Supplement](#supplement)
  

## Elements

An expression is a sequence of words.  
A word is an elementary set of words.
Words are classified according to their characteristics.

```
+-------------------------------------------------------------+
|            Words (entireness of the expression)             |
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

Text is not a regular element of the expression.  
This occurs for attributes when the Expression Language is combined with text.

```html
<p output="Today is {{Calendar.weekday}} and it's {{Clock.time}}."></p>
```


### Literal

Literals are text embedded in an expression via single or double quotation marks
that supports the usual control characters and escape sequences.

```
{{'Hello World!'}}
{{"Hello World!"}}
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

```
and &&        empty !         div /
eq  ==        ge    >=        gt  >
le  <=        lt    <         mod %
ne  !=        not   !         or  ||
```


### Value

Value represents the value of an object property or variable.  
Anything that is not a literal and keyword is potentially a value.  
Values refer to variables or object properties.  
With object properties, the reference is directly to the property or, if
available, to a corresponding getter (get method).    
If neither an object property nor a variable can be determined, a method or
other logic is assumed.


### Method

Everything that is not literal, keyword and value is potentially a method.  
If no method can be determined, other logic is assumed.


### Logic

Everything that is not literal, keyword, value and method is potentially logic.  
Other logic is executed directly.


## Expressions

There are different types of expressions that can be combined.  
In the following these are explained with their differences and peculiarities.


### Value-Expression

Value represents the value of an object property or variable.  
Anything that is not a literal and keyword is potentially a value.  
Values refer to variables or object properties.  
With object properties, the reference is directly to the property or, if
available, to a corresponding getter (get method).

```
{{Example.object.field}}
```

The value expression is tolerant if the value or object is not available and the
return value is then `undefined`.


### Method-Expression

Everything that is not literal, keyword and value is potentially a method

```
{{Example.getData()}}
```

The method expression is strict and causes an error if an object is not
available.


### Element-Expression

If a variable starts with `#` in an expression, this variable refers to an HTML
element with the same ID. If no matching HTML element can be found, the value of
the variable corresponds to `undefined`.

```
{{#ExampleElement.value}}

<input type="text" id="ExampleElement"/>
```


### Variable-Expression

With the expression language, global variables can also be created and set at
the runtime. The expression must begin with the name of a variable (identifier),
which use as word the characters `_ a-z A-Z 0-9` and is separated from the
actual expression by a colon.  
  
```
{{foo:1 +2 +3 + 'x Hallo'}}
```


Creates or sets the value for the existing global variable `foo` with
`6x Hallo`.    
The expression corresponds to the JavaScript syntax: `var foo = 1 +2 +3 + 'x hello';`


### Combination

All types of expressions can be combined.

```
{{foo:not empty Foo.data and not empty Foo.data.items ? String(Foo.data.items[0].fieldA).substring(2) : ''}}
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
<h1 output="{{'xml:/example/content'}}"/>
<h1 output="xml:/example/content"/>
<h1 output="{{Messages['hello']}}"/>

<h1 import="{{'Hello World!'}}"/>
<h1 import="{{'xml:/example/content'}}"/>
<h1 import="xml:/example/content"/>
<h1 import="{{Messages['hello']}}"/>
```


- - -

[Markup](markup.md) | [TOC](README.md#expression-language) | [DataSource](datasource.md)
