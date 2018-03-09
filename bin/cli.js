#!/usr/bin/env node

'use strict';

const path = require('path');
const fs = require('fs');
const target = require('..');
const CWD = process.cwd();
const argv = require('minimist')(process.argv.slice(2));
const pkgFile = path.join(CWD, 'package.json');
const modulesFile = path.join(CWD, '.idea', 'modules.xml');
let list = ['/node_modules'];
let pkgList;
let cancel = false;

if (!fs.existsSync(modulesFile)) {
  process.exit(0);
}

// 检测 package.json
if (fs.existsSync(pkgFile)){
  const pkg = require(path.join(CWD, 'package.json'));
  pkgList = pkg.config && pkg.config.idea && pkg.config.idea.index;
} else {
  process.exit(0);
}


if (pkgList) {
  list = list.concat(pkgList);
}

if (argv.d) {
  list = list.concat(argv.d);
}

if (argv.c) {
  cancel = true;
}

// 去重
list = Array.from(new Set(list));

target.cwd = CWD;
target.doTargetDir(list, cancel);