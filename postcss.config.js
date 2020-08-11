/*
* PostCSS is a tool for transforming styles with JS plugins.
* These plugins can lint your CSS, support variables and mixins, transpile future CSS syntax, inline images, and more.
* https://github.com/postcss/postcss
*/
module.exports = {
    plugins: [
        /*
        * Adds vendor prefixes to css attributes
        * https://github.com/postcss/autoprefixer
        */
        require('autoprefixer')
    ]
};
