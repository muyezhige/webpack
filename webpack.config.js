var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

console.log(path.resolve(__dirname, 'src/js/lib/zepto.js'));
module.exports = {
  entry: {
     index: './src/index.js',
     list:  './src/list.js',
     concats: ["./src/index.js", "./src/list.js"] //合并模块代码。
  },
  output: {
    path: path.resolve(__dirname, './dist'), //文件输出目录。
    publicPath: '/dist/', //打包文件中所有通过相对路径引用的资源都会被该配置的路径所替换
    filename: '[name].js',
    chunkFilename: "[name].js"
  },
  module: {
    // 配置各种加载器，可让各种文件格式能用require引入。
    // loader 的配置顺序是从右往左。
    rules: [
      { test: /\.scss$/, loader: 'style-loader!css-loader?minimize!sass-loader'},
      // { test: /\.css$/, loader: 'style-loader!css-loader?minimize'},
      // { test: /\.scss$/, 
      //   loader: ExtractTextPlugin.extract({
      //     fallback: "style-loader",
      //     loader: "css-loader?minimize!sass-loader" //minimize，对css压缩
      //   })
      // },

      { test: /\.js$/, 
        loader: 'babel-loader?cacheDirectory',  //cacheDirectory 在重启webpack时不需要创新编译而是复用缓存结果减少编译流程.
        exclude: /node_modules/, //排除node_modules下的js，将不会被编译。
        include: path.resolve(__dirname, 'src') // 只编译src下的js文件。
      },
      
      // 
      { test: 
        require.resolve('jquery'), //获取jquery模块的绝对路径。
        loader: "expose-loader?jQuery!expose-loader?$" //将jquery绑定为window.jQuery, 或另外一个全局变量$
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
          }
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader?limit=2048&name=img/[name].[ext]?v=[hash:8]'
      }
    ]
  },
  externals: { zepto: 'Zepto'},
  resolve: {
    // 配置别名，简化操作，在项目中缩减引用路径，或直接使用别名。
    alias: {
      // "newPath": path.resolve(__dirname, 'src/js/lib/')
      "lib": path.resolve(__dirname, 'src/js/lib/lib.js')
    },
    extensions : [".js", ".json"] //指明程序自动补全识别哪些后缀
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map',
  // devtool: '#source-map' 生成sourcemap,便于开发调试。
  plugins: [
    // 将公共模块，生成一个common.js的公用代码。
    new webpack.optimize.CommonsChunkPlugin({
        name: 'commons',
        filename: "common.js", // [chunkhash]是根据模块内容计算出的hash值
        chunks: ["index", "list"]
    }),

    // 代码压缩
    new webpack.optimize.UglifyJsPlugin({
      // 最紧凑的输出
      beautify: false,
      // 删除所有的注释
      comments: false,
      sourceMap: true,
      compress: {
        // 在UglifyJs删除没有用到的代码时不输出警告
        warnings: false
      }
    })

    // index.js、list.js、concats.js中的css提取出来, 生成独立的外部css文件。
    // new ExtractTextPlugin({
    //   filename: "css/[name].[contenthash:8].css"
    // })

  ]
};

// =================================================
// if (process.env.NODE_ENV === 'production') {
//   module.exports.devtool = '#source-map';
//   module.exports.plugins = (module.exports.plugins || []).concat([
//     new webpack.DefinePlugin({
//       'process.env': {
//         NODE_ENV: '"production"'
//       }
//     }),
//     new webpack.optimize.UglifyJsPlugin({
//       sourceMap: true,
//       compress: {
//         warnings: false
//       }
//     }),
//     new webpack.LoaderOptionsPlugin({
//       minimize: true
//     })
//   ]);
// }
