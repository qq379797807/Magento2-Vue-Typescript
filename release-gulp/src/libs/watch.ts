import * as watch from 'gulp-watch';
import { Gulp } from 'gulp';
import * as _ from 'lodash';

export class Watch {
    private gulp: Gulp;

    constructor(gulp: Gulp) {
        this.gulp = gulp;
    }

    run(path: string | string[], callback: Function) {
        callback(this.gulp);
        watch(path, () => {
            callback(this.gulp);
        });
        return this.gulp;
    }
}