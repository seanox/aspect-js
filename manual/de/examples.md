# Beispiele

## Inhalt

* [events](#events)
* [interval](#interval)
* [iterate](#iterate)
* [parameter](#parameter)


## events

Eingabe mit synchroner Ausgabe per Expression-Language mit Element-Bindung.

```html
<input type="text" id="input" events="keyup mouseup change" render="#output"><br>
<span id="output">
  {{#input.value}}
</span>
```

  
## interval

Einfache sich aktualisierende Zeitausgabe.

```html
<span interval="500">
  {{new Date()}} 
</span>
```


Zähler, der sich nach 25 Iterationen selbst beendet und aus dem DOM
entfernt.

```html
{{counter:0}}
<span interval="500" condition="{{counter lt 25}}">
  {{counter:parseInt(counter) +1}} 
  {{counter}}
</span>
```


## iterate

Generierung einer Matrix.

```javascript
var matrixModel = {
    rows: [0, 1, 2, 3, 4, 5],
    cols: ["", "A", "B", "C", "D", "E"]
};
```

```html
<table>
  <thead>
    <tr iterate={{col:matrixModel.cols}}>
      <th condition="{{not (col.index gt 0)}}">\</th> 
      <th condition="{{col.index gt 0}}">{{col.item}}</th>
    </tr>
  </thead>
  <tbody iterate={{row:matrixModel.rows}}>
    <tr iterate={{col:matrixModel.cols}}>
      <th condition="{{not (col.index gt 0)}}">{{row.index +1}}</th>
      <td condition="{{col.index gt 0}}">{{col.item + (row.index +1)}}</td>
    </tr>  
  </tbody>
</table>
```


## parameter

UI-Parameter können direkt per Expression-Language erstellt und geändert werden.
Da die UI-Parameter im globalen Namensraum (window) existieren, können diese
direkt im JavaScript verwendet werden.

```html
{{example:0}}
{{example:parseInt(example) +1}}
{{example}}
{{example:parseInt(example) +1}}
<script type="composite/javascript">
  example++;
</script>
{{example}}
```
