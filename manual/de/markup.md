# Markup

Mit aspect-js wird der deklarative Ansatz von HTML weiter ausgebaut.
Neben der Expression-Language werden für Funktionen und Objektbindung Attribute
an den HTML-Elementen verwendet.

## Inhalt
* [Attribute](#attribute)
  * [interval](#interval)

## Attribute

### interval
Dieses Attribut aktiviert eine zeitgesteuerte Auffrischung (Re-rendering) eines
HTML-Elements, ohne dass die Auffrischung aktiv angestossen werden muss.  
Als Wert wird ein Interval in Millisekunden erwartet. Die Verarbeitung erfolgt
nebenläufig bzw. asynchron aber nicht parallel. Bedeutet, dass die Verarbeitung
nach dem gesetzten Zeit-Intervall starten soll, diese aber erst beginnt, wenn
eine zuvor begonnen JavaScript-Prozedur beendet wurde. Daher ist der Intervall
als zeitnah, nicht aber als exakt zu verstehen.

```
<span interval="1000">
  ...
</span>
```

Beim SPAN-Element wird die Auffrischung (Re-rendering) alle 1000ms automatisch
angestossen.

Das interval-Attribut kann für einfache HTML-Elementen, wie auch komplexe und
verschachtelte HTML-Konstrukte verwendet werden.

Das eingerichtete Intervall reagiert dabei intelligent auch Veränderungen im DOM
und beendet sich automatisch, wenn das Element selbst oder ein Eltern-Element
nicht mehr sichtbar ist oder aus dem DOM entfernt wurde. Bei ausgeblendeten
Elementen wird das Intervall mit der nächsten Anzeige erneut gestartet.   
Daher lässt sich das interval-Attribut gut mit dem condition-Attribut verwenden
und steuern.

```
<span interval="1000" condition="{{ExampleModel.isVisible()}}">
  ...
</span>
```

Der Wert für das Intervall kann auch eine Expression sein.

```
<span interval="{{1000 +500}}" condition="{{ExampleModel.isVisible()}}">
  ...
</span>
```
