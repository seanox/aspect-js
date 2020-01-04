[DataSource](datasource.md) | [TOC](README.md#resource-bundle-i18n) | [Model View Controler](mvc.md)
- - -

# Resource Bundle (Messages / i18n)

(Resource)Messages is a static [DataSource](datasource.md) extension for
internationalization, localization (i18n) and customer-related texts.  
The implementation is based on a set of key-value or label-value data which is
stored in the `locales.xml` in the DataSource directory.

```
+- data
|  |
|  +- de...
|  +- en...
|  +- locales.xml
|
+- modules
+- resources
+- index.html
```

The elements for the supported languages are organized in locales in this file.
Locales is a set of supported country codes. In each country code, the key
values are recorded as label entries.  

```xml
<?xml version="1.0"?>
<locales>
  <de>
    <label key="contact.title" value="Kontakt"/>
    <label key="contact.development.title">Entwicklung</label>
    ...
  </de>
  <en default="true">
    <label key="contact.title" value="Contact"/>
    <label key="contact.development.title">Development</label>
    ...
  </en>
</locales>
```

The language is selected automatically on the basis of the language setting of
the browser. If the language set there is not supported, the language declared
as `default` is used.

After loading the application, Messages are available as an assosiative array
and can be used in JavaScript directly and in the Markup as Expression Language.

```javascript
Messages["contact.title"];
```

```html
<h1 output="{{Messages['contact.title']}}"/>
```

At runtime, the language can be changed via JavaScript with the locale.  
Only locales that are available with the DataSource are accepted. Other values
cause an error when the method is called.

```javascript
DataSource.localize("de");
```

The currently used language can be retrieved via `DataSource.locale`.  
All available languages are returned by `DataSource.locales` as an array that
starts with the as default declared language.


- - -

[DataSource](datasource.md) | [TOC](README.md#resource-bundle) | [Model View Controler](mvc.md)
