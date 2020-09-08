const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const resolve = (dir) => {
    // path.resolve 方法会把一个路径或路径片段的序列解析为一个绝对路径
    // resolve操作相当于进行了一系列的cd操作

    // resolve会把'/'当成根目录, 传入非/路径时，会自动加上当前目录形成一个绝对路径
    // 当前路径为: /Users/xiao/work/test
    // path.resolve('a', 'b', '..', 'd');  ->   /Users/xiao/work/test/a/d

    // 传入/路径时,
    // path.resolve('/foo/bar', './baz');   ->  /foo/bar/baz
    // path.resolve('/foo/bar', '/baz/faz');  ->  /baz/faz

    return path.resolve(__dirname, dir);
}

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

        // 一般指未被列在 entry 中，却又需要被打包出来的 chunk 文件的名称。若未指定，默认会把filename的 [name] 替换为 chunk 文件的 id 号
        // 常见的会在运行时生成 Chunk 场景有在使用 CommonChunkPlugin、使用 import('path/to/module') 动态加载等时。 
        chunkFilename: 'js/[name].chunk.js',

        // 配置输出文件存放在本地的目录，必须是 string 类型的绝对路径。通常通过 Node.js 的 path 模块去获取绝对路径
        path: path.resolve(__dirname, 'dist_[hash]'),

        // 构建出的资源需要异步加载，加载这些异步资源需要对应的 URL 地址。比如需要把构建出的资源文件上传到 CDN 服务上，以利于加快页面的打开速度
        // filename:'[name]_[chunkhash:8].js'
        // publicPath: 'https://cdn.example.com/assets/'
        // 打包后的引入的路径：<script src='https://cdn.example.com/assets/a_12345678.js'></script>
        publicPath: 'https://cdn.example.com/assets/"',
    },

    // 配置如何处理模块
    module: {

        // rules 配置模块的读取和解析规则，通常用来配置 Loader。rules类型是一个数组，数组里每一项都描述了如何去处理部分文件
        rules: [

            // 配置 Loader，一个loader主要通过include、exclude、test来命中 Loader 要应用规则的文件，然后通过use对对应文件应用 Loader，并可通过option项进行详细配置
            // 一组 Loader 的执行顺序默认是从右到左执行。可通过 enforce 选项可以让其中一个 Loader 的执行顺序放到最前或者最后
            {
                test: /\.scss$/,

                // 处理顺序为从后到前，即先交给 postcss-loader,sass-loader 处理，再把结果交给 css-loader 最后再给 style-loader
                use: ['style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            //为了解决在某个scss文件中又导入新的scss文件，这个时候打包的话，需要重新安装postcss-loader开始打包
                            importLoaders: 2,
                            modules: true
                        }
                    },
                    'sass-loader', 'postcss-loader'
                ],
                exclude: path.resolve(__dirname, 'node_modules'),
            },

            {
                // 对非文本文件采用 url-loader 加载
                test: /\.(gif|png|jpe?g|eot|woff|ttf|svg|pdf)$/,
                loader: 'url-loader',
                options: {
                    name: '[name]_[hash].[ext]',
                    outputPath: 'images/',

                    // 若打包的对应文件大小比limit配置大，则和 file-loader一样，文件内容的 MD5 哈希值并会保留所引用资源的原始扩展名，打包至output-path的images文件夹下
                    // import acator from './头像.jpg'   ->  头像_3f16daf5233d30f46509b1bf2c4e08a5.jpg

                    // 当打包的非文本文件大小比limit配置的参数小，则采取 url-loader，以Base64格式打包到output的文件中
                    limit: 102400 //100KB
                }
            },

            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 102400,
                    name: 'media/[name].[hash:7].[ext]'
                },

                // parser
                // Webpack 是以模块化的 JavaScript 文件为入口，所以内置了对模块化 JavaScript 的解析功能，支持 AMD、CommonJS、SystemJS、ES6。
                // parser 属性可以更细粒度的配置哪些模块语法要解析哪些不解析
                // parser: {
                //     amd: false, // 禁用 AMD
                //     commonjs: false, // 禁用 CommonJS
                //     system: false, // 禁用 SystemJS
                //     harmony: false, // 禁用 ES2015 Harmony import/export
                //     requireInclude: false, // 禁用 require.include
                //     requireEnsure: false, // 禁用 require.ensure
                //     requireContext: false, // 禁用 require.context
                //     browserify: false, // 禁用特殊处理的 browserify bundle
                //     requireJs: false, // 禁用 requirejs.*
                //     node: false, // 禁用 __dirname, __filename, module, require.extensions, require.main 等。
                //     node: { ... } // 在模块级别(module level)上重新配置 node 层(layer)
                // },
            },

            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {

                }
            },

            {
                test: /\.(js|vue)$/,
                loder: 'eslint-loader',
                enforce: 'pre',
                include: [resolve('src')],
                options: {
                    formatter: require('eslint-friendly-formatter')
                }
            }

        ],

        // no-parser可配置让 Webpack 忽略对部分没采用模块化的文件的递归解析和处理，这样做的好处是能提高构建性能
        // parse 和 noParse 配置项的区别在于 parser 可以精确到语法层面， 而 noParse 只能控制哪些文件不被解析。
        noParse: (content) => {
            // content 代表一个模块的文件路径，返回 true or false
            // 注意被忽略掉的文件里不应该包含 import 、 require 、 define等模块化语句，不然会导致构建出的代码中包含无法在浏览器环境下执行的模块化语句
            return /jquery|chartjs/.test(content);
        },

    },

    // Webpack 在启动后会从配置的入口模块出发找出所有依赖的模块，Resolve 配置 Webpack 如何寻找模块所对应的文件。
    resolve: {
        // 通过别名配置来把原导入路径映射成一个新的导入路径
        alias: {
            // $符号可用于缩小范围到只命中以关键字结尾的导入语句
            'vue$': 'vue/dist/vue.esm.js',

            // import Button from 'components/button' 会被替换成 './src/components/button'
            components: './src/components/',
        },

        // 在导入语句没带文件后缀时，Webpack 会自动带上后缀后去尝试访问文件是否存在。
        extensions: ['.js', '.vue', '.json'],
    },

    // plugins: 在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听特定生命周期阶段的事件，在合适的时机帮你做一些事情
    plugins: [

        // 为你生成一个HTML文件，然后将打包好的js文件自动引入到这个html文件中。
        new htmlWebpackPlugin({
            // 以src/目录下的index.html为模板打包
            template: 'src/index.html',

            // 打包后输出的文件名
            filename: 'index.html',

            favicon: path.join(__dirname, 'src/assets/img/favicon.ico'),
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
                // https://github.com/kangax/html-minifier#options-quick-reference
            },
        }),

        // 这个插件的作用就是会帮你删除某个目录的文件,是在打包前删除所有上一次打包好的文件。
        new CleanWebpackPlugin()
    ]
};

module.exports = commonConfig;