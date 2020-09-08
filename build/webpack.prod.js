const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common');
const

const prodConfig = merge(commonConfig, {
    mode: 'production',
    devtool: 'cheap-module-source-map',
    plugins: [

    ]
});

module.exports = prodConfig;