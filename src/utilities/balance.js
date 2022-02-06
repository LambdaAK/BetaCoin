module.exports = function(address, blockchain) {
    let balance = 0
    for (let i = 0; i < blockchain.chain.length; i++) {
      for (let j = 0; j < blockchain.chain[i].transactions.length; j++) {
        if (blockchain.chain[i].transactions[j].sender == address) {
          balance -= blockchain.chain[i].transactions[j].amount
        }
        if (blockchain.chain[i].transactions[j].recipient == address) {
          balance += blockchain.chain[i].transactions[j].amount
        }
      }
  }

  return balance
}