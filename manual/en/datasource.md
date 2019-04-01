#Datasource

DataSource is a NoSQL approach to data storage based on XML data in combination
with multilingual data separation, optional aggregation and transformation. A
combination of the approaches of a read only database and a CMS.

DataSource is based on static data. Therefore, the implementation uses a cache
to minimize network access.
 
The data is queried with XPath, the result can be concatenated and aggregated
and the result can be transformed with XSLT.

_Why the term NoSQL is used?_

NoSQL has become a synonym and meanwhile describes an undefined data source with
an undefined data model and a command set that differs from SQL. There is no
standard for NoSQL, but there is a data source that can be functionally used
similar to SQL.


## Contents Overview
* [Data Storage](#data-storage)
* [Locales](#locales)
* [Locator](#locator)
* [fetch](#fetch)
* [transform](#transform)
* [collect](#collect)


## Data Storage

By default, the data storage is located as `./data` relative to the application
directory. The data storage contains the supported languages as subdirectories.
Each language contains its own content. Redundant data/fiels and more
subdirectories corresponds to the concept. The DataSource primarily uses XML
files. Optionally, a transformation with XSLT is possible.

```
+- data
|  |
|  +- de
|  |  |
|  |  +- fileA.xml
|  |  +- fileA.xslt
|  |  +- directory...
|  |  ...
|  |
|  +- en
|  |  |
|  |  +- fileA.xml
|  |  +- fileA.xslt
|  |  +- directory...
|  |  ...
|  |
|  ...
|  |  
|  +- locales.xml
|
+- modules
+- resources
+- index.html
```

The data storage can be changed via `DataSource.DATA`. 


## Locales

The supported languages are organized in locales in the `locales.xml` file,
which contains all supported languages as a set.

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<locales>
  <de/>
  <en default="true"/>
</locales>
```

The language is selected automatically on the basis of the language setting of
the browser. If the language set there is not supported, the language declared
as `default` is used.

The available language information can be queried with the property
`DataSource.locale`.


## Locator

Files are defined by locator.  
A locator is a URL (`xml://...` or `xslt://...`) that is used absolute and
relative to the DataSource data storage, but does not contain a locale (language
specification) in the path. The locale is determined automatically for the
language setting of the browser, or if this is not supported, the standard from
the `locales.xml` in the DataSource data storage is used.

Each locator starts with a protocol. The protocol defines the file extension of
the files in the data storage.

```
xml://fileA -> ./data/en/fileA.xml
xsl://fileA -> ./data/en/fileA.xsl

xsl://foo/fileA -> ./data/en/foo/fileA.xsl
```

## fetch

TODO:


## transform

TODO:


## collect

TODO:
