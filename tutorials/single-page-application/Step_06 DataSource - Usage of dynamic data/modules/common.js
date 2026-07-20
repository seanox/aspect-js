/**
 * Creates an object based on data-structures.
 * The method is intended for deserialization.
 * Supported data types: XMLDocument / Node
 * @param  data
 * @return the created object
 */
compliant("Object.parse");
compliant(null, Object.parse = (data) => {

    let append = (object, name, value) => {
        if (value === null)
            return;
        if (object[name]) {
            if (object[name].constructor != Array)
                object[name] = [object[name]];
            object[name][object[name].length] = value;
        } else object[name] = value;
    };

    if (data instanceof Node) {

        if (data.nodeType == 9)
            return Object.parse(data.documentElement);
        if (data.nodeType != 1)
            return null;

        let meta = {text:null, data:null};
        for (let node of data.childNodes) {
            if (node.nodeType == 1) {
                meta = false;
                break;
            } else if (node.nodeType == 3) {
                meta.text = (meta.text || "") + node.nodeValue;
            } else if (node.nodeType == 4) {
                meta.data = (meta.data || "") + node.nodeValue;
            }
        }

        if (meta && meta.data != null)
            return meta.data;
        if (meta && meta.text != null)
            return meta.text;

        let object = {};
        for (let attribute of data.attributes)
            append(object, attribute.name, attribute.value);
        for (let child of data.childNodes)
            append(object, child.nodeName, Object.parse(child));
        return object;
    }

    throw new TypeError("Unsupported data type");
});