import { GulpFile, Task, Watch, WebpackServer, Vkoa } from './src'
import { Gulp } from 'gulp'
import * as path from 'path'
import * as sourcemaps from 'gulp-sourcemaps'
import * as ts from 'gulp-typescript'
import * as merge from 'merge2'
const clean = require('gulp-clean')
const pump = require('pump')

@GulpFile()
export class gulpflie {
    @Task()
    public del(gulp: Gulp) {
        pump([
            gulp.src('./dist'),
            clean()
        ]);
    }

    @Task({
        befores: ['del']
    })
    public copy(gulp: Gulp, watch: Watch) {
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
    public build(gulp: Gulp, watch: Watch) {
        watch.run(
            path.join(__dirname, 'src/**/*.ts'),
            (gulp: Gulp) => {
                console.log('watch ...')
                let tsResult = gulp
                    .src([path.join(__dirname, 'src/**/*.ts')])
                    .pipe(sourcemaps.init())
                    .pipe(ts.createProject('tsconfig.json')());
                return merge([
                    tsResult.dts.pipe(gulp.dest('./dist')),
                    tsResult.js.pipe(sourcemaps.write("./sourcemaps"))
                        .pipe(gulp.dest('./dist'))
                ])
            }
        )
    }

    @Task({
        // befores: ['build']
    })
    public demo(gulp: Gulp, webpackServer: WebpackServer) {
        return webpackServer.setConfig(
            path.resolve(__dirname, 'demo/webpack.config.js'),
            'development'
        ).runServer()
    }

    @Task()
    public test(vkoa: Vkoa) {
        vkoa
            .setWebpack('webpack')
            .setKoa('koa')
            .run()
        // return webpackServer.setConfig(require('./webpack')).runServer()
    }
}