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
 * General extension of the JavaScript API for a better use of arguments.
 */
(() => {

    const PATTERN_PRIMITIVE_DATA_TYPES =
        /^array|bigint|boolean|function|number|object|string|symbol|undefined$/;

    const PATTERN_TYPE_DATA_TYPES =
        /^T:([_a-zA-Z]\w*)$/

    const _validate = (argument, pattern, mandatory, throwable) => {

        if (typeof pattern !== "string")
            throw new TypeError("Invalid data type for argument pattern");
        if (!PATTERN_PRIMITIVE_DATA_TYPES.test(pattern)
                && !PATTERN_TYPE_DATA_TYPES.test(pattern))
            throw new Error("Invalid argument pattern");

        if (argument == null) {
            if (!mandatory)
                return true;
            if (!throwable)
                return false;
            if (PATTERN_PRIMITIVE_DATA_TYPES.test(pattern))
                throw new new TypeError("Invalid data type");
            throw new new TypeError("Invalid object type");
        }

        if (PATTERN_PRIMITIVE_DATA_TYPES.test(pattern)) {
            if (typeof argument !== pattern) {
                if (throwable)
                    throw new TypeError("Invalid data type");
                return false;
            }
        } else {
            if (!(argument instanceof window[pattern])) {
                if (throwable)
                    throw new TypeError("Invalid object type");
                return false;
            }
        }

        return true;
    };

    compliant("Arguments");
    compliant(null, window.Arguments = {

        /**
         * Validates the given argument(s) against the specified patterns.
         *
         * This method checks if the provided arguments match the expected
         * primitive or type patterns. It ensures that the arguments conform to
         * the specified data types or class instances. A pattern prefixed with
         * ! indicates that the argument is required and must not be null or
         * undefined. In addition, logical ORs can be used with the | sign if an
         * argument supports different primitive or type patterns.
         *
         * @param {...*} variants The arguments and their corresponding patterns
         *     in pairs like argument, pattern, argument, pattern, ... Even
         *     indexed elements are arguments, and odd indexed elements are
         *     patterns.
         * @param {boolean} [throwable] Optionally, a true or false can be set
         *     as the last parameter; if true, the method will throw an error if
         *     at least one of the arguments does not match the expected
         *     pattern. False uses the boolean return value.
         * @returns {boolean} true if all arguments are valid, otherwise false.
         * @throws  {Error} If the number of arguments is invalid or if an
         *     invalid pattern is encountered.
         */
        validate(...variants) {

            if (variants.length < 2)
                throw new Error("Invalid number of arguments");

            const throwable = ((variants) => {
                if ((variants.length % 2) === 0)
                    return undefined;
                if (typeof variants[variants.length -1] !== "boolean")
                    throw new Error("Invalid number of arguments");
                return variants.pop();
            })(variants);

            while (variants.length > 0) {
                const argument = variants.shift();
                const mandatory = variants[0].startsWith("!");
                const expression = variants.shift().substring(mandatory ? 1 : 0);
                for (const pattern of expression.split("|")) {
                    if (Array.isArray(argument)
                            && pattern !== "array") {
                        for (const entry of argument)
                            if (!_validate(entry, pattern, mandatory, throwable))
                                return false;
                    } else {
                        if (!_validate(argument, pattern, mandatory, throwable))
                            return false;
                    }
                }
            }

            return true;
        }
    });
})();