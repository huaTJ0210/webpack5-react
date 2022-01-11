---
title: webpack5搭建React项目
date: 2021-7-3
categories:
  - React
tags:
  - React



---



## webpack5搭建React项目

### 1、webpack初始化项目

#### 1.1 初始化项目

```bash
# app/
npm init -y
```

#### 1.2 安装webpack

```bash
npm install -D webpack webpack-cli
```

#### 1.3 创建入口文件

```javascript
// : app/src/index.js
console.log('webpack5&react!!')
```

#### 1.4 创建webpack.config.js

```javascript
// : app/webpack.config.js

const path = require('path');
const resolve = relatedPath => path.join(__dirname, relatedPath);

const webpackConfig = {
  entry: './src/index.js', // webpack打包入口文件
  output: {
    path: resolve('dist'), //path为打包后的输出文件夹位置，此处为 ./dist文件夹
    filename: '[contenthash].bundle.js',
    clean: true // 每次打包清理上一下文件
  }
};
module.exports = webpackConfig;
```

#### 1.5 测试打包

#####  1.5.1 在package.json文件添加运行脚本

```json
"scripts": {
    "start":"webpack --config webpack.config.js"
  },
```

##### 1.5.2 测试打包

```bash
# app/
npm run start
```

### 2、安装React

#### 2.1 安装React、ReactDOM

```bash
# app/
npm install react react-dom
```

#### 2.2 修改index.js

```javascript
// : app/src/index.js
import React from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  return (
    <div>
      app
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
```

#### 2.3 安装babel-loader

