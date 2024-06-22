const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// MongoDB bağlantısı
mongoose.connect('mongodb+srv://User:j257hTMGlXCwD0Ab@cluster.s7vldvl.mongodb.net/temizKal', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Kullanıcı modeli
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    password: String
});

const Cleaners = mongoose.model('Cleaners', userSchema);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));


// Kayıt rotası
app.post('/signup', async (req, res) => {
    const { name, email, phone, password } = req.body;

    try {
        const newUser = new Cleaners({ name, email, phone, password});
        await newUser.save();
        res.status(201).send({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send({ message: 'An error occurred while creating the user' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
