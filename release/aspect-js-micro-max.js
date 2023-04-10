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
 * General extension of the JavaScript API.
 *
 * @author  Seanox Software Solutions
 * @version 1.6.0 20230326
 */

// Compliant takes over the task that the existing JavaScript API can be
// manipulated in a controlled way. Controlled means that errors occur when
// trying to overwrite existing objects and functions. Originally, the mechanism
// was removed after loading the page, but the feature has proven to be
// convenient for other modules and therefore remains.
//
// In the code, the method is used in an unconventional form.
//
//     compliant("Composite");
//     compliant(null, window.Composite = {...});
//     compliant("Object.prototype.ordinal");
//     compliant(null, Object.prototype.ordinal = function() {...}
//
// This is only for the IDE so that syntax completion has a chance there. This
// syntax will be simplified and corrected in the build process for the
// releases.

if (window.compliant !== undefined)
	throw new Error("JavaScript incompatibility detected for: compliant");
window.compliant = (context, payload) => {
	if (context === null
			|| context === undefined)
		return payload;
	if (new Function(`return typeof ${context}`)() !== "undefined")
		throw new Error("JavaScript incompatibility detected for: " + context);
	return eval(`${context} = payload`);
};

/**
 * Comparable to packages in other programming languages, namespaces can be used
 * for hierarchical structuring of components, resources and business logic.
 * Although packages are not a feature of JavaScript, they can be mapped at the
 * object level by concatenating objects into an object tree. Here, each level
 * of the object tree forms a namespace, which can also be considered a domain.
 *
 * As is typical for the identifiers of objects, namespaces also use letters,
 * numbers and underscores separated by a dot. As a special feature, arrays are
 * also supported. If a layer in the namespace uses an integer, this layer is
 * used as an array.
 */
(() => {

	compliant("Namespace", {

		/** Pattern for the namespace separator */
		get PATTERN_NAMESPACE_SEPARATOR() {return /\./;},

		/** Pattern for a valid namespace level at the beginning */
		get PATTERN_NAMESPACE_LEVEL_START() {return /^[_a-z\$][\w\$]*$/i;},

		/** Pattern for a valid namespace level */
		get PATTERN_NAMESPACE_LEVEL() {return /^[\w\$]+$/;},

		/**
		 * Creates a namespace to the passed object, strings and numbers, if the
		 * namespace contains arrays and the numbers can be used as index.
		 * Levels of the namespace levels are separated by a dot. Levels can as
		 * fragments also contain dots. Without arguments the global namespace
		 * window is returned.
		 *
		 * The method has the following various signatures:
		 *     Namespace.use();
		 *     Namespace.use(string);
		 *     Namespace.use(string, ...string|number);
		 *     Namespace.use(object);
		 *     Namespace.use(object, ...string|number);
		 *
		 * @param  levels of the namespace
		 * @return the created or already existing object(-level)
		 * @throws An error occurs in case of invalid data types or syntax
		 */
		use(...levels) {

			if (levels.length <= 0)
				return window;

			_filter(...levels);

			let offset = levels.length;
			let namespace = null;
			if (levels.length > 0
					&& typeof levels[0] === "object")
				namespace = levels.shift();
			offset -= levels.length;

			levels = levels.join(".");
			levels.split(Namespace.PATTERN_NAMESPACE_SEPARATOR).forEach((level, index, array) => {

				const pattern = index === 0 && namespace === null
						? Namespace.PATTERN_NAMESPACE_LEVEL_START : Namespace.PATTERN_NAMESPACE_LEVEL;
				if (!level.match(pattern))
					throw new Error(`Invalid namespace at level ${index +1}${level && level.trim() ? ": " + level.trim() : ""}`);

				// Composites use IDs which causes corresponding DOM objects
				// (Element) in the global namespace if there are no
				// corresponding data objects (models). Because namespaces are
				// based on data objects, if an element appears, we assume that
				// a data object does not exist and the recursive search is
				// aborted as unsuccessful.

				if (index === 0
						&& namespace === null) {
					namespace = _populate(namespace, level);
					if (namespace !== undefined
							&& !(namespace instanceof Element))
						return;
					namespace = window;
				}

				const item = _populate(namespace, level);
				const type = typeof item;
				if (type !== "undefined"
						&& type !== "object")
					throw new TypeError(`Invalid namespace type at level ${index +1 +offset}: ${type}`);
				if (item === undefined
						|| item === null
						|| item instanceof Element)
					if (index < array.length -1
							&& array[index +1].match(/^\d+$/))
						namespace[level] = [];
					else namespace[level] = {};
				namespace = _populate(namespace, level);
			});

			return namespace;
		},

		/**
		 * Creates a namespace with an initial value to the passed object,
		 * strings and numbers, if the namespace contains arrays and the numbers
		 * can be used as index. Levels of the namespace levels are separated by
		 * a dot. Levels can as fragments also contain dots. Without arguments,
		 * the global namespace window is used.
		 *
		 * The method has the following various signatures:
		 *     Namespace.create(string, value);
		 *     Namespace.create(string, ...string|number, value);
		 *     Namespace.create(object, value);
		 *     Namespace.create(object, ...string|number, value);
		 *
		 * @param  levels of the namespace
		 * @param  value to initialize/set
		 * @return the created or already existing object(-level)
		 * @throws An error occurs in case of invalid data types or syntax
		 */
		create(...levels) {
			if (levels.length < 2)
				throw new Error("Invalid namespace for creation: Namespace and/or value is missing");
			const value = levels.pop();
			levels = _filter(...levels);
			const level = levels.pop();
			const namespace = Namespace.use(...levels);
			if (namespace === null)
				return null;
			namespace[level] = value;
			return _populate(namespace, level);
		},

		/**
		 * Resolves a namespace and returns the determined object(-level).
		 * If the namespace does not exist, undefined is returned.
		 *
		 * The method has the following various signatures:
		 *     Namespace.lookup();
		 *     Namespace.lookup(string);
		 *     Namespace.lookup(string, ...string|number);
		 *     Namespace.lookup(object);
		 *     Namespace.lookup(object, ...string|number);
		 *
		 * @param  levels of the namespace
		 * @return the determined object(-level)
		 * @throws An error occurs in case of invalid data types or syntax
		 */
		lookup(...levels) {

			if (levels.length <= 0)
				return window;

			_filter(...levels);

			let offset = levels.length;
			let namespace = null;
			if (levels.length > 0
					&& typeof levels[0] === "object")
				namespace = levels.shift();
			offset -= levels.length;

			levels = levels.join(".");
			levels = levels.split(Namespace.PATTERN_NAMESPACE_SEPARATOR);
			for (let index = 0; index < levels.length; index++) {

				const level = levels[index];

				const pattern = index +offset === 0
						? Namespace.PATTERN_NAMESPACE_LEVEL_START : Namespace.PATTERN_NAMESPACE_LEVEL;
				if (!level.match(pattern))
					throw new Error(`Invalid namespace at level ${index +1 +offset}${level && level.trim() ? ": " + level.trim() : ""}`);

				// Composites use IDs which causes corresponding DOM objects
				// (Element) in the global namespace if there are no
				// corresponding data objects (models). Because namespaces are
				// based on data objects, if an element appears, we assume that
				// a data object does not exist and the recursive search is
				// aborted as unsuccessful.

				if (index === 0
						&& namespace === null) {
					namespace = _populate(namespace, level);
					if (namespace !== undefined)
						continue;
					namespace = window;
				}

				namespace = _populate(namespace, level);
				if (namespace === undefined
						|| namespace === null)
					return namespace;

				if (namespace instanceof Element)
					return undefined;
			}

			return namespace;
		},

		/**
		 * Checks whether a namespace exists based on the passed object, strings
		 * and numbers, if the namespace contains arrays and the numbers can be
		 * used as index. Levels of the namespace chain are separated by a dot.
		 * Levels can also be fragments that contain dots. Without arguments the
		 * global namespace window is used.
		 *
		 * The method has the following various signatures:
		 *     Namespace.exists();
		 *     Namespace.exists(string);
		 *     Namespace.exists(string, ...string|number);
		 *     Namespace.exists(object);
		 *     Namespace.exists(object, ...string|number);
		 *
		 * @param  levels of the namespace
		 * @return true if the namespace exists
		 * @throws An error occurs in case of invalid levels or syntax
		 */
		exists(...levels) {
			if (levels.length < 1)
				return false;
			return Object.usable(Namespace.lookup(...levels));
		}
	});

	const _filter = (...levels) => {
		const chain = [];
		levels.forEach((level, index) => {
			if (index === 0
					&& typeof level !== "object"
					&& typeof level !== "string")
				throw new TypeError(`Invalid namespace at level ${index +1}: ${typeof level}`);
			if (index === 0
					&& level === null)
				throw new TypeError(`Invalid namespace at level ${index +1}: null`);
			if (index > 0
					&& typeof level !== "string"
					&& typeof level !== "number")
				throw new TypeError(`Invalid namespace at level ${index +1}: ${typeof level}`);
			level = typeof level === "string"
				? level.split(Namespace.PATTERN_NAMESPACE_SEPARATOR) : [level];
			chain.push(...level);
		});
		return chain;
	};

	const _populate = (namespace, level) => {
		if (namespace && namespace !== window)
			return namespace[level];
		try {return eval(`typeof ${level} !== "undefined" ? ${level} : undefined`);
		} catch (error) {
			if (error instanceof ReferenceError
					&& namespace === window)
				return window[level];
			throw error;
		}
	}
})();

/**
 * Enhancement of the JavaScript API
 * Modifies the method to support node and nodes as NodeList and Array.
 * If the option exclusive is used, existing children will be removed first.
 * @param node      node(s)
 * @param exclusive existing children will be removed first
 */
(() => {
	const _appendChild = Element.prototype.appendChild;
	Element.prototype.appendChild = function(node, exclusive) {
		if (exclusive)
			this.innerHTML = "";
		if (node instanceof Node) {
			_appendChild.call(this, node);
		} else if (Array.isArray(node)
				|| node instanceof NodeList
				|| (Symbol && Symbol.iterator
						&& node && typeof node[Symbol.iterator])) {
			node = Array.from(node);
			for (let loop = 0; loop < node.length; loop++)
				_appendChild.call(this, node[loop]);
		} else _appendChild.call(this, node);
   };
})();

/**
 * Enhancement of the JavaScript API
 * Adds a static function to create an alphanumeric unique (U)UID with fixed size.
 * The quality of the ID is dependent of the length.
 * @param size optional, default is 16
 */
compliant("Math.unique", (size) => {
	size = size || 16;
	if (size < 0)
		size = 16;
	let unique = "";
	for (let loop = 0; loop < size; loop++) {
		const random = Math.floor(Math.random() * Math.floor(26));
		if ((Math.floor(Math.random() *Math.floor(26))) % 2 === 0)
			unique += String(random % 10);
		else unique += String.fromCharCode(65 +random);
	}
	return unique;
});

/**
 * Enhancement of the JavaScript API
 * Adds a static function to create a time based alphanumeric serial that is
 * chronologically sortable as text and contains the time and a counter if
 * serial are created at the same time.
 */
(() => {
	compliant("Math.serial", () =>
		_serial.toString());
	const _offset = -946684800000;
	const _serial = {timing:new Date().getTime() + _offset, number:0,
		toString() {
			const timing = new Date().getTime() + _offset;
			this.number = this.timing === timing ? this.number +1 : 0;
			this.timing = timing;
			const serial = this.timing.toString(36);
			const number = this.number.toString(36);
			return (serial.length.toString(36) + serial
				+ number.length.toString(36) + number).toUpperCase();
		}};
})();

/**
 * Enhancement of the JavaScript API
 * Creates a literal pattern for the specified text.
 * Metacharacters or escape sequences in the text thus lose their meaning.
 * @param  text text to be literalized
 * @return a literal pattern for the specified text
 */
compliant("RegExp.quote", (text) => {
	if (!Object.usable(text))
		return null;
	return String(text).replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
});

/**
 * Enhancement of the JavaScript API
 * Adds a capitalize function to the String objects.
 */
compliant("String.prototype.capitalize", function() {
	if (this.length <= 0)
		return this;
	return this.charAt(0).toUpperCase() + this.slice(1);
});

/**
 * Enhancement of the JavaScript API
 * Adds an uncapitalize function to the String objects.
 */
compliant("String.prototype.uncapitalize", function() {
	if (this.length <= 0)
		return this;
	return this.charAt(0).toLowerCase() + this.slice(1);
});

/**
 * Enhancement of the JavaScript API
 * Adds a function for encoding the string objects in hexadecimal code.
 */
compliant("String.prototype.encodeHex", function() {
	let result = "";
	for (let loop = 0; loop < this.length; loop++) {
		let digit = Number(this.charCodeAt(loop)).toString(16).toUpperCase();
		while (digit.length < 2)
			digit = "0" + digit;
		result += digit;
	}
	return "0x" + result;
});

/**
 * Enhancement of the JavaScript API
 * Adds a function for decoding hexadecimal code to the string objects.
 */
compliant("String.prototype.decodeHex", function() {
	let text = this;
	if (text.match(/^0x/))
		text = text.substring(2);
	let result = "";
	for (let loop = 0; loop < text.length; loop += 2)
		result += String.fromCharCode(parseInt(text.substring(loop, 2), 16));
	return result;
});

/**
 * Enhancement of the JavaScript API
 * Adds a method for encoding Base64.
 */
compliant("String.prototype.encodeBase64", function() {
	try {
		return btoa(encodeURIComponent(this).replace(/%([0-9A-F]{2})/g,
			(match, code) =>
				String.fromCharCode("0x" + code)));
	} catch (error) {
		throw new Error("Malformed character sequence");
	}
});

/**
 * Enhancement of the JavaScript API
 * Adds a method for decoding Base64.
 */
compliant("String.prototype.decodeBase64", function() {
	try {
		return decodeURIComponent(atob(this).split("").map((code) =>
			"%" + ("00" + code.charCodeAt(0).toString(16)).slice(-2)).join(""));
	} catch (error) {
		throw new Error("Malformed character sequence");
	}
});

/**
 * Enhancement of the JavaScript API
 * Adds an HTML encode function to the String objects.
 */
compliant("String.prototype.encodeHtml", function() {
	const element = document.createElement("div");
	element.textContent = this;
	return element.innerHTML;
});

/**
 * Enhancement of the JavaScript API
 * Adds a method for calculating a hash value.
 */
compliant("String.prototype.hashCode", function() {
	if (this.hash !== undefined
			&& this.hash !== 0)
		return this.hash;
	this.hash = 0;
	let hops = 0;
	for (let loop = 0; loop < this.length; loop++) {
		const temp = 31 *this.hash +this.charCodeAt(loop);
		if (!Number.isSafeInteger(temp)) {
			hops++;
			this.hash = Number.MAX_SAFE_INTEGER -this.hash +this.charCodeAt(loop);
		} else this.hash = temp;
	}
	this.hash = Math.abs(this.hash).toString(36);
	this.hash = this.hash.length.toString(36) + this.hash;
	this.hash = (this.hash + hops.toString(36)).toUpperCase();
	return this.hash;
});

/**
 * Enhancement of the JavaScript API
 * Adds a decoding of slash sequences (control characters).
 */
