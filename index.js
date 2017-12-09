let express = require('express');
let app = express();
let config = require('./config');
const Web3 = require('web3');
web3 = new Web3(config.connection);

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
    res.send('hello world')
});

app.get('/create', function (req, res) {
    let account = web3.eth.accounts.create();

    res.json(account);
});

app.listen(3000);