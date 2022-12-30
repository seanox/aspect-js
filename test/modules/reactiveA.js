Namespace.create("reactiveX", {
    valueA: 10000,
    valueB: {
        valueC: 20000,
        valueE: {
            valueF: 30000,
            valueH: null,
        }
    },
    valueG: null
});

Namespace.create("reactiveA", reactiveX.toReactProxy());

reactiveA.a = "A";
reactiveX.a = "X";

reactiveX.valueX = {};
reactiveA.valueY = {};

window.setTimeout(() => {reactiveA.valueA++;}, 1000);
window.setTimeout(() => {reactiveA.valueA++;}, 1250);
window.setTimeout(() => {reactiveA.valueA++;}, 1500);

window.setTimeout(() => {reactiveA.valueB.valueC += 10;}, 2000);
window.setTimeout(() => {reactiveA.valueB.valueC += 10;}, 2250);
window.setTimeout(() => {reactiveA.valueB.valueC += 10;}, 2500);

window.setTimeout(() => {reactiveA.valueB.valueE.valueF += 100}, 3000);
window.setTimeout(() => {reactiveA.valueB.valueE.valueF += 100}, 3250);
window.setTimeout(() => {reactiveA.valueB.valueE.valueF += 100}, 3500);

window.setTimeout(() => {reactiveX.a = "B"}, 1000);
window.setTimeout(() => {reactiveA.a = "C"}, 3000);
