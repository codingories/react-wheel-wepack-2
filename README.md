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

5. 出现报错`ERROR in ./lib/index.tsx,Module not found: Error: Can't resolve './button' in '/Users/ories/Downloads/jirengu-demo/z-ui-react/lib' @ ./lib/index.tsx 3:0-30 4:36-42`
- 通过配置webpack,resolve
```
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
```

6. 又出现`TS2686: 'React' refers to a UMD global, but the current file is a module. Consider adding an import instead.`的错误
- 原因是button.tsx中没有import react, 以下代码div其实是一段语法糖，
```jsx
function Button() {
  return (
    <div>
      anniu
    </div>
  )
}
```
- 可以把以上代码放到babel online运行就可以得到翻译后的代码
```js
"use strict";

function Button() {
  return /*#__PURE__*/React.createElement("div", null, "anniu");
}
```
7. 解决控制台warning,WARNING in entrypoint size limit: The following entrypoint(s) combined asset size exceeds the recommended limit (244 KiB). This can impact web performance.
Entrypoints:index (276 KiB),index.js,因为开发模式下index把react也打包进去了
  - 解决方法是把 mode改成 'development'

8. 解决index过大的问题，用externals,也就是外部的库
```
 externals: {
    react: {
      commonjs: 'react', // var react = requrire...这种写法
      commonjs2: 'react',
      amd: 'react', 
      root: 'React', // <script src='xxx/react.min.js'>,window.React 这种写法
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom',
      root: 'ReactDOM',
    }
  }
```

9. 开发环境生产环境的区别
- 新建webpack.config.dev.js和webpack.config.prod.js，webpack.config.js作为共有的
- webpack.config.js
```js
const path = require('path')

module.exports = {
  entry: {
    index: './lib/index.tsx'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
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
}
```
- webpack.config.dev.js
```js
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
```
- webpack.config.prod.js
```js
const base = require('./webpack.config.js')

module.exports = Object.assign ({},base,{
    mode: 'production',
    externals: {
      react: {
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'react',
        root: 'React',
      },
      'react-dom': {
        commonjs: 'react-dom',
        commonjs2: 'react-dom',
        amd: 'react-dom',
        root: 'ReactDOM',
      }
    }
  }
)
```
- 改package.json的启动配置
```js
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "webpack-dev-server --config webpack.config.dev.js",
    "build": "webpack --config webpack.config.prod.js"
  },
```
10. 配置TS类型生命文件
- tsconfig.json加入`"outDir": "dist",`
- 把index.d.ts移到dist/lib/index下面,在package.json加入`"types": "dist/lib/index",`

11. 配置JEST,单元测试用
- `yarn add --dev jest babel-jest @babel/preset-env @babel/preset-react react-test-renderer`

12. 新建.babelrc
```js
{
  "presets": [
    "react-app"
  ]
}
```
- package.json增加test
```
  "scripts": {
    "test": "cross-env NODE_ENV=test jest --config=jest.config.js --runInBand",
    "start": "cross-env NODE_ENV=development webpack-dev-server --config webpack.config.dev.js",
    "build": "cross-env NODE_ENV=production webpack --config webpack.config.prod.js"
  },
```
- 配置jest.config.js
```js
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  verbose: true,
  clearMocks: false,
  collectCoverage: false,
  reporters: ["default"],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/test/__mocks__/file-mock.js",
  },
  testMatch: ['<rootDir>/**/__tests__/**/*.unit.(js|jsx|ts|tsx)'],
  transform: {
    "^.+unit\\.(js|jsx)$": "babel-jest",
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  setupFilesAfterEnv: ["<rootDir>test/setupTests.js"]
}
```
- 安装`yarn add --dev ts-jest`
- 创建setup/setupTests.js,等用到了在写
- 测试一个button按钮, 发现问题，用了jest后要改成import * as React from 'react'这种形式
- 修改tsconfig.json的配置，就可以用default open
```
    "strictNullChecks": true,
    // "suppressImplicitAnyIndexErrors": true,
    // https://github.com/Microsoft/TypeScript/issues/28762#issuecomment-443406607
//    "allowSyntheticDefaultImports": true, // 已经被弃用, ts-js不支持
    "esModuleInterop": true,
```
三. 组件1-icon上
1. 为什么要造轮子
- 不要重复造轮子,但是要有造轮子的能力
- 为了不求人,假设你使用了某个UI框架，但是发现有bug,于是你反馈给开发者，开发者说两周后修复，而你的项目一周后上线，怎么办？为什么很多大公司不使用其他公司的轮子，要自己造，google不会用Facebook的react而用自己的angular。为了把控自己业务，不被别人牵着走
- 为了不流于平庸，大家都是写增删改查，你跟别人比有什么优势？如果能说一句【我公司的人都在用我写的UI框架】是不是很牛逼？造轮子会遇到很多技术层面而非业务层面的知识，比如一些算法。
- 为了创造，你为别人做了这么久的事情，有没有为自己做过什么？证明有自驱动力。
- 为什么是UI轮子,是风口，每个公司都需要UI框架，写到简历里面容易涨工资

