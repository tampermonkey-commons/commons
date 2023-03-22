const path = require('path')
const webpack = require("webpack")
const package = require("./package.json")
const userscript = require("./userscript.json")
const TerserPlugin = require("terser-webpack-plugin")

function generateBannerLine(paramName, value = null, padding = 17) {
    let line = ''
    if (value == null) {
        return line
    }

    line = `// @${paramName}`

    let spaceAmount = padding - line.length
    if (spaceAmount > 0) {
        let space = ' '.repeat(spaceAmount)
        line += space
    }

    line += value + '\n'
    return line
}

function generateBanner() {
    let banner = ''
    let line = ''

    banner += `// ==UserScript==\n`

    let name = (userscript.name != null) ? userscript.name : package.name
    banner += generateBannerLine("name", name)

    banner += generateBannerLine("namespace", userscript.namespace)

    let version = (userscript.version != null) ? userscript.version : package.version
    banner += generateBannerLine("version", version)

    let description = (userscript.description != null) ? userscript.description : package.description
    banner += generateBannerLine("description", description)

    let author = (userscript.author != null) ? userscript.author : package.author
    banner += generateBannerLine("author", author)

    for (let match of userscript.matches) {
        banner += generateBannerLine("match", match)
    }

    if (userscript.grants.length == 0) {
        banner += generateBannerLine("grunt", "none")
    }
    else {
        for (let grant of userscript.grants) {
            banner += generateBannerLine("grunt", grant)
        }
    }

    banner += `// ==/UserScript==`

    return banner
}

module.exports = [{
    name: 'commons-umd-debug',
    mode: 'none',
    entry: './src/commons.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'commons-umd.js',
        library: {
            name: 'TmUsCommons',
            type: 'umd'
        }
    }
}]

/*
,{
    name: 'commons-umd-release',
},{
    name: 'test-require',
    mode: 'none',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'commons-umd.min.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [ '@babel/preset-env', { targets: 'defaults' } ]
                        ]
                    }
                }
            }
        ]
    }
},{
    name: 'test-userjs',
    mode: 'production',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'commons-test.user.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [ '@babel/preset-env', { targets: 'defaults' } ]
                        ]
                    }
                }
            }
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            terserOptions: {
                format: {
                    preamble: generateBanner()
                }
            }
        })]
    }
}
*/