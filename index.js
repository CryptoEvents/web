let express = require('express');
let app = express();
let config = require('./config');

const bodyParser = require('body-parser');
const contract = require('./modules/constract');

app.set('view engine', 'pug');
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
app.use(bodyParser.json({limit: '50mb'}));

var fs = require("fs");

// respond with "hello world" when a GET request is made to the homepage
app.get('/', async(req, res) => {
    let events = await contract.getTokensInfo();
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
        tokenABI:JSON.stringify(config.contract.tokenABI)
    })
});

app.get('/admin/', async (req, res) => {
    let events = await contract.getTokensInfo();
    res.render('admin', {
        mainContractAddress:config.contract.address,
        contactABI:JSON.stringify(config.contract.ABI),
        tokenABI:JSON.stringify(config.contract.tokenABI),
        event:events
    })
});
app.get('/owner/:address',async (req, res) => {
    let events = await contract.getTokensOwner(req.params.address);
    res.render('owner', {
        mainContractAddress:config.contract.address,
        contactABI:JSON.stringify(config.contract.ABI),
        tokenABI:JSON.stringify(config.contract.tokenABI),
        event:events
    })
});

app.get('/user/:address',async (req, res) => {
    let tokens = await contract.getUserTokens(req.params.address);
    res.render('user', {
        mainContractAddress:config.contract.address,
        contactABI:JSON.stringify(config.contract.ABI),
        tokenABI:JSON.stringify(config.contract.tokenABI),
        tokens:tokens
    })
});
app.post('/create', (req, res) => {
    res.json(contract.createAccount());
});

app.post('/join', (req, res) => {
    fs.appendFileSync("tmp/"+req.body.tokenAddress, req.body.name+'::'+req.body.address+'::need\n');
    res.json({
        success: "Thank You"
    })
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

app.get('/whois/:address', (req, res) => {
    contract.getContractOwner(req.params.address).then((data)=>{
        if (data==false) {
            contract.getTokensOwner(req.params.address).then((data) => {
                if (data.length==0) {
                    contract.getUserTokens(req.params.address).then((data) => {
                        if (data.length==0) res.json({type: 'notuser', data: data});
                        else  res.json({type: 'user', data: data});
                    }, (error) => {
                        res.json({type: 'errorUT', error: error});
                    });
                } else res.json({type: 'owner', data: data});
            }, (error) => {
                console.log(error);
                res.json({type: 'errorTO', error: error});
            });
        }else res.json({type:'superowner',data:data});
    },(error)=>{
            res.json({type:'errorSO',error:error});
    });

});


app.listen(3000, () => {
    console.log('App started')
});


