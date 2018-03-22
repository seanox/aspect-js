# Handbuch


## Einleitung


## Motivation


## Einbindung


## Expression Language

```
{{'Hello World!'}}
```

## Schl�sselw�rter

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

So ein Script-Block kann direkt �ber ein render-Attribut adressiert werden.

```
<script id="ExampleScript" type="composite/javascript">
  ...
</script>

<form id="ExampleForm" composite>
  ...
  <input type="button" event="click" render="ExampleScript"></input>
</form>
```
