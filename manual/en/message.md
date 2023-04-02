[DataSource](datasource.md) | [TOC](README.md#resource-bundle-i18nl10n) | [Model View Controller](mvc.md)
- - -

# Resource Bundle (Messages/i18n/l10n)

(Resource)Messages is a static [DataSource](datasource.md) extension for
internationalization (i18n), localization (l10n) and client-related texts. The
implementation is based on a set of key-value or label-value data which is
stored in the `locales.xml` in the DataSource directory.

```
+ data
  + de...
  + en...
  - locales.xml
+ modules
+ resources
- index.html
```

The elements for the supported languages, locales and/or clients are organized
as sets in this file. In each set, the key-value pairs are defined as label
entries. Clients are used like locales and are therefore not explicitly
mentioned in the further description. 

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

After loading the application, Messages are available as an associative array
and can be used in JavaScript directly and in the Markup as Expression Language.

```javascript
const title = Messages["contact.title"];
```
```javascript
const title = messages.contact.title;
```
```html
<h1 output="{{Messages['contact.title']}}"/>
```
```html
<h1 output="{{messages.contact.title}}"/>
```

Messages can also be customized at runtime using the `Messages.customize(label,
    ...values)` method. For this purpose, the label is used as a template with
placeholders, which are then filled. The values are passed as a list in the form
of the spread notation. The placeholders are then a number with reference to the
position in the value list, whose value is then inserted for the placeholder.

```xml
<?xml version="1.0"?>
<locales>
  <en default="true">
    <label key="welcome">
      Welcome {0} {1}, you are logged in as {2}.    
    </label>        
  </en>
</locales>
```
```html
<h1 output="{{Messages.customize('messages.welcome', 'Mr.', 'Doe', 'with extended user rights')}}"/>
```
```javascript
const welcome = Messages.customize("messages.welcome", "Mr.", "Doe", "with extended user rights");
```

Placeholders can be used multiple times. Excess placeholders or placeholders for
which no value has been specified are removed from the generated message.

Furthermore, the language and locale for Message can be changed via JavaScript
at runtime. Only locales that are available with the DataSource are accepted,
other specifications cause an error when calling the method.

```javascript
DataSource.localize("de");
```

The currently used language can be retrieved via `DataSource.locale`. All
available languages are returned by `DataSource.locales` as an array that starts
with the as default declared language.


- - -

[DataSource](datasource.md) | [TOC](README.md#resource-bundle) | [Model View Controller](mvc.md)
