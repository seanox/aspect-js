# DataSource

DataSource ist ein NoSQL-Ansatz zur Datenspeicherung auf Basis von XML-Daten in
Kombination mit mehrsprachiger Datentrennung, optionaler Aggregation und
Transformation. Es ist eine Kombination von Ans�tzen einer read-only-Datenbank
und einem CMS.

Die DataSource basiert auf statischen Daten. Daher verwendet die Implementierung
einen Cache, um den Netzwerkzugriff zu minimieren.

Die Daten werden per XPath abgefragt, das Ergebnis kann verkettet, aggregiert
und per XSLT transformiert werden.

_Warum wird der Begriff NoSQL verwendet?_

NoSQL ist zu einem Synonym geworden und beschreibt mittlerweile eine
undefinierte Datenquelle mit einem undefinierten Datenmodell und einem vom SQL
abweichenden Befehlssatz. Es gibt keinen Standard f�r NoSQL, aber es gibt eine
Datenquelle, die funktional �hnlich wie SQL verwendet werden kann.


## Contents Overview
* [Data Storage](#data-storage)
* [Locales](#locales)
* [Locator](#locator)
* [XPath](#xpath)
* [fetch](#fetch)
* [transform](#transform)
* [collect](#collect)
* [Erg�nzung](#erg-nzung)


## Data Storage

Standardm�ssig befindet sich der Datenspeicher in `./data` relativ zum
Anwendungsverzeichnis. Der Datenspeicher enth�lt die unterst�tzten Sprachen als
Unterverzeichnisse. Jede Sprache enth�lt ihren eigenen Inhalt. Redundante
Daten/Felder und weitere Unterverzeichnisse entsprechen dem Konzept. Die
DataSource verwendet haupts�chlich XML-Dateien. Die Transformation mit XSLT ist
optional m�glich.

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

Der Datenspeicher kann �ber `DataSource.DATA` ge�ndert werden.


## Locales

Die unterst�tzten Sprachen sind in der Datei `locales.xml` in Gebietsschemata
organisiert, die alle unterst�tzten Sprachen als Satz enth�lt.

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<locales>
  <de/>
  <en default="true"/>
</locales>
```

Die Auswahl der Sprache erfolgt automatisch auf der Grundlage der
Spracheinstellung des Browsers. Wenn die dort eingestellte Sprache nicht
unterst�tzt wird, wird die als "Standard" deklarierte Sprache verwendet.

Die verf�gbaren Sprachinformationen k�nnen per `DataSource.locale` und 
`DataSource.locales` abgefragt werden.

Zur Laufzeit kann die Sprache per JavaScript �ber das Gebietsschema ge�nder
werden.  
Akzeptiert werden nur Gebietsschemen, die mit der DataSource verf�gbar sind,
andere Angaben f�hren beim Methoden-Aufruf zu einem Fehler.

```javascript
DataSource.localize("de");
```

TODO:
