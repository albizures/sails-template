process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const isProd = process.env.NODE_ENV === 'production'
const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const publicPath = path.resolve(__dirname, './public')

const entry = [
  path.join(publicPath, '/index.js')
]
const plugins = [
  new webpack.optimize.DedupePlugin(),
  new ExtractTextPlugin('[name].css', {
    allChunks: true
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    filename: 'vendor.js',
    minChunks: isExternal
  }),
  new HtmlWebpackPlugin({
    title: 'Demo',
    filename: 'index.html',
    template: path.join(publicPath, 'templates', process.env.NODE_ENV + '.pug')
  })
]

if (isProd) {
  // Minify bundle (javascript and css)
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    minimize: true,
    output: {
      comments: false
    },
    compress: {
      drop_console: true
    }
  }))
} else {
  plugins.push(new webpack.optimize.DedupePlugin())
  // plugins.push(new webpack.optimize.UglifyJsPlugin({
  //   compressor: {
  //     warnings: false
  //   }
  // }))
}

module.exports = {
  entry: entry,
  output: {
    path: path.join(__dirname, '.tmp/public'),
    filename: 'bundle.js'
  },
  devtool: isProd ? undefined : 'source-map',
  // debug: !isProd,
  plugins: plugins,
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel'
    }, {
      test: /\.(jpg|jpeg|png|gif|svg)$/i,
      loaders: [
        'file?name=images/[name].[ext]',
        'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
      ]
    }, {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'file?name=/fonts/[name].[ext]'
    }, {
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'file?name=fonts/[name].[ext]'
    }, {
      test: /\.pug$/,
      loader: 'pug'
    }, {
      test: /\.css?$/,
      loader: ExtractTextPlugin.extract('style', 'css')
    }, {
      test: /\.styl?$/,
      loader: ExtractTextPlugin.extract('style', 'css!stylus')
    }],
    preLoaders: [{
      test: /\.js?$/,
      exclude: [/.tmp/, /node_modules/],
      loaders: ['eslint']
    }]
  },
  standard: {
    parser: 'babel-eslint'
  }
}

function isExternal (module) {
  var userRequest = module.userRequest
  if (typeof userRequest !== 'string') {
    return false
  }
  if (userRequest.indexOf(/\.css?$/) >= 0) {
    return false
  }
  return userRequest.indexOf('/node_modules/') >= 0;
}
