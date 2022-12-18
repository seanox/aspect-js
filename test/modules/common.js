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

if (String.prototype.simplify === undefined) {
    String.prototype.simplify = function () {
        return this.trim().replace(/\t/g, "    ")
            .replace(/(\r\n)|(\n\r)|[\r\n]/gm, "\n")
            .replace(/(\s*\n\s*)+/gm, "\n")
            .replace(/(^\s+)|(\s+$)/gm, "");
    }
}

if (typeof Assert !== "undefined") {

    Assert.assertSameText = function(expected, actual) {
        Assert.assertEquals((expected || "").simplify(), (actual || "").simplify());
    };
    
    Assert.assertSameTo = function(selector, actual) {
        const element = document.querySelector(selector);
        const content = element.innerHTML;
        Assert.assertEquals(content.simplify(), (actual || "").simplify());
    };
    
    Assert.assertIn = function(values, actual) {
        const assert = Assert.create(arguments, 2);
        if (assert.values[0].includes(assert.values[1]))
            return;
        assert.values[0] = "[" + assert.values[0].join(", ") + "]";
        throw assert.error("Assert.assertIn", "in {0}", "{1}");
    };
}