# Object Bindung

## Inhalt

## Grundlagen

Bei der Objekt-Bindung geht es um die Verknüpfung und Zuordnung von
HTML-Elementen, die das Attribut `composite` enthalten, und eine
korrespondierenden Model-Objekt im JavaScript.


## Begriffe

### namespace

Der Namensraum ist ein Zeichen- bzw. Wortfolge, bestehend aus Buchstaben, Zahlen
sowie Unterstrich, welche die Verzweigung (Pfad) in einem Objekt-Baum
beschreibt. Als Trennzeichen wird der Punkt verwendet, er legt den Übergang von
einer zu nächsten Ebene im Objekt-Baum fest.  
Jedes Element im Namensraum muss mindestens ein Zeichen enthalte, mit einem
Buchstaben beginnen und mit einem Buchstaben oder einer Zahl enden.

### scope

Der `scope` basiert auf `namespace` und repräsentiert diesen auf der Objekt-Ebene.

### model

Das Model (Model-Komponente) ist ein statisches JavaScript-Objekt in einem
beliebigen namespace und stellt die Logik für die Benutzerschnittstelle
(UI-Komponente) und den Übergang von Benutzerschnittstelle zur Business-Logik
und/oder dem Backend.  
Die Verknüpfung bzw. Bindung von Markup und JavaSchript-Model übernimmt die
Composite-Komponente. Dazu muss ein HTML-Element mit dem Attribute `composite`
gekennzeichnet werden und über eine gültige Composite-ID verfügen. Die
Composite-ID muss dabei den Anforderungen vom namespace entsprechen.  
Weitere Details zur Objekt-, Feld- und Wert-Bindung werden im Abschnitt
[Bindung](#bindung) beschrieben.

Die Composite-Komponente kann zwischen der Präsents und der Abwesenheit von
Model-Komponenten in der Benutzerschnittstelle durch die Existenz im DOM
unterscheiden. Die Model-Komponente wird beim Erscheinen im DOM über die
statische Methode `mount` und beim Entfernen aus dem DOM über die statische
Methode `unmount` informiert. Womit die Model-Komponente entsprechend vorbereitet
bzw. abgeschlossen werden kann.  
Die Implementierung beider Methoden ist optional.

```javascript
  var model = {
      mount: function() {
      },
      unmount: function() {
      }
  };
```

### field

Ein Feld ist die statische Eigenschaft einer statischen Model-Komponente. Es
korrespondiert mit einem HTML-Element mit gleichnamiger ID im gleichen
Namensraum. Die ID vom Feld kann relativ sein oder einen absoluten Namensraum
verwenden. Ist die ID relativ, wird der Namensraum durch das direkte
Composite-Eltern-Element festgelegt.


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

```html
<html>
  <body>
    <div id="a">
      <div id="b">
        <div id="c"></div>
      </div>
    </div>
  </body>
</html>
```

```javascript
var a = {
    b: {
        c: {}
    }
};
```

Beispiel für einen Mix von relativen und absoluten Namensraum `a.b` und `b.c.d`:

```html
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
```

```javascript
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
