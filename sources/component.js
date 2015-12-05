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