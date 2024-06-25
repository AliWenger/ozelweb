const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('../ozelweb-1/db'); // Veritabanı bağlantısı için

const app = express();
const secretKey = 'secretK3y'; // JWT için gizli anahtar

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
async function insertDocument(data) {
    try {
        const { collection } = await connectDB();
        const result = await collection.insertOne(data);
        console.log('Doküman eklendi:', result.insertedId);
        return result;
    } catch (error) {
        console.error('Doküman eklenirken hata:', error);
        return { error: error };
    }
}

// Sunucu 3000 portunda dinleme
app.listen(3000, () => {
    console.log('Sunucu 3000 portunda çalışıyor');
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
            await insertDocument({ name, email, phone, password });
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
        const user = await findUserInformation(email, password);
        if (user && user.email === email && user.password === password) {
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

async function findUserInformation(email, password) {
    try {
        const { collection } = await connectDB();
        const result = await collection.findOne({ email, password });
        return result;
    } catch (err) {
        console.error('Kullanıcı bilgileri alınırken hata:', err);
        return null;
    }
}

// Profil sayfası endpoint'i
app.get('/profil', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'profil.html')); 
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
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ loggedOut: true });
});
