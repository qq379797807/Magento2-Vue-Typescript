import * as fs from 'fs'
import * as path from 'path'
import * as gulp from 'gulp'
import * as os from 'os'
import * as makeDir from 'make-dir'
import { themeConfig } from '../build'

const { area, src, locale } = themeConfig.default

export default class Util {
    public isDir (dir: string): boolean {
        return fs.existsSync(dir)
    }

    public createDir (dir: string) {
        // makeDir(dir).then(path => {
        //     gutil.log(gutil.colors.green(`目录创建成功：${dir}`))
        // })
    }

    public initDir (modules: []) {
        Promise.all([
            '/layout',
            '/templates',
            '/styles',
            '/web'
        ]).then(() => {

        })
    }

    public getOs (): NodeJS.Platform {
        return os.platform()
    }

    public os (): string {
        return this.getOs() === 'win32' ? '\\' : '/'
    }

    public createEntry (list: Array<string>, option: any) {
        const obj: any = {}
        list.forEach((item: any) => {
            const name = item.filename ? `./js/${item.filename}` : `./js/${item}`
            obj[name] = path.resolve(__dirname, './src', `./js/${item}.js`)
            return Object.assign(obj, option)
        })
    }

    public getAppDir (): string {
        const os: string = this.os()
        const app_path: string = `..${os}app${os}design${os}${area}${os}${src}`
        
        return app_path
    }

    public getPubDir (): string {
        const os: string = this.os()
        const pub_path: string = `..${os}pub${os}static${os}${area}${os}${src}${os}${locale}`
        
        return pub_path
    }

    public getVarDir (): string {
        const os: string = this.os()
        const var_path: string = `..${os}var${os}view_preprocessed${os}pub${os}static${os}${area}${os}${src}${os}${locale}`
        
        return var_path
    }
}