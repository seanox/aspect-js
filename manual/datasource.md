&#9665; [Scripting](scripting.md)
&nbsp;&nbsp;&nbsp;&nbsp; &#8801; [Table of Contents](README.md#datasource)
&nbsp;&nbsp;&nbsp;&nbsp; [Resource Bundle](message.md) &#9655;
- - -

# DataSource
DataSource is a Immutable NoSQL approach to data storage based on XML data in
combination with multilingual data separation, optional aggregation and
transformation. A combination of the approaches of a read only database and a
CMS.

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
- [Data Storage](#data-storage)
- [Locales](#locales)
- [Locator](#locator)
- [XPath and XPath Functions](#xpath-and-xpath-functions)
- [fetch](#fetch)
- [transform](#transform)
- [collect](#collect)
- [Supplement](#supplement)

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
The data in the data storage is addressed via a locator, which is a URL
(`xml://...` or `xslt://...`), where both single and double slashes are
supported. A locator can be used contextually or explicitly.

- __Contextual Locator__: Uses an absolute path without a file extension
  relative to the DataSource directory and does not contain a locale (language 
  specification) in the path. The locale is determined automatically based on
  the browser's language setting or, if not supported, the default locale from
  the `locales.xml` in the DataSource data storage.

- __Explicit Locator__: Uses a fully qualified URL with a file extension
  (`xml://....xml` or `xslt://....xslt`). This locator addresses an absolute
  path based on the current URL and is not enriched with the locale.

Each locator starts with a protocol that corresponds to the file extension in
the data storage. __Only lowercase letters are accepted here__, as the automatic
derivation of the corresponding file extension is too time-consuming when both
uppercase and lowercase letters are combined.

```
xml://fileA -> ./data/en/fileA.xml
xslt://fileA -> ./data/en/fileA.xslt

xml://data/en/foo/fileA.xml -> ./data/en/foo/fileA.xml
xslt://data/en/foo/fileA.xslt -> ./data/en/foo/fileA.xslt
```

## XPath and XPath Functions
The DataSource uses XPath and XPath function as a functional query language.
Locator and transformation support this language and thus provide dynamic data
access. __In the further documentation, only the term XPath is used, which
includes the use of XPath functions.__

For more information about XPath please read:
https://www.w3schools.com/xml/xpath_intro.asp.

Only for XML locators can the XPath be added at the end, separated by a question
mark.

```
xml://fileA?//*/@title

xml://data/en/foo/fileA.xml?//*/@title
```

The return value depends on the XPath and can be boolean, number, string,
NodeList, or null. When querying nodes using XPath, nodes are always returned.
This also includes attributes and text nodes.

Attributes are returned as nodes with the name _attribute_. The name and value
of the addressed attribute are represented in the node as attributes _name_ and
_value_.

```
<attribute name="name of the attribute" value="value of the attribute"/>
```

Text nodes are also returned as nodes, but then with the name _text_. The
value of the addressed text node is then the content of the node.

```
<text>content of the text node</text>
```

## fetch
Fetches data for a locator as _XMLDocument_ or as _boolean_, _number_, _string_,
_NodeList_ or _null_ when using XPath. When querying nodes using XPath, nodes
are always returned. This also includes attributes and text nodes. Attributes
are returned as nodes with the name _attribute_. The name and value of the
addressed attribute are represented in the node as attributes _name_ and
_value_. Text nodes are also returned as nodes, but then with the name _text_.
The content of the addressed text node is then the content of the node.

```javascript
const document = DataSource.fetch("xml://paper");

const data = DataSource.fetch("xml://paper?//*/@price");
```

## transform
The transformation via XSLT (1.0) of XML data provides an additional way for
dynamically data and content and can already be done with the fetch method,
which is based on locators. Sometimes it is necessary to work directly with the
XMLDocument. In these cases the transform method can be used, because the method
accepts XMLDocument as well locator (also in a mix).

```javascript
DataSource.transform("xml://paper", "xslt://article");
```

The specification of the stylesheet when using XML locators is optional. Without
the specification, the stylesheet is automatically derived from the XML
locators.

```javascript
DataSource.transform("xml://paper");
```

As an extension, a meta-object with data for the XSLT processor can be passed to
the transfromation, which can then be used in the XSLT stylesheet.

```javascript
DataSource.transform("xml://paper", {...});
DataSource.transform("xml://paper", "xslt://article", {...});
```

And the XML locator also supports XPath for transformation. For this purpose,
the collected data is collected in an artificial XMLDocument with the root
element _data_, which is then used as the basis for the transformation.

```javascript
DataSource.transform("xml://paper?//*/@price");
DataSource.transform("xml://paper?//*/@price", "xslt://article");
DataSource.transform("xml://paper?//*/@price", {...});
DataSource.transform("xml://paper?//*/@price", "xslt://article", {...});
```

During the transformation a new XMLDocument is created. Depending on the browser
and XSLT processor, the structure of XMLDocument is different. Therefore, by
default the root entity will be returned as a node. The behavior can be changed
with option `raw`. If this is `true`, the XMLDocument is returned as original.

Another feature concerns JavaScript elements. Their type is automatically
changed to `composite/javascript` so that they are not executed automatically
when embedding, but are deliberately interpreted by the renderer. This is
important when using [condition](markup.md#condition).

Another feature concerns the creation/output of text during the transformation.
The XSLT Processor always generates XML valid text output. Any XML syntax in a
text is automatically masked. This makes the generation of markup difficult. The
attribute `escape` was introduced for this purpose and can be used in XML and/or
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
    Seanox aspect-js focuses on a minimalist approach to implementing
    Single-Page Applications (SPAs) and Micro-Frontends. This framework takes
    the declarative approach of HTML and extends this with Expression Language,
    Reactivity Rendering with additional attributes, Model View Controller
    (MVC), View Model Binding, Events, Interceptors, Resource Bundle, Immutable
    NoSQL DataSource, Test Environment and much more.
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

Collecting with an own _articles_ collector.

```javascript
DataSource.collect("articles", "xml://paper", "xml://envelope", "xml://pen");
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
<article import="xml://example/content">
  loading resource...
</article>

<article import="xml://example/data + xslt://example/style">
  loading resource...
</article>

<article output="xml://example/content">
  loading resource...
</article>

<article output="xml://example/data + xslt://example/style">
  loading resource...
</article>
```



- - -
&#9665; [Scripting](scripting.md)
&nbsp;&nbsp;&nbsp;&nbsp; &#8801; [Table of Contents](README.md#datasource)
&nbsp;&nbsp;&nbsp;&nbsp; [Resource Bundle](message.md) &#9655;
