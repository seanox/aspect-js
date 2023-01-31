/**
 * LIZENZBEDINGUNGEN - Seanox Software Solutions ist ein Open-Source-Projekt,
 * im Folgenden Seanox Software Solutions oder kurz Seanox genannt.
 * Diese Software unterliegt der Version 2 der Apache License.
 *
 * Seanox aspect-js, fullstack for single page applications
 * Copyright (C) 2023 Seanox Software Solutions
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
 *     + data
 *       + de
 *       + en
 *       - locales.xml
 *     + modules
 *     + resources
 *     - index.html
 * 
 * The elements for the supported languages are organized in locales in this
 * file. Locales is a set of supported country codes. In each country code, the
 * key values are recorded as label entries.  
 *   
 *     <?xml version="1.0"?>
 *     <locales>
 *       <de>
 *         <label key="contact.title" value="Kontakt"/>
 *         <label key="contact.development.title">Entwicklung</label>
 *         ...
 *       </de>
 *       <en default="true">
 *         <label key="contact.title" value="Contact"/>
 *         <label key="contact.development.title">Development</label>
 *         ...
 *       </en>
 *     </locales>
 * 
 * The language is selected automatically on the basis of the language setting
 * of the browser. If the language set there is not supported, the language
 * declared as 'default' is used.
 * 
 * After loading the application, Messages are available as an associative
 * array and can be used directly in JavaScript and Markup via Expression
 * Language.
 * 
 *     Messages["contact.title"];
 *     
 *     <h1 output="{{Messages['contact.title']}}"/>
 *
 * In addition, the object message is also provided. Unlike Messages, message is
 * an object tree analogous to the keys from Messages. The dot in the keys is
 * the indicator of the levels in the tree.
 *
 *     messages.contact.title;
 *
 *     <h1 output="{{messages.contact.title}}"/>
 *
 * Both objects are only available if there are also labels.
 *
 * @author  Seanox Software Solutions
 * @version 1.6.0 20230131
 */
compliant("Messages");
compliant(null, window.Messages = {});
(() => {

    const localize = DataSource.localize;

    DataSource.localize = (locale) => {

        localize(locale);

        delete window.messages;
        delete window.Messages;

        const map = new Map();
        const xpath = "/locales/" + DataSource.locale + "/label";
        const result = DataSource.data.evaluate(xpath, DataSource.data, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
        for (let node = result.iterateNext(); node; node = result.iterateNext())
            map.set((node.getAttribute("key") || "").trim(),
                ((node.getAttribute("value") || "").trim()
                    || (node.textContent || "").trim()).unescape());
        new Map([...map.entries()].sort()).forEach((value, key) => {
            const match = key.match(/^(?:((?:\w+\.)*\w+)\.)*(\b\w+)$/);
            if (match) {
                // In order for the object tree to branch from each level, each
                // level must be an object. Therefore, an anonymous object is
                // used for the level, which returns the actual text via
                // Object.prototype.toString().
                Object.defineProperty(Namespace.use("messages", match[1]), match[2], {
                    value: {toString() {return value;}}, writable: false
                });
                Object.defineProperty(Namespace.use("Messages"), key, {
                    value, writable: false
                });
            }
        });
    };

    // Messages are based on DataSources. To initialize, DataSource.localize()
    // must be overwritten and loading of the key-value pairs is embedded.
    if (DataSource.data
            && DataSource.locale
            && DataSource.locales
            && DataSource.locales.includes(DataSource.locale))
        DataSource.localize(DataSource.locale);
})();