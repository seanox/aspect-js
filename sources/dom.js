/**
 *  Dom stellt erweiterte Methoden fuer den Zugriff auf das DOM bereit.
 *  
 *  Dom 1.0 20150123
 *  Copyright (C) 2015 Seanox Software Solutions
 *  Alle Rechte vorbehalten.
 *
 *  @author  Seanox Software Solutions
 *  @version 1.0 20150123
 */
if (typeof(Dom) == 'undefined') {

    /** Konstruktor, richtet das Dom-Objekt ein. */
    Dom = function() {
    };

    /**
     *  Maskiert alle RegExp-spezifischen Steuerzeichen.
     *  @param  text zu maskierender Text
     *  @return der maskierte Text
     */
    Dom.escapeRegExp = function(text) {
        return text ? text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") : text;
    };

    /**
     *  Ermittelt alle Elemente zum angegeben Tag im uebgebenen Objekt.
     *  Optional kann ein Filter fuer die Element-Id angegeben werden.
     *  @param  object zu durchsuchendes Objekt
     *  @param  tag    gesuchter Tag-Name (reg. Ausd.)
     *  @param  filter optional gesuchte Element-Id (reg. Ausd.)
     *  @param  clone  optional true zur Rueckgabe von Kopien
     *  @return die ermittelten Elemente als Array, sonst null
     */
    Dom.getElementsByTagName = function(object, tag, filter, clone) {

        var entry;
        var loop;
        var nodes;
        var result;

        result = new Array();

        if (!object || !object.childNodes)
            return result;
        if (tag != null && !(tag instanceof RegExp))
            tag = new RegExp("^\\s*" + Dom.escapeRegExp(tag) + "\\s*$", "i");
        if (filter != null && !(filter instanceof RegExp))
            filter = new RegExp("^\\s*" + Dom.escapeRegExp(filter) + "\\s*$", "i");

        for (loop = 0; loop < object.childNodes.length; loop++) {

            entry = object.childNodes[loop];

            if (tag != null)
                tag = new RegExp(tag);
            if (filter != null)
                filter = new RegExp(filter);
            if ((tag == null || tag.test(entry.nodeName))
                    && (filter == null || (entry.getAttribute && filter.test(entry.getAttribute("id")))))
                result[result.length] = clone ? entry.cloneNode(true) : entry;

            if (entry.childNodes) {
                nodes = Dom.getElementsByTagName(entry, tag, filter, clone);
                if (nodes) result = result.concat(nodes);
            }
        }

        return result.length <= 0 ? null : result;
    };

    /**
     *  Ermittelt ein Element zum angegeben Tag oberhalbt vom uebgebenen Objekt.
     *  Optional kann ein Filter fuer die Element-Id angegeben werden.
     *  @param  object zu durchsuchendes Objekt
     *  @param  tag    gesuchter Tag-Name (reg. Ausd.)
     *  @param  filter optional gesuchte Element-Id (reg. Ausd.)
     *  @param  clone  optional true zur Rueckgabe von Kopien
     *  @return die ermittelten Elemente als Array, sonst null
     */
    Dom.getParentElementByTagName = function(object, tag, filter, clone) {

        if (tag != null && !(tag instanceof RegExp))
            tag = new RegExp("^\\s*" + Dom.escapeRegExp(tag) + "\\s*$", "i");
        if (filter != null && !(filter instanceof RegExp))
            filter = new RegExp("^\\s*" + Dom.escapeRegExp(filter) + "\\s*$", "i");

        while (object != null && object.parentNode && object.parentNode != object) {

            object = object.parentNode;

            if (tag != null)
                tag = new RegExp(tag);
            if (filter != null)
                filter = new RegExp(filter);
            if (object != null && (tag == null || tag.test(object.nodeName))
                    && (filter == null || (object.getAttribute && filter.test(object.getAttribute("id")))))
                return clone ? object.cloneNode(true) : object;
        }

        return null;
    };

    /**
     *  Rueckgabe vom Markup des uebergebenen Objekts.
     *  @param  object auszulesendes Objekt
     *  @return die Markup vom uebergebenen Objekt
     */
    Dom.getOuterHTML = function(object) {

        var element;

        if (!object) return null;

        element = document.createElement("div");
        element.appendChild(object);

        return element.innerHTML;
    };

    /**
     *  Fuegt eine oder mehrere CSS-Klassen beim angegebenen Objekt hinzu.
     *  Zur Angabe mehrerer Klassen werden diese durch Leerzeichen getrennt oder
     *  als Array uebergeben. 
     *  @param object HTML-Element
     *  @param css    CSS-Klasse(n)
     */
    Dom.addCssClass = function(object, css) {
        
        var loop;
            
        if (!css) return;
        if (!css.constructor || css.constructor !== Array)
            css = new Array(css);
        else if (typeof css === "string")
            css = css.split(" ");
        
        for (loop = 0; loop < css.length; loop++) {
            if (object.className.match(new RegExp("(?:^|\\s)" + css[loop] + "(?:\\s|$)", "i")))
                continue;
            object.className += " " + css[loop];
        }
        
        object.className = object.className.replace(new RegExp("\\s+", "g"), ' ');
        object.className = object.className.replace(/^\s+|\s+$/g, '');
    };

    /**
     *  Entfernt eine oder mehrere CSS-Klassen beim angegebenen Objekt.
     *  Zur Angabe mehrerer Klassen werden diese durch Leerzeichen getrennt oder
     *  als Array uebergeben. 
     *  @param object HTML-Element
     *  @param css    CSS-Klasse(n)
     */
    Dom.removeCssClass = function(object, css) {

        var loop; 
        
        if (!css) return;
        if (!css.constructor || css.constructor !== Array)
            css = new Array(css);
        else if (typeof css === "string")
            css = css.split(" ");

        for (loop = 0; loop < css.length; loop++)
            object.className = object.className.replace(new RegExp("(?:^|\\s)" + css[loop] + "(?:\\s|$)", "i"), " ");
        
        object.className = object.className.replace(new RegExp("\\s+", "g"), ' ');
        object.className = object.className.replace(/^\s+|\s+$/g, '');
    };

    /**
     *  Rueckgabe true, wenn eine oder mehrere CSS-Klassen dem angegebenen
     *  Objekt zugewiesen sind. Zur Angabe mehrerer Klassen werden diese durch
     *  Leerzeichen getrennt oder als Array uebergeben. 
     *  @param  object HTML-Element
     *  @param  css    CSS-Klasse(n)
     *  @return true, wenn eine oder mehrere CSS-Klassen dem angegebenen Objekt
     *          zugewiesen sind
     */
    Dom.existCssClass = function(object, css) {

        var loop; 
        
        if (!css) return false;
        if (!css.constructor || css.constructor !== Array)
            css = new Array(css);
        else if (typeof css === "string")
            css = css.split(" ");

        for (loop = 0; loop < css.length; loop++)
            if (!object.className.match(new RegExp("(?:^|\\s)" + css[loop] + "(?:\\s|$)", "i"))
                    return false;
        
        return loop > 0;
    };

    /**
     *  Ermittelt eine CSS-Definition.
     *  Optional kann diese mit der Option remove entfernt werden.
     *  @param name   Name der CSS-Definition
     *  @param remove optional true, zum Loeschen der CSS-Definition
     */
    Dom.getCssRule = function(name, remove) {

        var loop;
        var index;
        var rule;
        var style;

        name = name.toLowerCase();
        
        if (document.styleSheets) {
        
            for (loop = 0; loop < document.styleSheets.length; loop++) {

                style = document.styleSheets[loop];
                index = 0;
                rule  = false;
                
                do {
                    try {rule = style.cssRules ? style.cssRules[index] : style.rules[index];
                    } catch (exception) {
                        //keine Fehlerbehandlung vorgesehen
                    }
                
                    if (rule)  {
                        if (rule.selectorText.toLowerCase() == name) {
                            if (remove) {
                                if (style.cssRules)
                                    style.deleteRule(index);
                                else style.removeRule(index);
                                return true;
                            } else return rule;
                        }
                    }
                    
                    index++;
                    
                } while (rule);
            }
       }
       
       return false;
    };

    /**
     *  Entfernt eine CSS-Definition.
     *  @param name Name der CSS-Definition
     */
    Dom.removeCssRule = function(name) {
        return Dom.getCSSRule(name, true);
    };

    /**
     *  Erstellt eine neue CSS-Definition.
     *  @param  name  Name der CSS-Definition
     *  @param  style CSS-Definition
     *  @Return die Instanz der erstellten CSS-Definition
     */
    Dom.addCssRule = function(name, style) {

        if (document.styleSheets && !Dom.getCSSRule(name)) {                        
            if (document.styleSheets[0].addRule)
                document.styleSheets[0].addRule(name, style, 0);
            else document.styleSheets[0].insertRule(name + (style || ' {}'), 0);
        }                           

        return Dom.getCSSRule(name);
    };

    /**
     *  Formatiert das Schluesselwort fuer CSS-Attribute.
     *  @param  key Schluesselwort
     *  @return das formatierte Schluesselwort fuer CSS-Attribute
     */
    Dom.formatCssKey = function(key) {

        return key.replace(/^(-\w)/, function(match) {
            return match.substring(1).toLowerCase();
        }).replace(/(-\w)/g, function(match) {
            return match.substring(1).toUpperCase();
        });
    };

    /**
     *  Ermittelt den angewandten CSS-Style fuer ein Objekt.
     *  @param  object Objekt
     *  @return die ermittelten CSS-Style
     */
    Dom.computeCssStyles = function(object) {

        var result;
        var style;
        var value;
        var loop;
        
        result = new Object();
        
        if (window.getComputedStyle) {
        
            style = window.getComputedStyle(object, null);
            for (loop = 0; loop < style.length; loop++) {
                value = style.getPropertyValue(style[loop]);
                if (value != "") result[Dom.formatCssKey(style[loop])] = value;
            }

        } else if (object.style || object.currentStyle) {
        
             style = object.currentStyle || object.style;
             for (var key in style) {
                 value = style[key];
                 if (value != "") result[Dom.formatCssKey(key)] = value;
             }
        }    

        return result;
    };

    /**
     *  Uerbertraegt den CSS-Style von einem Objet auf ein anderes.
     *  @param source      Quell-Objekt
     *  @param destination Ziel-Objekt
     */
    Dom.copyCssStyles = function(source, destination) {

        var style;
        
        style = Dom.computeCssStyles(source);
        for (var key in style) {
            if (!style.hasOwnProperty(key)) continue;
            destination.style[key] = style[key];
        }
    };  
};