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
let authKey = process.env.authKey;
let {getData, getDatawithsort,postData, getDatawithsortlimit} = require('./controller/dbController.js')
 

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());

// function getData(colName,query){
//     if(colName&&query){
//         db.collection(colName).find(query).toArray((err,data)=>{
//             if(err) throw err;
//             return data
//     })
//     }else{
//         return 'Data missing';
//     }
// }

app.get('/',(req,res)=>{
    res.status(200).send('Health ok');
})

app.get('/location', (req, res)=>{
    let key = req.query.key;
    if(key == authKey){
        db.collection('location').find().toArray((err,data)=>{
            if(err) throw err;
            res.status(200).send(data)
    })
    }else{
        res.status(401).send('Not authenticated')
    }
})

app.get('/restaurants', (req, res)=>{
        let query={};
        let stateId = Number(req.query.stateId);
        let mealId = Number(req.query.mealId);
        if(stateId&&mealId){
            query={
                state_id:stateId,
                "mealTypes.mealtype_id":mealId}
        }
        else if(stateId){
            query={state_id:stateId}
        }else if(mealId){
            query={"mealTypes.mealtype_id":mealId}    
        }else{
            query={};
        }
        db.collection('restaurants').find(query).toArray((err,data)=>{
            if(err) throw err;
            res.status(200).send(data)
    })
})

app.get('/meals',async(req,res) => {
    let query = {}
    let collection = 'mealType'
    let output = await getData(db,collection,query)
    res.send(output)
    

})

app.get('/filter/:mealId', async(req,res)=>{
    let query={};
    let collection = 'restaurants';
    let sort = {cost:1};
    let skip = 0;
    let limit = 10000000;
    let mealId = Number(req.params.mealId);
    let cuisineId = Number(req.params.cuisineId);
    let hcost = Number(req.query.hcost);
    let lcost = Number(req.query.lcost);

    if(req.query.skip && req.query.limit){
        skip = Number(req.query.skip);
        limit = Number(req.query.limit)    
    }

    if(req.query.sort){
        sort = {cost:req.query.sort}
    }

    if(cuisineId && hcost && lcost){
        query = {
            "mealTypes.mealtype_id":mealId,
            $and:[{cost:{$gt:lcost,$lt:hcost}}],
            "cuisines.cuisine_id":cuisineId
        }
    }else if(cuisineId){
        query = {
            "mealTypes.mealtype_id":mealId,
            "cuisines.cuisine_id":cuisineId
        }
    }

    let output = await getDatawithsortlimit(db,collection,query,sort,skip,limit);
    res.send(output);
})

app.get('/details/:id',async(req,res)=>{
    let _id = mongo.ObjectId(req.params.id);
    let query = {_id:_id};
    let collection = 'restaurants'
    let output = await getData(db,collection,query)
    res.send(output)
})

app.get('/menu/:id',async(req,res)=>{
    let id = Number(req.params.id);
    let query = {restaurant_id:id};
    let collection = 'menu'
    let output = await getData(db,collection,query)
    res.send(output)
})

app.get('/orders',async(req,res)=>{
    let query = {};
    if(req.query.email){
        query={email:req.query.email};
    }
    let collection = 'orders'
    let output = await getData(db,collection,query)
    res.send(output)
})

//placing order
app.post('/placeOrder', async(req,res)=>{
     let data = req.body;
     let collection = 'orders'
     let response = await postData(db,collection,data);
     res.send(response);
})

//menu dets

app.post('/menuDetails',async(req,res)=>{
    if(Array.isArray(req.body.id)){
        let query = {menu_id:{$in:req.body.id}}
        let collection = 'menu'
        let output = await getData(db,collection,query)
        res.send(output)
    }else{
        res.send('Please pass data as array');
    }
})


MongoClient.connect(mongoUrl,{useNewUrlParser: true},(err,client)=>{
    if(err) console.log('error connecting');;
    db = client.db('orderdb');
    app.listen(port,()=>{
        console.log(`Running on port ${port}`);
    })
})

