import * as Bitcoin from 'bitcoinjs-lib';
import * as Mnemonic from 'bip39';
import unorm from 'unorm';
import { Buffer } from 'buffer';
const BCrypto = require('crypto-browserify');

export const encrypt = (
  txt: string,
  passwd: string,
  salt: string = 'testsalt',
  iterations: number = 8192,
): string => {
  const passwdBuf = Buffer.from(unorm.nfkd(passwd), 'utf8');
  const saltBuf = Buffer.from(unorm.nfkd(salt), 'utf8');

  const cipher = BCrypto.createCipher(
    'aes-256-cbc',
    BCrypto.pbkdf2Sync(passwdBuf, saltBuf, iterations, 32, 'sha256'),
  );

  let result: string = cipher.update(txt, 'utf8', 'base64');
  result += cipher.final('base64');

  return result;
};

export const decrypt = (
  enc: string,
  passwd: string,
  salt: string = 'testsalt',
  iterations: number = 8192,
): string | null => {
  const passwdBuf = Buffer.from(unorm.nfkd(passwd), 'utf8');
  const saltBuf = Buffer.from(unorm.nfkd(salt), 'utf8');

  const decipher = BCrypto.createDecipher(
    'aes-256-cbc',
    BCrypto.pbkdf2Sync(passwdBuf, saltBuf, iterations, 32, 'sha256'),
  );

  let result: string;
  try {
    result = decipher.update(enc, 'base64', 'utf8');
    result += decipher.final('utf8');
  } catch (e) {
    return null;
  }

  return result;
};

const makeAccount = (
  pathHead: string,
  mnemonic: string,
  account: number = 0,
  network: Bitcoin.Network = Bitcoin.networks.testnet,
): Bitcoin.BIP32Interface => {
  mnemonic = unorm.nfkd(mnemonic);
  let _wordlist: string[] | undefined;
  let isValid: boolean | undefined;
  const foundWordlist = Object.keys(Mnemonic.wordlists).some(
    (key: string): boolean => {
      const wordlist = Mnemonic.wordlists[key];
      const isContained = mnemonic.split(' ').every((word: string): boolean => {
        return wordlist.indexOf(word) > -1;
      });
      if (isContained) {
        _wordlist = wordlist;
      }
      return isContained;
    },
  );
  if (foundWordlist && _wordlist) {
    isValid = Mnemonic.validateMnemonic(mnemonic, _wordlist);
  }
  if (!isValid || !foundWordlist) {
    console.warn('Could not verify checksum. Be careful.');
  }
  const seed = Mnemonic.mnemonicToSeedSync(mnemonic);
  const HDNode = Bitcoin.bip32.fromSeed(seed, network);
  return HDNode.derivePath(`${pathHead}${account}'`);
};

export const toBIP44path = (
  mnemonic: string,
  account: number,
  network: Bitcoin.Network = Bitcoin.networks.testnet,
  coinIndex: number = 1,
): Bitcoin.BIP32Interface => {
  return makeAccount(`m/44'/${coinIndex}'/`, mnemonic, account, network);
};

export const HDGetKey = (
  i: number,
  node: Bitcoin.BIP32Interface,
  j: number = 0,
): Bitcoin.ECPairInterface => {
  const result = node.derivePath(j + '/' + i);
  return result.privateKey
    ? Bitcoin.ECPair.fromPrivateKey(result.privateKey)
    : Bitcoin.ECPair.fromPublicKey(result.publicKey);
};

export const getAddress = (keyNode: { publicKey: Buffer }): string =>
  Bitcoin.payments.p2pkh({ pubkey: keyNode.publicKey }).address!;

export { BCrypto, Buffer, Bitcoin as JS, Mnemonic };
