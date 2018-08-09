# Markup

Mit aspect-js wird der deklarative Ansatz von HTML aufgeriffen und erweitert.
Neben der Expression-Language werden für Funktionen und Objektbindung Attribute
an den HTML-Elementen verwendet.


## Inhalt

* [Expression Language](#expression-language)
* [Attribute](#attribute)
  * [condition](#condition)
  * [interval](#interval)
* [Scripting](#scripting)
* [Customizing](#customizing)
  * [Tag](#tag)   
  * [Selector](#selector)
  
## Expression Language

Die Expression-Language kann als Freitext innerhalb vom Markup verwendet werden.
Ausgenommen sind JavaScript- und CSS-Elemente. Hier wird die Expression-Language
nicht unterstützt.

```
<article>
  {{'Hallo World!'}}
  ...
</article>
```

Details zu Syntax und Verwendung werden im Kapitel
[Expression Language](expression-language.md) beschrieben.
  

## Attribute


### condition

Dieses Attribut Die Sichtbarkeit der HTML-Elemente, die Interpretation der aspect-js
Attribute und das Rendering lassen sich über das condition-Attribut steuern,
welches für jedes HTML-Element verwendet werden kann.
Als Wert wird eine Expression erwartet, die als Ergebnis den Wert `true`
erwartet. In allen anderen Fällen wird die Anzeige unterdrück und die
Verarbeitung durch aspect-js ausgesetzt.

```
<article condition="{{ArticleModel.visible}}">
  ...
</article>
```


### interval

Diese Deklaration aktiviert eine intervalgesteuerte Auffrischung (Re-Rendering)
eines HTML-Elements, ohne dass die Auffrischung aktiv angestossen werden muss.  
Als Wert wird ein Interval in Millisekunden erwartet, der auch als Expression
formuliert werden kann. Die Verarbeitung erfolgt nebenläufig bzw. asynchron aber
nicht parallel. Bedeutet, dass die Verarbeitung nach dem gesetzten
Zeit-Intervall starten soll, diese aber erst beginnt, wenn eine zuvor begonnen
JavaScript-Prozedur beendet wurde. Daher ist das Intervall als zeitnah, nicht
aber als exakt zu verstehen.

```
<span interval="1000">
  ...
</span>

<span interval="{{1000 +500}}">
  ...
</span>
```

Beim SPAN-Element wird die Auffrischung (Re-Rendering) alle 1000ms automatisch
angestossen.

Das interval-Attribut kann für einfache HTML-Elementen, wie auch komplexe und
verschachtelte HTML-Konstrukte verwendet werden.

Das eingerichtete Intervall reagiert dynamisch auch Veränderungen im DOM und
beendet sich automatisch, wenn das Element selbst oder ein Eltern-Element nicht
mehr sichtbar ist oder aus dem DOM entfernt wurde. Bei ausgeblendeten Elementen
wird das Intervall mit der nächsten Anzeige erneut gestartet.  
Daher lässt sich das interval-Attribut gut mit dem condition-Attribut verwenden
und steuern.

```
<span interval="1000" condition="{{IntevalModel.isVisible()}}">
  ...
</span>
```

Mit der Kombination von Intervall und Variablen-Expression ist die Umsetzung
eines permanten Zählers sehr einfach.

```
{{count:0}}
<span interval="1000">
  {{count:parseInt(count) +1}}^
  {{count}}
</span>
```


## Scripting

TODO:


## Customizing

TODO:


### Tag

TODO:


### Selector

TODO:

