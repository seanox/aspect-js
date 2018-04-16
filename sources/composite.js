/**
 *  LIZENZBEDINGUNGEN - Seanox Software Solutions ist ein Open-Source-Projekt,
 *  im Folgenden Seanox Software Solutions oder kurz Seanox genannt. Diese
 *  Software unterliegt der Version 2 der GNU General Public License.
 *
 *  Seanox aspect-js, JavaScript Client Faces
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
 *  TODO:
 *  - Composite-Attribute sind elementar und unveränderlich, sie werden bei ersten Auftreten eines Elements gelesen und können später nicht geänert werden, da sie dann aus Element-Cache verwendet werden 
 *  - Element-Attribute sind auch dann elementar und unveränderlich, wenn diese eine Expression enthalten
 *  
 *  Composite 1.0 20180402
 *  Copyright (C) 2018 Seanox Software Solutions
 *  Alle Rechte vorbehalten.
 *
 *  @author  Seanox Software Solutions
 *  @version 1.0 20180402
 */
if (typeof(Composite) == 'undefined') {
    
    /** 
     *  TODO:
     *  TODO: - add tag param
     *        - add tag repeat / loop
     *        - add tag interval
     */
    Composite = {};
    
    //TODO:
    Composite.elements;
    
    /** Assoziative array for custom tags (key:tag, value:function) */
    Composite.macros;

    /** RegExp to detect custom tags */
    Composite.pattern;

    //TODO: 
    Composite.counter = {render:0, scan:0, serial:0};
    
    /** Constant for attribute composite */
    Composite.ATTRIBUTE_COMPOSITE = "composite";
    
    /** Constant for attribute condition */
    Composite.ATTRIBUTE_CONDITION = "condition";
    
    /** Constant for attribute type */
    Composite.ATTRIBUTE_TYPE = "type";
  
    /** Constant for attribute id */
    Composite.ATTRIBUTE_ID = "id";
    
    /** Constant for attribute import */
    Composite.ATTRIBUTE_IMPORT = "import";
    
    /** Constant for attribute name */
    Composite.ATTRIBUTE_NAME = "name";
    
    //TODO:
    Composite.ATTRIBUTE_SEQUENCE = "sequence";
    
    /** Constant for attribute expression */
    Composite.ATTRIBUTE_EXPRESSION = "expression";    

    //TODO:
    Composite.PATTERN_ATTRIBUTE_ACCEPT = /^composite|condition|id|name|sequence|$/i;   
    
    //TODO:
    Composite.PATTERN_ATTRIBUTE_IGNORE = /import|condition/i;    

    //TODO:
    Composite.PATTERN_EXPRESSION_CONTAINS = /\{\{((.*?[^\\](\\\\)*)|((\\\\)*))*?\}\}/g;   
    
    //TODO:
    Composite.PATTERN_EXPRESSION_EXCLUSIVE = /^\s*\{\{((.*?[^\\](\\\\)*)|((\\\\)*))*\}\}\s*$/;

    //TODO:
    Composite.PATTERN_ELEMENT_SCRIPT = /script/i;
    
    //TODO:
    Composite.PATTERN_ELEMENT_TEXT = /text/i;    

    //TODO:
    Composite.PATTERN_ELEMENT_IGNORE = "/script|style/i";

    //TODO:
    Composite.PATTERN_ELEMENT_SCRIPT_TYPE = /^(text|condition)\/javascript$/i;
    
    //TODO:
    Composite.PATTERN_COMPOSITE_CONTEXT = /^[a-z](?:[\w\.]*[\w])*$/i;
    
    //TODO:
    Composite.PATTERN_CUSTOMIZE_SCOPE = /^[a-z]\w*$/i;

    /** 
     *  List of possible DOM events
     *  see also https://www.w3schools.com/jsref/dom_obj_event.asp
     */
    Composite.events = " abort afterprint animationend animationiteration animationstart"
        + " beforeprint beforeunload blur"
        + " canplay canplaythrough change click contextmenu copy cut"
        + " dblclick drag dragend dragenter dragleave dragover dragstart drop durationchange"
        + " ended error"
        + " focus focusin focusout"
        + " hashchange"
        + " input invalid"
        + " keydown keypress keyup"
        + " load loadeddata loadedmetadata loadstart"
        + " message mousedown mouseenter mouseleave mousemove mouseover mouseout mouseup mousewheel"
        + " offline online open"
        + " pagehide pageshow paste pause play playing popstate progress"
        + " ratechange resize reset"
        + " scroll search seeked seeking select show stalled storage submit suspend"
        + " timeupdate toggle touchcancel touchend touchmove touchstart transitionend"
        + " unload"
        + " volumechange"
        + " waiting wheel";

    /**
     *  Enhancement of the JavaScript API
     *  Adds a static counter for assigning serial IDs to the Node object.
     */    
    if (Node.indication === undefined)
        Node.indication = 0;
    
    /**
     *  Enhancement of the JavaScript API
     *  Adds a method for getting the serial ID to the Node objects.
     */ 
    if (Node.prototype.ordinal === undefined) {
        Node.prototype.indicate = function() {
            this.serial = this.serial || Node.indication++;
            return this.serial;
        };     
    };
    
    /**
     *  Enhancement of the JavaScript API
     *  Adds a capitalize methode to the String objects.
     */ 
    if (String.prototype.capitalize === undefined) {
        String.prototype.capitalize = function() {
            return this.charAt(0).toUpperCase() + this.slice(1);
        };
    };

    /**
     *  Enhancement of the JavaScript API
     *  Adds a HTML encode methode to the String objects.
     */ 
    if (String.prototype.encodeHtml === undefined) {
        String.prototype.encodeHtml = function() {
            var element = document.createElement("div");
            element.textContent = this;
            return element.innerHTML;
        };
    };    
    
    /**
     *  Enhancement of the JavaScript API
     *  Adds a method for encoding the string objects in hexadecimal code.
     */      
    if (String.prototype.encodeHex === undefined) {
        String.prototype.encodeHex = function() {
            var text = this;
            var result = "";
            for (var loop = 0; loop < text.length; loop++) {
                var digit = Number(text.charCodeAt(loop)).toString(16).toUpperCase();
                while (digit.length < 2)
                    digit = "0" + digit;            
                result += digit;
            }
            return "0x" + result;
        };
    };  
    
    /**
     *  Enhancement of the JavaScript API
     *  Adds a method for decoding hexadecimal code to the string objects.
     */     
    if (String.prototype.decodeHex === undefined) {
        String.prototype.decodeHex = function() {
            var text = this;
            if (text.match(/^0x/))
                text = text.substring(2);
            var result = "";
            for (var loop = 0; loop < text.length; loop += 2)
                result += String.fromCharCode(parseInt(text.substr(loop, 2), 16));
            return result;
        };
    };      
    
    //TODO:
    //TODO: fire events render start/progress/end
    Composite.asynchron = function(task, sequence, variants) {
        
        var method = function(arguments) {
            var invoke = arguments[0];
            invoke(arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
            if (invoke == Composite.render)
                Composite.counter.render--;
            else if (invoke == Composite.scan)
                Composite.counter.scan--;        
        };
        
        if (task == Composite.render)
            Composite.counter.render++;
        else if (task == Composite.scan)
            Composite.counter.scan++;
        if (sequence)
            method(arguments);
        else window.setTimeout(method, 0, arguments);
    };
    
    //TODO: Event-Management (Render + Mount)
    
    //TODO:
    Composite.mount = function(selector) {
    };
    
    //TODO:
    Composite.scan = function(selector) {
    };
    
    //TODO:
    Composite.customize = function(scope, rendering) {
        
        //Custom tags, here also called macro, are based on a case-insensitive
        //tag name (key) and a render function (value). In this method, the
        //tag name and the render functions are registered and a RegExp will be
        //created so that the custom tags can be found faster.
        
        if (typeof(scope) !== "string")
            throw new TypeError("Invalid scope: " + typeof(scope));
        if (typeof(rendering) !== "function"
                && rendering !== null
                && rendering !== undefined)
            throw new TypeError("Invalid rendering: " + typeof(rendering));        
        if (!scope.match(Composite.PATTERN_CUSTOMIZE_SCOPE))
            throw new Error("Invalid scope" + (scope.trim() ? ": " + scope : ""));
        
        Composite.macros = Composite.macros || {};
        if (rendering == null)
            delete Composite.macros[scope.toLowerCase()];
        else Composite.macros[scope.toLowerCase()] = rendering;
        
        var pattern = new Array();
        for (var macro in Composite.macros)
            pattern.push(macro);
        if (pattern.length)
            Composite.pattern = new RegExp("^" + pattern.join("|") + "$", "i");
        else Composite.pattern = null;
    };
    
    /**
     *  TODO:
     *  TODO: Rendern vom import-Attribute
     *        Es muss zwei Arten unterstuetzen.
     *             1. Einfach
     *        Der Inhalt wird direkt in das Tag eingefuegt
     *             2. Module/Komponenten-Set
     *        Dabei liefert das Nachladen ein Index-Dateien mit Dateien, deren
     *        Inhalt eingefuegt werden muss. Es koennen verschiedene
     *        Medien-Dateien sein (HTML, JS, CSS, SVG, ...). Der Inhalt muss
     *        dann korrekt nach der Reihenfolge in der Liste eingefuegt werden.
     *  TODO: Rendern von Skripten
     *        Werden beim Rendern skripte ermittelt, muessen diese ausgefuhert
     *        werden, wenn das condition-Attribute true ist oder kein
     *        condition-Attribute vorhanden ist. Die Herausforderung ist das
     *        asynchrone Rendern. Daher mussen die Skripte "ThreadSafe" sein.
     *        Evtl. kann auch der Inhalt aller Skripte gesammelt werden und erst
     *        am Ende (nach Abschluss vom Rendering) ausgeführt werden.
     */
    Composite.render = function(selector, sequence) {
        
        if (!selector)
            return;
        
        if (typeof selector === "string") {
            selector = selector.trim();
            if (!selector)
                return;
            var nodes = document.querySelectorAll(selector);
            nodes.forEach(function(node, index, array) {
                Composite.asynchron(Composite.render, sequence, node, sequence);
            });
            return;
        }
        
        if (!(selector instanceof Node))
            return;
        
        Composite.elements = Composite.elements || new Array();
        
        //Register each analyzed node/element and minimizes multiple analysis.
        //For registration, the serial number of the node/element is used.
        //The node prototype has been enhanced with creation and a get-method.
        //During the analysis, the attributes of a element (not node) containing
        //an expression are cached in the memory (Composite.elements).
        var serial = selector.indicate();
        var object = Composite.elements[serial];
        if (!object) {
            object = {serial:serial, element:selector, attributes:{}};
            Composite.elements[serial] = object;
            if ((selector instanceof Element)
                    && selector.attributes)
                Array.from(selector.attributes).forEach(function(attribute, index, array) {
                    if ((attribute.value || "").match(Composite.PATTERN_EXPRESSION_CONTAINS)
                            || attribute.name.match(Composite.PATTERN_ATTRIBUTE_ACCEPT))
                        object.attributes[attribute.nodeName.toLowerCase()] = attribute.value;
                });
        }
        
        sequence = sequence || object.attributes[Composite.ATTRIBUTE_SEQUENCE] != undefined;
        
        //Nodes of type TEXT_NODE are changed to text-elements.
        //The content is stored in the value-attribute of the wrapper-object.
        //If the element is rendered later, the value-attribute is interpreted
        //and the result is output via textContent.
        //Script and style elements are ignored.
        if (selector.nodeType == Node.TEXT_NODE) {
            
            //Ignore script and style tags, no expression is replaced here.
            if (selector.parentNode
                    && selector.parentNode.nodeName.match(Composite.PATTERN_ELEMENT_IGNORE))
                return;
            
            //Ignore text nodes without expression.
            if (!selector.textContent.match(Composite.PATTERN_EXPRESSION_CONTAINS))
                return;
            
            //Replacement of the text nodes with a text element.
            //The expression will be stored in the value-attribute of the
            //wrapper-object and not directly not on the element itself. Found
            //expressions are replaced by simple expressions {{serial}} and a
            //new text-element with a wrapper-object is created for the
            //expressions, which is later inserted into the DOM.
            //Empty expressions are ignored, are replaced by void/nothing.
            var content = selector.textContent;
            content = content.replace(Composite.PATTERN_EXPRESSION_CONTAINS, function(match, offset, content) {
                match = match.substring(2, match.length -2).trim();
                if (!match)
                    return "";
                var node = document.createElement("text");
                var serial = node.indicate();
                var object = {serial:serial, element:node, attributes:{}};
                object.attributes[Composite.ATTRIBUTE_EXPRESSION] = "{{" + match + "}}";
                Composite.elements[serial] = object;                
                return "{{" + serial + "}}";
            });
            
            //The content of the found text nodes is separated into text-nodes
            //for the raw text and text-elements for the expressions. The result
            //is an array of elements (#Text + Text), which replace the found
            //text node in the DOM. For this purpose, a temporary placeholder
            //(empty) is inserted. The newly created text nodes/elements of the
            //found expressions are interpreted and filled as text content.
            var empty = document.createTextNode("");
            selector.parentNode.replaceChild(empty, selector);
            var words = content.split(/(\{\{\d+\}\})/);
            words.forEach(function(word, index, array) {
                if (word.match(/^\{\{\d+\}\}$/)) {
                    var serial = parseInt(word.substring(2, word.length -2).trim());
                    var object = Composite.elements[serial];
                    word = object.attributes[Composite.ATTRIBUTE_EXPRESSION];
                    word = Expression.eval(serial + ":" + Composite.ATTRIBUTE_EXPRESSION, word);
                    object.element.textContent = word;
                    array[index] = object.element;
                } else array[index] = document.createTextNode(word);
            });
            //The new elements are inserted.
            words.forEach(function(node, index, array) {
                empty.parentNode.insertBefore(node, empty);
            });
            //The temporary placeholder will be removed.
            empty.parentNode.removeChild(empty); 

            return;
        }  
        
        if (!(selector instanceof Element))
            return;        
        
        //The condition attribute is interpreted.
        //As result of the expression true/false is expected and will be set as
        //an absolute value for the condition attribute - so only true or false.
        //Elements are hidden with the condition attribute via CSS and only
        //explicitly displayed with [condition=true].
        //JavaScript elements are executed or not.
        var condition = object.attributes[Composite.ATTRIBUTE_CONDITION];
        if (condition) {
            condition = Expression.eval(serial + ":" + Composite.ATTRIBUTE_CONDITION, condition);
            selector.setAttribute(Composite.ATTRIBUTE_CONDITION, condition !== true);
            //Recursive processing is stopped at the first element where the
            //condition-attribute is false. Further sub-elements are not followed.
            if (condition !== true)
                return;
            if (selector.nodeName.match(Composite.PATTERN_ELEMENT_SCRIPT)) {
                var type = (selector.getAttribute(Composite.ATTRIBUTE_TYPE) || "").trim();
                if (type.match(Composite.PATTERN_ELEMENT_SCRIPT_TYPE)) {
                    try {eval(selector.textContent);
                    } catch (exception) {
                        console.error(exception);
                    }
                }
            }
        }
        
        //TODO: sequence
        //For elements with the import-attribute, the content is loaded and the
        //inner HTML element will be replaced by the content. If the content can
        //be loaded successfully, the import-attribute is removed.
        if (selector.hasAttribute(Composite.ATTRIBUTE_IMPORT)) {
            var module = (selector.getAttribute(Composite.ATTRIBUTE_IMPORT) || "").trim();
            (function(element, url) {
                var request = new XMLHttpRequest();
                request.overrideMimeType("text/plain");
                request.open('GET', url, true);
                request.onreadystatechange = function() {
                    //TODO: fire events
                    if (request.readyState == 4) {
                        if (request.status == "200") {
                            element.innerHTML = request.responseText;
                            element.removeAttribute(Composite.ATTRIBUTE_IMPORT);
                            Composite.render(element);
                            return;
                        }
                        function HttpRequestError(message) {
                            this.name = 'HttpRequestError';
                            this.message = message;
                            this.stack = (new Error()).stack;
                        }
                        HttpRequestError.prototype = new Error;
                        throw new HttpRequestError("HTTP status " + request.status + " for " + url);
                    }
                };
                request.send(null);  
            })(selector, module);
            return;
        }         
        
        //TODO: add origin counting (-> Composite.render)
        //If a custom tag exists, the macro is executed.
        Composite.macros = Composite.macros || {};
        var macro = Composite.macros[selector.nodeName.toLowerCase()];
        if (macro) {
            Composite.asynchron(macro, sequence, selector);
            return;
        }
        
        //The expression in the attributes is interpreted.
        //The expression is stored in a wrapper object and loaded from there,
        //the attributes of the element can be overwritten in a render cycle and
        //are available (conserved) for further cycles. A special case is the
        //text element. The result is output here as textContent.
        //Script and style elements are ignored.
        if (!selector.nodeName.match(Composite.PATTERN_ELEMENT_IGNORE)) {
            for (var attribute in object.attributes) {
                //Ignore internal attributes (import, condition, ...).
                if (attribute.match(Composite.PATTERN_ATTRIBUTE_IGNORE))
                    continue;
                var value = object.attributes[attribute];
                if (!(value || "").match(Composite.PATTERN_EXPRESSION_CONTAINS))
                    continue;
                var context = serial + ":" + attribute;
                value = Expression.eval(context, value);
                value = String(value).encodeHtml();
                value = value.replace(/"/g, "&quot;");
                selector.setAttribute(attribute, value);
            }
        }
        
        //Follow other element children recursively.
        //Scripts, style elements and custom tags are ignored.
        //The content of custom tags is considered like a template.
        if (selector.childNodes
                && !selector.nodeName.match(Composite.PATTERN_ELEMENT_IGNORE)) {
            Array.from(selector.childNodes).forEach(function(node, index, array) {
                Composite.asynchron(Composite.render, sequence, node, sequence);
            });
        }
        
        //(Re)Index new composite elements in the DOM.
        //TODO: R: use of the collection of detected nodes by MutationObserver
        //TODO: Q: sequence or not? 
        //Composite.asynchron(Composite.scan, false, selector);
    };
    
    //An additional style is inserted before the current script element.
    //It is required for displaying and hiding elements with a condition attribute.
    (function() {
        var css = document.createElement("style");
        css.setAttribute("type", "text/css");
        css.textContent = "*[condition]:not([condition='true']) {display:none!important;}";
        var script = document.querySelector("script");
        script.parentNode.insertBefore(css, script); 
    })();
    
    //With the start the complete body element is rendered.
    window.addEventListener("load", function(event) {
        Composite.render("body");
    });
};

if (typeof(Expression) === "undefined") {    
    
    /**
     *  Expression / Expression Language (EL) is mechanism that simplifies the
     *  accessibility of the data stored in JavaScrript bean component and other
     *  object on the client side. There are many operators that are used in EL
     *  like arithmetic and logical operators to perform an expression.
     */
    Expression = {};

    /** Constant for element type text */
    Expression.TYPE_TEXT = 1;
    
    /** Constant for element type expression */
    Expression.TYPE_EXPRESSION = 2;
    
    /** Constant for element type literal */
    Expression.TYPE_LITERAL = 3;
    
    /** Constant for element type script */
    Expression.TYPE_SCRIPT = 4;
    
    /** Constant for element type keyword */
    Expression.TYPE_KEYWORD = 5;
    
    /** Constant for element type other */
    Expression.TYPE_OTHER = 6;
    
    /** Constant for element type method */
    Expression.TYPE_METHOD = 7;
    
    /** Constant for element type value */
    Expression.TYPE_VALUE = 8;
    
    /** Constant for element type logic */
    Expression.TYPE_LOGIC = 9;
    
    /** Cache (expression / script) */
    Expression.cache;
    
    /**
     *  Resolves a value-expression recursively if necessary.
     *  Value expressions refer to a field in a static bean.
     *  The value is retrieved using a corresponding get method or, if this is
     *  not available, the value is retrieved directly from the field.
     *  For the Get method, the first character is changed from field name to
     *  uppercase and prefixed with get.
     *      e.g. {{ExampleBean.value}} -> ExampleBean.getValue()
     *  @param  context    context or expression without context
     *  @param  expression expression in combination with a context
     *  @retrun the value of the value-expression, otherwise false
     */
    Expression.lookup = function(context, expression) {

        try {
            if (typeof context === "string"
                    && expression === undefined) {
                if (context.indexOf(".") < 0)
                    return eval(context);
                expression = context.match(/^(.*?)\.(.*)$/);
                return Expression.lookup(eval(expression[1]), expression[2]);
            }
            
            if (expression.indexOf(".") < 0)
                expression = [null, expression];
            else expression = expression.match(/^(.*?)\.(.*)$/);
            var method = "get" + expression[1].capitalize();
            if (typeof context[method] === "function") {
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
            return false;
        }
    };
    
    /**
     *  Analyzes and finds the components of an expression and creates a
     *  JavaScript from them. Created scripts are stored in a cache and reused
     *  as needed.
     *  @param  expression
     *  @return the created JavaScript
     */
    Expression.parse = function(expression) {
    
        //Terms:
        //An expression is an array of words.
        //A word is an elementary phrase or a partial array with more words.
        
        //Structure:
        //The words are classified in several steps and separated according to
        //their characteristics.
        
        //  +-------------------------------------------------------------+
        //  |            words (entireness of the expression)             |            
        //  +--------+----------------------------------------------------+
        //  |  text  |                     expression                     |
        //  |        +-----------+----------------------------------------+
        //  |        |  literal  |                 script                 |
        //  |        |           +-----------+----------------------------+
        //  |        |           |  keyword  |           other            |
        //  |        |           |           +---------+----------+-------+
        //  |        |           |           |  value  |  method  | logic |
        //  +--------+-----------+-----------+---------+----------+-------+
        
        //Notes:
        //Line breaks we are interpreted as blanks. Therefore, all line breaks
        //are replaced by spaces. So the characters 0x0D and 0x0A can be used
        //later as internal separator and auxiliary marker.

        //Empty expressions are interpreted like an empty string.
        if (expression === null
                || expression === undefined)
            expression = "";
        else expression = expression.trim();
        if (expression === "")
            return "";
        
        var cascade = {words:[], text:[], expression:[], literal:[], script:[], keyword:[], other:[], value:[], method:[], logic:[]};
        
        //Step 1:
        //Separation of text and expression as words.
        //Expression is always in {{...}} included, everything else before/after
        //is text. Escaping of {{ and }} is not possible and is not supported.
        //Alternatively, an expression with literals can be used.
        //    e.g. {{"{" + "{"}} / {{"}" + "}"}}
        
        //Lines breaks are ignored, they are interpreted as spaces.
        //So the start and end of expressions can be marked with line breaks.
        //After that, text and expressions can be separated.
        expression = expression.replace(/(^[\r\n]+)|([\r\n]+$)/g, "");
        expression = expression.replace(/[\r\n]/g, " ");
        expression = expression.replace(/(\{\{)/g, "\n$1");
        expression = expression.replace(/(\}\})/g, "$1\n");
        expression = expression.replace(/(^\n+)|(\n+$)/g, "");

        var collate = function(word) {
            if (word.type == Expression.TYPE_TEXT)
                cascade.text.push(word);
            else if (word.type == Expression.TYPE_EXPRESSION)
                cascade.expression.push(word);
            else if (word.type == Expression.TYPE_SCRIPT)
                cascade.script.push(word);
            else if (word.type == Expression.TYPE_LITERAL)
                cascade.literal.push(word);
            else if (word.type == Expression.TYPE_KEYWORD)
                cascade.keyword.push(word);
            else if (word.type == Expression.TYPE_OTHER)
                cascade.other.push(word);
            else if (word.type == Expression.TYPE_VALUE)
                cascade.value.push(word);
            else if (word.type == Expression.TYPE_METHOD)
                cascade.method.push(word);
            else if (word.type == Expression.TYPE_LOGIC)
                cascade.logic.push(word);
        };
        
        expression.split(/\n/).forEach(function(entry, index, array) {
            var object = {type:Expression.TYPE_TEXT, data:entry};
            if (entry.match(/^\{\{.*\}\}$/)) {
                object.data = object.data.substring(2, object.data.length -2);
                object.type = Expression.TYPE_EXPRESSION;
            } else object.data = "\"" + object.data.replace(/\\/, '\\\\').replace(/"/, '\\"') + "\"";
            collate(object);
            cascade.words.push(object);
        });
        
        //Step 2:
        //Separation of expressions in literal and script as partial words.
        //The expression objects are retained but their value changes from text
        //to array with literal and script as partial words.

        cascade.expression.forEach(function(entry, index, array) {
            var text = entry.data;
            text = text.replace(/(^|[^\\])((?:\\{2})*\\[\'])/g, '$1\n$2\n');
            text = text.replace(/(^|[^\\])((?:\\{2})*\\[\"])/g, '$1\r$2\r');
            var words = new Array();
            var pattern = /(^.*?)(([\'\"]).*?(\3|$))/m;
            while (text.match(pattern)) {
                text = text.replace(pattern, function(match, script, literal) {
                    script = script.replace(/\n/g, '\'');
                    script = script.replace(/\r/g, '\"');
                    script = {type:Expression.TYPE_SCRIPT, data:script};
                    collate(script);
                    words.push(script);
                    literal = literal.replace(/\n/g, '\'');
                    literal = literal.replace(/\r/g, '\"');
                    literal = {type:Expression.TYPE_LITERAL, data:literal};
                    collate(literal);
                    words.push(literal);
                    return "";
                });
            }
            if (text.length > 0) {
                text = text.replace(/\n/g, '\'');
                text = text.replace(/\r/g, '\"');
                text = {type:Expression.TYPE_SCRIPT, data:text};
                collate(text);
                words.push(text);
            }
            entry.data = words;
        });
        
        //Step 3:
        //Converting reserved word (keywords) into operators. 
        //supported keywords a nd mapping:
        //    and &&        empty !         div /
        //    eq  ==        ge    >=        gt  >
        //    le  <=        lt    <         mod %
        //    ne  !=        not   !         or  ||
        //additional keywords without mapping:
        //    true, false, null, instanceof, typeof, undefined
        //Separation of script in keyword and other as partial words.
        //IMPORTANT: KEYWORDS ARE CASE-INSENSITIVE
        
        var keywords = new Array("and", "&&", "or", "||", "not", "!", "eq", "==",
                "ne", "!=", "lt", "<", "gt", ">", "le", "<=", "ge", ">=", "empty", "!",
                "div", "/", "mod", "%");
        cascade.script.forEach(function(entry, index, array) {
            var text = entry.data;
            for (var loop = 0; loop < keywords.length; loop += 2) {
                var pattern = new RegExp("(^|[^\\w\\.])(" + keywords[loop] + ")(?=[^\\w\\.]|$)", "ig");
                text = text.replace(pattern, "$1\n\r" + keywords[loop +1] + "\n");
            }
            text = text.replace(/(^|[^\w\.])(true|false|null|instanceof|typeof|undefined)(?=[^\w\.]|$)/ig, function(match, script, keyword) {
                return script + "\n\r" + keyword.toLowerCase() + "\n";
            });
            var words = new Array();
            text.split(/\n/).forEach(function(entry, index, array) {
                var object = {type:Expression.TYPE_OTHER, data:entry};
                if (entry.match(/^\r/)) {
                    object.data = entry.substring(1);
                    object.type = Expression.TYPE_KEYWORD;
                }
                collate(object);
                words.push(object);
            });
            entry.data = words;
        });
        
        //Step 4:
        //Detection of value- and method-expressions
        //    method expression: (^|[^\w\.])([a-zA-Z](?:[\w\.]*[\w])*)(?=\()
        //The expression is followed by a round bracket.
        //    value expression: (^|[^\w\.])([a-zA-Z](?:[\w\.]*[\w])*(?=(?:[^\w\(\.]|$)))
        //The expression is followed by a non-word character or the end.
        
        cascade.other.forEach(function(entry, index, array) {
            var text =  entry.data;
            text = text.replace(/(^|[^\w\.])([a-zA-Z](?:[\w\.]*[\w])*(?=(?:[^\w\(\.]|$)))/g, '$1\n\r\r$2\n');
            text = text.replace(/(^|[^\w\.])([a-zA-Z](?:[\w\.]*[\w])*)(?=\()/g, '$1\n\r$2\n');
            var words = new Array();
            text.split(/\n/).forEach(function(entry, index, array) {
                var object = {type:Expression.TYPE_LOGIC, data:entry};
                if (entry.match(/^\r\r/)) {
                    object.data = "Expression.lookup(\"" + entry.substring(2) + "\")";
                    object.type = Expression.TYPE_VALUE;
                } else if (entry.match(/^\r[^\r]/)) {
                    object.data = entry.substring(1);
                    object.type = Expression.TYPE_METHOD;
                }
                collate(object);
                words.push(object);
            });
            entry.data = words;
        });
        
        //Step 5:
        //Create a flat sequence from the cascade.
        
        var words = new Array();
        var mux = function(word) {
            if (Array.isArray(word))
                word.forEach(function(entry, index, array) {
                    mux(entry);    
                });
            else if (Array.isArray(word.data))
                word.data.forEach(function(entry, index, array) {
                    mux(entry);    
                });            
            else if (typeof word.data === "string")
                if (word.data
                        && word.data.length)
                    words.push(word);
            else
                mux(word.data);
        };    
        mux(cascade.words);
        
        //Step 6:
        //Create a script from the Word sequence.
        //The possible word types: text, literal, keyword, value, method, logic
        //Text and expression are always separated by brackets.
        //    e.g. text + (expression) + text + ...
        //The line break characters are misused for marking the transitions from
        //text to expression.
        
        var script = "";
        words.forEach(function(word, index, array) {
            if (word.type == Expression.TYPE_TEXT)
                script += "\n" + word.data + "\r";
            else if (word.type == Expression.TYPE_KEYWORD)
                script += " " + word.data + " ";
            else if (word.type == Expression.TYPE_LITERAL
                    || word.type == Expression.TYPE_VALUE
                    || word.type == Expression.TYPE_METHOD
                    || word.type == Expression.TYPE_LOGIC)
                script += word.data;
        });
        script = script.replace(/(^\n)|(\r$)/, '');
        script = script.replace(/(\n\r)+/g, ' + ');
        script = script.replace(/\r/g, ' + (');
        script = script.replace(/\n/g, ') + ');
        script = script.replace(/(^\s*\+\s*)|(\s*\+\s*$)/, '');
        
        return script;
    };
    
    /**
     *  Interprets the passed expression.
     *  In case of an error, the error is returned and no exception is thrown.
     *  A serial can be specified optionally. The serial is an alias for caching
     *  compiled expressions. Without, the expressions are always compiled. 
     *  The method uses variable parameters and has the following signatures:
     *      function(expression) 
     *      function(serial, expression)
     *  @param  serial
     *  @param  expression
     *  @return the return value of the interpreted expression or an error if a
     *          error or exception has occurred
     */
    Expression.eval = function(variants) {
        
        Expression.cache = Expression.cache || new Array();
        
        var expression = null;
        if (arguments.length > 1)
            expression = arguments[1];
        else if (arguments.length > 0)
            expression = arguments[0];

        var serial = null;
        if (arguments.length > 1)
            serial = arguments[0];
        
        var script = null;
        script = serial ? Expression.cache[serial] || null : null;
        if (!script)
            script = Expression.parse(expression);
        Expression.cache[serial] = script;
        
        try {return eval(script);
        } catch (exception) {
            exception.message += "\n\t" + script;
            console.error(exception);
            return exception.message;
        }
    };
};