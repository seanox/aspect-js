[Komponenten](composite.md) | [Inhalt](README.md#erweiterung) | [Test](test.md)

# Erweiterung

TODO:


## Namespace

Namespace zu deutsch Namensraum auf Objektebene.  
Namespace kann, vergleichbar mit Paketen in anderen Programmiersprachen,
verwendet werden, um hierarchische Strukturen abzubilden und thematisch
verwandte Komponenten und Ressourcen zu gruppieren. Die Implementierung erfolgt
in JavaScript auf Objektebene. Das bedeutet, dass es kein reales Element der
Programmiersprache ist, sondern durch verkettete statische Objekte repräsentiert
wird. Jede Ebene in dieser Objektkette repräsentiert einen Namensraum. Wie bei
Objekten üblich, werden die Namensräume durch einen Punkt getrennt. 

```javascript
Namespace.using("app.example");
app.example.Model {
    ...
}
```


TODO:

[Komponenten](composite.md) | [Inhalt](README.md#erweiterung) | [Test](test.md)
