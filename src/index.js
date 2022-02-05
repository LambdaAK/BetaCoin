const express = require('express')
const sha = require('crypto-js/sha256')
const app = express()
const port = 3000

const companyPublic = '849b0e3127213311af8d65cfcee44e429484e6f33bd9b6774eb0548cc5164e7e'
// be1ddc6ef78646ac9fbbe2e6d4af8e6ee993d77fed22bb79fc53178381276812

//http://localhost:3000/send?sender=be1ddc6ef78646ac9fbbe2e6d4af8e6ee993d77fed22bb79fc53178381276812&recipient=24624624724&amount=5
// private key is a random number
// public key is the hash of the private key

class Block {
  // contains the following data
  // sender, recipient, amount, timestamp
  /**
   * @param {string} sender 
   * @param {string} recipient 
   * @param {number} amount 
   */
  constructor(sender, recipient, amount) {
    this.timestamp = Date.now()
    this.sender = sender
    this.recipient = recipient
    this.amount = amount
    this.next = null
  }
}



class Blockchain {
  // each block contains one transaction
  // each transaction will have three pieces of data. The sender, recipient, and the amount
  // the sender will be the public key of the sender
  // the recipient will be the public key of the recipient
  // the amount will be the amount of the transaction
  // the timestamp will be the time the transaction was created
  // the next will be null

  // whenever the sender is CoinBase, the crypto is generated out of thin air
  genesisBlock = null
  chain = null
  constructor() {
    this.chain = []
    this.createGenesisBlock()
    

  }

  createGenesisBlock() {
    this.genesisBlock = new Block('CoinBase', companyPublic, 10)
    this.chain.push(this.genesisBlock)
  }

  addBlock(block) {
    this.chain.push(block)
  }

}


class KeyPair {
  privateKey
  publicKey
  constructor(privateKey) {
    if (privateKey != undefined) this.privateKey = privateKey
    else this.privateKey = sha(Math.random().toString()).toString()
    this.publicKey = sha(this.privateKey).toString()
  }

  getPrivate() {
    return this.privateKey
  }

  getPublic() {
    return sha(this.publicKey).toString()
  }
}


const blockchain = new Blockchain()

app.get('/pair', (req, res) => {
  const pair = new KeyPair()
  res.send('private: ' + pair.privateKey + '\npublic: ' + pair.publicKey)

})

app.get('/send', (req, res) => {
  console.log(req.query.sender)
  console.log(req.query.recipient)
  console.log(req.query.amount)
  if (req.query.sender == "CoinBase") {
    req.send('invalid sender')
    return
  }
  const sender = new KeyPair(req.query.sender) 
  const recipient = req.query.recipient
  const block = new Block(sender.getPublic(), recipient, req.query.amount)
  blockchain.addBlock(block)
  res.send('block added')


})

app.get('/', (req, res) => {
  let representation = ''
  for (let i = 0; i < blockchain.chain.length; i++) {
    // make a formatted string
    representation += `Block ${i}: ${blockchain.chain[i].sender} -> ${blockchain.chain[i].recipient} : ${blockchain.chain[i].amount}` + "\n"
  }
  res.send(representation)
})


app.listen(port, () => {})
