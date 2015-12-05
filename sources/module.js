/**
 *  Module sind Komponenten, bestehend aus CSS, HTML, JS und Ressourcen, welche
 *  nicht direkt im Markup beschrieben, sondern als Pakete zur Laufzeit
 *  nachgeladen werden. Das Einbetten von Modulen erfolgt als Script-Tag vom
 *  Type text/module bei dem das scr-Attribute auf die URL einer module-Datei
 *  verweist. Dabei handelt es sich um eine einfache Textdatei, welche alle
 *  Komponenten als absolute oder relative URL in der Reihenfolge enthaelt, wie
 *  diese geladen werden muessen. Das  Laden der module-Datei  sowie den darin
 *  beschriebenen Komponenten erfolgt per AJAX. Der Ladevorgang selbst ist
 *  asynchron und kann ueber einen Status ueberwacht werden.
 *
 *  Besonderheiten gibt es bei Ressourcen, CSS und HTML. Bei Ressourcen wird
 *  neben der angegebenen Datei immer nach Varianten mit Laenderschluessel zur
 *  aktuellen Spracheinstellung des Browsers gesucht. Der Laenderschluessel wird
 *  dazu einfach oder qualifiziert vor die Dateiendung gesetzt.
 *  Wird test.resource definiert, werden test.resource, test_de.resource und
 *  test_de-de.resource geladen, wenn vorhanden.
 *  CSS und HTML werden vor dem Einbinden in den DOM durch den
 *  Ressource-Praeprozessor geleitet um ggf. Platzhalter zu ersetzen.
 *
 *  
 *      Beispiel:
 *      
 *  <script type="text/module" src="/share/modules/messageDialog.module"/>
 *  
 *  
 *      Inhalt module-Datei:
 *      
 *  messageDialog.css
 *  messageDialog.html
 *  messageDialog.js
 *  messageDialog.resource
 *  
 *  
 *      Abhaengigkeiten:
 *      
 *  ajax.js
 *  resources.js
 *  runtime.js
 *  
 *  Module 1.0 20150123
 *  Copyright (C) 2015 Seanox Software Solutions
 *  Alle Rechte vorbehalten.
 *
 *  @author  Seanox Software Solutions
 *  @version 1.0 20150123
 */
