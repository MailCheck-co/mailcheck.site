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
        csvFile: './src/blog.js',
        rightApproach: './src/blog.js',
        increaseEmailsDeliverability: './src/blog.js',
        googlePlus: './src/blog.js',
        emailMarketingTips: './src/blog.js',
        sellingCartCustomization: './src/blog.js',
        bounceRate: './src/blog.js',
        catchAllServers: './src/blog.js',
        guide: './src/blog.js',
        emailMarketingMetrics: './src/blog.js',
        enforceEmailMarketing: './src/blog.js',
        smallBusinessTips: './src/blog.js',
        personalizeYourNewsletter: './src/blog.js',
        emailMarketingTrends: './src/blog.js',
        sendersReputation: './src/blog.js',
        emailMarketingCampaignGuide: './src/blog.js',
        hostingEmail: './src/blog.js',
        abandonedCartHacks: './src/blog.js',
        scholarship: './src/blog.js',
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
            template: './src/html/blog/csvFile.hbs',
            filename: 'csvFile.html',
            chunks: ['csvFile'],
            inject: 'body',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new HtmlWebpackPlugin({
            template: './src/html/blog/rightApproach.hbs',
            filename: 'rightApproach.html',
            chunks: ['rightApproach'],
            inject: 'body',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new HtmlWebpackPlugin({
            template: './src/html/blog/increaseEmailsDeliverability.hbs',
            filename: 'increaseEmailsDeliverability.html',
            chunks: ['increaseEmailsDeliverability'],
            inject: 'body',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new HtmlWebpackPlugin({
            template: './src/html/blog/catchAllServers.hbs',
            filename: 'catchAllServers.html',
            chunks: ['catchAllServers'],
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
            template: './src/html/blog/bounceRate.hbs',
            filename: 'bounceRate.html',
            chunks: ['bounceRate'],
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
            template: './src/html/blog/googlePlus.hbs',
            filename: 'googlePlus.html',
            chunks: ['googlePlus'],
            inject: 'body',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new HtmlWebpackPlugin({
            template: './src/html/blog/emailMarketingTips.hbs',
            filename: 'emailMarketingTips.html',
            chunks: ['emailMarketingTips'],
            inject: 'body',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new HtmlWebpackPlugin({
            template: './src/html/blog/sellingCartCustomization.hbs',
            filename: 'sellingCartCustomization.html',
            chunks: ['sellingCartCustomization'],
            inject: 'body',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new HtmlWebpackPlugin({
            template: './src/html/blog/emailMarketingMetrics.hbs',
            filename: 'emailMarketingMetrics.html',
            chunks: ['emailMarketingMetrics'],
            inject: 'body',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new HtmlWebpackPlugin({
            template: './src/html/blog/enforceEmailMarketing.hbs',
            filename: 'enforceEmailMarketing.html',
            chunks: ['enforceEmailMarketing'],
            inject: 'body',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new HtmlWebpackPlugin({
            template: './src/html/blog/smallBusinessTips.hbs',
            filename: 'smallBusinessTips.html',
            chunks: ['smallBusinessTips'],
            inject: 'body',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new HtmlWebpackPlugin({
            template: './src/html/blog/personalizeYourNewsletter.hbs',
            filename: 'personalizeYourNewsletter.html',
            chunks: ['personalizeYourNewsletter'],
            inject: 'body',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new HtmlWebpackPlugin({
            template: './src/html/blog/emailMarketingTrends.hbs',
            filename: 'emailMarketingTrends.html',
            chunks: ['emailMarketingTrends'],
            inject: 'body',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new HtmlWebpackPlugin({
            template: './src/html/blog/sendersReputation.hbs',
            filename: 'sendersReputation.html',
            chunks: ['sendersReputation'],
            inject: 'body',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new HtmlWebpackPlugin({
            template: './src/html/blog/emailMarketingCampaignGuide.hbs',
            filename: 'emailMarketingCampaignGuide.html',
            chunks: ['emailMarketingCampaignGuide'],
            inject: 'body',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new HtmlWebpackPlugin({
            template: './src/html/blog/hostingEmail.hbs',
            filename: 'why-hosting-email-at-home-is-not-good-idea.html',
            chunks: ['hostingEmail'],
            inject: 'body',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new HtmlWebpackPlugin({
            template: './src/html/blog/abandonedCartHacks.hbs',
            filename: 'abandoned-cart-hacks.html',
            chunks: ['abandonedCartHacks'],
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
        new CopyWebpackPlugin([{context: './src/assets/root', from: '**/*.*', to: buildPath}]),
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
