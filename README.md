# idea-exclude-dir

exclude dir in idea(webstorm, intelli IDEA ......)

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
```



### Example

[demo.json](demo.json)