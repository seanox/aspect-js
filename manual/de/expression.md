[Markup](markup.md) | [Inhalt](README.md#expression-language) | [DataSource](datasource.md)
- - -

# Expression Language

Expressions bzw. die Expression Language (EL) ist ein einfacher Zugang zum
clientseitigen JavaScrript und damit zu den Modellen und Komponenten im Seanox
aspect-js. In den Expressions wird das komplette JavaScript-API unterstützt, die
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
* [Ergänzung](#erg-nzung)
  

## Elemente

Ein Ausdruck ist ein Reihe von Wörtern.  
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
<p output="Today is {{Calendar.weekday}} and it's {{Clock.time}}."></p>
```


### Literal

Literale sind in einem Ausdruck mittels einfacher oder doppelter
Anführungszeichen eingebetteter Text, der die üblichen Steuerzeichen und
Escape-Sequenzen unterstützt.

```
{{'Hello World!'}}
{{"Hello World!"}}
```


### Keyword

Folgende Schlüsselwörter der JavaScript-Syntax werden in der Expression Language
unterstützt:

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


### Methode

Alles was kein Literal, Keyword und Value ist, ist potentiell eine Methode.  
Kann keine Methode ermittelt werden, wird von sonstiger Logik ausgegangen.


### Logik

Alles was kein Literal, Keyword, Value und Methode ist, ist potentiell Logik.  
Sonstige Logik wird unverändert ausgeführt.


## Expressions

Es gibt unterschiedliche Arten von Expressions die kombinierbar sind.  
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


### Variable-Expression

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


### Kombination

Alle der gennannten Arten von Expressions lassen sich kombinieren.

```
{{foo:not empty Foo.data and not empty Foo.data.items ? String(Foo.data.items[0].fieldA).substring(2) : ''}}
```


## Ergänzung

Expressions werden durch den Renderer interpretiert, der nach dem Laden der
Seite startet. Somit können Expressions beim Laden der Seite sichtbar sein. Hier
empfiehlt sich die Auslagerung in die DataSource und sowie die Verwendung der
Attribute [release](markup.md#release) oder [output](markup.md#output) und
[import](markup.md#import) im Markup.

```css
*[release] {
  display:none;
}

h1:after {
  content:attr(title)
}
```

```html
<h1 release>{{'Hello World!'}}</h1>

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

[Markup](markup.md) | [Inhalt](README.md#expression-language) | [DataSource](datasource.md)
