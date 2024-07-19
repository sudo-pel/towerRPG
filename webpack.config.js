const path = require("path");

module.exports = {
    entry: './src/js/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js'
    },

    node: {
        module: 'empty',
        fs: 'empty',
        child_process: "empty"
    },

    devServer: {
        contentBase: './dist'
    },

    //mode: 'development'
};
