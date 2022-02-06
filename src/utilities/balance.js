module.exports = function(address, blockchain) {
    let balance = 0
    for (let i = 0; i < blockchain.chain.length; i++) {
    if (blockchain.chain[i].sender == address) {
      balance -= blockchain.chain[i].amount
    }
    if (blockchain.chain[i].recipient == address) {
      balance += blockchain.chain[i].amount
    }
  }

  return balance
}