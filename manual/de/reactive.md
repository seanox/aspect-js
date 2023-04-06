[Komponenten](composite.md) | [Inhalt](README.md#reaktives-rendering) | [Erweiterung](extension.md)
- - -

# Reaktives Rendering

Beim reaktiven Ansatz l&ouml;sen &Auml;nderungen an den Datenobjekten (Models)
ein partielles Auffrischen der Konsumenten in der View aus. Konsumenten sind
alle Ausdr&uuml;cke, die lesend auf den ge&auml;nderten Wert eines Datenobjekts
zugreifen. In der View lassen sich Ausdr&uuml;cke in den HTML-Elementen und im
Freitext verwenden. Die Datenobjekte m&uuml;ssen dann f&uuml;r das reaktive
Rendering `Reactive(object)` oder `Object.prototype.reactive()` nutzen.

```javascript
const Model = {
    value: ...
}.reactive();
```

In diesem Beispiel aktualisiert der Renderer automatisch alle HTML-Elemente im
DOM, was Freitexte einschliesst, welche die Eigenschaft `value` vom `Model`
direkt oder indirekt in einem Ausdruck verwenden, wenn sich der Wert der
Eigenschaft `value` &auml;ndert oder genauer, wenn ein ge&auml;nderter Wert im
Datenobjekt final gesetzt wurde, was bei der Verwendung von Getter und Setter
relevant sein kann.

__Das reaktive Verhalten basiert auf Notifications innerhalb von Reactive mit
denen das Rendering angesteuert wird. Damit die Notifications eingerichtet
werden k&ouml;nnen, muss Reactive die Konsumenten der Daten kennen, wozu es die
erforderlichen Informationen beim Parsen und Rendern vom Markup sammelt, was
auch f&uuml;r Markup funktioniert, welches erst zur Laufzeit eingef&uuml;gt
wird. Somit muss Reactive immer vor den Konsumenten existieren.__

Beenden l&auml;sst sich das reaktive Rendering durch das gezielte L&ouml;schen
von Reactive-Instanzen mit der `delete` Methode.

Reactive wirkt permanent rekursiv auf allen Objektebenen und auch auf die
Objekte welche sp&auml;ter als Wert hinzugef&uuml;gt werden. Auch wenn diese
Objekte nicht explizit Reactive nutzen, werden f&uuml;r die referenzierten
Objekte neue Instanzen gebildet. Initiierende Objekte und reaktive Models sind
logisch entkoppelt und werden bidirektional synchronisiert. Im Unterschied dazu
nutzen Views und reaktive Models, wie auch die Models intern, Proxies, die sich
wie die initiierenden Originale verhalten und verwenden lassen. Jedoch sind
Proxies eigenst&aumkl;ndige Instanzen, die kompatibel aber nicht identisch zum
initiierenden Objekt sind. Notwendig ist diese logische Trennung, damit der
Renderer bei Daten&auml;nderungen entsprechende Notifications erzeugen und damit
die Konsumenten in der View aktualisieren kann.

```javascript
const objectA = {}
const objectB = {}
objectA.objectB = objectB;

// Assertions
objectA.objectB === objectB

const objectC = objectA.reactive();

// Assertions
objectC.objectB !== objectA
objectC.objectB !== objectB
objectA.objectB === objectB

const objectD = ({}).reactive();
objectD.objectB = objectB;
objectD.objectB.text = "A";

// Assertions
objectD.objectB !== objectB;
objectD.objectB === objectC.objectB;
objectD.objectB.text === "A";
objectC.objectB.text === "A";

const objectE = {text: "A"};
const objectF = objectE.reactive();
objectF.text = "B";

// Assertions
objectE.text === "B";
objectF.text === "B";

objectE.text = "C";

// Assertions
objectE.text === "C"
objectF.text === "C"

```

__Reactive ist ein Stellvertreter (Substitute) f&uuml;r ein anderes Objekt und
kontrolliert den Zugriff auf das urspr&uuml;ngliche Objekt. Auch wenn Reactive
und das Objekt eigenst&auml;ndige Instanzen sind, ist Reactive fest an das
urspr&uuml;ngliche Objekt gebunden und dennoch entkoppelt.__

```javascript
const objectA = {};
const objectB = objectA.reactive();
objectB.value = "B";

// Assertions
typeof objectA.value === "string"
typeof objectB.value === "string"
objectA.value === objectB.value
```

Von einer bestehenden Reactive-Instanz kann keine neue Reactive-Instanz
erstellt werden. `ReactProxy.prototype.reactive()` wird immer eine Referenz
auf sich selbst zur&uuml;ckgeben. Etwas anders verh&auml;lt es sich, wenn einer
bestehenden ReactProxy-Instanz ein anderes ReactProxy-Objekt als Wert
hinzugef&uuml;gt wird. Dann wird auf Basis vom urspr&uuml;nglichen Objekt, das
als ReactProxy-Objekt hinzugef&uuml;gt werden soll, eine neue ReactProxy-Instanz
erstellt.

```javascript
const objectA = ({}).reactive();
const objectB = objectA.reactive();
const objectC = Reactive(objectA);

// Assertions
objectA === objectB
objectA === objectC
objectB === objectC

const objectD = ({objectA}).reactive();

// Assertion
objectD.objectA === objectA

objectC.objectB = objectB;

// Assertion
objectC.objectB === objectB
```

__Missverst&auml;ndnisse vorbeugen__

Der ReactProxy selbst hat keinen direkten Einfluss auf die View, sondern fordert
den Renderer auf, einzelne konsumierende HTML-Elemente zu aktualisieren, was
besonders dann beachtet werden muss, wenn Ausdr&uuml;cke tempor&auml;re
Variablen nutzen, wie sie z.B. beim Attribut `iterate` verwendet werden.

HTML-Elemente mit dem Attribut`iterate` werden automatisch ber&uuml;cksichtigt
und so wird in diesem Fall immer das oberste HTML-Element mit dem Attribut
`iterate` aktualisiert, damit die tempor&auml;ren Variablen in allen
Ausdr&uuml;cken verf&uuml;gbar sind.


- - -

[Komponenten](composite.md) | [Inhalt](README.md#reaktives-rendering) | [Erweiterung](extension.md)
