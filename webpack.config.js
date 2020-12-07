const path = require('path')
module.exports = {
  entry: {
    ZUI: './lib/index.tsx'
  },
  output: {
    path: path.resolve(__dirname, 'dist/lib'),
    library: 'ZUI',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      }
    ]
  }
}
