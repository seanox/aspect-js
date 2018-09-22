# Object Bindung

## Inhalt

* [Grundlagen](#grundlagen)
* [Begriffe](#begriffe)
  * [namespace](#namespace)
  * [scope](#scope)
  * [model](#model)
  * [field](#field)
  * [composite-id](#composite-id)
  * [identifier](#identifier)
* [Bindung](#bindung)
* [Synchronisation](#synchronisation)
* [Validierung](#validierung)

## Grundlagen

Bei der Objekt-Bindung geht es um die Verkn�pfung und Zuordnung von
HTML-Elementen, die das Attribut `composite` enthalten, und eine
korrespondierenden Model-Objekt im JavaScript.


## Begriffe


### namespace

Der Namensraum ist ein Zeichen- bzw. Wortfolge, bestehend aus Buchstaben, Zahlen
sowie Unterstrich, welche die Verzweigung (Pfad) in einem Objekt-Baum
beschreibt. Als Trennzeichen wird der Punkt verwendet, er legt den �bergang von
einer zu n�chsten Ebene im Objekt-Baum fest.  
Jedes Element im Namensraum muss mindestens ein Zeichen enthalte, mit einem
Buchstaben beginnen und mit einem Buchstaben oder einer Zahl enden.

### scope

Der `scope` basiert auf `namespace` und repr�sentiert diesen auf der Objekt-Ebene.

### model

Das Model (Model-Komponente) ist ein statisches JavaScript-Objekt in einem
beliebigen namespace und stellt die Logik f�r die Benutzerschnittstelle
(UI-Komponente) und den �bergang von Benutzerschnittstelle zur Business-Logik
und/oder dem Backend.  
Die Verkn�pfung bzw. Bindung von Markup und JavaSchript-Model �bernimmt die
Composite-Komponente. Dazu muss ein HTML-Element mit dem Attribute `composite`
gekennzeichnet werden und �ber eine g�ltige Composite-ID verf�gen. Die
Composite-ID muss dabei den Anforderungen vom namespace entsprechen.  
Weitere Details zur Objekt-, Feld- und Wert-Bindung werden im Abschnitt
[Bindung](#bindung) beschrieben.

Die Composite-Komponente kann zwischen der Pr�sents und der Abwesenheit von
Model-Komponenten in der Benutzerschnittstelle durch die Existenz im DOM
unterscheiden. Die Model-Komponente wird beim Erscheinen im DOM �ber die
statische Methode `mount` und beim Entfernen aus dem DOM �ber die statische
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

```html
<html>
  <body>
    <div id="model" composite>
      <input id="fieldA" type="text" events="change"/>
    </div>
  </body>
</html>
```

```javascript
  var model = {
      fieldA: null
  };
```

Die Composite-Komponente �bernimmt dann die einseitige und ereignisgesteuerte
Synchronisation zwischen dem HTML-Element und der Model-Komponenten-Eigenschaft.
F�r ein HTML-Element werden daf�r die entsprechenden Events �ber das
gleichnamige Attribut festgelegt.    


### composite-id


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

Beispiel f�r einen Mix von relativen und absoluten Namensraum `a.b` und `b.c.d`:

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


## Synchronisation

Neben der statischen Verkn�pfung und Zuordnung von HTML-Elementen zu
Java-Script-Modellen, umfasst die Objekt-Bindung auch die Synchronisation von
Werten zwischen den HTML-Elementen und den Feldern der Java-Script-Modelle.  
Die Synchronisation ist dabei an Ereignisse gebunden, die beim HTML-Element �ber
das Attribut `events` festgelegt werden und somit wird die Synchronisation erst
mit dem Eintreten eines der festgelegten Ereignisse ausgef�hrt.

Details zur Verwendung werden im Abschnitt [events](markup.md#events)
beschrieben.  


## Validierung

Die Synchronisation von Werten zwischen den HTML-Elementen und den Feldern der
Java-Script-Modelle l�sst sich per Validierung kontrollieren und steuern.  
Die Verwendung der Validierung wird beim HTML-Element �ber das Attribut `validate`
festgelegt und erfordert das Attribut `events` sowie eine korrespondierende
Methode `validate` im JavaScript-Model.

Details zur Verwendung werden im Abschnitt [validate](markup.md#validate)
beschrieben.
