const path = require("path")

const SOURCE_PATH = "."

module.exports = {
    entry: SOURCE_PATH + "/compress.js",
    target: "node",
    mode: "production",
    output: {
        filename: "../development/compress.js",
        path: path.resolve(__dirname, SOURCE_PATH)
    },
    optimization: {
        minimize: true
    }
}