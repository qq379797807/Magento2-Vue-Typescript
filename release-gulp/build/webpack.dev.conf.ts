import * as path from 'path'
import * as webpack from 'webpack'
import { VueLoaderPlugin } from 'vue-loader'
import { themeConfig } from '../build'
import { WebpackConfig, InputConfig } from '../packages'
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const DashboardPlugin = require('webpack-dashboard/plugin')

let { area, src } = themeConfig.default

const baseConfig = new WebpackConfig({
    root:  path.resolve(__dirname, '../app'),
    entry: () => new Promise((resolve) => resolve({
        cms_index: path.resolve(__dirname, '../app/src/pager/cms_index.tsx'),
        customer_login: path.resolve(__dirname, '../app/src/pager/customer_login.tsx')
    })),
    cache: true,
    output: {
        path: path.resolve(__dirname, `../../app/design/${area}/${src}/web/js`),
        filename: '[name].bundle.js',
        publicPath: path.resolve(__dirname, `../../app/design/${area}/${src}/web/js`)
    },
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        open: true,
        inline: true,
        hot: true,
        port: 80,
        host: 'dev.car.cn',
        https: false,
        compress: true,
        progress: true,
        overlay: {
            warnings: true,
            errors: true
        },
        historyApiFallback: true,
        disableHostCheck: true,
        publicPath: path.resolve(__dirname, `../../app/design/${area}/${src}/web/js`),
        contentBase: path.resolve(__dirname, `../../app/design/${area}/${src}/web/js`)
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.NamedChunksPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: `../../app/design/${area}/${src}/web/css/[name].[contenthash:8].css`
        }),
        new DashboardPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    optimization: {
        namedModules: true,
        namedChunks: true,
        nodeEnv: 'development',
        flagIncludedChunks: false,
        occurrenceOrder: false,
        sideEffects: false,
        usedExports: false,
        concatenateModules: false,
        splitChunks: {
            chunks: 'async',
            minSize: 10000,
            minChunks: 1,
            maxAsyncRequests: Infinity,
            maxInitialRequests: Infinity
        },
        minimize: false,
        runtimeChunk: {
            name: 'runtime'
        }
    }
})

const webpackDevConfig: InputConfig = baseConfig.getConfig()

export default webpackDevConfig