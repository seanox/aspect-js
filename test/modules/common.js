if (navigator.engine === undefined) {
    navigator.engine = "webkit";
    if (navigator.userAgent.match(/Mozilla\/[\d\.]+ \(.*\) AppleWebKit\/[\d\.]+ \(KHTML, like Gecko\) [\w\d\.\s\/]+ Chrome\/[\d\.]+ Safari\/[\d\.]+/i))
        navigator.engine = "blink";
    if (navigator.userAgent.match(/Mozilla\/[\d\.]+ \(.*\) AppleWebKit\/[\d\.]+ \(KHTML, like Gecko\) Chrome\/[\d\.]+ Safari\/[\d\.]+/i))
        navigator.engine = "webkit";
    if (navigator.userAgent.match(/Mozilla\/[\d\.]+ \(iPad;.*\) AppleWebKit\/[\d\.]+ \(KHTML, like Gecko\) [\w\d\.\s\/]+ Safari\/[\d\.]+/i))
        navigator.engine = "webkit-ios";
    if (navigator.userAgent.match(/Mozilla\/[\d\.]+ \(Macintosh;.*\) AppleWebKit\/[\d\.]+ \(KHTML, like Gecko\) Version\/[\d\.]+ Safari\/[\d\.]+/i))
        navigator.engine = "webkit-macos";
    if (navigator.userAgent.match(/Mozilla\/[\d\.]+ \(.*\) Gecko\/[\d\.]+/i))
        navigator.engine = "gecko";
    if (navigator.userAgent.match(/Mozilla\/[\d\.]+ \(.*\) Gecko\/[\d\.]+ Goanna\/[\d\.]+/i))
        navigator.engine = "goanna";
    if (navigator.userAgent.match(/Mozilla\/[\d\.]+ \(.*\) AppleWebKit\/[\d\.]+ \(KHTML, like Gecko\) Chrome\/[\d\.]+ Safari\/[\d\.]+ Edge\/[\d\.]+/i))
        navigator.engine = "edge";
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