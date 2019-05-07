# idea-exclude-dir

[![npm](https://img.shields.io/npm/v/idea-exclude-dir.svg)](https://www.npmjs.com/package/idea-exclude-dir)
[![npm](https://img.shields.io/node/v/idea-exclude-dir.svg)](https://www.npmjs.com/package/idea-exclude-dir)
[![npm](https://img.shields.io/npm/dt/idea-exclude-dir.svg)](https://www.npmjs.com/package/idea-exclude-dir)
[![npm](https://img.shields.io/npm/dm/idea-exclude-dir.svg)](https://www.npmjs.com/package/idea-exclude-dir)
[![npm](https://img.shields.io/github/stars/maxming2333/idea-exclude-dir.svg?style=social&label=Star)](https://github.com/maxming2333/idea-exclude-dir) 

-----

> A plugin used to set the jetbrains editor to exclude the folder

[![NPM](https://nodei.co/npm-dl/idea-exclude-dir.png)](https://nodei.co/npm/idea-exclude-dir/)

[![NPM](https://nodei.co/npm/idea-exclude-dir.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/idea-exclude-dir/)

-----

exclude dir in idea(webstorm, IntelliJ IDEA ......)

增加 idea 下自动exclude `node_modules`文件夹

使用 `jetbrains` 的 idea 应该都会产生同样的痛苦

如果在cnpm安装期间不设置项目下的 `node_modules`文件夹 为 `exclude` 那么势必会卡死整个idea

因为如果不设置 `exclude` 那么 idea 会`indexing` node_modules下的所有文件

所以有了这个想法，在安装之前先设置 idea `exclude`掉`node_modules`文件夹

## usage


**install**

```bash
npm install idea-exclude-dir --save-dev
```

**use**

`In package.json`

#### 在 `scripts` 字段增加以下代码

```js
"scripts": {
  "preinstall": "npm install idea-exclude-dir && idea-exclude"
}
```


#### 同时配置 `config.idea.index` 字段

```js
{
  "config": {
    "idea": {
      "index": ["/log", "/node_modules", "/.idea"]
    }
  }
}
```


#### CLI使用方法

全局安装

```bash
npm install idea-exclude-dir -g
```

命令行使用

```bash
idea-exclude -d /abc -d /path/to
idea-exclude -d /abc -d /path/to -c # 对目录取消exclude操作
```



### Example

[package.json](example/package.json)