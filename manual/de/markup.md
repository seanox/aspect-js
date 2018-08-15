# Markup

Mit aspect-js wird der deklarative Ansatz von HTML aufgegriffen und erweitert.
Neben der Expression-Language werden den HTML-Elementen zusätzliche Attribute
für Funktionen und Objektbindung Attribute bereitgestellt.  
Der entsprechende Renderer ist in der Composite-Implementierung enthalten und
überwacht das DOM aktiv über den MutationObserver und funktioniert und reagiert
somit rekursiv auf Veränderungen im DOM.

## Inhalt

* [Expression Language](#expression-language)
* [Attribute](#attribute)
  * [condition](#condition)
  * [events](#events)
  * [import](#import)
  * [interval](#interval)
  * [output](#output)
  * [render](#render)    
  * [sequence](#sequence)
  * [validate](#validate)  
* [Scripting](#scripting)
* [Customizing](#customizing)
  * [Tag](#tag)   
  * [Selector](#selector)
  
## Expression Language

Die Expression-Language kann innerhalb vom Markup als Freitext und in den
Attributen der HTML-Elemente verwendet werden. Ausgenommen sind JavaScript- und
CSS-Elemente. Hier wird die Expression-Language nicht unterstützt.  
Die direkte Verwendung als Freitext wird immer als reiner Text (plain text)
verarbeitet. Das Hinzufügen von Markup, insbesondere HTML-Code, ist so nicht
möglich und wir nur mit den Attributen `output` und `import` unterstützt.

```
<article title="{{Model.title}}">
  {{'Hello World!'}}
  ...
</article>
```

Details zu Syntax und Verwendung werden im Kapitel
[Expression Language](expression-language.md) beschrieben.
  

## Attribute

Der deklarative Ansatz ist in aspect-js vorrangig mit Attributen umgesetzt. Die
entsprechenden Deklaration können mit allen HTML-Elementen verwendet werden,
ausgenommen sind `SCRIPT`, was nur mit Typen `composite/javascript` unterstützt
wird, sowie `STYLE`, welches nicht unterstützt wird.  
Attribute unterstützen Expressions.  
Enthält ein Attribute eine Expression, werden das Attribute und der Wert
unveränderlich, da der Renderer diese bei jeder Auffrischung (Re-Rendering)
erneut mit dem aktualisierten Wert der initialen Expression setzen wird.
    TODO: Elemente und Attribute werden vom Renderer immer initial verarbeitet.
Spätere ÄNderungen werden vom Renderer nicht berücksichtig. Attribute mit
Expression werden bei jedem Render-zyklus wiederhergestellt, die anderen werden
ignoriert, Änderungen werden später nicht berücksichtig.


### condition

Das condition-Attribut legt fest, ob ein Element aufgefrischt (Re-Rendering) 
wird oder nicht. Der mit dem Attribut angegebene Ausdruck muss explizit `true`
oder `false` liefern, da die Sichtbarkeit der Elemente ebenfalls explizit per
CSS-Bedingung `[condition=true]` gesteuert wird.

```
<article condition="{{Model.visible}}">
  ...
</article>
```

Die Verwendung vom condition-Attribut in Verbindung mit eingebettetem JavaScript
ist als Composite- bzw. Condition-JavaScript möglich.

```
<script type="composite/javascript" condition="{{Model.visible}}">
  ...
</script>
```

Details zur Verwendung von eingebettetem JavaScript werden im Kapitel
[Scripting](#scripting) beschrieben.


### events

Diese Deklaration bindet ein oder mehre Ereignisse an ein HTML-Element.  
Übersicht der Ereignisse: https://www.w3.org/TR/DOM-Level-3-Events  
Ereignisse eröffnen primäre Funktionen zur Validierung und Synchronisation von
HTML-Elementen und den korrespondierenden JavaScript-Modellen (mehr dazu im
Kapitel [validate](#validate) sowie die ereignisgesteuerte Aktualisierung von
weiteren HTML-Elementen (mehr dazu im Kapitel [render](#render)).  

```
var Model = {
    validate: function(element, value) {
        return true;
    },
    text1: ""
};

<form id="Model" composite>
  <input id="text1" type="text"
      validate events="mouseup keyup change"/>
  <input type="submit" value="submit"
      validate events="click"/>
</form>
```

Beispiel zur grundlegenden Verwendung, Implementierung und Funktion sowie dem
Zusammenspiel der Attribute `events` und `validate`. In dem Beispiel wird der
Eingabewert vom Composite-Feld text1 nur dann in das gleichnamige Feld im
JavaScript-Model übernommen, wenn mindestens eines der Ereignisse: _MouseUp_,
_KeyUp_ oder _Change_ eintritt und die Validierung den Wert `true` zurückgibt.


### import

Diese Deklaration lädt Inhalte dynamisch nach und ersetzt den inneren HTML-Code
eines Elements. Wenn der Inhalt erfolgreich geladen wurde, wird das Attribut
`import` entfernt. Das Attribut erwartet als Wert ein Elemente oder mehre
Elemente als NodeList bzw. Array -- diese werden dann direkt eingefügt und
verhält sich ähnlich wie das Attribut `output`, oder der Wert wird als entfernte
Ressource mit relativer bzw. absoluter URL betrachtet und per HTTP-Methode GET
nachgeladen. Das Laden und Ersetzen der Import-Funktion lässt sich mit dem
condition-Attribut kombinieren und wird dann erst ausgeführt, wenn die Bedingung
`true` ist.

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
    }
};

<article import="{{Model.publishImg()}}">
  loading image...  
</article>
<article import="{{Model.publishForm()}}">
  loading form...  
</article>e>
<article import="{{'https://raw.githubusercontent.com/seanox/aspect-js/master/test/resources/import.htmlx'}}">
  loading resource...  
</article>
```


### interval

Diese Deklaration aktiviert eine intervallgesteuerte Auffrischung (Re-Rendering)
eines HTML-Elements, ohne dass die Auffrischung aktiv angestossen werden muss.
Als Wert wird ein Intervall in Millisekunden erwartet, der auch als Expression
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
das Ergebnis dem inneren HTML-Code hinzugefügt.

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
eines permanenten Zählers sehr einfach.

```
{{count:0}}
<span interval="1000">
  {{count:parseInt(count) +1}}^
  {{count}}
</span>
```

Die Verwendung vom interval-Attribut in Verbindung mit eingebettetem JavaScript
ist als Composite- bzw. Condition-JavaScript möglich.

```
<script type="composite/javascript" interval="1000">
  ...
</script>


### iterate

Iteratives Rendering basiert auf Listen, Aufzählungen und Arrays.  
Wird ein HTML-Element als iterativ deklariert, wird sein ursprünglicher innerer
HTML-Code als Vorlage verwendet. Während der Iteration wird beim HTML-Element
der innere HTML-Code zunächst entfernt, die Vorlage bei jedem Iterationszyklus
einzeln gerendert und das Ergebnis dem inneren HTML-Code hinzugefügt.
Das iterate-Attribut erwartet einen Parameter-Ausdruck, zudem ein Meta-Objekt
erstellt wird (`iterat={{tempA:Model.list}}}` erzeugt `tempA = {item, index, data}`),
dass den Zugriff auf Iterationszyklus ermöglich.  

```
var Model = {
    months: ["Spring", "Summer", "Autumn", "Winter"]
};

<select iterate={{months:Model.months}}>
  <option id="{{months.index}}">
    {{months.item}}
  </option>
</select>
```


### output

Setzt den Wert oder das Ergebnis eines Ausdrucks als inneren HTML-Code bei einem
HTML-Element. Der Rückgabewert vom Ausdruck kann ein Element oder eine
Knotenliste mit Elementen sein. Alle anderen Datentypen werden als Text gesetzt.
Die Ausgabe ist exklusiv und überschreibt den vorhandenen inneren HTML-Code.

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
    publishText: "Hello World!"
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


### render

Die Deklaration mit dem Attribut `render` erfordert die Deklaration mit dem
Attribut `events`. Das Attribut definiert, welche Ziele nach dem Auftreten eins
oder verschiedener Events aktualisiert (Re-Rerending) wird.  
Als Wert erwartet das Attribut einen CSS-Selector bzw. Query-Selector welche
die Ziele definieren.

```
var Model = {
    _status1: 0,
    getStatus1: function() {
        return ++Model._status1;
    },
    _status2: 0,
    getStatus2: function() {
        return ++Model._status2;
    },
    _status3: 0,
    getStatus3: function() {
        return ++Model._status3;
    }
};
    
Taget #1:
<span id="outputText1">{{Model.status1}}</span>
Events: Wheel
<input id="text1" type="text"
    events="wheel"
    render="#outputText1, #outputText2, #outputText3"/>

Target #2:
<span id="outputText2">{{Model.status2}}</span>
Events: MouseDown KeyDown
<input id="text1" type="text"
    events="mousedown keydown"
    render="#outputText2, #outputText3"/>

Target #3:
<span id="outputText3">{{Model.status3}}</span>
Events: MouseUp KeyUp
<input id="text1" type="text"
    events="mouseup keyup"
    render="#outputText3"/>
```  

Das Beispiel enthält 3 Eingabefelder mit unterschiedlichen Ereignissen (events)
und Zielen (render). Die Ziele sind hochzählende Textausgaben, welche auf die
entsprechenden Ereignisse reagieren.


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


### validate

Die Deklaration mit dem Attribut `validate` erfordert die Deklaration mit dem
Attribut `events`. Das Attribut `validate` steuert die Synchronisation zwischen
Markup eines Composites und dem korrespondierenden JavaScript-Model.  
Wird `validate` verwendet, muss das JavaScript-Model eine entsprechende
validate-Methode implementieren: `boolean Model.validate(element, value)`  
Der Rückgabewert muss ein boolescher Wert sein und so wird nur beim Rückgabewert
`true` der Wert aus dem Composite in das JavaScript-Model übertragen.  

Eine allgemeine Strategie oder Standard-Implementierung zur Fehlerausgabe wird
bewusst nicht bereitgestellt, da diese in den meisten Fällen zu starr ist und
diese mit geringem Aufwand als zentrale Lösung implementiert werden kann.

```
input.invalid {
    border:1px solid #FF0000;
    background:#FFE0E0;
}

var Model = {
    validate: function(element, value) {
        var valid = !!(value || "").match(/[a-z0-9]+[\w\.\-]*@[a-z0-9]+[\w\.\-]*/i);
        if (element) {
            element.className = (" " + element.className + " ").replace(/\s+(in){0,1}valid\s+/ig, " ").trim();
            element.className += valid ? " valid" : " invalid";
            element.className = element.className.trim();
        }
        return valid;
    },
    text1: ""
};

<form id="Model" composite>
  <input id="text1" type="text" placeholder="e-mail address"
      validate events="mouseup keyup change" render="#Model"/>
  input: {{Model.text1}}    
  <input type="submit" value="submit" validate events="click"/>
</form>
```

In dem Beispiel erwartet das Eingabefeld eine E-Mail-Adresse.  
Das Format wird fortlaufend bei der Eingabe überprüft und das Eingabefeld bei
ungültigen Eingaben als `invalid` gekennzeichnet. Unterhalb vom Eingabefeld ist
die Kontrollausgabe vom korrespondierenden Feld im Model. Dieses Feld wird nur
synchronisiert, wenn die validate-Methode den Wert `true` zurückgibt.


## Scripting

Eingebettetes Scripting bringt einige Besonderheit mit sich.  
Das Standard-Scripting wird vom Browser automatisch und unabhängig vom Rendering
ausgeführt. Daher wurde das Scripting für das Rendering angepasst und ein neuer
Type von Scripten: `composite/javascript`. Dieser verwendet das normale JavaScript.
Im Gegensatz zum Typ `text/javascript` erkennt der Browser diesen aber nicht und
führt den JavaScript-Code nicht automatisch aus. Der Renderer aber erkennt den
JavaScript-Code und führt diesen in jedem Renderzyklus aus, wenn der Zyklus ein
SCRIPT-Element enthält. Auf diese Weise kann die Ausführung vom SCRIPT-Element
auch mit dem Attribut `condition` kombiniert werden.  
Eingebettete Skripte müssen "ThreadSafe" sein.

```
<script type="composite/javascript">
  ...
</script>
```


## Customizing

TODO:


### Tag

TODO:


### Selector

TODO:

