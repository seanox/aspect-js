/**
 * LIZENZBEDINGUNGEN - Seanox Software Solutions ist ein Open-Source-Projekt,
 * im Folgenden Seanox Software Solutions oder kurz Seanox genannt.
 * Diese Software unterliegt der Version 2 der Apache License.
 *
 * Seanox aspect-js, Fullstack JavaScript UI Framework
 * Copyright (C) 2022 Seanox Software Solutions
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
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
 * After loading the application, Messages are available as an associative
 * array and can be used directly in JavaScript and Markup via Expression
 * Language.
 * 
 * Messages["contact.title"];
 *     
 * <h1 output="{{Messages['contact.title']}}"/>
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