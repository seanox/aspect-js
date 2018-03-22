# Handbuch


## Einleitung


## Motivation

Die Trennung von Web-Anwendungen in Frontend und Backend sowie die Nutzung von
browserbasierter Rich-Clients und Microservices ist mehr als eine
Trenderscheinung. Neben der strikten Trennung der Komponenten, sind
Skalierbarkeit und Modularisierung gut Argumente f�r diese Art der
Anwendungsarchitektur.

So ist die Vielzahl an Frameworks f�r browserbasierter Rich-Clients gross.
Sie unterscheiden sich stark in Funktion, Komplexit�t und Gr�sse und ben�tigen
teilweise eigene Compiler und Server.

Bei Seanox aspect-js stehen ein minimalistischer Ansatz, der Wunsch nach etwas
JSF-Funktionalit�t auf der Client-Seite und einfache Integration ins Markup und
JavaScript im Vordergrund. Es ist ein sportliches Experiment um das Verst�ndnis
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


#### Schl�sselw�rter

and &&        empty !         div /
eq  ==        ge    >=        gt  >
le  <=        lt    <         mod %
ne  !=        not   !         or  ||


## Composites


## Events


## Markup


### Attribute

Mit Composite und dem enthaltenen Renderer stehen den HTML-Elementen zus�tzliche
Attribute zur Verf�gung, die sich einzeln und in Kombination verwenden lassen.


#### composite


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

Wird ein Script-Block in ein HTML-Dokument eingef�gt, wird dieser vom Browser
automatisch erkannt und ausgef�hrt. Das Composite-JavaScript erkennt der Browser
nicht und es ist m�glich den Aufruf und die Ausf�hrung durch das
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

Composite-JavaScript kann direkt �ber ein render-Attribut angesteuert werden.

```
<script id="ExampleScript" type="composite/javascript">
  ...
</script>

<form id="ExampleForm" composite>
  ...
  <button event="click" render="#ExampleScript"></button>
</form>
```
