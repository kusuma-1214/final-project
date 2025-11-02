// server/models/Account.js
const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
    accountHolder: {
        type: String,
        required: true,
    },
    accountNumber: {
        type: String,
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        default: 0,
        min: 0 // Prevents balance from being saved below zero
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Account', AccountSchema);
