module.exports = {
  name: 'crx-messaging',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/crx-messaging',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
