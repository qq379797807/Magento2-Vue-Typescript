import * as path from 'path'
import { Configuration } from 'webpack'
import { Webpack, Config } from "./src"
const HtmlWebpackPlugin = require('html-webpack-plugin')

@Webpack()
export class webpack {
    @Config({
        root: __dirname,
        entry: path.resolve(__dirname, 'demo/src/index.js'),
        output: {
            path: path.resolve(__dirname, 'demo/dist'),
            filename: '[name].js',
            publicPath: '/'
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.join(__dirname, 'index.html'),
                filename: 'index.html',
                inject: 'body',
                hash: true
            })
        ]
    })

    public dev(config: Configuration) {
        return config;
    }
}