2. 为什么手机上的UI框架不好用?
- 手机上交互少，手机上最复杂最常用的只有下拉更新

3. React.FunctionComponent与IconProps
- 装插件React develop tools
- ts和react的第一个知识点，如何声明一个函数组件接受props
```tsx
import React from 'react';

interface IconProps {
  name: string;
}

const Icon: React.FunctionComponent<IconProps> = (props) => {
  // Icon的类型是一个接受IconProps的函数组件FunctionComponent,<>表示类型接受一个参数P,如果不传参数的默认值就是一个空对象
  // 空对象表示没有任何限制，当传了就有限制,p会传递到PropsWithChildren
  // 最终的意思就是当我们写Function, 这个函数组件Props必须有name还可以有children,此时props的类型就是IconProps外加一个Children
  return (
    <span>{ props.name }</span>
  )
};

export default Icon;
```

4. 使用并配置svg-sprite-loader
- 新建types/custom.d.ts
```ts
declare module '*.svg' {
  const content: any;
  export default content;
}
```
- tsconfig.json增加,表示这是源文件,include表示ts需要分析哪些文件
```
"include": [
    "types/**/*",
    "lib/**/*"
  ], 
```
- icon.tsx
```
import wechat from '../icons/wechart.svg'
console.log(wechat);
```
- webpack.config.js
```
module: {
    rules: [
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader'
      },
    ]
  },
```
- `lib/**/*`,中的**,**表示任意的文件或者目录,而*只是表示文件,把types放到lib下include就只要写`lib/**/*`
- 实现功能主要代码,根据name展示不一样的代码
```ts
import React from 'react';
import wechat from '../icons/wechat.svg'
console.log(wechat);
interface IconProps {
  name: string;
}

const Icon: React.FunctionComponent<IconProps> = (props) => {
  return (
    <span>
      { props.name }
      <svg>
        <use xlinkHref={`#${props.name}`} />
      </svg>
    </span>
  )
};

export default Icon;
```
- 总结:第一件事情+loader,loader会把所有svg放到页面最上面，第二步把所有svg的的源放到icons下面,第三步在icons中下面引入svg，第四部写个svg然后use这个icon，加上id
5. declare module这段代码的作用
```
// 是针对import 'wechat' from 'wechat.svg' 这种情况，如果不写会出问题,因为没有export,写了就表示所有svg都有content:any并且为默认导出
declare module '*.svg' {
  const content: any;
  export default content;
}
```
6. importAll 实现一下子导入任意多个svg
- importIcons.js
```js
let importAll = (requireContext) => requireContext.keys().forEach(requireContext)
try {
  importAll(require.context('./icons/'), true, /\.svg$/)
} catch (error) {
  console.log(error)
}
```
- 然后在Icon组件中使用
```tsx
import React from 'react';
import './importIcons.js'
interface IconProps {
  name: string;
}

const Icon: React.FunctionComponent<IconProps> = (props) => {
  return (
    <span>
      { props.name }
      <svg>
        <use xlinkHref={`#${props.name}`} />
      </svg>
    </span>
  )
};

