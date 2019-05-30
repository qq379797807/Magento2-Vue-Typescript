import 'reflect-metadata'
import { Gulp } from 'gulp'
import { Output, Plugin } from 'webpack'
import { Core } from './core/core'
import { ITask } from './core/models'
import { WebpackCore } from './core/webpack.core'

export function GulpFile (gulp?: Gulp) {
    return function (target: Function, key?: string) {
        return Core
            .register()
            .GulpFile(target, gulp)
    }
}

export function Task (task?: ITask) {
    return function (target: any, key: string) {
        let types = Reflect.getMetadata('design:paramtypes', target, key)
        
        return Core
            .register()
            .Task(key, types, task)
    }
}

export function Webpack () {
    return function (target: any, key?: string) {
        return WebpackCore
            .register()
            .pluginWebpack(target)
    }
}

export interface InputConfig {
    root: string,
    entry: any,
    plugins?: Plugin[],
    output: Output,
    [key: string]: any
}

export function Config (config: InputConfig) {
    return function (target: any, key: string) {
        let types = Reflect.getMetadata('design:paramtypes', target, key)
        
        return WebpackCore
            .register()
            .pluginConfig(key, config, types)
    }
}