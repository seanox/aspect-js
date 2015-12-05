/**
 *  Composite verbindet HTML-Elemente und JavaScript-Objekte zu statischen
 *  objekt- und ereignisbasierten Komponenten. Dazu werden ein HTML-Element mit
 *  dem Attribut "id" und der Style-Klasse "composite" und dessen Unterelementen
 *  mit Attribut "id" oder "name" einem JavaScript-Objekt zugeordnet. Alternativ
 *  kann die Zuordrnung auch mit Composite.bind(context, binding); vorgenommen
 *  werden. Das Argument "binding" ist dabei optional, wenn namentliche
 *  Unterschiede zwischen HTML-Element und JavaScript-Objekt bestehen. In diesem
 *  Fall wird mit "binding" das zu verwendende JavaScript-Objekt angegeben.     
 *  
 *  
 *      Beispiel:
 *  
 *  <form id="Example" class="composite">
 *    <textarea id="Text"/>
 *    <button id="Button"/>
 *  </form>
 *   
 *  Bei der Zuordnung werden alle Unterelemente mit dem Attribut "id" als
 *  statisches Feld beim JavaScript-Objekt eingehangen. Gleichnamige
 *  Unterelemente werden dabei als Array abgebildet.
 *    
 *  Example = function();
 *  Example.button;
 *  Example.text;
 *  
 *  Alle bekannten Events werden fuer das JavaScript-Objekt und fuer die
 *  ermittelten HTML-Elemente registriert, sofern die erforderlichen statischen
 *  Methoden implementiert wurden. Die Methoden beginnen dabei immer mit "on"
 *  gefolgt von der ID des HTML-Elements. Dabei wird unabhaengig von der
 *  originalen Schreibweise immer mit einem Grossbuchstaben begonnen.
 *  Gleichnamige Unterelemente besitzen dabei eine Event-Methode. Das
 *  entsprechende Unterelemente ist dann ueber das Event-Argument zugaenglich.
 *  
 *  
 *      Beispiel:
 *  
 *  Example.onLoad = function(event);
 *  Example.onResize = function(event);
 *  ...
 *  Example.onButtonClick = function(event);
 *  Example.onTextChange = function(event);
 *  ...
 *  
 *  
 *      Abhaengigkeiten:
 *      
 *  runtime.js
 *  
 *  Composite 1.3.1 20150817
 *  Copyright (C) 2015 Seanox Software Solutions
 *  Alle Rechte vorbehalten.
 *
 *  @author  Seanox Software Solutions
 *  @version 1.3.1 20150817 
 */
