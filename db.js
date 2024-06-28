const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://User:j257hTMGlXCwD0Ab@cluster.s7vldvl.mongodb.net'; 
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectDB() {
    try {
        await client.connect();
        console.log('Veritabanına bağlanıldı');
        return client.db('temizKal'); // Veritabanını döndürün
    } catch (error) {
        console.error('Veritabanına bağlanırken hata:', error);
        throw error;
    }
}

module.exports = connectDB;
