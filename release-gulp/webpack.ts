import * as path from 'path'
import { Configuration } from 'webpack'
import { Webpack, Config } from './packages'
const HtmlWebpackPlugin = require('html-webpack-plugin')

@Webpack()
export class webpack {
    @Config({
        root:  path.join(__dirname, '../app'),
        entry: () => new Promise((resolve) => resolve([
            path.resolve(__dirname, '../app/main.tsx')
        ])),
        output: {
            path: path.resolve(__dirname, './dist'),
            filename: '[name].js',
            publicPath: '/'
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.join(__dirname, './app/index.html'),
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
        ]
    })

    public dev(config: Configuration) {
        return config;
    }
}