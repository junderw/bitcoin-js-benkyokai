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
bitcoin          // bitcoinjs-libのオブジェクト
bitcoin.Mnemonic // bitcore-mnemonicのニーモニック復元フレーズ
bitcoin.Buffer   // nodejsのBufferオブジェクト
bitcoin.Crypto   // crypto-browserifyという、nodejsネイティブのCryptoをbrowserifyに最適化したもの

// 関数
/**
 * @param {String} txt - 平文データ
 * @param {String} passwd - 暗号化用のパスワード
 * @param {String} [salt] - 暗号化用のソルト
 * @param {Number} [iterations] - pbkdf2を通す回数
 * @returns {String} 暗号化されたテキスト
 */
bitcoin.encrypt = function (txt, passwd, salt, iterations)
/**
 * @param {String} enc - 暗号化データ
 * @param {String} passwd - 複合化用のパスワード
 * @param {String} [salt] - 複合化用のソルト
 * @param {Number} [iterations] - pbkdf2を通す回数
 * @returns {String} 平文データ
 */
bitcoin.decrypt = function (enc, passwd, salt, iterations)

// 使用例
> var m = bitcoin.Mnemonic(bitcoin.Mnemonic.Words.JAPANESE)
undefined
> var HD = m.toBIP44(2)
undefined
> var key = HD.getKey(0)
undefined
> key.pub.getAddress().toString()
'1MCSPLE4UGQVwL8sgdyxUrp1cZqE9biHTL'
> key.toWIF()
'L2gQNC4jefQkT65mgDWE3ciDtEaDUMiUviYTk3iuWhxJLEW1SrRn'
> m.phrase
'ちょさくけん　たたかう　くかん　おいつく　とおす　したうけ　しまる　さんいん　きおち　らくご　さいてき　せんさい'
> localStorage.myWallet = bitcoin.encrypt(m.phrase, "password")
'eeFtfckMiOI5RQLR/l00jn7g6hwEDIBM/AEdjuEWFn6ofEWXpWdepYFAGVlEBVJT/CbaM529cmsqAiWbkt4Y7/SJf+xNfI+sFlJiIDbmMRpOFmL7J582r4TTjpDCDjw0IoTx7nwl6+NxFdMSx3XALjmKCuaHA02tRPt2ofcbvHoqdTU9VtlpIGFUf6HmwwfsaBMlDn2T9Oqufoa92i6uQjmIljeYR8eS0oZV'
> bitcoin.decrypt(localStorage.myWallet, "password")
'ちょさくけん　たたかう　くかん　おいつく　とおす　したうけ　しまる　さんいん　きおち　らくご　さいてき　せんさい'
```

## 免責事項

自己責任でお願いします。

## ライセンス

自由に使って下さい。
