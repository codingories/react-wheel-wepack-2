一. 初始化项目,webpack环境搭建上
1. 创建远程git仓库
2. git clone 远程ssh地址 .
3. npm init 创建npm并添加gitignore文件
4. 安装webpack4,`yarn add webpack webpack-cli@4.29.6 webpack-cli@3.2.3 --dev`
5. 创建第一个文件lib/index.tsx
6. 新建webpack.config.js，并安装awesome-typescript-loader,`yarn add awesome-typescript-loader --dev`
```js
module.exports = {
  entry: {
    index: './lib/index.tsx'
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
```

7. 配置库格式-umd,项目初步能打包成功
- 由于历史遗留问题要用umd,其本质就是if-else
```js
const path = require('path')
module.exports = {
  mode: 'production',
  entry: {
    index: './lib/index.tsx'
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
```
8. 什么时候加dev?umd是什么？
- 只给程序员用+dev,webpack,TS只有程序员用+dev,umd是兼容性最好的

9. webpack-dev-server自动打包
- 安装`yarn add webpack-dev-server --dev`
- 启动`webpack-dev-server`,输入`http://localhost:8080/index.js`,刷新就可以访问随时访问的编译代码
- webpack-dev-server作用是开一个server,比如找1.tsx，翻译成1.js放到内存，用户访问1.js直接抛出，放内存更快

10. html-webpack-plugin