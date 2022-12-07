const express = require('express');
const app = express();
const PORT=   process.env.PORT ||8000; 
var request = require('request');
var multer = require('multer');
var upload = multer();
const bodyParser = require('body-parser');
const { link } = require('fs');
const open = require('open');
const mongoose = require('mongoose');

app.use('/public',express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+ '/public'));
app.set('view engine','ejs');
app.use(upload.array());

// my code 



const DB = 'mongodb+srv://CryptoDash:MernProject@cluster0.mbsih5y.mongodb.net/userdata?retryWrites=true&w=majority';

mongoose.connect(DB).then(()=>{
    console.log('successfully connected')
}).catch((err)=>{
    console.log(err);
});
var db = mongoose.connection;


app.post('/sign_up',function(req,res){
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    var data = {
        "name" : name,
        "email" : email,
        "password" : password
    }

    db.collection('user-info').insertOne(data,function(err,collection){
        if(err) throw err;
        console.log("Record inserted successfully");
    });

    return res.redirect('/public/assests/homepage/success.html');

});



let mData = "";
let coinName = "bitcoin";
let mChart = "";

async function resData(coinName){
    var marketData =  await new Promise((resolve,reject)=>{
request('https://api.coingecko.com/api/v3/coins/' +coinName, function (error, response, body) {
  console.error('error:', error); 
  console.log('statusCode:', response && response.statusCode); 
  console.log('body' ,typeof body);
    mData = JSON.parse(body)

    resolve(mData);

});
})
if(marketData){
var marketChart =  await new Promise((resolve,reject)=>{
    request('https://api.coingecko.com/api/v3/coins/'+ coinName + '/market_chart?vs_currency=usd&days=30' +coinName, function (error, response, body) {
      console.error('error:', error); 
      console.log('statusCode:', response && response.statusCode); 
      console.log('body' ,typeof body);
        mChart = JSON.parse(body)
       
        resolve(mData);
    });
})
}
}

app.get('/', async( req ,res)=>{
   await resData(coinName);
    res.render('index',{mData,mChart,coinName})
})

// Getting form data to backend
app.post('/',async(req,res)=>{
    coinName = req.body.selectCoin;
   await resData(coinName);
    res.render('index',{mData,mChart,coinName})
})


app.listen(PORT,()=>{
    open(`http://localhost:${PORT}/public/assests/homepage/index.html`);
});

