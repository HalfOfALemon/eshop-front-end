const path                 = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');//单独打包css的插件
const HtmlWebpackPlugin    = require("html-webpack-plugin");
var webpack                = require('webpack');
var WEBPACK_ENV            = process.env.WEBPACK_ENV || 'dev'  // 开发环境变量配置
console.log('WEBPACK_ENV = ' + WEBPACK_ENV)
/*获取html-webpack-plugin参数的方法。本来是对单个页面起作用，使用函数对多个页面（传参）起作用 */
var getHtmlConfig = function(name){
	return {
	  filename : 'view/'+ name +'.html',
      template : './src/view/'+ name +'.html',//HTML原始模板
      inject   : true,
      hash     : true,
      chunks   : ['common',name] //需要打包的模块
	}
}

/*webpack config*/
var config = {
  mode: 'development',
  /*页面入口,配置多个入口*/
  entry: {
  	'common' : ['./src/page/common/index.js'],
  	'index' : ['./src/page/index/index.js'],
  	'login' : ['./src/page/login/index.js']
  },
  /*页面出口,配置多个出口 [name].js*/
  output: {
    filename: 'js/[name].js',
    /*访问文件用的属性*/
    publicPath : '/dist',
    /*存放文件的路径*/
    path: path.resolve(__dirname, 'dist')
  },
  externals : {
  	'jquery' : 'window.jQuery'
  },
  /*单独打包css*/
  module: {
    rules: [
      {
        test: /\.css$/,  // 用正则去匹配要用该 loader 转换的 CSS 文件
        use: [
          MiniCssExtractPlugin.loader,
          /*'style-loader',*//*这个打开会报错*/
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    /*单独打包css的插件*/
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',  // 从 .js 文件中提取出来的 .css 文件的名称。css文件引用后才会被打包
    }),
    /*html模板的处理。 参数是定义了一个函数，在上上边*/
    new HtmlWebpackPlugin(getHtmlConfig('index')),
    new HtmlWebpackPlugin(getHtmlConfig('login')),
  ],
    /*提取公共模块： 默认只分割>30k*/
  optimization: {
    splitChunks: {
        cacheGroups: {
            commons: {
            	/*正则表达式*/
                test: /[\\/]node_modules[\\/]/,//将引用到到node_modules目录下的模块打包为一个文件
                /*要缓存分割出来的chunk名称*/
                name: "base",
                chunks: "all",
                /*默认只分割>30k*/
                minSize: 0
            }
        }
    }
  },

};
/*判断cmd 命令行输入的环境变量，配置开不开启webpack-dev-server*/
if('dev' === WEBPACK_ENV){
	config.entry.common.push('webpack-dev-server/client?http://localhost:8088/');
}

module.exports = config;