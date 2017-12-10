const Web3 = require('web3');
let config = require('../config');
web3 = new Web3(config.connection);


let contract = new web3.eth.Contract(config.contract.ABI, config.contract.address);

module.exports = {
    getContract:()=>contract,
    createAccount:()=>{
        return web3.eth.accounts.create();

    },
    getTokenInfo:(address)=>{
        let token = new web3.eth.Contract(config.contract.tokenABI,address);

       return Promise.all([
            token.methods.totalSupply().call(),
            token.methods.name().call(),
            token.methods.symbol().call(),
        ]).then((data) => {
            return {
                total: data[0],
                name: data[1],
                symbol: data[2],
            }

        })
    }
};