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
 * Expressions or the Expression Language (EL) is a simple access to the
 * client-side JavaScript and thus to the models and components. In the
 * expressions the complete JavaScript API is supported, which is enhanced with
 * additional keywords, so that also the numerous arithmetic and logical
 * operators can be used.
 *
 * The expression language can be used from the HTML element BODY on in the
 * complete markup as free text, as well as in all ks. Exceptions are the HTML
 * elements STYLE and SCRIPT whose content is not supported by the expression
 * language.
 *
 * @author  Seanox Software Solutions
 * @version 1.6.0 202300309
 */
(() => {

    compliant("Expression");
    compliant(null, window.Expression = {

        /**
         * Interprets the passed expression. In case of an error, the error is
         * returned and no exception is thrown. A serial can be specified
         * optionally. The serial is an alias for caching compiled expressions.
         * Without, the expressions are always compiled. The function uses
         * variable parameters and has the following signatures:
         *     function(expression)
         *     function(serial, expression)
         * @param  serial
         * @param  expression
         * @return the return value of the interpreted expression or an error if
         *     an error or exception has occurred
         */
        eval(...variants) {

            let expression;
            if (variants.length > 1)
                expression = String(variants[1]);
            else if (variants.length > 0)
                expression = String(variants[0]);

            let serial;
            if (variants.length > 1
                    && variants[0])
                serial = String(variants[0]);

            _patches.clear();

            let script = serial ? _cache.get(serial) : null;
            if (!script)
                script = _parse(TYPE_MIXED, expression);
            if (serial)
                _cache.set(serial, script);

            // TODO:
        }
    });

    /** Cache (expression/script) */
    const _cache = new Map();

    const TYPE_MIXED  = 0;
    const TYPE_TEXT   = 1;
    const TYPE_PHRASE = 2;
    const TYPE_SCRIPT = 3;
    const TYPE_NUMBER = 4;

    /**
     * Analyzes and finds the components of an expression and creates a
     * JavaScript from them. Created scripts are cached a reused as needed.
     * @param  expression
     * @param  depth
     * @return the created JavaScript
     */
    const _parse = (type, expression, patches = []) => {

        switch (type) {

            case TYPE_MIXED:

                // replace all line breaks and merge them with a space, so the
                // characters CR\r and LF\n can be used as internal markers
                expression = expression.replace(/[\r\n]/g, " ").trim();

                let structure = expression;

                // find all places outside the detected and replaced scripts
                structure = structure.replace(/\{\{(.*?)\}\}/g,
                    (match, script) => _parse(TYPE_SCRIPT, script, patches));

                // find all places outside the detected and eplaced scripts
                // this is everything outside of \r...\n
                structure = structure.replace(/((?:[^\n]*$)|(?:[^\n]*(?=\r)))/g,
                    (match, text) => _parse(TYPE_TEXT, text, patches));

                // if everything is replaced, the expression must have the
                // following structure, deviations are syntax errors
                if (!structure.match(/^(\r(\d+)\n)*$/))
                    throw Error("Error in the expression structure\n\t" + expression);

                // placeholders must be filled, since they were created
                // recursively, they do not have to be filled recursively
                structure = structure.replaceAll(/(?:\r(\d+)\n)/g,
                    (match, placeholder) => "\r" + patches[placeholder] + "\n");

                // splices still need to be made scriptable
                structure = structure.replace(/(\n\r)+/g, " + ").trim();

                return structure

            case TYPE_TEXT:
            case TYPE_PHRASE:
            case TYPE_NUMBER:

                expression = expression.trim();
                if (!expression)
                    return "";
                const symbol = ["", "\"", "\'", "", ""][type];
                patches.push(symbol + expression + symbol);
                return "\r" + (patches.length -1) + "\n";

            case TYPE_SCRIPT:

                expression = expression.trim();
                if (!expression)
                    return "";

                // Mask escaped quotes (single and double) so that they are not
                // mistakenly found by the parser as delimiting string/phrase.
                // rule: search for an odd number of slashes followed by quotes
                expression = expression.replace(/(^|[^\\])((?:\\{2})*)(\\\')/g, "$1$2\\u0027");
                expression = expression.replace(/(^|[^\\])((?:\\{2})*)(\\\")/g, "$1$2\\u0022");

                // replace all literals "..." / '...' with placeholders
                expression = expression.replace(/(\").*?(\')/g,
                    (match, text) => _parse(TYPE_TEXT, text, patches));
                expression = expression.replace(/(\").*?(\")/g,
                    (match, text) => _parse(TYPE_TEXT, text, patches));

                // mapping of keywords to operators
                // IMPORTANT: KEYWORDS ARE CASE-INSENSITIVE
                //     and &&        empty !         div /
                //     eq  ==        eeq   ===       ge  >=
                //     gt  >         le    <=        lt  <
                //     mod %         ne    !=        nee !==
                //     not !         or    ||
                const keywords = ["and", "&&", "or", "||", "not", "!",
                    "eq", "==", "eeq", "===", "ne", "!=", "nee", "!==", "lt", "<", "gt", ">", "le", "<=", "ge", ">=", "empty", "!",
                    "div", "/", "mod", "%"];
                for (let loop = 0; loop < keywords.length; loop += 2) {
                    const pattern = new RegExp("(^|[^\\w\\.])(" + keywords[loop] + ")(?=[^\\w\\.]|$)", "ig");
                    expression = expression.replace(pattern, "$1 " + keywords[loop +1] + " ");
                }

                // - extract all numericals [\d\.]+ as variable
                //   are replaced by placeholder \nNumber\n
                // - replace all expression keywords with the real operators
                // - replace the expression in all brackets (recursively)
                //   by \r_eval("return\r" + expression + "\r")\r
                //   thereby the variables have to be filled again
                // - a window.eval(...) will execute the expression
                // - _eval returns undefined for ReferenceError
                //   similar behavior to JSP EL
                // - for other errors \n...\n are removed in the error output
                //   the developer should recognize/see his code

                // Let's see if the plan works and the code is smaller, faster and
                // maintains compatibility with the old version.

                patches.push("\"" + expression + "\"")
                return "\r" + (patches.length -1) + "\n";

            default:
                throw new Error("Unexpected script type");
        }
    };

    const _eval = (expression) => {
    };
})();