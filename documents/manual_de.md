# Handbuch


## Einleitung


## Motivation

Die Trennung von Web-Anwendungen in Frontend und Backend sowie die Nutzung von
browserbasierter Rich-Clients und Microservices ist mehr als eine
Trenderscheinung. Neben der strikten Trennung der Komponenten, sind
Skalierbarkeit und Modularisierung gut Argumente für diese Art der
Anwendungsarchitektur.

So ist die Vielzahl an Frameworks für browserbasierter Rich-Clients gross.
Sie unterscheiden sich stark in Funktion, Komplexität und Grösse und benötigen
teilweise eigene Compiler und Server.

Bei Seanox aspect-js stehen ein minimalistischer Ansatz, der Wunsch nach etwas
JSF-Funktionalität auf der Client-Seite und einfache Integration ins Markup und
JavaScript im Vordergrund. Es ist ein sportliches Experiment um das Verständnis
von Rendering, Expression Language und Performance.


## Einbindung


## Expression Language

```
{{'Hello World!'}}
```

### Elemente


#### Text


#### Literale


#### Logik


#### Value-Expression


#### Method-Expression


#### Schlüsselwörter

and &&        empty !         div /
eq  ==        ge    >=        gt  >
le  <=        lt    <         mod %
ne  !=        not   !         or  ||


## Composites


## Events


## Markup


### Attribute

Mit Composite und dem enthaltenen Renderer stehen den HTML-Elementen zusätzliche
Attribute zur Verfügung, die sich einzeln und in Kombination verwenden lassen.


#### composite


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


#### source


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
Composite-Rendering z.B. durch die Attribute `source` und `condition` zu steuern.

```
<script type="composite/javascript" condition="{{ScriptBean.canExecute()}}">
  ...
</script> 

<script type="composite/javascript" source="./script.js">
  ...
</script> 

<script type="composite/javascript" source="./script.js" condition="{{ScriptBean.canExecute()}}>
  ...
</script> 
```

Composite-JavaScript kann direkt über ein render-Attribut angesteuert werden.

```
<script id="ExampleScript" type="composite/javascript">
  ...
</script>

<form id="ExampleForm" composite>
  ...
  <button event="click" render="#ExampleScript"></button>
</form>
```
