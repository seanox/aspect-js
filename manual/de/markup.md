# Markup

Mit aspect-js wird der deklarative Ansatz von HTML aufgegriffen und erweitert.
Neben der Expression-Language werden den HTML-Elementen zusätzliche Attribute
für Funktionen und Objekt-Bindung bereitgestellt.  
Der entsprechende Renderer ist in der Composite-Implementierung enthalten und
überwacht das DOM aktiv über den MutationObserver und funktioniert und reagiert
somit rekursiv auf Veränderungen im DOM.


## Inhalt

* [Expression Language](#expression-language)
* [Attribute](#attribute)
  * [composite](#composite)
  * [condition](#condition)
  * [events](#events)
  * [import](#import)
  * [interval](#interval)
  * [output](#output)
  * [render](#render)    
  * [validate](#validate)  
* [Scripting](#scripting)
* [Customizing](#customizing)
  * [Tag](#tag)   
  * [Selector](#selector)
  * [Acceptor](#acceptor)
  
  
## Expression Language

Die Expression-Language kann im Markup als Freitext und in den Attributen der
HTML-Elemente verwendet werden. Ausgenommen sind JavaScript- und CSS-Elemente.
Hier wird die Expression-Language nicht unterstützt.  
Bei der Verwendung als Freitext wird als Ausgabe immer reiner Text (plain text)
erzeugt. Das Hinzufügen von Markup, insbesondere HTML-Code, ist so nicht möglich
und wir nur mit den Attributen `output` und `import` unterstützt.

```html
<article title="{{Model.title}}">
  {{'Hello World!'}}
  ...
</article>
```

Details zu Syntax und Verwendung werden im Abschnitt
[Expression Language](expression.md) beschrieben.
  

## Attribute

Der deklarative Ansatz ist in aspect-js vorrangig mit Attributen umgesetzt und
kann mit allen HTML-Elementen verwendet werden, ausgenommen sind `SCRIPT`, was
nur mit dem Typ `composite/javascript` unterstützt wird, sowie `STYLE`,
welches nicht unterstützt wird. Die Werte der Attribute können statische oder
mit Verwendung der Expression-Language dynamisch sein.
Enthält ein Attribut eine Expression, werden das Attribut und der Wert
unveränderlich, da der Renderer diese bei jeder Auffrischung (Render-Zyklus)
erneut mit dem aktualisierten Wert der initialen Expression setzen wird.


### composite

Kennzeichnet im Markup ein Element als [Composite](composites.md).  
Composites sind modulare Komponente und haben in aspect-js eine vielseitige
Bedeutung.  
Sie werden von der [SiteMap](mvc.md#sitemap) als Faces, also als Ziele für
virtuelle Pfade im Face-Flow verwendet, was direkten Einfluss auf die
Sichtbarkeit der Composites hat.
Der [Model View Controler](mvc.md#sitemap) unterstützt für Composites eine
automatisches [Objekt-/Model-Binding](object-binding.md).  
Die Ressourcen (CSS, JS, Markup) lassen sich für Composite in das
Modul-Verzeichnis auslagern und werden erst bei Bedarf automatisch nachgeladen. 

```html
<article composite>
  ...
</article>
```

Das Attribut hat keinen Wert.  
Es kann mit dem Attribute `static` kombiniert werden.
Dann wird das Composite als Face unabhängig von virtuellen Pfaden permanent
sichtbar.

```html
<article composite static>
  ...
</article>
```

Details zur Verwendung von Composites / modularen Komponente werden in den
Abschnitten [Composites](composites.md) und [Model View Controler](mvc.md)
beschrieben.


### condition

Das condition-Attribut legt fest, ob ein Element im DOM erhalten bleibt.  
Der mit dem Attribut angegebene Ausdruck muss explizit `true` oder `false`
zurückliefern. Mit `false` wird ein Element temporär aus dem DOM entfernt und
lässt sich später durch das Auffrischen des __Eltern-Elements__ wieder einfügen,
wenn der Ausdruck `true` zurückliefert.  
Eine Besonderheit stellt die Kombination mit dem Attribut [interval](#interval)
dar, da mit dem Entfernen des Elements aus dem DOM auch der zugehörige Timer
beendet wird. Wird das Element mit einer späteren Auffrischung wieder in das DOM
aufgenommen, startet der Timer von vorn, wird also nicht fortgesetzt.

```html
<article condition="{{Model.visible}}">
  ...
</article>
```

Die Verwendung vom condition-Attribut in Verbindung mit eingebettetem JavaScript
ist als Composite-JavaScript möglich.

```html
<script type="composite/javascript" condition="{{Model.visible}}">
  ...
</script>
```

Details zur Verwendung von eingebettetem JavaScript werden im Abschnitt
[Scripting](#scripting) beschrieben.


### events

Diese Deklaration bindet ein oder mehre Ereignisse (siehe
https://www.w3.org/TR/DOM-Level-3-Events) an ein HTML-Element. Ereignisse
eröffnen primäre Funktionen zur ereignisgesteuerte Auffrischung von anderen
HTML-Elementen (mehr dazu im Abschnitt [render](#render)), sowie zur Validierung
und Synchronisation von HTML-Elementen und den korrespondierenden
JavaScript-Modellen (mehr dazu im Abschnitt [validate](#validate).  

```html
<span id="output1">{{#text1.value}}</span>
<input id="text1" type="text"
    events="mouseup keyup change" render="#output1"/>
```

Beispiel zur synchronen Auffrischung vom HTML-Element _output1_ mit den
Ereignissen _MouseUp_, _KeyUp_ oder _Change_ beim HTML-Element _text1_. In dem
Beispiel wird der Eingabewert von _text1_ synchron mit _output1_ ausgegebem.

```javascript
var Model = {
    validate: function(element, value) {
        return true;
    },
    text1: ""
};
```

```html
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
Elemente als NodeList bzw. Array -- diese werden dann direkt eingefügt, oder
eine absolute oder relative URL zu einer entfernten Ressource, die per
HTTP-Methode GET nachgeladen wird, oder eine DataSource-URL die einen Inhalt aus
der DataSource lädt und transformiert, erwartet.

In allen Fällen lässt sich das import-Attribut mit dem condition-Attribut
kombinieren und wird dann erst ausgeführt, wenn die Bedingung `true` ist.

Das Verhalten ist vergleichbar mit dem Attribut `output`, im Unterschied wird
der Import für das Element nur einmalig ausgeführt.


```javascript
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
```

```html
<article import="{{Model.publishImg()}}">
  loading image...  
</article>
<article import="{{Model.publishForm()}}">
  loading form...  
</article>
```

Beispiel für den Import einer entfernten Ressource per HTTP-Methode GET.

```html
<article import="{{'https://raw.githubusercontent.com/seanox/aspect-js/master/test/resources/import.htmlx'}}">
  loading resource...  
</article>

<article import="https://raw.githubusercontent.com/seanox/aspect-js/master/test/resources/import.htmlx">
  loading resource...  
</article>
```

Beispiel für den Import einer DataSource-Ressource.  
Wird nur eine URL angegeben, werden die Daten- und Transformation-URL daraus
abgeleitet. 

```html
<article import="{{'xml:/example/content'}}">
  loading resource...  
</article>

<article import="xml:/example/content">
  loading resource...  
</article>
```

Beispiel für den Import einer DataSource-Ressource mit spezifischer Daten- und
Transformation-URL. Die Trennung erfolgt durch Leerzeichen, beide müssen mit
dem DataSource-Protokoll beginnen und es werden nur die ersten beiden Einträge
verwendet, von denen der erste aus die Daten und der zweite auf die
Transformation verweist.

```html
<article import="{{'xml:/example/data xslt:/example/style'}}">
  loading resource...  
</article>

<article import="xml:/example/data xslt:/example/style">
  loading resource...  
</article>
```

Beim Einfügen von Inhalten aus der DataSource, werden Script-Blöcke automatisch
in composite/javascript geändert und werden erst durch den Renderer ausgeführt.
So wird gewährleistet, dass das JavaScript ggf. erst abhängig von
umschliessenden condition-Attribute aufgeführt wird.


### interval

Diese Deklaration aktiviert eine intervallgesteuerte Auffrischung eines
HTML-Elements, ohne dass die Auffrischung aktiv angestossen werden muss.  
Als Wert wird ein Intervall in Millisekunden erwartet, der auch als Expression
formuliert werden kann. Die Verarbeitung erfolgt nebenläufig bzw. asynchron aber
nicht parallel. Bedeutet, dass die Verarbeitung nach dem gesetzten
Zeit-Intervall starten soll, diese aber erst beginnt, wenn eine zuvor begonnen
JavaScript-Prozedur beendet wurde. Daher ist das Intervall als zeitnah, nicht
aber als exakt zu verstehen.
Das interval-Attribut erwartet einen Wert in Millisekunden. Ein ungültiger Wert
verursacht eine Konsolenausgabe. Das Intervall beginnt automatisch mit dem
Auffrischen vom deklarierten HTML-Element und wird beendet bzw. entfernt wenn:
- das Element nicht mehr im DOM existiert
- das condition-Attribut `false` ist

Wird ein HTML-Element als Intervall deklariert, wird der ursprüngliche innerer
HTML-Code als Vorlage verwendet und während der Intervalle zuerst der innere
HTML-Code geleert, die Vorlage mit jedem Intervall-Zyklus einzeln generiert und
das Ergebnis dem inneren HTML-Code hinzugefügt.

```html
<span interval="1000">
  ...
</span>

<span interval="{{1000 +500}}">
  ...
</span>
```

Das SPAN-Element wird alle 1000ms aktualisiert.

Das interval-Attribut kann für einfache HTML-Elementen, wie auch komplexe und
verschachtelte HTML-Konstrukte verwendet werden.

Ein aktiver Intervalle reagiert dynamisch auch Veränderungen im DOM, endet
automatisch, wenn das HTML-Element aus dem DOM entfernt wurde und beginnt neu,
wenn das HTML-Element dem DOM erneut hinzugefügt wird. Daher lässt sich das
interval-Attribut gut mit dem condition-Attribut verwenden und steuern.

```html
<span interval="1000" condition="{{IntevalModel.isVisible()}}">
  ...
</span>
```

Mit der Kombination von Intervall und Variablen-Expression ist die Umsetzung
eines permanenten Zählers sehr einfach.

```html
{{counter:0}}
<span interval="1000">
  {{counter:parseInt(counter) +1}}^
  {{counter}}
</span>
```

Die Verwendung vom interval-Attribut in Verbindung mit eingebettetem JavaScript
ist als Composite-JavaScript möglich.

```html
<script type="composite/javascript" interval="1000">
  ...
</script>
```

### iterate

Die iterative Ausgabe basiert auf Listen, Aufzählungen und Arrays.  
Wird ein HTML-Element als iterativ deklariert, wird der initiale innerer
HTML-Code als Vorlage verwendet und während der Iteration der innere HTML-Code
zunächst entfernt, die Vorlage mit jeder Iteration einzeln generiert und das
Ergebnis dem inneren HTML-Code hinzugefügt.  
Das iterate-Attribut erwartet einen
[Variablen-Ausdruck](expression.md#variable-expression), zu dem ein Meta-Objekt
erstellt wird, dass den Zugriff auf die Iteration ermöglich.  
So erzeugt der Variablen-Ausdruck `iterat={{tempA:Model.list}}`
das Meta-Objekt `tempA = {item, index, data}`. 

```javascript
var Model = {
    months: ["Spring", "Summer", "Autumn", "Winter"]
};
```

```html
<select iterate={{months:Model.months}}>
  <option id="{{months.index}}">
    {{months.item}}
  </option>
</select>
```


### output

Das Attribut setzt den Wert oder das Ergebnis seines Ausdrucks als inneren
HTML-Code bei einem HTML-Element. Als Wert werden ein Elemente oder mehre
Elemente als NodeList bzw. Array -- diese werden dann direkt eingefügt, oder
eine absolute oder relative URL zu einer entfernten Ressource, die per
HTTP-Methode GET nachgeladen wird, oder eine DataSource-URL die einen Inhalt aus
der DataSource lädt und transformiert, erwartet.

In allen Fällen lässt sich das output-Attribut mit dem condition-Attribut
kombinieren und wird dann erst ausgeführt, wenn die Bedingung `true` ist.

Das Verhalten ist vergleichbar mit dem Attribut `import`, im Unterschied wird
der Output für das Element immer ausgeführt.


```javascript
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
```

```html
<article output="{{Model.publishImg()}}">
  loading image...  
</article>
<article output="{{Model.publishForm()}}">
  loading form...  
</article>
```

Beispiel für den Output einer entfernten Ressource per HTTP-Methode GET.

```html
<article output="{{'https://raw.githubusercontent.com/seanox/aspect-js/master/test/resources/import.htmlx'}}">
  loading resource...  
</article>

<article output="https://raw.githubusercontent.com/seanox/aspect-js/master/test/resources/import.htmlx">
  loading resource...  
</article>
```

Beispiel für den Output einer DataSource-Ressource.  
Wird nur eine URL angegeben, werden die Daten- und Transformation-URL daraus
abgeleitet. 

```html
<article output="{{'xml:/example/content'}}">
  loading resource...  
</article>

<article output="xml:/example/content">
  loading resource...  
</article>
```

Beispiel für den Output einer DataSource-Ressource mit spezifischer Daten- und
Transformation-URL. Die Trennung erfolgt durch Leerzeichen, beide müssen mit
dem DataSource-Protokoll beginnen und es werden nur die ersten beiden Einträge
verwendet, von denen der erste aus die Daten und der zweite auf die
Transformation verweist.

```html
<article output="{{'xml:/example/data xslt:/example/style'}}">
  loading resource...  
</article>

<article output="xml:/example/data xslt:/example/style">
  loading resource...  
</article>
```

Beim Einfügen von Inhalten aus der DataSource, werden Script-Blöcke automatisch
in composite/javascript geändert und werden erst durch den Renderer ausgeführt.
So wird gewährleistet, dass das JavaScript ggf. erst abhängig von
umschliessenden condition-Attribute aufgeführt wird.


### render

Das Attribut `render` erfordert die Kombination mit dem Attribut `events`.
Zusammen definieren sie, welche Ziele mit welchen auftretenden Events
aufgefrischt werden.  
Als Wert erwartet das `render` Attribut einen CSS-Selector bzw. Query-Selector
welche die Ziele festlegt.

```javascript
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
```

```html
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

Das Beispiel enthält 3 Eingabefelder mit unterschiedlichen Ereignissen
(`events`) und Zielen (`render`), die jeweils sich hochzählende Textausgaben
darstellen und auf entsprechende Ereignisse reagieren.


### validate

Das Attribut `validate` erfordert die Kombination mit dem Attribut `events`.
Zusammen definieren und steuert sie die Synchronisation zwischen dem Markup
eines Composites und dem korrespondierenden JavaScript-Model.  
Wird `validate` verwendet, muss das JavaScript-Model eine entsprechende
validate-Methode implementieren: `boolean Model.validate(element, value)`. 
Der Rückgabewert muss ein boolescher Wert sein und so wird nur beim Rückgabewert
`true` der Wert aus dem Composite in das JavaScript-Model synchronisiert.  

Eine allgemeine Strategie oder Standard-Implementierung zur Fehlerausgabe wird
bewusst nicht bereitgestellt, da diese in den meisten Fällen zu starr ist und
kann mit geringem Aufwand als zentrale Lösung individuell implementiert werden.

```css
input[type='text']:not([title]) {
    background:#EEEEFF;
    border-color:#7777AA;
}
input[type='text'][title=''] {
    background:#EEFFEE;
    border-color:#77AA77;
}
input[type='text'][title]:not([title='']) {
    background:#FFEEEE;
    border-color:#AA7777;
}
```

```javascript
var Model = {
    validate: function(element, value) {
        var PATTER_EMAIL_SIMPLE = /^\w+([\w\.\-]*\w)*@\w+([\w\.\-]*\w{2,})$/;
        var test = PATTER_EMAIL_SIMPLE.test(value);
        element.setAttribute("title", test ? "" : "Invalid " + element.getAttribute("placeholder"));
        return test;
    },
    text1: ""
};
```

```html
<form id="Model" composite>
  <input id="text1" type="text" placeholder="e-mail address"
      validate events="mouseup keyup change" render="#Model"/>
  Model.text1: {{Model.text1}}  
  <input type="submit" value="submit" validate events="click"/>
</form>
```

In dem Beispiel erwartet das Eingabefeld eine E-Mail-Adresse.  
Das Format wird fortlaufend bei der Eingabe überprüft und bei einem ungültigen
Werte eine Fehlermeldung in das Attribut `title` geschrieben, bzw. bei einem
gültigen Wert wird der Inhalt vom Attribut `title` gelöscht.  
Unterhalb vom Eingabefeld ist die Kontrollausgabe vom korrespondierenden Feld im
JavaScript-Model. Dieses Feld wird nur synchronisiert, wenn die validate-Methode
den Wert `true` zurückgibt.


## Scripting

Eingebettetes Scripting bringt einige Besonderheit mit sich.  
Das Standard-Scripting wird vom Browser automatisch und unabhängig vom Rendering
ausgeführt. Daher wurde Markup für das Rendering um den zusätzlichen Skript-Type
`composite/javascript` erweitert, der das normale JavaScript verwendet, im
Vergleich zum Typ `text/javascript` vom Browser aber nicht erkannt und somit
nicht direkt ausgeführt wird. Der Renderer hingegen erkennt den JavaScript-Code
und führt diesen in jedem Renderzyklus aus, wenn der Zyklus ein SCRIPT-Element
enthält. Auf diese Weise kann die Ausführung vom SCRIPT-Element auch mit dem
Attribut `condition` kombiniert werden.    
Eingebettete Skripte müssen/sollten "ThreadSafe" sein.

```html
<script type="composite/javascript">
  ...
</script>
```

Da das JavaScript nicht als Element eingefügt, sondern direkt in einem eigenen
Namensraum ausgeführt wird, ist es für globale Variablen wichtig, dass diese als
window-Property initialisiert werden, wenn diese später in der Anwendungslogik 
verwendet werden sollen.

```html
<script type="composite/javascript">
  window['Foo'] = function() {
    ...
  }
</script>
```


## Customizing


### Tag

Benutzerdefinierte Tags übernehmen das komplette Rendering in eigener
Verantwortung. Der Rückgabewert bestimmt, ob die Standardfunktionen des
Renderers verwendet werden oder nicht. Nur der Rückgabewert `false` (nicht
void, nicht leer) beendet das Rendering für ein benutzerdefiniertes Tag, ohne
die Standardfunktionen des Renderers zu verwenden.

```javascript
Composite.customize("foo", function(element) {
    ...
});
```

```html
<article>
  <foo/>  
</article>
```

### Selector

Selektoren funktionieren ähnlich wie benutzerdefinierte Tags.  
Im Vergleich zu diesen, verwenden Selektoren einen CSS-Selektor um Elemente zu
erkennen. Dieser Selektor muss das Element aus Sicht des übergeordneten
Eltern-Elements ansprechen. Selektoren sind flexibler und multifunktionaler. Auf
diese Art können verschiedene Selektoren mit unterschiedliche Funktionen für ein
Element zutreffen.  
Selectoren werden nach der Reihenfolge ihrer Registrierung iterative durchlaufen
und deren Callback-Methoden ausgeführt. Der Rückgabewert der Callback-Methode
bestimmt dabei, ob die Iteration abgebrochen wird oder nicht.  
Nur der Rückgabewert `false` (nicht void, nicht leer) beendet die Iteration
über andere Selektoren und das Rendering für den Selektor wird ohne Verwendung
der Standardfunktionen beendet.

```javascript
Composite.customize("a:not([href])", function(element) {
    ...
});

Composite.customize("a.foo", function(element) {
    ...
});
```

```html
<article>
  <a class="foo"></a>  
</article>
```

### Acceptor

Acceptors sind eine besondere Art der Anpassung vom Rendering. Im Vergleich zu
den anderen Möglichkeiten, geht es hier um die Manipulation von Element vor dem
Rendering. Dies ermöglicht individuelle Änderungen an Attributen und/oder dem
Markup, bevor der Renderer sie verarbeitet. Damit hat ein Acceptor keinen
Einfluss auf die Implementierung vom Rendering.

```javascript
Composite.customize(function(element) {
    ...
});
```
