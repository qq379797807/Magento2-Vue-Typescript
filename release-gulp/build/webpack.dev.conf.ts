import * as path from 'path'
import * as webpack from 'webpack'
import { VueLoaderPlugin } from 'vue-loader'
import { themeConfig } from '../build'
import { WebpackConfig, InputConfig } from '../packages'
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

let { area, src } = themeConfig.default

const baseConfig = new WebpackConfig({
    root:  path.resolve(__dirname, '../app'),
    entry: () => new Promise((resolve) => resolve([
        path.resolve(__dirname, '../app/main.tsx')
    ])),
    cache: true,
    output: {
        path: path.resolve(__dirname, `../../app/design/${area}/${src}/web/js`),
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
        new MiniCssExtractPlugin({
            filename: `../dist/css/[name].[contenthash:8].css`
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../app/index.html'),
            filename: 'index.html',
            inject: true,
            hash: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            },
            chunksSortMode: 'none'
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    optimization: {
        minimize: false,
        namedModules: true,
        namedChunks: true,
        splitChunks: {
            chunks: "async",
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: true,
            cacheGroups: {
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                }
            }
        },
        runtimeChunk: {
            name: 'runtime'
        }
    }
})

const webpackDevConfig: InputConfig = baseConfig.getConfig()

export default webpackDevConfig