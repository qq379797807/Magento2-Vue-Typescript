import * as _ from 'lodash'
import * as webpack from 'webpack'
import { Configuration } from 'webpack'
import { Base } from './base'
import { InputConfig } from '../decorators'
import { WebpackConfig } from '../config/webpack.base.conf'

export class ConfigurationArgs implements Configuration { }

export class WebpackCore extends Base {
    public static register: () => WebpackCore
    private configs: { [key: string]: any }
    private buildConfig: { [key: string]: Configuration }

    constructor () {
        super()
        this.configs = {}
        this.buildConfig = {}
    }

    public pluginWebpack (target: any) {
        let mode = new target()
        
        return {
            default: (config: Configuration) => {
                _.map(this.configs, (item: { config: InputConfig, types: any[] }, index: string) => {
                    if (_.isFunction(mode[index])) {
                        let args: any = _.map(item.types, type => {
                            if (type.name === 'Object') return config
                        })
                        this.buildConfig = {
                            ...this.buildConfig,
                            [index]: mode[index](...args)
                        }
                    }
                })
            }
        }
    }

    public pluginConfig (key: string, config: InputConfig, types: any[]) {
        this.configs = {
            ...this.configs,
            [key]: {
                config,
                types
            }
        }
    }
}