[Komponenten](composite.md) | [Inhalt](README.md#reaktives-rendering) | [Erweiterung](extension.md)
- - -

# Reaktives Rendering

Beim reaktiven Ansatz l&ouml;sen &Auml;nderungen an den Datenobjekten (Models)
ein partielles Auffrischen der Konsumenten in der View aus. Konsumenten sind
alle Ausdr&uuml;cke, die lesend auf den ge&auml;nderten Wert eines Datenobjekts
zugreifen. Die Ausdr&uuml;cke k&ouml;nnen in Elementen und im Freitext verwendet
werden. F&uuml;r das reaktive Rendering m&uuml;ssen die Datenobjekte den
ReactProxy nutzen, wozu `ReactProxy.create(object)` oder
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
was auch f&uuml;r Markup funktioniert, welches erst zur Laufzeit eingef&uuml;gt
wird. Somit muss der ReactProxy immer vor den Konsumenten existieren.__

Beenden l&auml;sst sich das reaktive Rendering durch das gezielte L&ouml;schen
von ReactProxy-Instanzen mit der `delete` Methode.

Der ReactProxy wirkt permanent rekursiv auf allen Objektebenen und auch auf die
Objekte welche sp&auml;ter als Wert hinzugef&uuml;gt werden. Auch wenn diese
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
objectD.objectB.text = "A";

// Assertions
objectD.objectB !== objectB
objectD.objectB !== objectC.objectB
objectD.objectB.text === "A"
objectC.objectB.text === "A"
```

__Der ReactProxy ist ein Stellvertreter (Substitute) f&uuml;r ein anderes Objekt
und kontrolliert den Zugriff auf das urspr&uuml;ngliche Objekt. Auch wenn
ReactProxy und das Objekt eigenst&auml;ndige Instanzen sind, ist der ReactProxy
fest an das urspr&uuml;ngliche Objekt gekoppelt.__

```javascript
const objectA = {};
const objectB = objectA.toReactProxy();
objectB.value = "B";

// Assertions
typeof objectA.value === "string"
typeof objectB.value === "string"
objectA.value === objectB.value
```

Der Zugriff auf das urspr&uuml;ngliche Datenobjekt ist mit der Methode
`ReactProxy.prototype.toObject()` m&ouml;glich.

Von einer bestehenden ReactProxy-Instanz kann keine neue ReactProxy-Instanz
erstellt werden. `ReactProxy.prototype.toReactProxy()` wird immer eine Referenz
auf sich selbst zur&uuml;ckgeben. Etwas anders verh&auml;lt es sich, wenn einer
bestehenden ReactProxy-Instanz ein anderes ReactProxy-Objekt als Wert
hinzugef&uuml;gt wird. Dann wird auf Basis vom urspr&uuml;nglichen Objekt, das
als ReactProxy-Objekt hinzugef&uuml;gt werden soll, eine neue ReactProxy-Instanz
erstellt.

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
objectD.objectA !== objectA

objectC.objectB = objectB;

// Assertion
objectC.objectB !== objectB
```

__Missverst&auml;ndnisse vorbeugen__

Der ReactProxy selbst hat keinen direkten Einfluss auf die View, sondern fordert
den Renderer auf, einzelne konsumierende Elemente zu aktualisieren, was
besonders dann beachtet werden muss, wenn Ausdr&uuml;cke tempor&auml;re
Variablen nutzen, wie sie z.B. beim Attribut `iterate` verwendet werden.

Elemente mit dem Attribut`iterate` werden automatisch ber&uuml;cksichtigt und so
wird in diesem Fall wird immer das oberste Element mit dem Attribut `iterate`
aktualisiert, damit die tempor&auml;ren Variablen in allen Ausdr&uuml;cken
verf&uuml;gbar sind.



- - -

[Komponenten](composite.md) | [Inhalt](README.md#reaktives-rendering) | [Erweiterung](extension.md)

