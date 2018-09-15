# Object Bindung

## Inhalt

## Grundlagen

Bei der Objekt-Bindung geht es um die Verknüpfung und Zuordnung von
HTML-Elementen, die das Attribut `composite` enthalten, und eine
korrespondierenden Model-Objekt im JavaScript.


## Begriffe


### namespace


### scope


### model


### field


### identifier


## Bindung

Die Zuordnung und Verknüpfung erfolgt über einen Namensraum (Namespace), auch
Scope bezeichnet -- Die Unterschiede zwischen Namensraum und Scope werden im
Abschnitt [Begriffe](#begriffe) erläutert. Der Namensraum wird über die IDs der
HTML-Elemente im DOM relativ oder absolute abgebildet und verwendet den Punkt
als Trennzeichen.  
Ein relativer Namensraum verwendet keinen Punkt in der ID und wird durch die IDs
der Eltern-Elemente bis zum Wurzel-Element oder bis zum Auftreten der ersten ID
mit absolutem Namensraum, erweitert.  
Ein absoluter Namensraum ist über die ID voll qualifiziert und verwendet den
Punkt zur Trennung der einzelnen  Namensraum-Elemente.

Beispiel für einen relativen Namensraum `a.b.c`:

```
<html>
  <body>
    <div id="a">
      <div id="b">
        <div id="c"></div>
      </div>
    </div>
  </body>
</html>

var a = {
  b: {
    c: {}
  }
};
```

Beispiel für einen Mix von relativen und absoluten Namensraum `a.b` und `b.c.d`:

```
<html>
  <body>
    <div id="a">
      <div id="b">
        <div id="b.c">
          <div id="d"></div>
        </div>
      </div>
    </div>
  </body>
</html>

var a = {
  b: {
  }
};

var b = {
  c: {
    d: {}
  }
};
```


## Validierung
