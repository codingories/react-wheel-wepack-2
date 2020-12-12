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
const HtmlWebpackPlugin = require('html-webpack-plugin')
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
- html-webpack-plugin,用来改写html的插件,webpack把最新的script加入index.html
- 配置,webpack.config.js
```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

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
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'ZUI',
      template: 'index.html'
    })
  ]
}
```

二. webpack环境搭建下
1. 将代码上传到多个远程仓库
- 添加另外一个名字的远程仓库git remote add zui-2 git@github.com:codingories/react-wheel-wepack-2.git
- git push -u zui-2 main

2. webpack.config.js中增加快捷命令
```js
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "webpack-dev-server",
    "build": "webpack"
  }
```
3. 安装react,react-dom以及类型依赖
```
yarn add react-dom react
yarn add @types/react --dev
yarn add @types/react-dom --dev
```

4. 回头看package.json,发现react版本和@types/react及@types/react-dom不一致
- 这是需要作为架构师需要关注的，如果哪天有bug可能就是这个原因引起
- 面试问yarn.lock是做什么的，yarn.lock就是yarn.lock文件,锁的所有安装的东西的版本号,package.json说的是范围，.lock是具体