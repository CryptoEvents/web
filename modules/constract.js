//const Web3 = require('web3');
let config = require('../config');
//web3 = new Web3(config.connection);


//const contract = new web3.eth.Contract(config.contract.ABI, config.contract.address);
module.exports = {
    getContract: () => contract,
    createAccount: () => {
//        return web3.eth.accounts.create();

    },
    getTokenBalanceOf: (tokenAddress, userAddress) => {
        console.log(tokenAddress);
        let token = new web3.eth.Contract(config.contract.tokenABI, tokenAddress);
        return token.methods.balanceOf(userAddress).call();

    },
    getTokenInfo: (address) => {
//        let token = new web3.eth.Contract(config.contract.tokenABI, address);

/*        return Promise.all([
            token.methods.totalSupply().call(),
            token.methods.name().call(),
            token.methods.symbol().call(),
        ]).then((data) => {
            return {
                address: address,
                total: data[0],
                name: data[1],
                symbol: data[2],
            }
        })
*/    },
    getEvents: async () => {
        let results = [];
        for (let n = 0; n < 20; n++) {//todo for future normal pagination
            try {
                results.push(await contract.methods.addrevents(n).call());
            } catch (e) {
                break;

            }
        }
        return results;
    },
    getTokensInfo() {
        return this.getEvents().then((events) => {
            return Promise.all(events.map((e) => this.getTokenInfo(e)))
        })
    },
    getUserTokens(userAddress,filerOnlyUserEvents = true) {
        let that = this;
        return that.getTokensInfo().then((data) => {
                let promiseArray = [];
                data.forEach((elm) => {
                    promiseArray.push(this.getTokenBalanceOf(elm.address, userAddress))
                });
                 return Promise.all(promiseArray).then((balances) => {
                    data.forEach((elm, key) => {
                        elm.balance = balances[key];
                    });
                    if (filerOnlyUserEvents){
                        data = data.filter((a)=>+a.balance>0 );
                    }
                    return data;
                })
            },(error)=>{
              console.log(error)
            })
    }
};