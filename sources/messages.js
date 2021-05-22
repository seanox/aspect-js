/**
 * LIZENZBEDINGUNGEN - Seanox Software Solutions ist ein Open-Source-Projekt,
 * im Folgenden Seanox Software Solutions oder kurz Seanox genannt. Diese
 * Software unterliegt der Version 2 der GNU General Public License.
 *
 * Seanox aspect-js, Fullstack JavaScript UI Framework
 * Copyright (C) 2021 Seanox Software Solutions
 *
 * This program is free software; you can redistribute it and/or modify it
 * under the terms of version 2 of the GNU General Public License as published
 * by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
 * more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 * 
 * 
 *     DESCRIPTION
 *     ----
 * (Resource)Messages is a static DataSource extension for internationalization
 * and localization. The implementation is based on a set of key-value or
 * label-value data which is stored in the locales.xml of the DataSource.
 * 
 *     +- data
 *     |  |
 *     |  +- de...
 *     |  +- en...
 *     |  +- locales.xml
 *     |
 *     +- modules
 *     +- resources
 *     +- index.html
 * 
 * The elements for the supported languages are organized in locales in this
 * file. Locales is a set of supported country codes. In each country code, the
 * key values are recorded as label entries.  
 *   
 * <?xml version="1.0"?>
 * <locales>
 *   <de>
 *     <label key="contact.title" value="Kontakt"/>
 *     <label key="contact.development.title">Entwicklung</label>
 *     ...
 *   </de>
 *   <en default="true">
 *     <label key="contact.title" value="Contact"/>
 *     <label key="contact.development.title">Development</label>
 *     ...
 *   </en>
 * </locales>
 * 
 * The language is selected automatically on the basis of the language setting
 * of the browser. If the language set there is not supported, the language
 * declared as 'default' is used.
 * 
 * After loading the application, Messages are available as an assosiative
 * array and can be used directly in JavaScript and Markup via Expression
 * Language.
 * 
 * Messages["contact.title"];
 *     
 * <h1 output="{{Messages['contact.title']}}"/>
 * 
 * Messages 1.2.1 20210622
 * Copyright (C) 2021 Seanox Software Solutions
 * Alle Rechte vorbehalten.
 *
 * @author  Seanox Software Solutions
 * @version 1.2.1 20210622
 */
if (typeof Messages === "undefined") {
    
    /**
     * (Resource)Messages is a static DataSource extension for localization and
     * internationalization. The implementation is based on a set of key-value
     * or label-value data.
     */
    window["Messages"] = {};
    
    (function() {

        // Messages are based on DataSources.
        // To initialize, the DataSource.localize method must be overwritten and
        // loading of the key-value pairs is embedded.
        const localize = DataSource.localize;
        DataSource.localize = (locale) => {
            DataSource.localize$origin(locale);

            window["Messages"] = {};
            const xpath = "/locales/" + DataSource.locale + "/label";
            const label = DataSource.data.evaluate(xpath, DataSource.data, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
            for (let node = label.iterateNext(); node; node = label.iterateNext()) {
                const key = (node.getAttribute("key") || "").trim();
                if (key === "")
                    continue;
                let value = ((node.getAttribute("value") || "").trim()
                        + " " + (node.textContent).trim()).trim();
                value = value.unescape();
                if (!Messages.hasOwnProperty(key))
                    Object.defineProperty(Messages, key, {
                        value
                    });
            }
        };
        
        DataSource.localize$origin = localize;
        
        if (DataSource.data
                && DataSource.locale
                && DataSource.locales
                && DataSource.locales.includes(DataSource.locale))
            DataSource.localize(DataSource.locale);
    })();
}