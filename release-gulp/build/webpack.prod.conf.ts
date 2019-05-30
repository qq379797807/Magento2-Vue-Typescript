import * as path from 'path'
import * as webpack from 'webpack'
import { VueLoaderPlugin } from 'vue-loader'
import { WebpackConfig } from '../src/config'
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const baseConfig = new WebpackConfig({
    root:  path.join(__dirname, '../app'),
    entry: [
        path.resolve(__dirname, '../app/main.tsx')
    ],
    output: {
        path: path.join(__dirname, '../dist'),
        filename: '[name].js',
        publicPath: './'
    },
    mode: 'production',
    devtool: 'cheap-module-source-map',
    performance: {
        hints: 'warning',
        maxAssetSize: 250000,
        maxEntrypointSize: 250000
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new VueLoaderPlugin(),
        new ExtractTextPlugin(`[name].[contenthash:8].css`),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '../app/index.html'),
            filename: 'index.html',
            inject: 'body',
            hash: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            }
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            vm: 'vue'
        })   
    ],
    optimization: {
        minimize: true,
        providedExports: true,
        usedExports: true,
        sideEffects: true,
        concatenateModules: true,
        noEmitOnErrors: true
    }

})
const webpackProdConfig = baseConfig.getConfig()

module.exports = {
    ...webpackProdConfig
}