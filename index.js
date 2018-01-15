'use strict';

var Bitcoin = require('bitcoinjs-lib');
var Mnemonic = require('bip39')
var BCrypto = require('crypto-browserify');
var unorm = require('unorm');

var encrypt = function (txt, passwd, salt, iterations) {
  salt = salt || "testsalt";
  passwd = new Buffer(unorm.nfkd(passwd),'utf8');
  salt = new Buffer(unorm.nfkd(salt),'utf8');
  iterations = iterations || 8192;
  var cipher = BCrypto.createCipher('aes-256-cbc',BCrypto.pbkdf2Sync(passwd, salt, iterations, 32, 'sha256'));
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
  passwd = new Buffer(unorm.nfkd(passwd),'utf8');
  salt = new Buffer(unorm.nfkd(salt),'utf8');
  iterations = iterations || 8192;
  var decipher = BCrypto.createDecipher('aes-256-cbc',BCrypto.pbkdf2Sync(passwd, salt, iterations, 32, 'sha256'));
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

var makeAccount = function (pathHead, mnemonic, account, network) {
  account = parseInt(account) || 0;
  network = network || Bitcoin.networks.testnet
  if (typeof account !== "number" || account < 0) return null;
  mnemonic = unorm.nfkd(mnemonic)
  var _wordlist, isValid
  var foundWordlist = Object.keys(Mnemonic.wordlists).some(function (key) {
    var wordlist = Mnemonic.wordlists[key]
    var isContained = mnemonic.split(' ').every(function (word) {
      return (wordlist.indexOf(word) > -1)
    })
    if (isContained) {
      _wordlist = wordlist
    }
    return isContained
  })
  if (foundWordlist) {
    isValid = Mnemonic.validateMnemonic(mnemonic, _wordlist)
  }
  if (!isValid || !foundWordlist) {
    console.warn('Could not verify checksum. Be careful.')
  }
  var seed = Mnemonic.mnemonicToSeed(mnemonic)
  var HDNode = Bitcoin.HDNode.fromSeedBuffer(seed, network)
  return HDNode.derivePath(pathHead + account + "'");
};

var toBIP32path = function (mnemonic, account, network) {
  return makeAccount("m/", mnemonic, account, network);
};

var toBIP44path = function (mnemonic, account, network) {
  return makeAccount("m/44'/0'/", mnemonic, account, network);
};

var HDGetKey = function (i, HDkey, j) {
  if (i === null || typeof i !== "number" || i < 0) return null;
  if (j && parseInt(j) != 1 && parseInt(j) != 0) return null;
  i = parseInt(i);
  j = parseInt(j) || 0;
  if (typeof j !== "number" || j < 0) return null;
  return HDkey.derivePath(j + '/' + i).keyPair;
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
