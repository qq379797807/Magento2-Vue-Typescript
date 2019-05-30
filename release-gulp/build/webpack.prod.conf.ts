import * as path from 'path'
import * as webpack from 'webpack'
import { VueLoaderPlugin } from 'vue-loader'
import { WebpackConfig } from '../packages/config'
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const baseConfig = new WebpackConfig({
    root:  path.join(__dirname, '../app'),
    entry: () => new Promise((resolve) => resolve([
        path.resolve(__dirname, '../app/main.tsx')
    ])),
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
        new MiniCssExtractPlugin({
            filename: `[name].[contenthash:8].css`
        }),
        new webpack.HotModuleReplacementPlugin()  
    ],
    optimization: {
        minimize: true,
        namedModules: true,
        namedChunks: true,
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