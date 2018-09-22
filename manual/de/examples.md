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
{{testA:0}}
{{testA:parseInt(testA) +1}}
{{testA}}
{{testA:parseInt(testA) +1}}
<script type="composite/javascript">
  testA++;
</script>
{{testA}}
```


## validate

Die Synchronisation von Werten zwischen den HTML-Elementen und den Feldern der
Java-Script-Modelle lässt sich per Validierung kontrollieren und steuern.  
In dem Beispiel erwartet das Eingabefeld eine E-Mail-Adresse.  
Das Format wird fortlaufend bei der Eingabe überprüft und bei einem ungültigen
Werte eine Fehlermeldung in das Attribut `title` geschrieben, bzw. bei einem
gültigen Wert wird der Inhalt vom Attribut `title` gelöscht.  
Unterhalb vom Eingabefeld ist die Kontrollausgabe vom korrespondierenden Feld im
JavaScript-Model. Dieses Feld wird nur synchronisiert, wenn die validate-Methode
den Wert `true` zurückgibt.

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