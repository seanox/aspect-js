if (navigator.engine === undefined) {
    navigator.engine = navigator.userAgent.match(/edge/i);
    if (!navigator.engine
            && navigator.userAgent.match(/version.*safari/i))
        navigator.engine = "webkit";
    if (!navigator.engine
            && navigator.userAgent.match(/like gecko/i)
            && !navigator.userAgent.match(/\) chrome\/[\d\.]+ safari\/[\d\.]+$/i))
        navigator.engine = "blink";
    if (!navigator.engine)
        navigator.engine = navigator.userAgent.match(/goanna/i);
    if (!navigator.engine
            && navigator.userAgent.match(/gecko\/[\d\.]+\b/i))
        navigator.engine = "gecko";
    if (!navigator.engine)
        navigator.engine = navigator.userAgent.match(/chrome/i);
    if (navigator.engine)
        navigator.engine = String(navigator.engine).toLowerCase();
};

if (Test.read === undefined) {
    Test.read = function(content) {
        var request = new XMLHttpRequest();
        request.overrideMimeType("text/plain");
        if (content)
            if (content.match(/\?/))
                content += "&" + new Date().getTime();
            else content += "?" + new Date().getTime();
        request.open("GET", content, false);
        request.send();
        if (request.status != "200")
            throw Error("HTTP status " + request.status + " for " + url);
        return request.responseText;
    };
};

if (typeof Assert !== "undefined") {

    Assert.assertSameText = function(expected, actual) {
        expected = (expected || "").trim().replace(/\t/g, "    ");
        expected = expected.replace(/(\r\n)|(\n\r)|[\r\n]/gm, "\n");
        expected = expected.replace(/(^\s+)|(\s+$)/gm, "");
        actual = actual.trim();
        actual = actual.replace(/\t/g, "    ");
        actual = actual.replace(/(\r\n)|(\n\r)|[\r\n]/gm, "\n");
        actual = actual.replace(/(^\s+)|(\s+$)/gm, "");
        Assert.assertEquals(expected, actual);    
    };
    
    Assert.assertSameTo = function(selector, actual) {
        var element = document.querySelector(selector);
        var content = element.innerHTML.trim().replace(/\t/g, "    ");
        content = content.replace(/(\r\n)|(\n\r)|[\r\n]/gm, "\n");
        content = content.replace(/(^\s+)|(\s+$)/gm, "");
        actual = actual.trim();
        actual = actual.replace(/\t/g, "    ");
        actual = actual.replace(/(\r\n)|(\n\r)|[\r\n]/gm, "\n");
        actual = actual.replace(/(^\s+)|(\s+$)/gm, "");
        Assert.assertEquals(content, actual);    
    };
}