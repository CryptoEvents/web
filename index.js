let express = require('express');
let app = express();
let config = require('./config');
const Web3 = require('web3');
web3 = new Web3(config.connection);


let contract = new web3.eth.Contract(config.contract.ABI, config.contract.address);

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
    res.send('hello world')
});

app.post('/create', (req, res) => {
    let account = web3.eth.accounts.create();
    res.json(account);
});

app.post('/newToken', (req, res) => {

    let account = web3.eth.accounts.create();
    res.json(account);
});

app.get('/events/:address', (req, res) => {
    let token = new web3.eth.Contract(config.contract.tokenABI, req.params.address);

    Promise.all([
        token.methods.totalSupply.call(),
        token.methods.name.call(),
        token.methods.tokenSumbol.call(),
    ]).then((data) => {
        res.json({
            success: true,
            data: {
                total: data[0],
                name: data[1],
                sumbol: data[2],
            }
        })

    }, (error) => {
        res.json({success: false, error: error})
    })});

app.get('/user/:address', (req, res) => {


});

app.get('/events', async () => {
    console.log(contract);
    let events = await contract.methods.smartEvents.call();

});


app.listen(3000, () => {
    console.log('App started')
});


