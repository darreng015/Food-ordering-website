let express = require('express');
let app = express();
let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
let dotenv = require('dotenv');
dotenv.config();
let mongoUrl = process.env.MongoURL;
let bodyParser = require('body-parser');
let cors = require('cors');
let port = process.env.PORT;
let db;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());

app.get('/',(req,res)=>{
    res.status(200).send('Health ok');
})

MongoClient.connect(mongoUrl,{useNewUrlParser: true},(err,client)=>{
    if(err) console.log('error connecting');;
    db = client.db('orderdb');
    app.listen(port,()=>{
        console.log(`Running on port ${port}`);
    })
})