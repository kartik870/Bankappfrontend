import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 400px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 5px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #45a049;
  }
`;

const EditProfileModal = ({ isOpen, onClose, userProfile, onUpdate }) => {
  const [formData, setFormData] = useState({
    email: userProfile.email,
    dateOfBirth: userProfile.dateOfBirth,
    age: userProfile.age,
    profilePhoto: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePhoto: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem('username');
    const token = localStorage.getItem('token');

    const formDataToSend = new FormData();
    formDataToSend.append('email', formData.email);
    formDataToSend.append('dateOfBirth', formData.dateOfBirth);
    formDataToSend.append('age', formData.age);
    if (formData.profilePhoto) {
      formDataToSend.append('profilePhoto', formData.profilePhoto);
    }

    try {
      const response = await axios.put(`/api/user/update/${email}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>Edit Profile</h2>
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <Input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
          <Input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Age"
          />
          <Input
            type="file"
            name="profilePhoto"
            onChange={handleFileChange}
          />
          <Button type="submit">Update Profile</Button>
        </Form>
        <Button onClick={onClose}>Cancel</Button>
      </ModalContent>
    </ModalOverlay>
  );
};

export default EditProfileModal;