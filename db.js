// db.js
const { MongoClient } = require('mongodb');

const url = 'mongodb+srv://User:j257hTMGlXCwD0Ab@cluster.s7vldvl.mongodb.net';
const dbName = 'temizKal';
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
