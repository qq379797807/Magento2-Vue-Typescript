import * as path from 'path'
import * as webpack from 'webpack'
import { VueLoaderPlugin } from 'vue-loader'
import { WebpackConfig } from '../src/config'
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const baseConfig = new WebpackConfig({
    root:  path.join(__dirname, '../app'),
    entry: [
        path.resolve(__dirname, '../app/main.tsx')
    ],
    cache: true,
    output: {
        path: path.join(__dirname, '../dist'),
        filename: '[name].js',
        publicPath: './'
    },
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development')
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
        namedModules: true,
        namedChunks: true
    }
})
const webpackDevConfig = baseConfig.getConfig()

module.exports = {
    ...webpackDevConfig
}