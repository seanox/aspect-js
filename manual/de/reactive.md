[Komponenten](composite.md) | [Inhalt](README.md#reaktives-rendering) | [Erweiterung](extension.md)
- - -

# Reaktives Rendering

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