if (typeof(Composite) == 'undefined') {
    
    /** Konstruktor, richtet das Composite-Objekt ein. */
    Composite = function() {
    };

    Composite.complete;

    /** assoziatives Array mit registrieten Objekten */
    Composite.objects;
    
    /** interner Zaehler fuer registriete Objekte */
    Composite.count;

    /** Liste der bekannten Events */
    Composite.events = " click contextmenu dblclick mousedown mouseenter mouseleave mousemove mouseover mouseout mouseup"
                     + " keydown keypress keyup"
                     + " abort beforeunload error hashchange load pageshow pagehide resize scroll unload"
                     + " blur change focus focusin focusout input invalid reset search select submit"
                     + " drag dragend dragenter dragleave dragover dragstart drop"
                     + " copy cut paste"
                     + " afterprint beforeprint"
                     + " abort canplay canplaythrough durationchange emptied ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange seeked seeking stalled suspend timeupdate volumechange waiting"
                     + " animationend animationiteration animationstart"
                     + " transitionend"
                     + " error message open"
                     + " message mousewheel online offline popstate show storage toggle wheel"
                     + " touchcancel touchend touchmove touchstart";

    /**
     *  Registriert ein Ereignis beim angegebenen Objekt.
     *  @param object Bezugsobjekt
     *  @param event  Ereignis als Text
     *  @param call   Funktionsaufruf
     */
    Composite.registerEvent = function(object, event, call) {
        Runtime.registerEvent(object, event.toLowerCase(), call);
    };

    /**
     *  Registriert die Ereignisse zu einen Context-Element.
     *  @param context Bezugsobjekt
     *  @param element Element
     *  @param binding JavaScript-Objekt zur Anbindung
     *  @param wait    Option beim asynchronen Aufruf
     */
    Composite.registerElementEvents = function(context, element, binding, wait) {
        
        var object;
        var node;
        var events;
        var label;
        
        if (!wait) {
            window.setTimeout(function() {
                Composite.registerElementEvents(context, element, binding, true);}, 0);
            return;
        }

        Composite.objects = Composite.objects || new Array();
        
        events = Composite.events.replace(/([^\s])\s+/g, '$1|');
        events = "(" + events.replace(/^\s+|\s+$/g, '') + ")";
        
        object  = binding;
        node    = element;
        element = element.getAttribute("id") || element.getAttribute("name");
        element = element.charAt(0).toUpperCase() + element.substring(1);
        
        if (!Composite.count) Composite.count = 0;
        label = element + ":" + (Composite.count++);
        
        for (var entry in object) {
            
            if ((typeof object[entry]) !== "function")
                continue;
            if (!entry.match(new RegExp("^on" + element + "[A-Z][a-zA-Z]+$")))
                continue;
            
            entry.replace(new RegExp("^on" + element + events + "$", "i"), function(match, event) {
                
                var hash = (context + "\0" + label + "\0" + event).toLowerCase();
                if (Composite.objects.indexOf(hash) >= 0)
                    return match;            
                Composite.objects.push(hash);
                Composite.registerEvent(node, event, object[entry]);
                return match;
            });
        }
    };
    
    /**
     *  Maskiert alle RegExp-spezifischen Steuerzeichen.
     *  @param  text zu maskierender Text
     *  @return der maskierte Text
     */
    Composite.escapeRegExp = function(text) {
        return text ? text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") : text;
    };
    
    /** 
     *  Bindet ein Composite.
     *  @param context Kontext, Name vom HTML-Element und JavaScript-Objekt
     *  @param binding akternatives JavaScript-Objekt bei namentlichen
     *                 Unterschiede zwischen HTML-Element und JavaScript-Objekt  
     */
    Composite.bind = function(context, binding) {
        
        var element;
        var object;
        var events;
        var nodes;
        var loop;
        var exists;
        var axis;
        var composite;
        
        if (!Composite.complete) {
            window.setTimeout(function() {
                Composite.bind(context, binding);}, 25);
            return;
        }  

        //es werden String und HTML-Elemente verarbeitet, zur Verwendung von
        //Composite sind JavaScript-Klasse und HTML-Element erforderlich
        if ((typeof context) == "object" && context.nodeType && context.nodeType == 1)
            context = context.getAttribute("id");
        if (!context || (typeof context) != "string")
            return;

        element = document.getElementById(context);
        object  = binding || eval(context);
        
        if (!element || !object)
            return;
        
        object.context = element;
        Composite.objects = Composite.objects || new Array();
        exists = Composite.objects.indexOf(object) >= 0;
        Composite.objects.push(object);
        
        //die Window-Events werden fuer das Context-Objekt registriert
        events = !exists ? "Abort|BeforeUnload|Error|HashChange|PageShow|PageHide|Resize|Scroll|Unload" : "";
        events.split("|").forEach(function(event) {
            var call = object["on" + event];
            if (!call || (typeof call) !== "function")
                return;
            Composite.registerEvent(window, event, call);
        });
        
        if (!Composite.count)
            Composite.count = 0;

        //alle Elemente im Context mit Attribut Id oder Name werden ermittelt
        //und diese selbst als Felder sowie deren Events als statische Methoden
        //registriert, hat ein Element beide Attribute wird die Id bevorzugt
        nodes = element.querySelectorAll("[id],[name]");
        for (loop = 0; loop < nodes.length; loop++) {
            element = nodes[loop].getAttribute("id") || nodes[loop].getAttribute("name");
            composite = nodes[loop].getAttribute("compositeId");
            axis = context.toLowerCase();
            if (composite && composite.indexOf("/" + axis + "/" ) >= 0)
                continue;
            if (composite)
                composite = composite.replace(/^(.*?)([^\/]+)$/, '$1' + axis + "/$2");
            else composite = "/" + axis + "/" + element + ":" + Composite.count++;
            nodes[loop].setAttribute("compositeId", composite);
            element = element.charAt(0).toLowerCase() + element.substring(1);
            if (element.match(/^[a-z]\w+$/i)) {
                if (object[element]) {
                    if (!(object[element] instanceof Array))
                        object[element] = [object[element]];
                    object[element].push(nodes[loop]); 
                } else object[element] = nodes[loop];
            }
            Composite.registerElementEvents(context, nodes[loop], object);
        }
        
        if (!exists && object.onLoad)
            object.onLoad();
    };

    /**
     *  Einsprung zur Einrichtung der Composite-Objekte. 
     *  @param event Event
     */
    Composite.onLoad = function(event) {
        
        var nodes;
        var loop;
     
        Composite.complete = true;

        nodes = document.querySelectorAll("[class][id]");
        for (loop = 0; loop < nodes.length; loop++) 
            if ((nodes[loop].className || "").match(/(^|\s+)composite(\s+|$)/i))
                Composite.bind(nodes[loop]);  
    };

    Runtime.registerEvent(window, "load", function(event) {
        Composite.onLoad(event);});    
}