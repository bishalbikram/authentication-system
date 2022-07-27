const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

function createKeyPair() {
    const keys = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096, // bits - standard for RSA Keys
        publicKeyEncoding: {
            type: 'pkcs1', // Public Key Cryptographpy Standards 1
            format: 'pem' //  Most common formatting choice 
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        }
    })

    // Create the private key file
    const pathToPrivateKey = path.join(__dirname, '..', 'privateKey.pem')
    fs.writeFileSync(pathToPrivateKey, keys.privateKey)

    // Create the public key file
    const pathToPublicKey = path.join(__dirname, '..', 'publicKey.pem')
    fs.writeFileSync(pathToPublicKey, keys.publicKey)
}

// Call createKeyPair() to generate public and private key
createKeyPair()