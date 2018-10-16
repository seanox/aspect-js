#Content

TODO:
- basiert auf Datasource
- Generierung von Inhalten durch XML-Transformation
- ist mehrsprachig, die Sprache wird durch die Spracheinstellung vom Browser automatisch ausgewählt
- Ablage der Daten: ./data/<iso-code>/... (hier werden xml und xslt abgelegt) 
- Festlegung der unterstützten Sprachen: ./data/locales.xml + default
  <?xml version="1.0" encoding="ISO-8859-1"?>
  <locales>
    <de>
      ...
    </de>
    <en default="true">
      ...
    </en>
- der Inhalt, wenn er als Output im DOM angezeigt wird kann mit der Expression Language kombiniert werden
  <?xml version="1.0" encoding="ISO-8859-1"?>
  <error>
    <content>
      <![CDATA[
      <p>
        Es ist ein unerwarteter Fehler aufgetreten.<br>
        Bitte laden Sie die Seite erneut und versuchen Sie es noch einmal.<br>
        Der Fehler {{error.number}} wurde automatisch beim Support von seanox.de erfasst.
      </p>
      ]]>
    </content>
  </error>        
