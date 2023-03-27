const exampleE_A1 = "A-AAA";
const exampleE_A2 = {value: "A-BBB"};
const exampleE_A3 = () => {return "A-CCC";};
const exampleE_A4 = "A-DDD";
const exampleE_A5 = "A-EEE";
#export exampleE_A1 exampleE_A2 exampleE_A5@b.c.d
#export exampleE_A1@a.b.c

const exampleX_01 = "123\"" + 456 + "789\"";
const exampleX_02 = "123\'" + 456 + "789\'";
const exampleX_03 = "123\"" + 456 + "789\'";
const exampleX_04 = "123\'" + 456 + "789\"";
#export exampleX_01 exampleX_02 exampleX_03 exampleX_04

if (true) #export exampleE_A3;
if (false) #export exampleE_A4;

let exampleE_B1 = "B-AAA";
let exampleE_B2 = {value: "B-BBB"};
let exampleE_B3 = () => {return "B-CCC";};

#export exampleE_B1 exampleE_B2 exampleE_B3

try {#export exampleE_C1 exampleE_C2 exampleE_C3
} catch (error) {
    document.body.innerHTML += "\nX: " + error;
}
