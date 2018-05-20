# Handbuch


## Einleitung


## Motivation

Die Trennung von Web-Anwendungen in Frontend und Backend sowie die Nutzung von
browserbasierter Rich-Clients und Microservices ist mehr als eine
Trenderscheinung. Neben der strikten Trennung der Komponenten, sind
Skalierbarkeit und Modularisierung gute Argumente f�r diese Art der
Anwendungsarchitektur.

Die Vielzahl an Frameworks f�r browserbasierter Rich-Clients ist gross.
Sie unterscheiden sich stark in Funktionalit�t, Komplexit�t, Gr�sse und
ben�tigen teilweise eigene Compiler und Server.

Bei Seanox aspect-js stehen ein minimalistischer Ansatz, der Wunsch nach etwas
JSF-Funktionalit�t auf der Client-Seite und die einfache Integration ins Markup
und JavaScript im Vordergrund. Es ist ein sportliches Experiment um das
Verst�ndnis von Rendering, Expression Language und Performance.


## Einbindung


## Expression Language

```
{{'Hello World!'}}
```


### Elemente


#### Text


#### Literale

```
{{'Hello World!'}}
{{"Hello World!"}}
```

#### Logik


#### Value-Expression

```
{{Example.object.field}}
```

Die Value-Expression ist tolerant, wenn der Wert oder das Objekt nicht verf�gbar
ist und der R�ckgabewert entspricht dann `undefined`.


#### Method-Expression

```
{{Example.getData()}}
```

Die Method-Expression ist streng und f�hrt zu einem Fehler, wenn ein Objekt nicht
verf�gbar ist.

#### Element-Expression

Beginnt in einer Expression eine Variable mit `#`, so verweist diese Variable
auf ein HTML-Element mit gleichnamiger ID. Kann kein passendes HTML-Element
gefunden werden, entspricht der Wert der Variablen `undefined`.

```
{{#ExampleElement.value}}

<input type="text" id="ExampleElement"/>
```


#### Combined-Expression

```
{{not empty Foo.data and not empty Foo.data.items ? String(Foo.data.items[0].fieldA).substring(2) : ''}}
```


#### Schl�sselw�rter

```
and &&        empty !         div /
eq  ==        ge    >=        gt  >
le  <=        lt    <         mod %
ne  !=        not   !         or  ||
```


## Composites


## Events


## Markup


### Attribute

Mit Composite und dem enthaltenen Renderer stehen den HTML-Elementen zus�tzliche
Attribute zur Verf�gung, die sich einzeln und in Kombination verwenden lassen.


#### composite

Kennzeichnet ein HTML-Element als Composite und damit als Bestandteil einer
Kombination aus HTML-Element und einem statischen JavaScript-Objekt. Die
Zuordnung erfolgt �ber die Attribute `id` oder alternativ `name` vom HTML-Element
und erwartet ein gleichnamiges JavaScript-Objekt. Ist dieses nicht vorhanden
wird es dynamisch erstellt. Die Deklaration als Composite erfordert immer ein
g�ltiges `id` oder alternativ `name` Attribute.  
Die Attribute `id` oder alternativ `name` m�ssen mit einem Buchstaben (a-z, A-Z)
beginnen, dem die Zeichen a-z, A-Z, 0-9 und _ (Unterstrich) folgen k�nnen.

```
<article id="Example" composite>
  ...
</article> 

<script type="text/javascript">

  var Example = {};
  ...
</script> 
```


#### condition

Bei jedem HTML-Element kann das Attribut `condition` hinzugef�gt werden.  
Das Attribute, was als Wert eine Expression erwartet, setuert die Anzeige von
HTML-Elementen beim Rendering. So werden HTML-Elemente mit dem Attribut
`condition` nur angezeigt, wenn die Expression `true` ist.

```
<article condition="{{ArticleBean.visible}}">
  ...
</article>
```


#### sequence

Beim Rendern wird das DOM rekursive durchlaufen und den Verzweigungen
unkontrolliert gefolgt. Werden JavaScript oder Parameter im Markup eingebettet,
kann dieses zu unerwarteten Effekte f�hren, da die Reihenfolge bei der
Ausf�hrung nicht gesteuert werden kann.  
Die Option `sequence` bewirkt ab dem so gekennzeichneten HTML-Element weiterhin
ein rekursives Durchlaufen mit kontrollierter Verzweigung im DOM von oben nach
unten.

```
<article sequence>
  ...
</article>
```


#### import

Das Attribut `import` verweis auf einen externen Inhalt f�r ein HTML-Element.
Dieser Inhalt wird vom Renderer nachgeladen und kann HTML, CSS, JavaScript oder
andere Daten enthalten, welcher als Inner-HTML eingef�gt wird. Evtl. bestehende
Inhalte werden dabei �berschrieben. Nachgeladenes HTML kann dann ebenfalls
Composite-Attribute und die Expression Language verwenden, die dann im gleichen
Render-Zyklus angewandt werden.

