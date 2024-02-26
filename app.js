const readline = require('readline')
const { encrypt, decrypt } = require('./module')

const rl = readline.createInterface({
   input: process.stdin,
   output: process.stdout,
})

function startApp() {
   let key = ''
   let input = ''
   let output = ''

   console.log(`
   Welcome to the XOR Encryptor/Decryptor
      1. Encrypt
      2. Decrypt
      3. Exit
   please select an option...
   `)

   rl.question('Enter 1 to continue, enter 2 to exit: ', inpt => {
      const answer = inpt.trim()
      if (answer === '1') {
         rl.question('Enter the key: ', answer => {
            key = answer
            rl.question('Enter the file name: ', answer => {
               input = answer
               output = `${answer}.enc`
               encrypt(key, input, output)
               startApp()
            })
         })
      } else if (answer === '2') {
         rl.question('Enter the key: ', answer => {
            key = answer
            rl.question('Enter the file to be: ', answer => {
               input = answer
               const output = input.replace('.enc', '')
               decrypt(key, input, output)
               startApp()
            })
         })
      } else {
         rl.close()
      }
   })
}
startApp()