export default Icon;
```
- treeShaking
```
import wechart from './icons'一个个引入好还是直接import all好
import wechart from './icons'这种叫做静态函数，import all是非静态加载
右边方便，左边方便treeshaking，tressShaking的基础是静态引入，import all虽然方便但是后续不能treeShaking
```
四. 组件1-icon下
1. 给icon组件增加样式
- 配置 SCSS loader
    - Unexpected token (1:0)错误，理解为不认识的字符串,token理解为string字符串
    - 对webpack.config.js进行配置
```
module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  }
```
- 从右往左进行理解,'sass-loader'把icon.scss编程icon.css但是不是生成文件只是编程字符串翻译到内存，那么css-loader可以就可以将之后的结果变成对象，对面里面有字符串，style-loader是把整个对象变成style标签,具体伪代码如下,面试要说出来
- 一个loader只做一件事情，所以有时候需要很多loader去配合去完成一件事
```
document.createElement('style')
innerHTML = 'css'
document.head.append(style)
```
- 安装`yarn add --dev sass-loader css-loader style-loader` 以及特殊的安装node-sass方法`yarn add node-sass@npm:dart-sass `
- 添加css代码
```tsx
import React from 'react';
import './importIcons.js'
import './icon.scss'

interface IconProps {
  name: string;
}

const Icon: React.FunctionComponent<IconProps> = (props) => {
  return (
      <svg className="zui-icon">
        <use xlinkHref={`#${props.name}`} />
      </svg>
  )
};

export default Icon;
```
- icon.scss
```css
.zui-icon {
  width: 1.4em;
  height: 1.4em;
}
```
2. 给icon组件增加click事件，svg点击事件初步实现
- icon.tsx
```
import React from 'react';
import './importIcons.js'
import './icon.scss'

interface IconProps {
  name: string;
  onClick: () => void;

  // onClick: React.MouseEventHandler<SVGElement>
  // onClick表示是svg元素鼠标事件的处理函数
}

const Icon: React.FunctionComponent<IconProps> = (props) => {
  return (
      <svg className="zui-icon" onClick={props.onClick}>
        <use xlinkHref={`#${props.name}`} />
      </svg>
  )
};

export default Icon;
```
- index.tsx
```
import ReactDOM from 'react-dom'
import React from 'react'
import Icon from './icon'
const fn = ()=>{
  console.log('fn')
};

ReactDOM.render(
  <div>
    <Icon name="QQ" onClick={fn} />
  </div>, document.querySelector('#root'));
```
- 如何声明e的类型,完善e的类型
- index.tsx
```
import ReactDOM from 'react-dom'
import React from 'react'
import Icon from './icon'
const fn: React.MouseEventHandler = (e)=>{
  console.log(e.target);// target可能没有属性,MouseEvent接受参数, 断言
};

ReactDOM.render(
  <div>
    <Icon name="QQ" onClick={fn} />
  </div>, document.querySelector('#root'));
```
- icon.tsx
```
import ReactDOM from 'react-dom'
import React from 'react'
import Icon from './icon'
const fn: React.MouseEventHandler = (e)=>{
  console.log(e.target);// target可能没有属性,MouseEvent接受参数, 断言
};

ReactDOM.render(
  <div>
    <Icon name="QQ" onClick={fn} />
  </div>, document.querySelector('#root'));
```
3. 让Icon响应所有事件，利用react内置的DOM attributes接口
- 如果让一个元素完全像svg元素或者html，元素第一步类型继承
```js
interface IconProps extends React.SVGAttributes<SVGElement>{
  name: string; // 增加的
}
```
- 然后要用展开符把props放到属性后面
```
import React from 'react';
import './importIcons.js'
import './icon.scss'

interface IconProps extends React.SVGAttributes<SVGElement>{
  name: string;
}

const Icon: React.FunctionComponent<IconProps> = (props) => {
  return (
      <svg className="zui-icon"
        {...props}>
        <use xlinkHref={`#${props.name}`} />
      </svg>
  )
};

export default Icon;
```

4. 自己写classes函数解决外部class覆盖内部的的问题，vue会自己合并，react自己解决
- 解决方式一,icon.tsx
```tsx
import React from 'react';
import './importIcons.js'
import './icon.scss'

