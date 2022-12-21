/*
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2022-12-12 16:09:29
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2022-12-19 16:04:42
 * @FilePath      : /adminweb/vue.config.js
 * @Description   : 
 * 
 * Copyright (c) 2022 by turbo 664120459@qq.com, All Rights Reserved. 
 */
const path = require('path')
const name = '管理平台'

module.exports = {
    // TODO: Remember to change publicPath to fit your need
    publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
    lintOnSave: process.env.NODE_ENV === 'development',
    pwa: {
        name: name
    },
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'scss',
            patterns: [
                path.resolve(__dirname, 'src/styles/_variables.scss'),
                path.resolve(__dirname, 'src/styles/_mixins.scss')
            ]
        }
    },
    chainWebpack(config) {
        // provide the app's title in html-webpack-plugin's options list so that
        // it can be accessed in index.html to inject the correct title.
        // https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-plugin
        config.plugin('html').tap(args => {
            args[0].title = name
            return args
        })
    },
    devServer: {
        proxy: {
            '/api/': {
                target: 'http://127.0.0.1:3000/',
                changeOrigin: true,
                ws: true,
                secure: false,
                pathRewrite: {
                    '^/api': '/'
                }
            }
        }
    }
}
