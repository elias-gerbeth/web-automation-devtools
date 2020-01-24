module.exports = {
  name: 'backend-walmart',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/backend/walmart',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
