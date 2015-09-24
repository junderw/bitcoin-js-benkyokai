#!/usr/bin/env node

'use strict';

var Bitcoin = require('bitcoinjs-lib');
Bitcoin.Mnemonic = require('bitcore-mnemonic');
Bitcoin.HD = require('bitcore').HDPrivateKey
Bitcoin.Buffer = require('Buffer');
Bitcoin.Crypto = require('crypto-browserify');

Bitcoin.encrypt = function (txt, passwd, salt, iterations) {
  salt = salt || "testsalt";
  iterations = iterations || 8192;
  var cipher = Bitcoin.Crypto.createCipher('aes-256-ctr',Bitcoin.Crypto.pbkdf2Sync(passwd, salt, iterations, 32, 'sha256'));
  var result = cipher.update(txt, 'utf8', 'base64')
  result += cipher.final('base64')
  cipher = null;
  txt = null;
  passwd = null;
  salt = null;
  return result;
};

Bitcoin.decrypt = function (enc, passwd, salt, iterations) {
  salt = salt || "testsalt";
  iterations = iterations || 8192;
  var decipher = Bitcoin.Crypto.createDecipher('aes-256-ctr',Bitcoin.Crypto.pbkdf2Sync(passwd, salt, iterations, 32, 'sha256'));
  try {
    var result = decipher.update(enc, 'base64', 'utf8')
    result += decipher.final('utf8')
  } catch(e) {
    return null;
  };
  decipher = null;
  enc = null;
  passwd = null;
  salt = null;
  return result;
};

var makeAccount = function (account, pathHead, self) {
  account = parseInt(account) || 0;
  if (typeof account !== "number" || account < 0) return null;
  return self.toHDPrivateKey().derive(pathHead + account + "'");
};

Bitcoin.Mnemonic.prototype.toBIP32 = function (account) {
  return makeAccount(account, "m/", this);
};

Bitcoin.Mnemonic.prototype.toBIP44 = function (account) {
  return makeAccount(account, "m/44'/0'/", this);
};

Bitcoin.HD.prototype.getKey = function (i, j) {
  if (i === null || typeof i !== "number" || i < 0) return null;
  j = parseInt(j) || 0;
  if (typeof j !== "number" || j < 0) return null;
  return Bitcoin.ECKey.fromWIF(this.derive("m/" + j + "/" + i).privateKey.toWIF());
};

module.exports = Bitcoin;
