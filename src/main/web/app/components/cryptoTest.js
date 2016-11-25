var React = require('react');
var openpgp = require('openpgp');
var user_1 = {userName: "erik"};
var user_2 = {userName: "perra"};

var u1_privKey = null;
var u1_pubKey = null;
var u2_privKey = null;
var u2_pubKey = null;


var CryptoTest = React.createClass({


    componentWillMount: function() {
        console.log("in component will mount");
        // web/node_modules/openpgp/src/worker/worker.js
        const passPhrase = Math.random() * (Math.random() * 1000000000);
        // ./../../node_modules/openpgp/dist/
        // { path:'openpgp.worker.js' }
        /*openpgp.initWorker() // set the relative web worker path
        openpgp.config.aead_protect = true // activate fast AES-GCM mode (not yet OpenPGP standard)
*/
        var options = {
            userIds: [ user_1 ], // multiple user IDs
            numBits: 2048   // default was 4096        // RSA key size
            // passphrase: 'super long and hard to guess secret'         // protects the private key
        };

        openpgp.generateKey(options).then(function(key) {
            u1_privKey = key.privateKeyArmored;
            u1_pubKey = key.publicKeyArmored;
            console.log("generating key: ", u1_privKey, u1_pubKey);
        });



    },

    getPubPrivKey: function(user) {
        const passPhrase = Math.random() * (Math.random() * 1000000000);
        openpgp.initWorker({ path:'openpgp.worker.js' }) // set the relative web worker path
        openpgp.config.aead_protect = true // activate fast AES-GCM mode (not yet OpenPGP standard)

        var options = {
            userIds: [ user ], // multiple user IDs
            numBits: 4096,                                            // RSA key size
            passphrase: 'super long and hard to guess secret'         // protects the private key
        };


        openpgp.generateKey(options).then(this.log("my message")).then(this.encrypt).then(mySendFunction)

       /* openpgp.generateKey(options).then(function(key) {
            u1_privKey = key.privateKeyArmored; // '-----BEGIN PGP PRIVATE KEY BLOCK ... '
            u1_pubKey = key.publicKeyArmored;   // '-----BEGIN PGP PUBLIC KEY BLOCK ... '
        });*/

    },

    encrypt: function(message, callback) {
        console.log("inside encrypt promise");

        options = {
            data: message,                             // input as String (or Uint8Array)
            publicKeys: openpgp.key.readArmored(u1_pubKey).keys,  // for encryption
            privateKeys: openpgp.key.readArmored(u1_privKey).keys, // for signing (optional)
        };

        openpgp.encrypt(options).then( function(cipherText) {
            callback(cipherText);
        });

        /*.then(function(ciphertext) {
            sendCallback(ciphertext.data);// '-----BEGIN PGP MESSAGE ... END PGP MESSAGE-----'
        });*/

    },

    log: function(message) {
        return (function(thingToLog) {
            console.log(message, thingToLog);
        });
    },
    decrypt: function(message) {
        options = {
            message: openpgp.message.readArmored(message),     // parse armored message
            publicKeys: openpgp.key.readArmored(u1_pubKey).keys,    // for verification (optional)
            privateKey: openpgp.key.readArmored(u1_privKey).keys[0] // for decryption
        };

        openpgp.decrypt(options).then(function(plaintext) {
            console.log("inside decrypt callback. plaintext is: ", plaintext);
            //return plaintext.data; // 'Hello, World!'
        });
    },

    sendMessage: function() {
        let message = document.getElementById("sendMe").value;
        let decryptFunc = this.decrypt;

        this.encrypt(message, function(encryptedText) {

            console.log("encrypted message is ",encryptedText.data);
            decryptFunc(encryptedText.data);

        });



    },

    render: function() {
        return (
            <div>
                <input id="sendMe" />
                <button onClick={ this.sendMessage }>Send</button>
            </div>
        );
    }
});

module.exports = CryptoTest;
