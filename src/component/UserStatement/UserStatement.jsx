import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserStatement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  
  const email = location.state?.username || localStorage.getItem('username');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchTransactions();
    }
  }, [token, navigate]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/user/get-statement/${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="container-fluid" style={{backgroundColor: 'black', minHeight: '100vh', padding: '20px'}}>
      <h2 className="text-center mb-4 text-white">Transaction History</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="col-md-6 mb-3">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">
                    {transaction.type.toUpperCase()}
                  </h5>
                  <span className="badge bg-danger">
                    ₹{transaction.amount}
                  </span>
                </div>
                <p className="card-text text-muted mt-2">
                  <small>Transaction ID: {transaction.id}</small>
                </p>
                <p className="card-text">
                  <small className="text-muted">
                    {new Date(transaction.transactionDate).toLocaleString()}
                  </small>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserStatement;