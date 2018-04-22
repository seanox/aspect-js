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
 *  
 *  Common 1.0 20180402
 *  Copyright (C) 2018 Seanox Software Solutions
 *  Alle Rechte vorbehalten.
 *
 *  @author  Seanox Software Solutions
 *  @version 1.0 20180402
 */
if (typeof(Namespace) === "undefined") {

    //TODO:
    Namespace = {};
    
    //TODO:
    Namespace.PATTERN_NAMESPACE_SEPARATOR = /[\\\/\.]/;
    
    //TODO:
    Namespace.PATTERN_NAMESPACE = /^(?:[\\\/]*[a-z][\w]*)(?:[\\\/\.][a-z][\w]*)*$/i;
    
    //TODO:
    Namespace.PATTERN_NAMESPACE_SEPARATOR_CONFLICT = /(\..*[\\\/])|(\\.*[\.\/])|(\/.*[\\\.])/;    
    
    /**
     *  TODO:
     *  @throws An error occurs in the following cases:
     *    - event is not valid or is not supported
     *    - callback function is not implemented correctly or does not exist
     */
    Namespace.using = function(namespace) {
        
        if (namespace == null)
            return null;

        if (typeof(namespace) !== "string")
            throw new TypeError("Invalid namespace: " + typeof(namespace));
        if (!namespace.match(Namespace.PATTERN_NAMESPACE)
                || namespace.match(Namespace.PATTERN_NAMESPACE_SEPARATOR_CONFLICT))
            throw new Error("Invalid namespace" + (namespace.trim() ? ": " + namespace : ""));
        
        var scope = window;
        namespace = namespace.replace(/^[\\\/]/, '');
        namespace.split(Namespace.PATTERN_NAMESPACE_SEPARATOR).forEach(function(entry, index, array) {
            if (typeof(scope[entry]) === "undefined") {
                scope[entry] = new Object();
            } else if (typeof(scope[entry]) === "object") {
            } else if (typeof(scope[entry]) === "function") {
            } else throw new Error("Invalid namespace: " + array.slice(0, index +1).join("."));
            scope = scope[entry];
        });
        
        return scope; 
    };
}