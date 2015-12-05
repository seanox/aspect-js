/**
 *  Display stellt Methoden fuer den Umgang mit der Anzeige bereit.
 *  
 *  Display 1.0 20150123
 *  Copyright (C) 2015 Seanox Software Solutions
 *  Alle Rechte vorbehalten.
 *
 *  @author  Seanox Software Solutions
 *  @version 1.0 20150123
 */
if (typeof(Display) == 'undefined') {

    /** Konstruktor, richtet das Display-Objekt ein. */
    Display = function() {
    };

    /**
     *  Ermittelt browseruebergreifend die Scroll-Hoehe der Seite gesamt.
     *  @param  object optional HTML-Element
     *  @return die Scroll-Hoehe der Seite gesamt
     */
    Display.getScrollHeight = function(object) {

        if (object)
            return Math.max(object.pageYOffset || 0, object.scrollTop || 0);                    

        return Math.max(Math.max(window.pageYOffset || 0, document.documentElement ? document.documentElement.scrollTop : 0),
                document.body ? document.body.scrollTop : 0);
    };

    /**
     *  Ermittelt browseruebergreifend die Scroll-Weite der Seite gesamt.
     *  @param  object optional HTML-Element 
     *  @return die Scroll-Weite der Seite gesamt
     */
    Display.getScrollWidth = function(object) {

        if (object)
            return Math.max(object.pageXOffset || 0, object.scrollLeft || 0);                    

        return Math.max(Math.max(window.pageXOffset || 0, document.documentElement ? document.documentElement.scrollLeft : 0),
                document.body ? document.body.scrollLeft : 0);
    };

    /**
     *  Ermittelt browseruebergreifend die Hoehe der Seite gesamt.
     *  @return die Hoehe der Seite gesamt
     */
    Display.getSideHeight = function() {
        return Math.max(Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
                Math.max(document.body.offsetHeight, document.documentElement.offsetHeight),
                Math.max(document.body.clientHeight, document.documentElement.clientHeight));
    };

    /**
     *  Ermittelt browseruebergreifend die Weite der Seite gesamt.
     *  @return die Weite der Seite gesamt
     */
    Display.getSideWidth = function() {
        return Math.max(Math.max(document.body.scrollWidth, document.documentElement.scrollWidth),
                Math.max(document.body.offsetWidth, document.documentElement.offsetWidth),
                Math.max(document.body.clientWidth, document.documentElement.clientWidth));
    };

    /**
     *  Ermittelt browseruebergreifend die innere Hoehe.
     *  @return die innere Hoehe
     */
    Display.getInnerHeight = function() {

        if (typeof (window.innerHeight) == "number")
            return window.innerHeight;
        if (document.documentElement && document.documentElement.clientHeight)
            return document.documentElement.clientHeight;
        if (document.body && document.body.clientHeight)
            return document.body.clientHeight;

        return -1;
    };

    /**
     *  Ermittelt browseruebergreifend die innere Weite.
     *  @return die innere Weite
     */
    Display.getInnerWidth = function() {

        if (typeof (window.innerWidth) == "number")
            return window.innerWidth;
        if (document.documentElement && document.documentElement.clientWidth)
            return document.documentElement.clientWidth;
        if (document.body && document.body.clientWidth)
            return document.body.clientWidth;

        return -1;
    };

    /**
     *  Positioniert das angegebene HTML-Element in der Fenstermitte.
     *  @param  object HTML-Element 
     */
    Display.centerElement = function(object) {

        if (!object) return;

        height = (Display.getInnerHeight() /2) +Display.getScrollHeight() -((object.offsetHeight) /2);
        width  = (Display.getInnerWidth() /2) +Display.getScrollWidth() -(object.offsetWidth /2);

        object.style.left = width  + "px";
        object.style.top  = height + "px";  
    };  
};