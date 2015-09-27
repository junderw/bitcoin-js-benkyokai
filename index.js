﻿#!/usr/bin/env node

'use strict';

var Bitcoin = require('bitcoinjs-lib');
var Mnemonic = require('bitcore-mnemonic');
var BCrypto = require('crypto-browserify');

var encrypt = function (txt, passwd, salt, iterations) {
  salt = salt || "testsalt";
  iterations = iterations || 8192;
  var cipher = BCrypto.createCipher('aes-256-ctr',BCrypto.pbkdf2Sync(passwd, salt, iterations, 32, 'sha256'));
  var result = cipher.update(txt, 'utf8', 'base64')
  result += cipher.final('base64')
  cipher = null;
  txt = null;
  passwd = null;
  salt = null;
  return result;
};

var decrypt = function (enc, passwd, salt, iterations) {
  salt = salt || "testsalt";
  iterations = iterations || 8192;
  var decipher = BCrypto.createDecipher('aes-256-ctr',BCrypto.pbkdf2Sync(passwd, salt, iterations, 32, 'sha256'));
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

var makeAccount = function (pathHead, mnemonic, account) {
  account = parseInt(account) || 0;
  if (typeof account !== "number" || account < 0) return null;
  return mnemonic.toHDPrivateKey().derive(pathHead + account + "'");
};

var toBIP32path = function (mnemonic, account) {
  return makeAccount("m/", mnemonic, account);
};

var toBIP44path = function (mnemonic, account) {
  return makeAccount("m/44'/0'/", mnemonic, account);
};

var HDGetKey = function (i, HDkey, j) {
  if (i === null || typeof i !== "number" || i < 0) return null;
  if (j && parseInt(j) != 1 && parseInt(j) != 0) return null;
  i = parseInt(i);
  j = parseInt(j) || 0;
  if (typeof j !== "number" || j < 0) return null;
  return Bitcoin.ECKey.fromWIF(HDkey.derive("m/" + j + "/" + i).privateKey.toWIF());
};

module.exports = {
  BCrypto: BCrypto,
  Buffer: Buffer,
  HDGetKey: HDGetKey,
  JS: Bitcoin,
  Mnemonic: Mnemonic,
  decrypt: decrypt,
  encrypt: encrypt,
  toBIP32path: toBIP32path,
  toBIP44path: toBIP44path
};
