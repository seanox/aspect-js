[Einf&uuml;hrung](introduction.md) | [Inhalt](README.md#expression-language) | [Markup](markup.md)
- - -

# Expression Language

Expressions bzw. die Expression Language (EL) ist ein einfacher Zugang zum
clientseitigen JavaScript und damit zu den Modellen und Komponenten im Seanox
aspect-js. Expressions unterst&uuml;tzen das komplette JavaScript-API, das mit
zus&auml;tzlichen Schl&uuml;sselw&ouml;rtern angereichert ist, womit sich auch
die zahlreichen arithmetischen und logischen Operatoren verwenden lassen.

```
{{'Hello World!'}}
```

Die Expression Language kann ab dem HTML-Element `BODY` im kompletten Markup als
Freitext, sowie in allen Attributen verwendet werden. Ausgenommen sind die
HTML-Elemente `STYLE` und `SCRIPT`, deren Inhalt von der Expression Language
nicht unterst&uuml;tzt wird.

Der Renderer interpretiert die Expression-Syntax `{{...}}` hart und daher
m&uuml;ssen die Zeichenfolgen `{{` und `}}` innerhalb der Expression per
Escape-Sequenz `\{\{` bzw. `\}\}` verwendet werden.


## Inhalt

* [Elemente](#elemente)
  * [Text](#text)
  * [Literal](#literal)
  * [Keyword](#keyword)
  * [Value](#value)
  * [Methode](#methode)
  * [Logik](#logik)
* [Expressions](#expressions)
  * [Value-Expression](#value-expression)
  * [Method-Expression](#method-expression)
  * [Element-Expression](#element-expression)
  * [Variable-Expression](#variable-expression)
  * [Kombination](#kombination)
  * [Tolerante Syntax](#tolerante-syntax)
* [Erg&auml;nzung](#erg-nzung)


## Elemente

Ein Ausdruck ist eine Reihe von W&ouml;rtern, wobei die W&ouml;rter als
Bestandteile eines Satzes nach ihrer Eigenschaft klassifiziert werden. 

```
+-------------------------------------------------------------+
|            Words (alle Elemente eines Expression)           |
+--------+----------------------------------------------------+
|  Text  |                     Expression                     |
|        +-----------+----------------------------------------+
|        |  Literal  |                 Script                 |
|        |           +-----------+----------------------------+
|        |           |  Keyword  |           Sonstige         |
|        |           |           +---------+----------+-------+
|        |           |           |  Value  |  Method  | Logic |
+--------+-----------+-----------+---------+----------+-------+
```


### Text

Text ist kein regul&auml;rer Bestandteil der Expression. Dieser ergibt sich bei
Attributen, wenn die Expression Language mit Text kombiniert wird.

```html
<p output="Today is {{Calendar.weekday}} and it's {{Clock.time}}."></p>
```


### Literal

Literale sind in einem Ausdruck mittels einfacher oder doppelter
Anf&uuml;hrungszeichen eingebetteter Text, der die &uuml;blichen Steuerzeichen
und Escape-Sequenzen unterst&uuml;tzt.

```
{{'Hello World!'}}
{{"Hello World!"}}
{{`Hello World!`}}
```


### Keyword

Folgende Schl&uuml;sselw&ouml;rter der JavaScript-Syntax werden in der
Expression Language unterst&uuml;tzt:

```
true
false
null
instanceof
typeof
undefined
new
```

Zur Vereinfachung und Formulierung von validem Markup wurde die 
JavaScript-Syntax f&uuml;r die Expression Language um folgende Keywords
erweitert:

| Keyword | Funktion                  |
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

Alles was kein Literal und Keyword ist, ist potenziell ein Value, der den Wert
einer Objekt-Eigenschaft (Property) oder einer Variablen repr&auml;sentiert. Bei
Objekt-Eigenschaften erfolgt der Verweis direkt auf die Eigenschaft oder wenn
vorhanden auf einen korrespondierenden Getter. Kann weder eine
Objekt-Eigenschaft noch eine Variable ermittelt werden, wird von einer Methode
oder sonstiger Logik ausgegangen.


### Methode

Alles was kein Literal, Keyword und Value ist, ist potenziell eine Methode. Kann
keine Methode ermittelt werden, wird von sonstiger Logik ausgegangen.


### Logik

Alles was kein Literal, Keyword, Value und Methode ist, ist potenziell
ausf&uuml;hrbare Logik.


## Expressions

Es gibt unterschiedliche Arten von Expressions, die kombinierbar sind und
nachfolgend mit ihren Unterschieden und Eigenheiten erkl&auml;rt werden.

Expressions werden immer alle Werte ausgeben, mit Ausnahme vom Wert
`undefined`. Was aber nicht f&uuml;r den String "undefined" gilt, der als
normaler Text behandelt wird.


### Value-Expression

Alles was kein Literal und Keyword ist, ist potenziell ein Value, der den Wert
einer Objekt-Eigenschaft (Property) oder einer Variablen repr&auml;sentiert. Bei
Objekt-Eigenschaften erfolgt der Verweis direkt auf die Eigenschaft oder wenn
vorhanden auf einen korrespondierenden Getter.

```
{{Example.object.field}}
```


### Method-Expression

Alles was kein Literal, Keyword und Value ist, ist potenziell eine Methode.

```
{{Example.getData()}}
```


### Element-Expression

Beginnt in einer Expression eine Variable mit `#`, so verweist diese Variable
auf ein HTML-Element mit gleichnamiger ID. Kann kein passendes HTML-Element
gefunden werden, entspricht der Wert der Variablen `undefined`.

```
{{#ExampleElement.value}}

<input type="text" id="ExampleElement"/>
```

Komplexere IDs welche nicht nur Wortzeichen (`_ a-z A-Z 0-9`) enthalten, lassen
sich in eckigen Klammern einfassen.

```
{{#[ExampleElement:1].value}}

<input type="text" id="ExampleElement:1"/>
```


### Variable-Expression

Mit der Expression-Language lassen sich zur Laufzeit auch globale Variablen
erzeugen und setzen. Dazu muss die Expression mit dem Namen einer Variablen
(Bezeichner) beginnen, der die Wortzeichen `_ a-z A-Z 0-9` verwendet und durch
einen Doppelpunkt von der eigentlichen Expression getrennt ist.

```
{{foo:1 +2 +3 + 'x Hallo'}}
```

Erstellt oder setzt die globale Variable `foo` mit dem Wert `6x Hallo`.

Die Expression entspricht der JavaScript-Syntax:
    `var foo = 1 +2 +3 + 'x Hallo';`


### Kombination

Alle der genannten Arten von Expressions lassen sich kombinieren.

```
{{foo:not empty Foo.data and not empty Foo.data.items ? String(Foo.data.items[0].fieldA).substring(2) : ''}}
```


### Tolerante Syntax

Expressions werden wie JavaScript ausgef&uuml;hrt und k&ouml;nnen zu
entsprechenden Fehlern f&uuml;hren. Zudem ist bei objektbasierten Ans&auml;tzen
&ouml;fters auch die Pr&uuml;fung der Existenz einzelner Objekt-Ebenen
erforderlich, wodurch Expressions un&uuml;bersichtlich werden.

F&uuml;r diese F&auuml;lle kann die tolerante Syntax `(?...)` in den Expressions
verwendet werden. Die in den Klammern eingeschlossene Logik wird im Fall eines
Fehlers nicht zum Fehler f&uuml;hren und es wird keine Ausgabe in der
Browserkonsole geben. Stattdessen wird die Klammer den Wert `false`
repr&auml;sentieren. Von diesem toleranten Verhalten ausgenommen sind
Syntaxfehler.

```
{{"Expression with an error " + (?object.that.does.not.exist()) + "!"}}
```


## Erg&auml;nzung

Expressions werden durch den Renderer interpretiert, der nach dem Laden der
Seite startet. Somit k&ouml;nnen Expressions beim Laden der Seite sichtbar sein.
Hier empfiehlt sich die Verwendung vom Attribut [release](markup.md#release).

```html
<h1 release>{{'Hello World!'}}</h1>
```

Alternativ ist die Auslagerung von Inhalten in die DataSource in Kombination mit
den Attributen [output](markup.md#output) und [import](markup.md#import)
m&ouml;glich.

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

[Einf&uuml;hrung](introduction.md) | [Inhalt](README.md#expression-language) | [Markup](markup.md)
