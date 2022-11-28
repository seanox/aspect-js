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
 *
 *     DESCRIPTION
 *     ----
 * TODO
 *
 * @author  Seanox Software Solutions
 * @version 0.0.0 2022xxxx
 */
if (typeof ReactProxy === "undefined") {

    window["ReactProxy"] = {};

    ReactProxy.selector = null;

    ReactProxy.create = function(target) {
        const proxy = new Proxy(target, {
            notifications: new Map(),
            get(target, key) {
                try {return target[key] ?? undefined;
                } finally {
                    if (ReactProxy.selector === null)
                        return;
                    // TODO:
                    // - Get the recipient list from the map (by field/key)
                    // - Return if parent already included
                    // - Search for child elements in combination with the same field/key and delete the entries
                    // - Register field/key and the element as recipient
                }
            },
            set(target, key, value) {
                if (!(key in target))
                    return false;
                try {return target[key] = value;
                } finally {
                    try {
                        // TODO:
                        // - Get the recipient list from the map (by field/key)
                        // - Remove recipients, when the element is no longer in the DOM
                        // - Initiate rerender (composite)
                    } catch (error) {
                        // Reactive behavior is optional and ignores errors
                    }
                }
            }
        });
        return proxy;
    };

    Composite.listen(Composite.EVENT_RENDER_START, function(selector) {
        ReactProxy.selector = selector;
    });

    Composite.listen(Composite.EVENT_RENDER_NEXT, function(selector) {
        ReactProxy.selector = selector;
    });

    Composite.listen(Composite.EVENT_RENDER_END, function(selector) {
        ReactProxy.selector = null;
    });

    /**
     * Enhancement of the JavaScript API
     * Adds a function to create a ReactProxy from the object instance.
     * If it is a ReactProxy, the reference of the instance is returned.
     */
    if (Object.prototype.toReactProxy === undefined) {
        Object.prototype.toReactProxy = function() {
            return ReactProxy.create(this);
        }
    }
}