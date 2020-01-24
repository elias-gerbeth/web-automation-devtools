module.exports = {
  name: 'background',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/background',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
