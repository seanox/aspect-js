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

__Reactive ist ein Stellvertreter (Substitute) f&uuml;r ein anderes Objekt und
kontrolliert den Zugriff auf das zugrundeliegende Objekt. Auch wenn Reactive und
das Objekt eigenst&auml;ndige Instanzen sind, ist Reactive fest an das
zugrundeliegende Objekt gebunden aber entkoppelt und somit logisch getrennt.__

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
erstellt werden. `Object.prototype.reactive()` und `Reactive(...)` werden immer
eine Referenz auf sich selbst zur&uuml;ckgeben. Etwas anders verh&auml;lt es
sich, wenn einer bestehenden Reactive-Instanz ein anderes Reactive-Objekt als
Wert hinzugef&uuml;gt wird. Dann wird auf Basis vom zugrundeliegenden Objekt,
das als Reactive-Objekt hinzugef&uuml;gt werden soll, eine neue Reactive-Instanz
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

Wie schon beschrieben ist Reactive ein Proxy und nutzt eine logische Trennung
zum zugrundeliegenden Objekt, welches bei der Initiierung als Schema f&uuml;r
die bidirektionale Synchronisation zu betrachten ist. Die bidirektionale
Synchronisation ist im Detail betrachtet monodirektional Set und Get getrieben.
Somit wird aus Sicht der Reactive-Instanz beim Get vom zugrundeliegenden Objekt
zur Reactive-Instanz (object -> reactive) und beim Set von der Reactive-Instanz
zum zugrundeliegenden Objekt (reactive -> object) synchronisiert. Damit werden
Ver&auml;nderungen beim zugrundeliegenden Objekt beim Datenzugriff
ber&uuml;cksichtigt, ohne dass dies Auswirkung auf die View hat.

```javascript
const object = {valueA:1};
const model = Reactive(object);
window.setTimeout(() =>
    object.valueB = 2, 1000);
window.setTimeout(() =>
    console.log(model.valueB), 2000);
window.setTimeout(() =>
    object.valueA = 3, 3000);
window.setTimeout(() =>
    console.log(model.valueA), 4000);
window.setTimeout(() =>
    console.log(model.valueB), 5000);
window.setTimeout(() =>
    model.valueA = 5, 6000);
```

In diesem Beispiel wird nach ca. 5 Sekunden, wo `model` als Reactive-Instanz
lesend auf das zugrundeliegende Objekt zugreift, der `valueB` &uuml;bernommen
und nach ca. 6 Sekunden durch den schreibenden Zugriff auf `model` die
Aktualisierung der View angestossen.

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

__Missverst&auml;ndnisse vorbeugen__

Reactive hat selbst keinen direkten Einfluss auf die View, sondern fordert den
Renderer auf, einzelne konsumierende HTML-Elemente zu aktualisieren, was
besonders dann beachtet werden muss, wenn Ausdr&uuml;cke tempor&auml;re
Variablen nutzen, wie sie z.B. beim Attribut `iterate` verwendet werden, was
bereits automatisch ber&uuml;cksichtigt wird.


- - -

[Komponenten](composite.md) | [Inhalt](README.md#reaktives-rendering) | [Erweiterung](extension.md)
