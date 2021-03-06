const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');

const config = require('../config.json');

let filename;
let uglifyConfig;
const isProduction = config.NODE_ENV === '\"production\"';
if (isProduction) {
  filename = '[name].min.js';
  uglifyConfig = {
    compress: {
      warnings: false,
    },
    mangle: true,
    beautify: false,
    sourceMap: true,
  };
} else {
  filename = '[name].js';
  uglifyConfig = {
    compress: false,
    mangle: false,
    beautify: true,
    sourceMap: true,
  };
}

module.exports = {
  context: `${__dirname}`,
  entry: {
    reactBundle: './src/reactBundle',
    vanillaBundle: './src/vanillaBundle',
  },
  devtool: 'source-map',
  output: {
    path: `${__dirname}/dist`,
    filename,
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.scss'],
  },
  module: {
    loaders: [
      {
        test: /\.js|jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react'],
        },
      },
      {
        test: /\.scss$/,
        loader: 'style!css!sass',
      },
      {
        test: /\.png$/,
        loader: 'url-loader',
        query: {
          mimetype: 'image/png',
        },
      },
      {
        test: /\.ejs$/,
        loader: 'pug',
      },
    ],
  },
  plugins: [
    new WebpackCleanupPlugin(),

    new webpack.optimize.UglifyJsPlugin(uglifyConfig),

    new CopyWebpackPlugin([
      {
        from: 'src/robots.txt',
      },
    ],
      {
        copyUnmodified: true,
      }
    ),

    new HtmlWebpackPlugin({
      title: 'Generic Dice',
      template: 'src/index.ejs',
      filename: 'index.html',
      hash: true,
      inject: false,
    }),
    new HtmlWebpackPlugin({
      title: 'React.js examples',
      bundle: (isProduction) ? 'reactBundle.min.js' : 'reactBundle.js',
      template: 'src/react-examples.ejs',
      filename: 'react-examples.html',
      hash: true,
      inject: false,
    }),
    new HtmlWebpackPlugin({
      title: 'Vanilla Javascript examples',
      bundle: (isProduction) ? 'vanillaBundle.min.js' : 'vanillaBundle.js',
      template: 'src/vanilla-examples.ejs',
      filename: 'vanilla-examples.html',
      hash: true,
      inject: false,
    }),

    // Development: set NODE_ENV to "\"development\"" in config.json
    // Production: set NODE_ENV to "\"production\"" in config.json
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: config.NODE_ENV,
      },
    }),
  ],
};
