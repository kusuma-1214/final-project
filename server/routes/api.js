// server/routes/api.js
const express = require('express');
const Account = require('../models/Account'); 
const router = express.Router();

// GET account balance
router.get('/balance/:accountNumber', async (req, res) => {
    try {
        const account = await Account.findOne({ accountNumber: req.params.accountNumber });
        if (!account) {
            return res.status(404).json({ msg: 'Account not found.' });
        }
        res.json({ balance: account.balance.toFixed(2) });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// --- DEPOSIT Route ---
router.post('/deposit', async (req, res) => {
    const { accountNumber, amount } = req.body;
    const depositAmount = parseFloat(amount);

    if (isNaN(depositAmount) || depositAmount <= 0) {
        return res.status(400).json({ msg: 'Deposit amount must be a positive number.' });
    }

    try {
        const account = await Account.findOne({ accountNumber });

        if (!account) {
            return res.status(404).json({ msg: 'Account not found.' });
        }

        // Update the balance
        account.balance += depositAmount;
        await account.save();

        res.json({
            msg: `Deposit of $${depositAmount.toFixed(2)} successful.`,
            newBalance: account.balance.toFixed(2)
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- WITHDRAWAL Route ---
router.post('/withdraw', async (req, res) => {
    const { accountNumber, amount } = req.body;
    const withdrawalAmount = parseFloat(amount);

    if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
        return res.status(400).json({ msg: 'Withdrawal amount must be a positive number.' });
    }

    try {
        const account = await Account.findOne({ accountNumber });

        if (!account) {
            return res.status(404).json({ msg: 'Account not found.' });
        }

        if (account.balance < withdrawalAmount) {
            return res.status(400).json({ msg: 'Insufficient funds.' });
        }

        // Update the balance
        account.balance -= withdrawalAmount;
        await account.save();

        res.json({
            msg: `Withdrawal of $${withdrawalAmount.toFixed(2)} successful.`,
            newBalance: account.balance.toFixed(2)
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
