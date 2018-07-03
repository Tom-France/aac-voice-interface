var path = require('path');
const AppCachePlugin = require('appcache-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = env => {
    var baseDir = 'package/static';
    var buildDir = '/build/';
    var buildDirLegacy = '/build_legacy/';
    var entryScript = './src/js/mainScript.js';
    var outputFilename = 'asterics-grid.bundle.js';
    var mode = 'development';

    var resolve = {
        alias: {
            //objectmodel: "../../../node_modules/objectmodel/dist/object-model.js"
        }
    };

    var externals = {
        jquery: '$',
        objectmodel: 'Model',
        PouchDB: 'PouchDB'
    };

    var plugins = [];
    var appcachePlugin = new AppCachePlugin({
        cache: [
            'build/asterics-grid.bundle.js',
            'build_legacy/asterics-grid.bundle.js',
            'css/custom.css',
            'css/gridlist.css',
            'css/jquery-ui.css',
            'css/images/ui-icons_444444_256x240.png',
            'lib/gridList.js',
            'lib/jquery.gridList.js',
            'lib/jquery.min.js',
            'lib/jquery-ui.min.js',
            'lib/memorystream.js',
            'lib/object-model.min.js',
            'lib/pouchdb.load.min.js',
            'lib/pouchdb.replication-stream.min.js',
            'lib/pouchdb-7.0.0.min.js',
            'lib/pouchdb-find-7.0.0.min.js',
            'polyfill/core_js_shim.min.js',
            'polyfill/fetch.js',
        ],
        settings: ['prefer-online'],
        output: '../manifest.appcache',
        exclude: ['asterics-grid.bundle.js'] /*hack to prevent first line of cache manifest before CACHE. These two files are already included above.*/
    });

    if(env && env.enableAppCache) {
        console.log('appcache enabled!');
        plugins.push(appcachePlugin);
    } else {
        console.log('appcache disabled!');
        plugins.push(new CleanWebpackPlugin([baseDir + '/*.appcache']));
    }

    function getDevServer(buildDirParam) {
        return {
            contentBase: path.resolve(__dirname, baseDir),
            publicPath: buildDirParam,
            host: '0.0.0.0',
            port: 9090,
            open: false,
            watchContentBase: true
        };
    }

    var configNormal = {
        mode: mode,
        entry: entryScript,
        plugins: plugins,
        output: {
            path: path.resolve(__dirname, baseDir + buildDir),
            publicPath: buildDir,
            filename: outputFilename
        },
        resolve: resolve,
        devServer: getDevServer(buildDir),
        externals: externals
    };

    var configLegacy = {
        mode: mode,
        entry: entryScript,
        plugins: plugins,
        output: {
            path: path.resolve(__dirname, baseDir + buildDirLegacy),
            publicPath: buildDirLegacy,
            filename: outputFilename
        },
        resolve: resolve,
        devServer: getDevServer(buildDirLegacy),
        externals: externals,
        module: {
            rules: [{
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['env', {
                                modules: false,
                                useBuiltIns: true,
                                targets: {
                                    browsers: [
                                        '> 1%',
                                        'last 2 versions',
                                        'Firefox ESR'
                                    ],
                                },
                            }],
                        ],
                    },
                },
            }],
        }
    };
    return [configNormal, configLegacy];
};