interface IconProps extends React.SVGAttributes<SVGElement>{
  name: string;
}

const Icon: React.FunctionComponent<IconProps> = (props) => {
  const {className, ...restProps} = props;
  return (
      <svg className={`zui-icon ${className}`}
        {...restProps}>
        <use xlinkHref={`#${props.name}`} />
      </svg>
  )
};

export default Icon;
```
- index.tsx
```
import ReactDOM from 'react-dom'
import React from 'react'
import Icon from './icon'
const fn: React.MouseEventHandler = (e)=>{
  console.log(e.target);// target可能没有属性,MouseEvent接受参数, 断言
};

ReactDOM.render(
  <div>
    <Icon name="QQ" className='qqqq' onClick={fn}
          onMouseEnter={() => console.log('enter')}
          onMouseLeave={() => console.log('leave')}
    />
  </div>, document.querySelector('#root'));

```

- 如果没传会出现undefined,有一个库叫classnames，解决了这个问题
  - helpers/classes.tsx
```
function classes(...names:(string|undefined)[]) {
  return names.filter(Boolean).join(' ')
}

export default classes;
```
  - icon.tsx
```tsx
import React from 'react';
import './importIcons.js'
import './icon.scss'
import classes from './helpers/classes'

interface IconProps extends React.SVGAttributes<SVGElement>{
  name: string;
}

const Icon: React.FunctionComponent<IconProps> = (props) => {
  const {className, ...restProps} = props; // 剩余操作符
  return (
      <svg className={classes('zui-icon',className)}
        {...restProps}>
        <use xlinkHref={`#${props.name}`} />
      </svg>
  )
};

export default Icon;
```
- 进一步用解构的方式优化代码
```ts
import React from 'react';
import './importIcons.js'
import './icon.scss'
import classes from './helpers/classes'

interface IconProps extends React.SVGAttributes<SVGElement>{
  name: string;
}

const Icon: React.FunctionComponent<IconProps> = ({className, name, ...restProps}) => {
  return (
      <svg className={classes('zui-icon', className)}
        {...restProps}>
        <use xlinkHref={`#${name}`} />
      </svg>
  )
};

export default Icon;

```
- react的计算属性
```jsx

static defaultProps = {
  message: 'default message'
};

constructor(props){
  super(props);
  this.state = {
    n: 1,
    firstName : 'aaa',
    lastName : 'bbb'
  }
}

get name(){
  return this.state.firstName + this.state.firstName 
}
set name(newName){
  const [firstName, lastName] = newName.split(" ")
  this.setState({
    firstName,
    lastName
  }) // 搞个input就可以
}
componentDidMount()
render(){
  return {
    <div>{this.name}</div>
  }
}
ReactDOM.render(<App />)

interface props{
  message?: string
}

```
- 函数组件一般写法
```tsx
import PropTypes from 'prop-types'
const App: React.FunctionComponent<Props> = (props)=> {
  const [n, setN] = useState(1) // 函数组件用state
  const x = ()=>{
    setN(n+1)
  }
  useEffect(()=>{
    console.log('UI更新之后, mounted或者updated')
  }) // 在每次ui更新之后执行

  useEffect(()=>{
    console.log('UI更新之后, mounted或者updated')
  }, [n]) // 这里表示n变化了之后变化n为依赖,删完[]只在第一次执行就是mounted,和unmount，最常用就是在[]的地方ajax操作
  props.message!.split(' ') // ！表示强制为空
  return (
    <div onClick = {x}>{props.message}</div> // 函数组件用props
  )
}

App.defaultProps = {
  message: 'getDefaultMessage'
}

React.render(<App message = 'hi function'/>, rootElement)
App.protoTypes = {
  message: PropTypes.number,
} // 函数组件检查js类型
```
- 总共要七个:useState, useEffect,useContext组件通信,userReducer是代替redux的方案,useRef代替类里面的Ref,useCallback,useMemo
- 函数式的本质式不能第二次赋值，无状态，函数的好处是可以用数学知识，类的好处是适合人类