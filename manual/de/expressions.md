# Expression Language

Expressions bzw. die Expression Language (EL) ist ein einfacher Zugang zum
clientseitigen JavaScrript und damit zu den Modellen und Komponenten im
aspect-js. In den Expressions wird die komplette JavaScript-API unterstützt, die
mit zusätzliche Schlüsselwörtern angereichert ist, womit auch die zahlreichen
arithmetische und logische Operatoren verwendet werden können.

```
{{'Hello World!'}}
```

Die Expression Language kann ab dem BODY-Tag im kompletten Markup als Freitext
sowie in allen Attributen verwendet werden. Ausgenommen sind die Tags STYLE und
SCRIPT, hier wird die Expression Language nicht unterstützt.


## Inhalt

* [Elemente](#elemente)
  * [Text](#text)
  * [Literal](#literal)
  * [Logik](#logik)
  * [Keyword](#keyword)
* [Expressions](#expressions)
  * [Value-Expression](#value-expression)
  * [Method-Expression](#method-expression)
  * [Element-Expression](#element-expression)
  * [Combined-Expression](#combined-expression)    
  * [Variablen-Expression](#variablen-expression)    
* [Integration](#integration)
  

## Elemente

Ein Ausdruck ist ein Array von Wörtern.  
Ein Wort ist ein elementarer Satz oder ein Satzfragment mit mehreren Wörtern.
Wörter werden nach ihren Eigenschaften klassifiziert.

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

Text ist kein regulärer Bestandteil der Expression.
Dieser ergibt sich bei Attributen, wenn die Expression Language mit Text
kombiniert wird.

```html
<p output="Today is {{Calendar.weekday}} and it's {{Clock.time}}.">
```


### Literal

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


### Logik


## Expressions


### Value-Expression

```
{{Example.object.field}}
```

Die Value-Expression ist tolerant, wenn der Wert oder das Objekt nicht verfügbar
ist und der Rückgabewert entspricht dann `undefined`.


### Method-Expression

```
{{Example.getData()}}
```

Die Method-Expression ist streng und führt zu einem Fehler, wenn ein Objekt nicht
verfügbar ist.


### Element-Expression

Beginnt in einer Expression eine Variable mit `#`, so verweist diese Variable
auf ein HTML-Element mit gleichnamiger ID. Kann kein passendes HTML-Element
gefunden werden, entspricht der Wert der Variablen `undefined`.

```
{{#ExampleElement.value}}

<input type="text" id="ExampleElement"/>
```


### Combined-Expression

```
{{not empty Foo.data and not empty Foo.data.items ? String(Foo.data.items[0].fieldA).substring(2) : ''}}
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
