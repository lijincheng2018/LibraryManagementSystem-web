const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  publicPath: '/',
  assetsDir: 'static/3.0.0',

  devServer: {
    proxy: {
      '/': {
        ws:false,
        target: 'http://localhost:8081/',
        changeOrigin: true,
        pathRewrite: {
        }
      }
    },
    
  },
	configureWebpack: {
    externals: {
      'vue': 'Vue',
      'vuex': 'Vuex',
      'vue-router': 'VueRouter',
      'axios': 'axios',
      'element-ui': 'ELEMENT',
      'echarts': 'echarts',
      'xlsx': 'XLSX'
    },
		plugins: [
			new webpack.ProvidePlugin({
				$: 'jquery',
				jQuery: 'jquery',
        jquery: 'jquery',
				'window.jQuery': 'jquery',
			}),
		]
	},
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = '班级信息中心'
      return args
    })
  }
})