compliant("String.prototype.unescape", function() {
	let text = this
		.replace(/\r/g, "\\r")
		.replace(/\n/g, "\\n")
		.replace(/^(["'])/, "\$1")
		.replace(/([^\\])((?:\\{2})*)(?=["'])/g, "$1$2\\");
	return eval(`"${text}"`);
});

/**
 * Enhancement of the JavaScript API
 * Adds a property to get the UID for the window instance.
 */
compliant("window.serial");
Object.defineProperty(window, "serial", {
	value: Math.serial()
});

/**
 * Enhancement of the JavaScript API
 * Adds a property to get the context path.
 * The context path is a part of the request URI and can be compared with the
 * current working directory.
 */
compliant("window.location.pathcontext");
Object.defineProperty(window.location, "pathcontext", {
	value: window.location.pathname.replace(/\/([^\/]*\.[^\/]*){0,}$/g, "") || "/"
});

/**
 * Enhancement of the JavaScript API
 * Adds a method to combine paths to a new one.
 * The result will always start with a slash but ends without it.
 */
compliant("window.location.combine", (...paths) =>
	"/" + paths.join("/")
		.replace(/[\/\\]+/g, "/")
		.replace(/(^\/+)|(\/+$)/g, ""));

/**
 * DataSource is a NoSQL approach to data storage based on XML data in
 * combination with multilingual data separation, optional aggregation and
 * transformation.
 * A combination of the approaches of a read only DBS and a CMS.
 *
 * Files are defined by locator.
 * A locator is a URL (xml://... or xslt://...) that is used absolute and
 * relative to the DataSource directory, but does not contain a locale
 * (language specification) in the path. The locale is determined automatically
 * for the language setting of the browser, or if this is not supported, the
 * standard from the locales.xml in the DataSource directory is used.
 *
 * DataSource is based on static data.
 * Therefore, the implementation uses a cache to minimize network access.
 *
 * The data is queried with XPath, the result can be concatenated and
 * aggregated and the result can be transformed with XSLT.
 *
 * @author  Seanox Software Solutions
 * @version 1.6.0 20230317
 */
(() => {

	/** Path of the DataSource for: data (sub-directory of work path) */
	const DATA = window.location.combine(window.location.pathcontext, "/data");

	/**
	 * Pattern for a DataSource locator, based on the URL syntax but only
	 * the parts schema and path are used. A path segment begins with a word
	 * character _ a-z 0-9, optionally more word characters and additionally
	 * - can follow, but can not end with the - character. Paths are
	 * separated by the / character.
	 */
	const PATTERN_LOCATOR = /^(?:([a-z]+):\/+)(\/((\w+)|(\w+(\-+\w+)+)))+$/;

	/** Pattern to detect JavaScript elements */
	const PATTERN_JAVASCRIPT = /^\s*text\s*\/\s*javascript\s*$/i;

	/** Pattern to detect a word (_ 0-9 a-z A-Z -) */
	const PATTERN_WORD = /(^\w+$)|(^((\w+\-+(?=\w))+)\w*$)/;

	/** Constant for attribute type */
	const ATTRIBUTE_TYPE = "type";

	compliant("DataSource", {

		/** The currently used language. */
		get locale() {return DataSource.locales ? DataSource.locales.selection : null;},

		/**
		 * Changes the localization of the DataSource.
		 * Only locales from locales.xml can be used, other values cause an
		 * error.
		 * @param  locale
		 * @throws Error in the case of invalid locales
		 */
		localize(locale) {

			if (!DataSource.data
					|| !DataSource.locales)
				throw new Error("Locale not available");

			if (typeof locale !== "string")
				throw new TypeError("Invalid locale: " + typeof locale);

			locale = (locale || "").trim().toLowerCase();
			if (!locale
					|| !DataSource.locales.includes(locale))
				throw new Error("Locale not available");

			DataSource.locales.selection = locale;
		},

		/**
		 * Transforms an XMLDocument based on a passed stylesheet.
		 * The data and the stylesheet can be passed as Locator, XMLDocument an
		 * in mix. The result as a DocumentFragment. Optionally, a meta object
		 * or a map with parameters for the XSLTProcessor can be passed.
		 * @param  xml   locator or XMLDocument
		 * @param  style locator or XMLDocument
		 * @param  meta  optional parameters for the XSLTProcessor
		 * @return the transformation result as a DocumentFragment
		 */
		transform(xml, style, meta) {

			if (typeof xml === "string"
					&& xml.match(PATTERN_LOCATOR))
				xml = DataSource.fetch(xml);

			if (typeof style === "string"
					&& style.match(PATTERN_LOCATOR))
				style = DataSource.fetch(style);

			if (!(xml instanceof XMLDocument))
				throw new TypeError("Invalid xml document");
			if (!(style instanceof XMLDocument))
				throw new TypeError("Invalid xml stylesheet");

			const processor = new XSLTProcessor();
			processor.importStylesheet(style);
			if (meta && typeof meta === "object") {
				const set = typeof meta[Symbol.iterator] !== "function" ? Object.entries(meta) : meta
				for (const [key, value] of set)
					if (typeof meta[key] !== "function")
						processor.setParameter(null, key, value);
			}

			// Attribute escape converts text to HTML. Without, HTML tag symbols
			// < and > are masked and output as text.
			let escape = xml.evaluate("string(/*/@escape)", xml, null, XPathResult.ANY_TYPE, null).stringValue;
			escape = !!escape.match(/^yes|on|true|1$/i);

			// Workaround for some browsers, e.g. MS Edge, if they have problems
			// with !DOCTYPE + !ENTITY. Therefore the document is copied so that
			// the DOCTYPE declaration is omitted.
			let result = processor.transformToDocument(xml.clone());
			let nodes = result.querySelectorAll(escape ? "*" : "*[escape]");
			nodes.forEach((node) => {
				if (escape || (node.getAttribute("escape") || "on").match(/^yes|on|true|1$/i)) {
					const content = node.innerHTML;
					if (content.indexOf("<") < 0
							&& content.indexOf(">") < 0)
						node.innerHTML = node.textContent;
				}
				node.removeAttribute("escape");
			});

			// JavaScript are automatically changed to composite/javascript
			// during the import. Therefore, imported scripts are not executed
			// directly, but only by the renderer. This is important in
			// combination with ATTRIBUTE_CONDITION.
			nodes = result.querySelectorAll("script[type],script:not([type])");
			nodes.forEach((node) => {
				if (!node.hasAttribute(ATTRIBUTE_TYPE)
						|| (node.getAttribute(ATTRIBUTE_TYPE) || "").match(PATTERN_JAVASCRIPT))
					node.setAttribute("type", "composite/javascript");
			});

			nodes = result.childNodes;
			if (result.body)
				nodes = result.body.childNodes;
			else if (result.firstChild
					&& result.firstChild.nodeName.match(/^transformiix\b/i))
				nodes = result.firstChild.childNodes;
			const fragment = document.createDocumentFragment();
			nodes = Array.from(nodes);
			for (let loop = 0; loop < nodes.length; loop++)
				fragment.appendChild(nodes[loop]);
			return fragment;
		},

		/**
		 * Fetch the data to a locator as XMLDocument.
		 * Optionally the data can be transformed via XSLT, for which a meta
		 * object or map with parameters for the XSLTProcessor can be passed.
		 * When using the transformation, the return type changes to a
		 * DocumentFragment.
		 * @param  locators  locator
		 * @param  transform locator of the transformation style
		 *     With the boolean true, the style is derived from the locator by
		 *     using the file extension xslt.
		 * @param  meta      optional parameters for the XSLTProcessor
		 * @return the fetched data as XMLDocument or as DocumentFragment, if
		 *     the transformation is used
		 * @throws Error in the case of invalid arguments
		 */
		fetch(locator, transform, meta) {

			if (typeof locator !== "string"
					|| !locator.match(PATTERN_LOCATOR))
				throw new Error("Invalid locator: " + String(locator));

			const type = locator.match(PATTERN_LOCATOR)[1];
			const path = locator.match(PATTERN_LOCATOR)[2];

			if (arguments.length === 1) {

				let data = DATA + "/" + DataSource.locale + "/" + path + "." + type;
				data = data.replace(/\/+/g, "/");
				const hash = data.hashCode();
				if (_cache.hasOwnProperty(hash))
					return _cache[hash];

				const request = new XMLHttpRequest();
				request.overrideMimeType("application/xslt+xml");
				request.open("GET", data, false);
				request.send();
				if (request.status !== 200)
					throw new Error(`HTTP status ${request.status} for ${request.responseURL}`);
				data = request.responseXML;
				_cache[hash] = data;

				return data.clone();
			}

			if (!type.match(/^xml$/)
					&& transform)
				throw new Error("Transformation is not supported for this locator");

			const data = DataSource.fetch(locator);
			if (!transform)
				return data.clone();

			let style = locator.replace(/(^((\w+\-+(?=\w))+)\w*)|(^\w+)/, "xslt");
			if (typeof transform !== "boolean") {
				style = transform;
				if (typeof style !== "string"
						|| !style.match(PATTERN_LOCATOR))
					throw new Error("Invalid style: " + String(style));
			}

			return DataSource.transform(data, DataSource.fetch(style), meta);
		},

		/**
		 * Collects and concatenates multiple XML files in a new XMLDocument.
		 * The method has the following various signatures:
		 *     DataSource.collect(locator, ...);
		 *     DataSource.collect(collector, [locators]);
		 * @param  collector name of the collector element in the XMLDocument
		 * @param  locators  Array or VarArg with locators
		 * @return the created XMLDocument, otherwise null
		 * @throws Error in the case of invalid arguments
		 */
		collect(...variants) {

			if (variants.length <= 0)
				return null;

			let collection = [];

			let collector = "collection";
			if (variants.length === 2
					&& typeof variants[0] === "string"
					&& Array.isArray(variants[1])) {
				if (!variants[0].match(PATTERN_WORD))
					throw new TypeError("Invalid collector");
				collector = variants[0];
				collection = Array.from(variants[1]);
			} else if (variants.length === 1
					&& Array.isArray(variants[0])) {
				collection = collection.concat(variants[0]);
			} else collection = Array.from(variants);

			let hash = collector.hashCode() + ":" + collection.join().hashCode();
			collection.forEach((entry) =>
				hash += ":" + String(entry).hashCode());
			if (_cache.hasOwnProperty(hash))
				return _cache[hash].clone();

			const root = document.implementation.createDocument(null, collector, null);
			collection.forEach((entry) => {
				if (typeof entry !== "string")
					throw new TypeError("Invalid collection entry");
				root.documentElement.appendChild(DataSource.fetch(entry).documentElement.cloneNode(true));
			});

			_cache[hash] = root;
			return root.clone();
		}
	});

	/**
	 * Enhancement of the JavaScript API
	 * Adds a method for cloning a XMLDocument.
	 */
	compliant("XMLDocument.prototype.clone", function() {
		const clone = this.implementation.createDocument(null, null);
		clone.appendChild(clone.importNode(this.documentElement, true));
		return clone;
	});

	// XML/XSLT data cache
	const _cache = {};
	Object.defineProperty(DataSource, "cache", {
		value: {}
	});

	// DataSource.locales
	// List of available locales (as standard marked are at the beginning)
	Object.defineProperty(DataSource, "locales", {
		value: [], enumerable: true
	});

	let locale = [];
	locale = locale.concat(navigator.language);
	if (navigator.languages !== undefined)
		locale = locale.concat(navigator.languages);
	Array.from(locale).forEach((language) => {
		language = language.match(/^[a-z]+/i, "");
		if (language && !locale.includes(language[0]))
			locale.push(language[0]);
	});
	locale = locale.map((language) =>
		language.trim().toLowerCase());
	locale = locale.filter((item, index) =>
		locale.indexOf(item) === index);

	if (locale.length <= 0)
		throw new Error("Locale not available");

	const request = new XMLHttpRequest();
	request.overrideMimeType("text/plain");
	request.open("GET", DATA + "/locales.xml", false);
	request.send();

	// DataSource.data
	// Cache of locales.xml, can also be used by other components
	Object.defineProperty(DataSource, "data", {
		value: request.status === 200 ? new DOMParser().parseFromString(request.responseText,"text/xml") : null
	});
	if (!DataSource.data
			&& request.status !== 404)
		throw new Error("Locale not available");

	if (!DataSource.data)
		return;

	let xml = DataSource.data;
	let nodes = xml.evaluate("/locales/*[@default]", xml, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
	for (let node = nodes.iterateNext(); node; node = nodes.iterateNext()) {
		let name = node.nodeName.toLowerCase();
		if (!DataSource.locales.includes(name))
			DataSource.locales.push(name);
	}
	nodes = xml.evaluate("/locales/*", xml, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
	for (let node = nodes.iterateNext(); node; node = nodes.iterateNext()) {
		const name = node.nodeName.toLowerCase();
		if (!DataSource.locales.includes(name))
			DataSource.locales.push(name);
	}

	if (DataSource.locales.length <= 0)
		throw new Error("Locale not available");

	locale.push(DataSource.locales[0]);
	locale = locale.filter(function(locale) {
		return DataSource.locales.includes(locale);
	});

	DataSource.locales.selection = locale.length ? locale[0] : DataSource.locales[0];
})();

/**
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
 * @version 1.6.0 20230304
 */
(() => {

	compliant("messages", {});
	compliant("Messages", {});

	const _localize = DataSource.localize;

	DataSource.localize = (locale) => {

		_localize(locale);

		delete window.messages;
		delete window.Messages;

		window.Messages = {
			customize(label, ...values) {
				let text = Messages[label] || "";
				for (let index = 0; index < values.length; index++)
					text = text.replace(new RegExp("\\{" + index + "\\}", "g"), values[index]);
				return text.replace(/\{\d+\}/g, "");
			}
		}

		const map = new Map();
		const xpath = "/locales/" + DataSource.locale + "/label";
		const result = DataSource.data.evaluate(xpath, DataSource.data, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
		for (let node = result.iterateNext(); node; node = result.iterateNext())
			map.set((node.getAttribute("key") || "").trim(),
				((node.getAttribute("value") || "").trim()
					|| (node.textContent || "").trim()).unescape());
		new Map([...map.entries()].sort()).forEach((value, key) => {
			const match = key.match(/^(?:((?:\w+\.)*\w+)\.)*(\w+)$/);
			if (match) {
				// In order for the object tree to branch from each level, each
				// level must be an object. Therefore, an anonymous object is
				// used for the level, which returns the actual text via
				// Object.prototype.toString().
				const namespace = "messages" + (match[1] ? "." + match[1] : "");
				Object.defineProperty(Namespace.use(namespace), match[2], {
					value: {toString() {return value;}}
				});
				Object.defineProperty(Namespace.use("Messages"), key, {
					value
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

/**
 * Expression language and composite JavaScript are two important components.
 * Both are based on JavaScript enriched with macros. In addition, Composite
 * JavaScript can be loaded at runtime and can itself load other Composite
 * JavaScript scripts. Because in the end everything is based on a simple eval
 * command, it was important to isolate the execution of the scripts so that
 * internal methods and constants cannot be accessed unintentionally.
 *
 * @author  Seanox Software Solutions
 * @version 1.6.0 20230408
 */
(() => {

	compliant("Scripting", {

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
		 *
		 *     #module
		 *     ----
		 * Expected a space-separated list of words to be output in the debug
		 * level of the browser console. The output is a string expression and
		 * supports the corresponding syntax.
		 *
		 *     #module console debug output
		 *
		 *
		 *     #use
		 *     ----
		 * Expected to see a space-separated list of namespaces to create if
		 * they don't already exist.
		 *
		 *     #use namespaces to be created
		 *
		 *
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
						let match = string.match(/(^|\W)(#(?:import|export|module|use))\s/);
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
										const imports = parameters.split(/\s+/).map(entry => "\"" + entry + "\"");
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

									case "#use":
										if (!parameters.match(/^([_a-z]\w*)(\.[_a-z]\w*)*(\s+([_a-z]\w*)(\.[_a-z]\w*)*)*$/i))
											throw new Error(("Invalid macro: #use " + parameters).trim());
										const uses = parameters.split(/\s+/).map(entry => "\"" + entry + "\"");
										macro = "_use(...[" + uses.join(",") + "])";
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

	const _use = (...uses) => {
		uses.forEach(use => Namespace.use(use));
	}

	const _tolerate = (invocation) => {
		try {return invocation.call(window);
		} catch (error) {
			return false;
		}
	};
})();

/**
 * Expressions or the Expression Language (EL) is a simple access to the
 * client-side JavaScript and thus to the models and components. In the
 * expressions the complete JavaScript API is supported, which is enhanced with
 * additional keywords, so that also the numerous arithmetic and logical
 * operators can be used.
 *
 * The expression language can be used from the HTML element BODY on in the
 * complete markup as free text, as well as in all attributes. Exceptions are
 * the HTML elements STYLE and SCRIPT whose content is not supported by the
 * expression language.
 *
 * @author  Seanox Software Solutions
 * @version 1.6.0 20230330
 */
(() => {

	compliant("Expression", {

		/**
		 * Interprets the passed expression. In case of an error, the error is
		 * returned and no error is thrown. A serial can be specified
		 * optionally. The serial is an alias for caching compiled expressions.
		 * Without, the expressions are always compiled. The function uses
		 * variable parameters and has the following signatures:
		 *     function(expression)
		 *     function(serial, expression)
		 * @param  serial
		 * @param  expression
		 * @return the return value of the interpreted expression or an error if
		 *     an error or error has occurred
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
				script = _parse(TYPE_MIXED, expression);
			if (serial)
				_cache.set(serial, script);

			try {return Scripting.run(script);
			} catch (error) {
				console.error(error.message + "\n\t" + script);
				return error.message + " in " + script;
			}
		}
	});

	/** Cache (expression/script) */
	const _cache = new Map();

	const TYPE_MIXED   = 0;
	const TYPE_LITERAL = 1;
	const TYPE_TEXT    = 2;
	const TYPE_SCRIPT  = 3;

	const KEYWORDS = ["and", "&&", "or", "||", "not", "!",
		"eq", "==", "eeq", "===", "ne", "!=", "nee", "!==", "lt", "<", "gt", ">", "le", "<=", "ge", ">=", "empty", "!",
		"div", "/", "mod", "%"];

	const PATTERN_KEYWORDS = new RegExp("(^|[^\\w\\.])("
			+ KEYWORDS.filter((keyword, index) => index % 2 === 0).join("|")
			+ ")(?=[^\\w\\.]|$)", "ig");

	const _fill = (expression, patches) =>
		expression.replace(/[\t\r](\d+)\n/g, (match, id) => patches[id]);

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

				// find all places that contain scripts
				structure = structure.replace(/\{\{(.*?)\}\}/g,
					(match, script) => _parse(TYPE_SCRIPT, script, patches));

				// find all places outside the detected script replacements at
				// the beginning ^...\r and between \n...\r and at the end \n...$
				structure = structure.replace(/((?:[^\n]+$)|(?:[^\n]+(?=\r)))/g,
					(match, text) => _parse(TYPE_TEXT, text, patches));

				// if everything is replaced, the expression must have the
				// following structure, deviations are syntax errors
				if (!structure.match(/^(\r(\d+)\n)*$/))
					throw Error("Error in the expression structure\n\t" + expression);

				// placeholders must be filled, since they were created
				// recursively, they do not have to be filled recursively
				structure = structure.replace(/(?:\r(\d+)\n)/g,
					(match, placeholder) => "\r" + patches[placeholder] + "\n");

				// masked quotation marks will be restored.
				structure = structure.replaceAll("\r\\u0022\n", '\\"');
				structure = structure.replaceAll("\r\\u0027\n", "\\'");
				structure = structure.replaceAll("\r\\u0060\n", "\\`");

				// splices still need to be made scriptable
				structure = structure.replace(/(\n\r)+/g, " + ");
				structure = structure.replace(/(^\r)|(\n$)/g, "");

				// CR/LF of markers must be removed so that the end of line is not
				// interpreted as separation of commands or logic: a\nb == a;b
				structure = structure.replace(/[\r\n]+/g, " ");

				return structure

			case TYPE_TEXT:

				expression = "\"" + expression + "\"";

			case TYPE_LITERAL:

				patches.push(expression);
				return "\r" + (patches.length -1) + "\n";

			case TYPE_SCRIPT:

				expression = expression.trim();
				if (!expression)
					return "";

				// Mask escaped quotes (single and double) so that they are not
				// mistakenly found by the parser as delimiting string/phrase.
				// rule: search for an odd number of slashes followed by quotes
				expression = expression.replace(/(^|[^\\])((?:\\{2})*)(\\\")/g, "$1$2\r\\u0022\n");
				expression = expression.replace(/(^|[^\\])((?:\\{2})*)(\\\')/g, "$1$2\r\\u0027\n");
				expression = expression.replace(/(^|[^\\])((?:\\{2})*)(\\\`)/g, "$1$2\r\\u0060\n");

				// Replace all literals "..." / '...' / `...` with placeholders.
				// This simplifies analysis because text can contain anything
				// and the parser would have to constantly distinguish between
				// logic and text. If the literals are replaced by numeric
				// placeholders, only logic remains. Important is a flexible
				// processing, because the order of ', " and ` is not defined.
				expression = expression.replace(/((['\"\`]).*?\2)/gs,
					(match, literal) => _parse(TYPE_LITERAL, literal, patches));

				// without literals, tabs have no relevance and can be replaced
				// by spaces, and we have and additional internal marker
				expression = expression.replace(/\t+/g, " ");

				// mapping of keywords to operators
				// IMPORTANT: KEYWORDS ARE CASE-INSENSITIVE
				//     and  &&        empty  !         div  /
				//     eq   ==        eeq    ===       ge   >=
				//     gt   >         le     <=        lt   <
				//     mod  %         ne     !=        nee  !==
				//     not  !         or     ||
				expression = expression.replace(PATTERN_KEYWORDS, (match, group1, group2) =>
					group1 + KEYWORDS[KEYWORDS.indexOf(group2.toLowerCase()) +1]
				);

				// Keywords must be replaced by placeholders so that they are
				// not interpreted as variables. Keywords are case-insensitive.
				expression = expression.replace(/(^|[^\w\.])(true|false|null|undefined|new|instanceof|typeof)(?=[^\w\.]|$)/ig,
					(match, group1 = "", group2 = "") =>
						group1 + group2.toLowerCase());

				// element expressions are translated into JavaScript
				//
				//     #[element] -> document.getElementById(element)
				//     #element   -> document.getElementById(element)
				//
				// The version with square brackets is for more complex element
				// IDs that do not follow the JavaScript syntax for variables.
				//
				// The order is important because the complex element ID, if the
				// target uses unique identifiers, may contain a # that should
				// not be misinterpreted.
				expression = expression.replace(/#\[([^\[\]]*)\]/g,
					(match, element) => {
						patches.push(_fill("document.getElementById(\"" + element + "\")", patches));
						return "\r" + (patches.length -1) + "\n";
				});
				expression = expression.replace(/#([_a-z]\w*)/ig,
					(match, element) => {
						patches.push(_fill("document.getElementById(\"" + element + "\")", patches));
						return "\r" + (patches.length -1) + "\n";
				});

				// (?...) tolerates the enclosed code. If an error occurs there,
				// the expression will be false, but will not cause the error
				// itself. This is convenient if you want check/use references
				// or variables that do not yet exist or errors of methods are
				// to be suppressed.

				// To avoid complicated parsing of round brackets, bracket
				// expressions that have no other round bracket expressions are
				// iteratively replaced by placeholders \t...\n. At the end
				// there should be no more brackets.

				if (expression.match(/\(\s*\?/)) {
					for (let counts = -1; counts < patches.length;) {
						counts = patches.length;
						expression = expression.replace(/(\([^\(\)]*\))/g, match => {
							match = match.replace(/^\( *\?+ *(.*?) *\)$/s, (match, logic) =>
								"_tolerate(()=>(" + logic + "))");
							patches.push(_fill(match, patches));
							return "\t" + (patches.length -1) + "\n";
						});
					}
				}

				// small optimization by merging spaces
				expression = expression.replace(/ {2,}/g, " ");

				patches.push(_fill(expression, patches));
				return "\r" + (patches.length -1) + "\n";

			default:
				throw new Error("Unexpected script type");
		}
	};
})();

/**
 * With aspect-js the declarative approach of HTML is taken up and extended.
 * In addition to the expression language, the HTML elements are provided with
 * additional attributes for functions and view model binding. The corresponding
 * renderer is included in the composite implementation and actively monitors
 * the DOM via the MutationObserver and thus reacts recursively to changes in
 * the DOM.
 *
 * This is the static component for rendering and the view model binding.
 * Processing runs in the background and starts automatically when the page is
 * loaded.
 *
 *
 *     TERMS
 *     ----
 *
 *         namespace
 *         ----
 * Comparable to packages in other programming languages, namespaces can be used
 * for hierarchical structuring of components, resources and business logic.
 * Although packages are not a feature of JavaScript, they can be mapped at the
 * object level by concatenating objects into an object tree. Here, each level
 * of the object tree forms a namespace, which can also be considered a domain.
 *
 * As is typical for the identifiers of objects, namespaces also use letters,
 * numbers and underscores separated by a dot. As a special feature, arrays are
 * also supported. If a layer in the namespace uses an integer, this layer is
 * used as an array.
 *
 *         model
 *         ----
 * Models are representable/projectable static JavaScript objects that can
 * provide and receive data, states and interactions for views, comparable to
 * managed beans and DTOs (Data Transfer Objects). As singleton/facade/delegate,
 * they can use other components and abstractions, contain business logic
 * themselves, and be a link between the user interface (view) and middleware
 * (backend).
 *
 * The required view model binding is part of the Model View Controller and the
 * Composite API.
 *
 *         property
 *         ----
 * Is a property in a static model (model component / component). It
 * corresponds to an HTML element with the same ID in the same namespace. The
 * ID of the property can be relative or use an absolute namespace. If the ID
 * is relative, the namespace is defined by the parent composite element.
 *
 *         qualifier
 *         ----
 * In some cases, the identifier (ID) may not be unique. For example, in cases
 * where properties are arrays or an iteration is used. In these cases the
 * identifier can be extended by an additional unique qualifier separated by a
 * colon. Qualifiers behave like properties during view model binding and extend
 * the namespace.
 *
 *        unique
 *        ----
 * In some cases it is necessary that different things in the view refer to a
 * target in the corresponding model. However, if these things must still be
 * unique in the view, a unique identifier can be used in addition to the
 * qualifier, separated by a hash. This identifier then has no influence on the
 * composite logic and is used exclusively for the view.
 *
 *         composite
 *         ----
 * Composite describes a construct of markup (view), JavaScript object (model),
 * CSS and possibly other resources. It describes a component/module without
 * direct relation to the representation.
 *
 *         composite-id
 *         ----
 * It is a character sequence consisting of letters, numbers and underscores
 * and optionally supports the minus sign if it is not used at the beginning or
 * end. A composite ID is at least one character long and is composed by
 * combining the attributes ID and COMPOSITE.
 *
 *
 *     PRINCIPLES
 *     ----
 *
 * The world is static. So also aspect-js and all components. This avoids the
 * management and establishment of instances.
 *
 * Attributes ID and COMPOSITE are elementary and immutable.
 * They are read the first time an element occurs and stored in the object
 * cache. Therefore, these attributes cannot be changed later because they are
 * then used from the object cache.
 *
 * Attributes of elements are elementary and immutable even if they contain an
 * expression.
 *
 * Clean Code Rendering - The aspect-js relevant attributes are stored in meta
 * objects to each element and are removed in the markup. The following
 * attributes are essential: COMPOSITE, ID -- they are cached and remain at the
 * markup, these cannot be changed. the MutationObserver will restore them.
 *
 * Markup/DOM, object tree and virtual paths are analog/homogeneous.
 * Thus virtual paths, object structure in JavaScript (namespace) and the
 * nesting of the DOM must match.
 *
 * @author  Seanox Software Solutions
 * @version 1.6.0 20230402
 */
(() => {

	compliant("Composite", {

		// Against the trend, the constants of the composite are public so that
		// they can be used by extensions.

		/** Path of the Composite for: modules (sub-directory of work path) */
		get MODULES() {return window.location.combine(window.location.pathcontext, "/modules");},

		/** Constant for attribute composite */
		get ATTRIBUTE_COMPOSITE() {return "composite";},

		/** Constant for attribute condition */
		get ATTRIBUTE_CONDITION() {return "condition";},

		/** Constant for attribute events */
		get ATTRIBUTE_EVENTS() {return "events";},

		/** Constant for attribute id */
		get ATTRIBUTE_ID() {return "id";},

		/** Constant for attribute import */
		get ATTRIBUTE_IMPORT() {return "import";},

		/** Constant for attribute interval */
		get ATTRIBUTE_INTERVAL() {return "interval";},

		/** Constant for attribute iterate */
		get ATTRIBUTE_ITERATE() {return "iterate";},

		/** Constant for attribute message */
		get ATTRIBUTE_MESSAGE() {return "message";},

		/** Constant for attribute namespace */
		get ATTRIBUTE_NAMESPACE() {return "namespace";},

		/** Constant for attribute notification */
		get ATTRIBUTE_NOTIFICATION() {return "notification";},

		/** Constant for attribute name */
		get ATTRIBUTE_NAME() {return "name";},

		/** Constant for attribute output */
		get ATTRIBUTE_OUTPUT() {return "output";},

		/** Constant for attribute render */
		get ATTRIBUTE_RENDER() {return "render";},

		/** Constant for attribute release */
		get ATTRIBUTE_RELEASE() {return "release";},

		/** Constant for attribute strict */
		get ATTRIBUTE_STRICT() {return "strict";},

		/** Constant for attribute text */
		get ATTRIBUTE_TEXT() {return "text";},

		/** Constant for attribute type */
		get ATTRIBUTE_TYPE() {return "type";},

		/** Constant for attribute validate */
		get ATTRIBUTE_VALIDATE() {return "validate";},

		/** Constant for attribute value */
		get ATTRIBUTE_VALUE() {return "value";},

		/**
		 * Pattern for all accepted attributes.
		 * Accepted attributes are all attributes, even without an expression
		 * that is cached in the meta-object. Other attributes are only cached
		 * if they contain an expression.
		 */
		get PATTERN_ATTRIBUTE_ACCEPT() {return /^(composite|condition|events|id|import|interval|iterate|message|namespace|notification|output|release|render|strict|validate)$/i;},

		/**
		 * Pattern for all static attributes.
		 * Static attributes are not removed from the element during rendering,
		 * but are also set in the meta-object like non-static attributes. These
		 * attributes are also intended for direct use in JavaScript and CSS.
		 */
		get PATTERN_ATTRIBUTE_STATIC() {return /^(composite|id)$/i;},

		/**
		 * Pattern to detect if a string contains an expression.
		 * Escaping characters via slash is supported.
		 */
		get PATTERN_EXPRESSION_CONTAINS() {return /\{\{(.|\r|\n)*?\}\}/g;},

		/**
		 * Patterns for condition expressions.
		 * Conditions are explicitly a single expression and not a variable
		 * expression.
		 */
		get PATTERN_EXPRESSION_CONDITION() {return /^\s*\{\{\s*(([^}]|(}(?!})))*?)\s*\}\}\s*$/i;},

		/**
		 * Patterns for expressions with variable.
		 * Variables are at the beginning of the expression and are separated
		 * from the expression by a colon. The variable name must conform to the
		 * usual JavaScript conditions and starts with _ or a letter, other word
		 * characters (_ 0-9 a-z A-Z) may follow.
		 * - group 1: variable
		 * - group 2: expression
		 */
		get PATTERN_EXPRESSION_VARIABLE() {return /^\s*\{\{\s*((?:(?:_*[a-z])|(?:_\w*))\w*)\s*:\s*(([^}]|(}(?!})))*?)\s*\}\}\s*$/i;},

		/** Pattern for all to ignore (script-)elements */
		get PATTERN_ELEMENT_IGNORE() {return /script|style/i;},

		/** Pattern for all script elements */
		get PATTERN_SCRIPT() {return /script/i;},

		/**
		 * Pattern for all composite-script elements.
		 * These elements are not automatically executed by the browser but must
		 * be triggered by rendering. Therefore, these scripts can be combined
		 * and controlled with ATTRIBUTE_CONDITION.
		 */
		get PATTERN_COMPOSITE_SCRIPT() {return /^composite\/javascript$/i;},

		/** Pattern for a composite id (based on a word) */
		get PATTERN_COMPOSITE_ID() {return /^[_a-z]\w*$/i;},

		/**
		 * Pattern for an element id (e.g. name:qualifier...@model...)
		 * - group 1: name
		 * - group 2: qualifier(s) (optional)
		 * - group 3: unique identifier (optional)
		 * - group 4: (namespace+)model (optional)
		 */
		get PATTERN_ELEMENT_ID() {return /^([_a-z]\w*)((?::\w+)*)?(#\w+)?(@[_a-z]\w*(?::[_a-z]\w*)*)?$/i;},

		/** Pattern for a scope (custom tag, based on a word) */
		get PATTERN_CUSTOMIZE_SCOPE() {return /[_a-z]([\w-]*\w)?$/i;},

		/** Pattern for a datasource url */
		get PATTERN_DATASOURCE_URL() {return /^\s*xml:\s*(\/\S+)\s*(?:\s*(?:xslt|xsl):\s*(\/\S+))*$/i;},

		/** Pattern for all accepted events */
		get PATTERN_EVENT() {return /^([A-Z][a-z]+)+$/;},

		/** Constants of events during rendering */
		get EVENT_RENDER_START() {return "RenderStart";},
		get EVENT_RENDER_NEXT() {return "RenderNext";},
		get EVENT_RENDER_END() {return "RenderEnd";},

		/** Constants of events during mounting */
		get EVENT_MOUNT_START() {return "MountStart";},
		get EVENT_MOUNT_NEXT() {return "MountNext";},
		get EVENT_MOUNT_END() {return "MountEnd";},

		/** Constants of events when using HTTP */
		get EVENT_HTTP_START() {return "HttpStart";},
		get EVENT_HTTP_PROGRESS() {return "HttpProgress";},
		get EVENT_HTTP_RECEIVE() {return "HttpReceive";},
		get EVENT_HTTP_LOAD() {return "HttpLoad";},
		get EVENT_HTTP_ABORT() {return "HttpAbort";},
		get EVENT_HTTP_TIMEOUT() {return "HttpTimeout";},
		get EVENT_HTTP_ERROR() {return "HttpError";},
		get EVENT_HTTP_END() {return "HttpEnd";},

		/** Constants of events when errors occur */
		get EVENT_ERROR() {return "Error";},

		/**
		 * List of possible DOM events
		 * see also https://www.w3schools.com/jsref/dom_obj_event.asp
		 */
		get EVENTS() {return "abort after|print animation|end animation|iteration animation|start"
				+ " before|print before|unload blur"
				+ " can|play can|play|through change click context|menu copy cut"
				+ " dbl|click drag drag|end drag|enter drag|leave drag|over drag|start drop duration|change"
				+ " ended error"
				+ " focus focus|in focus|out"
				+ " hash|change"
				+ " input invalid"
				+ " key|down key|press key|up"
				+ " load loaded|data loaded|meta|data load|start"
				+ " message mouse|down mouse|enter mouse|leave mouse|move mouse|over mouse|out mouse|up mouse|wheel"
				+ " offline online open"
				+ " page|hide page|show paste pause play playing popstate progress"
				+ " rate|change resize reset"
				+ " scroll search seeked seeking select show stalled storage submit suspend"
				+ " time|update toggle touch|cancel touch|end touch|move touch|start transition|end"
				+ " unload"
				+ " volume|change"
				+ " waiting wheel";},

		/** Patterns with the supported events */
		get PATTERN_EVENT_FUNCTIONS() {return (() => {
			const pattern = Composite.EVENTS.replace(/(?:\||\b)(\w)/g, (match, letter) =>
			   letter.toUpperCase());
			return new RegExp("^on(" + pattern.replace(/\s+/g, "|") + ")");
		})();},

		/** Patterns with the supported events as plain array */
		get PATTERN_EVENT_NAMES() {return (() => {
			return Composite.EVENTS.replace(/(?:\||\b)(\w)/g, (match, letter) =>
				letter.toUpperCase()).split(/\s+/);
		})();},

		/** Patterns with the supported events as plain array (lower case) */
		get PATTERN_EVENT_FILTER() {return (() => {
			return Composite.EVENTS.replace(/(?:\||\b)(\w)/g, (match, letter) =>
				letter.toUpperCase()).toLowerCase().split(/\s+/);
		})();},

		/**
		 * Lock mechanism for methods: render, mound and scan. The lock controls
		 * that the methods are not used concurrently and/or asynchronously.
		 * Each method opens its own transaction (lock). During a transaction,
		 * the method call requires a lock. If this lock does not exist or
		 * differs from the current transaction, the method call is parked in a
		 * queue until the current lock is released. The methods themselves can
		 * call themselves recursively and do so with the lock they know. In
		 * addition to the lock mechanism, the methods also control the START,
		 * NEXT, and END events.
		 * @param  context  method (render, mound or scan)
		 * @param  selector
		 * @return the created lock as meta-object
		 */
		lock(context, selector) {

			context.queue = context.queue || [];

			if (context.lock === undefined
					|| context.lock === false) {
				context.lock = {ticks:1, selector, queue:[],
						share() {
							this.ticks++;
							return this;
						},
						release() {
							this.ticks--;
							if (this.ticks > 0)
								return;
							if (context === Composite.render) {

								// To ensure that on conditions when the lock is
								// created for the marker, the children are also
								// mounted, the selector must be switched to the
								// element, because the marker is a text node
								// without children.

								let selector = this.selector;
								if (selector instanceof Node
										&& selector.nodeType === Node.TEXT_NODE) {
									let serial = selector.ordinal();
									let object = _render_meta[serial] || {};
									if (object.condition
											&& object.condition.element
											&& object.condition.marker === this.selector)
										selector = object.condition.element;
								}

								// If the selector is a string, several elements
								// must be assumed, which may or may not have a
								// relation to the DOM. Therefore, they are all
								// considered and mounted separately.

								let nodes = [];
								if (typeof selector === "string") {
									const scope = document.querySelectorAll(selector);
									Array.from(scope).forEach((node) => {
										if (!nodes.includes(node))
											nodes.push(node);
										const scope = node.querySelectorAll("*");
										Array.from(scope).forEach((node) => {
											if (!nodes.includes(node))
												nodes.push(node);
										});
									});
								} else if (selector instanceof Element) {
									nodes = selector.querySelectorAll("*");
									nodes = [selector].concat(Array.from(nodes));
								}

								// Mount all elements in a composite, including
								// the composite element itself
								nodes.forEach((node) =>
									Composite.mount(node));

								Composite.fire(Composite.EVENT_RENDER_END, this.selector);
							} else if (context === Composite.mount) {
								Composite.fire(Composite.EVENT_MOUNT_END, this.selector);
							} else throw new Error("Invalid context: " + context);
							const selector = context.queue.shift();
							if (selector)
								Composite.asynchron(context, selector);
							context.lock = false;
					}};

				if (context === Composite.render)
					Composite.fire(Composite.EVENT_RENDER_START, selector);
				else if (context === Composite.mount)
					Composite.fire(Composite.EVENT_MOUNT_START, selector);
				else throw new Error("Invalid context: " + context);
			} else {
				if (context === Composite.render)
					Composite.fire(Composite.EVENT_RENDER_NEXT, selector);
				else if (context === Composite.mount)
					Composite.fire(Composite.EVENT_MOUNT_NEXT, selector);
				else throw new Error("Invalid context: " + context);
			}

			return context.lock;
		},

		/**
		 * Registers a callback function for composite events.
		 * @param  event    see Composite.EVENT_***
		 * @param  callback callback function
		 * @throws An error occurs in the following cases:
		 *     - event is not valid or is not supported
		 *     - callback is not implemented correctly or does not exist
		 */
		listen(event, callback) {

			if (typeof event !== "string")
				throw new TypeError("Invalid event: " + typeof event);
			if (typeof callback !== "function"
					&& callback !== null
					&& callback !== undefined)
				throw new TypeError("Invalid callback: " + typeof callback);
			if (!event.match(Composite.PATTERN_EVENT))
				throw new Error(`Invalid event${event.trim() ? ": " + event : ""}`);

			event = event.toLowerCase();
			if (!_listeners.has(event)
					|| !Array.isArray(_listeners.get(event)))
				_listeners.set(event, []);
			_listeners.get(event).push(callback);
		},

		/**
		 * Triggers an event.
		 * All callback functions for this event are called.
		 * @param event    see Composite.EVENT_***
		 * @param variants up to five additional optional arguments that are
		 *     passed as arguments when the callback function is called
		 */
		fire(event, ...variants) {
			event = (event || "").trim();
			if (_listeners.size <= 0
					|| !event)
				return;
			const listeners = _listeners.get(event.toLowerCase());
			if (!Array.isArray(listeners))
				return;
			variants = [event, ...variants];
			listeners.forEach((callback) =>
				callback(...variants));
		},

		/**
		 * Asynchronous or in reality non-blocking call of a function. Because
		 * the asynchronous execution is not possible without Web Worker.
		 * @param task     function to be executed
		 * @param variants up to five additional optional arguments that are
		 *     passed as arguments when the callback function is called
		 */
		asynchron(task, ...variants) {
			window.setTimeout((invoke, ...variants) => {
				invoke(...variants);
			}, 0, task, ...variants);
		},

		/**
		 * Validates the as selector passed element(s), if the element(s) are
		 * marked with ATTRIBUTE_VALIDATE, a two-step validation is performed.
		 * In the first step, the HTML5 validation is checked if it exists. If
		 * this validation is valid or does not exist, the model based
		 * validation is executed if it exists. For this purpose, the static
		 * method validate is expected in the model. The current element and the
		 * current value (if available) are passed as arguments.
		 *
		 * The validation can have four states:
		 *
		 *     true, not true, text, undefined/void
		 *
		 *         true
		 *         ----
		 * The validation was successful. No error is displayed and the default
		 * action of the browser is used. If possible the value is synchronized
		 * with the model.
		 *
		 *         not true and not undefined/void
		 *         ----
		 * The validation failed; an error is displayed. An existing return
		 * value indicates that the default action of the browser should not be
		 * executed and so it is blocked. In this case, a possible value is not
		 * synchronized with the model.
		 *
		 *         text
		 *         ----
		 * Text corresponds to: Invalid + error message. If the error message is
		 * empty, the message from ATTRIBUTE_MESSAGE is used alternatively.
		 *
		 *         undefined/void
		 *         ----
		 * The validation failed; an error is displayed. No return value
		 * indicates that the default action of the browser should nevertheless
		 * be executed. This behavior is important e.g. for the validation of
		 * input fields, so that the input reaches the user interface. In this
		 * case, a possible value is not synchronized with the model.
		 *
		 * @param  selector selector
		 * @param  lock     unlocking of the model validation
		 * @return validation result
		 *     true, false, undefined/void
		 */
		validate(selector, lock) {

			if (arguments.length < 2
					|| lock !== false)
				lock = true;

			if (typeof selector === "string") {
				selector = selector.trim();
				if (!selector)
					return;
				let validate = Array.from(document.querySelectorAll(selector));
				validate.forEach((node, index) => {
					validate[index] = Composite.validate(node, lock);
					if (validate[index] === undefined)
						validate[index] = 0;
					else validate[index] = validate[index] === true ? 1 : 2;
				});
				validate = validate.join("");
				if (validate.match(/^1+$/))
					return true;
				if (validate.match(/2/))
					return false;
				return;
			}

			if (!(selector instanceof Element))
				return;

			const serial = selector.ordinal();
			const object = _render_meta[serial];

			let valid = true;

			// Resets the customer-specific error.
			// This is necessary for the checkValidity method to work.
			if (typeof selector.setCustomValidity === "function")
				selector.setCustomValidity("");

			// Explicit validation via HTML5. If the validation fails, model
			// validation and synchronization is not and rendering always
			// performed. In this case the event and thus the default action of
			// the browser is cancelled.
			if (typeof selector.checkValidity === "function")
				valid = selector.checkValidity();

			// There can be a corresponding model.
			const meta = _mount_lookup(selector);
			if (meta instanceof Object) {

				// Validation is a function at the model level. If a composite
				// consists of several model levels, the validation may have to
				// be organized accordingly if necessary. Interactive composite
				// elements are a property object. Therefore, they are primarily
				// a property and the validation is located in the surrounding
				// model and not in the property object itself.

				let value;
				if (selector instanceof Element) {
					if (selector.tagName.match(/^input$/i)
							&& selector.type.match(/^radio|checkbox/i))
						value = selector.checked;
					else if (selector.tagName.match(/^select/i)
							&& "selectedIndex" in selector)
						value = selector.options[selector.selectedIndex].value;
					else if (Composite.ATTRIBUTE_VALUE in selector)
						value = selector[Composite.ATTRIBUTE_VALUE];
				}

				// Implicit validation via the model, if a corresponding
				// validate method is implemented. The validation through the
				// model only works if the corresponding composite is
				// active/present in the DOM!
				if (object.attributes.hasOwnProperty(Composite.ATTRIBUTE_VALIDATE)
						&& valid === true
						&& lock !== true
						&& typeof meta.model[Composite.ATTRIBUTE_VALIDATE] === "function") {
					const validate = meta.model[Composite.ATTRIBUTE_VALIDATE];
					if (value !== undefined)
						valid = validate.call(meta.model, selector, value);
					else valid = validate.call(meta.model, selector);
				}
			}

			// ATTRIBUTE_VALIDATE can be combined with ATTRIBUTE_MESSAGE and
			// ATTRIBUTE_NOTIFICATION. However, ATTRIBUTE_MESSAGE and
			// ATTRIBUTE_NOTIFICATION have no effect without ATTRIBUTE_VALIDATE.
			// The value of the ATTRIBUTE_MESSAGE is used as an error message if
			// the validation was not successful. To output the error message,
			// the browser function of the HTML5 form validation is used. This
			// message is displayed via mouse-over. If ATTRIBUTE_NOTIFICATION is
			// also used, a value is not expected, the message is output as
			// overlay/notification/report.
			if (valid !== true) {
				let message;
				if (typeof valid === "string"
						&& valid.trim())
					message = valid.trim();
				if (typeof message !== "string") {
					if (object.attributes.hasOwnProperty(Composite.ATTRIBUTE_MESSAGE))
						message = String(object.attributes[Composite.ATTRIBUTE_MESSAGE] || "");
					if ((message || "").match(Composite.PATTERN_EXPRESSION_CONTAINS))
						message = String(Expression.eval(serial + ":" + Composite.ATTRIBUTE_MESSAGE, message));
				}
				if (typeof selector.setCustomValidity === "function"
						&& Object.usable(message)) {
					selector.setCustomValidity(message);
					if (object.attributes.hasOwnProperty(Composite.ATTRIBUTE_NOTIFICATION)
							&& typeof selector.reportValidity === "function")
						selector.reportValidity();
				}
			}

			if (valid === undefined)
				return;
			return valid;
		},

		/**
		 * Mounts the as selector passed element(s) with all its children where
		 * a view model binding is possible. Mount is possible for all elements
		 * with ATTRIBUTE_ID, not only for composite objects and their children.
		 *
		 * View-model binding is about linking of HTML elements in markup (view)
		 * with corresponding JavaScript objects (models).
		 *
		 * Models are representable/projectable static JavaScript objects that
		 * can provide and receive data, states and interactions for views,
		 * comparable to managed beans and DTOs. As singleton/facade/delegate,
		 * they can use other components and abstractions, contain business
		 * logic themselves, and be a link between the user interface (view) and
		 * middleware (backend).
		 *
		 * The required view model binding is part of the Model View Controller
		 * and the Composite API.
		 *
		 * The view as presentation and user interface for interactions and the
		 * model are primarily decoupled. For the MVVM approach as an extension
		 * of the MVC, the controller establishes the bidirectional connection
		 * between view and model, which means that no manual implementation and
		 * declaration of events, interaction or synchronization is required.
		 *
		 *     Principles
		 *     ----
		 * Components are a static JavaScript objects (models). Namespaces are
		 * supported, but they must be syntactically valid. Objects in objects
		 * is possible through the namespaces (as static inner class).
		 *
		 *     Binding
		 *     ----
		 * The object constraint only includes what has been implemented in the
		 * model (snapshot). An automatic extension of the models at runtime by
		 * the renderer is not detected/supported, but can be implemented in the
		 * application logic - this is a conscious decision!
		 *     Case study:
		 * In the markup there is a composite with a property x. There is a
		 * corresponding JavaScript object (model) for the composite but without
		 * the property x. The renderer will mount the composite with the
		 * JavaScript model, the property x will not be found in the model and
		 * will be ignored. At runtime, the model is modified later and the
		 * property x is added. The renderer will not detect the change in the
		 * model and the property x will not be mounted during re-rendering.
		 * Only when the composite is completely removed from the DOM (e.g. by a
		 * condition) and then newly added to the DOM, the property x is also
		 * mounted, because the renderer then uses the current snapshot of the
		 * model and the property x also exists in the model.
		 *
		 *     Validation
		 *     ----
		 * Details are described to Composite.validate(selector, lock)
		 *
		 *     Synchronization
		 *     ----
		 * View model binding and synchronization assume that a corresponding
		 * static JavaScript object/model exists in the same namespace for the
		 * composite. During synchronization, the element must also exist as a
		 * property in the model. Accepted are properties with a primitive data
		 * type and objects with a property value. The synchronization expects a
		 * positive validation, otherwise it will not be executed.
		 *
		 *     Invocation
		 *     ---
		 * For events, actions can be implemented in the model. Actions are
		 * static methods in the model whose name begins with 'on' and is
		 * followed by the name (camel case) of the event. As an argument, the
		 * occurring event is passed. The action methods can have a return
		 * value, but do not have to. If their return value is false, the event
		 * and thus the default action of the browser is cancelled. The
		 * invocation expects a positive validation, otherwise it will not be
		 * executed.
		 *
		 *     Events
		 *     ----
		 * Composite.EVENT_MOUNT_START
		 * Composite.EVENT_MOUNT_NEXT
		 * Composite.EVENT_MOUNT_END
		 *
		 *     Queue and Lock:
		 *     ----
		 * The method used a simple queue and transaction management so that the
		 * concurrent execution of rendering works sequentially in the order of
		 * the method call.
		 *
		 * @param  selector
		 * @param  lock
		 * @throws An error occurs in the following cases:
		 *     - namespace is not valid or is not supported
		 *     - namespace cannot be created if it already exists as a method
		 */
		mount(selector, lock) {

			Composite.mount.queue = Composite.mount.queue || [];

			// The lock locks concurrent mount requests.
			// Concurrent mounting causes unexpected effects.
			if (Composite.mount.lock
					&& Composite.mount.lock !== lock) {
				if (!Composite.mount.queue.includes(selector))
					Composite.mount.queue.push(selector);
				return;
			}

			lock = Composite.lock(Composite.mount, selector);

			try {

				if (typeof selector === "string") {
					selector = selector.trim();
					if (!selector)
						return;
					const nodes = document.querySelectorAll(selector);
					nodes.forEach((node) =>
						Composite.mount(node, lock.share()));
					return;
				}

				// Exclusive for elements
				// and without multiple object binding
				// and script and style elements are not supported
				if (!(selector instanceof Element)
						|| Composite.mount.queue.includes(selector)
						|| selector.nodeName.match(Composite.PATTERN_ELEMENT_IGNORE))
					return;

				// An element/selector should only be mounted once.
				Composite.mount.stack = Composite.mount.stack || [];
				if (Composite.mount.stack.includes(selector))
					return;

				const serial = selector.ordinal();
				const object = _render_meta[serial];

				// Objects that were not rendered should not be mounted. This
				// can happen if new DOM elements are created during rendering
				// that are rendered later.
				if (!(object instanceof Object))
					return;

				// The explicit events are declared by ATTRIBUTE_EVENTS. The
				// model can, but does not have to, implement the corresponding
				// method. Explicit events are mainly used to synchronize view
				// and model and to trigger targets of ATTRIBUTE_RENDER.
				let events = object.attributes.hasOwnProperty(Composite.ATTRIBUTE_EVENTS)
						? object.attributes[Composite.ATTRIBUTE_EVENTS] : "";
				events = String(events || "");
				events = events.toLowerCase().split(/\s+/);
				events = events.filter((event, index, array) => Composite.PATTERN_EVENT_FILTER.includes(event)
						&& array.indexOf(event) === index);

				// There must be a corresponding model.
				const meta = _mount_lookup(selector);
				if (meta instanceof Object) {

					// The implicit assignment is based on the on-event-methods
					// implemented in the model. These are determined and added
					// to the list of events if the events have not yet been
					// explicitly declared.

					// Events are possible for composites and their interactive
					// elements. For this purpose, composites define the scope
					// with their model. Interactive composite elements are an
					// object in the model that contains the interaction methods
					// corresponding to the events. Therefore, the scope of
					// interactive composite elements shifts from the model to
					// the according object. In all cases, a name-based
					// alignment in the model and thus ATTRIBUTE_ID is required
					// Anonymous interaction elements do not have this alignment
					// and no scope can be determined.

					let model = meta.model;
					if (meta.target !== undefined)
						if (typeof meta.target === "object")
							model = meta.target;
						else model = null;

					for (let entry in model)
						if (typeof model[entry] === "function"
								&& entry.match(Composite.PATTERN_EVENT_FUNCTIONS)) {
							entry = entry.substring(2).toLowerCase();
							if (!events.includes(entry))
								events.push(entry);
						}

					let prototype = model ? Object.getPrototypeOf(model) : null;
					while (prototype) {
						Object.getOwnPropertyNames(prototype).forEach(entry => {
							if (typeof model[entry] === "function"
									&& entry.match(Composite.PATTERN_EVENT_FUNCTIONS)) {
								entry = entry.substring(2).toLowerCase();
								if (!events.includes(entry))
									events.push(entry);
							}
						});
						prototype = Object.getPrototypeOf(prototype);
					}
				}

				// The determined events are registered.
				Composite.mount.stack.push(selector);
				events.forEach((event) => {
					selector.addEventListener(event.toLowerCase(), (event) => {

						const target = event.currentTarget;
						const serial = target.ordinal();
						const object = _render_meta[serial];

						let action = event.type.toLowerCase();
						if (!Composite.PATTERN_EVENT_FILTER.includes(action))
							return;
						action = Composite.PATTERN_EVENT_FILTER.indexOf(action);
						action = Composite.PATTERN_EVENT_NAMES[action];

						let result;

						// Step 1: Validation

						let valid = Composite.validate(target, false);

						// There must be a corresponding model.
						const meta = _mount_lookup(target);
						if (meta instanceof Object) {

							let value;
							if (target instanceof Element) {
								if (target.tagName.match(/^input$/i)
										&& target.type.match(/^radio|checkbox/i))
									value = target.checked;
								else if (target.tagName.match(/^select/i)
										&& "selectedIndex" in target)
									value = target.options[target.selectedIndex].value;
								else if (Composite.ATTRIBUTE_VALUE in target)
									value = target[Composite.ATTRIBUTE_VALUE];
							}

							// In case of a failed validation, the event and the
							// default action of the browser will be canceled,
							// if additionally ATTRIBUTE_STRICT is used. The use
							// of ATTRIBUTE_STRICT became necessary, because
							// otherwise invalid inputs are not passed on to the
							// model, which however it is desirable in some
							// cases, if in the view also erroneous is to be
							// reflected.
							if (!object.attributes.hasOwnProperty(Composite.ATTRIBUTE_STRICT)
									|| valid === true) {

								// Step 2: Synchronisation

								// Synchronization expects a data field. It can
								// be a simple data type or an object with the
								// property value. Other targets are ignored.
								// The synchronization expects a successful
								// validation, otherwise it will not be executed.
								const accept = (property) => {
									const type = typeof property;
									if (property === undefined)
										return false;
									if (type === "object"
											&& property === null)
										return true;
									return type === "boolean"
										|| type === "number"
										|| type === "string";
								};

								// A composite is planned as a container for
								// sub-elements. Theoretically, an input element
								// can also be a composite and thus both model
								// and input element / data field. In this case,
								// a composite can assign a value to itself.
								if (accept(meta.target)) {
									meta.target = value;
								} else if (typeof meta.target === "object") {
									if (accept(meta.target["value"]))
										meta.target["value"] = value;
								} else if (meta.target === undefined) {
									if (accept(meta.model["value"]))
										meta.model["value"] = value;
								}

								// Step 3: Invocation

								// Events are possible for composites and their
								// interactive elements. For this purpose,
								// composites define the scope with their model.
								// Interactive composite elements are an object
								// in the model that contains the interaction
								// methods corresponding to the events.
								// Therefore, the scope of interactive composite
								// elements shifts from the model to the
								// according object. In all cases, a name-based
								// alignment in the model and thus ATTRIBUTE_ID
								// is required. Anonymous interaction elements
								// do not have this alignment and no scope can
								// be determined.

								let model = meta.model;
								if (meta.target !== undefined)
									if (meta.target
											&& typeof meta.target === "object")
										model = meta.target;
									else model = null;

								// For the event, a corresponding method is
								// searched in the model that can be called. If
								// their return value is false, the event and
								// thus the default action of the browser is
								// cancelled. The invocation expects a positive
								// validation, otherwise it will not be executed.
								if (model && typeof model["on" + action] === "function")
									result = model["on" + action].call(model, event);
							}
						}

						// Step 4: Rendering

						// Rendering is performed in all cases. When an event
						// occurs, all elements that correspond to the query
						// selector rendering are updated.
						let events = object.attributes.hasOwnProperty(Composite.ATTRIBUTE_EVENTS)
								? object.attributes[Composite.ATTRIBUTE_EVENTS] : "";
						events = String(events || "");
						events = events.toLowerCase().split(/\s+/);
						if (events.includes(action.toLowerCase())) {
							let render = object.attributes.hasOwnProperty(Composite.ATTRIBUTE_RENDER)
									? object.attributes[Composite.ATTRIBUTE_RENDER] : "";
							render = String(render || "");
							if ((render || "").match(Composite.PATTERN_EXPRESSION_CONTAINS))
								render = Expression.eval(serial + ":" + Composite.ATTRIBUTE_RENDER, render);
							Composite.render(render);
						}

						if (meta instanceof Object) {
							if ((result !== undefined && !result)
									|| (valid !== undefined && valid !== true))
								event.preventDefault();
							if (result !== undefined)
								return result;
						}
					});
				});
			} finally {
				lock.release();
			}
		},

		/**
		 * There are several ways to customize the renderer.
		 *
		 *     Custom Tag (Macro)
		 *     ----
		 * Macros are completely user-specific. The return value determines
		 * whether the standard functions are used or not. Only the return value
		 * false (not void, not empty) terminates the rendering for the macro
		 * without using the standard functions of the rendering.
		 *
		 *     Composite.customize(tag:string, function(element) {...});
		 *
		 *     Custom Selector
		 *     ----
		 * Selectors work similar to macros. Unlike macros, selectors use a CSS
		 * selector to detect elements. This selector must match the current
		 * element from the point of view of the parent. Selectors are more
		 * flexible and multifunctional. Therefore, different selectors and thus
		 * different functions can match one element. In this case, all
		 * implemented callback methods are performed. The return value
		 * determines whether the loop is aborted or not. Only the return value
		 * false (not void, not empty) terminates the loop over other selectors
		 * and the rendering for the selector without using the standard
		 * functions of the rendering.
		 *
		 *     Composite.customize(selector:string, function(element) {...});
		 *
		 * Macros and selectors are based on a text key. If this key is used
		 * more than once, existing macros and selectors will be overwritten.
		 *
		 *     Custom Acceptor
		 *     ---
		 * Acceptors are a very special way to customize. Unlike the other ways,
		 * here the rendering is not shifted into own implementations. With an
		 * acceptor, an element is manipulated before rendering and only if the
		 * renderer processes the element initially. This makes it possible to
		 * make individual changes to the attributes or the markup before the
		 * renderer processes them. This does not affect the implementation of
		 * the rendering.
		 *
		 *     Composite.customize(function(element) {...});
		 *
		 *     Configuration
		 *     ---
		 * The customize method also supports the configuration of the
		 * composite. For this purpose, the parameter and the value are passed.
		 *
		 *     Composite.customize(parameter:string, value);
		 *
		 * Parameters start with @ and thereby differ from Acceptor/Selector/Tag.
		 *
		 *     @ATTRIBUTES-STATICS
		 * Static attributes are a component of the hardening of the markup.
		 * These attributes are observed by the renderer and manipulation is
		 * made more difficult by restoring the original value. As value one or
		 * more attributes separated by spaces are expected. The method can be
		 * called several times. This has a cumulative effect and the attributes
		 * are collected. It is not possible to remove attributes.
		 *
		 *     Composite.customize("@ATTRIBUTES-STATICS", "...");
		 *
		 * @param  variants
		 * @throws An error occurs in the following cases:
		 *     - namespace is not valid or is not supported
		 *     - callback function is not implemented correctly
		 */
		customize(...variants) {

			let scope;
			if (variants.length > 0)
				scope = variants[0];

			// STATIC is used for hardening attributes in markup. Hardening
			// makes the manipulation of attributes more difficult. At runtime,
			// additional attributes can be declared as static. However, this
			// function is not cheap, since the values of the attributes used at
			// that time must be determined for all elements to be restored, for
			// which purpose the complete DOM is analyzed (full DOM scan). The
			// composite-specific static attributes (PATTERN_ATTRIBUTE_ACCEPT)
			// are excluded from this function because they are already actively
			// monitored by the MutationObserver.
			if (typeof scope === "string"
					&& variants.length > 1
					&& typeof variants[1] === "string"
					&& scope.match(/^@ATTRIBUTES-STATICS$/i)) {
				const changes = [];
				const statics = (variants[1] || "").trim().split(/\s+/);
				statics.forEach((entry) => {
					entry = entry.toLowerCase();
					if (!_statics.has(entry)
							&& !entry.match(Composite.PATTERN_ATTRIBUTE_ACCEPT)) {
						_statics.add(entry);
						changes.push(entry);
					}
				});
				const scanning = (element) => {
					if (!(element instanceof Element))
						return;
					const serial = element.ordinal();
					const object = _render_meta[serial];
					if (!object)
						return;
					changes.forEach((attribute) => {
						object.statics = object.statics || {};
						if (object.statics.hasOwnProperty[attribute]
								&& object.statics[attribute] !== undefined)
							return;
						if (element.hasAttribute(attribute))
							object.statics[attribute] = element.getAttribute(attribute);
						else object.statics[attribute] = null;
					});
					Array.from(element.childNodes).forEach((node) =>
						scanning(node));
				};
				scanning(document.body);
				return;
			}

			// If only one argument of type function is passed, the method is
			// registered as an acceptor.
			if (typeof scope === "function"
					&& variants.length === 1) {
				_acceptors.add(scope);
				return;
			}

			// Custom tags, here also called macro, are based on a
			// case-insensitive tag name (key) and a render function (value). In
			// this function, the tag name and the render functions are
			// registered and a RegExp will be created so that the custom tags
			// can be found faster.
			if (typeof scope !== "string")
				throw new TypeError("Invalid scope: " + typeof scope);
			const callback = variants.length > 1 ? variants[1] : null;
			if (typeof callback !== "function"
					&& callback !== null
					&& callback !== undefined)
				throw new TypeError("Invalid callback: " + typeof callback);
			scope = scope.trim();
			if (scope.length <= 0)
				throw new Error("Invalid scope");

			if (scope.match(Composite.PATTERN_CUSTOMIZE_SCOPE)) {
				if (callback === null)
					_macros.delete(scope.toLowerCase());
				else _macros.set(scope.toLowerCase(), callback);
			} else {
				const hash = scope.toLowerCase().hashCode();
				if (callback === null)
					_selectors.delete(hash);
				else _selectors.set(hash, {selector:scope, callback});
			}
		},

		/**
		 * Rendering involves updating and, if necessary, reconstructing an HTML
		 * element and all its children. The declarative commands for rendering
		 * (attributes) and the expression language are executed.
		 *
		 *     Queue and Lock:
		 *     ----
		 * The method used a simple queue and transaction management so that the
		 * concurrent execution of rendering works sequentially in the order of
		 * the method call.
		 *
		 *     Element Meta Object
		 *     ----
		 * With the processed HTML elements and text nodes, simplified meta
		 * objects are created. The serial, the reference on the HTML element
		 * and the initial attributes (which are required for rendering) are
		 * stored there.
		 *
		 *     Serial
		 *     ----
		 * Serial is a special extension of the JavaScript API of the object and
		 * creates a unique ID for each object. This ID can be used to compare,
		 * map and reference a wide variety of objects. Composite and rendering
		 * use serial, since this cannot be changed via the markup.
		 *
		 * The following attributes and elements are supported:
		 *
		 * - Attributes:
		 *     COMPOSITE    INTERVAL        OUTPUT
		 *     CONDITION    ITERATE         RELEASE
		 *     EVENTS       MESSAGE         RENDER
		 *     ID           NAMESPACE       VALIDATE
		 *     IMPORT       NOTIFICATION
		 *
		 * - Expression Language
		 * - Scripting
		 * - Customizing
		 *   Tag, Selector, Acceptor
		 *
		 * Details are described in the documentation:
		 * https://github.com/seanox/aspect-js/blob/master/manual/en/markup.md#contents-overview
		 *
		 * @param selector
		 * @param lock
		 */
		render(selector, lock) {

			Composite.render.queue = Composite.render.queue || [];
			if (!selector
					&& Composite.render.queue.length <= 0)
				return;

			// The lock locks concurrent render requests. Concurrent rendering
			// causes unexpected states due to manipulations at the DOM. HTML
			// elements that are currently being processed can be omitted or
			// replaced from the DOM. Access to parent and child elements may
			// then no longer be possible.
			if (Composite.render.lock
					&& Composite.render.lock !== lock) {
				if (!Composite.render.queue.includes(selector))
					Composite.render.queue.push(selector);
				Composite.asynchron(Composite.render);
				return;
			}

			if (!selector)
				selector = Composite.render.queue[0];

			lock = Composite.lock(Composite.render, selector);

			const origin = selector;

			try {

				if (typeof selector === "string") {
					selector = selector.trim();
					if (!selector)
						return;
					const nodes = document.querySelectorAll(selector);
					nodes.forEach((node) =>
						Composite.render(node, lock.share()));
					return;
				}

				if (!(selector instanceof Node))
					return;

				// If a custom tag exists, the macro is executed. Macros are
				// completely user-specific. The return value determines whether
				// the standard functions are used or not. Only the return value
				// false (not void, not empty) terminates the rendering for the
				// macro without using the standard functions.
				const macro = _macros.get(selector.nodeName.toLowerCase());
				if (macro && macro(selector) === false)
					return;

				// If a custom selector exists, the macro is executed. Selectors
				// work similar to macros. Unlike macros, selectors use a CSS
				// selector to detect elements. This selector must match the
				// current element from the point of view of the parent.
				// Selectors are more flexible and multifunctional. Therefore,
				// different selectors and thus different functions can match
				// one element. In this case, all implemented callback methods
				// are performed. The return value determines whether the loop
				// is aborted or not. Only the return value false (not void, not
				// empty) terminates the loop and the rendering for the selector
				// without using the standard functions.
				if (selector.parentNode) {
					for (const [key, macro] of _selectors) {
						const nodes = selector.parentNode.querySelectorAll(macro.selector);
						if (Array.from(nodes).includes(selector)) {
							if (macro.callback(selector) === false)
								return;
						}
					}
				}

				// Register each analyzed node/element and minimizes multiple
				// analysis. For registration, the serial of the node/element is
				// used. The node prototype has been enhanced with creation and
				// a get-function. During the analysis, the attributes of an
				// element (not node) containing an expression or all allowed
				// attributes are cached in the memory (_render_meta).
				let serial = selector.ordinal();
				let object = _render_meta[serial];
				if (!object) {

					// Acceptors are a very special way to customize. Unlike the
					// other ways, here the rendering is not shifted into own
					// implementations. With an acceptor, an element is
					// manipulated before rendering and only if the renderer
					// processes the element initially. This makes it possible
					// to make individual changes to the attributes or the
					// markup before the renderer processes them. This does not
					// affect the implementation of the rendering.
					// Example of the method call with an acceptor:
					//     Composite.customize(function(element) {...});
					_acceptors.forEach((acceptor) =>
						acceptor.call(null, selector));

					object = {serial, element:selector, attributes:{}};
					_render_meta[serial] = object;
					if ((selector instanceof Element)
							&& selector.attributes) {
						Array.from(selector.attributes).forEach((attribute) => {
							attribute = {name:attribute.name.toLowerCase(), value:(attribute.value || "").trim()};
							if (attribute.value.match(Composite.PATTERN_EXPRESSION_CONTAINS)
									|| attribute.name.match(Composite.PATTERN_ATTRIBUTE_ACCEPT)
									|| _statics.has(attribute.name)) {

								// Remove all internal attributes but not the
								// statics. Static attributes are still used in
								// the markup or for the rendering.
								if (attribute.name.match(Composite.PATTERN_ATTRIBUTE_ACCEPT)
										&& !attribute.name.match(Composite.PATTERN_ATTRIBUTE_STATIC)
										&& !_statics.has(attribute.name)
										&& attribute.name !== Composite.ATTRIBUTE_RELEASE)
									selector.removeAttribute(attribute.name);

								object.attributes[attribute.name] = attribute.value;

								// Special case: ATTRIBUTE_ID/ATTRIBUTE_EVENTS
								// Both attributes are used initially for the
								// object and event binding. Expressions are
								// supported for the attributes, but these are
								// only initially resolved during the first
								// rendering.

								// Special case: static attributes
								// These attributes are used initially markup
								// harding. Expressions are supported for the
								// attributes, but these are only initially
								// resolved during the first rendering.

								if (attribute.value.match(Composite.PATTERN_EXPRESSION_CONTAINS)
										&& (attribute.name.match(Composite.PATTERN_ATTRIBUTE_STATIC)
												|| attribute.name === Composite.ATTRIBUTE_ID
												|| attribute.name === Composite.ATTRIBUTE_EVENTS
												|| _statics.has(attribute.name)))
									attribute.value = Expression.eval(selector.ordinal() + ":" + attribute.name, attribute.value);

								// The initial value of the static attribute is
								// registered for the restore. This is a part of
								// the markup hardening of the MutationObserver.
								if (attribute.name.match(Composite.PATTERN_ATTRIBUTE_STATIC)
										|| attribute.name === Composite.ATTRIBUTE_ID
										|| attribute.name === Composite.ATTRIBUTE_EVENTS)
									object.attributes[attribute.name] = attribute.value;

								// The initial value of the static attribute is
								// registered for the restore. This is a part of
								// the markup hardening of the MutationObserver.
								object.statics = object.statics || {};
								if (_statics.has(attribute.name))
									object.statics[attribute.name] = attribute.value;

								// The result of the expression must be written
								// back to the static attributes.
								if (attribute.name.match(Composite.PATTERN_ATTRIBUTE_STATIC)
										|| attribute.name === Composite.ATTRIBUTE_ID
										|| attribute.name === Composite.ATTRIBUTE_EVENTS
										|| _statics.has(attribute.name))
									selector.setAttribute(attribute.name, attribute.value);
							}
						});

						// ATTRIBUTE_CONDITION: If an HTML element uses this
						// attribute, a text node is created for the element as
						// a marker with a corresponding meta-object for the
						// details of the element, condition and the outer HTML
						// as a template. Then the HTML element in the DOM is
						// replaced by the marker as text node. The original
						// selector is switched to the text node and rendering
						// continues.

						if (object.attributes.hasOwnProperty(Composite.ATTRIBUTE_CONDITION)) {
							const expression = (object.attributes[Composite.ATTRIBUTE_CONDITION] || "").trim();
							if (!expression.match(Composite.PATTERN_EXPRESSION_CONDITION))
								throw new Error(`Invalid condition${expression ? ": " + expression : ""}`);

							// The marker and its meta-object are created. This
							// prevents the MutationObserver from rendering the
							// marker, because it is then already known.
							const marker = document.createTextNode("");
							const template = selector.cloneNode(true);
							const attributes = object.attributes;
							object = {serial:marker.ordinal(), element:marker, attributes,
								condition:{expression, template, marker, element:null, attributes, complete:false, share:null}};
							_render_meta[object.serial] = object;

							// The meta-object for the HTML element is removed,
							// because only the new marker is relevant.
							delete _render_meta[serial];

							// The marker is initially created and in the DOM.
							selector.parentNode.replaceChild(marker, selector);

							// The rendering of the marker continues
							// recursively, so that objects do not have to be
							// switched/rewritten and the rendering can be
							// finished here.
							Composite.render(marker, lock.share());
							return;
						}

						// Load modules/components/composite resources.
						if (object.attributes.hasOwnProperty(Composite.ATTRIBUTE_COMPOSITE))
							Composite.include(selector);
					}
				}

				// ATTRIBUTE_CONDITION: At this point, the renderer encounters a
				// condition. This can be the marker or the element. Which one
				// exactly is unimportant. In both cases, we decide here what to
				// do and what happens.

				// If the current lock corresponds to the share from the
				// condition object, the rendering for marker and output has
				// already been done and nothing more needs to be done.
				if (object.hasOwnProperty("condition")
						&& object.condition.share === lock.ordinal())
					return;

				// If share absolute does not match the lock, the condition must
				// be validated initially.
				if (object.hasOwnProperty("condition")
						&& Math.abs(object.condition.share || 0) !== lock.ordinal()) {
					object.condition.share = -lock.ordinal();

					// The final rendering is recursive and uses a negated
					// (negative) lock as indicator that the condition has
					// already been validated.

					const condition = object.condition;

					// The condition must be explicitly true, otherwise the
					// output is removed from the DOM and the rendering ends.
					// The cleanup will be done by the MutationObserver.
					if (Expression.eval(serial + ":" + Composite.ATTRIBUTE_CONDITION, condition.expression) !== true) {
						// Because a condition can consist of two elements
						// (marker and conditional element), it can happen that
						// when rendering a NodeList, the marker is hit first,
						// which then deletes the element, and the NodeList
						// still contains the element that has already been
						// deleted. Then this place is also called, but then the
						// node/element has no parent.
						if (condition.element
								&& condition.element.parentNode)
							condition.element.parentNode.removeChild(condition.element);
						condition.element = null;
						condition.share = lock.ordinal();
						return;
					}

					// If the output already exists, the content must be
					// rendered recursively, so that objects do not have to be
					// switched and the rendering can be finished here.
					if (condition.element) {
						Composite.render(condition.element, lock.share());
						return;
					}

					condition.element = condition.template.cloneNode(true);
					const element = condition.element;
					const attributes = Object.assign({}, condition.attributes);
					_render_meta[element.ordinal()] = {serial:element.ordinal(), element, attributes, condition};

					// Load modules/components/composite resources.
					// That no resources are loaded more than once is taken care
					// of by the include method ot Composite.
					if (attributes.hasOwnProperty(Composite.ATTRIBUTE_COMPOSITE))
						Composite.include(element);

					selector.parentNode.insertBefore(element, selector);

					// The rendering of the marker continues recursively, so
					// that objects do not have to be switched/rewritten and the
					// rendering can be finished here.

					Composite.render(condition.element, lock.share());
					return;
				}

				// If share matches the negated lock, then the content must be
				// rendered normally, but only once. Therefore, share is
				// finalized by the positive lock.
				if (object.hasOwnProperty("condition")
						&& object.condition.share !== -lock.ordinal())
					object.condition.share = lock.ordinal();

				// A text node contain static and dynamic contents as well as
				// parameters. Dynamic contents and parameters are formulated
				// as expressions, but only the dynamic contents are output.
				// Parameters are interpreted, but do not generate any output.
				// During initial processing, a text node is analyzed and, if
				// necessary, split into static content, dynamic content and
				// parameters. To do this, the original text node is replaced by
				// new separate text nodes:
				//     e.g. "text {{expr}} + {{var:expr}}"
				//              ->  ["text ", {{expr}}, " + ", {{var:expr}}]
				//
				// When the text nodes are split, meta-objects are created for
				// them. The meta-objects are compatible with the meta-objects
				// of the rendering methods but use the additional attributes:
				//     Composite.ATTRIBUTE_TEXT, Composite.ATTRIBUTE_NAME and
				//     Composite.ATTRIBUTE_VALUE
				// Only static content uses Composite.ATTRIBUTE_TEXT, dynamic
				// content and parameters use Composite.ATTRIBUTE_VALUE, and
				// only the parameters use Composite.ATTRIBUTE_NAME. The meta
				// objects for dynamic content also have their own rendering
				// method for generating output. Static content is ignored later
				// during rendering because it is unchangeable.
				if (selector.nodeType === Node.TEXT_NODE) {

					// Elements of type: script + style are ignored.
					// No expression is replaced here.
					if (selector.parentNode
							&& selector.parentNode.nodeName.match(Composite.PATTERN_ELEMENT_IGNORE))
						return;

					// Text nodes are only analyzed once. Pure text is
					// completely ignored, only text nodes with an expression as
					// value are updated.
					if (object.attributes.hasOwnProperty(Composite.ATTRIBUTE_TEXT))
						return;

					// New/unknown text nodes must be analyzed and prepared. If
					// the meta-object for text nodes Composite.ATTRIBUTE_TEXT
					// and Composite.ATTRIBUTE_VALUE are not contained, it must
					// be new.
					if (object.attributes.hasOwnProperty(Composite.ATTRIBUTE_VALUE)) {
						object.render();
						return;
					}

					// Step 1:
					// If the text node does not contain an expression, the
					// content is static. Static text nodes are marked with the
					// attribute Composite.ATTRIBUTE_TEXT.

					let content = selector.textContent;
					if (content.match(Composite.PATTERN_EXPRESSION_CONTAINS)) {

						// Step 2:
						// All expressions are determined. A meta-object is
						// created for all expressions. In the text content from
						// the text node, the expressions are replaced by a
						// placeholder in the format of the expression with a
						// serial. Empty expressions are removed/ignored.

						// All created meta-objects with an expression have a
						// special render method for updating the text content
						// of the text node.

						// Step 3:
						// The format of the expression distinguishes whether it
						// is a parameter or an output expression. Parameter
						// expressions start with the name of the parameter and
						// are interpreted later, but do not generate any output.

						content = content.replace(Composite.PATTERN_EXPRESSION_CONTAINS, (match) => {
							if (!match.substring(2, match.length -2).trim())
								return "";
							const node = document.createTextNode("");
							const serial = node.ordinal();
							const object = {serial, element:node, attributes:{}, value:null,
								render() {
									let word = "";
									if (this.attributes.hasOwnProperty(Composite.ATTRIBUTE_NAME)) {
										const name = String(this.attributes[Composite.ATTRIBUTE_NAME] || "").trim();
										const value = String(this.attributes[Composite.ATTRIBUTE_VALUE] || "").trim();
										window[name] = Expression.eval(this.serial + ":" + Composite.ATTRIBUTE_VALUE, value);
									} else {
										word = String(this.attributes[Composite.ATTRIBUTE_VALUE] || "");
										word = Expression.eval(this.serial + ":" + Composite.ATTRIBUTE_VALUE, word);
									}
									this.value = word;
									this.element.textContent = word !== undefined ? word : "";
								}};
								const param = match.match(Composite.PATTERN_EXPRESSION_VARIABLE);
								if (param) {
									object.attributes[Composite.ATTRIBUTE_NAME] = param[1];
									object.attributes[Composite.ATTRIBUTE_VALUE] = "{{" + param[2] + "}}";
								} else object.attributes[Composite.ATTRIBUTE_VALUE] = match;
							_render_meta[serial] = object;
							return "{{" + serial + "}}";
						});

						// Step 4:
						// The prepared text with expression placeholders is
						// analyzed. All placeholders are determined and the
						// text is split at the placeholders. The result is an
						// array of words. Each word is a new text nodes with
						// static text or dynamic content.

						if (content.match(Composite.PATTERN_EXPRESSION_CONTAINS)) {
							const words = content.split(/(\{\{\d+\}\})/);
							words.forEach((word, index, array) => {
								if (word.match(/^\{\{\d+\}\}$/)) {
									const serial = parseInt(word.substring(2, word.length -2).trim());
									const object = _render_meta[serial];
									Composite.fire(Composite.EVENT_RENDER_NEXT, object.element);
									object.render();
									array[index] = object.element;
								} else {
									const node = document.createTextNode(word);
									const serial = node.ordinal();
									const object = {serial, element:node, attributes:{}};
									Composite.fire(Composite.EVENT_RENDER_NEXT, object.element);
									object.element.textContent = word;
									object.attributes[Composite.ATTRIBUTE_TEXT] = word;
									_render_meta[serial] = object;
									array[index] = object.element;
								}
							});

							// Step 5:
							// The newly created text nodes are inserted before
							// the current text node. The current text node can
							// then be deleted, since its content is displayed
							// using the newly created text nodes.

							// For internal and temporary calls, no parent can
							// exist.
							if (selector.parentNode === null)
								return;

							// The new text nodes are inserted before the
							// current element one.
							words.forEach((node) =>
								selector.parentNode.insertBefore(node, selector));

							// The current element will be removed.
							selector.parentNode.removeChild(selector);

							return;
						}

						// If the text content contains empty expressions, these
						// are corrected and the content is used as static.
						selector.nodeValue = content;
					}

					object.attributes[Composite.ATTRIBUTE_TEXT] = content;

					return;
				}

				// Only composites are mounted based on their model. This
				// excludes markers of conditions as text nodes.
				if (selector instanceof Element
						&& object.attributes.hasOwnProperty(Composite.ATTRIBUTE_COMPOSITE)) {
					let model = String(object.attributes[Composite.ATTRIBUTE_ID] || "").trim();
					if (!model.match(Composite.PATTERN_COMPOSITE_ID))
						throw new Error(`Invalid composite id${model ? ": " + model : ""}`);

					if (!_models.has(model)) {
						_models.add(model);
						model = Object.lookup(model);
						if (model && typeof model.dock === "function")
							model.dock.call(model);
					}
				}

				if (!(selector instanceof Element))
					return;

				// The attributes ATTRIBUTE_EVENTS, ATTRIBUTE_VALIDATE and
				// ATTRIBUTE_RENDER are processed in Composite.mount(selector)
				// the view model binding and are only mentioned here for
				// completeness.

				// The attribute ATTRIBUTE_RELEASE has no functional
				// implementation. This is exclusively inverse indicator that an
				// element was rendered. The renderer removes this attribute
				// when an element is rendered. This effect can be used for CSS
				// to display elements only in rendered state.

				// ATTRIBUTE_IMPORT: This declaration loads the content and
				// replaces the inner HTML of an element with the content.
				// The following data types are supported:
				// 1. Node and NodeList as the result of an expression.
				// 2. URL (relative or absolute) loads markup/content from a
				//    remote data source via the HTTP method GET
				// 2. DataSource-URL loads and transforms DataSource data.
				// 3. Everything else is output directly as string/text.
				// The import is exclusive, similar to ATTRIBUTE_OUTPUT, thus
				// overwriting any existing content. The recursive (re)rendering
				// is initiated via the MutationObserver. If the content can be
				// loaded successfully, ATTRIBUTE_IMPORT is removed.
				if (object.attributes.hasOwnProperty(Composite.ATTRIBUTE_IMPORT)) {
					selector.innerHTML = "";
					let value = object.attributes[Composite.ATTRIBUTE_IMPORT];
					if ((value || "").match(Composite.PATTERN_EXPRESSION_CONTAINS))
						value = Expression.eval(serial + ":" + Composite.ATTRIBUTE_IMPORT, String(value));

					if (!value) {
						delete object.attributes[Composite.ATTRIBUTE_IMPORT];

					} else if (value instanceof Element
							|| value instanceof NodeList) {
						selector.appendChild(value, true);
						delete object.attributes[Composite.ATTRIBUTE_IMPORT];

					} else if (String(value).match(Composite.PATTERN_DATASOURCE_URL)) {
						let data = String(value).match(Composite.PATTERN_DATASOURCE_URL);
						data[2] = DataSource.fetch("xslt://" + (data[2] || data[1]));
						data[1] = DataSource.fetch("xml://" + data[1]);
						data = DataSource.transform(data[1], data[2]);
						selector.appendChild(data, true);
						const serial = selector.ordinal();
						const object = _render_meta[serial];
						delete object.attributes[Composite.ATTRIBUTE_IMPORT];

					} else if (_render_cache[value] !== undefined) {
						selector.innerHTML = _render_cache[value];
						const serial = selector.ordinal();
						const object = _render_meta[serial];
						delete object.attributes[Composite.ATTRIBUTE_IMPORT];

					} else {
						Composite.asynchron((selector, lock, url) => {
							try {
								const request = new XMLHttpRequest();
								request.overrideMimeType("text/plain");
								request.open("GET", url, false);
								request.send();
								if (request.status !== 200)
									throw new Error(`HTTP status ${request.status} for ${request.responseURL}`);
								const content = request.responseText.trim();
								_render_cache[request.responseURL] = content;
								selector.innerHTML = content;
								const serial = selector.ordinal();
								const object = _render_meta[serial];
								delete object.attributes[Composite.ATTRIBUTE_IMPORT];
							} catch (error) {
								Composite.fire(Composite.EVENT_HTTP_ERROR, error);
								throw error;
							} finally {
								lock.release();
							}
						}, selector, lock.share(), value);
					}
				}

				// ATTRIBUTE_OUTPUT: This declaration sets the value or result
				// of an expression as the content of an element.
				// The following data types are supported:
				// 1. Node and NodeList as the result of an expression.
				// 2. DataSource-URL loads and transforms DataSource data.
				// 3. Everything else is output directly as string/text.
				// The output is exclusive, thus overwriting any existing
				// content. The recursive (re)rendering is initiated via the
				// MutationObserver.
				if (object.attributes.hasOwnProperty(Composite.ATTRIBUTE_OUTPUT)) {
					selector.innerHTML = "";
					let value = object.attributes[Composite.ATTRIBUTE_OUTPUT];
					if ((value || "").match(Composite.PATTERN_EXPRESSION_CONTAINS))
						value = Expression.eval(serial + ":" + Composite.ATTRIBUTE_OUTPUT, String(value));
					if (String(value).match(Composite.PATTERN_DATASOURCE_URL)) {
						let data = String(value).match(Composite.PATTERN_DATASOURCE_URL);
						data[2] = DataSource.fetch("xslt://" + (data[2] || data[1]));
						data[1] = DataSource.fetch("xml://" + data[1]);
						data = DataSource.transform(data[1], data[2]);
						selector.appendChild(data, true);
					} else if (value instanceof Node)
						selector.appendChild(value.cloneNode(true), true);
					else if (value instanceof NodeList)
						Array.from(value).forEach(function(node, index) {
							selector.appendChild(node.cloneNode(true), index === 0);
						});
					else selector.innerHTML = String(value);
				}

				// ATTRIBUTE_INTERVAL: Interval based rendering. If an HTML
				// element is declared with an interval, this element is
				// periodically updated according to the interval. But for this
				// purpose, it is not reset to the initial state. The interval
				// ends automatically when the element is removed from the DOM
				// as is the case when combined with CONDITION.
				let interval = String(object.attributes[Composite.ATTRIBUTE_INTERVAL] || "").trim();
				if (interval && !object.interval) {
					const context = serial + ":" + Composite.ATTRIBUTE_INTERVAL;
					interval = String(Expression.eval(context, interval));
					if (!interval.match(/^\d*$/))
						throw new Error("Invalid interval: " + interval);
					interval = Number.parseInt(interval);
					object.interval = window.setInterval(() => {
						if (!document.body.contains(selector)) {
							window.clearInterval(object.interval);
							delete object.interval;
						} else Composite.render(selector);
					}, interval);
				}

				// ATTRIBUTE_ITERATE: Iterative rendering based on enumeration,
				// lists and arrays. If an HTML element is declared iteratively,
				// its initial inner HTML is used as a template. During
				// iteration, the inner HTML is initially emptied, the template
				// is rendered individually with each iteration cycle and the
				// result is added to the inner HTML.
				// There are some particularities to consider:
				// 1. The internal recursive rendering must be done
				//    sequentially.
				// 2. A global variable is required for the iteration. If this
				//    variable already exists, the existing variable is saved
				//    and restored at the end of the iteration.
				// 3. Variable with meta information about the iteration is used
				//    within the iteration:
				//    e.g iterate={{tempA:Model.list}}
				//            -> tempA = {item, index, data}
				if (object.attributes.hasOwnProperty(Composite.ATTRIBUTE_ITERATE)) {

					if (!object.iterate) {
						const iterate = String(object.attributes[Composite.ATTRIBUTE_ITERATE] || "").trim();
						const match = iterate.match(Composite.PATTERN_EXPRESSION_VARIABLE);
						if (!match)
							throw new Error(`Invalid iterate${iterate ? ": " + iterate : ""}`);
						object.iterate = {name:match[1].trim(), expression:"{{" + match[2].trim() + "}}"};
						object.template = selector.cloneNode(true);
					}

					// A temporary global variable is required for the
					// iteration. If this variable already exists, the existing
					// is cached and restored at the end of the iteration.
					const variable = window[object.iterate.name];
					try {
						selector.innerHTML = "";
						const context = serial + ":" + Composite.ATTRIBUTE_ITERATE;
						let iterate = Expression.eval(context, object.iterate.expression);
						if (iterate) {
							if (iterate instanceof XPathResult) {
								const meta = {entry: null, array: [], iterate};
								while (meta.entry = meta.iterate.iterateNext())
									meta.array.push(meta.entry);
								iterate = meta.array;
							} else iterate = Array.from(iterate);
							iterate.forEach((item, index, array) => {
								const meta = {};
								Object.defineProperty(meta, "item", {
									value: item,
									enumerable: true
								});
								Object.defineProperty(meta, "index", {
									value: index,
									enumerable: true
								});
								Object.defineProperty(meta, "data", {
									value: array,
									enumerable: true
								});
								window[object.iterate.name] = meta;
								// For whatever reason, if forEach is used on
								// the NodeList, each time it is appended to the
								// DOM, the elements are removed from the
								// NodeList piece by piece.
								Array.from(object.template.cloneNode(true).childNodes).forEach(node => {
									selector.appendChild(node);
									Composite.render(node, lock.share());
								});
							});
						}
					} finally {
						// If necessary, restore the temporary variable.
						delete window[object.iterate.name];
						if (variable !== undefined)
							window[object.iterate.name] = variable;
					}
					// The content is finally rendered, the enclosing
					// container element itself, or more precisely the
					// attributes, still needs to be updated.
				}

				// EXPRESSION: The expression in the attributes is interpreted.
				// The expression is stored in a meta-object and loaded from
				// there, the attributes of the element can be overwritten in a
				// render cycle and are available (conserved) for further cycles.
				// A special case is the text element. The result is output here
				// as textContent. Elements of type: script + style are ignored.
				if (!selector.nodeName.match(Composite.PATTERN_ELEMENT_IGNORE)) {
					const attributes = [];
					for (const key in object.attributes)
						if (object.attributes.hasOwnProperty(key))
							attributes.push(key);
					if (Composite.ATTRIBUTE_VALUE in selector
							&& object.attributes.hasOwnProperty(Composite.ATTRIBUTE_VALUE)
							&& !attributes.includes(Composite.ATTRIBUTE_VALUE))
						attributes.push(Composite.ATTRIBUTE_VALUE);
					attributes.forEach((attribute) => {
						// Ignore all internal attributes
						if (attribute.match(Composite.PATTERN_ATTRIBUTE_ACCEPT)
								&& !attribute.match(Composite.PATTERN_ATTRIBUTE_STATIC))
							return;
						let value = String(object.attributes[attribute] || "");
						if (!value.match(Composite.PATTERN_EXPRESSION_CONTAINS))
							return;
						const context = serial + ":" + attribute;
						value = Expression.eval(context, value);
						// If the type value is undefined, the attribute is
						// removed. Since the attribute contains an expression,
						// the removal is only temporary and is checked again at
						// the next render cycle and possibly inserted again if
						// the expression returns a return value.
						if (value !== undefined) {
							value = String(value).encodeHtml();
							value = value.replace(/"/g, "&quot;");
							// Special case attribute value, here primarily the
							// value of the property must be set, the value of
							// the attribute is optional. Changing the value
							// does not trigger an event, so no unwanted
							// recursions occur.
							if (attribute.toLowerCase() === Composite.ATTRIBUTE_VALUE
									&& Composite.ATTRIBUTE_VALUE in selector)
								selector.value = value;
							// @-ATTRIBUTE: These are attribute templates for
							// the renderer, which inserts attributes of the
							// same name to them without @. This feature can be
							// applied to all non-composite relevant attributes
							// and avoids that attributes are misinterpreted by
							// the browser before rendering, e.g. if the value
							// uses the expression language. Attributes created
							// from templates behave like other attributes,
							// which includes updating by the renderer.
							if (attribute.startsWith("@")) {
								selector.removeAttribute(attribute);
								attribute = attribute.replace(/^@+/, "");
							}
							selector.setAttribute(attribute, value);
						} else selector.removeAttribute(attribute);
					});
				}

				// Embedded scripting brings some special effects. The default
				// scripting is automatically executed by the browser and
				// independent of rendering. Therefore, the scripting for
				// rendering has been adapted and a new script type have been
				// introduced: composite/javascript. This script type use the
				// normal JavaScript. Unlike type text/javascript, the browser
				// does not recognize them and does not execute the JavaScript
				// code automatically. Only the render recognizes the JavaScript
				// code and executes it in each render cycle when the cycle
				// includes the script element. So the execution of the script
				// element can be combined with ATTRIBUTE_CONDITION.
				if (selector.nodeName.match(Composite.PATTERN_SCRIPT)) {
					const type = (selector.getAttribute(Composite.ATTRIBUTE_TYPE) || "").trim();
					if (type.match(Composite.PATTERN_COMPOSITE_SCRIPT)) {
						try {Scripting.eval(selector.textContent);
						} catch (error) {
							throw new Error("Composite JavaScript", error);
						}
					}
				}

				// Follow other element children recursively.
				// The following are ignored:
				// - Elements of type: script + style and custom tags
				// - Elements with functions that modify the inner markup
				// - Elements that are iteration
				// These elements manipulate the inner markup.
				// This is intercepted by the MutationObserver.
				if (selector.childNodes
						&& !selector.nodeName.match(Composite.PATTERN_ELEMENT_IGNORE)
						&& !(object.attributes.hasOwnProperty(Composite.ATTRIBUTE_ITERATE))) {
					Array.from(selector.childNodes).forEach((node) => {
						// The rendering is recursive, if necessary the node is
						// then no longer available. For example, if a condition
						// is replaced by the marker.
						if (!selector.contains(node))
							return;
						Composite.render(node, lock.share());
					});
				}

				if (selector.hasAttribute(Composite.ATTRIBUTE_RELEASE))
					selector.removeAttribute(Composite.ATTRIBUTE_RELEASE);

			} catch (error) {
				console.error(error);
				Composite.fire(Composite.EVENT_ERROR, error);
				if (origin instanceof Element)
					origin.innerText = "Error: " + (error.message.match(/(\{\{|\}\})/)
						? "Invalid expression" : error.message);

			} finally {

				// The queue is used to prevent elements from being registered for
				// update multiple times during a render cycle when a lock exists.
				// When the selector is rendered, any queued jobs are removed.
				Composite.render.queue = Composite.render.queue.filter(entry => entry !== origin);

				lock.release();
			}
		},

		/**
		 * Loads a resource (JS, CSS, HTML are supported).
		 * @param  resource
		 * @param  strict
		 * @return the content when loading a HTML resource
		 */
		load(resource, strict) {

			resource = (resource || "").trim();
			if (!resource.match(/\.(js|css|html)(\?.*)?$/i))
				throw new Error("Resource not supported" + (resource ? ": " + resource : ""))

			const normalize = (path) => {
				const anchor = document.createElement("a");
				anchor.href = path;
				return anchor.pathname.replaceAll(/\/{2,}/g, "/");
			};

			// JS and CSS are loaded only once
			resource = normalize(resource);
			if (!resource.startsWith(Composite.MODULES + "/"))
				throw new Error("Resource not supported: " + resource);
			if (resource in _render_cache
					&& resource.match(/\.(js|css)(\?.*)?$/i))
				return;

			// Resource has already been requested, but with no useful
			// response and unsuccessful requests will not be repeated
			if (resource in _render_cache
					&& _render_cache[resource] === undefined)
				return;

			if (!(resource in _render_cache)) {
				_render_cache[resource] = undefined;
				const request = new XMLHttpRequest();
				request.overrideMimeType("text/plain");
				request.open("GET", resource, false);
				request.send();
				// Only server states 200 and 404 (not in combination with the
				// option strict) are supported, others will cause an error and
				// the requests are not repeated later.
				if (request.status === 404
						&& !strict)
					return;
				if (request.status !== 200)
					throw new Error(`HTTP status ${request.status} for ${request.responseURL}`);
				_render_cache[resource] = request.responseText.trim();
			}

			// CSS is inserted into the HEAD element as a style element.
			// Without a head element, the inserting causes an error.

			// JavaScript is not inserted as an element, it is executed
			// directly. For this purpose eval is used. Since the method may
			// form its own scope for variables, it is important to use the
			// macro #export to be able to use variables and/or constants in
			// the global scope.

			// HTML/Markup is preloaded into the render cache if available.
			// If markup exists for the composite, ATTRIBUTE_IMPORT with the
			// URL is added to the item. Inserting then takes over the
			// import implementation, which then also accesses the render
			// cache.

			const content = _render_cache[resource];
			if (resource.match(/\.js(\?.*)?$/i)) {
				try {Scripting.eval(content);
				} catch (error) {
					console.error(resource, error.name + ": " + error.message);
					throw error;
				}
			} else if (resource.match(/\.css(\?.*)?$/i)) {
				const head = document.querySelector("html head");
				if (!head)
					throw new Error("No head element found");
				const style = document.createElement("style");
				style.setAttribute("type", "text/css");
				style.textContent = content;
				head.appendChild(style);
			} else if (resource.match(/\.html(\?.*)?$/i))
				return content;
		},

		/**
		 * Loads modules/components/composite resources. The assumption is, for
		 * components/composites, the resources are outsourced. JS and HTML are
		 * supported. Resources are stored in the module directory (./modules by
		 * default is relative to the page URL). The resources (response) are
		 * stored in the render cache, but only to detect and prevent repeated
		 * loading. The resources will only be requested once. If they do not
		 * exist (status 404), it is not tried again. Otherwise, an error is
		 * thrown if the request is not answered with status 200.
		 *
		 * The method also supports string arrays for resources with path. Then
		 * each path element is an array entry.
		 *
		 * Following rules apply to loading resources:
		 * - Composite ID / namespace / path must have a valid syntax
		 * - HTML is loaded only for elements when the elements have no content
		 * - CSS is only loaded when HTML is also loaded
		 * - JavaScript is loaded only if no corresponding JavaScript model
		 *   exists
		 *
		 * @param composite
		 */
		include(...composite) {

			if (composite.length <= 0
					|| (composite.length === 1
							&& !(composite[0] instanceof Element)
							&& typeof composite[0] !== "string"))
				throw new TypeError("Invalid composite for include");
			if (composite.length === 1
					&& composite[0] instanceof Element)
				composite = composite[0];

			let resource = composite;

			let object = null;
			if (composite instanceof Element) {
				if (!composite.hasAttribute(Composite.ATTRIBUTE_ID))
					throw new Error("Unknown composite without id");
				object = _render_meta[composite.ordinal()];
				if (!object)
					throw new Error("Unknown composite");
				resource = composite.id;
				if (!object.attributes.hasOwnProperty(Composite.ATTRIBUTE_STRICT))
					resource = resource.uncapitalize();
				const meta = _mount_locate(composite);
				if (meta && meta.namespace)
					resource = meta.namespace.concat(resource);
				else resource = [resource];
			}

			const context = Composite.MODULES + "/" + resource.join("/");

			// Based on namespace and resource a corresponding JavaScript object
			// is searched for. Therefore, here with invalid namespace/composite
			// IDs an error occurs, which must be noticed however already
			// before, it is to be ensured that only modules are loaded to valid
			// composites (namespace + composite ID). Later, it is also decided
			// whether JavaScript must be loaded. This is only necessary if
			// lookup cannot determine a JavaScript model (undefined or
			// element).

			// Theoretically an error can occur during the lookup if namespace
			// or composite ID are invalid, but this should already run on error
			// before, so it is not done here -- otherwise this is a bug!

			resource = resource.join(".");

			const lookup = Object.lookup(resource);

			// If the module has already been loaded, it is only necessary to
			// check whether the markup must be inserted. CSS should already
			// exist in the head and the JavaScript will only be executed once.
			if (_render_cache[context + ".composite"] !== undefined) {
				if (_render_cache[context + ".html"] !== undefined) {
					if (object && !object.attributes.hasOwnProperty(Composite.ATTRIBUTE_IMPORT)
							&& !object.attributes.hasOwnProperty(Composite.ATTRIBUTE_OUTPUT)
							&& !composite.innerHTML.trim()) {
						_recursion_detection(composite);
						if (composite instanceof Element)
							composite.innerHTML = _render_cache[context + ".html"];
					}
				}
				return;
			}

			_render_cache[context + ".composite"] = null;

			// The sequence of loading is strictly defined: JS, CSS, HTML

			// JavaScript is only loaded if no corresponding object exists for
			// the composite id or the object is an element object
			if (lookup === undefined
					|| lookup instanceof Element
					|| lookup instanceof HTMLCollection
					|| resource === "common")
				this.load(context + ".js");

			// CSS and HTML are loaded only if they are resources to an element
			// and the element is empty, excludes CSS for common. Since CSS
			// resources are loaded only once, common.css can be requested again
			// later.
			if (resource === "common")
				this.load(context + ".css");

			// CSS and HTML/Markup is only loaded if it is a known composite
			// object and the element does not contain a markup (inner HTML).
			// For inserting HTML/markup ATTRIBUTE_IMPORT and ATTRIBUTE_OUTPUT
			// must not be set. It is assumed that an empty component/elements
			// outsourced markup exists.
			if (!object
					|| composite.innerHTML.trim())
				return;
			this.load(context + ".css");
			if (object.attributes.hasOwnProperty(Composite.ATTRIBUTE_IMPORT)
					|| object.attributes.hasOwnProperty(Composite.ATTRIBUTE_OUTPUT))
				return;
			const content = this.load(context + ".html");
			if (content === undefined)
				return;
			_recursion_detection(composite);
			if (composite instanceof Element)
				composite.innerHTML = content;
		}
	});

	/**
	 * Set of attributes to be hardened.
	 * The hardening of attributes is part of the safety concept and should make
	 * it more difficult to manipulate the markup at runtime. Hardening observes
	 * attributes and undoes changes. Initially, the list is empty because the
	 * policies and rules are too individual.
	 *
	 * The following attributes are recommended:
	 *     action        autocomplete      autofocus
	 *     form          formaction        formenctype
	 *     formmethod    formnovalidate    formtarget
	 *     height        list              max
	 *     min           multiple          name
	 *     pattern       placeholder       required
	 *     size          step              target
	 *     type          width
	 *
	 * The following attributes are automatically hardened:
	 *     COMPOSITE     ID                STATIC*
	 *
	 * Composite internal/relevant attributes are also protected, these are
	 * removed in markup and managed in memory:
	 *     COMPOSITE     CONDITION         EVENTS
	 *     ID            IMPORT            INTERVAL
	 *     ITERATE       OUTPUT            RELEASE
	 *     RENDER        VALIDATE
	 */
	const _statics = new Set();

	/** Map for custom tags (key:tag, value:function) */
	const _macros = new Map();

	/** Map for custom selectors (key:hash, value:{selector, function}) */
	const _selectors = new Map();

	/** Set with acceptor and their registered listeners */
	const _acceptors = new Set();

	/** Map with events and their registered listeners */
	const _listeners = new Map();

	/**
	 * Set with docked models.
	 * The set is used for the logic to call the dock and undock methods,
	 * because the static models themselves have no status and the decision
	 * about the current existence in the DOM is not stable.
	 * All docked models are included in the set.
	 */
	const _models = new Set();

	const _recursion_detection = (element) => {
		const id = (element instanceof Element ? element.id || "" : "").trim();
		const pattern = id.toLowerCase();
		while (pattern && element instanceof Element) {
			element = element.parentNode;
			if (element instanceof Element
					&& element.hasAttribute(Composite.ATTRIBUTE_COMPOSITE)
					&& element.hasAttribute(Composite.ATTRIBUTE_ID)
					&& (element.id || "").toLowerCase().trim() === pattern)
				throw new Error("Recursion detected for composite: " + id);
		}
	}

	/**
	 * Determines the meta data for an element based on its position in the DOM
	 * with the corresponding model, the referenced route and target. The meta
	 * data is only determined as text information.
	 *
	 * Composite:
	 *     {namespace, model}
	 *
	 * Composite Element:
	 *     {namespace, model, route, target}
	 *     {namespace, model, route, unique, target}
	 *
	 * namespace: namespace of the composite/model
	 *            chain as array without the model or undefined if no chain
	 * model:     corresponds to the enclosing composite
	 * route:     fully qualified route to the target,
	 *            starting with the module, ends with the target
	 * unique:    unique identifier
	 *            not part of the route and without effect on the logic
	 * target:    final target in the chain
	 *
	 * A validation at object or JavaScript model level does not take place
	 * here. The fill levels of the meta-object can be different, depending on
	 * the collected data and the resulting derivation. Thus, it is possible to
	 * make the theoretical assumptions here by deriving them from the DOM.
	 * Especially the namespace of the model is based on these theoretical
	 * assumptions.
	 *
	 * If no meta information can be determined, e.g. because no IDs were found
	 * or no enclosing composite was used, null is returned.
	 *
	 * @param  element
	 * @param  namespace
	 * @return determined meta-object for the passed element, otherwise null
	 * @throws An error occurs in the following cases:
	 *     - in the case of an invalid composite ID
	 *     - in the case of an invalid element ID
	 */
	const _mount_locate = (element, namespace = false) => {

		if (!(element instanceof Element))
			return null;

		let serial = (element.getAttribute(Composite.ATTRIBUTE_ID) || "").trim();
		if (element.hasAttribute(Composite.ATTRIBUTE_COMPOSITE)) {
			if (!serial.match(Composite.PATTERN_COMPOSITE_ID))
				throw new Error(`Invalid composite id${serial ? ": " + serial : ""}`);

			// Option namespace restricts the analysis to composites with
			// ATTRIBUTE_NAMESPACE. If a composite is found without one, the
			// current namespace is terminated and the found composite is
			// outside the current namespace.

			const object = _render_meta[element.ordinal()];
			if (!object || !object.attributes
					|| !object.attributes.hasOwnProperty(Composite.ATTRIBUTE_NAMESPACE))
				return !namespace ? {model:serial} : null;

			// Determine from namespace by parent composite elements with
			// ATTRIBUTE_ID and ATTRIBUTE_NAMESPACE. The prerequisite is that
			// the direct composite from the model uses ATTRIBUTE_NAMESPACE.
			// Without the attribute, the composites and thus the models are
			// without namespace. Thus, there can also be decoupled composites
			// and thus models in a nested markup.

			const locate = _mount_locate(element.parentNode, true);
			if (!locate)
				return {model:serial};
			if (locate.namespace)
				locate.namespace.push(locate.model);
			else locate.namespace = [locate.model];
			return {namespace:locate.namespace, model:serial};
		}

		const object = _render_meta[element.ordinal()];
		if (object && object.attributes
				&& object.attributes.hasOwnProperty(Composite.ATTRIBUTE_NAMESPACE))
			throw new Error(`Namespace without composite${serial ? " for: " + serial : ""}`);

		const locate = _mount_locate(element.parentNode);
		if (!element.hasAttribute(Composite.ATTRIBUTE_ID))
			return locate;

		if (!serial.match(Composite.PATTERN_ELEMENT_ID))
			throw new Error(`Invalid element id${serial ? ": " + serial : ""}`);

		const meta = {namespace:[], model:null, route:[], target:null};
		if (locate) {
			if (locate.namespace)
				locate.namespace.push(locate.model);
			else locate.namespace = [locate.model];
			meta.namespace = locate.namespace;
			if (locate.route)
				meta.route.push(...locate.route);
			else meta.route.push(locate.model);
		}

		serial = serial.match(Composite.PATTERN_ELEMENT_ID);
		if (serial[4]) {
			meta.namespace = serial[4].substring(1).split(/:/);
			meta.route = [meta.namespace[meta.namespace.length -1]];
		}
		meta.route.push(serial[1]);
		if (serial[2])
			meta.route.push(...serial[2].substring(1).split(/:/));
		if (serial[3])
			meta.unique = serial[3];
		meta.target = meta.route[meta.route.length -1];
		meta.model = meta.namespace.pop();
		if (meta.namespace.length <= 0)
			delete meta.namespace;

		// a model is always required
		return meta.model ? meta : null;
	};

	/**
	 * Determines the meta-object for an element based on its position in the
	 * DOM, so the surrounding composite and model, the referenced route and
	 * target in the model.
	 *
	 * Composite:
	 *     {meta:{namespace, model}, namespace, model}
	 *
	 * Composite Element:
	 *     {meta:{namespace, model, route, target}, namespace, model, route, target}
	 *
	 * The method always requires a corresponding JavaScript object (model) and
	 * an element with a valid element ID in a valid enclosing composite,
	 * otherwise the method will return null.
	 *
	 * @param  element
	 * @return determined meta-object for the passed element, otherwise null
	 * @throws An error occurs in the following cases:
	 *     - in the case of an invalid composite ID
	 *     - in the case of an invalid element ID
	 */
	const _mount_lookup = (element) => {

		const meta = _mount_locate(element);
		if (!meta)
			return null;

		const namespace = Namespace.lookup(...(meta.namespace || []));
		const model = Object.lookup(namespace || window, meta.model)
		if (!model)
			return null;
		if (meta.target === undefined)
			return {meta, namespace, model};

		const lookup = {
			meta,
			namespace,
			model,
			get target() {
				return Object.lookup(this.namespace, ...(this.meta.route || []));
			},
			set target(value) {
				let chain = [this.meta.model];
				if (this.meta.route)
					chain = this.meta.route;
				const target = chain.pop();
				Object.lookup(this.namespace, ...chain)[target] = value;
			}
		};

		if (!lookup.model
				|| lookup.target === undefined)
			return null;
		return lookup;
	};

	/** Associative array of reusable content for rendering */
	const _render_cache = {};

	/**
	 * Associative array for element-related meta objects, those which are
	 * created during rendering: (key:serial, value:meta)
	 */
	const _render_meta = [];
	Object.defineProperty(Composite.render, "meta", {
		value: _render_meta
	});

	let _serial = 0;

	/**
	 * Enhancement of the JavaScript API
	 * Adds a function for getting the serial ID to the objects.
	 */
	compliant("Object.prototype.serial");
	compliant("Object.prototype.ordinal", function() {
		if (this.serial === undefined)
			Object.defineProperty(this, "serial", {
				value: ++_serial
			});
		return this.serial;
	});

	/**
	 * Enhancement of the JavaScript API
	 * Adds a static function to create and use a namespace for an object.
	 * Without arguments, the method returns the global namespace window.
	 * The method has the following various signatures:
	 *     Object.use();
	 *     Object.use(string);
	 *     Object.use(string, ...string|number);
	 *     Object.use(object);
	 *     Object.use(object, ...string|number);
	 * @param  levels of the namespace
	 * @return the created or already existing object(-level)
	 * @throws An error occurs in case of invalid data types or syntax
	 */
	compliant("Object.use", (...levels) =>
		Namespace.use.apply(null, levels));

	/**
	 * Enhancement of the JavaScript API
	 * Adds a static function to determine an object via the namespace.
	 * Without arguments, the method returns the global namespace window.
	 * The method has the following various signatures:
	 *     Object.lookup();
	 *     Object.lookup(string);
	 *     Object.lookup(string, ...string|number);
	 *     Object.lookup(object);
	 *     Object.lookup(object, ...string|number);
	 * @param  levels of the namespace
	 * @return the determined object(-level)
	 * @throws An error occurs in case of invalid data types or syntax
	 */
	compliant("Object.lookup", (...levels) =>
		Namespace.lookup.apply(null, levels));

	/**
	 * Enhancement of the JavaScript API
	 * Adds a static function to check whether an object exists in a namespace.
	 * In difference to the namespace function of the same name, qualifiers are
	 * also supported in the namespace. The effect is the same. Qualifiers are
	 * optional namespace elements at the end that use the colon as a separator.
	 * The method has the following various signatures:
	 *     Object.exists();
	 *     Object.exists(string);
	 *     Object.exists(string, ...string|number);
	 *     Object.exists(object);
	 *     Object.exists(object, ...string|number);
	 * @param  levels of the namespace
	 * @return true if the namespace exists
	 * @throws An error occurs in case of invalid data types or syntax
	 */
	compliant("Object.exists", (...levels) =>
		Namespace.exists.apply(null, levels));

	/**
	 * Enhancement of the JavaScript API
	 * Adds a static function to checks that an object is not undefined / null.
	 * @param  object
	 * @return true is neither undefined nor null
	 */
	compliant("Object.usable", (object) =>
		object !== undefined && object !== null);

	/**
	 * Enhancement of the JavaScript API
	 * Implements an own open method for event management.
	 * The original method is reused in the background.
	 */
	const _request_open = XMLHttpRequest.prototype.open;
	XMLHttpRequest.prototype.open = function(...variants) {

		const callback = (event = null) => {
			if (!event)
				return;
			if (event.type === "loadstart")
				event = [Composite.EVENT_HTTP_START, event];
			else if (event.type === "progress")
				event = [Composite.EVENT_HTTP_PROGRESS, event];
			else if (event.type === "readystatechange")
				event = [Composite.EVENT_HTTP_RECEIVE, event];
			else if (event.type === "load")
				event = [Composite.EVENT_HTTP_LOAD, event];
			else if (event.type === "abort")
				event = [Composite.EVENT_HTTP_ABORT, event];
			else if (event.type === "error")
				event = [Composite.EVENT_HTTP_ERROR, event];
			else if (event.type === "timeout")
				event = [Composite.EVENT_HTTP_TIMEOUT, event];
			else if (event.type === "loadend")
				event = [Composite.EVENT_HTTP_END, event];
			else return;
			Composite.fire(...event);
		};

		if (this.status === XMLHttpRequest.UNSENT) {
			this.addEventListener("loadstart", callback);
			this.addEventListener("progress", callback);
			this.addEventListener("readystatechange", callback);
			this.addEventListener("load", callback);
			this.addEventListener("abort", callback);
			this.addEventListener("error", callback);
			this.addEventListener("timeout", callback);
			this.addEventListener("loadend", callback);
		}

		_request_open.call(this, ...variants);
	};

	// Listener when an error occurs and triggers a matching composite-event.
	window.addEventListener("error", (event) =>
		Composite.fire(Composite.EVENT_ERROR, event));

	// MutationObserver detects changes at the DOM and triggers (re)rendering
	// and (re)scanning and prevents manipulation of ATTRIBUTE_COMPOSITE.
	// - Text-Nodes: The TextContent of text nodes with an expression is
	//   protected by the MutationObserver and cannot be manipulated.
	// - The attributes of the renderer (Composite.PATTERN_ATTRIBUTE_ACCEPT)
	//   are protected by the MutationObserver and cannot be manipulated.
	window.addEventListener("load", () => {

		// The inverse indicator release shows when an element has been rendered
		// because the renderer removes this attribute. This effect is used for
		// CSS to show elements only in rendered state. A corresponding CSS rule
		// is automatically added to the HEAD when the page is loaded.
		if (document.querySelector("html")) {
			if (!document.querySelector("html head"))
				document.querySelector("html").appendChild(document.createElement("head"));
			const style = document.createElement("style");
			style.setAttribute("type", "text/css");
			style.innerHTML = "*[release] {display:none!important;}";
			document.querySelector("html head").appendChild(style);
		}

		// Initially the common-module is loaded.
		// The common-module is similar to an autostart, it is used to
		// initialize the single page application. It consists of common.js and
		// common.css. The configuration of the SiteMap and essential styles
		// can/should be stored here.
		Composite.include("common");

		(new MutationObserver((records) => {
			records.forEach((record) => {

				// HTML uses attributes whose pure presences have effects:
				//     autofocus, disabled, hidden, multiple, readonly, required
				// With the expression language the setting and removing of
				// these attributes is not possible. This task is taken over by
				// the MutationObserver. It reacts to the values true and false
				// for the present attributes and removes the attribute from the
				// HTML element in case of false.

				if (record.type === "attributes") {
					const attribute = record.attributeName;
					if (attribute.match(/^(autofocus|disabled|hidden|multiple|readonly|required)$/i)) {
						const value = String(record.target.getAttribute(attribute));
						if (value === "false")
							record.target.removeAttribute(attribute)
						if (value === "true")
							record.target.setAttribute(attribute, attribute);
					}
				}

				// Without Meta-Store, the renderer hasn't run yet. The reaction
				// by the MutationObserver only makes sense when the renderer
				// has run initially.
				if (!_render_meta.length)
					return;

				const serial = record.target.ordinal();
				const object = _render_meta[serial];

				// Text changes are only monitored at text nodes with expression.
				// Manipulations are corrected/restored.
				if (record.type === "characterData"
						&& record.target.nodeType === Node.TEXT_NODE) {
					if (object && object.hasOwnProperty(Composite.ATTRIBUTE_VALUE)) {
						const value = object.value === undefined ? "" : String(object.value);
						if (value !== record.target.textContent)
							record.target.textContent = value;
					}
					return;
				}

				// Changes at the renderer-specific and static attributes are
				// monitored. Manipulations are corrected/restored.
				if (object && record.type === "attributes") {
					const attribute = (record.attributeName || "").toLowerCase().trim();
					if (attribute.match(Composite.PATTERN_ATTRIBUTE_ACCEPT)
							&& !attribute.match(Composite.PATTERN_ATTRIBUTE_STATIC)) {
						// Composite internal non-static attributes are managed
						// by the renderer and are removed.
						if (record.target.hasAttribute(attribute))
							record.target.removeAttribute(attribute);
					} else if (attribute.match(Composite.PATTERN_ATTRIBUTE_STATIC)) {
						if (!object.attributes.hasOwnProperty(attribute)) {
							// If the renderer has not registered an initial
							// value, the assumption is that the attribute was
							// subsequently added and is therefore removed.
							if (record.target.hasAttribute(attribute))
								record.target.removeAttribute(attribute);
						} else {
							// If the attribute was removed or the value was
							// changed, the initial value is restored that was
							// previously determined by the renderer.
							if (!record.target.hasAttribute(attribute)
									|| object.attributes[attribute] !== record.target.getAttribute(attribute))
								record.target.setAttribute(attribute, object.attributes[attribute]);
						}
					} else if (_statics.has(attribute)) {
						object.statics = object.statics || {};
						if (!object.statics.hasOwnProperty(attribute)) {
							// If the renderer has not registered an initial
							// value, the assumption is that the attribute was
							// subsequently added and is therefore removed.
							if (record.target.hasAttribute(attribute))
								record.target.removeAttribute(attribute);
						} else {
							// If the attribute was removed or the value was
							// changed, the initial value is restored that was
							// previously determined by the renderer.
							if (!record.target.hasAttribute(attribute)
									|| object.statics[attribute] !== record.target.getAttribute(attribute))
								record.target.setAttribute(attribute, object.statics[attribute]);
						}
					}
				}

				// Theoretically, the target object may be unknown by the
				// renderer, but normally the mutation observer reacts to the
				// parent element when inserting new elements. Therefore, this
				// case was not implemented.

				// All new inserted elements are rendered if they are unknown for
				// the renderer. It is important that the new nodes are also
				// contained in the body. This is not always the case, e.g. when
				// recursive rendering replaces elements. So an include can load
				// data with a condition. Nodes are created per include, which
				// are then replaced by a marker in the case of a condition. The
				// MutationObserver does not run parallel, so it is called after
				// the rendering with obsolete nodes.
				if (record.addedNodes) {
					record.addedNodes.forEach((node) => {
						if ((node instanceof Element
								|| (node instanceof Node
										&& node.nodeType === Node.TEXT_NODE))
								&& !_render_meta[node.ordinal()]
								&& document.body.contains(node))
							Composite.render(node);
					});
				}

				// All removed elements are cleaned and if necessary the undock
				// method is called if a view model binding exists.
				if (record.removedNodes) {
					record.removedNodes.forEach((node) => {
						const cleanup = (node) => {
							// Clean up all the child elements first.
							if (node.childNodes) {
								Array.from(node.childNodes).forEach((node) =>
									cleanup(node));
							}

							// Composites/models must be undocked when they are
							// removed from the DOM independent of whether a
							// condition exists. For composites with condition,
							// it must be noted that the composite is initially
							// replaced by a marker. During replacement, the
							// initial composite is removed, which can cause an
							// unwanted undocking. Therefore, the logic is based
							// on the assumption that each composite has a
							// meta-object. When replacing the original
							// composite, the corresponding meta-object is also
							// deleted, so that the MutationObserver detects the
							// composite to be removed in the DOM, but undocking
							// is not performed without the matching meta-object.

							const serial = node.ordinal();
							const object = _render_meta[serial];
							if (object && object.attributes.hasOwnProperty(Composite.ATTRIBUTE_COMPOSITE)) {
								const meta = _mount_lookup(node);
								if (meta && meta.meta && meta.meta.model && meta.model
										&& _models.has(meta.meta.model)) {
									_models.delete(meta.meta.model);
									if (typeof meta.model.undock === "function")
										meta.model.undock.call(meta.model);
								}
							}

							delete _render_meta[node.ordinal()];
						};
						cleanup(node);
					});
				}
			});
		})).observe(document.body, {childList:true, subtree:true, attributes:true, attributeOldValue:true, characterData:true});

		Composite.render(document.body);
	});
})();

/**
 * A reactivity system or here called reactivity rendering is a mechanism which
 * automatically keeps in sync a data source (model) with a data representation
 * (view) layer. Every time the model changes, the view is partially
 * re-rendered to reflect the changes.
 *
 * The mechanism is based on notifications that arise from setting and getting
 * from the model as a data source. Which is supported by the proxy object in
 * JavaScript and its events can then be used to determine which elements/nodes
 * in the DOM consume what data from the model and need to be updated when
 * changes are made.
 *
 * Reactivity rendering is implemented as an optional module and uses the
 * available API.
 *
 * Reactive works permanently recursively on all objects, in all levels of a
 * model and also on the objects that are added later as values, even if these
 * objects do not explicitly use the Reactive.
 *
 * Object and model are decoupled by Reactive. The implementation uses free
 * (unbound) proxies for this purpose. These proxies reference an object but are
 * not bound to an object level in the object tree and they synchronize the data
 * bidirectionally. Managed these proxies are managed with a weak map where the
 * object is the key and the garbage collection can dispose of this objects with
 * associated proxies when not in use.
 *
 * @author  Seanox Software Solutions
 * @version 1.6.0 20230317
 */
(() => {

	compliant("Reactive", (object) => {
		if (typeof object !== "object")
			throw new TypeError("Not supported data type: " + typeof object);
		if (object === "object")
			throw new TypeError("Not supported data type: null");
		return _reactive(object);
	});

	let _selector = null;

	Composite.listen(Composite.EVENT_RENDER_START, (event, selector) =>
		_selector = selector);

	Composite.listen(Composite.EVENT_RENDER_NEXT, (event, selector) =>
		_selector = selector);

	Composite.listen(Composite.EVENT_RENDER_END, (event, selector) =>
		_selector = null);

	/**
	 * Enhancement of the JavaScript API
	 * Adds a function to create a reactive object to an object instance. If it
	 * is already a reactive object, the reference of the instance is returned.
	 */
	compliant("Object.prototype.reactive", function() {
		return _reactive(this);
	});

	/**
	 * Proxy is implemented exotically, cannot be inherited and has no
	 * prototype. Therefore, this unconventional way with a secret simulated
	 * property that is used as an indicator for existing reactive objects
	 * instances. The value is not programmatically constant, instead it is
	 * defined with the start of the application.
	 * https://stackoverflow.com/questions/37714787/can-i-extend-proxy-with-an-es2015-class
	 */
	const _secret = Math.serial();

	/**
	 * Weak map with the assignment of objects to proxies. The object is the key
	 * and the proxy is the value. A feature of WeakMap is that when the key is
	 * purged from the garbage collection, the value and thus the proxy is also
	 * purged. Thus, this should be an efficient way to manage unbound proxies.
	 */
	const _register = new WeakMap();

	const _reactive = (object) => {

		if (typeof object !== "object"
				|| object === null)
			return object;

		// Proxy remains proxy
		if (object[_secret] !== undefined)
			return object;

		// For all objects, a proxy must be created. Also for proxies, even if
		// proxy in proxy is prevented. Not internally, so it works recursively.
		// Endless loops are prevented with the register.

		if (_register.has(object))
			return _register.get(object);

		const proxy = new Proxy(object, {

			notifications: new Map(),

			cache: new Map(),

			get(target, key) {

				try {

					// Proxy is implemented exotically, cannot be inherited and
					// has no prototype. Therefore, this unconventional way with
					// a secret simulated property that is used as an indicator
					// for existing reactive object instances and also contains
					// a reference to the original object.
					if (key === _secret)
						return target;

					let value;

					// During analysis, getters must be invoked via the proxy to
					// identify the final targets behind the getter.
					if (_selector) {
						const descriptor = Object.getOwnPropertyDescriptor(target, key);
						if (descriptor && typeof descriptor.get === "function")
							value = descriptor.get.call(proxy);
						else value = target[key];
					} else value = target[key];

					// Proxies are only used for objects, other data types are
					// returned directly.
					if (typeof value !== "object"
							|| value === null)
						return value;

					// Proxy remains proxy
					if (value[_secret] !== undefined)
						return value;

					// A proxy always returns proxies for objects. To decouple
					// object, proxy and view and to avoid reference to object
					// tree/level, loose proxies are used. The mapping is based
					// only on objects not on object level via the register.
					if (_register.has(value))
						return _register.get(value)
					return _reactive(value);

					// To be economical with resources, proxies are not created
					// for objects immediately, but only when they are requested
					// via getter. Therefore, the properties for an object are
					// not analyzed recursively.

				} finally {

					// The registration is delayed so that the getting of values
					// does not block unnecessarily.
					Composite.asynchron((selector, target, key, notifications) => {

						// Registration is performed only during rendering and
						// if the key exists in the object.
						if (selector === null
								|| !target.hasOwnProperty(key))
							return;

						// Special for elements with attribute iterate. For
						// these, the highest parent element with the attribute
						// iterate is searched for and registered as the
						// recipient. Why -- Iterate provides temporary
						// variables which can be used in the enclosed markup.
						// If these places are registered as recipients, these
						// temporary variables cannot be accessed later in the
						// expressions, which causes errors because the
						// temporary variables no longer exist. Since element
						// with the attribute iterate can be nested and the
						// expression can be based on a parent one, the topmost
						// one is searched for.

						for (let node = selector; node.parentNode; node = node.parentNode) {
							const meta = (Composite.render.meta || [])[node.ordinal()] || {};
							if (meta.attributes && meta.attributes.hasOwnProperty(Composite.ATTRIBUTE_ITERATE))
								selector = node;
						}

						const recipients = notifications.get(key) || new Map();

						// If the selector as the current rendered element is
						// already registered as a recipient, then the
						// registration can be canceled.
						if (recipients.has(selector.ordinal()))
							return;

						for (const recipient of recipients.values()) {

							// If the selector as the current rendered element
							// is already contained in a recipient as the
							// parent, the selector as a recipient can be
							// ignored, because the rendering is initiated by
							// the parent and includes the selector as a child.
							if (recipient.contains !== undefined
									&& recipient.contains(selector))
								return;

							// If the selector as current rendered element
							// contains a recipient as parent, the recipient can
							// be removed, because the selector element will
							// initiate rendering as parent in the future and
							// the existing recipient will be rendered as child
							// automatically.
							if (selector.contains !== undefined
									&& selector.contains(recipient))
								recipients.delete(recipient.ordinal());
						}

						recipients.set(selector.ordinal(), selector);
						notifications.set(key, recipients);

					}, _selector, target, key, this.notifications);
				}
			},

			set(target, key, value) {

				// To decouple object, proxy and view, the original objects are
				// always used as value and never the proxies.
				if (typeof value === "object"
						&& value !== null
						&& value[_secret] !== undefined)
					value = value[_secret];

				// To be economical with resources, proxies are not created for
				// objects immediately, but only when they are explicitly
				// requested via getter.

				try {return target[key] = value;
				} finally {

					// Unwanted recursions due to repeated value assignments:
					// a = a / a = c = b = a must be avoided so that no infinite
					// render cycle is initiated.
					if (this.cache.get(key) === value)
						return;
					this.cache.set(key, value);

					// The registration is delayed so that the setting of values
					// does not block unnecessarily.
					Composite.asynchron((selector, target, key, notifications) => {

						// Update only if the key exists in the object.
						// Recursions during rendering are prevented via the
						// queue and the lock in during rendering.
						if (!target.hasOwnProperty(key))
							return;

						const recipients = this.notifications.get(key) || new Map();
						for (const recipient of recipients.values()) {
							// If the recipient is no longer included in the DOM
							// and so it can be removed this case.
							if (!document.body.contains(recipient))
								recipients.delete(recipient.ordinal());
							else Composite.render(recipient);
						}

					}, _selector, target, key, this.notifications);
				}
			}
		});

		// On the one hand, the register manages the unbound proxies, on the
		// other hand, it protects against endless recursions.
		_register.set(object, proxy);

		return proxy;
	};
})();

/**
 * Test is a simple API and module to implement and execute integration tests.
 * The tests can be implemented as suites, scenarios and test cases.
 *
 *
 *     Case
 *     ----
 * The smallest and simplest element in an integration test, used here as task,
 * because case is a keyword. It can be implemented alone, but is always used in
 * a scenario.
 *
 *     Test.create({test() {
 *         Assert.assertTrue(true);
 *     }});
 *
 *     Test.start();
 *
 *
 *     Scenario
 *     ----
 * A scenario is a sequence of a lot of test cases usually in one file.
 *
 *     Test.create({test() {
 *         Assert.assertTrue(true);
 *     }});
 *
 *     Test.create({name:"example", timeout:1000, test() {
 *         Assert.assertTrue(true);
 *     }});
 *
 *     Test.create({error:Error test() {
 *         throw new Error();
 *     }});
 *
 *     Test.create({error:/^My Error/i, test() {
 *         throw new Error("My Error");
 *     }});
 *
 *     Test.create({ignore:true, test() {
 *         Assert.assertTrue(true);
 *     }});
 *
 *     Test.start();
 *
 *
 *     Suite
 *     ----
 * A suite is a complex bundle of different test cases, scenarios and other
 * suites. Usually a suite consists of different files, which then represent a
 * complex test. In an ideal case, a suite is a cascade of different files where
 * the test can be started in any file and at any place. This makes it possible
 * to perform the integration test on different levels and with different
 * complexity.
 *
 *
 *     Assert
 *     ----
 * The test cases are implemented with assertions. The test module provides
 * elementary assertions, you can implement more. The function is simple. If an
 * assertion was not true, an error is thrown -- see as an example the
 * implementation here.
 *
 * The Test API is part of aspect-js but has to be activated deliberately,
 * otherwise it is not available.
 *
 *     Test.activate();
 *
 * This is necessary so that some enhancements to the JavaScript API that
 * are helpful for implementing test are not used productively. For example,
 * the redirection and caching of console output.
 *
 * @author  Seanox Software Solutions
 * @version 1.6.0 20230328
 */
compliant("Test", {

	/**
	 * Activates the test API. The method can be called multiple times, but is
	 * ignored after the first call. A later deactivation of the test API is not
	 * possible.
	 */
	activate() {

		window["Test"] = {

			/** Pattern for all accepted events */
			get PATTERN_EVENT() {return /^[a-z]+$/;},

			/** Constants of events */
			get EVENT_FINISH() {return "finish";},
			get EVENT_INTERRUPT() {return "interrupt";},
			get EVENT_PERFORM() {return "perform";},
			get EVENT_RESPONSE() {return "response";},
			get EVENT_RESUME() {return "resume";},
			get EVENT_START() {return "start";},
			get EVENT_SUSPEND() {return "suspend";},

			/** Constants for a current timestamp */
			get TIMESTAMP() {return new Date().toUTCString();},

			/**
			 * Activates the test API. The method can be called multiple times,
			 * but is ignored after the first call. A later deactivation of the
			 * test API is not possible.
			 */
			activate() {
			},

			/**
			 * Registers a callback function for test events.
			 * @param  event    see Test.EVENT_***
			 * @param  callback callback function
			 * @throws An error occurs in the following cases:
			 *     - event is not valid or is not supported
			 *     - callback function is not implemented correctly
			 *       or does not exist
			 */
			listen(event, callback) {

				if (typeof event !== "string")
					throw new TypeError("Invalid event: " + typeof event);
				if (typeof callback !== "function"
						&& callback !== null
						&& callback !== undefined)
					throw new TypeError("Invalid callback: " + typeof callback);
				if (!event.match(Test.PATTERN_EVENT))
					throw new Error(`Invalid event${event.trim() ? ": " + event : ""}`);

				event = event.toLowerCase();
				if (!_listeners.has(event)
						&& !Array.isArray(_listeners.get(event)))
					_listeners.set(event, []);
				_listeners.get(event).push(callback);
			},

			/**
			 * Internal method to trigger an event. All callback functions
			 * for this event are called. If the script is in a frame, at
			 * the parent object it will also try to trigger this method.
			 * The parent object is always triggered after the current
			 * object. If an error occurs when calling the current object,
			 * the parent object is not triggered.
			 * @param event  see Test.EVENT_***
			 * @param status meta object with information about the test
			 *     execution
			 */
			fire(event, status) {

				if (typeof Test.worker === "object")
					Test.worker.status = event;

				if (typeof Test.worker === "object"
						&& typeof Test.worker.monitor === "object"
						&& typeof Test.worker.monitor[event] === "function")
				try {Test.worker.monitor[event](status);
				} catch (error) {
					console.error(error);
				}

				event = (event || "").trim();
				if (!event)
					return;
				const listeners = _listeners.get(event.toLowerCase());
				if (Array.isArray(listeners))
					listeners.forEach(callback =>
						callback(event, status));

				if (parent && parent !== window)
					try {parent.Test.fire(event, status);
					} catch (error) {
					}
			},

			/**
			 * Creates and registers a test task. A test task is a function or
			 * object with the required meta information for performing and a
			 * test method to be executed.
			 *
			 *     structure of meta: {name:..., test:..., timeout:..., expected:..., ignore:...}
			 *
			 * name       optional name of the test task
			 * test       an implemented method to be executed as a test
			 * timeout    maximum runtime of the test task in milliseconds
			 *            Exceeding this limit will cause the test to fail.
			 *            A value greater than 0 is expected, otherwise the
			 *            timeout is ignored.
			 * expected   if you want to test for the occurrence of an error
			 *            The error must occur if the test is successful.
			 *            An error object or a RegExp is expected as value.
			 * ignore     true, if the test is to be ignored
			 *
			 * Implementation of test:
			 *
			 *     Test.create({test() {
			 *         Assert.assertTrue(true);
			 *     }});
			 *
			 *     Test.create({name:"example", timeout:1000, test() {
			 *         Assert.assertTrue(true);
			 *     }});
			 *
			 *     Test.create({error:Error test() {
			 *         throw new Error();
			 *     }});
			 *
			 *     Test.create({error:/^My Error/i, test() {
			 *         throw new Error("My Error");
			 *     }});
			 *
			 *     Test.create({ignore:true, test() {
			 *         Assert.assertTrue(true);
			 *     }});
			 *
			 * @param meta
			 */
			create(meta) {

				if (typeof meta !== "object"
						|| typeof meta.test !== "function")
					return;

				if (meta.ignore !== undefined
						&& meta.ignore === true)
					return;

				if (_stack.has(meta))
					return;

				_stack.add(meta);
				const stack = Array.from(_stack);
				Object.defineProperty(meta, "serial", {
					value: Math.max(stack.length, stack.length > 1 ? stack[stack.length -2].serial +1 : 1)
				});
			},

			/**
			 * Starts the test run. The execution of the tests can optionally be
			 * configured with the start by passing a meta object. The
			 * parameters in the meta object are optional and cannot be changed
			 * when the test are running. Only with the next start can new
			 * parameters be passed as meta objects.
			 *
			 *     Test.start({auto: boolean, output: {...}, monitor: {...}});
			 *
			 *     auto
			 *     ----
			 * true, the start is triggered when the page is loaded
			 * If the page is already loaded, the parameter auto is ignored and
			 * the start is executed immediately.
			 *
			 *     output
			 *     ----
			 * Simple function or object for outputting messages and errors.
			 * If not specified, console object is used.
			 *
			 * Implementation of an output (as function or object):
			 *
			 *     var output = {
			 *
			 *         log(message) {
			 *             ...
			 *         },
			 *
			 *         error(message) {
			 *             ...
			 *         }
			 *     };
			 *
			 *     monitor
			 *     ----
			 * Monitors the test procedure and is informed about the various
			 * cycles during execution. The monitor also controls the data
			 * output. For example, the output can be redirected to DOM
			 * elements. Without a monitor the tests will also be performed, but
			 * there will be an output about success and failure. If no monitor
			 * is specified, the internal monitor is used with a simple console
			 * output.
			 *
			 * Implementation of a monitor (as function or object):
			 *
			 *     var monitor = {
			 *
			 *         start(status) {
			 *             The method is called with the start.
			 *         },
			 *
			 *         suspend(status) {
			 *             The method is called with suspension.
			 *         },
			 *
			 *         resume(status) {
			 *             The method is called if the test run is stopped and
			 *             is to be continued later.
			 *         },
			 *
			 *         interrupt(status) {
			 *             The method is called if you want to abort the test
			 *             run. The test run cannot then be resumed.
			 *         },
			 *
			 *         perform(status) {
			 *             The method is called before a test task is performed.
			 *         },
			 *
			 *         response(status) {
			 *             The method is called when a test task has been
			 *             performed. Here you can find the result of the test
			 *             task.
			 *         },
			 *
			 *         finish(status) {
			 *             The method is called when all test tasks have been
			 *             completed.
			 *         }
			 *     };
			 *
			 * The current status is passed to all monitor methods as an object.
			 * The status is a snapshot of the current test run with details of
			 * the current task and the queue. The details are read-only and
			 * cannot be changed.
			 *
			 *     structure of status: {task:..., queue:...}
			 *
			 * task.title      title of the test task
			 * task.meta       meta information about the test itself name,
			 *                 test, timeout, expected, serial
			 * task.running    indicator when the test task is in progress
			 * task.timing     start time from the test task in milliseconds
			 * task.timeout    optional, the time in milliseconds when a timeout
			 *                 is expected
			 * task.duration   total execution time of the test task in
			 *                 milliseconds, is set with the end of the test
			 *                 task
			 * task.error      optional, if an unexpected error (also assert
			 *                 error) has occurred, which terminated the test
			 *                 task
			 *
			 * queue.timing    start time in milliseconds
			 * queue.size      original queue length
			 * queue.length    number of outstanding tests
			 * queue.progress  number of tests performed
			 * queue.lock      indicator when a test is performed and the queue
			 *                 is waiting
			 * queue.faults    number of detected faults
			 *
			 * @param meta
			 */
			start(meta) {

				if (Test.worker !== undefined)
					return;

				if (meta && meta.auto
						&& (document.readyState === "loading"
							|| document.readyState === "interactive")) {
					if (Test.start.auto === undefined) {
						Object.defineProperty(Test.start, "auto", {
							value: true
						});
						window.addEventListener("load", () =>
							Test.start(meta));
					}
					return;
				}

				const numerical = (number, text) =>
					`${number} ${text}${number !== 1 ? "s" : ""}`;

				Test.worker = {};

				// Test.worker.output
				// Output to be used for all messages and errors
				Test.worker.output = meta ? meta.output : null;
				Test.worker.output = Test.worker.output || console;

				// Test.worker.monitor
				// Monitoring of test processing
				Test.worker.monitor = meta ? meta.monitor : null;
				Test.worker.monitor = Test.worker.monitor || {
					start(status) {
						Test.worker.output.log(Test.TIMESTAMP + " Test is started"
								+ `, ${numerical(status.queue.size, "task")} in the queue`);
					},
					suspend(status) {
						Test.worker.output.log(Test.TIMESTAMP + " Test is suspended"
								+ `, ${numerical(status.queue.length, "task")} still outstanding`);
					},
					resume(status) {
						Test.worker.output.log(Test.TIMESTAMP + " Test is continued"
								+ `, ${numerical(status.queue.size, "task")} in the queue`);
					},
					interrupt(status) {
						Test.worker.output.log(Test.TIMESTAMP + " Test is interrupted"
								+ `\n\t${numerical(status.queue.size -status.queue.progress, "task")} still outstanding`
								+ `\n\t${numerical(status.queue.faults, "fault")} were detected`
								+ `\n\ttotal time ${new Date().getTime() -status.queue.timing} ms`);
					},
					perform(status) {
					},
					response(status) {
						const timing = new Date().getTime() -status.task.timing;
						if (status.task.error)
							Test.worker.output.error(`${Test.TIMESTAMP} Test task ${status.task.title} ${status.task.error.message}`);
						else Test.worker.output.log(`${Test.TIMESTAMP} Test task ${status.task.title} was successful (${timing} ms)`);
					},
					finish(status) {
						Test.worker.output.log(Test.TIMESTAMP + "Test is finished"
								+ `\n\t${numerical(status.queue.size, "task")} were performed`
								+ `\n\t${numerical(status.queue.faults, "fault")} were detected`
								+ `\n\ttotal time ${new Date().getTime() -status.queue.timing} ms`);
					}
				};

				// Test.worker.queue
				// Queue of currently running test tasks
				Test.worker.queue = Test.worker.queue || {timing:false, stack:[], size:0, lock:false, progress:0, faults:0};
				if (Test.worker.queue.stack.length <= 0) {
					Test.worker.queue.stack = Array.from(_stack);
					Test.worker.queue.size = Test.worker.queue.stack.length;
					Test.worker.queue.timing = new Date().getTime();
				}

				// Test.worker.timeout
				// Timer for controlling test tasks with timeout
				Test.worker.timeout = window.setInterval(() => {

					if (Test.worker.status === Test.EVENT_SUSPEND)
						return;

					if (Test.worker.task === undefined
							|| !Test.worker.task.running
							|| !Test.worker.queue.lock)
						return;

					const task = Test.worker.task;
					if (!task.timeout
							|| task.timeout > new Date().getTime())
						return;

					task.duration = new Date().getTime() -task.timing;
					task.error = new Error(`Timeout occurred, expected ${task.timeout} ms but was ${task.duration} ms`);
					Test.fire(Test.EVENT_RESPONSE, Test.status());
					Test.worker.queue.faults++;
					Test.worker.queue.lock = false;
				}, 25);

				// Test.worker.interval
				// Timer for processing the queue
				Test.worker.interval = window.setInterval(() => {

					if (Test.worker.status === Test.EVENT_SUSPEND)
						return;

					if (!Test.worker.queue.lock
							&& Test.worker.queue.progress <= 0)
						Test.fire(Test.EVENT_START, Test.status());

					if (Test.worker.queue.lock)
						return;

					if (Test.worker.queue.stack.length > 0) {
						Test.worker.queue.lock = true;
						Test.worker.queue.progress++;
						const meta = Test.worker.queue.stack.shift();
						let timeout = false;
						if ((meta.timeout || 0) > 0)
							timeout = new Date().getTime() +meta.timeout;

						Test.worker.task = {title:null, meta, running:true, timing:new Date().getTime(), timeout, duration:false, error:null};
						Test.worker.task.title = "#" + meta.serial;
						if (typeof meta.name === "string"
								&& meta.name.trim().length > 0)
							Test.worker.task.title += " " + meta.name.replace(/[\x00-\x20]+/g, " ").trim();
						Test.fire(Test.EVENT_PERFORM, Test.status());
						Composite.asynchron(() => {
							const task = Test.worker.task;
							try {task.meta.test();
							} catch (error) {
								task.error = error;
								if (!task.error.message
										|| !task.error.message.trim())
									task.error.message = "failed";
							} finally {
								if (task.meta.expected) {
									if (task.error) {
										if (typeof task.meta.expected === "function"
												&& task.error instanceof(task.meta.expected))
											task.error = null;
										if (typeof task.meta.expected === "object"
												&& task.meta.expected instanceof(RegExp)
												&& String(task.error).match(task.meta.expected))
											task.error = null;
									} else task.error = Error("Assert error expected failed");
								}
								task.running = false;
								task.duration = new Date().getTime() -task.timing;
								if (task.timeout
										&& task.timeout < new Date().getTime()
										&& !task.error) {
									task.error = new Error(`Timeout occurred, expected ${task.meta.timeout} ms but was ${task.duration} ms`);
									Test.fire(Test.EVENT_RESPONSE, Test.status());
									Test.worker.queue.faults++;
								}
								if (!task.error
										|| !String(task.error.message).match(/^Timeout occurred/)) {
									if (task.error)
										Test.worker.queue.faults++;
									Test.fire(Test.EVENT_RESPONSE, Test.status());
								}
								Test.worker.queue.lock = false;
							}
						});
						return;
					}

					window.clearTimeout(Test.worker.interval);
					window.clearTimeout(Test.worker.timeout);
					Test.fire(Test.EVENT_FINISH, Test.status());
					delete Test.worker;
				}, 25);
			},

			/**
			 * Suspends the current test run, which can be continued from the
			 * current test with Test.resume().
			 * @throws An error occurs in the following cases:
			 *     - No worker is present or cannot be suspended
			 */
			suspend() {
				if (Test.worker === undefined)
					throw new Error("Suspend is not available");
				Test.fire(Test.EVENT_SUSPEND, Test.status());
			},

			/**
			 * Continues the test run if it was previously suspended.
			 * @throws An error occurs in the following cases:
			 *     - No worker is present or cannot be resumed
			 */
			resume() {
				if (Test.worker === undefined
						|| Test.worker.status !== Test.EVENT_SUSPEND)
					throw new Error("Resume is not available");
				Test.fire(Test.EVENT_RESUME, Test.status());
			},

			/**
			 * Interrupts the current test run and discards all outstanding
			 * tests. The test run can be restarted with Test.start().
			 * @throws An error occurs in the following cases:
			 *     - No worker is present or cannot be interrupted
			 */
			interrupt() {
				if (Test.worker === undefined)
					throw new Error("Interrupt is not available");
				window.clearTimeout(Test.worker.interval);
				window.clearTimeout(Test.worker.timeout);
				Test.fire(Test.EVENT_INTERRUPT, Test.status());
				delete Test.worker;
			},

			/**
			 * Makes a snapshot of the status of the current test. The status
			 * contains details of the current task and the queue. The details
			 * are read-only and cannot be changed. If no test is executed,
			 * false is returned.
			 *
			 *     structure of details: {task:..., queue:...}
			 *
			 * task.title      title of the test task
			 * task.meta       meta information about the test itself name,
			 *                 test, timeout, expected, serial
			 * task.running    indicator when the test task is in progress
			 * task.timing     start time from the test task in milliseconds
			 * task.timeout    optional, the time in milliseconds when a timeout
			 *                 is expected
			 * task.duration   total execution time of the test task in
			 *                 milliseconds, is set with the end of the test
			 *                 task
			 * task.error      optional, if an unexpected error (also assert
			 *                 error) has occurred, which terminated the test
			 *                 task
			 *
			 * queue.timing    start time in milliseconds
			 * queue.size      original queue length
			 * queue.length    number of outstanding tests
			 * queue.progress  number of tests performed
			 * queue.lock      indicator when a test is performed and the queue
			 *                 is waiting
			 * queue.faults    number of detected faults
			 *
			 * @return an object with status information, otherwise false
			 */
			status() {

				const status = {};
				if (typeof Test.worker === "object"
						&& typeof Test.worker.task === "object") {
					status.task = {};
					Object.defineProperty(status.task, "title", {
						value: Test.worker.task.title,
						enumerable: true
					});
					Object.defineProperty(status.task, "meta", {
						value: Test.worker.task.meta,
						enumerable: true
					});
					Object.defineProperty(status.task, "running", {
						value: Test.worker.task.running,
						enumerable: true
					});
					Object.defineProperty(status.task, "timing", {
						value: Test.worker.task.timing,
						enumerable: true
					});
					Object.defineProperty(status.task, "timeout", {
						value: Test.worker.task.timeout,
						enumerable: true
					});
					Object.defineProperty(status.task, "duration", {
						value: Test.worker.task.duration,
						enumerable: true
					});
					Object.defineProperty(status.task, "error", {
						value: Test.worker.task.error,
						enumerable: true
					});
				}

				if (typeof Test.worker === "object"
						&& typeof Test.worker.queue === "object") {
					status.queue = {};
					Object.defineProperty(status.queue, "timing", {
						value: Test.worker.queue.timing,
						enumerable: true
					});
					Object.defineProperty(status.queue, "size", {
						value: Test.worker.queue.size,
						enumerable: true
					});
					Object.defineProperty(status.queue, "length", {
						value: Test.worker.queue.stack.length,
						enumerable: true
					});
					Object.defineProperty(status.queue, "progress", {
						value: Test.worker.queue.progress,
						enumerable: true
					});
					Object.defineProperty(status.queue, "lock", {
						value: Test.worker.queue.lock,
						enumerable: true
					});
					Object.defineProperty(status.queue, "faults", {
						value: Test.worker.queue.faults,
						enumerable: true
					});
				}

				if (status.task === undefined
						&& status.queue === undefined)
					return false;
				return status;
			}
		};

		/** Backlog of created/registered test tasks */
		const _stack = new Set();

		/** Map with events and their registered listeners */
		const _listeners = new Map();

		(() => {

			// Redirection of the console level INFO, ERROR, WARN, LOG when
			// using tests. The outputs are buffered for analysis and listeners
			// can be implemented whose callback method is called at console
			// outputs.

			/** Cache for analyzing console output */
			const _output = {log:"", warn:"", error:"", info:""};

			console.output = {
				get log()   {return _output.log;},
				get warn()  {return _output.warn;},
				get error() {return _output.error;},
				get info()  {return _output.info;}
			};

			/** Clears the cache from the console output. */
			console.output.clear = () => {
				_output.log   = "";
				_output.warn  = "";
				_output.error = "";
				_output.info  = "";
			};

			/** Set of registered listeners for occurring console outputs. */
			const _listeners = new Set();

			/**
			 * Registers a callback function for console output.
			 * Expected method signatures:
			 *     function(level)
			 *     function(level, ...)
			 * @param callback callback function
			 */
			console.listen = function(callback) {
				_listeners.add(callback);
			};

			/**
			 * General method for redirecting console levels. If the script is in a
			 * frame, at the parent object it will also try to trigger this method.
			 * The parent object is always triggered after the current object. If an
			 * error occurs when calling the current object, the parent object is
			 * not triggered.
			 * @param level
			 * @param variants
			 * @param output
			 */
			console.forward = function(level, variants, output) {
				_output[level] += Array.from(variants).join(", ");
				if (output)
					output(...variants);
				_listeners.forEach((callback) =>
					callback(...([level, ...variants])));
				if (!parent
						|| parent === window
						|| !parent.console
						|| typeof parent.console.forward !== "function")
					return;
				parent.console.forward(...(Array.from(arguments).slice(0, 2)));
			};

			/** Redirect for the level: LOG */
			const _log = console.log;
			console.log = function(...variants) {
				console.forward("log", variants, _log);
			};

			/** Redirect for the level: WARN */
			const _warn = console.warn;
			console.warn = function(...variants) {
				console.forward("warn", variants, _warn);
			};

			/** Redirect for the level: ERROR */
			const _error = console.error;
			console.error = function(...variants) {
				console.forward("error", variants, _error);
			};

			/** Redirect for the level: INFO */
			const _info = console.info;
			console.info = function(...variants) {
				console.forward("info", variants, _info);
			};

			/** In case of an error, it is forwarded to the console. */
			window.addEventListener("error", (event) => {
				if (parent && parent !== window)
					console.forward("error", ((...variants) => variants)(event.message), null);
			});
		})();

		/**
		 * Enhancement of the JavaScript API
		 * The following events are triggered during simulation:
		 *     focus, keydown, keyup, change
		 * @param value simulated input value
		 * @param clear option false suppresses emptying before input
		 */
		compliant("Element.prototype.typeValue", function(value, clear) {
			this.focus();
			if (clear !== false)
				this.value = "";
			const element = this;
			value = (value || "").split("");
			value.forEach((digit) => {
				element.trigger("keydown");
				element.value = (element.value || "") + digit;
				element.trigger("keyup");
			});
			this.trigger("input");
		});

		/**
		 * Enhancement of the JavaScript API
		 * Adds a method that creates a plain string for an Element.
		 */
		compliant("Element.prototype.toPlainString", function() {
			return this.outerHTML;
		});

		/**
		 * Enhancement of the JavaScript API
		 * Adds a method that creates a plain string for a Node.
		 */
		compliant("Node.prototype.toPlainString", function() {
			return (new XMLSerializer()).serializeToString(this);
		});

		/**
		 * Enhancement of the JavaScript API
		 * Adds a method that creates a plain string for an Object.
		 */
		compliant("Object.prototype.toPlainString", function() {
			if (this !== null
					&& typeof this[Symbol.iterator] === 'function')
				return JSON.stringify([...this]);
			return JSON.stringify(this);
		});

		/**
		 * Enhancement of the JavaScript API
		 * Adds a method to trigger an event for elements.
		 * @param event   type of event
		 * @param bubbles deciding whether the event should bubble up
		 *     through the event chain or not
		 * @param cancel  defining whether the event can be canceled
		 */
		compliant("Element.prototype.trigger", function(event, bubbles = false, cancel = true) {
			this.dispatchEvent(new Event(event, {bubbles:bubbles, cancelable:cancel}));
		});

		/**
		 * A set of assertion methods useful for writing tests.
		 * Only failed assertions are recorded.
		 * These methods can be used directly:
		 *     Assert.assertEquals(...);
		 */
		compliant("Assert", {

			/**
			 * Creates a new assertion based on an array of variant parameters.
			 * Size defines the number of test values. If more parameters are
			 * passed, the first must be the message.
			 * @param parameters
			 * @param size
			 */
			create(parameters, size) {

				const assert = {message:null, values:[], error(...variants) {
					variants.forEach((parameter, index, array) => {
						array[index] = String(parameter).replace(/\{(\d+)\}/g, (match, index) => {
							if (index > assert.values.length)
								return "[null]";
							match = String(assert.values[index]);
							match = match.replace(/\s*[\r\n]+\s*/g, " ");
							return match;
						});
					});

					let message = "expected {1} but was {2}";
					if (assert.message !== null) {
						assert.message = assert.message.trim();
						if (assert.message)
							message = assert.message;
					}
					message = "{0} failed, " + message;
					message = message.replace(/\{(\d+)\}/g, (match, index) => {
						if (index > variants.length)
							return "[null]";
						match = String(variants[index]);
						match = match.replace(/\s*[\r\n]+\s*/g, " ");
						return match;
					});
					return new Error(message);
				}};

				parameters = Array.from(parameters);
				if (parameters.length > size)
					assert.message = parameters.shift();
				while (parameters.length > 0)
					assert.values.push(parameters.shift());

				return assert;
			},

			/**
			 * Asserts that a value is true.
			 * If the assertion is false, an error with message is thrown.
			 * The method has the following various signatures:
			 *     function(message, value)
			 *     function(value)
			 * @param message
			 * @param value
			 */
			assertTrue(...variants) {
				const assert = Assert.create(variants, 1);
				if (assert.values[0] === true)
					return;
				throw assert.error("Assert.assertTrue", "true", "{0}");
			},

			/**
			 * Asserts that a value is false.
			 * If the assertion is false, an error with message is thrown.
			 * The method has the following various signatures:
			 *     function(message, value)
			 *     function(value)
			 * @param message
			 * @param value
			 */
			assertFalse(...variants) {
				const assert = Assert.create(variants, 1);
				if (assert.values[0] === false)
					return;
				throw assert.error("Assert.assertFalse", "false", "{0}");
			},

			/**
			 * Asserts that two values are equals.
			 * Difference between equals and same: === / == or !== / !=
			 * If the assertion is false, an error with message is thrown.
			 * The method has the following various signatures:
			 *     function(message, expected, actual)
			 *     function(expected, actual)
			 * @param message
			 * @param expected
			 * @param actual
			 */
			assertEquals(...variants) {
				const assert = Assert.create(variants, 2);
				if (assert.values[0] === assert.values[1])
					return;
				throw assert.error("Assert.assertEquals", "{0}", "{1}");
			},

			/**
			 * Asserts that two values are not equals.
			 * Difference between equals and same: === / == or !== / !=
			 * If the assertion is false, an error with message is thrown.
			 * The method has the following various signatures:
			 *     function(message, unexpected, actual)
			 *     function(unexpected, actual)
			 * @param message
			 * @param unexpected
			 * @param actual
			 */
			assertNotEquals(...variants) {
				const assert = Assert.create(variants, 2);
				if (assert.values[0] !== assert.values[1])
					return;
				throw assert.error("Assert.assertNotEquals", "not {0}", "{1}");
			},

			/**
			 * Asserts that two values are the same.
			 * Difference between equals and same: === / == or !== / !=
			 * If the assertion is false, an error with message is thrown.
			 * The method has the following various signatures:
			 *     function(message, expected, actual)
			 *     function(expected, actual)
			 * @param message
			 * @param expected
			 * @param actual
			 */
			assertSame(...variants) {
				const assert = Assert.create([], variants, 2);
				if (assert.values[0] === assert.values[1])
					return;
				throw assert.error("Assert.assertSame", "{0}", "{1}");
			},

			/**
			 * Asserts two values are not the same.
			 * Difference between equals and same: === / == or !== / !=
			 * If the assertion is false, an error with message is thrown.
			 * The method has the following various signatures:
			 *     function(message, unexpected, actual)
			 *     function(unexpected, actual)
			 * @param message
			 * @param unexpected
			 * @param actual
			 */
			assertNotSame(...variants) {
				const assert = Assert.create(variants, 2);
				if (assert.values[0] !== assert.values[1])
					return;
				throw assert.error("Assert.assertNotSame", "not {0}", "{1}");
			},

			/**
			 * Asserts that a value is undefined.
			 * If the assertion is false, an error with message is thrown.
			 * The method has the following various signatures:
			 *     function(message, value)
			 *     function(value)
			 * @param message
			 * @param value
			 */
			assertUndefined(...variants) {
				const assert = Assert.create(variants, 1);
				if (assert.values[0] === undefined)
					return;
				throw assert.error("Assert.assertUndefined", "undefined", "{0}");
			},

			/**
			 * Asserts that a value is not undefined.
			 * If the assertion is false, an error with message is thrown.
			 * The method has the following various signatures:
			 *     function(message, value)
			 *     function(value)
			 * @param message
			 * @param value
			 */
			assertNotUndefined(...variants) {
				const assert = Assert.create(variants, 1);
				if (assert.values[0] !== undefined)
					return;
				throw assert.error("Assert.assertNotUndefined", "not undefined", "{0}");
			},

			/**
			 * Asserts that a value is null.
			 * If the assertion is false, an error with message is thrown.
			 * The method has the following various signatures:
			 *     function(message, value)
			 *     function(value)
			 * @param message
			 * @param value
			 */
			assertNull(...variants) {
				const assert = Assert.create(variants, 1);
				if (assert.values[0] === null)
					return;
				throw assert.error("Assert.assertNull", "null", "{0}");
			},

			/**
			 * Asserts that a value is not null.
			 * If the assertion is false, an error with message is thrown.
			 * The method has the following various signatures:
			 *     function(message, value)
			 *     function(value)
			 * @param message
			 * @param value
			 */
			assertNotNull(...variants) {
				const assert = Assert.create(variants, 1);
				if (assert.values[0] !== null)
					return;
				throw assert.error("Assert.assertNotNull", "not null", "{0}");
			},

			/**
			 * Fails a test with an optional message.
			 * The method has the following various signatures:
			 *     function(message)
			 *     function()
			 * @param message
			 */
			fail(message) {
				if (message)
					message = String(message).trim();
				throw new Error("Assert.fail" + (message ? ", " + message : ""));
			}
		});
	}
});