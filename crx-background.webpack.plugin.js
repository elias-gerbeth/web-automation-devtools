const sourceFolder = 'background';
const addHotReload = true;
const copyStaticFiles = true;

const factory = require('./crx-webpack-plugin-factory');
exports.default = factory.generatePlugin(sourceFolder, addHotReload, copyStaticFiles);
