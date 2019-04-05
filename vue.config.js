module.exports = {
  devServer: {
    port: '8083',
    proxy:{
      '/v2': {
        target: 'http://api.douban.com',  // target host
        ws: true,  // proxy websockets
        changeOrigin: true,  // needed for virtual hosted sites
        pathRewrite: {
          '^/v2': '/v2'  //rewrite path
        }
      },
    }
  },

  configureWebpack: {
    resolve: {
      alias: {
        'views': '@/views',
        'components': '@/components',
        'network': '@/network',
        'common': '@/common',
        'assets': '@/assets',
        'base' : '@/base'
      }
    }
  },
}