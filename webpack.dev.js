const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'eval-cheap-module-source-map',
  entry: {
    index: './src/index.js',
    terms: './src/terms.js',
    privacy: './src/privacy.js',
    blog: './src/blog.js',
    csvFile: './src/blog.js',
    rightApproach: './src/blog.js',
    increaseEmailsDeliverability: './src/blog.js',
    bounceRate: './src/blog.js',
    catchAllServers: './src/blog.js',
    guide: './src/blog.js',
    scholarship: './src/blog.js',
    googlePlus: './src/blog.js',
    emailMarketingTips: './src/blog.js',
    sellingCartCustomization: './src/blog.js',
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
      template: './src/html/blog.hbs',
      filename: 'blog.html',
      chunks: ['blog'],
      inject: true
    }),
    new HtmlWebpackPlugin({
      template: './src/html/blog/csvFile.hbs',
      filename: 'csvFile.html',
      chunks: ['csvFile'],
      inject: true
    }),
    new HtmlWebpackPlugin({
      template: './src/html/blog/rightApproach.hbs',
      filename: 'rightApproach.html',
      chunks: ['rightApproach'],
      inject: true
    }),
    new HtmlWebpackPlugin({
      template: './src/html/blog/increaseEmailsDeliverability.hbs',
      filename: 'increaseEmailsDeliverability.html',
      chunks: ['increaseEmailsDeliverability'],
      inject: true
    }),
    new HtmlWebpackPlugin({
      template: './src/html/blog/catchAllServers.hbs',
      filename: 'catchAllServers.html',
      chunks: ['catchAllServers'],
      inject: true
    }),
    new HtmlWebpackPlugin({
      template: './src/html/blog/guide.hbs',
      filename: 'guide.html',
      chunks: ['guide'],
      inject: true
    }),
    new HtmlWebpackPlugin({
      template: './src/html/blog/bounceRate.hbs',
      filename: 'bounceRate.html',
      chunks: ['bounceRate'],
      inject: true
    }),
    new HtmlWebpackPlugin({
      template: './src/html/blog/scholarship.hbs',
      filename: 'scholarship.html',
      chunks: ['scholarship'],
      inject: true
    }),
    new HtmlWebpackPlugin({
      template: './src/html/blog/googlePlus.hbs',
      filename: 'googlePlus.html',
      chunks: ['googlePlus'],
      inject: true
    }),
    new HtmlWebpackPlugin({
      template: './src/html/blog/emailMarketingTips.hbs',
      filename: 'emailMarketingTips.html',
      chunks: ['emailMarketingTips'],
      inject: true
    }),
    new HtmlWebpackPlugin({
      template: './src/html/blog/sellingCartCustomization.hbs',
      filename: 'sellingCartCustomization.html',
      chunks: ['sellingCartCustomization'],
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
