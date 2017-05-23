const path              = require('path');
const webpack           = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
require('babel-polyfill');

const plugins = [];

const NODE_ENV      = process.env.NODE_ENV;
const ISPRODUCTION  = NODE_ENV === 'production';
const ISDEVELOPMENT = NODE_ENV === 'development';

if (ISDEVELOPMENT) {
  plugins.push(new HtmlWebpackPlugin({
    template: path.resolve('test', 'templates', 'default.html')
  }));

  const browserSync = {};

  browserSync.host = 'localhost';
  browserSync.port = 3000;
  browserSync.server = { baseDir: ['www'] };

  plugins.push(new webpack.NoEmitOnErrorsPlugin());
  plugins.push(new BrowserSyncPlugin(browserSync));
  plugins.push(new BundleAnalyzerPlugin());
}

plugins.push(new ExtractTextPlugin('css/[name].css'));

ISPRODUCTION &&
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      screw_ie8: true,
      conditionals: true,
      unused: true,
      comparisons: true,
      sequences: true,
      dead_code: true,
      evaluate: true,
      if_return: true,
      join_vars: true,
    },
    output: {
      comments: false,
    },
  }));

const file_entry  = ISPRODUCTION ? 'src/index.js' : 'test/index.jsx';
const path_output = ISPRODUCTION ? './dist' : './www';

const entry = [];
ISDEVELOPMENT && entry.push('babel-polyfill');
entry.push(path.resolve(__dirname, file_entry));

const output = {
  path: path.resolve(__dirname, path_output),
  publicPath: '/',
  filename: 'js/migtra-component.calendar.js',
  sourceMapFilename: '[file].map',
};

const externals = [];

if (ISPRODUCTION) {
  output.library = 'migtra-component.calendar';
  output.libraryTarget = 'commonjs2';

  externals.push({
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
      umd: 'react',
    }});

  externals.push({
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
      umd: 'react-dom',
    }});

  externals.push({ 'react': 'React' });
  externals.push({ 'react-dom': 'ReactDOM' });

  externals.push({ 'moment': true });
}


const config = {
  entry: entry,
  output: output,
  devtool: ISPRODUCTION ? 'eval' : 'source-map',
  externals: externals,
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        enforce: 'pre',
        use: 'source-map-loader'
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: [
          'babel-loader',
          'eslint-loader',
        ]
      },
      {
        test: /\.(scss|css)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader?sourceMap',
            'sass-loader?sourceMap'
          ]
        })
      },
      {
        test: /\.(woff2?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader?limit=1024&name=./fonts/[name].[ext]'
      },
      {
        test: /\.(jpe?g|png)$/,
        loader: 'file-loader?limit=1024&name=./images/[name].[ext]'
      }
    ]
  },
  plugins: plugins,
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      'material-icons': 'material-design-icons/iconfont/material-icons.css'
    }
  }
};

module.exports = config;
