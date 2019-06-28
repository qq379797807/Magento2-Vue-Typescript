import * as path from 'path'
import * as webpack from 'webpack'
import * as os from 'os'
import { VueLoaderPlugin } from 'vue-loader'
import { WebpackConfig, InputConfig } from '../packages'
import { themeConfig } from '../build'
const HappyPack = require('happypack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

const { area, src } = themeConfig.default
const createEntry: any = ((list: string[]) => {
    const params: any = {}
    list.map((url: string) => {    
        params[url] = path.resolve(__dirname, `../app/src/pager/${url}.tsx`)
    })

    return new Promise((resolve) => resolve(params))
})

const baseConfig = new WebpackConfig({
    root:  path.join(__dirname, '../app'),
    entry: () => createEntry([
        'cms_index',
        'cms_page',
        'catalog_category',
        'catalog_product',
        'checkout_cart',
        'checkout_index',
        'customer_login',
        'customer_create'
    ]),
    output: {
        path: path.join(__dirname, `../../app/design/${area}/${src}/web/js`),
        filename: '[name].bundle.js',
        publicPath: path.resolve(__dirname, `../../app/design/${area}/${src}/web/js`)
    },
    mode: 'development',
    devtool: 'inline-source-map',
    performance: {
        hints: 'warning',
        maxAssetSize: 250000,
        maxEntrypointSize: 250000
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV':  JSON.stringify('development')
        }),
        // new BundleAnalyzerPlugin({
        //     analyzerMode: 'server',
        //     analyzerHost: '127.0.0.1',
        //     analyzerPort: 8889,
        //     reportFilename: 'report.html',
        //     defaultSizes: 'parsed',
        //     openAnalyzer: true,
        //     generateStatsFile: false,
        //     statsFilename: 'stats.json',
        //     statsOptions: null,
        //     logLevel: 'info',
        // }),
        new ProgressBarPlugin(),
        new HappyPack({
            id: 'babel',
            loaders: ['babel-loader?cacheDirectory=true'],
            threadPool: happyThreadPool,
            verboseWhenProfiling: true,
        }),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: `[name].[contenthash:8].css`
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ],
    optimization: {
        namedModules: false,
        namedChunks: false,
        nodeEnv: 'development',
        flagIncludedChunks: true,
        occurrenceOrder: true,
        sideEffects: true,
        usedExports: true,
        concatenateModules: true,
        splitChunks: {
            minSize: 30000,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
        },
        noEmitOnErrors: true,
        minimize: true
    }
})
const webpackProdConfig: InputConfig = baseConfig.getConfig()

export default webpackProdConfig