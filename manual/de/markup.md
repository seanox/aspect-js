[Einf�hrung](introduction.md) | [Inhalt](README.md#markup) | [Expression Language](expression.md)
- - -

# Markup

Mit Seanox aspect-js wird der deklarative Ansatz von HTML aufgegriffen und
erweitert. Neben der Expression-Language werden den HTML-Elementen zus�tzliche
Attribute f�r Funktionen und Objekt-Bindung bereitgestellt.  
Der entsprechende Renderer ist in der Composite-Implementierung enthalten und
�berwacht das DOM aktiv �ber den MutationObserver und funktioniert und reagiert
somit rekursiv auf Ver�nderungen im DOM.


## Inhalt

* [Attribute](#attribute)
  * [composite](#composite)
  * [condition](#condition)
  * [events](#events)
  * [import](#import)
  * [interval](#interval)
  * [message](#message)
  * [notification](#notification)
  * [output](#output)
  * [release](#release)
  * [render](#render)    
  * [validate](#validate)  
* [Expression Language](#expression-language)
* [Scripting](#scripting)
* [Customizing](#customizing)
  * [Tag](#tag)   
  * [Selector](#selector)
  * [Acceptor](#acceptor)
* [H�rtung](markup.md#h-rtung)  
  

## Attribute

Der deklarative Ansatz ist in Seanox aspect-js vorrangig mit Attributen
umgesetzt und kann mit allen HTML-Elementen und in Kombination verwendet werden.
Ausgenommen sind `SCRIPT`, was nur mit dem Typ `composite/javascript`
unterst�tzt wird, sowie `STYLE`, welches nicht unterst�tzt wird. Die Werte der
Attribute k�nnen statisch oder mit Verwendung der Expression-Language dynamisch
sein. Enth�lt ein Attribut eine Expression, werden das Attribut und der Wert
unver�nderlich, da der Renderer diese bei jeder Auffrischung (Render-Zyklus)
erneut mit dem aktualisierten Wert der initialen Expression setzen wird.


### composite

Kennzeichnet im Markup ein Element als [Composite](composites.md).  
Composites sind modulare Komponente die in Seanox aspect-js eine elementare
Bedeutung haben und die zwingend einen Bezeichner (ID) ben�tigen.  
Sie werden von der [SiteMap](mvc.md#sitemap) als Faces, also als Ziele f�r
virtuelle Pfade im Face-Flow verwendet, was direkten Einfluss auf die
Sichtbarkeit der Composites hat.
Der [Model View Controler](mvc.md#sitemap) unterst�tzt f�r Composites eine
automatisches [Object-/Model-Binding](object-binding.md).  
Die Ressourcen (CSS, JS, Markup) lassen sich f�r Composite in das
Modul-Verzeichnis auslagern und werden erst bei Bedarf automatisch nachgeladen. 

```html
<article id="example" composite>
  ...
</article>
```

Das Attribut hat keinen Wert.  
Es kann mit dem Attribut `static` kombiniert werden.
Dann wird das Composite als Face unabh�ngig von virtuellen Pfaden permanent
sichtbar.

```html
<article id="example" composite static>
  ...
</article>
```

Details zur Verwendung von Composites / modularen Komponente werden in den
Abschnitten [Composites](composites.md) und [Model View Controler](mvc.md)
beschrieben.


### condition

Das condition-Attribut legt fest, ob ein Element im DOM enthalten bleibt.  
Der mit dem Attribut angegebene Ausdruck muss explizit `true` zur�ckliefern,
damit das Element im DOM erhalten bleibt. Bei abweichenden R�ckgabewerten wird
das Element tempor�r aus dem DOM entfernt und l�sst sich sp�ter durch das
Auffrischen des __Eltern-Elements__ wieder einf�gen, wenn der Ausdruck `true`
zur�ckliefert.  
Eine Besonderheit stellt die Kombination mit dem Attribut [interval](#interval)
dar, da mit dem Entfernen des Elements aus dem DOM auch der zugeh�rige Timer
beendet wird. Wird das Element mit einer sp�teren Auffrischung wieder in das DOM
aufgenommen, startet der Timer von vorn, wird also nicht fortgesetzt.

```html
<article condition="{{Model.visible}}">
  ...
</article>
```

Die Verwendung vom condition-Attribut in Verbindung mit eingebettetem JavaScript
ist als Composite-JavaScript m�glich.

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
er�ffnen prim�re Funktionen zur ereignisgesteuerten Auffrischung von anderen
HTML-Elementen (mehr dazu im Abschnitt [render](#render)), sowie zur Validierung
und Synchronisation von HTML-Elementen und dem korrespondierenden
JavaScript-Model (mehr dazu im Abschnitt [validate](#validate)).  

```html
<span id="output1">{{#text1.value}}</span>
<input id="text1" type="text"
    events="input change" render="#output1"/>
```

Beispiel zur synchronen Auffrischung vom HTML-Element _output1_ mit den
Ereignissen _Input_ oder _Change_ beim HTML-Element _text1_. In dem Beispiel
wird der Eingabewert von _text1_ synchron mit _output1_ ausgegebem.

```javascript
var Model = {
    validate(element, value) {
        return true;
    },
    text1: ""
};
```

```html
<form id="Model" composite>
  <input id="text1" type="text"
      validate events="input change"/>
  <input type="submit" value="submit"
      validate events="click"/>
</form>
```

Beispiel zur grundlegenden Verwendung, Implementierung und Funktion sowie dem
Zusammenspiel der Attribute `events` und `validate`. In dem Beispiel wird der
Eingabewert vom Composite-Feld text1 nur dann in das gleichnamige Feld im
JavaScript-Model �bernommen, wenn mindestens eines der Ereignisse: _Input_ oder
_Change_ eintritt und die Validierung den Wert `true` zur�ckgibt.


### import

Diese Deklaration l�dt Inhalte dynamisch nach und ersetzt den inneren HTML-Code
eines Elements. Wenn der Inhalt erfolgreich geladen wurde, wird das Attribut
`import` entfernt. Das Attribut erwartet als Wert ein Element oder mehre
Elemente als NodeList bzw. Array, welche dann direkt eingef�gt werden. Auch die
Verwendung einer absoluten oder relativen URL zu einer entfernten Ressource wird
unterst�tzt, die per HTTP-Methode GET nachgeladen und eingef�gt wird. Zudem wird
auch die [DataSource-URL (locator)](datasource.md#locator) unterst�tzt, womit
ein Inhalt aus der [DataSource](datasource.md) geladen und transformiert einf�gt
wird.

In allen F�llen l�sst sich das import-Attribut mit dem condition-Attribut
kombinieren und wird dann erst ausgef�hrt, wenn die Bedingung `true` ist.

Das Verhalten ist vergleichbar mit dem Attribut `output`, im Unterschied wird
der Import f�r das Element nur einmalig ausgef�hrt.

```javascript
var Model = {
    publishForm() {
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
    publishImg() {
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

Beispiel f�r den Import einer entfernten Ressource per HTTP-Methode GET.

```html
<article import="{{'https://raw.githubusercontent.com/seanox/aspect-js/master/test/resources/import_c.htmlx'}}">
  loading resource...  
</article>

<article import="https://raw.githubusercontent.com/seanox/aspect-js/master/test/resources/import_c.htmlx">
  loading resource...  
</article>
```

Beispiel f�r den Import per DataSource-URL.  
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

Beispiel f�r den Import per DataSource-URL mit spezifischer Daten- und
Transformation-URL.  
Als Wert wird erst dir Daten-URL (locator der XML-Datei) und getrennt durch ein
Leerzeichen die die Transformation-URL (locator vom XSLT Template) erwartet. 

```html
<article import="{{'xml:/example/data xslt:/example/style'}}">
  loading resource...  
</article>

<article import="xml:/example/data xslt:/example/style">
  loading resource...  
</article>
```

Beim Einf�gen von Inhalten aus der DataSource, werden Script-Bl�cke automatisch
in composite/javascript ge�ndert und erst durch den Renderer ausgef�hrt. So wird
gew�hrleistet, dass das JavaScript ggf. erst abh�ngig vom umschliessenden
condition-Attribut aufgef�hrt wird.


### interval

Diese Deklaration aktiviert eine intervallgesteuerte Auffrischung eines
HTML-Elements, ohne dass die Auffrischung aktiv angestossen werden muss.  
Als Wert wird ein Intervall in Millisekunden erwartet, der auch als Expression
formuliert werden kann. Die Verarbeitung erfolgt nebenl�ufig bzw. asynchron aber
nicht parallel. Bedeutet, dass die Verarbeitung nach dem gesetzten
Zeit-Intervall starten soll, diese aber erst beginnt, wenn eine zuvor begonnen
JavaScript-Prozedur beendet wurde. Daher ist das Intervall als zeitnah, nicht
aber als exakt zu verstehen.
Das interval-Attribut erwartet einen Wert in Millisekunden. Ein ung�ltiger Wert
verursacht eine Konsolenausgabe. Das Intervall beginnt automatisch mit dem
Auffrischen vom deklarierten HTML-Element und wird beendet bzw. entfernt wenn:
- das Element nicht mehr im DOM existiert
- das condition-Attribut verwendet wird, dass nicht `true` ist

Wird ein HTML-Element als Intervall deklariert, wird der urspr�ngliche innerer
HTML-Code als Vorlage verwendet und w�hrend der Intervalle zuerst der innere
HTML-Code geleert, die Vorlage mit jedem Intervall-Zyklus einzeln generiert und
das Ergebnis als innerer HTML-Code eingef�gt.

```html
<span interval="1000">
  ...
</span>

<span interval="{{1000 +500}}">
  ...
</span>
```

Das SPAN-Element wird alle 1000ms aktualisiert.

Das interval-Attribut kann f�r einfache HTML-Elemente, wie auch komplexe und
verschachtelte HTML-Konstrukte verwendet werden.

Ein aktiver Intervall reagiert dynamisch auf Ver�nderungen im DOM, endet
automatisch, wenn das HTML-Element aus dem DOM entfernt wurde und beginnt neu,
wenn das HTML-Element dem DOM erneut hinzugef�gt wird. Daher l�sst sich das
interval-Attribut gut mit dem condition-Attribut verwenden und steuern.

```html
<span interval="1000" condition="{{IntevalModel.isVisible()}}">
  ...
</span>
```

Mit der Kombination von Intervall und Variablen-Expression ist die Umsetzung
eines permanenten Z�hlers sehr einfach.

```html
{{counter:0}}
<span interval="1000">
  {{counter:parseInt(counter) +1}}^
  {{counter}}
</span>
```

Die Verwendung vom interval-Attribut in Verbindung mit eingebettetem JavaScript
ist als Composite-JavaScript m�glich.

```html
<script type="composite/javascript" interval="1000">
  ...
</script>
```

### iterate

Die iterative Ausgabe basiert auf Listen, Aufz�hlungen und Arrays.  
Wird ein HTML-Element als iterativ deklariert, wird der initiale innerer
HTML-Code als Vorlage verwendet und w�hrend der Iteration der innere HTML-Code
zun�chst entfernt, die Vorlage mit jeder Iteration einzeln generiert und das
Ergebnis dem inneren HTML-Code hinzugef�gt.  
Das iterate-Attribut erwartet einen
[Variablen-Ausdruck](expression.md#variable-expression), zu dem ein Meta-Objekt
erstellt wird, dass den Zugriff auf die Iteration erm�glich.  
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
HTML-Code bei einem HTML-Element. Als Wert werden Text, ein Element oder mehre
Elemente als NodeList bzw. Array, welche dann direkt eingef�gt werden. Zudem
wird auch die [DataSource-URL (locator)](datasource.md#locator) unterst�tzt,
womit ein Inhalt aus der [DataSource](datasource.md) geladen und transformiert
einf�gt wird.

In allen F�llen l�sst sich das output-Attribut mit dem condition-Attribut
kombinieren und wird dann erst ausgef�hrt, wenn die Bedingung `true` ist.

Das Verhalten ist vergleichbar mit dem Attribut `import`, im Unterschied wird
der Output f�r das Element immer ausgef�hrt.

```javascript
var Model = {
    publishForm() {
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
    publishImg() {
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

Beispiel f�r den Output per DataSource-URL.  
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

Beispiel f�r den Output per DataSource-URL mit spezifischer Daten- und
Transformation-URL. Die Trennung erfolgt durch Leerzeichen, beide m�ssen mit dem
DataSource-Protokoll beginnen und es werden nur die ersten beiden Eintr�ge
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

Beim Einf�gen von Inhalten aus der DataSource, werden Script-Bl�cke automatisch
in composite/javascript ge�ndert und werden erst durch den Renderer ausgef�hrt.
So wird gew�hrleistet, dass das JavaScript ggf. erst abh�ngig von
umschliessenden condition-Attribut aufgef�hrt wird.


### release

Inverser Indikator daf�r, dass ein Element gerendert wurde.  
Der Renderer entfernt dieses Attribut, wenn ein Element gerendert wird. Dieser
Effekt kann f�r CSS verwendet werden, um Elemente nur im gerenderten Zustand
anzuzeigen. Eine entsprechende CSS-Regel wird dem HEAD automatisch mit dem
Laden der Seite hinzugef�gt. 

```html
<span release>{{'Show me after rendering.'}}</span>
```


### render

Das Attribut `render` erfordert die Kombination mit dem Attribut `events`.
Zusammen definieren sie, welche Ziele mit welchen auftretenden Events
aufgefrischt werden.  
Als Wert erwartet das `render` Attribut einen CSS-Selector bzw. Query-Selector
welche die Ziele festlegt.

```javascript
var Model = {
    _status1: 0,
    getStatus1() {
        return ++Model._status1;
    },
    _status2: 0,
    getStatus2() {
        return ++Model._status2;
    },
    _status3: 0,
    getStatus3() {
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

Das Beispiel enth�lt 3 Eingabefelder mit unterschiedlichen Ereignissen
(`events`) und Zielen (`render`), die jeweils sich hochz�hlende Textausgaben
darstellen und auf entsprechende Ereignisse reagieren.


### validate

TODO: validate funktioniert zwei stuffig (1. HTML5, 2. Model)
TODO: validate im Model funktioniert nur, wenn das Element mit dem Attribut validate im Composite liegt (DOM)
      sonst wird nur HTML5-Validierung verwendet
TODO: validate hat direkte Auswirkung auf Action und Synchronisation
      R�ckgabewert blockiert die Ausf�hrung, auch die Standard-Action vom Browser wird bei false geblockt
      z.B. bei Submit-Button        

TODO: action: nicht hier, Platz in der Doku f�r action suchen
TODO: action: r�ckgabewert hat Einfluss auf Browser-Event-Verhalten, R�ckgabewert false blockt die Standard-Action vom Browser
      z.B. bei Submit-Button
      
Das Attribut `validate` erfordert die Kombination mit dem Attribut `events`.
Zusammen definieren und steuert sie die Synchronisation zwischen dem Markup
eines Composites und dem korrespondierenden JavaScript-Model.  
Wird `validate` verwendet, muss das JavaScript-Model eine entsprechende
validate-Methode implementieren: `boolean Model.validate(element, value)`. 
Der R�ckgabewert muss ein boolescher Wert sein und so wird nur beim R�ckgabewert
`true` der Wert aus dem Composite in das JavaScript-Model synchronisiert.  

Eine allgemeine Strategie oder Standard-Implementierung zur Fehlerausgabe wird
bewusst nicht bereitgestellt, da diese in den meisten F�llen zu starr ist und
kann mit geringem Aufwand als zentrale L�sung individuell implementiert werden.

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
    validate(element, value) {
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
      validate events="input change" render="#Model"/>
  Model.text1: {{Model.text1}}  
  <input type="submit" value="submit" validate events="click"/>
</form>
```

In dem Beispiel erwartet das Eingabefeld eine E-Mail-Adresse.  
Das Format wird fortlaufend bei der Eingabe �berpr�ft und bei einem ung�ltigen
Werte eine Fehlermeldung in das Attribut `title` geschrieben, bzw. bei einem
g�ltigen Wert wird der Inhalt vom Attribut `title` gel�scht.  
Unterhalb vom Eingabefeld ist die Kontrollausgabe vom korrespondierenden Feld im
JavaScript-Model. Dieses Feld wird nur synchronisiert, wenn die validate-Methode
den Wert `true` zur�ckgibt.


## Expression Language

Die Expression-Language kann im Markup als Freitext und in den Attributen der
HTML-Elemente verwendet werden. Ausgenommen sind JavaScript- und CSS-Elemente.
Hier wird die Expression-Language nicht unterst�tzt.  
Bei der Verwendung als Freitext wird als Ausgabe immer reiner Text (plain text)
erzeugt. Das Hinzuf�gen von Markup, insbesondere HTML-Code, ist so nicht m�glich
und wir nur mit den Attributen `output` und `import` unterst�tzt.

```html
<article title="{{Model.title}}">
  {{'Hello World!'}}
  ...
</article>
```

Details zu Syntax und Verwendung werden im Abschnitt
[Expression Language](expression.md) beschrieben.


## Scripting

Eingebettetes Scripting bringt einige Besonderheit mit sich.  
Das Standard-Scripting wird vom Browser automatisch und unabh�ngig vom Rendering
ausgef�hrt. Daher wurde Markup f�r das Rendering um den zus�tzlichen Skript-Type
`composite/javascript` erweitert, der das normale JavaScript verwendet, im
Vergleich zum Typ `text/javascript` vom Browser aber nicht erkannt und somit
nicht direkt ausgef�hrt wird. Der Renderer hingegen erkennt den JavaScript-Code
und f�hrt diesen in jedem Renderzyklus aus, wenn der Zyklus ein SCRIPT-Element
enth�lt. Auf diese Weise kann die Ausf�hrung vom SCRIPT-Element auch mit dem
Attribut `condition` kombiniert werden.    
Eingebettete Skripte m�ssen/sollten "ThreadSafe" sein.

```html
<script type="composite/javascript">
  ...
</script>
```

Da das JavaScript nicht als Element eingef�gt, sondern direkt in einem eigenen
Namensraum ausgef�hrt wird, ist es f�r globale Variablen wichtig, dass diese als
window-Property initialisiert werden, wenn diese sp�ter in der Anwendungslogik 
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

Benutzerdefinierte Tags �bernehmen das komplette Rendering in eigener
Verantwortung. Der R�ckgabewert bestimmt, ob die Standardfunktionen des
Renderers verwendet werden oder nicht. Nur der R�ckgabewert `false` (nicht
void, nicht leer) beendet das Rendering f�r ein benutzerdefiniertes Tag, ohne
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

Selektoren funktionieren �hnlich wie benutzerdefinierte Tags.  
Im Vergleich zu diesen, verwenden Selektoren einen CSS-Selektor um Elemente zu
erkennen. Dieser Selektor muss das Element aus Sicht des �bergeordneten
Eltern-Elements ansprechen. Selektoren sind flexibler und multifunktionaler. Auf
diese Art k�nnen verschiedene Selektoren mit unterschiedliche Funktionen f�r ein
Element zutreffen.  
Selectoren werden nach der Reihenfolge ihrer Registrierung iterative durchlaufen
und deren Callback-Methoden ausgef�hrt. Der R�ckgabewert der Callback-Methode
bestimmt dabei, ob die Iteration abgebrochen wird oder nicht.  
Nur der R�ckgabewert `false` (nicht void, nicht leer) beendet die Iteration
�ber andere Selektoren und das Rendering f�r den Selektor wird ohne Verwendung
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
den anderen M�glichkeiten, geht es hier um die Manipulation von Element vor dem
Rendering. Dies erm�glicht individuelle �nderungen an Attributen und/oder dem
Markup, bevor der Renderer sie verarbeitet. Damit hat ein Acceptor keinen
Einfluss auf die Implementierung vom Rendering.

```javascript
Composite.customize(function(element) {
    ...
});
```

## H�rtung

In Seanox aspect-js ist eine H�rtung vom Markup vorgesehen, was die Manipulation
vom Markup zur Laufzeit erschwert. Zum einen wird mit einer Condition
ausgeblendetes Markup physisch aus dem DOM entfernt und zum anderen �berwacht
der Renderer Manipulationen an Attributen zur Laufzeit. Diese �berwachung
basiert auf einem Filter mit statischen Attributen. Statische Attribute werden
mit dem Anlegen eines Elements im DOM gelesen und bei Manipulation (L�schen /
�ndern) wieder hergestellt.

Zur Konfiguration statischer Attribute wird die Methode
`Composite.customize(...)` mit dem Parameter `@ATTRIBUTES-STATICS`
verwendet.  
Die Konfiguration kann mehrfach erfolgen. Die einzelnen statischen Attribute
werden dann zusammengefasst.  
Alle @-Parameter sind unabh�ngig von der Gross- und Kleinschreibung.

```javascript
Composite.customize("@ATTRIBUTES-STATICS", "action name src type");
Composite.customize("@Attributes-Statics", "required");
Composite.customize("@attributes-statics", "method action");
...
```

```html
<form method="POST" action="/service">
  <input type="user" name="user"
  <input type="password" name="password"/>
  <input type="submit"/>
</form>
```


- - -

[Einf�hrung](introduction.md) | [Inhalt](README.md#markup) | [Expression Language](expression.md)
