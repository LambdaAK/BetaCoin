/*
BetaCoin

Private Key -> sha256 -> Public Key

*/










const express = require('express')
const sha = require('crypto-js/sha256')
const app = express()
const port = 3000
/*
private: f3e66e6f9f2919c19f2694de3b9adf3dd4dd14fefa91ba68d7cb8f83c374d67e 
public: 71a788b2da3b4c290d3b91e330ed5582221f24f2d95b2e8f0967928df51b4b5a
*/
const balance = require('./utilities/balance')

const companyPublic = '849b0e3127213311af8d65cfcee44e429484e6f33bd9b6774eb0548cc5164e7e'
// be1ddc6ef78646ac9fbbe2e6d4af8e6ee993d77fed22bb79fc53178381276812

//http://localhost:3000/send?sender=be1ddc6ef78646ac9fbbe2e6d4af8e6ee993d77fed22bb79fc53178381276812&recipient=24624624724&amount=5
// private key is a random number
// public key is the hash of the private key

class Transaction {
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
  }

}

class Block {
  // contains the following data
  // transactions
  // timestamp
  // hash
  // previousHash

  /**
   * @param {Transaction[]} transactions 
   * @param {string} previousHash 
   * @param {number} index 
   */
  constructor (transactions, previousHash, index) {
    this.timestamp = Date.now()
    this.transactions = transactions
    this.previousHash = previousHash
    this.hash = this.calculateHash()
    this.index = index
  }

  calculateHash() {
    /*
    the index, hash of the last block, the timestamp, and the transactions
    all affect the hash of the block, making any small change to the data a dramatic change in the block's hash 
    */
    return sha(this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions)).toString()
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
  pending = null // pending transactions

  constructor() {
    this.chain = []
    this.createGenesisBlock()
    this.pending = []


    setInterval(() => {
      this.coinbase(companyPublic)
    }, 10000)

    setInterval(() => {
      this.mine()
    }, 20000)
  }

  createGenesisBlock() {
    this.firstCoinBaseTransaction = new Transaction('CoinBase', companyPublic, 10)
    this.genesisBlock = new Block([this.firstCoinBaseTransaction], '0', 0)
    this.chain.push(this.genesisBlock)
  }

  addBlock(block) {
    this.chain.push(block)
  }

  coinbase(address) {
    const coinbase = new Transaction('CoinBase', address, 10)
    this.addPendingTransaction(coinbase)
  }

  addPendingTransaction(transaction) {
    this.pending.push(transaction)
  }

  mine() {
    const block = new Block(this.pending /*transactions*/, this.chain[this.chain.length - 1].hash /*prev hash*/, this.chain.length /*new index*/)
    this.addBlock(block)
    this.pending = []
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
  if (req.query.sender == "CoinBase") {
    req.send('invalid sender')
    return
  }
  const sender = new KeyPair(req.query.sender)
  // check if sender has enough balance
  if (balance(sha(req.query.privateKey), blockchain) < req.query.amount) {
    res.send('insufficient balance')
    console.log('insufficient balance')
    return
  }

  
  const recipient = req.query.recipient
  const transaction = new Transaction(sender.getPublic(), recipient, Number(req.query.amount))
  blockchain.addPendingTransaction(transaction)
  console.log('pending transaction: ' + JSON.stringify(transaction))
  res.send('transaction pending')
})

app.get('/balance', (req, res) => {
  const bal = balance(req.query.address, blockchain)
  res.send('balance: ' + bal)
})

app.get('/', (req, res) => {
  let representation = ''
  for (let i = 0; i < blockchain.chain.length; i++) {
    // make a formatted string
    representation += `Block ${i}: ${blockchain.chain[i].sender} -> ${blockchain.chain[i].recipient} : ${blockchain.chain[i].amount}`
    // add a new line
    representation += '\n'
  }
  res.send(blockchain.chain) // change later to send the representation
})


app.listen(port, () => {})


