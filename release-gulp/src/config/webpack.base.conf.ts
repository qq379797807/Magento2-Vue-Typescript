import * as path from 'path'
import { InputConfig } from '../decorators'
const ExtractTextPlugin = require('extract-text-webpack-plugin')

export class WebpackConfig {
    private path: string
    private useConfig: InputConfig

    constructor (config: InputConfig) {
        this.path = config.root
        this.useConfig = config
    }

    public get utils () {
        return {
            assetsPath: (_path?: string) => {
                _path = _path || ''
                let assetsSubDirectory = this.path
                return path.posix.join(assetsSubDirectory, _path)
            },
            cssLoaders: (options?: any) => {
                options = options || {}

                let cssLoader = {
                    loader: 'css-loader',
                    options: {
                        minimize: process.env.NODE_ENV === 'production',
                        sourceMap: options.sourceMap
                    }
                }

                const generateLoaders = (loader?: any, loaderOptions?: any) => {
                    let loaders = [cssLoader]
                    if (loader) {
                        loaders.push({
                            loader: `${loader}-loader`,
                            options: Object.assign({}, loaderOptions, {
                                sourceMap: options.sourceMap
                            })
                        })
                    }

                    if (options.extract) {
                        return ExtractTextPlugin.extract({
                            use: loaders,
                            fallback: 'vue-style-loader'
                        })
                    } else {
                        return ['vue-style-loader'].concat(<any[]>loaders)
                    }
                }

                return {
                    css: generateLoaders(),
                    postcss: generateLoaders(),
                    less: generateLoaders('less'),
                    sass: generateLoaders('sass', { indentedSyntax: true }),
                    scss: generateLoaders('sass'),
                    stylus: generateLoaders('stylus'),
                    styl: generateLoaders('stylus')
                }
            },
            styleLoaders: (options: any) => {
                let output = []
                let loaders = this.utils.cssLoaders(options)
                for (let extension in loaders) {
                    let loader = (<any>loaders)[extension]
                    output.push({
                        test: new RegExp(`\\.${extension}$`),
                        use: loader
                    })
                }
                return output
            }
        }
    }

    setEntry (config: InputConfig) {
        this.useConfig = config
    }

    getConfig () {
        let config = this.useConfig
        let { output } = this.useConfig
        let { entry } = this.useConfig
        let { plugins } = this.useConfig
        delete config.output
        delete config.entry
        delete config.plugins

        return {
            entry: entry,
            output,
            resolve: {
                extensions: ['.js', '.vue', '.scss', '.less', '.stylus', '.css', '.json']
            },
            mode: 'development',
            devServer: {
                open: true,
                inline: true,
                hot: true,
                port: 3000,
                colors: true,
                overlay: {
                    warnings: true,
                    errors: true
                }
            },
            module: {
                rules: [
                    {
                        test: /\.ts$/,
                        loader: 'ts-loader',
                        include: [this.path],
                        exclude: [
                            /node_modules/
                        ]
                    },
                    {
                        test: /\.js$/,
                        loader: 'babel-loader',
                        include: [this.path],
                        exclude: [
                            /node_modules/
                        ]
                    },
                    {
                        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: this.utils.assetsPath(`${this.path}/[name].[hash:7].[ext]`)
                        }
                    },
                    {
                        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: this.utils.assetsPath(`${this.path}/[name].[hash:7].[ext]`)
                        }
                    }
                ]
            },
            plugins,
            ...config
        }
    }
}