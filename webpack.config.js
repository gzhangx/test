var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: ['babel-polyfill', './client/main.js'],
    output: { path: __dirname, filename: 'dist/bundle.js' },
    debug: true,
    devtooldev: "#eval-source-map",
    devtool: "cheap-module-source-map",
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.scss$/,
                loaders: ['style', 'css', 'sass']
            },
            { test: /\.css$/, loader: "style-loader!css-loader" },
        ]
    },
};