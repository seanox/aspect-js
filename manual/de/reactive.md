[Komponenten](composite.md) | [Inhalt](README.md#reaktives-rendering) | [Erweiterung](extension.md)
- - -

# Reaktives Rendering

Beim reaktiven Ansatz l&ouml;sen &Auml;nderungen an den Datenobjekten von
Modellen ein partielles Auffrischen der Konsumenten in der View aus. Konsumenten
sind alle Ausdr&uuml;cke, die lesend auf den ge&auml;nderten Wert eines
Datenobjekts zugreifen. Die Ausdr&uuml;cke k&ouml;nnen in Elementen und im
Freitext verwendet werden. F&uuml;r das reaktive Rendering m&uuml;ssen die
Datenobjekte den ReactProxy nutzen, wozu `ReactProxy.create(object)` oder
`Object.prototype.toReactProxy()`, was jede Objekt-Instanz bereitstellt,
verwendet werden.

```javascript
let Model = {
    value: ...
}.toReactProxy();
```

In diesem Beispiel wird der Renderer automatisch alle Elemente im DOM
aktualisieren, was die Freitexte einschliesst, welche die Eigenschaft `value`
vom Model direkt oder indirekt in einem Ausdruck verwenden, wenn sich der Wert
der Eigenschaft `value` &auml;ndert oder genauer, wenn der Wert im Datenobjekt
final gesetzt wurde. Was bei der Verwendung von Getter und Setter relevant sein
kann.

__Das reaktive Verhalten basiert auf Notifications innerhalb vom ReactProxy mit
denen das Rendering angesteuert wird. Damit die Notifications eingerichtet
werden k&ouml;nnen, muss der ReactProxy die Konsumenten der Daten kennen, wozu
er die erforderlichen Informationen beim Parsen und Rendern vom Markup sammelt,
was auch f&auuml;r Markup funktioniert, welches erst zur Laufzeit eingef&uuml;gt
wird. Somit muss der ReactProxy immer vor den Konsumenten existieren.__

Beenden l&auml;sst sich das reaktive Rendering durch das gezielte L&ouml;schen
von ReactProxy-Instanzen mit der `delete` Methode.

Der ReactProxy wirkt permanent rekursiv auf alle Objektebenen und auch auf die
Objekte welche sp&auml;ter als Wert hinzugef&uuml;gt werden, auch wenn diese
Objekte nicht explizit den ReactProxy nutzen, werden f&uuml;r die referenzierten
Objekte neue Instanzen gebildet.

```javascript
const objectA = {}
const objectB = {}
objectA.objectB = objectB;

// Assertions
objectA.objectB === objectB

const objectC = objectA.toReactProxy();

// Assertions
objectC.objectB === objectA.objectB
objectC.objectB !== objectB
objectA.objectB !== objectB

const objectD = ({}).toReactProxy();
objectD.objectB = objectB;

// Assertions
objectD.objectB !== objectB
objectD.objectB === objectC.objectB
```

__Die ReactProxy-Instanz und das urspr&uuml;ngliche Datenobjekt sind entkoppelt.
Vergleichbar mit einem DTO (Data Transfer Object) ist die ReactProxy-Instanz
eigenst&auml;ndig und hat keine direkten Referenzen zum urspr&uuml;nglichen
Datenobjekt.__

```javascript
const objectA = {};
const objectB = objectA.toReactProxy();
objectB.value = "B";

// Assertions
typeof objectA.value === "undefined"
typeof objectB.value === "string"
```

Der Zugriff auf das urspr&uuml;ngliche Datenobjekt ist mit der Methode
`ReactProxy.prototype.toObject()` m&ouml;glich. Hierzu nochmal der Hinweis, dass
das Datenobjekt entkoppelt von der ReactProxy-Instanz existiert und nicht dem
aktuellen Stand der ReactProxy-Instanz entsprechen wird.

Von einer bestehenden ReactProxy-Instanz kann keine neue ReactProxy-Instanz
erstellt werden. Die entsprechenden Methoden werden immer eine Referenz auf die
urspr&uuml;ngliche ReactProxy-Instanz zur&uuml;ckgeben.

```javascript
const objectA = ({}).toReactProxy();
const objectB = objectA.toReactProxy();
const objectC = ReactProxy.create(objectA);

// Assertions
objectA === objectB
objectA === objectC
objectB === objectC

const objectD = ({objectA}).toReactProxy();

// Assertion
objectD.objectA === objectA
```


- - -

[Komponenten](composite.md) | [Inhalt](README.md#reaktives-rendering) | [Erweiterung](extension.md)

