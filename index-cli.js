const path = require('path');
const exclude = require('./index.js');
const CWD = process.cwd();
const pkg = require(path.join(CWD, 'package.json'));
const list = pkg.config && pkg.config.idea && pkg.config.idea.index;

exclude.cwd = CWD;
exclude.excludeDir(list || ['/node_modules']);