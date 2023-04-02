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
 * Expression language and composite JavaScript are two important components.
 * Both are based on JavaScript enriched with macros. In addition, Composite
 * JavaScript can be loaded at runtime and can itself load other Composite
 * JavaScript scripts. Because in the end everything is based on a simple eval
 * command, it was important to isolate the execution of the scripts so that
 * internal methods and constants cannot be accessed unintentionally.
 *
 * @author  Seanox Software Solutions
 * @version 1.6.0 20230402
 */
(() => {

    compliant("Scripting");
    compliant(null, window.Scripting = {

        /**
         * As a special feature, Composite JavaScript supports macros.
         *
         * Macros are based on a keyword starting with a hash symbol followed by
         * arguments separated by spaces. Macros end with the next line break, a
         * semicolon or with the end of the file.
         *
         *
         *     #import
         *     ----
         * Expects a space-separated list of composite modules whose path must
         * be relative to the URL.
         *
         *     #import io/api/connector and/much more
         *
         * Composite modules consist of the optional resources CSS, JS and HTML.
         * The #import macro can only load CSS and JS. The behavior is the same
         * as when loading composites in the markup. The server status 404 does
         * not cause an error, because all resources of a composite are
         * optional, also JavaScript. Server states other than 200 and 404 cause
         * an error. CSS resources are added to the HEAD and lead to an error if
         * no HEAD element exists in the DOM. Markup (HTML) is not loaded
         * because no target can be set for the output. The macro can be used
         * multiple in the Composite JavaScript.
         *
         *
         *     #export
         *     ----
         * Expects a space-separated list of exports. Export are variables or
         * constants in a module that are made usable for the global scope.
         *
         *     #export connector and much more
         *
         * Primarily, an export argument is the name of the variable or constant
         * in the module. Optionally, the name can be extended by an @ symbol to
         * include the destination in the global scope.
         *
         *     #export connector@io.example
         *
         * The macro #module is intended for debugging. It writes the following
         * text as debug output to the console. The browser displays this output
         * with source, which can then be used as an entry point for debugging.
         *
         *     #module console debug output
         *
         * The output is a string expression and supports the corresponding
         * syntax.
         *
         *     (?...)
         *
         * Tolerant expressions are also a macro, although with different
         * syntax. The logic enclosed in the parenthesis with question marks is
         * executed fault-tolerantly. In case of an error the logic corresponds
         * to the value false without causing an error itself, except for syntax
         * errors.
         *
         * @param  script
         * @return the return value from the script
         */
        eval(script) {

            // Performance is important here.
            // The implementation parses and replaces macros in one pass.

            // It was important to exclude literals and comments.
            // - ignore: /*...*/
            // - ignore: //...([\r\n]|$)
            // - ignore: '...'
            // - ignore: "..."
            // - ignore: `...`
            // - detect: (^|\W)#(import|export|module)\s+...(\W|$)
            // - detect: \(\s*\?...\)

            let pattern;
            let brackets;
            for (let cursor = 0; cursor < script.length; cursor++) {
                let digit = script.charAt(cursor);
                if (cursor >= script.length
                        && !pattern)
                    continue;

                // The macro for the tolerant logic is a bit more complicated,
                // because round brackets have to be counted here. Therefore the
                // parsing runs parallel to the other macros. In addition, the
                // syntax is undefined by optional whitepsaces between ( and ?).

                if (brackets < 0) {
                    if (digit === "?") {
                        brackets = 1;
                        let macro = "_tolerate(()=>";
                        script = script.substring(0, cursor) + macro + script.substring(cursor +1);
                        cursor += macro.length;
                        continue;
                    }
                    if (!digit.match(/\s/))
                        brackets = 0;
                }

                if (digit === "\\") {
                    cursor++
                    continue;
                }

                if (pattern) {
                    if (pattern === script.substring(cursor, cursor + pattern.length)
                            || (pattern === "\n" && digit === "\r"))
                        pattern = null;
                    continue;
                }

                switch (digit) {
                    case "/":
                        digit = script.charAt(cursor +1);
                        if (digit === "/")
                            pattern = "\n";
                        if (digit === "*")
                            pattern = "*/";
                        continue;

                    case "(":
                        if (brackets > 0)
                            brackets++;
                        else brackets = -1;
                        continue;

                    case ")":
                        if (brackets <= 0)
                            continue;
                        if (--brackets > 0)
                            continue;
                        let macro = ")";
                        script = script.substring(0, cursor) + macro + script.substring(cursor);
                        cursor += macro.length;
                        continue;

                    case "\'":
                    case "\"":
                    case "\`":
                        pattern = digit;
                        continue;

                    case "#":
                        let string = script.substring(cursor -1, cursor +10);
                        let match = string.match(/(^|\W)(#(?:import|export|module))\s/);
                        if (match) {
                            let macro = match[2];
                            for (let offset = cursor +macro.length; offset <= script.length; offset++) {
                                string = script.charAt(offset);
                                if (!string.match(/[;\r\n]/)
                                        && offset < script.length)
                                    continue;

                                let parameters = script.substring(cursor +macro.length, offset).trim();

                                switch (macro) {
                                    case "#import":
                                        if (!parameters.match(/^(\w+(\/\w+)*)(\s+(\w+(\/\w+)*))*$/))
                                            throw new Error(("Invalid macro: #import " + parameters).trim());
                                        const imports = [];
                                        parameters.split(/\s+/).forEach(entry => imports.push("\"" + entry + "\""));
                                        macro = "_import(...[" + imports.join(",") + "])";
                                        break;

                                    case "#export":
                                        const exports = [];
                                        const pattern = /^([_a-z]\w*)(?:@((?:[_a-z]\w*)(?:\.[_a-z]\w*)*))?$/i;
                                        parameters.split(/\s+/).forEach(entry => {
                                            const match = entry.match(pattern);
                                            if (!match)
                                                throw new Error(("Invalid macro: #export " + parameters).trim());
                                            parameters = [match[1], "\"" + match[1] + "\""];
                                            if (match[2])
                                                parameters.push("\"" + match[2] + "\"");
                                            exports.push("[" + parameters.join(",") + "]");
                                        });
                                        macro = "_export(...[" + exports.join(",") + "])";
                                        break;

                                    case "#module":
                                        macro = parameters.replace(/\\/g, "\\\\")
                                            .replace(/`/g, "\\`").trim();
                                        if (macro)
                                            macro = "console.debug(`Module: " + macro + "`)";
                                        break;
                                }

                                script = script.substring(0, cursor -1) + (match[1] || "")
                                    + macro + script.substring(offset);
                                cursor += macro.length;
                                break;
                            }
                        }
                        continue;

                    default:
                        continue;
                }
            }

            return this.run(script);
        },

        /**
         * Executes a script isolated in this context, so that no unwanted
         * access to internals is possible.
         * @param  script
         * @return return value of the script, if available
         */
        run(script) {
            if (script.trim())
                return eval(script);
        }
    });

    const _import = (...imports) => {
        // Because it is an internal method, an additional validation of the
        // exports as data structure was omitted.
        imports.forEach(include =>
            Composite.load(Composite.MODULES + "/" + include + ".js", true));
    };

    const _export = (...exports) => {
        // Because it is an internal method, an additional validation of the
        // exports as data structure was omitted.
        exports.forEach(parameters => {
            let context = window;
            (parameters[2] ? parameters[2].split(/\./) : []).forEach(parameter => {
                if (typeof context[parameter] === "undefined")
                    context[parameter] = {};
                context = context[parameter]
            });

            const lookup = context[parameters[1]];
            if (typeof lookup !== "undefined"
                    && !(lookup instanceof Element)
                    && !(lookup instanceof HTMLCollection))
                throw new Error("Context for export is already in use: "
                    + parameters[1] + (parameters[2] ? "@" + parameters[2] : ""));
            context[parameters[1]] = parameters[0];
        });
    }

    const _tolerate = (invocation) => {
        try {return invocation.call(window);
        } catch (error) {
            return false;
        }
    };
})();