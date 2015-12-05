/**
 *  LIZENZBEDINGUNGEN - Seanox Software Solutions ist ein Open-Source-Projekt,
 *  im Folgenden Seanox Software Solutions oder kurz Seanox genannt. Diese
 *  Software unterliegt der Version 2 der GNU General Public License.
 *
 *  Seanox Aspect, Aspect Oriented Publishing
 *  Copyright (C) 2015 Seanox Software Solutions
 *
 *  This program is free software; you can redistribute it and/or modify it
 *  under the terms of version 2 of the GNU General Public License as published
 *  by the Free Software Foundation.
 *
 *  This program is distributed in the hope that it will be useful, but WITHOUT
 *  ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 *  FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
 *  more details.
 *
 *  You should have received a copy of the GNU General Public License along
 *  with this program; if not, write to the Free Software Foundation, Inc.,
 *  51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 *
 *
 *      BESCHREIBUNG
 *
 *  Resources stellt eine Label-Value-Map und einen Praeprozessor fuer
 *  mehrsprachige Ausgaben durch die Verwendung von Platzhalter im Format $label
 *  bereit. Das Ersetzen erfolgt automatisch mit Laden der Seite und basiert auf
 *  der Spracheinstellung des Browsers. Resources werden als Skript-Block vom
 *  Typ "text/resources" angelegt. Das Attribut "lang" definiert die
 *  entsprechende Sprache. Ist zur Spracheinstellung des Browsers keine passende
 *  Resource vorhanden, wird das erste Resource-Skript als Standard verwendet.
 *    
 *  Resourcen werden per Label|Value zugewiesen, wozu verschiedene Symbole bei
 *  der Zuweisung unterstuetzt werden:
 *  
 *    =  setzt den Wert zum Schluessel
 *    +  erweitert einen bestehenden Wert eines Schluessel
 *    
 *    
 *  Beipiel:
 *    
 *  <script type="text/resources" lang="en">
 *    TextCancel = Cancel
 *    TextIgnore = Ignore
 *    TextRetry  = Repeat
 *    TextYes    = Yes
 *    TextNo     = No
 *    TextOk     = Ok
 *    
 *    DialogOkLabel     = ${TextOk}
 *    DialogYesLabel    = ${TextYes}
 *    DialogNoLabel     = ${TextNo}
 *    DialogRetryLabel  = ${TextRetry}
 *    DialogIgnoreLabel = ${TextIgnore}
 *    DialogCancelLabel = ${TextCancel}
 *    
 *    ErrorMessage = An unexpected fatal error has occurred.\n\n
 *                 + \t${0}\n\nThe application has stopped and requires a restart.
 *  </script>
 *  
 *  
 *      Abhaengigkeiten:
 *      
 *  runtime.js
 *  
 *  Resources 1.1 20150228
 *  Copyright (C) 2015 Seanox Software Solutions
 *  Alle Rechte vorbehalten.
 *
 *  @author  Seanox Software Solutions
 *  @version 1.1 20150228
 */
