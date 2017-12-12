let express = require('express');
let app = express();
let config = require('./config');

const bodyParser = require('body-parser');
const contract = require('./modules/constract');

app.set('view engine', 'pug');
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
app.use(bodyParser.json({limit: '50mb'}));


// respond with "hello world" when a GET request is made to the homepage
app.get('/', async(req, res) => {
    let events = await contract.getEvents();
    res.render('index', {
        mainContractAddress:config.contract.address,
        contactABI:JSON.stringify(config.contract.ABI),
        tokenABI:JSON.stringify(config.contract.tokenABI),
        event:events
    })
});
app.get('/events/', (req, res) => {

    res.render('events', {
        mainContractAddress:config.contract.address,
        contactABI:JSON.stringify(config.contract.ABI),
        tokenABI:JSON.stringify(config.contract.tokenABI),

    })
});

app.post('/create', (req, res) => {
    res.json(contract.createAccount());
});

app.post('/newToken', (req, res) => {
     console.log(req.body);

        // let account = web3.eth.accounts.create();
     //res.json(account);
 });

app.get('/events/:address', (req, res) => {
    contract.getTokenInfo(req.params.address).then((data)=>{
        res.json({
            success: true,
            data: data
        })
    },(error)=>{
        res.json({success: false, error: error})

    })
        });

app.get('/user/:address', (req, res) => {
    contract.getUserTokens(req.params.address).then((data)=>{
        res.json({success:true,data:data});
    },(error)=>{
        res.json({success:false,error:error});
    });


});


app.listen(3000, () => {
    console.log('App started')
});