if (typeof(Module) == 'undefined') {
    
    /** Konstruktor, richtet das Module-Objekt ein. */
    Module = function() {
    };

    /** Liste der Module und Komponenten mit Status */
    Module.index = new Object();

    /** Konstante fuer den Verarbeitungsstatus Unbekannt */
    Module.STATUS_UNKNOW = 0;

    /** Konstante fuer den Verarbeitungsstatus Laden */
    Module.STATUS_LOAD = 1;

    /** Konstante fuer den Verarbeitungsstatus Ausfuehrung */
    Module.STATUS_PERFORM = 2;

    /** Konstante fuer den Verarbeitungsstatus Fertig */
    Module.STATUS_COMPLETE = 3;

    /** aktueller Verarbeitungsstatus */
    Module.status = Module.STATUS_UNKNOW;

    /**
     *  Laedt die Module einer Seite, wenn die Seite geladen wurde.
     *  Module werden als Skript-Tag vom Typ "text/module" definiert.
     */
    Module.initialize = function() {

        var scripts;
        var loop;
        var module;
        
        Module.status = Module.STATUS_LOAD;
        
        scripts = document.querySelectorAll("script[type='text/module']");
        for (loop = 0; scripts && loop < scripts.length; loop++) {
            module = scripts[loop].getAttribute("src");
            if (!Module.exists(module)) Module.load(module);;
        }

        Module.status = Module.STATUS_COMPLETE;
    };

    /**
     *  Registriert ein Modul oder eine Komponente allgemein oder mit einem
     *  optional angegebenen Status.
     *  @param module Name vom Module oder der Komponente
     *  @param status Status optional
     */
    Module.register = function(module, status) {

        if (Module.exists(module, status))
            return;

        module = module.replace(/^\s+|\s+$/g, '');
        module = module.match(/[^\/]+$/);
        module = String(module).replace(/^\s+|\s+$/g, '');
        module = module.replace(/[^\w]+/g, '_').toLowerCase();

        Module.index[Module.index.length] = !!status ? Module.STATUS_UNKNOW : status; 
    };

    /**
     *  Prueft die Existenz eines Moduls oder einer Komponente allgemein oder zu
     *  einem optional angegebenen Status.
     *  @param module Name vom Module oder der Komponente
     *  @param status Status optional
     */
    Module.exists = function(module, status) {
        
        module = module.replace(/^\s+|\s+$/g, '');
        module = module.match(/[^\/]+$/);
        module = String(module).replace(/^\s+|\s+$/g, '');
        module = module.replace(/[^\w]+/g, '_').toLowerCase();
        
        if (!status)
            return !!Module.index[module];
        
        return Module.index[module] == status;
    };

    /**
     *  Erweitert das Markup, wenn die Seite komplett geladen wurde.
     *  @param data Markup
     */
    Module.appendMarkup = function(data) {
        
        if (Runtime.isComplete()) {
            document.body.innerHTML += Resources.prepare(data);
            return;
        }
        
        window.setTimeout(function() {
            Module.appendMarkup(data);}, 250);
    };

    /**
     *  Laedt die Modul-Komponenten der angegebenen URL.
     *  @param url URL der module-Datei
     */
    Module.load = function(url) {
        
        Module.status = Module.STATUS_PERFORM;
        
        if (Module.exists(url)) {
            Module.status = Module.STATUS_COMPLETE;
            return;
        }

        Module.register(url, Module.STATUS_LOAD);

        Ajax.request({
            url: url,
            type: "text/plain",
            synchron: true,
            onComplete: function(request) {

                var set;
                var locale;
                
                locale = (navigator.language || navigator.userLanguage).toLowerCase();
                locale = '$1$2\r\n$1_' + locale.replace(/-.*$/, '') + '$2*\r\n$1_' + locale + '$2*'
                
                set = request.responseText.replace(/^(.*)(\.resource(?:\*)*)$/igm, locale);
                set = set.split(/(?:\r\n)|(?:\n\r)|[\r\n]/);
                
                set.forEach(function(item) {
                    
                    var module;
                    
                    if (!item.match(/^\//))
                        item = request.responseURL.replace(/[^\/]*$/, item);
                    if (!item.match(/\.(?:module|css|js|resource|json|html)(?:\*)*$/i))
                        return;
                    
                    module = item.replace(/\*+$/, '');
                    if (Module.exists(module)) return;
                    
                    Module.register(module, Module.STATUS_LOAD);

                    Ajax.request({
                        url: module,
                        type: "text/plain",
                        synchron: true,
                        optional: !!item.match(/\*+$/), 
                        onComplete: function(request, call) {
                            
                            var data;
                            var type;

                            if (request.status != 200 && call.optional)
                                return;
                            if (request.status != 200)
                                throw new Error("Loading of component failed (status " + request.status + "): "  + request.responseURL);
                            
                            data = request.responseText;
                            data = data.replace(/^\s+|\s+$/g, '');
                            
                            if (!data) {
                                Module.register(item, Module.STATUS_COMPLETE);
                                return;
                            }
                            
                            Module.register(item, Module.STATUS_PERFORM);

                            type = String(request.responseURL.match(/[^\.]+$/));

                            try {
                                
                                if (type.match(/module/i))
                                    Module.load(data);
                                else if (type.match(/css/i))
                                    Module.appendMarkup("<style type=\"text/css\">" + Resources.prepare(data) + "</style>");
                                else if (type.match(/js/i))
                                    eval(data);   
                                else if (type.match(/resource/i))
                                    Resources.parse(data);
                                else if (type.match(/json/i))
                                    eval(data);
                                else if (type.match(/html/i))
                                    Module.appendMarkup(Resources.prepare(data));                            
                                
                            } catch (exception) {
                                console.error(exception);
                                throw new Error("Loading of component failed: " + request.responseURL);
                            } finally {
                                Module.register(item, Module.STATUS_COMPLETE);
                            }
                        }
                    });
                });
            }
        });
        
        Module.register(url, Module.STATUS_COMPLETE);
    };

    /**
     *  Rueckgabe von true, wenn Module komplett geladen ist.
     *  @return true, wenn Module komplett geladen ist
     */
    Module.completed = function() {
        return Module.status == Module.STATUS_COMPLETE;
    };

    Runtime.registerEvent(window, "load", Module.initialize);
};