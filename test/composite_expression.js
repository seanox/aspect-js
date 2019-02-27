normalizeOutput = function(output) {
    output = output || "";
    output = output.replace(/illegal character/ig, "~~~Error_1~");
    output = output.replace(/fields are not currently supported/ig, "~~~Error_1~");
    output = output.replace(/invalid or unexpected token/ig, "~~~Error_1~");
    output = output.replace(/invalid character/ig, "~~~Error_1~");
    return output; 
};