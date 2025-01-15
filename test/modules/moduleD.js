const moduleA = {
    test: "A"
};

var moduleB = {
    test: "B"
};

let moduleC = {
    test: "C"
};

window["moduleF"] = {
    test: "F"
};

Namespace.create("moduleG", {
    test: "G"
});

Namespace.use("moduleH");
