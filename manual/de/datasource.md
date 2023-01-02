[Expression Language](expression.md) | [Inhalt](README.md#datasource) | [Resource Bundle](message.md)
- - -

# DataSource

DataSource ist ein NoSQL-Ansatz zur Datenspeicherung auf Basis von XML-Daten in
Kombination mit mehrsprachiger Datentrennung, optionaler Aggregation und
Transformation. Es ist eine Kombination von Ans&auml;tzen einer
read-only-Datenbank und einem CMS.

Die DataSource basiert auf statischen Daten. Daher verwendet die Implementierung
einen Cache, um den Netzwerkzugriff zu minimieren.

Die Daten werden per XPath abgefragt. Das Ergebnis kann verkettet, aggregiert
und per XSLT transformiert werden.

_Warum wird der Begriff NoSQL verwendet?_

NoSQL ist zu einem Synonym geworden und beschreibt mittlerweile eine
undefinierte Datenquelle mit einem undefinierten Datenmodell und einem vom SQL
abweichenden Befehlssatz. Es gibt keinen Standard f&uuml;r NoSQL, aber es gibt
eine Datenquelle, die funktional &auml;hnlich wie SQL verwendet werden kann.


## Inhalt

* [Data Storage](#data-storage)
* [Locales](#locales)
* [Locator](#locator)
* [XPath](#xpath)
* [fetch](#fetch)
* [transform](#transform)
* [collect](#collect)
* [Erg&auml;nzung](#erg-nzung)


## Data Storage

Standardm&auml;ssig befindet sich der Datenspeicher im Verzeichnis `./data`
relativ zum Anwendungsverzeichnis. Der Datenspeicher enth&auml;lt die
unterst&uuml;tzten Sprachen als Unterverzeichnisse. Jede Sprache enth&auml;lt
ihren eigenen Inhalt. Redundante Daten/Felder und weitere Unterverzeichnisse
entsprechen dem Konzept. Die DataSource verwendet haupts&auml;chlich
XML-Dateien. Optional ist die Transformation mit XSLT m&ouml;glich.

```
+ data
  + de
    - fileA.xml
    - fileA.xslt
    + directory...
    ...
  + en
    - fileA.xml
    - fileA.xslt
    + directory...
    ...
  + locales.xml
+ modules
+ resources
+ index.html
```

Der Datenspeicher kann &uuml;ber `DataSource.DATA` ge&auml;ndert werden.


## Locales

Die unterst&uuml;tzten Sprachen sind in der Datei `locales.xml` in
Gebietsschemata organisiert.

```xml
<?xml version="1.0"?>
<locales>
  <de/>
  <en default="true"/>
</locales>
```

Die Auswahl der Sprache erfolgt automatisch auf der Grundlage der
Spracheinstellung des Browsers. Wenn die dort eingestellte Sprache nicht
unterst&uuml;tzt wird, wird die als `default` deklarierte Sprache verwendet.

Zur Laufzeit kann die Sprache per JavaScript &uuml;ber das Gebietsschema
ge&auml;ndert werden. Akzeptiert werden aber nur Gebietsschemen, die mit der
DataSource verf&uuml;gbar sind, andere Angaben f&uuml;hren beim Methoden-Aufruf
zu einem Fehler.

```javascript
DataSource.localize("de");
```

Die aktuell verwendete Sprache kann als Gebietsschema per `DataSource.locale`
abgefragt werden. Alle verf&uuml;gbaren Sprachen liefert `DataSource.locales`
als Array von Gebietsschemen, das mit dem als default deklarierte Gebietsschema
beginnt.


## Locator

Die Daten im Data Storage werden mit einem Locator adressiert. Ein Locator ist
eine URL (`xml://...` oder `xslt://...`), die absolut und relativ zum
Datenspeicher der DataSource verwendet wird, aber kein Locale (Sprachangabe) und
Dateiendung im Pfad enth&auml;lt. Die Sprache wird automatisch &uuml;ber das
Gebietsschema des Browsers bestimmt, oder wenn dies nicht unterst&uuml;tzt wird,
wird der Standard aus `locales.xml` im DataSource-Datenspeicher verwendet.

Jeder Locator beginnt mit einem Protokoll, das der Dateiendung im Datenspeicher
entspricht. 

```
xml://fileA -> ./data/en/fileA.xml
xsl://fileA -> ./data/en/fileA.xsl

xml://foo/fileA -> ./data/en/foo/fileA.xml
```


## XPath

XPath wird als funktionale Abfragesprache und f&uuml;r die Transformation von
dynamischen Inhalten verwendet.  
F&uuml;r mehr Informationen siehe:
[https://www.w3schools.com/xml/xpath_intro.asp](https://www.w3schools.com/xml/xpath_intro.asp).


## fetch

Die Daten werden mit einem Locator &uuml;ber die fetch-Methode abgerufen. Der
R&uuml;ckgabewert ist ein XMLDocument, das dann mit XPath verwendet werden kann.

```javascript
const xml = DataSource.fetch("xml://paper");
xml.evaluate(...);
```

Optional kann das Ergebnis mittels XSLT transformiert werden. Dazu ist ein
Locator f&uuml;r ein Stylesheet erforderlich.

```javascript
DataSource.fetch("xml://paper", "xslt://article");
```

Mit der Transformation wird ein neues XMLDocument erstellt. Je nach Browser und
XSLT-Prozessor ist die Struktur vom XMLDocument unterschiedlich. Daher wird
standardm&auml;ssig die Root-Entit&auml;t als Knoten zur&uuml;ckgegeben. Das
Verhalten kann mit der Option `raw` ge&auml;ndert werden. Wenn dies `true` ist,
wird das XMLDocument im Original zur&uuml;ckgegeben.

```javascript
DataSource.fetch("xml://paper", "xslt://article", true);
```

Details zur Funktionsweise der Transformation werden im Abschnitt
[transform](#transform) beschrieben.


## transform

Die Transformation von XML-Daten mit XSLT (1.0) bietet eine zus&auml;tzliche
M&ouml;glichkeit zur Generierung von dynamischen Daten sowie Inhalten und kann
direkt per fetch-Methode und einem entsprechenden Locator durchgef&uuml;hrt
werden. Beide Methoden, fetch und transform akzeptieren als Parameter Locator
und XMLDocument, auch im Mix. 

```javascript
DataSource.fetch("xml://paper", "xslt://article");
DataSource.fetch("xml://paper", "xslt://article", true);

DataSource.fetch(xml, style);
DataSource.fetch(xml, style, true);
```

Mit der Transformation wird ein neues XMLDocument erstellt. Je nach Browser und
XSLT-Prozessor ist die Struktur vom XMLDocument unterschiedlich. Daher wird
standardm&auml;ssig die Root-Entit&auml;t als Knoten zur&uuml;ckgegeben. Das
Verhalten kann mit der Option `raw` ge&auml;ndert werden. Wenn dies `true` ist,
wird das XMLDocument im Original zur&uuml;ckgegeben.

Eine weitere Besonderheit betrifft JavaScript-Elemente. Diese werden automatisch
in Composite/Javascript umgewandelt, so dass sie beim Einbetten nicht
automatisch ausgef&uuml;hrt werden, sondern vom Renderer bewusst interpretiert
werden m&uuml;ssen, was bei der Verwendung von [condition](markup.md#condition)
zu ber&uuml;cksichtigen ist.

Eine weitere Besonderheit betrifft die Erstellung/Ausgabe von Text w&auml;hrend
der Transformation. Der XSLT-Prozessor erzeugt immer eine g&uuml;ltige
XML-Textausgabe. Jede XML-Syntax in einem Text wird automatisch maskiert, was
die Generierung von Markup erschwert. Zu diesem Zweck wurde das Attribut
`escape` eingef&uuml;hrt, das in XML- und XSLT-Dateien verwendet werden kann.
Das Attribut erwartet die Werte `yes`, `on`, `true` oder `1` und
unterdr&uuml;ckt die automatische Maskierung bzw. macht diese
r&uuml;ckg&auml;ngig.

```xml
<?xml version="1.0"?>
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
<?xml version="1.0"?>
<article escape="on">
  <![CDATA[
  <p>
    Seanox aspect-js is a minimalist approach to implementing Single-Page
    Applications (SPAs). This framework takes the declarative approach of HTML
    and extends this with expression language, reactivity rendering with
    additional attributes, object/model binding, Model View Controller, Resource
    Bundle, NoSQL datasource, test environment and much more.
  </p>
  <a href="https://github.com/seanox/aspect-js">read more</a>
  ]]>
</article>
```


## collect

Inhalte aus mehreren XML-Dateien k&ouml;nnen gesammelt und in einem neuen
XMLDocument zusammengefasst werden. Die verschiedenen Inhalte sind unter einem
Kollektor zusammengefasst, dessen Name selbst definiert werden kann.

Als Beispiel 3 XML-Dateien: paper.xml, envelope.xml, pen.xml, pen.xml

```xml
<?xml version="1.0"?>
<article>
  <id>100</id>
  <description>Paper</description>
  <price>1.00</price>
</article>
<?xml version="1.0"?>
<article>
  <id>200</id>
  <description>Envelope</description>
  <price>2.00</price>
</article>
<?xml version="1.0"?>
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
<?xml version="1.0"?>
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
<?xml version="1.0"?>
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


## Erg&auml;nzung

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


- - -

[Expression Language](expression.md) | [Inhalt](README.md#datasource) | [Resource Bundle](message.md)
