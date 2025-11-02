// client/src/Banking.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// The API calls will automatically be proxied to http://localhost:5000/api
// thanks to the "proxy" setting in client/package.json
const ACCOUNT_NUMBER = '123456'; 

function Banking() {
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [message, setMessage] = useState('');

  // Function to fetch the initial/current balance
  const fetchBalance = async () => {
    try {
        const res = await axios.get(`/api/balance/${ACCOUNT_NUMBER}`);
        setBalance(res.data.balance);
    } catch (error) {
        console.error("Failed to fetch balance:", error);
        setMessage("Error loading account data.");
        setBalance("N/A");
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []); // Run only once on component mount

  // Function to handle deposit or withdrawal
  const handleTransaction = async (type) => {
    if (!amount || parseFloat(amount) <= 0) {
        setMessage("Error: Please enter a valid positive amount.");
        return;
    }

    try {
      setMessage(`Processing ${type}...`);
      const response = await axios.post(`/api/${type}`, {
        accountNumber: ACCOUNT_NUMBER,
        amount: amount,
      });

      // Update state with response data
      setBalance(response.data.newBalance);
      setMessage(response.data.msg);
      setAmount(''); // Clear input

    } catch (error) {
      const msg = error.response ? error.response.data.msg : 'An unexpected error occurred.';
      setMessage(`Error: ${msg}`);
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '450px', margin: '50px auto', border: '2px solid #333', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
      <h1>🏦 MERN Simple Banking App</h1>
      <p style={{ fontSize: '1.2em', margin: '20px 0' }}>Account Balance: **${balance}**</p>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Account (Fixed for demo):</label>
        <input
          type="text"
          value={ACCOUNT_NUMBER}
          readOnly
          style={{ width: '100%', padding: '10px', boxSizing: 'border-box', backgroundColor: '#eee' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Transaction Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          min="0.01"
          step="0.01"
          style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => handleTransaction('deposit')}
          style={{ flexGrow: 1, padding: '12px 0', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Deposit
        </button>
        <button
          onClick={() => handleTransaction('withdraw')}
          style={{ flexGrow: 1, padding: '12px 0', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Withdraw
        </button>
      </div>

      <p style={{ marginTop: '20px', fontWeight: 'bold', color: message.startsWith('Error') ? 'red' : '#007bff' }}>
        {message}
      </p>
    </div>
  );
}

export default Banking;
