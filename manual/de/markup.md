# Markup

Mit aspect-js wird der deklarative Ansatz von HTML weiter ausgebaut.
Neben der Expression-Language werden für Funktionen und Objektbindung Attribute
an den HTML-Elementen verwendet.


## Inhalt

* [Attribute](#attribute)
  * [condition](#condition)
  * [interval](#interval)

## Attribute


### condition

Die Sichtbarkeit der HTML-Elemente, die Interpretation der aspect-js
Attribute und das Rendering lassen sich über das condition-Attribut steuern,
welches für jedes HTML-Element verwendet werden kann.
Als Wert wird eine Expression erwartet, die als Ergebnis den Wert `true`
erwartet. In allen anderen Fällen wird die Anzeige unterdrück und die
Verarbeitung durch aspect-js ausgesetzt..

```
<article condition="{{ArticleModel.visible}}">
  ...
</article>
```


### interval

Dieses Attribut aktiviert eine zeitgesteuerte Auffrischung (Re-rendering) eines
HTML-Elements, ohne dass die Auffrischung aktiv angestossen werden muss.  
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

Beim SPAN-Element wird die Auffrischung (Re-rendering) alle 1000ms automatisch
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
