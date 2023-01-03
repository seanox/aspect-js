[Expression Language](expression.md) | [TOC](README.md#datasource) | [Resource Bundle](message.md)
- - -

# DataSource

DataSource is a NoSQL approach to data storage based on XML data in combination
with multilingual data separation, optional aggregation and transformation. A
combination of the approaches of a read only database and a CMS.

DataSource is based on static data. Therefore, the implementation uses a cache
to minimize network access.
 
The data is queried via XPath. The result can be concatenated and aggregated and
the result can be transformed with XSLT.

_Why the term NoSQL is used?_

NoSQL has become a synonym and meanwhile describes an undefined data source with
an undefined data model and a command set that differs from SQL. There is no
standard for NoSQL, but there is a data source that can be functionally used
similar to SQL.


## Contents Overview

* [Data Storage](#data-storage)
* [Locales](#locales)
* [Locator](#locator)
* [XPath](#xpath)
* [fetch](#fetch)
* [transform](#transform)
* [collect](#collect)
* [Supplement](#supplement)


## Data Storage

By default, the data storage is located as `./data` relative to the application
directory. The data storage contains the supported languages as subdirectories.
Each language contains its own content. Redundant data/fields and more
subdirectories corresponds to the concept. The DataSource primarily uses XML
files. Optionally, a transformation with XSLT is possible.

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

The data storage can be changed via `DataSource.DATA`. 


## Locales

The supported languages are organized in locales in the `locales.xml` file.

```xml
<?xml version="1.0"?>
<locales>
  <de/>
  <en default="true"/>
</locales>
```

The language is selected automatically on the basis of the language setting of
the browser. If the language set there is not supported, the language declared
as `default` is used.

At runtime, the language can be changed via JavaScript with the locale. But only
locales that are available with the DataSource are accepted. Other values cause
an error when the method is called.

```javascript
DataSource.localize("de");
```

The currently used language can be retrieved via `DataSource.locale`. All
available languages are returned by `DataSource.locales` as an array that starts
with the as default declared language.


## Locator

The data in the data storage is addressed with a locator. A locator is a URL
(`xml://...` or `xslt://...`) that is used absolute and relative to the
DataSource data storage, but does not contain a locale (language specification)
and file extension in the path. The locale is determined automatically for the
language setting of the browser, or if this is not supported, the standard from
the `locales.xml` in the DataSource data storage is used.

Each locator starts with a protocol that corresponds to the file extension in
the data storage. 

```
xml://fileA -> ./data/en/fileA.xml
xsl://fileA -> ./data/en/fileA.xsl

xml://foo/fileA -> ./data/en/foo/fileA.xml
```


## XPath

XPath is used as a functional query language and for the transformation of
dynamic content.

For more information please read:
[https://www.w3schools.com/xml/xpath_intro.asp](https://www.w3schools.com/xml/xpath_intro.asp).


## fetch

The data is fetched with a locator through the fetch method. The return value
is an XMLDocument that can then be used in detail with XPath.

```javascript
const xml = DataSource.fetch("xml://paper");
xml.evaluate(...);
```

Optionally the result can be transformed via XSLT. This requires a locator for
a stylesheet.

```javascript
DataSource.fetch("xml://paper", "xslt://article");
```

During the transformation a new XMLDocument is created. Depending on the browser
and XSLT processor, the structure of XMLDocument is different. Therefore, by
default the root entity will be returned as a node. The behavior can be changed
with option `raw`. If this is `true`, the XMLDocument is returned as original.

```javascript
DataSource.fetch("xml://paper", "xslt://article", true);
```

More details about the special features of the transformation can be found in
chapter [transform](#transform).


## transform

The transformation via XSLT (1.0) of XML data provides an additional way for
generating dynamically data and content and can already be done with the fetch
method, which is based on locators. Sometimes it is necessary to work directly
with the XMLDocument. In these cases the transform method can be used, because
the method accepts XMLDocument as well locator (also in a mix).

```javascript
DataSource.fetch("xml://paper", "xslt://article");
DataSource.fetch("xml://paper", "xslt://article", true);

DataSource.fetch(xml, style);
DataSource.fetch(xml, style, true);
```

During the transformation a new XMLDocument is created. Depending on the browser
and XSLT processor, the structure of XMLDocument is different. Therefore, by
default the root entity will be returned as a node. The behavior can be changed
with option `raw`. If this is `true`, the XMLDocument is returned as original.

Another feature concerns JavaScript elements. These are automatically changed to
composite/javascript so that they are not executed automatically when embedding,
but are deliberately interpreted by the renderer. This is important when using
[condition](markup.md#condition).

Another feature concerns JavaScript elements. These are automatically changed to
composite/javascript so that they are not executed automatically when embedding,
but are deliberately interpreted by the renderer. This is important when using
[condition](markup.md#condition).

Another feature concerns the creation/output of text during the transformation.
The XSLT Processor always generates XML valid text output. Any XML syntax in a
text is automatically masked. This makes the generation of markup difficult. The
attribute `escape` was introduced for this purpose and can be used in XML and
XSLT files. The attribute expects the values `yes`, `on`, `true` or `1`. In this
case the automatic escaping is cancelled or undone.

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

Content from multiple XML files can be collected and concatenated into a new
XMLDocument. The various contents are combined under one collector, whose name
can be defined yourself.

As an example, 3 XML files: paper.xml, envelope.xml, pen.xml

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

Collecting with the standard collector.

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

Collecting with an own article's collector.

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


## Supplement

The DataSource can also be used directly in the markup with the attributes
[import](markup.md#import) and [output](markup.md#output).

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

[Expression Language](expression.md) | [TOC](README.md#datasource) | [Resource Bundle](message.md)
