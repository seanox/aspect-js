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
 * @version 1.6.0 20230221
 */
(() => {

    compliant("Expression");
    compliant(null, window.Expression = {

        /** Constant for element type text */
        get TYPE_TEXT() {
            return 1;
        },

        /** Constant for element type expression */
        get TYPE_EXPRESSION() {
            return 2;
        },

        /** Constant for element type literal */
        get TYPE_LITERAL() {
            return 3;
        },

        /** Constant for element type script */
        get TYPE_SCRIPT() {
            return 4;
        },

        /** Constant for element type keyword */
        get TYPE_KEYWORD() {
            return 5;
        },

        /** Constant for element type other */
        get TYPE_OTHER() {
            return 6;
        },

        /** Constant for element type method */
        get TYPE_METHOD() {
            return 7;
        },

        /** Constant for element type value */
        get TYPE_VALUE() {
            return 8;
        },

        /** Constant for element type logic */
        get TYPE_LOGIC() {
            return 9;
        },

        /**
         * Resolves a value expression recursively if necessary. Value expressions
         * refer to a property in a static model. The value is retrieved using a
         * corresponding get- or is-function or, if this is not available, the value
         * is retrieved directly from the property. For the get- and is-functions,
         * the first character is changed from name to uppercase and prefixed with
         * 'get' or 'is'.
         *
         *     {{Model.value}} -> Model.getValue()
         *     {{Model.value}} -> Model.isValue()
         *
         * In addition to the namespace of JavaScript, the method also supports DOM
         * elements. To do this, the variable in the expression must begin with #
         * and there must be a corresponding element with a matching ID in the DOM.
         *
         *     {{#Element}} -> document.querySelector(#Element)
         *     {{#Element.value}} -> document.querySelector(#Element).value
         *
         * @param  context    context or expression without context
         * @param  expression expression in combination with a context
         * @return the value of the expression, otherwise false
         */
        lookup(context, expression) {

            try {
                if (typeof context === "string"
                    && expression === undefined) {
                    if (context.match(/^#[a-z]\w*$/i))
                        return document.querySelector(context);
                    if (context.match(/^(#[a-z]\w*)\.(.*)*$/i)) {
                        expression = context.match(/^(#[a-z]\w*)\.(.*)*$/i);
                        return Expression.lookup(document.querySelector(expression[1]), expression[2]);
                    }
                    if (context.indexOf(".") < 0)
                        return eval(context);
                    expression = context.match(/^(.*?)\.(.*)$/);
                    return Expression.lookup(eval(expression[1]), expression[2]);
                }

                if (expression.indexOf(".") < 0)
                    expression = [null, expression];
                else expression = expression.match(/^(.*?)\.(.*)$/);
                let method = "get" + expression[1].capitalize();
                const keys = Object.keys(context);
                if (!keys.includes(method)
                    || typeof context[method] !== "function")
                    method = "is" + expression[1].capitalize();
                if (keys.includes(method)
                    && typeof context[method] === "function") {
                    context = (context[method])();
                    if (expression.length > 2)
                        return Expression.lookup(context, expression[2]);
                    return context
                }

                context = (context[expression[1]]);
                if (expression.length > 2)
                    return Expression.lookup(context, expression[2]);
                return context

            } catch (exception) {
                return undefined;
            }
        },

        /**
         * Analyzes and finds the components of an expression and creates a
         * JavaScript from them. Created scripts are cached a reused as needed.
         * @param  expression
         * @return the created JavaScript
         */
        parse(expression) {

            // Terms:
            // An expression is an array of words. A word is an elementary phrase or
            // a partial array with more words.

            // Structure:
            // The words are classified in several steps and separated according to
            // their characteristics.

            // +-------------------------------------------------------------+
            // |            words (all elements of an expression)            |
            // +--------+----------------------------------------------------+
            // |  text  |                     expression                     |
            // |        +-----------+----------------------------------------+
            // |        |  literal  |                 script                 |
            // |        |           +-----------+----------------------------+
            // |        |           |  keyword  |           other            |
            // |        |           |           +---------+----------+-------+
            // |        |           |           |  value  |  method  | logic |
            // +--------+-----------+-----------+---------+----------+-------+

            // Line breaks we are interpreted as blanks. Therefore, all line breaks
            // are replaced by spaces. So the characters 0x0D and 0x0A can be used
            // later as internal separator and auxiliary marker.

            // Empty expressions are interpreted like an empty string.
            if (expression === null
                || expression === undefined)
                expression = "";
            else expression = expression.trim();
            if (expression === "")
                return "";

            const cascade = {
                words: [],
                text: [],
                expression: [],
                literal: [],
                script: [],
                keyword: [],
                other: [],
                value: [],
                method: [],
                logic: []
            };

            // Step 1:
            // Separation of text and expression as words. Expression is always in
            // {{...}} included, everything else before/after is text. Escaping of
            // {{ and }} is not possible and is not supported. Alternatively, an
            // expression with literals can be used.
            //     e.g. {{"{" + "{"}} / {{"}" + "}"}}

            // Lines breaks are ignored, they are interpreted as spaces. So the
            // start and end of expressions can be marked with line breaks. After
            // that, text and expressions can be separated.
            expression = expression.replace(/(^[\r\n]+)|([\r\n]+$)/g, "");
            expression = expression.replace(/[\r\n]/g, " ");
            expression = expression.replace(/(\{\{)/g, "\n$1");
            expression = expression.replace(/(\}\})/g, "$1\n");

            // Without expression it is pure text.
            if (expression.indexOf("\n") < 0)
                return "\"" + expression + "\"";

            expression = expression.replace(/(^\n+)|(\n+$)/g, "");

            const assemble = (word) => {
                if (word.type === Expression.TYPE_TEXT)
                    cascade.text.push(word);
                else if (word.type === Expression.TYPE_EXPRESSION)
                    cascade.expression.push(word);
                else if (word.type === Expression.TYPE_SCRIPT)
                    cascade.script.push(word);
                else if (word.type === Expression.TYPE_LITERAL)
                    cascade.literal.push(word);
                else if (word.type === Expression.TYPE_KEYWORD)
                    cascade.keyword.push(word);
                else if (word.type === Expression.TYPE_OTHER)
                    cascade.other.push(word);
                else if (word.type === Expression.TYPE_VALUE)
                    cascade.value.push(word);
                else if (word.type === Expression.TYPE_METHOD)
                    cascade.method.push(word);
                else if (word.type === Expression.TYPE_LOGIC)
                    cascade.logic.push(word);
            };

            expression.split(/\n/).forEach((entry) => {
                const object = {type: Expression.TYPE_TEXT, data: entry};
                if (entry.match(/^\{\{.*\}\}$/)) {
                    object.data = object.data.substring(2, object.data.length - 2);
                    object.type = Expression.TYPE_EXPRESSION;
                } else object.data = "\"" + object.data.replace(/\\/, "\\\\").replace(/"/, "\\\"") + "\"";
                assemble(object);
                cascade.words.push(object);
            });

            // Step 2:
            // Separation of expressions in literal and script as partial words. The
            // expression objects are retained but their value changes from text to
            // array with literal and script as partial words. It was difficult to
            // control the missed quotation marks ('/"). Replacing them with Unicode
            // notation was the easiest way. All other attempts used wild masking
            // and unmasking.

            cascade.expression.forEach((entry) => {
                let text = entry.data;
                text = text.replace(/(^|[^\\])((?:\\{2})*)(\\\')/g, "$1$2\\u0027");
                text = text.replace(/(^|[^\\])((?:\\{2})*)(\\\")/g, "$1$2\\u0022");
                const words = [];
                const pattern = /(^.*?)(([\'\"]).*?(\3|$))/m;
                while (text.match(pattern)) {
                    text = text.replace(pattern, (match, script, literal) => {
                        script = {type: Expression.TYPE_SCRIPT, data: script};
                        assemble(script);
                        words.push(script);
                        literal = {type: Expression.TYPE_LITERAL, data: literal};
                        assemble(literal);
                        words.push(literal);
                        return "";
                    });
                }
                if (text.length > 0) {
                    text = {type: Expression.TYPE_SCRIPT, data: text};
                    assemble(text);
                    words.push(text);
                }
                entry.data = words;
            });

            // Step 3:
            // Converting reserved word (keywords) into operators.
            // supported keywords a nd mapping:
            //     and &&        empty !         div /
            //     eq  ==        eeq   ===       ge  >=
            //     gt  >         le    <=        lt  <
            //     mod %         ne    !=        nee !==
            //     not !         or    ||
            // additional keywords without mapping:
            //     true, false, null, instanceof, typeof, undefined, new
            // Separation of script in keyword and other as partial words.
            // IMPORTANT: KEYWORDS ARE CASE-INSENSITIVE

            const keywords = ["and", "&&", "or", "||", "not", "!",
                "eq", "==", "eeq", "===", "ne", "!=", "nee", "!==", "lt", "<", "gt", ">", "le", "<=", "ge", ">=", "empty", "!",
                "div", "/", "mod", "%"];
            cascade.script.forEach((entry) => {
                let text = entry.data;
                for (let loop = 0; loop < keywords.length; loop += 2) {
                    const pattern = new RegExp("(^|[^\\w\\.])(" + keywords[loop] + ")(?=[^\\w\\.]|$)", "ig");
                    text = text.replace(pattern, "$1\n\r" + keywords[loop + 1] + "\n");
                }
                text = text.replace(/(^|[^\w\.])(true|false|null|instanceof|typeof|undefined|new)(?=[^\w\.]|$)/ig, (match, script, keyword) => {
                    return script + "\n\r" + keyword.toLowerCase() + "\n";
                });
                const words = [];
                text.split(/\n/).forEach((entry) => {
                    const object = {type: Expression.TYPE_OTHER, data: entry};
                    if (entry.match(/^\r/)) {
                        object.data = entry.substring(1);
                        object.type = Expression.TYPE_KEYWORD;
                    }
                    assemble(object);
                    words.push(object);
                });
                entry.data = words;
            });

            // Step 4:
            // Detection of value- and method-expressions
            //     method expression: (^|[^\w\.])(#?[a-zA-Z](?:[\w\.]*[\w])*)(?=\()
            // The expression is followed by a round bracket.
            //     value expression: (^|[^\w\.])(#?[a-zA-Z](?:[\w\.]*[\w])*(?=(?:[^\w\(\.]|$)))
            // The expression is followed by a non-word character or the end.

            cascade.other.forEach((entry) => {
                let text = entry.data;
                text = text.replace(/(^|[^\w\.])(#?[a-z](?:[\w\.]{0,}\w)?(?=(?:[^\w\(\.]|$)))/gi, "$1\n\r\r$2\n");
                text = text.replace(/(^|[^\w\.])(#?[a-z](?:[\w\.]{0,}\w)?)(?=\()/gi, "$1\n\r$2\n");
                const words = [];
                text.split(/\n/).forEach((entry) => {
                    const object = {type: Expression.TYPE_LOGIC, data: entry};
                    if (entry.match(/^\r\r/)) {
                        object.data = "Expression.lookup(\"" + entry.substring(2) + "\")";
                        object.type = Expression.TYPE_VALUE;
                    } else if (entry.match(/^\r[^\r]/)) {
                        object.data = entry.substring(1);
                        if (object.data.match(/^#[a-z]/i))
                            object.data = "Expression.lookup(\"" + object.data + "\")";
                        object.type = Expression.TYPE_METHOD;
                    }
                    assemble(object);
                    words.push(object);
                });
                entry.data = words;
            });

            // Step 5:
            // Create a flat sequence from the cascade.

            const words = [];
            const merge = (word) => {
                if (Array.isArray(word))
                    word.forEach((entry) => {
                        merge(entry);
                    });
                else if (Array.isArray(word.data))
                    word.data.forEach((entry) => {
                        merge(entry);
                    });
                else if (typeof word.data === "string")
                    if (word.data
                        && word.data.length)
                        words.push(word);
                    else
                        merge(word.data);
            };
            merge(cascade.words);

            // Step 6:
            // Create a script from the word sequence. The possible word types:
            //     text, literal, keyword, value, method, logic
            // Text and expression are always separated by brackets.
            //     e.g. text + (expression) + text + ...
            // The line break characters are misused for marking the transitions
            // from text to expression.

            let script = "";
            words.forEach((word) => {
                if (word.type === Expression.TYPE_TEXT)
                    script += "\n" + word.data + "\r";
                else if (word.type === Expression.TYPE_KEYWORD)
                    script += " " + word.data + " ";
                else if (word.type === Expression.TYPE_LITERAL
                    || word.type === Expression.TYPE_VALUE
                    || word.type === Expression.TYPE_METHOD
                    || word.type === Expression.TYPE_LOGIC)
                    script += word.data;
            });
            script = script.replace(/(^\n)|(\r$)/g, "");
            if (script.match(/\r[^\n]*$/))
                script += ")";
            if (script.match(/^[^\r]*\n/))
                script = "(" + script;
            script = script.replace(/(\n\r)+/g, " + ");
            script = script.replace(/\r/g, " + (");
            script = script.replace(/\n/g, ") + ");
            script = script.replace(/(^\s*\+\s*)|(\s*\+\s*$)/, "");

            return script;
        },

        /**
         * Interprets the passed expression. In case of an error, the error is
         * returned and no exception is thrown. A serial can be specified
         * optionally. The serial is an alias for caching compiled expressions.
         * Without, the expressions are always compiled. The function uses variable
         * parameters and has the following signatures:
         *     function(expression)
         *     function(serial, expression)
         * @param  serial
         * @param  expression
         * @return the return value of the interpreted expression or an error if an
         *     error or exception has occurred
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

            let script = serial ? _cache.get(serial) : null;
            if (!script)
                script = Expression.parse(expression);
            if (serial)
                _cache.set(serial, script);

            try {
                return eval(script);
            } catch (exception) {
                exception.message += "\n\t" + script;
                console.error(exception);
                return exception.message;
            }
        }
    });

    /** Cache (expression/script) */
    const _cache = new Map()
})();