import * as path from 'path'
import * as merge from 'merge2'
import * as sourcemaps from 'gulp-sourcemaps'
import * as ts from 'gulp-typescript'
import { Gulp } from 'gulp'
import { Util } from './util/util'
import { themeConfig, webpackDevConfig, webpackProdConfig } from './build'
import { GulpFile, Task, Watch, WebpackServer, Vkoa, GT } from './packages'
const clean = require('gulp-clean')
const pump = require('pump')

const { styles, scripts, name } = themeConfig.default

@GulpFile()
export class Gulpflie {
    @Task()
    public default (gulp: Gulp) {
        console.log(gulp)
    }

    @Task()
    public del (gulp: Gulp, util: Util) {
        pump([
            gulp.src([
                path.resolve(__dirname, `${util.getVarDir()}`),
                path.resolve(__dirname, `${util.getPubDir()}`)
            ]),
            clean({
                read: false,
                force: true
            })
        ])
    }

    @Task()
    public copy (gulp: Gulp, watch: Watch, util: Util) {
        watch.run(
            path.resolve(__dirname, util.getSrcDir()),
            (gulp: Gulp, e?: any) => {
                util.logMsg(`Copy task start ...`, `green`)
                if (e) {
                    util.copyFile(e)
                } else {
                    gulp.src(path.resolve(__dirname, util.getSrcDir()))
                    .pipe(GT.multi([
                        path.resolve(__dirname, util.getAppDir())
                    ]))
                }
            }
        )
    }

    @Task()
    public styles (gulp: Gulp, watch: Watch, util: Util) {
        watch.run(
            path.resolve(__dirname, `${util.getSrcDir()}${util.os()}**.${styles}`),
            (gulp: Gulp) => {
                util.logMsg(`${styles.toUpperCase()} task start ...`, `green`)
                gulp.src([
                        path.resolve(__dirname, `${util.getSassDir()}main.${styles}`)
                    ])
                    .pipe(GT.sourcemaps.init())
                    .pipe(GT.sass({
                        outputStyle: 'compressed'
                    }))
                    .pipe(GT.postcss([
                        GT.autoprefixer({
                            cascade: true,
                            remove: true
                        })
                    ]))
                    .pipe(GT.sourcemaps.write('.', {
                        includeContent: true
                    }))
                    .pipe(GT.multi([
                        `${util.getAppDir()}${util.os()}web${util.os()}css`
                    ]))
                    .pipe(GT.logger({
                        display: 'name',
                        beforeEach: `Theme: ${name} `,
                        afterEach: ' Compiled!',
                        showChange: true
                    }))
            }
        )
    }

    @Task({
        befores: ['styles']
    })
    public base64 (gulp: Gulp, util: Util) {
        gulp.src([
                path.resolve(__dirname, `${util.getAppDir()}${util.os()}web${util.os()}css${util.os()}main.css`)
            ])
            .pipe(GT.base64({
                baseDir: `${util.getAppDir()}${util.os()}web${util.os()}images`,
                extensions: ['svg', 'png', /\.jpg#datauri$/i],
                exclude: [/\.server\.(com|net)\/dynamic\//, '--live.jpg'],
                maxImageSize: 8 * 1024,
                debug: false
            }))
            .pipe(GT.multi([
                `${util.getAppDir()}${util.os()}web${util.os()}css`
            ]))
            .pipe(GT.logger({
                display: 'name',
                beforeEach: `Theme: ${name} `,
                afterEach: ' Base64!',
                showChange: true
            }))
    }

    @Task()
    public phtml (gulp: Gulp, watch: Watch, util: Util) {
        watch.run(
            path.join(__dirname, 'src/**/*.js'),
            (gulp: Gulp) => {
                console.log('phtml task ...')
                // gulp.src(`${util.getAppDir()}**/*.phtml`)
                    // .pipe($.plumber())
                    // .pipe($.if(Util.mode(), $.htmlmin({
                    //     collapseWhitespace: true,
                    //     minifyCSS: true,
                    //     minifyJS: { 
                    //         compress: {
                    //             drop_console: true
                    //         }
                    //     },
                    //     processConditionalComments: true,
                    //     removeComments: true,
                    //     removeEmptyAttributes: true,
                    //     removeScriptTypeAttributes: true,
                    //     removeStyleLinkTypeAttributes: true
                    // })))
                    // .pipe(gulp.dest(outputDir))
            }
        )
    }

    @Task()
    public images (gulp: Gulp, watch: Watch) {
        // watch.run(
        //     path.join(__dirname, `./app/src/web/images/**`),
        //     (gulp: Gulp) => {
                console.log('Minify Images Task Start ...')
                // gulp.src([path.join(__dirname, `./app/src/web/images/**`)])
                //     .pipe(gulpif(env==='build', cache(imagemin({
                //         optimizationLevel: 5,
                //         progressive: true,
                //         interlaced: true,
                //         multipass: true
                //     }))))
                //     .pipe(gulp.dest('./dist'))
        //     }
        // )
    }

    @Task()
    public fonts (gulp: Gulp) {
        console.log('fonts task ...');
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