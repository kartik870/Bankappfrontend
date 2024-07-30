import React, { useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; 
import { AuthContext } from '../AuthContext/AuthContext'; // Adjust the path accordingly
import 'bootstrap/dist/css/bootstrap.min.css';
import bankImage from '../photos/bank_pic.jpeg'; // Adjust this path if necessary

const Login = () => {
  const navigate = useNavigate(); 
  const { login } = useContext(AuthContext); // Use the AuthContext

  const handleLogin = async (values, { setSubmitting, setErrors }) => {
    const username= values.username;
    try {
      const response = await axios.post('/api/auth/authenticate', {
        email: values.username,
        password: values.password,
      });
      const token = response.data.token;
      const role = response.data.role;
      const valid = response.data.valid;
      localStorage.setItem('username', username); 
      localStorage.setItem('role', role);
      localStorage.setItem('token', token);
      // Use login function from AuthContext
      login(token, role);

      if (role === 'SUPERVISOR') {
        await axios.get('api/admin/get/allUsers', {
          headers: { Authorization: `Bearer ${token}` }
        });
        navigate("/adminDashboard"); 
      } else {
        if(valid){
          navigate("/user");
        } else {
          navigate("/notVerified");
        }
      }

    } catch (error) {
      console.error('Error during login:', error);
      setErrors({ api: 'Login failed. Please check your credentials and try again.' });
    }
    setSubmitting(false);
  };

  return (
    <div className="d-flex vh-100 align-items-center justify-content-center" >
      <div className="d-flex shadow-lg rounded" style={{ width: '80%', maxWidth: '1000px', backgroundColor: '#ffffff' }}>
        {/* Left side with image */}
        <div className="d-none d-md-block" style={{ flex: '1.2' }}>
          <img src={bankImage} alt="Bank" className="img-fluid h-100 w-100 object-fit-cover rounded-start" />
        </div>
        
        {/* Right side with login form */}
        <div style={{ flex: '1' }} className="p-4 rounded-end">
          <h2 className="text-center mb-4" style={{ color: '#343a40', fontWeight: 'bold' }}>Login</h2>
          <Formik
            initialValues={{ username: '', password: '' }}
            validationSchema={Yup.object({
              username: Yup.string().required('Required'),
              password: Yup.string().required('Required'),
            })}
            onSubmit={handleLogin}
          >
            {({ isSubmitting, errors }) => (
              <Form>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label" style={{ color: '#343a40' }}>Email</label>
                  <Field name="username" type="text" className="form-control" />
                  <ErrorMessage name="username" component="div" className="text-danger" />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label" style={{ color: '#343a40' }}>Password</label>
                  <Field name="password" type="password" className="form-control" />
                  <ErrorMessage name="password" component="div" className="text-danger" />
                </div>
                {errors.api && <div className="text-danger mb-3">{errors.api}</div>}
                <div className="d-grid mb-3">
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ backgroundColor: '#007bff', borderColor: '#007bff' }}>
                    {isSubmitting ? 'Logging in...' : 'Login'}
                  </button>
                </div>
                <div className="text-center">
                  <Link to="/register" style={{ color: '#007bff', textDecoration: 'none' }}>
                    Not a user? Open account today
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Login;
