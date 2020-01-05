[DataSource](datasource.md) | [Inhalt](README.md#resource-bundle-i18n) | [Model View Controler](mvc.md)
- - -

# Resource Bundle (Messages / i18n)

(Resource)Messages ist eine statische Erweiterung der
[DataSource](datasource.md) für Internationalisierung, Lokalisierung (i18n)
sowie für Mandanten bezogene Texte.  
Die Implementierung basiert auf einer Menge von Schlüssel-Wert-Paaren in Form
von Label-Elementen, die in der Datei `locales.xml` im DataSource-Verzeichnis
definiert werden.

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

Die Elemente für die unterstützten Sprachen sind in dieser Datei in Locales
organisiert. Locales sind eine Menge von unterstützten Ländercodes. In jedem
Ländercode werden die Schlüssel-Wert-Paare als Label-Einträge festgelegt.  

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

Die Auswahl der Sprache erfolgt automatisch auf der Grundlage der
Spracheinstellung vom Browser. Wenn die dort eingestellte Sprache nicht
unterstützt wird, wird die als `default` deklarierte Sprache verwendet.

Nach dem Laden der Anwendung ist Messages als assosiatives Array verfügbar und
kann im JavaScript direkt und im Markup per Expression Language verwendet
werden.

```javascript
Messages["contact.title"];
```

```html
<h1 output="{{Messages['contact.title']}}"/>
```

Zur Laufzeit kann die Sprache per JavaScript über das Gebietsschema geändert
werden.  
Akzeptiert werden nur Gebietsschemen, die mit der DataSource verfügbar sind,
andere Angaben führen beim Methoden-Aufruf zu einem Fehler.

```javascript
DataSource.localize("de");
```

Die aktuell verwendete Sprache kann als Gebietsschema per `DataSource.locale`
abgefragt werden.  
Alle verfügbaren Sprachen liefert `DataSource.locales` als Array von
Gebietsschemen, das mit dem als default deklarierte Gebietsschema beginnt.


- - -

[DataSource](datasource.md) | [Inhalt](README.md#resource-bundle) | [Model View Controler](mvc.md)
