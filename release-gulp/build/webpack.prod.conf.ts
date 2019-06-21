import * as path from 'path'
import * as webpack from 'webpack'
import { VueLoaderPlugin } from 'vue-loader'
import { WebpackConfig, InputConfig } from '../packages'
import { themeConfig } from '../build'
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

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