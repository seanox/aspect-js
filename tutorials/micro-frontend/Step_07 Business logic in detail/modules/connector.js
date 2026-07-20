const connector = {
    call(method, url, data, callback) {
        const request = new XMLHttpRequest(!!callback);
        request.open(method, url, true);
        request.setRequestHeader("Content-Type", "application/json");
        if (!!callback) {
            request.onloadstart = function(event) {
                document.querySelector("#spinner").setAttribute("enabled", "true");};
            request.onloadend = function(event) {
                document.querySelector("#spinner").removeAttribute("enabled");};
            request.onload = function(event) {
                if (Math.ceil(this.status /100) != 2) {
                    callback.call(this, new Error("Request failed: " + this.status + " " + this.statusText));
                    return
                }
                const jsonResponse = this.status == 200
                        && this.responseText ? JSON.parse(this.responseText) : null;
                callback.call(this, this.status, jsonResponse);
            };
            request.onabort = function(event) {
                callback.call(this, new Error("Connection aborted"));
            };
            request.ontimeout = function(event) {
                callback.call(this, new Error("Connection timeout occurred"));
            };
            request.onerror = function(event) {
                callback.call(this, new Error("Connection failed"));
            };
        }
        request.send(data ? JSON.stringify(data) : null);
        if (!!callback)
            return;
        if (Math.ceil(request.status /100) != 2)
            throw new Error("Request failed: " + request.status + " " + request.statusText);
        const jsonResponse = request.status == 200
                && request.responseText ? JSON.parse(request.responseText) : null;
        return jsonResponse;               
    }
};

// Object connector was declared as const in the current scope. To make it
// globally usable, it is made public with the #export-macro.
#export connector;