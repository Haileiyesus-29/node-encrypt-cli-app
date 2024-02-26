const { Transform } = require('node:stream')
const fs = require('node:fs/promises')

class XOREncrypt extends Transform {
   constructor(key) {
      super()
      this.key = Buffer.from(key, 'binary')
   }

   _transform(chunk, encoding, callback) {
      const encryptedData = Buffer.alloc(chunk.length)

      for (let i = 0; i < chunk.length; i++) {
         encryptedData[i] = chunk[i] ^ this.key[i % this.key.length]
      }

      this.push(encryptedData)
      callback()
   }
}

class XORDecrypt extends Transform {
   constructor(key) {
      super()
      this.key = Buffer.from(key, 'binary')
   }

   _transform(chunk, encoding, callback) {
      const decryptedData = Buffer.alloc(chunk.length)

      for (let i = 0; i < chunk.length; i++) {
         decryptedData[i] = chunk[i] ^ this.key[i % this.key.length]
      }

      this.push(decryptedData)
      callback()
   }
}
async function encrypt(key, input, output) {
   const xorEncrypt = new XOREncrypt(key)
   const inputFile = await fs.open(input, 'r')
   const outputFile = await fs.open(output, 'w')
   const inputStream = inputFile.createReadStream(inputFile)
   const encryptedStream = outputFile.createWriteStream(outputFile)

   inputStream.pipe(xorEncrypt).pipe(encryptedStream)
   inputStream.on('end', () => {
      console.log('Encryption complete')
   })
}
async function decrypt(key, input, output) {
   const xorDecrypt = new XORDecrypt(key)
   const encryptedInput = await fs.open(input, 'r')
   const decryptedFile = await fs.open(output, 'w')
   const encryptedReadStream = encryptedInput.createReadStream()
   const decryptedStream = decryptedFile.createWriteStream()

   encryptedReadStream.pipe(xorDecrypt).pipe(decryptedStream)
   encryptedReadStream.on('end', () => {
      console.log('Decryption complete')
   })
}

module.exports = { encrypt, decrypt }
