/**
 *  Abstraktes Objekt zur Abbildung von instanzierten Komponenten.
 *  
 *  Component 1.0 20150123
 *  Copyright (C) 2015 Seanox Software Solutions
 *  Alle Rechte vorbehalten.
 *
 *  @author  Seanox Software Solutions
 *  @version 1.0 20150123
 */
if (typeof(Component) == 'undefined') {

    /** Konstruktor, richtet das Component-Objekt ein. */
    Component = function() {
    };

    /** Name der Komponente */
    Component.prototype.context;

    /** Objekt der Komponente */
    Component.prototype.object;

    /** Instanz der Komponente fuer statischen Zugriff */
    Component.instance;

    /** Bindet die Komponente ein. */
    Component.bind = function() {

        if (!this.instance) {

            this.instance = new this();
            this.instance.object = document.getElementById(this.instance.context);
            if (this.customize)
                this.customize();
        }
    };
};