# Handbuch



## Einleitung



## Motivation



## Einbindung



## Expression Language

```
{{'Hello World!'}}
```



## Composites



## Markup


### Attribute


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
