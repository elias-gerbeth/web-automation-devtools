module.exports = {
  name: 'dev-tools',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/dev-tools',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
