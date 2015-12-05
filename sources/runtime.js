/**
 *  Runtime stellt Methoden fuer den allgemeinen Umgang mit der Client-Umgebung
 *  bereit.
 *  
 *  Runtime 1.0 20150123
 *  Copyright (C) 2015 Seanox Software Solutions
 *  Alle Rechte vorbehalten.
 *
 *  @author  Seanox Software Solutions
 *  @version 1.0 20150123
 */
if (typeof(Runtime) == 'undefined') {

    /** Konstruktor, richtet das Runtime-Objekt ein. */
    Runtime = function() {
    };
    
    /** Status zum Ladevorgang der Seite/Laufzeitumgebung */
    Runtime.complete;
    
    /** Basiszaehler zur Generierung von Serials */
    Runtime.serial = 0;
    
    /**
     *  Registriert ein Ereignis beim angegebenen Objekt.
     *  @param object  Bezugsobjekt
     *  @param event   Ereignis als Text
     *  @param call    Funktionsaufruf
     *  @param capture Informationsfluss (capturing, bubbling)
     */
    Runtime.registerEvent = function(object, event, call, capture) {
    
        var script;
        
        if (typeof object === "string")
            object = document.querySelector(object);
        
        script = " var swap;\n"
               + " if (object.addEventListener) object.addEventListener(\"${event}\", call, capture);\n"
               + " else if (object.attachEvent) object.attachEvent(\"on${event}\", call);\n"
               + " else {\n"
               + "   swap = object.on${event};\n"
               + "   object.on${event} = function() {\n"
               + "     if (swap) swap();\n"
               + "     call();\n"
               + "   };\n"
               + " }\n";
    
        script = script.replace(new RegExp("\\$\\{event\\}", "g"), event);
    
        try {eval(script);
        } catch (exception) {
            //keine Fehlerbehandlung vorgesehen
        }
    };
    
    /**
     *  Rueckgabe vom Abschluss des Ladevorgangs der Seite/Laufzeitumgebung.
     *  @return true, wenn die Seite/Laufzeitumgebung komplett geladen wurde
     */
    Runtime.isComplete = function() {
        return !!Runtime.complete;
    };
    
    /**
     *  Erstellt eine neue, auf Millisekunden basierende, Id. Zur Verkuerzung
     *  der Laenge, werden die Millisekunden seit dem 01.01.2000 verwendet.
     *  @return die erstelle Id
     */
    Runtime.getSerial = function() {
    
        var result;
        
        result = new Date().getTime();
        result = String(result -946681200000);
        result = result.length + result + (Runtime.serial++); 
        
        return result; 
    };
    
    Runtime.registerEvent(window, "load", function() {
        Runtime.complete = true;});
};