> [babel-loader](https://webpack.docschina.org/loaders/babel-loader/)

```bash
# app/   
npm install -D babel-loader @babel/core @babel/preset-react
```

#### 2.4 配置babel-loader

##### 2.4.1 webpack.config.js中对于js文件使用babel-loader

```javascript
// app/webpack.config.js
const webpackConfig = {
 module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/, // 确保转义尽可能少的文件
        use: { loader: 'babel-loader' }
      },
    ]
 } 
};
```

##### 2.4.2 针对babel使用babel.config.js进行配置

```javascript
// app/babel.config.js
module.exports = {
  presets: ['@babel/preset-react']
};
```

##### 2.4.3 babel的优化

> 

#### 2.5 测试打包

```bash
# app/
npm run start
```

### 3、HtmlWebpackPlugin

> 使用模板文件自动引入打包的bundle文件

#### 3.1 安装插件

```bash
# app/
npm install --save-dev html-webpack-plugin
```

#### 3.2 创建模板文件

```
# app/public/index.html

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>react&webapck5</title>
</head>
<body>
    <div id="root" class="root"></div>
</body>
</html>
```

#### 3.3 配置插件

```javascript
// app/webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackConfig = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html' //引用模板html文件生成项目的入口文件html
    })
  ]
};
```

#### 3.4 测试打包

```bash
# app/
npm run start

# 浏览器中运行 app/dist/index.html
```

### 4、less配置

#### 4.1 安装插件

> + less-loader:处理less文件
> + postcss-loader：利用postcss处理css文件，例如使用autoprefixer添加浏览器前缀等

```bash
# app/
npm install --save-dev css-loader
npm install less less-loader --save-dev
npm install --save-dev postcss-loader postcss
npm install --save-dev mini-css-extract-plugin
```

#### 4.2 配置loader

```javascript
// app/webpack.config.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpackConfig = {
 module: {
    rules: [
        {
        test: /\.(less)$/,
        exclude: /node_modules/,
        use: [
          { loader: MiniCssExtractPlugin.loader }, // MiniCssExtractPlugin.loader 需要在css-loader之后解析
          {
            loader: 'css-loader',
            options: {
              modules: {// 配置cssmodule
                localIdentName: '[path][name]__[local]--[hash:base64:5]',
                localIdentContext: path.resolve(__dirname, 'src'),
                exportLocalsConvention: 'camelCase'
              }
            }
          },
          { loader: 'postcss-loader' },
          {
            loader: 'less-loader',
            options: { lessOptions: { javascriptEnabled: true } } // 当解析antd.less，必须配置，否则会报Inline JavaScript is not enabled错误
          }
        ]
      },
    ]
 },
    plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html' //引用模板html文件生成项目的入口文件html
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }) // 本插件会将 CSS 提取到单独的文件中，为每个包含 CSS 的 JS 文件创建一个 CSS 文件
  ]
};
```

#### 4.3 创建less文件

```less
# app/src/index.less
.app {
  background-color: aqua;
  font-size: 20px;
}
```

#### 4.4 修改index.js

```javascript
// app/src/index.js
import React from 'react';
import ReactDOM from 'react-dom';

import style from './index.less';

const App = () => {
  return <div className={style.app}>app</div>;
};

ReactDOM.render(<App />, document.getElementById('root'));

```

#### 4.5 测试打包

```bash
# app/
npm run start

# 浏览器中运行 app/dist/index.html
```

#### 4.6 配置postcss

##### 4.6.1 创建postcss.config.js

> + `npm install postcss-pxtorem -D` 此插件将px转化为rem【可按照需求选择】
> + `npm install autoprefixer -D` 

```javascript
// app/postcss.config.js
module.exports = {
  plugins: [
    require('autoprefixer')(), // 给css自动添加前缀
    [
      'postcss-pxtorem', 
      {
        rootValue: 100, //root element font size 需要配合js脚本
        unitPrecision: 5, //（数字）允许REM单位增长的十进制数字
        replace: true, // （布尔值）替换包含rems的规则，而不添加后备
        mediaQuery: false, // （布尔值）允许在媒体查询中转换px
        minPixelValue: 0, // （数字）设置要替换的最小像素值
        selectorBlackList: [], // 忽略转换正则匹配项
        propList: ['*'], // 可以从px转换为rem的属性，匹配正则
        exclude: /node_modules/i // （字符串，正则表达式，函数）要忽略并保留为px的文件路径
      }
    ]
  ]
};
```

#### 4.6.2 autoprefixer配置

> 需要再package.json中增减对浏览器的配置

```json
 "browserslist": {
    "production": [
      ">1%",
      "last 1 versions",
      "ie>=8",
      "Firefox> 20",
      "Chrome > 31"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
```



### 5、静态资源

> [资源模块](https://webpack.docschina.org/guides/asset-modules/#root)
>
> 资源模块(asset module)是一种模块类型，它允许使用资源文件（字体，图标等）而无需配置额外 loader。

### 6、开发环境配置

#### 6.1 插件

```bash
npm install webpack-merge -D # 合并开发环境的配置文件
npm install webpack-dev-server -D # 开发环境HMR
```

#### 6.2 创建webpack.dev.js

```javascript
const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');

const dev = {
  mode: 'development',
  /*开发环境设置sourceMap*/
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    port: 9090,
    proxy: {
      /*本地开发环境设置代理，解决CORS的问题*/
      api: {
        target: 'https://xx.xx.xx.xx'
      }
    }
  }
};

module.exports = merge(common, dev);
```

#### 6.3 package.json 修改开发环境启动脚本

```json
"scripts": {
    "start": "webpack-dev-server --config webpack.dev.js",
  },
```

##### 

### 7、生产环境配置

#### 7.1 创建webpack.prod.js

```javascript
const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');

const prod = {
  mode: 'production',
};

module.exports = merge(common, prod);
```

#### 7.2 package.json 修改生产环境启动脚本

```json
"scripts": {
    "build": "webpack --config webpack.prod.js",
  },
```

### 8、工程化配置

#### 8.1 ESLint

> + [eslint-config-alloy](https://github.com/AlloyTeam/eslint-config-alloy)
>
> + 针对react项目的配置:   [eslint-react](https://github.com/AlloyTeam/eslint-config-alloy/blob/master/README.zh-CN.md#react)

##### 8.1.1 .eslintrc.js文件中添加settings【**】

>Warning: React version not specified in eslint-plugin-react settings. See https://github.com/yannickcr/eslint-plugin-react#configuration .

```javaScript
// .eslintrc.js
settings: {
    react: {
      version: 'detect',
    },
  },
```

##### 8.1.2  添加.eslintrcignore

```
# eslint 忽略检查 (根据项目需要自行添加)
node_modules
dist
.prettierrc.js
```

#### 8.2 Prettier 使用

> + `npm install prettier -D`
> + [prettier](https://github.com/AlloyTeam/eslint-config-alloy/blob/master/README.zh-CN.md#%E5%A6%82%E4%BD%95%E7%BB%93%E5%90%88-prettier-%E4%BD%BF%E7%94%A8)

#### 8.3 配置 husky + lint-staged + commitlint

> - husky:一个为 git 客户端增加 `hook` 的工具。安装后，它会自动在仓库中的 `.git/` 目录下增加相应的钩子；比如 `pre-commit` 钩子就会在你执行 `git commit` 的触发。
> - `lint-staged`: 一个仅仅过滤出 Git 代码暂存区文件(被 `git add` 的文件)的工具；
> - commitlint: 代码的提交规范和规范的校验，优雅的提交，方便团队协作和快速定位问题

##### 8.3.1 插件安装

```bash
npm i mrm -D
npx mrm lint-staged -D
npm install --save-dev @commitlint/config-conventional @commitlint/cli
```

##### 8.3.2 配置 commitlint.config.js

```javascript
module.exports = { extends: ['@commitlint/config-conventional'] };

/*
提交的的类型：

build：主要目的是修改项目构建系统(例如 glup，webpack，rollup 的配置等)的提交
ci：主要目的是修改项目继续集成流程(例如 Travis，Jenkins，GitLab CI，Circle等)的提交
docs：文档更新
feat：新增功能
merge：分支合并 Merge branch ? of ?
fix：bug 修复
perf：性能, 体验优化
refactor：重构代码(既没有新增功能，也没有修复 bug)
style：不影响程序逻辑的代码修改(修改空白字符，格式缩进，补全缺失的分号等，没有改变代码逻辑)
test：新增测试用例或是更新现有测试
revert：回滚某个更早之前的提交
chore：不属于以上类型的其他类型
*/
```

##### 8.3.3 在package.json中增加配置

```json
 "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
       "commit-msg": "commitlint -e $HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{js,jsx,vue,ts,tsx}": [
      "yarn lint",
      "prettier --write"
    ]
  }
```

