import * as fs from 'fs'
import * as path from 'path'
import * as gulp from 'gulp'
import * as os from 'os'
import * as makeDir from 'make-dir'
import { themeConfig } from '../build'
const tool = require('gulp-util')

const { area, src, locale } = themeConfig.default

export class Util {
    public isDir (dir: string): boolean {
        return fs.existsSync(dir)
    }

    public createDir (dir: string) {
        makeDir(dir).then((path: string) => {
            this.logMsg(`Directory init success：${dir}`, `magenta`)
        })
    }

    public copyFile (src: string, dest: string) {
        if (this.isDir(src)) {
            this.logMsg(`This is a directory ...`, `green`)
        } else {
            let readStream = fs.createReadStream(src)
            let writeSteam = fs.createWriteStream(dest)
            readStream
                .pipe(writeSteam)
                .on('end', () => {
                    this.logMsg(`Copy file success ...`, `green`)
                })
                .on('error', () => {
                    this.logMsg(`Copy file error ...`, `red`)
                })
        }
    }

    public logMsg (msg: string, color: string): any {
        return tool.log(tool.colors[color](`${msg}`))
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

    public getSrcDir (): string {
        const os: string = this.os()
        const src_path: string = `.${os}app${os}src${os}**${os}**`
        
        return src_path
    
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