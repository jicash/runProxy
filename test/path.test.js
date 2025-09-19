const { parseGcsPath } = require('../lib/path');

test('parses simple path', () => {
  expect(parseGcsPath('path/to/object')).toBe('path/to/object');
});

test('strips leading gs://', () => {
  expect(parseGcsPath('gs://bucket/path/to/object')).toBe('bucket/path/to/object');
});

test('strips leading slash', () => {
  expect(parseGcsPath('/path/to/object')).toBe('path/to/object');
});
