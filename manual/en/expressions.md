# Expression Language

Expressions or the Expression Language (EL) is a simple access to the
client-side JavaScrript and thus to the models and components in aspect-js. In
the expressions the complete JavaScript API is supported, which is enhanced with
additional keywords, so that also the numerous arithmetic and logical operators
can be used.

```
{{'Hello World!'}}
```


The Expression Language can be used from the BODY tag on in the complete markup
as free text as well as in all attributes. Only in the STYLE and SCRIPT tags the
Expression Language is not supported.


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
  * [Variablen-Expression](#variablen-expression)    
  * [Combination](#combination)    
* [Integration](#integration)
  

## Elements

An expression is a sequence of words.  
A word is an elementary set of words.
Words are classified according to their characteristics.

```
+-------------------------------------------------------------+
|            Words (alle Elemente eines Expression)           |
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
<p output="Today is {{Calendar.weekday}} and it's {{Clock.time}}.">
```


### Literal

Literale sind in einem Ausdruck mittels einfacher oder doppelter
Anführungszeichenen eingebetteter Text, der die üblichen Steuerzeichen und
Escape-Sequenzen unterstützt.

```
{{'Hello World!'}}
{{"Hello World!"}}
```


### Keyword

Folgende Standard-Keyword der JavaScript-Syntax werden in der Expression
Language unterstützt:

```
true
false
null
instanceof
typeof
undefined
new
```

Als Vereinfachung und zur Formulierung von validem Markup wurden die
JavaScript-Syntax für die Expression Language um folgende Keywords erweitert:

```
and &&        empty !         div /
eq  ==        ge    >=        gt  >
le  <=        lt    <         mod %
ne  !=        not   !         or  ||
```


### Value

Value repräsentiert den Wert einer Objekt-Eigenschaft (Property) oder Variablen.  
Alles was kein Literal und Keyword ist, ist potentiell eine Value.  
Values verweisen auf Variablen oder Objekt-Eigenschaften.  
Bei Objekt-Eigenschaften erfolgt der Verweis direkt auf die Eigenschaft oder
wenn vorhanden auf einen korrespondierenden Getter (get-Methode).  
Kann weder eine Objekt-Eigenschaft noch eine Variable ermittelt werden, wird von
einer Methode oder sonstiger Logik ausgegangen.


### Method

Alles was kein Literal, Keyword und Value ist, ist potentiell eine Methode.  
Kann keine Methode ermittelt werden, wird von sonstiger Logik ausgegangen.


### Logic

Alles was kein Literal, Keyword, Value und Methode ist, ist potentiell Logik.  
Sonstige Logik wird unverändert ausgeführt.


## Expressions

Es gibt unterschiedliche Arten von Expressions die kombinier sind.  
Nachfolgend werde diese mit ihrer Unterschieden und Eigenheiten erklärt.


### Value-Expression

Value repräsentiert den Wert einer Objekt-Eigenschaft (Property) oder Variablen.  
Alles was kein Literal und Keyword ist, ist potentiell eine Value.  
Values verweisen auf Variablen oder Objekt-Eigenschaften.  
Bei Objekt-Eigenschaften erfolgt der Verweis direkt auf die Eigenschaft oder
wenn vorhanden auf einen korrespondierenden Getter (get-Methode).  

```
{{Example.object.field}}
```

Die Value-Expression ist tolerant, wenn der Wert oder das Objekt nicht verfügbar
ist und der Rückgabewert entspricht dann `undefined`.


### Method-Expression

Alles was kein Literal, Keyword und Value ist, ist potentiell eine Methode. 

```
{{Example.getData()}}
```

Die Method-Expression ist streng und führt zu einem Fehler, wenn ein Objekt
nicht verfügbar ist.


### Element-Expression

Beginnt in einer Expression eine Variable mit `#`, so verweist diese Variable
auf ein HTML-Element mit gleichnamiger ID. Kann kein passendes HTML-Element
gefunden werden, entspricht der Wert der Variablen `undefined`.

```
{{#ExampleElement.value}}

<input type="text" id="ExampleElement"/>
```


### Variablen-Expression

Mit der Expression-Language lassen sich zur Laufzeit auch globale Variablen
erzeugen und setzen. Dazu muss die Expression mit dem Namen einer Variablen
(Bezeichner) beginnen, die dem Muster `_*[a-z]\w*` entspricht und durch einen
Doppelpunkt von der eigentlichen Expression getrennt ist.  

```
{{foo:1 +2 +3 + 'x Hallo'}}
```

Erstellt oder setzt bei der existierenden globale Variablen `foo` den Wert mit
`6x Hallo`.  
Die Expression entspricht der JavaScript-Syntax: `var foo = 1 +2 +3 + 'x Hallo';`


### Combination

Alle der gennannten Arten von Expressions lassen sich kombinieren.

```
{{foo:not empty Foo.data and not empty Foo.data.items ? String(Foo.data.items[0].fieldA).substring(2) : ''}}
```


## Integration

Expressions werden durch den Renderer interpretiert, der nach dem Laden der
Seite startet. Somit können Expressions beim Laden der Seite sichtbar sein. Hier
empfiehlt sich die Auslagerung in die DataSource und sowie die Verwendung der
Attribute [output](markup.md#output) und [import](markup.md#import) im Markup.

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
