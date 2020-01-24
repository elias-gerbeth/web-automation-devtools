const sourceFolder = 'frontend';
const addHotReload = false;
const copyStaticFiles = false;

const factory = require('./crx-webpack-plugin-factory');
exports.default = factory.generatePlugin(sourceFolder, addHotReload, copyStaticFiles, false);
