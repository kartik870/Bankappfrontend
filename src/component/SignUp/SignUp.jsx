import React, { useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Modal, Button } from "react-bootstrap";
import { FaUser, FaEnvelope, FaLock, FaUserTag } from "react-icons/fa";

const SignUp = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(4, "Password must be at least 4 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (
    values,
    { setSubmitting, resetForm, setStatus }
  ) => {
    const dataToSubmit = { ...values, role: "user" };

    try {
      const response = await axios.post(
        "/api/auth/registeration",
        dataToSubmit
      );
      console.log("Registration successful:", response.data);
      resetForm();
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Registration error:", error);
      setStatus(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-body p-5">
              <h1 className="text-center mb-4">Sign Up</h1>
              <Formik
                initialValues={{
                  firstName: "",
                  lastName: "",
                  email: "",
                  password: "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, status }) => (
                  <Form>
                    {status && (
                      <div className="alert alert-danger mt-3" role="alert">
                        {status}
                      </div>
                    )}
                    <div className="mb-4">
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaUser className="text-primary" />
                        </span>
                        <Field
                          type="text"
                          name="firstName"
                          className="form-control"
                          placeholder="First Name"
                        />
                      </div>
                      <ErrorMessage
                        name="firstName"
                        component="div"
                        className="text-danger mt-1"
                      />
                    </div>
                    <div className="mb-4">
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaUser className="text-primary" />
                        </span>
                        <Field
                          type="text"
                          name="lastName"
                          className="form-control"
                          placeholder="Last Name"
                        />
                      </div>
                      <ErrorMessage
                        name="lastName"
                        component="div"
                        className="text-danger mt-1"
                      />
                    </div>
                    <div className="mb-4">
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaEnvelope className="text-primary" />
                        </span>
                        <Field
                          type="email"
                          name="email"
                          className="form-control"
                          placeholder="Email Address"
                        />
                      </div>
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-danger mt-1"
                      />
                    </div>
                    <div className="mb-4">
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaLock className="text-primary" />
                        </span>
                        <Field
                          type="password"
                          name="password"
                          className="form-control"
                          placeholder="Password"
                        />
                      </div>
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-danger mt-1"
                      />
                    </div>
                    <div className="mb-4">
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaUserTag className="text-primary" />
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          value="User"
                          disabled
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary btn-block w-100 py-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Registering..." : "Register"}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>

      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        centered
      >
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>Registration Successful!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0" style={{ color: 'black' }}>
            You have been successfully registered as a user. You can now log in
            to your account.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowSuccessModal(false)}
          >
            Close
          </Button>
          <Button variant="primary" href="/">
            Go to Login
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SignUp;
