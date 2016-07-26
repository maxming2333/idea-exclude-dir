var path = require('path');
var exclude = require('./index.js');
var CWD = process.cwd();
var pkg = require( path.join(CWD, 'package.json') );

exclude.cwd = CWD;
exclude.excludeDir(pkg.excludeFolder || ['/node_modules']);