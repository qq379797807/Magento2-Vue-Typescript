import * as path from 'path'

module.exports = {
    ...{
        entry: path.resolve(__dirname, '../app/main.tsx'),
        output: {
            path: path.resolve(__dirname, '../dist'),
            filename: '[name].js',
            publicPath: '../dist/'
        },
        devtool: 'cheap-module-source-map'
    }
}