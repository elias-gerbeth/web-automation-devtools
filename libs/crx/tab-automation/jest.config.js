module.exports = {
  name: 'crx-tab-automation',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/crx/tab-automation',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
