import * as path from 'path'
import * as merge from 'merge2'
import * as sourcemaps from 'gulp-sourcemaps'
import * as ts from 'gulp-typescript'
import { Gulp } from 'gulp'
import { themeConfig, webpackDevConfig, webpackProdConfig } from './build'
import { GulpFile, Task, Watch, WebpackServer, Vkoa, GT } from './packages'
const clean = require('gulp-clean')
const pump = require('pump')

const { area, src, styles, locale } = themeConfig.default
const appDir = `app/design/${area}/${src}`
const pubDir = `pub/static/${area}/${src}/${locale}`

@GulpFile()
export class Gulpflie {
    @Task()
    public default (gulp: Gulp) {
        console.log(src)
    }

    @Task()
    public del (gulp: Gulp) {
        pump([
            gulp.src([
                `../var/view_preprocessed/${pubDir}`,
                `../${pubDir}`
            ]),
            clean({
                read: false,
                force: true
            })
        ])
    }

    @Task({
        // befores: ['del']
    })
    public copy (gulp: Gulp, watch: Watch) {
        watch.run(
            path.join(__dirname, 'src/**/*.js'),
            (gulp: Gulp) => {
                gulp.src([path.join(__dirname, 'src/**/*.js')])
                    .pipe(gulp.dest('./dist'))
            }
        )
    }

    @Task({
        befores: ['copy']
    })
    public script (gulp: Gulp, watch: Watch) {
        watch.run(
            path.join(__dirname, 'src/**/*.ts'),
            (gulp: Gulp) => {
                console.log('watch init ...')
                let tsResult = gulp
                    .src([path.join(__dirname, 'src/**/*.ts')])
                    .pipe(sourcemaps.init())
                    .pipe(ts.createProject('tsconfig.json')());
                return merge([
                    tsResult.dts.pipe(gulp.dest('./dist')),
                    tsResult.js.pipe(sourcemaps.write('./sourcemaps'))
                        .pipe(gulp.dest('./dist'))
                ])
            }
        )
    }

    @Task()
    public styles (gulp: Gulp, watch: Watch) {
        watch.run(
            path.join(__dirname, `./app/src/${styles}/**/*.${styles}`),
            (gulp: Gulp) => {
                console.log('sass compile ...')
                gulp.src([path.join(__dirname, `./app/src/${styles}/main.${styles}`)])
                    .pipe(GT.sourcemaps.init())
                    .pipe(GT.sass({
                        outputStyle: 'compressed'
                    }))
                    .pipe(GT.sourcemaps.write())
                    .pipe(GT.multi([`../app/design/${area}/${src}/web/css`]))
            }
        )
    }
   
    @Task()
    public dev(gulp: Gulp, webpackServer: WebpackServer) {
        return webpackServer.setConfig(
            webpackDevConfig,
            'development'
        ).runServer()
    }

    @Task()
    public build(gulp: Gulp, webpackServer: WebpackServer) {
        return webpackServer.setConfig(
            webpackProdConfig,
            'production'
        ).runBuild()
    }

    @Task()
    public rollup (gulp: Gulp, watch: Watch) {
        watch.run(
            path.join(__dirname, 'src/**/*.ts'),
            (gulp: Gulp) => {
                console.log('rollup init ...')

                gulp.src([path.join(__dirname, 'src/**/*.ts')])
                    .pipe(sourcemaps.init())
                    .pipe(sourcemaps.write('./sourcemaps'))
                    .pipe(gulp.dest('./dist'))
            }
        )
    }

    @Task()
    public test (vkoa: Vkoa) {
        vkoa
            .setWebpack('webpack')
            .setKoa('koa')
            .run()
    }
}