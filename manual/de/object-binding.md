# Object Bindung

## Inhalt

## Grundlagen

Bei der Objekt-Bindung geht es um die Verkn�pfung und Zuordnung von
HTML-Elementen, die das Attribut `composite` enthalten, und eine
korrespondierenden Model-Objekt im JavaScript.


## Begriffe


### namespace


### scope


### model


### field


### identifier


## Bindung

Die Zuordnung und Verkn�pfung erfolgt �ber einen Namensraum (Namespace), auch
Scope bezeichnet -- Die Unterschiede zwischen Namensraum und Scope werden im
Abschnitt [Begriffe](#begriffe) erl�utert. Der Namensraum wird �ber die IDs der
HTML-Elemente im DOM relativ oder absolute abgebildet und verwendet den Punkt
als Trennzeichen.  
Ein relativer Namensraum verwendet keinen Punkt in der ID und wird durch die IDs
der Eltern-Elemente bis zum Wurzel-Element oder bis zum Auftreten der ersten ID
mit absolutem Namensraum, erweitert.  
Ein absoluter Namensraum ist �ber die ID voll qualifiziert und verwendet den
Punkt zur Trennung der einzelnen  Namensraum-Elemente.

Beispiel f�r einen relativen Namensraum `a.b.c`:

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

Beispiel f�r einen Mix von relativen und absoluten Namensraum `a.b` und `b.c.d`:

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
