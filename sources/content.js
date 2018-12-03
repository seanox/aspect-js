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
 *  Content creates XML-based content for publication in the user interface.
 *  The content are loaded to the current language setting of the browser via
 *  the datasource and transformed into the final output format via Extensible
 *  Stylesheet Language (XSLT). Individual stylesheet can be used or a
 *  corresponding stylesheet with the same name is searched. For the final
 *  output, the transformed result will be rendered.
 *  
 *  Content 1.0 20181203
 *  Copyright (C) 2018 Seanox Software Solutions
 *  Alle Rechte vorbehalten.
 *
 *  @author  Seanox Software Solutions
 *  @version 1.0 20181203
 */
if (typeof Content === "undefined") {

    /** Static component for creating XML-based content for publication. */
    Content = {};
    
    /**
     *  Creates XML-based content for publication in the user interface.
     *  The content are loaded to the current language setting of the browser
     *  via the datasource and transformed into the final output format via
     *  Extensible Stylesheet Language (XSLT). An individual stylesheet can be
     *  passed or a corresponding stylesheet with the same name is searched.
     *  For the final output, the transformed result is rendered.
     *  @param  data  name of the datasource file
     *  @param  style stylesheet for the transformation (optional)
     *  @return the content created for publication as a node or node list.
     */
    Content.publish = function(data, style) {
      
        //Rendering is performed with the same lock as the current render
        //process when a render process is running. The result is always a deep
        //copy, so that any temporary variables are not deleted or distorted by
        //the subsequent rendering when they are inserted into the DOM. 
        var render = function(content) {
            var template = document.createElement("template");
            template.appendChild(content);
            Composite.render(template, true, Composite.render.lock);
            return template.cloneNode(true).childNodes;
        };
        
        data = (data || "").trim();
        if (!data)
            throw new TypeError("Invalid data");
        style = (style || "").trim() || data;
        style = DataSource.manipulate("xslt://" + style);
        data = DataSource.manipulate("xml://" + data);
        
        var immediate = style.evaluate("string(//*[local-name()='output'][1]/@immediate)", style, null, XPathResult.ANY_TYPE, null).stringValue;
        if (!immediate.match(/^no|off|false|0$/i))
            return render(DataSource.transform(data, style, true));
        return DataSource.transform(data, style, true);
    };
};