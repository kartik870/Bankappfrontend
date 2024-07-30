import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotVerified = () => {
  const navigate = useNavigate();
  
  // Retrieve the username from local storage
  const username = localStorage.getItem('username');

  return (
    <div className="d-flex vh-100 align-items-center justify-content-center">
      <div className="card text-center" style={{ width: "18rem" }}>
        <div className="card-body">
          <h4 className="card-title">
            {username}
            <br /><br />
            Come back later. You are not verified yet.
          </h4>
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotVerified;
