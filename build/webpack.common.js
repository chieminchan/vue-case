const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const commonConfig = {
    // 文件入口
    entry: {
        main: './src/index.js'
    },
    // 文件出口
    output: {
        // 对应于 entry 里面的输入文件名称，配置输出文件的名称, 如果只有一个输出文件可写成静态不变'bundle.js'
        // 多个输出文件时，可借助模版/变量，[name] [chunkhash] [hash]
        filename: 'js/[name].js',

        // 一般指未被列在 entry 中，却又需要被打包出来的 chunk 文件的名称
        // 一般来说，这个 chunk 文件指的就是要懒加载的代码。
        chunkFilename: 'js/[name].chunk.js',



        path: '',
        public: '',


    },
    module: {

    },
}