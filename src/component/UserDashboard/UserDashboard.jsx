import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaMoneyBillWave, FaExchangeAlt, FaFileInvoiceDollar } from 'react-icons/fa';

const UserDashboard = () => {
  const [selectedOperation, setSelectedOperation] = useState('');
  const [amount, setAmount] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [recipientAccountId, setRecipientAccountId] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username || localStorage.getItem('username');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleOperationSelect = (operation) => {
    setSelectedOperation(operation);
    setAmount('');
    setRecipientId('');
    setRecipientAccountId('');
    setMessage('');
  };

  const handleTransaction = async () => {
    try {
      let response;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      switch (selectedOperation) {
        case 'deposit':
        case 'withdrawal':
          response = await axios.post(`/api/transaction/${selectedOperation}`, null, {
            params: { email: username, amount: parseFloat(amount) },
            ...config
          });
          break;
        case 'transfer':
          const transferData = {
            userEmail: username,
            recipientId: parseInt(recipientId),
            recipientAccountId: parseInt(recipientAccountId),
            amount: parseFloat(amount)
          };
          response = await axios.post('/api/transaction/transfer', transferData, config);
          break;
        default:
          throw new Error('Invalid operation');
      }

      setMessage(response.data.message);
      setAmount('');
      setRecipientId('');
      setRecipientAccountId('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred');
    }
  };

  const renderForm = () => {
    switch (selectedOperation) {
      case 'deposit':
      case 'withdrawal':
        return (
          <div className="card-body">
            <h5 className="card-title mb-3">{selectedOperation.charAt(0).toUpperCase() + selectedOperation.slice(1)}</h5>
            <div className="input-group mb-3">
              <span className="input-group-text">₹</span>
              <input
                type="number"
                className="form-control"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
              />
            </div>
            <button className="btn btn-primary w-100" onClick={handleTransaction}>
              {selectedOperation.charAt(0).toUpperCase() + selectedOperation.slice(1)}
            </button>
          </div>
        );
      case 'transfer':
        return (
          <div className="card-body">
            <h5 className="card-title mb-3">Transfer</h5>
            <input
              type="number"
              className="form-control mb-3"
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              placeholder="Recipient ID"
            />
            <input
              type="number"
              className="form-control mb-3"
              value={recipientAccountId}
              onChange={(e) => setRecipientAccountId(e.target.value)}
              placeholder="Recipient Account ID"
            />
            <div className="input-group mb-3">
              <span className="input-group-text">₹</span>
              <input
                type="number"
                className="form-control"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
              />
            </div>
            <button className="btn btn-primary w-100" onClick={handleTransaction}>
              Transfer
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container-fluid py-5">
      <div className="container  min-vh-100">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-lg ">
              <div className="card-header bg-primary text-white">
                <h2 className="mb-0">Welcome, {username}</h2>
              </div>
              <div className="card-body">
                <h4 className="mb-4">What would you like to do today?</h4>
                <div className="d-flex justify-content-around mb-4">
                  <button className={`btn btn-outline-primary btn-lg ${selectedOperation === 'deposit' ? 'active' : ''}`} onClick={() => handleOperationSelect('deposit')}>
                    <FaMoneyBillWave className="me-2" /> Deposit
                  </button>
                  <button className={`btn btn-outline-primary btn-lg ${selectedOperation === 'withdrawal' ? 'active' : ''}`} onClick={() => handleOperationSelect('withdrawal')}>
                    <FaMoneyBillWave className="me-2" /> Withdraw
                  </button>
                  <button className={`btn btn-outline-primary btn-lg ${selectedOperation === 'transfer' ? 'active' : ''}`} onClick={() => handleOperationSelect('transfer')}>
                    <FaExchangeAlt className="me-2" /> Transfer
                  </button>
                </div>

                {selectedOperation && (
                  <div className="card mb-4">
                    {renderForm()}
                  </div>
                )}

                {message && (
                  <div className="alert alert-info" role="alert">
                    {message}
                  </div>
                )}

                <Link to={`/statement/${username}`} className="btn btn-success btn-lg w-100">
                  <FaFileInvoiceDollar className="me-2" /> View Statement
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;