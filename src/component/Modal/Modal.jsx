// EditProfileModal.jsx
import React, { useState } from 'react';
import axios from 'axios';

const EditProfileModal = ({ isOpen, onClose, userProfile }) => {
  const [formData, setFormData] = useState({
    email: userProfile.email,
    dateOfBirth: userProfile.dateOfBirth,
    age: userProfile.age,
    profilePhoto: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePhoto') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem('username');
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      await axios.put(`/api/user/update/${email}`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onClose();
      // Optionally, you can refresh the user profile data here
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="dateOfBirth">Date of Birth:</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="age">Age:</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="profilePhoto">Profile Photo:</label>
            <input
              type="file"
              id="profilePhoto"
              name="profilePhoto"
              onChange={handleChange}
            />
          </div>
          <button type="submit">Update</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;