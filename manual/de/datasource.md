[Expression Language](expression.md) | [Inhalt](README.md) | [Resource Bundle](messages.md)

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


## Locator

Die Daten im Data Storage werden mit einem Locator adressiert.  
Ein Locator ist eine URL (`xml://...` oder `xslt://...`), die absolut und
relativ zum Datenspeicher der DataSource verwendet wird, aber kein Locale
(Sprachangabe) und Dateiendung im Pfad enth�lt. Die Sprache wird automatisch
�ber das Gebietsschema des Browsers bestimmt, oder wenn dies nicht unterst�tzt
wird, wird der Standard aus `locales.xml` im DataSource-Datenspeicher
verwendet.

Jeder Locator beginnt mit einem Protokoll, das der Dateiendung im Datenspeicher
entspricht. 

```
xml://fileA -> ./data/en/fileA.xml
xsl://fileA -> ./data/en/fileA.xsl

xml://foo/fileA -> ./data/en/foo/fileA.xml
```


## XPath

XPath wird als funktionale Abfragesprache und f�r die Transformation von
dynamischen Inhalten verwendet.    
F�r mehr Informationen siehe:
[https://www.w3schools.com/xml/xpath_intro.asp](https://www.w3schools.com/xml/xpath_intro.asp).


## fetch

Die Daten werden mit einem Locator �ber die fetch-Methode abgerufen.      
Der R�ckgabewert ist ein XMLDocument, das dann mit XPath verwendet werden kann.

```javascript
var xml = DataSource.fetch("xml://paper");
xml.evaluate(...);
```

Optional kann das Ergebnis mittels XSLT transformiert werden.  
Dazu ist ein Locator f�r ein Stylesheet erforderlich.

```javascript
DataSource.fetch("xml://paper", "xslt://article");
```

W�hrend der Transformation wird ein neues XMLDocument erstellt. Je nach Browser
und XSLT-Prozessor ist die Struktur vom XMLDocument unterschiedlich. Daher wird
standardm�ssig die Root-Entit�t als Knoten zur�ckgegeben. Das Verhalten kann mit
der Option `raw` ge�ndert werden. Wenn dies `true` ist, wird das XMLDocument
im Original zur�ckgegeben.

```javascript
DataSource.fetch("xml://paper", "xslt://article", true);
```

Weitere Details zur Funktionsweise der Transformation werden im Abschnitt
[transform](#transform) beschrieben.


## transform

Die Transformation von XML-Daten mit XSLT (1.0) bietet eine zus�tzliche
M�glichkeit zur Generierung von dynamischen Daten sowie Inhalten und kann dirket
mit fetch-Methode und einem entsprechenden Locator durchgef�hrt werden.  
Beide Methoden, fetch und transform akzeptiert als Argumente Locator und
XMLDocument, auch im Mix. 

```javascript
DataSource.fetch("xml://paper", "xslt://article");
DataSource.fetch("xml://paper", "xslt://article", true);

DataSource.fetch(xml, style);
DataSource.fetch(xml, style, true);
```

W�hrend der Transformation wird ein neues XMLDocument erstellt. Je nach Browser
und XSLT-Prozessor ist die Struktur vom XMLDocument unterschiedlich. Daher wird
standardm�ssig die Root-Entit�t als Knoten zur�ckgegeben. Das Verhalten kann mit
der Option `raw` ge�ndert werden. Wenn dies `true` ist, wird das XMLDocument
im Original zur�ckgegeben.

Ein weiteres Besonderheit betrifft JavaScript-Elemente.  
Diese werden automatisch in Composite/Javascript umgewandelt, so dass sie beim
Einbetten nicht automatisch ausgef�hrt werden, sondern vom Renderer bewusst
interpretiert werden. Dies ist wichtig bei der Verwendung von
[condition](markup.md#condition).

Eine  weitere Besonderheit betrifft die Erstellung/Ausgabe von Text w�hrend der
Transformation. Der XSLT-Prozessor erzeugt immer eine g�ltige XML-Textausgabe.
Jede XML-Syntax in einem Text wird automatisch makiert, was die Generierung von
Markup erschwert. Zu diesem Zweck wurde das Attribut `escape` eingef�hrt, das
in XML- und XSLT-Dateien verwendet werden kann. Das Attribut erwartet die Werte
`yes`, `on`, `true` oder `1` und unterdr�ckt die automatische Maskierung bzw.
macht diese r�ckg�ngig.

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html"/>
  <xsl:template match="/">
    <header>
      <h1>Title</h1>
    </header>
    <article escape="on">
      <xsl:value-of select="/content"/>
    </article>
  </xsl:template>
</xsl:stylesheet>
```

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<article escape="on">
  <![CDATA[
  <p>
    Seanox aspect-js is a JavasScript framework for implementing  
    dynamic interfaces for web browsers.  
    The framework takes the declarative approach of HTML and combines  
    markup and JavaScript via the model view controler to components  
    that are addressed directly or via virtual paths.  
    The framework provides an expression language based on JavaScript.
  </p>
  <a href="https://github.com/seanox/aspect-js">read more</a>
  ]]>
</article>
```


## collect

Inhalte aus mehreren XML-Dateien k�nnen gesammelt und in einem neuen XMLDocument
zusammengefasst werden. Die verschiedenen Inhalte sind unter einem Kollektor
zusammengefasst, dessen Name selbst definiert werden kann.

Als Beispiel 3 XML-Dateien: paper.xml, envelope.xml, pen.xml, pen.xml

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<article>
  <id>100</id>
  <description>Paper</description>
  <price>1.00</price>
</article>
<?xml version="1.0" encoding="ISO-8859-1"?>
<article>
  <id>200</id>
  <description>Envelope</description>
  <price>2.00</price>
</article>
<?xml version="1.0" encoding="ISO-8859-1"?>
<article>
  <id>300</id>
  <description>Pen</description>
  <price>3.00</price>
</article>
```

Sammlung mit dem Standard-Kollektor.

```javascript
DataSource.collect("xml://paper", "xml://envelope", "xml://pen");
```

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<collector>
  <article>
    <id>100</id>
    <description>Paper</description>
    <price>1.00</price>
  </article>
  <article>
    <id>200</id>
    <description>Envelope</description>
    <price>2.00</price>
  </article>
  <article>
    <id>300</id>
    <description>Pen</description>
    <price>3.00</price>
  </article>
</collector>  
```

Sammlung mit einem eigenen articles-Kollektor.

```javascript
DataSource.collect("articles", ['xml://paper', 'xml://envelope', 'xml://pen']);
```

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<articles>
  <article>
    <id>100</id>
    <description>Paper</description>
    <price>1.00</price>
  </article>
  <article>
    <id>200</id>
    <description>Envelope</description>
    <price>2.00</price>
  </article>
  <article>
    <id>300</id>
    <description>Pen</description>
    <price>3.00</price>
  </article>
</articles>  
```


## Erg�nzung

Die DataSource kann auch direkt im Markup mit den Attributen
[import](markup.md#import) und [output](markup.md#output) verwendet werden.

```html
<article import="xml:/example/content">
  loading resource...  
</article>

<article import="xml:/example/data xslt:/example/style">
  loading resource...  
</article>

<article output="xml:/example/content">
  loading resource...  
</article>

<article output="xml:/example/data xslt:/example/style">
  loading resource...  
</article>
```

[Expression Language](expression.md) | [Inhalt](README.md) | [Resource Bundle](messages.md)
