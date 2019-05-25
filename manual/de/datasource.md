# DataSource

DataSource ist ein NoSQL-Ansatz zur Datenspeicherung auf Basis von XML-Daten in
Kombination mit mehrsprachiger Datentrennung, optionaler Aggregation und
Transformation. Es ist eine Kombination von Ansätzen einer read-only-Datenbank
und einem CMS.

Die DataSource basiert auf statischen Daten. Daher verwendet die Implementierung
einen Cache, um den Netzwerkzugriff zu minimieren.

Die Daten werden per XPath abgefragt, das Ergebnis kann verkettet, aggregiert
und per XSLT transformiert werden.

_Warum wird der Begriff NoSQL verwendet?_

NoSQL ist zu einem Synonym geworden und beschreibt mittlerweile eine
undefinierte Datenquelle mit einem undefinierten Datenmodell und einem vom SQL
abweichenden Befehlssatz. Es gibt keinen Standard für NoSQL, aber es gibt eine
Datenquelle, die funktional ähnlich wie SQL verwendet werden kann.


## Contents Overview
* [Data Storage](#data-storage)
* [Locales](#locales)
* [Locator](#locator)
* [XPath](#xpath)
* [fetch](#fetch)
* [transform](#transform)
* [collect](#collect)
* [Ergänzung](#erg-nzung)


## Data Storage

Standardmässig befindet sich der Datenspeicher in `./data` relativ zum
Anwendungsverzeichnis. Der Datenspeicher enthält die unterstützten Sprachen als
Unterverzeichnisse. Jede Sprache enthält ihren eigenen Inhalt. Redundante
Daten/Felder und weitere Unterverzeichnisse entsprechen dem Konzept. Die
DataSource verwendet hauptsächlich XML-Dateien. Die Transformation mit XSLT ist
optional möglich.

```
+- data
|  |
|  +- de
|  |  |
|  |  +- fileA.xml
|  |  +- fileA.xslt
|  |  +- directory...
|  |  ...
|  +- en
|  |  |
|  |  +- fileA.xml
|  |  +- fileA.xslt
|  |  +- directory...
|  |  ...
|  +- locales.xml
|
+- modules
+- resources
+- index.html
```

Der Datenspeicher kann über `DataSource.DATA` geändert werden.


## Locales

Die unterstützten Sprachen sind in der Datei `locales.xml` in Gebietsschemata
organisiert, die alle unterstützten Sprachen als Satz enthält.

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<locales>
  <de/>
  <en default="true"/>
</locales>
```

Die Auswahl der Sprache erfolgt automatisch auf der Grundlage der
Spracheinstellung des Browsers. Wenn die dort eingestellte Sprache nicht
unterstützt wird, wird die als "Standard" deklarierte Sprache verwendet.

Die verfügbaren Sprachinformationen können per `DataSource.locale` und 
`DataSource.locales` abgefragt werden.

Zur Laufzeit kann die Sprache per JavaScript über das Gebietsschema geänder
werden.  
Akzeptiert werden nur Gebietsschemen, die mit der DataSource verfügbar sind,
andere Angaben führen beim Methoden-Aufruf zu einem Fehler.

```javascript
DataSource.localize("de");
```

TODO:
