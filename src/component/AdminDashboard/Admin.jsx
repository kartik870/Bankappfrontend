import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Card, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Admin.css'; // Import the custom CSS file

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [accountType, setAccountType] = useState('CURRENT'); // Default account type
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token'); // Adjust this based on how you store the token
                const response = await axios.get('/api/admin/get/allUsers', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
                navigate('/login');
            }
        };

        fetchUsers();
    }, [navigate]);

    const handleRowClick = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleApproveKYC = async () => {
        try {
            const token = localStorage.getItem('token');

            const accountDto = {
                userEmail: selectedUser.email, // Assuming selectedUser has an email field
                accountType: accountType
            };

            console.log(accountDto);

            await axios.post('/api/admin/kyc', accountDto, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setShowModal(false);
            // Optionally refresh the user list or update the UI
        } catch (error) {
            console.error('Error approving KYC:', error);
        }
    };

    const handleRejectKYC = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete('/api/admin/kyc', {
                data: { userId: selectedUser.userId },
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowModal(false);
            // Optionally refresh the user list or update the UI
        } catch (error) {
            console.error('Error rejecting KYC:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center">Admin Dashboard</h2>
            <Table striped bordered hover className="custom-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Full Name</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.userId} onClick={() => handleRowClick(user)}>
                            <td>{user.userId}</td>
                            <td>{user.fullName}</td>
                            <td>{user.email}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)} dialogClassName="custom-modal">
                <Modal.Header closeButton>
                    <Modal.Title><b>KYC Approval</b></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <Card>
                            <Card.Body>
                                <Card.Title>Want to Approve KYC of {selectedUser.fullName.split(' ')[0]}?</Card.Title>
                                <Form>
                                    <Form.Group controlId="accountTypeSelect">
                                        <Form.Label>Select Account Type</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={accountType}
                                            onChange={(e) => setAccountType(e.target.value)}
                                            className="custom-select"
                                        >
                                            <option value="CURRENT">CURRENT</option>
                                            <option value="SAVINGS">SAVINGS</option>
                                            <option value="INVESTMENT">INVESTMENT</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Form>
                                <div className="button-group">
                                    <Button variant="success" onClick={handleApproveKYC}>YES</Button>
                                    <Button variant="danger" onClick={handleRejectKYC}>NO</Button>
                                </div>
                            </Card.Body>
                        </Card>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Admin;
