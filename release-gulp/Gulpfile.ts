import * as path from 'path'
import * as sourcemaps from 'gulp-sourcemaps'
import * as ts from 'gulp-typescript'
import * as merge from 'merge2'
import { Gulp } from 'gulp'
import { GulpFile, Task, Watch, WebpackServer, Vkoa } from './src'
const clean = require('gulp-clean')
const pump = require('pump')
const cssExtention = ['scss', 'less', 'stylus']

@GulpFile()
export class Gulpflie {
    @Task()
    public del (gulp: Gulp) {
        pump([
            gulp.src('./dist'),
            clean()
        ]);
    }

    @Task({
        befores: ['del']
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
    public style (gulp: Gulp, watch: Watch) {
        watch.run(
            path.join(__dirname, `src/**/*.${cssExtention}`),
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
    public build(gulp: Gulp, webpackServer: WebpackServer) {
        return webpackServer.setConfig(
            path.resolve(__dirname, 'build/webpack.config.prod'),
            'production'
        ).runBuild()
    }

    @Task()
    public dev(gulp: Gulp, webpackServer: WebpackServer) {
        return webpackServer.setConfig(
            path.resolve(__dirname, 'build/webpack.config.dev'),
            'development'
        ).runServer()
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
        // return webpackServer.setConfig(require('./webpack')).runServer()
    }
}