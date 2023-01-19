const moduleA = {
    test: "A"
};

var moduleB = {
    test: "B"
};

let moduleC = {
    test: "C"
};

moduleE = {
    test: "E"
};

window["moduleF"] = {
    test: "F"
};

Namespace.create("moduleG", {
    test: "G"
});

Namespace.use("moduleH");
