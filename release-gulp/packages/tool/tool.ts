const gulpLoader = require('gulp-load-plugins')

const GT = gulpLoader({
    DEBUG: false,
    pattern: ['gulp-*', 'gulp.*', '@*/gulp{-,.}*'],
    overridePattern: true,
    scope: ['dependencies', 'devDependencies', 'peerDependencies'],
    replaceString: /^gulp(-|\.)/,
    camelize: true,
    lazy: true,
    rename: {
        'gulp-multi-dest': 'multi'
    },
    postRequireTransforms: {},
    maintainScope: true
})

export default GT