#!/usr/bin/env node

'use strict';

const path = require('path');
const exclude = require('..');
const CWD = process.cwd();
const pkg = require(path.join(CWD, 'package.json'));
const argv = require('minimist')(process.argv.slice(2));
const pkgList = pkg.config && pkg.config.idea && pkg.config.idea.index;
let list = ['/node_modules'];

if (pkgList) {
  list = list.concat(pkgList);
}

if (argv.d) {
  list = list.concat(argv.d);
}

// 去重
list = Array.from(new Set(list));

exclude.cwd = CWD;
exclude.excludeDir(list);