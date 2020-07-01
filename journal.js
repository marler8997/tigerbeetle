const assert = require('assert');

const Crypto = require('@ronomon/crypto-async');

const Journal = {
  fs: require('fs'),
  fd: null,
  path: null,
  position: 0,
  writing: false
};

Journal.open = function(path) {
  const self = this;
  self.path = path;
  self.fd = self.fs.openSync(self.path, 'r+');
};

Journal.write = function(buffer) {
  const self = this;
  // TODO: Batch Records
  // TODO: Checksums
  // TODO: Snapshot
  // TODO: Wrap around journal file
  assert(self.fd >= 0);
  assert(self.position >= 0);
  assert(self.writing === false);
  assert(buffer.length > 0);
  assert(buffer.length % 64 === 0);
  self.writing = true;
  // Simulate CPU cost of checkum:
  Crypto.hash('sha256', buffer);
  var bytesWritten = self.fs.writeSync(
    self.fd,
    buffer,
    0,
    buffer.length,
    self.position
  );
  assert(bytesWritten === buffer.length);
  self.fs.fsyncSync(self.fd);
  self.position += buffer.length;
  self.writing = false;
};

module.exports = Journal;
