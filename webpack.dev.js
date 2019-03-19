const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'eval-cheap-module-source-map',
  entry: {
    index: './src/index.js',
    terms: './src/terms.js',
    privacy: './src/privacy.js',
    refer: './src/refer.js',
    404: './src/404.js',
  },
  devServer: {
    port: 8080,
    contentBase: path.join(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['env']
        }
      },
      {
        test: /\.(scss|css)$/,
        use: [
          {
            // creates style nodes from JS strings
            loader: 'style-loader',
            options: {
              sourceMap: true
            }
          },
          {
            // translates CSS into CommonJS
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            // compiles Sass to CSS
            loader: 'sass-loader',
            options: {
              outputStyle: 'expanded',
              sourceMap: true,
              sourceMapContents: true
            }
          }
          // Please note we are not running postcss here
        ]
      }
      ,
      {
        // Load all images as base64 encoding if they are smaller than 8192 bytes
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // On development we want to see where the file is coming from, hence we preserve the [path]
              name: '[path][name].[ext]?hash=[hash:20]',
              limit: 8192
            }
          }
        ]
      },
        {
            test: /\.hbs$/,
            loader: 'handlebars-loader',
            query: {
                inlineRequires: '/img/',
                knownHelpersOnly: false,
            }
        },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/html/index.hbs',
      filename: 'index.html',
      chunks: ['index'],
      inject: true
    }),
    new HtmlWebpackPlugin({
      template: './src/html/terms.hbs',
      filename: 'terms.html',
      chunks: ['terms'],
      inject: true
    }),
    new HtmlWebpackPlugin({
      template: './src/html/privacy.hbs',
      filename: 'privacy.html',
      chunks: ['privacy'],
      inject: true
    }),
      new HtmlWebpackPlugin({
          template: './src/html/404.hbs',
          filename: '404.html',
          chunks: ['terms'],
          inject: true
      }),
  ]
};
