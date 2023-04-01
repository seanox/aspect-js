[Markup](markup.md) | [Inhalt](README.md#scripting) | [DataSource](datasource.md)
- - -

# Scripting

TODO:


## Inhalt

TODO:


## Eingebettetes Composite-JavaScript

TODO:


## Module

TODO:


## Makros

TODO:

## #export

TODO:

## #import

TODO:

## #module

TODO:

## Tolerante Syntax

TODO:


## Debugging

Da Ressourcen und Module, was JavaScript einschliesst, erst zur Laufzeit geladen
werden, kennt der Browser die Quellen nicht und so werden die Module in den
Entwicklerwerkzeugen der Browser nicht angezeigt, was u.a. f&uuml;r die
Verwendung von Break-Points wichtig ist. Daher muss hier der Einstiegspunkt ins
JavaScript &uuml;ber die Browser-Konsole genutzt werden, welche neben der
Text-Ausgabe auch einen Link zur Quelle der Ausgabe enth&auml;lt. Und &uuml;ber
diesen Link l&auml;sst sich auch der Quelltext der Module im Debugger
&ouml;ffnen und gewohnt mit Break-Points nutzen.

Daher sollten Module zum Debugging eine entsprechende Konsolen-Ausgabe erzeugen.
Das kann manuell &uuml;ber das `console` Objekt oder alternativ mit dem Makro
[#module](#module) m&ouml;glich ist.

```javascript
#module example;
...
```


- - -

[Markup](markup.md) | [Inhalt](README.md#scripting) | [DataSource](datasource.md)
