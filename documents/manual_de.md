# Handbuch


## Einleitung


## Motivation

Die Trennung von Web-Anwendungen in Frontend und Backend sowie die Nutzung von
browserbasierter Rich-Clients und Microservices ist mehr als eine
Trenderscheinung. Neben der strikten Trennung der Komponenten, sind
Skalierbarkeit und Modularisierung gute Argumente für diese Art der
Anwendungsarchitektur.

Die Vielzahl an Frameworks für browserbasierter Rich-Clients ist gross.
Sie unterscheiden sich stark in Funktionalität, Komplexität, Grösse und
benötigen teilweise eigene Compiler und Server.

Bei Seanox aspect-js stehen ein minimalistischer Ansatz, der Wunsch nach etwas
JSF-Funktionalität auf der Client-Seite und die einfache Integration ins Markup
und JavaScript im Vordergrund. Es ist ein sportliches Experiment um das
Verständnis von Rendering, Expression Language und Performance.


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


#### Method-Expression

```
{{Example.getData()}}
```


#### Combined-Expression

```
{{not empty Foo.data and not empty Foo.data.items ? String(Foo.data.items[0].fieldA).substring(2) : ''}}
```


#### Schlüsselwörter

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

Mit Composite und dem enthaltenen Renderer stehen den HTML-Elementen zusätzliche
Attribute zur Verfügung, die sich einzeln und in Kombination verwenden lassen.


#### composite

Kennzeichnet ein HTML-Element als Composite und damit als Bestandteil einer
Kombination aus HTML-Element und einem statischen JavaScript-Objekt. Die
Zuordnung erfolgt über die Attribute `id` oder alternativ `name` vom HTML-Element
und erwartet ein gleichnamiges JavaScript-Objekt. Ist dieses nicht vorhanden
wird es dynamisch erstellt. Die Deklaration als Composite erfordert immer ein
gültiges `id` oder alternativ `name` Attribute.  
Die Attribute `id` oder alternativ `name` müssen mit einem Buchstaben (a-z, A-Z)
beginnen, dem die Zeichen a-z, A-Z, 0-9 und _ (Unterstrich) folgen können.

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

Bei jedem HTML-Element kann das Attribut `condition` hinzugefügt werden.  
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
kann dieses zu unerwarteten Effekte führen, da die Reihenfolge bei der
Ausführung nicht gesteuert werden kann.  
Die Option `sequence` bewirkt weiterhin ein rekursives Durchlaufen mit
kontrollierter Verzweigung von oben nach unten.

```
<article sequence>
  ...
</article>
```


#### import


#### render


#### event


### Composite-JavaScript

Beim JavaScript gibt es keine Unterschiede.  
Der Unterschied liegt hier allein im Script-Tag.

```
<script type="composite/javascript">
  ...
</script> 
```

Wird ein Script-Block in ein HTML-Dokument eingefügt, wird dieser vom Browser
automatisch erkannt und ausgeführt. Das Composite-JavaScript erkennt der Browser
nicht und es ist möglich den Aufruf und die Ausführung durch das
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

Composite-JavaScript kann direkt über ein `render`-Attribut angesteuert werden.

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
