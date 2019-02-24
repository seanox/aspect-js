/**
 *  LIZENZBEDINGUNGEN - Seanox Software Solutions ist ein Open-Source-Projekt,
 *  im Folgenden Seanox Software Solutions oder kurz Seanox genannt. Diese
 *  Software unterliegt der Version 2 der GNU General Public License.
 *
 *  Seanox aspect-js, Fullstack JavaScript UI Framework
 *  Copyright (C) 2018 Seanox Software Solutions
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
 *      DESCRIPTION
 *      ----
 *  (Resource)Messages is a static datasource extension for internationalization
 *  and localization. The implementation is based on a set of key-value or
 *  label-value data which is stored in the locales.xml of the datasource.
 *  The elements for the supported languages exist in this file under locales.
 *  These elements are extended by a set of key-value entries for the (eesource)
 *  messages.
 *    
 *  <?xml version="1.0" encoding="ISO-8859-1"?>
 *  <locales>
 *    <de>
 *      <label key="contact.title" value="Kontakt"/>
 *      <label key="contact.development.title">Entwicklung</label>
 *      ...
 *    </de>
 *    <en default="true">
 *      <label key="contact.title" value="Contact"/>
 *      <label key="contact.development.title">Development</label>
 *      ...
 *    </en>
 *  </locales>
 *  
 *  The language is selected automatically on the basis of the language setting
 *  of the browser. If the language set there is not supported, the language
 *  declared as "default" is used.
 *  
 *  After loading the file, the messages are available as an assosiative array.
 *  
 *      Messages["contact.title"];
 *  
 *  Messages 1.0 20181021
 *  Copyright (C) 2018 Seanox Software Solutions
 *  Alle Rechte vorbehalten.
 *
 *  @author  Seanox Software Solutions
 *  @version 1.0 20181021
 */
if (typeof Messages === "undefined") {
    
    /**
     *  (Resource)Messages is a static datasource extension for localization and
     *  internationalization. The implementation is based on a set of key-value
     *  or label-value data.
     */
    Messages = {};

    (function() {

        var root = window.location.pathname;
        var data = (root + "/data").replace(/\/+/g, "/");
        var request = new XMLHttpRequest();
        request.open("GET", DataSource.DATA + "/locales.xml", false);
        request.overrideMimeType("application/xslt+xml");
        request.send();
        var xml = request.responseXML;

        var xpath = "(/locales/*[@default])[1]/label";
        var locale = (navigator.browserLanguage || navigator.language || "").trim().toLowerCase();
        locale = locale.match(/^([a-z]+)/);
        if (locale)
            xpath = xpath.replace(/(^\()/, "$1/locales/" + locale[0] + "|");

        var label = xml.evaluate(xpath, xml, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
        for (var node = label.iterateNext(); node; node = label.iterateNext()) {
            var key = (node.getAttribute("key") || "").trim();
            if (key == "")
                continue;
            var value = ((node.getAttribute("value") || "").trim()
                    + " " + (node.textContent).trim()).trim();
            value = value.unescape();
            Messages[key] = value;
        }
    })();
};