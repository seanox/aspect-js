[Markup](markup.md) | [Inhalt](README.md#scripting) | [DataSource](datasource.md)
- - -

# Scripting

TODO:

Composite-JavaScript, was auch die Module einschliesst, wird nicht als Element
eingef&uuml;gt, sondern direkt mit der eval-Methode ausgef&uuml;hrt. Da hierzu
ein isolierter und nicht der globale G&uuml;ltigkeitsbereich (Scope) verwendet
wird, sind Variablen, Konstanten und Methoden nicht direkt global oder
&uuml;bergreifend nutzbar, weshalb u.a. das Composite-JavaScript mit [Makros](
    #makros) angereichert wurde, welche u.a. solche Aufgaben &uuml;bernehmen.


## Inhalt

* [Eingebettetes Composite-JavaScript](#eingebettetes-composite-javascript)
* [Module](#module)
* [Makros](#makros)
  * [#export](#export)
  * [#import](#import)
  * [#module](#module)
  * [(?...) tolerate](#-tolerate)
* [Debugging](#debugging)


## Eingebettetes Composite-JavaScript

TODO:


## Module

TODO:


## Makros

Makros sind eine einfache Meta-Syntax, die sich in die bestehende
JavaScript-Syntax einf&uuml;gt. Im Kern sind es verk&uuml;rzte Schreibweisen
oder Umschreibungen für g&auml;ngige JavaScript-Anweisungen.

### #export

Composite-JavaScript, was auch die Module einschliesst, wird nicht als Element
eingef&uuml;gt, sondern direkt mit der eval-Methode ausgef&uuml;hrt. Da hierzu
ein isolierter und nicht der globale G&uuml;ltigkeitsbereich (Scope) verwendet
wird, sind Variablen, Konstanten und Methoden nicht direkt global oder
&uuml;bergreifend nutzbar.

Hier lassen sich Variablen, Konstanten und Methoden mit dem Makro `#export`
global nutzbar machen. Nach dem Namen des Makros werden bis zum Zeilenende oder
bis zum n&auml;chsten Semikolon eine durch Leerzeichen getrennte Liste mit den
Namen der Elemente erwartet, die &ouml;ffentlich zug&auml;nglich gemacht werden
sollen.

```javascript
const connector = {
    ...
};

const utilities = {
    ...
};

#export connector utilities;
```

Die Namen der Elemente k&ouml;nnen f&uuml;r den Export um Namensr&auml;ume
erweitert werden, damit diese explizit dort hinzugef&uuml;gt werden.

```javascript
const connector = {
    ...
};

const utilities = {
    ...
};

#export connector@io.example utilities@io.example
```

### #import

Das Makro l&auml;dt ein oder durch Leerzeichen getrennt mehrere
(Composite)-JavaScript-Module aus dem Modul-Verzeichnis, wobei JavaScript-Module
nur einmalig geladen werden, egal ob direkt &uuml;ber [#import](#import) oder
indirekt als Ressource zu einem Composite.

__Beim Aufruf von Modulen wird auf die Dateiendung verzichtet.__

```javascript
#import moduleA
#import moduleA moduleB moduleC
```

Zu beachten ist, dass das Makro bei einem Server-Status abweichend 200 zu einem
Fehler f&uuml;hrt. Da sich das Makro in die allgemeine JavaScript-Syntax
einf&uuml;gt, kann der Fehler wie gewohnt mit try-catch gefangen werden.

```javascript
try {#import moduleA;
} catch (error) {
    ...    
}    
```

Im Modul-Verzeichnis werden auch Unterverzeichnisse unterst&uuml;tzt, was in den
Modulnamen durch das Slash repr&auml;sentiert wird.

```javascript
#import example/io/connector;
```


### #module

TODO:

### (?...) tolerate

Ein ganz besonderes Makro ist die tolerierende Anweisung `(?...)`. So wird die
in den Klammern eingeschlossene Logik im Fall eines Fehlers nicht zum Fehler
f&uuml;hren und es wird keine Ausgabe in der Browserkonsole geben. Stattdessen
wird die Klammer den Wert `false` repr&auml;sentieren. Von diesem tolerierenden
Verhalten ausgenommen sind Syntaxfehler.

```javascript
const value = (?object.that.does.not.exist());
```


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
