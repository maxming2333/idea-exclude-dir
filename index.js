var path = require('path');
var exclude = require('./exclude.js');
var CWD = process.cwd();
var pkg = require( path.join(CWD, 'package.json') );

exclude.CWD = CWD;
exclude.excludeDir(pkg.excludeFolder || exports.excludeFolder || '/node_modules');