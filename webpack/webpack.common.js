const path = require("path")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const srcDir = "../src/"

module.exports = {
    entry: {
        content: path.join(__dirname, srcDir + "content.ts"),
        main: path.join(__dirname, srcDir + "scripts/main.ts"),
        background: path.join(__dirname, srcDir + "background.ts"),
    },
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "[name].js",
        library: "pmd",
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: "manifest.json", to: "manifest.json" },
                { from: "assets", context: "src" },
                { from: "views", context: "src" },
                { from: "styles", context: "src" },
            ],
        }),
    ],
}
