
const path = require('path');

module.exports = [
    {
        entry : "./src/index.js",
        output: {
            filename: 'surveyjs.js',
            path: path.resolve(__dirname, './dist')
        },
        mode: 'none',
        optimization: {
            namedModules: true
        },
        //watch: true,
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/env']
                        }
                    }
                }
            ]	
        }
    },
    {
        entry : "./src/index.js",
        output: {
            filename: 'surveyjs.min.js',
            path: path.resolve(__dirname, './dist')
        },
        mode: 'production',
        //watch: true,
        // for test:    eval-source-map
        // for deploy:  hidden-source-map or source-map
        devtool: 'source-map',
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/env']
                        }
                    }
                }
            ]	
        }
    }
];
