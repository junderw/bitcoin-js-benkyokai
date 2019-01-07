# bitcoin-js-benkyokai

[![NPM](http://img.shields.io/npm/v/bitcoin-js-benkyokai.svg)](https://www.npmjs.org/package/bitcoin-js-benkyokai)

## インストール

`npm install bitcoin-js-benkyokai`

## ブラウザでの動作確認

`npm install -g browserify`

`browserify -r bitcoin-js-benkyokai -s bitcoin -o bitcoin.js`

フォルダパスに出来上がる「bitcoin.js」を`<script>`タグの中で読み込めば、下記のオブジェクトが使えます。

```javascript
// オブジェクト
bitcoin.JS       // bitcoinjs-libのオブジェクト
bitcoin.Mnemonic // bip39のニーモニック復元フレーズ
bitcoin.Buffer   // nodejsのBufferオブジェクト
bitcoin.BCrypto  // crypto-browserifyという、nodejsネイティブのCryptoをbrowserifyに最適化したもの

// 関数
/**
 * @param {String} txt - 平文データ
 * @param {String} passwd - 暗号化用のパスワード
 * @param {String} [salt] - 暗号化用のソルト (無い場合："testsalt")
 * @param {Number} [iterations] - pbkdf2を通す回数 (無い場合：8192)
 * @returns {String} 暗号化されたテキスト
 */
bitcoin.encrypt = function (txt, passwd, salt, iterations) {}

/**
 * @param {String} enc - 暗号化データ
 * @param {String} passwd - 複合化用のパスワード
 * @param {String} [salt] - 複合化用のソルト (無い場合："testsalt")
 * @param {Number} [iterations] - pbkdf2を通す回数 (無い場合：8192)
 * @returns {String} 平文データ
 */
bitcoin.decrypt = function (enc, passwd, salt, iterations) {}

/**
 * @param {Object} mnemonic - ニーモニックの文字列
 * @param {Number} [account] - 0から数えるアカウントの番号 (無い場合：0)
 * @returns {Object} ニーモニックをマスタ秘密鍵にし、[m/{account}'] のパスの拡張秘密鍵を
 *                   bitcoin.JS.HDNode のオブジェクトインスタンスとして返す
 */
bitcoin.toBIP32path = function (mnemonic, account) {}

/**
 * @param {Object} mnemonic - ニーモニックの文字列
 * @param {Number} [account] - 0から数えるアカウントの番号 (無い場合：0)
 * @returns {Object} ニーモニックをマスタ秘密鍵にし、[m/44'/0'/{account}'] のパスの拡張秘密鍵を
 *                   bitcore.HDPrivateKey のオブジェクトインスタンスとして返す
 */
bitcoin.toBIP44path = function (mnemonic, account) {}

/**
 * @param {Number} i - 0から数える鍵の索引
 * @param {Object} HDkey - bitcore.HDPrivateKey のオブジェクトインスタンス
 * @param {Number} [j] - 0 = 受取用; 1 = お釣り用 (無い場合：0)
 * @returns {Object} HDkeyをnとし、[n/j/i] のパスから派生した秘密鍵を
 *                   bitcoin.JS.ECKey のオブジェクトインスタンスとして返す
 */
bitcoin.HDGetKey = function (i, HDkey, j) {}

// 使用例
> var m = bitcoin.Mnemonic.generateMnemonic(null, null, bitcoin.Mnemonic.wordlists.japanese)
> var HD = bitcoin.toBIP44path(m)
> var key = bitcoin.HDGetKey(0, HD)
> bitcoin.getAddress(key)
'1BgF7dxrXWwF5WZHhfCGfQ4m5MfQkUWk6D'
> key.toWIF()
'L4pLC1xE2W2LHCxhQeYXGyApFNjzqiAHP37kqFsbu7xQyHYXfaP8'
> m
'えんえん　つけね　しんか　しゃりん　こうえん　ちたい　てんかい　かいさつ　せりふ　すばらしい　うける　けんり'
> localStorage.myWallet = bitcoin.encrypt(m, "password")
'IEz+Qh/q01IspWdr837E3Z/dcgH+FW4DV1J2fEaQzvu8NlymGsyogGdTzyXlKQA3yE3umoqhrsMiqXTQrCH9cZnys1vCLWxseyTOJdus6w1fLl5ap++nSE+xorKd35v+DXuKW1slt79Uu6/RB7RhJQFHMpW4mlTHi5NO5w/c2GHyW4SBOOX6BU6oGlncnWa4mBrGPBVv/C837plWi4wVF4/ohz0g4DmilYpYHATayHk='
> bitcoin.decrypt(localStorage.myWallet, "password")
'えんえん　つけね　しんか　しゃりん　こうえん　ちたい　てんかい　かいさつ　せりふ　すばらしい　うける　けんり'
```

## 免責事項

自己責任でお願いします。

## ライセンス

自由に使って下さい。
