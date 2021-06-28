const { merge } = require("webpack-merge")
const common = require("./webpack.common.js")
const optimization = require("./webpack-optimization.config")

module.exports = merge(common, {
    devtool: "inline-source-map",
    optimization,
    mode: "production",
})
