const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const buildPath = path.resolve(__dirname, 'dist');

module.exports = {
    devtool: 'source-map',
    entry: {
        index: './src/index.js',
        terms: './src/terms.js',
        privacy: './src/privacy.js',
        blog: './src/blog.js',
        csv_file: './src/csv-file.js',
        right_approach: './src/right-approach.js',
        increase_emails_deliverability: './src/increase-emails-deliverability.js',
        bounce_rate: './src/bounce-rate.js',
        catch_all_servers: './src/catch-all-servers.js',
        guide: './src/guide.js',
        scholarship: './src/scholarship.js',
        404: './src/404.js',
    },
    output: {
        filename: '[name].[hash:20].js',
        path: buildPath
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
                test: /\.(scss|css|sass)$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            // translates CSS into CommonJS
                            loader: 'css-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            // Runs compiled CSS through postcss for vendor prefixing
                            loader: 'postcss-loader',
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
                    ],
                    fallback: 'style-loader'
                }),
            },
            {
                // Load all images as base64 encoding if they are smaller than 8192 bytes
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: '[name].[hash:20].[ext]',
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
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/html/index.hbs',
            filename: 'index.html',
            chunks: ['index'],
            inject: 'body',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new HtmlWebpackPlugin({
            template: './src/html/terms.hbs',
            filename: 'terms.html',
            chunks: ['terms'],
            inject: 'body',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new HtmlWebpackPlugin({
            template: './src/html/privacy.hbs',
            filename: 'privacy.html',
            chunks: ['privacy'],
            inject: 'body',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new HtmlWebpackPlugin({
            template: './src/html/blog.hbs',
            filename: 'blog.html',
            chunks: ['blog'],
            inject: 'body',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new HtmlWebpackPlugin({
            template: './src/html/blog/csv-file.hbs',
            filename: 'csv-file.html',
            chunks: ['csv_file'],
            inject: 'body',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new HtmlWebpackPlugin({
            template: './src/html/blog/right-approach.hbs',
            filename: 'right-approach.html',
            chunks: ['right_approach'],
            inject: 'body',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new HtmlWebpackPlugin({
            template: './src/html/blog/increase-emails-deliverability.hbs',
            filename: 'increase-emails-deliverability.html',
            chunks: ['increase_emails_deliverability'],
            inject: 'body',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new HtmlWebpackPlugin({
            template: './src/html/blog/catch-all-servers.hbs',
            filename: 'catch-all-servers.html',
            chunks: ['catch_all_servers'],
            inject: 'body',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new HtmlWebpackPlugin({
            template: './src/html/blog/guide.hbs',
            filename: 'guide.html',
            chunks: ['guide'],
            inject: 'body',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new HtmlWebpackPlugin({
            template: './src/html/blog/bounce-rate.hbs',
            filename: 'bounce-rate.html',
            chunks: ['bounce_rate'],
            inject: 'body',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new HtmlWebpackPlugin({
            template: './src/html/blog/scholarship.hbs',
            filename: 'scholarship.html',
            chunks: ['scholarship'],
            inject: 'body',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new HtmlWebpackPlugin({
            template: './src/html/404.hbs',
            filename: '404.html',
            chunks: ['404'],
            inject: 'body',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new CopyWebpackPlugin([{ context: './src/assets/root', from: '**/*.*', to: buildPath }]),
        new CleanWebpackPlugin(buildPath),
        new FaviconsWebpackPlugin({
            // Your source logo
            logo: './src/assets/root/favicon.png',
            // The prefix for all image files (might be a folder or a name)
            prefix: 'icons-[hash]/',
            // Generate a cache file with control hashes and
            // don't rebuild the favicons until those hashes change
            persistentCache: true,
            // Inject the html into the html-webpack-plugin
            inject: true,
            // favicon background color (see https://github.com/haydenbleasel/favicons#usage)
            background: '#ffffff',
            // favicon app title (see https://github.com/haydenbleasel/favicons#usage)

            // which icons should be generated (see https://github.com/haydenbleasel/favicons#usage)
            icons: {
                android: true,
                appleIcon: true,
                appleStartup: false,
                coast: false,
                favicons: true,
                firefox: true,
                opengraph: true,
                twitter: false,
                yandex: false,
                windows: true
            }
        }),
        new DuplicatePackageCheckerPlugin(),
        new ExtractTextPlugin('styles.[md5:contenthash:hex:20].css', {
            allChunks: true
        }),
        new OptimizeCssAssetsPlugin({
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                map: {
                    inline: false,
                },
                discardComments: {
                    removeAll: true
                }
            },
            canPrint: true
        })
    ]
};
