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
        this.generateTestKeys();
    },
    generateTestKeys: function() {
        var options = {
            userIds: [ user_1 ], // multiple user IDs
            numBits: 2048   // default was 4096        // RSA key size
            // passphrase: 'super long and hard to guess secret'         // protects the private key
        };

        openpgp.generateKey(options).then(function(key) {
            u1_privKey = key.privateKeyArmored;
            u1_pubKey = key.publicKeyArmored;
            console.log("Done generating key for user 1"); //: ", u1_privKey, u1_pubKey);
        });

        openpgp.generateKey(options).then(function(key) {
            u2_privKey = key.privateKeyArmored;
            u2_pubKey = key.publicKeyArmored;
            console.log("Done generating key for user 2"); // : ", u2_privKey, u2_pubKey);
        });
    },


    encrypt: function(message, senderPrivateKey, receiverPublicKey) {
        console.log("inside encrypt promise");

        options = {
            data: message,                             // input as String (or Uint8Array)
            publicKeys: openpgp.key.readArmored(receiverPublicKey).keys,  // for encryption
            privateKeys: openpgp.key.readArmored(senderPrivateKey).keys // for signing (optional)
        };

        return openpgp.encrypt(options); // returns a promise.. pass callback to receive encrypted Message, this.encrypt.then( (encryptedMessage) => ?? do stuff )
    },

    logWithMessage: function(message) {
        // return a function ready to take one thing and log it (with a predefined message), then pass it on.
        return (function logMe(thingToLog) {
            console.log("------------------\n" + message, "\n" , thingToLog, "\n----------------");
            return thingToLog;
        });
    },

    decryptWithKeys: function(publicSenderKey, privateReceiverKey) {
        // return a function taking just the message as an arg, with the key variables bound. (good for chaining. see testEncryptAndDecryptMessage)
        return (function decryptMessage(message) {
            let options2 = {
                message: openpgp.message.readArmored(message),     // parse armored message
                publicKeys: openpgp.key.readArmored(publicSenderKey).keys,    // for verification (optional)
                privateKey: openpgp.key.readArmored(privateReceiverKey).keys[0] // for decryption
            };

            return openpgp.decrypt(options2); // returns a promise.. pass callback to receive encrypted Message, this.decrypt.then( (decryptedMessage) => ?? do stuff )
        });
    },

    testEncryptAndDecryptMessage: function() {
        let message = document.getElementById("sendMe").value;

        this.encrypt(message, u1_privKey, u2_pubKey)
            .then(this.logWithMessage("Encrypted message (object) is: "))
            .then( message => message.data )  // transform, because the next method needs just the data
            .then(this.logWithMessage("Just the encrypted data: "))
            // Later, do sending logic here..  then receive and decrypt in another function
            .then(this.decryptWithKeys(u1_pubKey, u2_privKey)) // return a new one arg function that only takes last parameter of .decrypt()
            .then(this.logWithMessage("Decrypted message (object) is: "))
            .then(message => message.data)
            .then(this.logWithMessage("Just the decrypted data: "));

    },

    render: function() {
        return (
            <div>
                <h4>Encryption test</h4>
                <input id="sendMe" />
                <button onClick={ this.testEncryptAndDecryptMessage }>Send</button>
            </div>
        );
    }
});

module.exports = CryptoTest;
