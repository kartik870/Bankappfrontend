import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

const ProfileContainer = styled.div`
  max-width: 700px;
  margin: 30px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const ProfileHeader = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 20px;
  font-size: 2rem;
`;

const ProfilePhoto = styled.div`
  width: 180px;
  height: 180px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 20px;
  border: 4px solid #4caf50;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProfileInfo = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const InfoItem = styled.p`
  margin: 15px 0;
  font-size: 18px;
  color: #555;
`;

const EditButton = styled.button`
  display: block;
  margin: 20px auto;
  padding: 12px 25px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background-color: #45a049;
    transform: scale(1.05);
  }
`;

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
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  width: 450px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const ModalHeader = styled.h2`
  margin: 0 0 20px;
  font-size: 1.5rem;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  color: #333;
  margin-bottom: 8px;
  font-weight: bold;
  display: block;
`;

const Input = styled.input`
  margin-bottom: 15px;
  padding: 10px;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #4caf50;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 12px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background-color: #45a049;
    transform: scale(1.05);
  }

  &:last-child {
    background-color: #f44336;
    margin-top: 10px;

    &:hover {
      background-color: #e53935;
    }
  }
`;

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    dateOfBirth: "",
    age: "",
    profilePhoto: "", // Store base64 string here
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const email = localStorage.getItem("username");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/user/user-profile/${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserProfile(response.data);
      setFormData({
        email: response.data.email,
        dateOfBirth: response.data.dateOfBirth,
        age: response.data.age,
        profilePhoto: response.data.profilePhoto || "", // Assuming profilePhoto is a base64 string
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleEditProfile = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    try {
      const response = await axios.put(
        `/api/user/update/${email}`,
        {
          email: formData.email,
          dateOfBirth: formData.dateOfBirth,
          age: parseInt(formData.age),
          profilePhoto: formData.profilePhoto, // Send base64 string
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserProfile(response.data);
      handleCloseModal();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      getBase64(file).then(base64 => {
        setFormData(prevData => ({
          ...prevData,
          profilePhoto: base64,
        }));
      }).catch(error => console.error('Error converting file to base64', error));
    }
  };

  // Helper function to convert File to base64
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = error => reject(error);
    });
  };

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <ProfileContainer>
      <ProfileHeader>User Profile</ProfileHeader>
      <ProfilePhoto>
        {userProfile.profilePhoto ? (
          <ProfileImage
            src={`data:image/jpeg;base64,${userProfile.profilePhoto}`}
            alt="Profile"
          />
        ) : (
          <ProfileImage
            src="https://via.placeholder.com/180"
            alt="Default Profile"
          />
        )}
      </ProfilePhoto>
      <ProfileInfo>
        <InfoItem>
          <strong>Email:</strong> {userProfile.email}
        </InfoItem>
        <InfoItem>
          <strong>Date of Birth:</strong> {userProfile.dateOfBirth}
        </InfoItem>
        <InfoItem>
          <strong>Age:</strong> {userProfile.age}
        </InfoItem>
      </ProfileInfo>
      <EditButton onClick={handleEditProfile}>Edit Profile</EditButton>

      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
          <h2 style={{ color: 'black' }}>Edit Profile</h2>
            <Form onSubmit={handleSubmit}>
              <Label htmlFor="email">Email:</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
              />
              <Label htmlFor="dateOfBirth">Date of Birth:</Label>
              <Input
                id="dateOfBirth"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
              <Label htmlFor="age">Age:</Label>
              <Input
                id="age"
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Age"
              />
              <Label htmlFor="profilePhoto">Profile Photo (Base64 String):</Label>
              <Input
                id="profilePhoto"
                type="text"
                name="profilePhoto"
                value={formData.profilePhoto}
                onChange={handleChange}
                placeholder="Paste base64 string here"
              />
              <Button type="submit">Update Profile</Button>
            </Form>
            <Button onClick={handleCloseModal}>Cancel</Button>
          </ModalContent>
        </ModalOverlay>
      )}
    </ProfileContainer>
  );
};

export default UserProfile;
