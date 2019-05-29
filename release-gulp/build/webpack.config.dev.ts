import * as path from 'path'
import { WebpackConfig } from '../src/config'
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
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '../app/index.html'),
            filename: 'index.html',
            inject: 'body',
            hash: true
        })
    ]
})
const config = baseConfig.getConfig()
console.log(config)

module.exports = {
    ...config,
    ...{
        devtool: 'cheap-module-eval-source-map',
        devServer: {
            open: true,
            inline: true,
            hot: true,
            port: 3000,
            progress: true,
            overlay: {
                warnings: true,
                errors: true
            },
            historyApiFallback: true,
            disableHostCheck: true
        },
        resolve: {
            extensions: ['.js', '.json']
        }
    }
}