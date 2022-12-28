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
der Eigenschaft `value` &auml;ndert.

Der ReactProxy wirkt permanent rekursiv auf alle Objekte, in allen Ebenen eines
Models und auch auf die Objekte die sp&auml;ter als Wert hinzugef&uuml;gt
werden, auch wenn diese Objekte nicht explizit den ReactProxy nutzen.

TODO:

- basiert auf Daten-Objekten die den ReactProxy verwenden
- ReactProxy.create(object) oder Object.prototype.toReactProxy erzeugen eine entsprechende Instanz
- ReactProxy funktioniert fortlaufend rekursive, somit verwenden auch Unterobjekte den ReactProxy, auch wenn sie später
  erst dem objekt hinzugefügt werden
- ReactProxy kann auf ein ReactProxy angewendet werden, hat aber keinen Effekt und die Methoden werden die initiale
  Instanz vom ReactProxy-Objekt zurückgeben
- ändert sich ein Wert im ReactProxy-Objekt, werden die Konsumenten in der View aktualisiert (re-renderd)
- die Aktualisierung erfolgt bei Elementen auch dann, wenn diese nicht sichtbar in Attributen einen Wert konsumieren,
  auch dann wird das komplette Element aktualisiert
- die Nutzung vom ReactProxy für ein Objekt kann nur durch delete der Instanz wieder aufgehoben werden
- die Aktualisierung der Konsumenten erfolgt nach der Änderung im Objekt und nicht direkt mit,
  mit Beginn der Aktualisierung ist der Wert beim Objekt schon final gesetzt (evtl. wichtig bei Verwendung von Getter
  und Setter)


- - -

[Komponenten](composite.md) | [Inhalt](README.md#reaktives-rendering) | [Erweiterung](extension.md)
