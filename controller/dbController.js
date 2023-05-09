let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
let mongoUrl = process.env.MongoURL;
let db;

function dbconnect(){
    MongoClient.connect(mongoUrl,{useNewUrlParser: true},(err,client)=>{
        if(err) console.log('error connecting');;
        db = client.db('orderdb');
     })
    
}

async function getData(colName,query){
    return await db.collection(colName).find(query).toArray();
}

async function getDatawithsort(colName,query,sort){
    return await db.collection(colName).find(query).sort(sort).toArray();
}

async function getDatawithsortlimit(colName,query,sort,skip,limit){
    return await db.collection(colName).find(query).sort(sort).skip(skip).limit(limit).toArray();
}

async function postData(colName,data){
    return await db.collection(colName).insert(data);
}

async function updateData(colName,condition,data){
    return await db.collection(colName).update(condition,data);
}

async function deleteData(colName,condition){
    return await db.collection(colName).remove(condition);
}
module.exports = {dbconnect ,getData, getDatawithsort, deleteData, getDatawithsortlimit, postData, updateData}