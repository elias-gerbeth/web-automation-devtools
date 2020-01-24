module.exports = {
  name: 'shared-state',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/shared/state',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
