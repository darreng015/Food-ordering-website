let express = require('express');
let app = express();
let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
let dotenv = require('dotenv');
dotenv.config();
let mongoUrl = process.env.mongoUrl;
let bodyParser = require('cors');
let port = process.env.PORT;
let db;

app.use(bodyParser.urlencoded({exteended:true}));
app.use(bodyParser.json());
app.use(cors());

app.get('/',(req,res)=>{
    res.status(200).send('Health ok');
})

MongoClient.connect(mongoUrl,(err,client)=>{
    if(err) console.log('error connecting');;
    db = client.db('');
    app.listen(port,()=>{
        console.log(`Running on port ${port}`);
    })
})