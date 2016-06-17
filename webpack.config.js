var webpack = require('webpack');
var path = require('path');
var WebpackConfig = require('webpack-config').Config;

module.exports = new WebpackConfig().merge({
    context: path.join(__dirname, 'src/js'),
    entry: {
        dialog: './dialog.js'
    },
    externals: {
        jquery: 'jQuery'
    },
    resolve: {
        root: [
            path.join(__dirname, 'src/js')
        ]
    },
    resolveLoader: {
        root: [
            path.join(__dirname, 'node_modules')
        ]
    },
    output: {
        path: path.join(__dirname, 'public/js'),
        publicPath: ('/js/themes/mobile-new/js/'),
        filename: '[name].js',
        library: '[name]',
        libraryTarget: 'umd'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }}
        )
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                include: [
                    path.join(__dirname, 'src/js')
                ],
                query: {
                    presets: ['es2015'],
                    plugins: ['transform-object-assign', 'add-module-exports']
                }
            }
        ]
    }
});