if (navigator.engine === undefined) {
    if (navigator.userAgent.match(/Mozilla\/[\d\.]+ \(.*\) AppleWebKit\/[\d\.]+ \(KHTML, like Gecko\).* Safari\/[\d\.]+/i))
        navigator.engine = "webkit";
    if (navigator.userAgent.match(/Mozilla\/[\d\.]+ \(.*\) AppleWebKit\/[\d\.]+ \(KHTML, like Gecko\).* Chrome\/[\d\.]+/i))
        navigator.engine = "blink";
    if (navigator.userAgent.match(/Mozilla\/[\d\.]+ \(.*\) Gecko\/[\d\.]+/i))
        navigator.engine = "gecko";
    if (navigator.userAgent.match(/Mozilla\/[\d\.]+ \(.*\) Gecko\/[\d\.]+ Goanna\/[\d\.]+/i))
        navigator.engine = "goanna";
}

if (Test.read === undefined) {
    Test.read = function(content) {
        const request = new XMLHttpRequest();
        request.overrideMimeType("text/plain");
        if (content)
            if (content.match(/\?/))
                content += "&" + new Date().getTime();
            else content += "?" + new Date().getTime();
        request.open("GET", content, false);
        request.send();
        if (request.status !== 200)
            throw new Error("HTTP status " + request.status + " for " + request.responseURL);
        return request.responseText;
    };
}

if (typeof Assert !== "undefined") {

    Assert.assertSameText = function(expected, actual) {
        expected = (expected || "").trim().replace(/\t/g, "    ");
        expected = expected.replace(/(\r\n)|(\n\r)|[\r\n]/gm, "\n");
        expected = expected.replace(/(\s*\n\s*)+/gm, "\n");
        expected = expected.replace(/(^\s+)|(\s+$)/gm, "");
        actual = (actual || "").trim().replace(/\t/g, "    ");
        actual = actual.replace(/\t/g, "    ");
        actual = actual.replace(/(\r\n)|(\n\r)|[\r\n]/gm, "\n");
        actual = actual.replace(/(\s*\n\s*)+/gm, "\n");
        actual = actual.replace(/(^\s+)|(\s+$)/gm, "");
        Assert.assertEquals(expected, actual);    
    };
    
    Assert.assertSameTo = function(selector, actual) {
        const element = document.querySelector(selector);
        let content = element.innerHTML.trim().replace(/\t/g, "    ");
        content = content.replace(/(\r\n)|(\n\r)|[\r\n]/gm, "\n");
        content = content.replace(/(\s*\n\s*)+/gm, "\n");
        content = content.replace(/(^\s+)|(\s+$)/gm, "");
        actual = (actual || "").trim().replace(/\t/g, "    ");
        actual = actual.replace(/(\r\n)|(\n\r)|[\r\n]/gm, "\n");
        actual = actual.replace(/(\s*\n\s*)+/gm, "\n");
        actual = actual.replace(/(^\s+)|(\s+$)/gm, "");
        Assert.assertEquals(content, actual);    
    };
    
    Assert.assertIn = function(values, actual) {
        const assert = Assert.create(arguments, 2);
        if (assert.values[0].includes(assert.values[1]))
            return;
        assert.values[0] = "[" + assert.values[0].join(", ") + "]";
        throw assert.error("Assert.assertIn", "in {0}", "{1}");
    };
}