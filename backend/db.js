const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const ObjectID = mongo.ObjectID;

const dbname = "stackhack";
// const url = "mongodb://localhost:27017";
const url = "mongodb+srv://nikhil:99father99@cluster0-extkv.mongodb.net/test?retryWrites=true&w=majority" //upload your database url here
const mongoOptions = {useNewUrlParser: true, useUnifiedTopology: true};

const state = {
    db: null
}

function connect(cb){
    if(state.db){
        cb();
    }
    else{
        MongoClient.connect(url, mongoOptions, (err, client) => {
            if(err){
                cb(err);
            }
            else{
                state.db = client.db(dbname);
                cb();
            }
        });
    }
}

const getPrimaryKey = (_id) => {
    return ObjectID(_id);
}

const getDB = () => {
    return state.db;
}

module.exports = {getDB, getPrimaryKey, connect};