```
<article import="external.html">
  Coming soon...
</article>
```

In Kombination mit dem Attribut `condition` kann das Nachladen zus�tzlich
gesteuert werden, was eine modulare und komponentenbasierte Umsetzung
vereinfacht und das initiale Rendering beschleunigt, da Module und Komponenten
erst geladen werden, wenn diese ben�tigt werden.

```
<article import="external.html" condition="{{ExampleBean.isVisible()}}">
  Coming soon...
</article>
```

TODO: siehe auch Composite-JavaScript


#### event

Die Attribute `events` und `render` geh�ren zusammen.  
So bestimmt das Attribut `events`, durch Leerzeichen getrennt, welche Ereignisse
bei einem HTML-Element den Aufruf des Renderers bewirken, wobei der Umfang vom
Rendering durch den CSS-Selector im Attribut `render` festgelegt wird.
Entsprechend der �blichen Verwendung des CSS-Selector, kann dieser durch Komma
getrennt mehrere Ziele ansprechen.

```
<button events="click dblclick" render="article:nth-child(1), article:nth-child(2)">
  ...
</article>
```


#### render

Die Attribute `events` und `render` geh�ren zusammen.  
So bestimmt das Attribut `events`, durch Leerzeichen getrennt, welche Ereignisse
bei einem HTML-Element den Aufruf des Renderers bewirken, wobei der Umfang vom
Rendering durch den CSS-Selector im Attribut `render` festgelegt wird.
Entsprechend der �blichen Verwendung des CSS-Selector, kann dieser durch Komma
getrennt mehrere Ziele ansprechen.

```
<button events="click dblclick" render="article:nth-child(1), article:nth-child(2)">
  ...
</article>
```


### Tags


#### param

Das PARAM-Tag ist ein Standard HTML-Tag welches in aspect-js etwas entfremdet
wurde.  
Mit dem PARAM-Tag lassen sich zur Laufzeit und beim Rendern im Markup Parameter
definieren und deren Werte �ndern. Dazu werden die Attribute `name` und `value`
verwendet. Der Name muss den f�r JavaScript �blichen Konventionen entsprechen
und kann mit einem Unterstrich oder einem Buchstaben beginnen. Parameter mit
ung�ltigem Namen werden ignoriert und erzeugen keine Fehlermeldung. Das 
Attribute `value` enth�lt den Wert vom Parameter als Text oder Expression
Language.

```
<param name="paramFoo" value="Hallo"/>
```

```
<param name="paramFoo3" value="{{paramFoo1 + ' ' + paramFoo2}}"/>
```

Auf diese Art erzeugte Parameter sind als JavaScript-Variable global verf�gbar.
Daher Vorsicht, da so auch existierende Variablen, Funktionen oder Objekte
�berschrieben werden k�nnen.


### Custom-Tags

Die Erweiterung durch neue Tags und auch die Anpassung der Implementierung
existierender Tags wird durch die Methode `Composite.customize(tag, function(element))`
unterst�tzt. Das Customizing ist ein fester Bestandteil vom Rendering, welches
zus�tzliche und ge�nderte Tags wie die Standard-Tags verwendet.

```
<example attr-a="a" attr-a="b"> ... </example>
```

```
Composite.customize("x-projects", function(element) {
    element.innerHTML = "my tag, my output...";
});
```


### Composite-JavaScript

Beim JavaScript gibt es keine Unterschiede.  
Der Unterschied liegt hier allein im Script-Tag.

```
<script type="composite/javascript">
  ...
</script> 
```

Wird ein Script-Block in ein HTML-Dokument eingef�gt, wird dieser vom Browser
automatisch erkannt und ausgef�hrt. Das Composite-JavaScript erkennt der Browser
nicht und es ist m�glich den Aufruf und die Ausf�hrung durch das
Composite-Rendering z.B. durch die Attribute `import` und `condition` zu steuern.

```
<script type="composite/javascript" condition="{{Script.canExecute()}}">
  ...
</script> 

<script type="composite/javascript" import="./script.js">
  ...
</script> 

<script type="composite/javascript" import="./script.js" condition="{{Script.canExecute()}}>
  ...
</script> 
```

Composite-JavaScript kann direkt �ber ein `render`-Attribut angesteuert werden.

```
<form id="ExampleForm" composite>
  <script type="composite/javascript">
    ...
  </script>
  <button event="click" render="#ExampleForm script, #ExampleScript"></button>
</form>

<script id="ExampleScript" type="composite/javascript">
  ...
</script>
```
