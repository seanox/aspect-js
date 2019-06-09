[DataSource](datasource.md) | [Inhalt](README.md#resource-bundle) | [Model View Controler](mvc.md)
- - -

# Resource Bundle (Messages)

(Resource)Messages ist eine statische Erweiterung der
[DataSource](datasource.md) f�r Internationalisierung und Lokalisierung.  
Die Implementierung basiert auf einer Menge von Schl�ssel-Wert-Paaren in Form
von Label-Elementen, die in der Datei `locales.xml` in der DataSource
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

Die Elemente f�r die unterst�tzten Sprachen sind in dieser Datei in Locales
organisiert. Locales sind eine Menge von unterst�tzten L�ndercodes. In jedem
L�ndercode werden die Schl�ssel-Wert-Paare als Label-Eintr�ge festgelegt.  

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
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
unterst�tzt wird, wird die als "Standard" deklarierte Sprache verwendet.

Nach dem Laden der Anwendung ist Messages als assosiatives Array verf�gbar und
kann im JavaScript direkt und im Markup per Expression Language verwendet
werden.

```javascript
Messages["contact.title"];
```

```html
<h1 output="{{Messages['contact.title']}}"/>
```

Zur Laufzeit kann die Sprache per JavaScript �ber das Gebietsschema ge�nder
werden.  
Akzeptiert werden nur Gebietsschemen, die mit der DataSource verf�gbar sind,
andere Angaben f�hren beim Methoden-Aufruf zu einem Fehler.

```javascript
DataSource.localize("de");
```


- - -

[DataSource](datasource.md) | [Inhalt](README.md#resource-bundle) | [Model View Controler](mvc.md)
