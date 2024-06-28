const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const connectDB = require('../ozelweb-1/db'); // db.js dosyasını dahil edin
const mongoose = require('mongoose');

const app = express();
const secretKey = 'SecretK3y'; // JWT için gizli anahtar

// Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// JWT doğrulama işlevi
function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    if (token == null) return res.redirect('/giris_yap.html');

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.redirect('/giris_yap.html');
        req.user = user;
        next();
    });
}

// Veritabanına doküman eklemek için asenkron işlev
async function insertDocument(data, collectionName) {
    try {
        const db = await connectDB();
        const collection = db.collection(collectionName); // İstediğiniz koleksiyonu burada belirtin
        const result = await collection.insertOne(data);
        console.log('Doküman eklendi:', result.insertedId);
        return result;
    } catch (error) {
        console.error('Doküman eklenirken hata:', error);
        return { error: error };
    }
}

// Temizlikçileri getiren endpoint
app.get('/get-cleaners', async (req, res) => {
    const { konum } = req.query;

    try {
        const db = await connectDB();
        const collection = db.collection('cleaners');
        const cleaners = await collection.find({ konum: new RegExp(`^${konum}`, 'i') }).toArray();
        res.json(cleaners);
    } catch (error) {
        console.error('Temizlikçi ararken hata:', error);
        res.status(500).json({ error: 'Sunucu Hatası' });
    }
});

app.get('/cleaner-profile', async (req, res) => {
    const id = req.query.id;

    try {
        const db = await connectDB();
        const collection = db.collection('cleaners');
        const cleaner = await collection.findOne({ _id: new mongoose.Types.ObjectId(id) });

        if (!cleaner) {
            return res.status(404).json({ error: 'Temizlikçi bulunamadı' });
        }

        const commentsCollection = db.collection('comments');
        const comments = await commentsCollection.find({ cleanerId: id }).toArray();

        res.status(200).json({ cleaner, comments });
    } catch (error) {
        console.error('Profil bilgileri alınırken hata:', error);
        res.status(500).json({ error: 'Sunucu Hatası' });
    }
});

// Kayıt ol endpoint'i
app.post('/kayit_ol', async (req, res) => {
    const { name, email, phone, password, confirm_password } = req.body;
    if (password.length < 8) {
        return res.status(400).json({ error: 'Şifre en az 8 karakter olmalı' });
    } else if (password !== confirm_password) {
        return res.status(400).json({ error: 'Şifreler eşleşmiyor' });
    } else {
        try {
            await insertDocument({ name, email, phone, password }, 'users'); // 'users' koleksiyonunu kullanıyoruz
            res.status(200).json({ success: true });
        } catch (error) {
            console.error('Doküman eklenirken hata:', error);
            res.status(500).json({ error: 'Sunucu Hatası' });
        }
    }
});

// Giriş yap endpoint'i
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const db = await connectDB();
        const collection = db.collection('users'); // 'users' koleksiyonunu kullanıyoruz
        const user = await collection.findOne({ email, password });
        if (user) {
            const token = jwt.sign({ email: user.email }, secretKey, { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true });
            res.status(200).json({ success: true });
        } else {
            return res.status(400).json({ error: 'Kullanıcı adı veya parola hatalı' });
        }
    } catch (error) {
        console.error('Kullanıcı bilgileri alınırken hata:', error);
        res.status(500).json({ error: 'Sunucu Hatası' });
    }
});

// Oturum durumunu kontrol etme endpoint'i
app.get('/check-auth', (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.json({ authenticated: false });

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.json({ authenticated: false });
        res.json({ authenticated: true });
    });
});

// Çıkış yap endpoint'i
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/index.html');
});

// Yorum ekle endpoint'i
app.post('/add_comment', authenticateToken, async (req, res) => {
    const { email, rating, comment } = req.body;

    try {
        const db = await connectDB();
        const collection = db.collection('comments');
        const result = await collection.insertOne({email, rating, comment});
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Yorum eklenirken hata:', error);
        res.status(500).json({ error: 'Sunucu Hatası' });
    }
});

app.listen(3000, () => {
    console.log('Sunucu 3000 portunda çalışıyor');
});

app.post('/randevu_al',async(req,res)=>{
    const {name,phone,email,date,time,message}=req.body;
    const db=await connectDB();
    const collection=db.collection('randevular');
    const result=await collection.insertOne({name,phone,email,date,time,message});
    res.status(200).json({success:true});
});

app.get('/randevular',async(req,res)=>{
    const db=await connectDB();
    const collection=db.collection('randevular');
    const result=await collection.find().toArray();
    res.status(200).json(result);
});
