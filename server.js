const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('../ozelweb/db'); // Veritabanı bağlantısı için

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



document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const autocompleteList = document.getElementById('autocompleteList');
    const searchButton = document.querySelector('.aramaButonu .fas.fa-search');

    // Statik konum listesi (gerçek bir uygulamada bu listeyi bir API'den alabilirsiniz)
    const locations = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep', 'Kayseri', 'Mersin'];

    // Arama kutusuna yazdıkça önerileri gösteren fonksiyon
    searchInput.addEventListener('input', () => {
        const input = searchInput.value.toLowerCase();
        autocompleteList.innerHTML = '';
        if (input) {
            const suggestions = locations.filter(location => location.toLowerCase().includes(input));
            suggestions.forEach(suggestion => {
                const div = document.createElement('div');
                div.classList.add('autocomplete-suggestion');
                div.textContent = suggestion;
                div.addEventListener('click', () => {
                    searchInput.value = suggestion;
                    autocompleteList.innerHTML = '';
                });
                autocompleteList.appendChild(div);
            });
        }
    });

    // Arama butonuna tıklanınca seçilen konumu işleyen fonksiyon
    searchButton.addEventListener('click', () => {
        const selectedLocation = searchInput.value;
        if (locations.includes(selectedLocation)) {
            alert(`Arama yapılıyor: ${selectedLocation}`);
            // Burada arama işlemini gerçekleştirebilirsiniz
            // Örneğin, bir API çağrısı yaparak veya sayfayı yeniden yönlendirerek
        } else {
            alert('Lütfen geçerli bir konum seçiniz.');
        }
    });

    // Sayfa dışında tıklanınca önerileri gizleyen fonksiyon
    document.addEventListener('click', (event) => {
        if (!searchInput.contains(event.target)) {
            autocompleteList.innerHTML = '';
        }
    });
});