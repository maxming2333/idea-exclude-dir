"use strict";

const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const co = require('co');

exports.cwd = path.join(__dirname, '../../');

const prefix = '$MODULE_DIR$/';
let targetList = [];

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
  targetList.forEach((dir, index) => {
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


// 更新项目.iml文件
exports.updateProjectIml = function*(file, cancel) {

  if (!fs.existsSync(file)) {
    return;
  }

  const xml = yield exports.parseString(fs.readFileSync(file, 'utf-8').toString());
  const content = xml.module.component[ 0 ].content[ 0 ];
  content.excludeFolder = content.excludeFolder || [];
  if (!cancel) {
    const haveExclude = [];
    // 检查是否已经含有 node_modules 忽略
    content.excludeFolder.forEach(function(exclude) {
      const filePath = exclude.$.url;
      const dir = filePath.substring(filePath.lastIndexOf('$/') + 1);
      const index = targetList.indexOf(dir);
      if (index >= 0) {
        haveExclude[ index ] = true;
      }
    });
    exports.setExcludeFolder(content.excludeFolder, haveExclude);
  } else {
    content.excludeFolder.forEach(function(exclude, index) {
      const filePath = exclude.$.url;
      const dir = filePath.substring(filePath.lastIndexOf('$/') + 1);
      if (targetList.indexOf(dir) >= 0) {
        content.excludeFolder.splice(index);
      }
    });
  }

  // 返流
  fs.writeFileSync(file, exports.buildObject(xml));
};

// 设置 node_modules 为 exclude
exports.doTargetDir = function(dirList, cancel) {
  const projectName = path.basename(exports.cwd);
  const ideaConfigPath = path.join(exports.cwd, '.idea');
  const modulesFile = path.join(ideaConfigPath, 'modules.xml');

  if (!isDirectory(ideaConfigPath) || !(dirList instanceof Array)) {
    return;
  }

  // 标准化 dirList
  dirList.forEach((dir, index) => {
    targetList[ index ] = /^\//ig.test(dir) ? dir : '/' + dir;
  });

  // 解析 modules.xml
  co(function*() {
    // 检测是否含有 modules.xml 文件
    if (!fs.existsSync(modulesFile)) {
      const modulesTemplateFile = path.join(__dirname, 'data/modules.xml');
      const projectTemplateFile = path.join(__dirname, 'data/project.iml');
      const projectFile = path.join(ideaConfigPath, `${projectName}.iml`);
      const modulesTemplateText = fs.readFileSync(modulesTemplateFile).toString().replace(/\{\{([a-z0-9_-]+)\}\}/ig, (s, p1) => {
        if (p1 === 'project_name') {
          return projectName;
        }
      });
      fs.writeFileSync(modulesFile, modulesTemplateText);
      fs.writeFileSync(projectFile, fs.readFileSync(projectTemplateFile));
      return;
    }
    const modules = yield exports.parseString(fs.readFileSync(modulesFile, 'utf-8').toString());
    let iml;
    modules.project.component.forEach(component => {
      if (component.$.name === 'ProjectModuleManager') {
        component.modules.forEach(current => {
          current.module.some(item => {
            const reg = /^\$PROJECT_DIR\$\/(.*\.iml)$/;
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
    iml && (yield exports.updateProjectIml(iml, cancel));
  });
};

function isDirectory(path) {
  try {
      const stat = fs.lstatSync(path);
      return stat.isDirectory();
  } catch (e) {
      return false;
  }
}