if (typeof(Resources) == 'undefined') {
    
    /** Konstruktor, richtet das Resources-Objekt ein. */
    Resources = function () {
    };

    /** assoziatives Array mit Labels und Values */
    Resources.map;

    /** Konstante fuer den Verarbeitungsstatus Unbekannt */
    Resources.STATUS_UNKNOW = 0;

    /** Konstante fuer den Verarbeitungsstatus Laden */
    Resources.STATUS_LOAD = 1;
    
    /** Konstante fuer den Verarbeitungsstatus Ausfuehrung */
    Resources.STATUS_PERFORM = 2;

    /** Konstante fuer den Verarbeitungsstatus Fertig */
    Resources.STATUS_COMPLETE = 3;

    /** aktueller Verarbeitungsstatus */
    Resources.status = Resources.STATUS_UNKNOW;
    
    /** interner Zaehler fuer die asynchrone Verarbeitungstiefe */
    Resources.count = 0;

    /**
     *  Einsprung zur Einrichtung der Resources. 
     *  Laed die Ressourcen zur Spracheinstellung des Browsers.
     *  Resources werden als Skript-Block vom Typ "text/resources" angelegt.
     *  Das Attribute "lang" definiert die Sprache. Ist zur Spracheinstellung
     *  des Browsers keine passende Resource vorganden, wird das erste
     *  Resource-Skript als Standard verwendet.
     *  @param event Event
     */
    Resources.onLoad = function(event) {
        
        var language;
        var scripts;
        var loop;
        var content;
        
        Resources.status = Resources.STATUS_LOAD;

        Resources.map = new Object();

        language = (navigator.language || navigator.userLanguage).toLowerCase();
        scripts  = document.querySelectorAll("script[type='text/resources'][lang]");
        
        for (loop = 0, content = null; scripts && loop < scripts.length; loop++) {
            if (content === null)
                content = scripts[loop].innerHTML;
            if (scripts[loop].getAttribute("lang").toLowerCase() != language)
                continue;
            content = scripts[loop].innerHTML;
            break;
        }

        Resources.parse(content);
        Resources.prepareDocument();
    };

    /** Laed die Definition von Ressourcen. */
    Resources.parse = function(content) {
        
        var resource;
        
        if (content) {
            
            Resources.status = Resources.STATUS_PERFORM;
            
            content.replace(/^.*$/gm, function(match) {
                match.replace(/^\s*([\.\-_a-z0-9]*)\s*([\+=])\s{0,1}(.*?)\s*$/i, function(match, key, mode, value) {
                    resource = key || resource;            
                    if (!Resources.map[resource] || mode == "=")
                        Resources.map[resource] = "";            
                    Resources.map[resource] += value;
                });
            });

            //interne Referenzen werden aufgeloest    
            for (var key in Resources.map)
                Resources.map[key] = Resources.map[key].replace(/\$\{(\w+)\}/g, function(match, key) {
                    return Resources.map[key] || match;
                });
        }
        
        Resources.status = Resources.STATUS_COMPLETE;
    }

    /**
     *  Loest die Platzhalter im angegebenen Label mit den Werten der uebgebenen
     *  Werteliste auf. Liegen in einem Label mehr Platzhalter als Werte vor,
     *  werden die ueberschuessigen Platzhalter entfernt.
     *  @param  label  Label
     *  @param  values Werte
     *  @return das angegebene Label mit aufgeloesten Platzhaltern
     */
    Resources.resolve = function(label, values) {

        label = Resources.map[label] || "";
        label = label.replace(/\\.+/ig, function(match) {
            return eval("\"" + match + "\"");});
        label = label.replace(/\$\{(\d+)\}/g, function(match, index) {
            return values && index < values.length ? values[index] : "";});

        return label;
    };
    
    /**
     *  Ersetzt asynchrone alle Resources-Platzhalter im Unterelement.
     *  @param note Unterelement
     *  @param wait Option beim asynchronen Aufruf
     */
    Resources.prepareNode = function(node, wait) {
        
        var loop;
        var attribute;
        var value;

        if (node.nodeType != 1 && node.nodeType != 3)
            return;
        
        if (!wait) {window.setTimeout(function() {
            Resources.prepareNode(node, true);}, 0); return;}

        for (loop = 0; node.childNodes && loop < node.childNodes.length; loop++) {
            Resources.count++;    
            Resources.prepareNode(node.childNodes[loop]);
        }
        
        if (node.nodeType == 3)
            node.nodeValue = Resources.prepare(node.nodeValue);

        for (loop = 0; node.attributes && loop < node.attributes.length; loop++) {
            attribute = node.attributes[loop];
            if (!attribute.value || attribute.value.indexOf("$") < 0)
                continue;
            attribute.value = Resources.prepare(attribute.value);
        }
        
        if (Resources.count-- < 0)
            Resources.status = Resources.STATUS_COMPLETE;
    }
    
    /** Ersetzt alle Resources-Platzhalter im Dokument(Body). */
    Resources.prepareDocument = function() {
       
        if (Resources.status != Resources.STATUS_COMPLETE) {
            window.setTimeout(Resources.prepareDocument, 25);
            return;
        }
        
        Resources.status = Resources.STATUS_PERFORM;
        Resources.prepareNode(document.body);
    };

    /** 
     *  Ersetzt alle Resources-Platzhalter im Content.
     *  @param  content Content
     *  @return der ersetzte Content
     */
    Resources.prepare = function(content) {
        return content.replace(/\$(\w+)\b/g, function(match, key) {
            return Resources.map[key] || match;
        });
    };

    /**
     *  Rueckgabe von true, wenn Resources komplett geladen ist.
     *  @return true, wenn Resources komplett geladen ist
     */
    Resources.completed = function() {
        return Resources.status == Resources.STATUS_COMPLETE;
    };

    Runtime.registerEvent(window, "load", function(event) {
        Resources.onLoad(event);});    
};