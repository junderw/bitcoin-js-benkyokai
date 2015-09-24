#!/usr/bin/env node

'use strict';

var Bitcoin = require('bitcoinjs-lib');
var Mnemonic = require('bitcore-mnemonic');
var Buffer = require('Buffer');

Mnemonic.prototype.toBIP44 = function (account) {
  account = parseInt(account) || 0;
  if (typeof account !== "number" || account < 0) return null;
  return this.toHDPrivateKey().derive("m/44'/0'/" + account + "'");
};

Bitcoin.prototype.derive = function (HD, i, j) {
  if (!i || typeof i !== "number" || i < 0) return null;
  j = parseInt(j) || 0;
  if (typeof j !== "number" || j < 0) return null;
  return Bitcoin.ECKey.fromWIF(HD.derive("m/" + j + "/" + i).privateKey.toWIF());
};


module.exports = {
    Mnemonic: Mnemonic,
    Bitcoin: Bitcoin,
    Buffer: Buffer
};