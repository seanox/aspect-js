[DataSource](datasource.md) | [Inhalt](README.md#resource-bundle-i18nl10n) | [Model-View-Controller](mvc.md)
- - -

# Resource-Bundle (Messages/i18n/l10n)

(Resource)Messages ist eine statische Erweiterung der
[DataSource](datasource.md) f&uuml;r Internationalisierung (i18n), Lokalisierung
(l10n) sowie f&uuml;r Mandanten bezogene Texte. Die Implementierung basiert auf
einer Menge von Schl&uuml;ssel-Wert-Paaren in Form von Label-Elementen, die in
der Datei `locales.xml` im DataSource-Verzeichnis definiert werden.

```
+ data
  + de...
  + en...
  - locales.xml
+ modules
+ resources
- index.html
```

Die Elemente f&uuml;r die unterst&uuml;tzten Sprachen, Gebietsschematas und/oder
Mandanten werden in dieser Datei als Sets organisiert. In jedem Set werden die
Schl&uuml;ssel-Wert-Paare als Label-Eintr&auml;ge festgelegt. Mandanten werden
wie Gebietsschemen verwendet und werden daher in der weiteren Beschreibung nicht
explizit erw&auml;hnt.

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
unterst&uuml;tzt wird, wird die als `default` deklarierte Sprache verwendet.

Nach dem Laden der Anwendung ist Messages als assosiatives Array verf&uuml;gbar
und kann im JavaScript direkt und im Markup per Expression Language verwendet
werden.

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

Messages lassen sich zur Laufzeit mit der Methode `Messages.customize(label,
    ...values)` auch individualisiert nutzen. Dazu wird das Label als Template
mit Platzhaltern genutzt, die dann bef&uuml;llt werden. Die Werte werden als
Liste in Form der Spread-Notation &uuml;bergeben. Die Platzhalter sind dann eine
numerische Angabe mit Bezug auf die Position in der Werte-Liste, deren Wert dann
f&uuml;r den Platzhalter eingef&uuml;gt wird.

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

Platzhalter lassen sich mehrfach verwenden. &Uuml;berz&auml;hlige, bzw.
Platzhalter, zu denen kein Wert festgelegt wurde, werden aus der erzeugten
Message entfernt.

Des Weiteren lassen sich für Message die Sprache und Gebietsschema per
JavaScript zur Laufzeit &auml;ndern. Akzeptiert werden dabei nur Gebietsschemen,
die mit der DataSource verf&uuml;gbar sind, andere Angaben f&uuml;hren beim
Methoden-Aufruf zu einem Fehler.

```javascript
DataSource.localize("de");
```

Die aktuell verwendete Sprache kann als Gebietsschema per `DataSource.locale`
abgefragt werden. Alle verf&uuml;gbaren Sprachen liefert `DataSource.locales`
als Array von Gebietsschemen, das mit dem als default deklarierten Gebietsschema
beginnt.


- - -

[DataSource](datasource.md) | [Inhalt](README.md#resource-bundle) | [Model-View-Controller](mvc.md)
