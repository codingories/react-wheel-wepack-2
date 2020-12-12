const base = require('./webpack.config.js')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = Object.assign ({},base,{
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'ZUI',
      template: 'index.html'
    })
  ],
})
