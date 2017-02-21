"use strict";

const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const co = require('co');

exports.cwd = path.join(__dirname, '../../');

const prefix = '$MODULE_DIR$/';
let excludeList = [];

// XML 转 Object
exports.parseString = function*(xml) {
  return new Promise(function(resolve, reject) {
    new xml2js.Parser().parseString(xml, function(err, result) {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Object 转 XML
exports.buildObject = function(obj) {
  return new xml2js.Builder().buildObject(obj);
};


// 设置忽略
exports.setExcludeFolder = function(exclude, use) {
  excludeList.forEach((dir, index) => {
    if (use[ index ]) {
      return;
    }
    exclude.push({
      $: {
        url: 'file://' + path.join(prefix, dir)
      }
    });
  });
};


// 获取项目的 xxx.iml
exports.getProjectIML = function*(file) {

  if (!fs.existsSync(file)) {
    return;
  }

  const xml = yield exports.parseString(fs.readFileSync(file, 'utf-8').toString());
  const content = xml.module.component[ 0 ].content[ 0 ];
  if (!content.excludeFolder) {
    content.excludeFolder = [];
    exports.setExcludeFolder(content.excludeFolder, []);
  } else {
    const haveExclude = [];
    // 检查是否已经含有 node_modules 忽略
    content.excludeFolder.forEach(function(exclude) {
      const filePath = exclude.$.url;
      const dir = filePath.substring(filePath.lastIndexOf('$/') + 1);
      const index = excludeList.indexOf(dir);
      if (index >= 0) {
        haveExclude[ index ] = true;
      }
    });
    exports.setExcludeFolder(content.excludeFolder, haveExclude);
  }

  // 返流
  fs.writeFileSync(file, exports.buildObject(xml));
};

// 设置 node_modules 为 exclude
exports.excludeDir = function(dirList) {
  const modulesFile = path.join(exports.cwd, '.idea', 'modules.xml');

  // 检测是否含有 modules.xml 文件
  if (!fs.existsSync(modulesFile) || !(dirList instanceof Array)) {
    return;
  }

  // 标准化 dirList
  dirList.forEach((dir, index) => {
    excludeList[ index ] = /^\//ig.test(dir) ? dir : '/' + dir;
  });

  // 解析 modules.xml
  co(function*() {
    const modules = yield exports.parseString(fs.readFileSync(modulesFile, 'utf-8').toString());
    let iml;
    modules.project.component.forEach(component => {
      if (component.$.name === 'ProjectModuleManager') {
        component.modules.forEach(module => {
          module.module.some(item => {
            const reg = /^\$PROJECT_DIR\$\/(\.idea\/([^\/]+)\.iml)$/;
            const isIml = reg.test(item.$.filepath);
            if (isIml) {
              iml = item.$.filepath.replace(reg, `${exports.cwd}/$1`);
              return true;
            }
          });
        });
        iml = path.join(iml);
      }
    });
    iml && (yield exports.getProjectIML(iml));
  });

};