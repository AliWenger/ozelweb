// db.js
const { MongoClient } = require('mongodb');

const url = 'mongodb+srv://susanoglu89:cC38ETNJ3O8Rg4Nw@cluster0.ziv8bgd.mongodb.net/';
const dbName = 'web';
const collectionName='users';
let db;
let collection;

async function connectDB() {
  if (db && collection) {
    return { db , collection};
  }

  try {
    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    db = client.db(dbName);
    collection=db.collection(collectionName);
    console.log('Connected to MongoDB');
    return { db, collection };
  } catch (error) {
    console.error('Could not connect to MongoDB', error);
    throw error;
  }
}

module.exports = connectDB;
