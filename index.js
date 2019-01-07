'use strict'

const Bitcoin = require('bitcoinjs-lib')
const Mnemonic = require('bip39')
const BCrypto = require('crypto-browserify')
const unorm = require('unorm')

const encrypt = (txt, passwd, salt, iterations) => {
  salt = salt || "testsalt"
  passwd = new Buffer(unorm.nfkd(passwd),'utf8')
  salt = new Buffer(unorm.nfkd(salt),'utf8')
  iterations = iterations || 8192
  let cipher = BCrypto.createCipher('aes-256-cbc',BCrypto.pbkdf2Sync(passwd, salt, iterations, 32, 'sha256'))
  let result = cipher.update(txt, 'utf8', 'base64')
  result += cipher.final('base64')
  cipher = null
  txt = null
  passwd = null
  salt = null
  return result
}

const decrypt = (enc, passwd, salt, iterations) => {
  salt = salt || "testsalt"
  passwd = new Buffer(unorm.nfkd(passwd),'utf8')
  salt = new Buffer(unorm.nfkd(salt),'utf8')
  iterations = iterations || 8192
  let decipher = BCrypto.createDecipher('aes-256-cbc',BCrypto.pbkdf2Sync(passwd, salt, iterations, 32, 'sha256'))
  let result
  try {
    result = decipher.update(enc, 'base64', 'utf8')
    result += decipher.final('utf8')
  } catch(e) {
    return null
  }
  decipher = null
  enc = null
  passwd = null
  salt = null
  return result
}

const makeAccount = (pathHead, mnemonic, account, network) => {
  account = parseInt(account) || 0
  network = network || Bitcoin.networks.testnet
  if (typeof account !== "number" || account < 0) return null
  mnemonic = unorm.nfkd(mnemonic)
  let _wordlist, isValid
  let foundWordlist = Object.keys(Mnemonic.wordlists).some(key => {
    let wordlist = Mnemonic.wordlists[key]
    let isContained = mnemonic.split(' ').every(word => {
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
  let seed = Mnemonic.mnemonicToSeed(mnemonic)
  let HDNode = Bitcoin.bip32.fromSeed(seed, network)
  return HDNode.derivePath(pathHead + account + "'")
}

const toBIP32path = (mnemonic, account, network) => {
  return makeAccount("m/", mnemonic, account, network)
}

const toBIP44path = (mnemonic, account, network) => {
  return makeAccount("m/44'/0'/", mnemonic, account, network)
}

const HDGetKey = (i, HDkey, j) => {
  if (i === null || typeof i !== "number" || i < 0) return null
  if (j && parseInt(j) != 1 && parseInt(j) != 0) return null
  i = parseInt(i)
  j = parseInt(j) || 0
  if (typeof j !== "number" || j < 0) return null
  let result = HDkey.derivePath(j + '/' + i)
  return result.privateKey
    ? Bitcoin.ECPair.fromPrivateKey(result.privateKey)
    : Bitcoin.ECPair.fromPublicKey(result.publicKey)
}

const getAddress = keyNode =>
  Bitcoin.payments.p2pkh({ pubkey: keyNode.publicKey }).address

module.exports = {
  BCrypto: BCrypto,
  Buffer: Buffer,
  getAddress: getAddress,
  HDGetKey: HDGetKey,
  JS: Bitcoin,
  Mnemonic: Mnemonic,
  decrypt: decrypt,
  encrypt: encrypt,
  toBIP32path: toBIP32path,
  toBIP44path: toBIP44path
}
