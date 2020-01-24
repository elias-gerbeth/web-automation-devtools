module.exports = {
  name: 'shared-interfaces',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/shared/interfaces',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
