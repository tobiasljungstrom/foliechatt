var openpgp = require('openpgp');

var CryptoHelper = function CryptoHelper() {
    const self = this;
    this.privateKey = null;
    this.publicKey = null;

    generateKeys();

    function generateKeys() {
        let options = {
            userIds: {}, // multiple user IDs
            numBits: 2048   // default was 4096        // RSA key size
        };

        return openpgp.generateKey(options).then(function (key) {
            console.log("generated key pair: ", key)
            self.privateKey = key.privateKeyArmored;
            self.publicKey = key.publicKeyArmored;
            console.log("keys are ready to use");
        });
    }

    this.encrypt = function(message, receiverPublicKey) {
        /*console.log("inside encrypt promise, receiver key is: ", receiverPublicKey);
        console.log("inside encrypt promise, sender key is: ", self.privateKey);*/
        options = {
            data: message,                             // input as String (or Uint8Array)
            publicKeys: openpgp.key.readArmored(receiverPublicKey).keys,  // for encryption
            privateKeys: openpgp.key.readArmored(self.privateKey).keys // for signing (optional)
        };

        return openpgp.encrypt(options); // returns a promise.. pass callback to receive encrypted Message, this.encrypt.then( (encryptedMessage) => ?? do stuff )
    };

    this.decryptWithSenderKey = function(message, publicSenderKey) {
        let options = {
            message: openpgp.message.readArmored(message),     // parse armored message
            publicKeys: openpgp.key.readArmored(publicSenderKey).keys,    // for verification (optional)
            privateKey: openpgp.key.readArmored(self.privateKey).keys[0] // for decryption
        };
        return openpgp.decrypt(options); // returns a promise.. pass callback to receive encrypted Message, this.decrypt.then( (decryptedMessage) => ?? do stuff )
    };

    this.publicKeyPromise = function() {
        if(self.publicKey) {
            return Promise.resolve(self.publicKey)
        } else {
            return new Promise(function(resolve, reject) {
                setTimeout( function() {
                    resolve( self.publicKeyPromise() );
                }, 100);
            });
        }
    }
}

module.exports = CryptoHelper;