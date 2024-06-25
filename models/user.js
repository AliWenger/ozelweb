const mongoose = require('mongoose');

// Kullanıcı şeması
const CleanerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Kullanıcı modeli oluşturma
const User = mongoose.model('cleaners', CleanerSchema);

module.exports = User;
