# Markup

Mit aspect-js wird der deklarative Ansatz von HTML aufgeriffen und erweitert.
Neben der Expression-Language werden für Funktionen und Objektbindung Attribute
an den HTML-Elementen verwendet.


## Inhalt

* [Expression Language](#expression-language)
* [Attribute](#attribute)
  * [condition](#condition)
  * [events + render](#events-render)
  * [import](#import)
  * [interval](#interval)
  * [iterate](#iterate)
  * [output](#output)
  * [sequence](#sequence)
* [Scripting](#scripting)
* [Customizing](#customizing)
  * [Tag](#tag)   
  * [Selector](#selector)
  
## Expression Language

Die Expression-Language kann innerhalb vom Markup als Freitext und in den
Attributen der HTML-Elemente verwendet werden. Ausgenommen sind JavaScript- und
CSS-Elemente. Hier wird die Expression-Language nicht unterstützt.

```
<article title="{{Model.title}}">
  {{'Hallo World!'}}
  ...
</article>
```

Details zu Syntax und Verwendung werden im Kapitel
[Expression Language](expression-language.md) beschrieben.
  

## Attribute

Der deklarative Ansatz ist in aspect-js vorrangig mit Attributen umgesetzt. Die
entsprechenden Deklaration können mit allen HTML-Elementen verwendet werden,
ausgenommen sind `SCRIPT`, was nur mit den Typen `composite/javascript` bzw.
`condition/javascript` unterstützt wird, sowie `STYLE`, welches nicht unterstützt
wird.  


### condition

Das condition-Attribut legt fest, ob ein Element aufgefrischt (Re-Rendering) 
wird oder nicht. Der mit dem Attribut angegebene Ausdrucks muss explizit `true`
oder `false` liefern, da die Sichtbarkeit der Elemente ebenfalls explizit per
CSS-Bedingung `[condition=true]` gesteuert wird.

```
<article condition="{{Model.visible}}">
  ...
</article>
```

Die Verwendung vom condition-Attribut in Verbindung mit eingebettem JavaScript
ist als Composite- bzw. Condition-JavaScript möglich.

```
<script type="composite/javascript" condition="{{Model.visible}}">
  ...
</script>
```
 
```
<script type="condition/javascript" condition="{{Model.visible}}">
  ...
</script>
```

Details zur Verwendung von eingebettem JavaScript werden im Kapitel
[Scripting](#scripting) beschrieben.


### events + render

TODO:


### import

TODO:


### interval

Diese Deklaration aktiviert eine intervalgesteuerte Auffrischung (Re-Rendering)
eines HTML-Elements, ohne dass die Auffrischung aktiv angestossen werden muss.
Als Wert wird ein Interval in Millisekunden erwartet, der auch als Expression
formuliert werden kann. Die Verarbeitung erfolgt nebenläufig bzw. asynchron aber
nicht parallel. Bedeutet, dass die Verarbeitung nach dem gesetzten
Zeit-Intervall starten soll, diese aber erst beginnt, wenn eine zuvor begonnen
JavaScript-Prozedur beendet wurde. Daher ist das Intervall als zeitnah, nicht
aber als exakt zu verstehen.
Das interval-Attribut erwartet einen Wert in Millisekunden. Ein ungültiger Wert
verursacht eine Konsolenausgabe. Das Intervall beginnt automatisch mit dem
Rendern vom deklariertes HTML-Element und wird beendet bzw. entfernt wenn:
- das Element nicht mehr im DOM existiert 
- das condition-Attribut `false` ist
- das Element oder ein Elternteil nicht mehr sichtbar ist
Wird ein HTML-Element als Intervall deklariert, wird der ursprüngliche innerer
HTML-Code als Vorlage verwendet. Während der Intervalle wird zuerst der innere
HTML-Code geleert, die Vorlage mit jedem Intervallzyklus einzeln gerendert und
das Ergebnis dem inneren HTML-Code hinzugefügt. Der MutationObserver initiiert
dabei bei Bedarf ein rekursives Rendering, damit auch der eingefügte HTML-Code
vom Renderer verarbeitet wird.  

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

Die Verwendung vom interval-Attribut in Verbindung mit eingebettem JavaScript
ist als Composite- bzw. Condition-JavaScript möglich.

```
<script type="composite/javascript" interval="1000">
  ...
</script>
```
 
```
<script type="condition/javascript" interval="1000">
  ...
</script>
```


### iterate

Iteratives Rendering basiert auf Listen, Aufzählungen und Arrays.  
Wird ein HTML-Element als iterativ deklariert, wird sein ursprünglicher innerer
HTML-Code als Vorlage verwendet. Während der Iteration wird beim HTML-Element
der innere HTML-Code zunächst entfernt, die Vorlage bei jedem Iterationszyklus
einzeln gerendert und das Ergebnis dem inneren HTML-Code hinzugefügt. Der
MutationObserver initiiert dabei bei Bedarf ein rekursives Rendering, damit auch
der eingefügte HTML-Code vom Renderer verarbeitet wird.    
Das iterate-Attribut erwartet einen Parameter-Ausdruck, zudem ein Meta-Objekt
erstellt wird (`iterat={{tempA:Model.list}}}` erzeugt `tempA = {item, index, data}`),
dass den Zugriff auf Iterationszyklus ermöglich.  

```
var Model = {
    months: ["Frühling", "Sommer", "Herbst", "Winter"]
};

<select iterate={{months:Model.months}}>
  <option id="{{months.index}}">
    {{months.item}}
  </option>
</select>
```


### output

Setzt den inneren HTML-Code eines Element

Setzt den Wert oder das Ergebnis eines Ausdrucks als inneren HTML-Code bei einem
HTML-Element. Der Rückgabewert vom Ausdruck kann ein Element oder eine
Knotenliste mit Elementen sein. Alle anderen Datentypen werden als Text gesetzt.
Die Ausgabe ist exklusiv und überschreibt den vorhandene inneren HTML-Code. Der
MutationObserver initiiert dabei bei Bedarf ein rekursives Rendering, damit auch
der eingefügte HTML-Code vom Renderer verarbeitet wird.

```
var Model = {
    publishForm: function() {
        var form = document.createElement("form");
        var label = document.createElement("label");
        label.textContent = "Input";
        form.appendChild(label);
        var input = document.createElement("input");
        input.value = "123";
        input.type = "text";
        form.appendChild(input);
        var submit = document.createElement("input");
        submit.type = "submit";
        form.appendChild(submit);
        return form;
    },
    publishImg: function() {
        var img = document.createElement("img");
        img.src = "https://raw.githubusercontent.com/seanox/aspect-js/master/test/resources/smile.png";
        return img;
    },
    publishText: "Hallo Welt!"
};

<article output="{{Model.publishImg()}}">
  loading image...  
</article>
<article output="{{Model.publishText}}">
  loading text...  
</article>
<article output="{{Model.publishForm()}}">
  loading form...  
</article>
```

### sequence

Sequence ist eine sehr spezielle Deklaration und steuert die Reihenfolge der
nebenläufigen DOM-Verarbeitung. Sequence legt fest, dass die Verarbeitung der
Kinder eines HTML-Elements der seriellen Verzweigung folgt, also von oben nach
unten und von links nach rechts: 1, 1.1, 1.1.1, 1.2, 1.2.1, 2, ...
Diese Angabe ist wichtig, wenn das Rendern und/oder die Objekt-Bindung eine
bestimmte logische Reihenfolge einhalten muss.

```
<article sequence>
  {{index:0}}
  <div id="{{index +1}}">
    <div id="{{index +2}}">
      <div id="{{index +3}}"></div>
    </div>
    <div id="{{index +4}}">
      <div id="{{index +5}}"></div>
    </div>
  </div>
  <div id="{{index +6}}">
  </div>
</article>
```


## Scripting

TODO:


## Customizing

TODO:


### Tag

TODO:


### Selector

TODO:

