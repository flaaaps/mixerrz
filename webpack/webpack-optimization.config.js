const UglifyJsPlugin = require("uglifyjs-webpack-plugin")

const optimization = {
    minimizer: [
        new UglifyJsPlugin({
            uglifyOptions: {
                output: {
                    comments: false,
                },
                warnings: false,
                compress: {
                    drop_console: true,
                },
            },
        }),
    ],
}

module.exports = optimization
