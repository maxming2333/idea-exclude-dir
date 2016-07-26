var fs = require('fs');
var path = require('path');
var xml2js = require('xml2js');

exports.cwd = path.join(__dirname, '../../');

// XML 转 Object
exports.parseString = function (xmlText, callBack) {
  new xml2js.Parser().parseString(xmlText, function (err, result) {
    if (err) throw new Error(err);
    callBack(result);
  });
};

// Object 转 XML
exports.buildObject = function (obj) {
  return new xml2js.Builder().buildObject(obj);
};

// 设置 node_modules 为 exclude
exports.excludeDir = function (exDir) {

  if (!(exDir instanceof Array)) {
    return;
  } else {
    // 标准化 exDir
    exDir.forEach(function (dir, index) {
      exDir[index] = /^\//ig.test(dir) ? dir : '/' + dir;
    })
  }

  var modulesFile = path.join(exports.cwd, '.idea', 'modules.xml');
  var prefix = '$MODULE_DIR$/';

  // 检测是否含有 modules.xml 文件
  if (!fs.existsSync(modulesFile)) {
    return;
  }

  // 设置忽略
  var setExcludeFolder = function (exclude, use) {
    exDir.forEach(function (dir, index) {
      if (use[index]) {
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
  var getProjectIML = function (_file) {

    if (!fs.existsSync(_file)) {
      return;
    }

    var iml = fs.readFileSync(_file, 'utf-8').toString();
    exports.parseString(iml, function (result) {
      var content = result.module.component[0].content[0];

      if (!content.excludeFolder) {
        content.excludeFolder = [];
        setExcludeFolder(content.excludeFolder, []);
      } else {
        var haveExclude = [];
        // 检查是否已经含有 node_modules 忽略
        content.excludeFolder.forEach(function (exclude) {
          var filePath = exclude.$.url;
          var dir = filePath.substring(filePath.lastIndexOf('$/') + 1);
          var index = exDir.indexOf(dir);
          if (index >= 0) {
            haveExclude[index] = true;
          }
        });
        setExcludeFolder(content.excludeFolder, haveExclude);
      }

      // 返流
      fs.writeFileSync(_file, exports.buildObject(result));
    });
  };

  // 解析 modules.xml
  var xml = fs.readFileSync(modulesFile, 'utf-8').toString();
  exports.parseString(xml, function (result) {
    // 获取项目 xxx.iml 地址
    var filePath = result.project.component[0].modules[0].module[0].$.filepath;
    if (filePath) {
      var iml = filePath.replace(/.*\/(\.idea.*)/ig, path.join(exports.cwd, '$1'));
      getProjectIML(iml);
    }
  });

};