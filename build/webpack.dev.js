// const webpack = require('webpack');
const { merge } = require('webpack-merge');
const commConfig = require('./webpack.common');
const NamedModulesPlugin = require('NamedModulesPlugin');
const HotModuleReplacementPlugin = require('HotModuleReplacementPlugin');

const devConfig = merge(commConfig, {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    plugins: [
        // 添加了 NamedModulesPlugin，以便更容易查看要修补(patch)的依赖
        new NamedModulesPlugin(),

        // HMR模块热替换解决的问题就是,它允许在运行时更新各种模块，而无需进行完全刷新。
        // 生产环境上不可以使用HMR
        new HotModuleReplacementPlugin(),
    ],
    optimization: {
        // 由 optimization.usedExports 收集的信息会被其它优化手段或者代码生成使用，比如：
        // 未使用的导出内容不会被生成， 当所有的使用都适配，导出名称会被处理做单个标记字符。
        // 在压缩工具中的无用代码清除会受益于该选项，而且能够去除未使用的导出内容。
        usedExports: true
    }
});

module.exports = devConfig;