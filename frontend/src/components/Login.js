
import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import userContext from "../state/UserContext";

const Login = (props) => {
  const user = useContext(userContext);
  const [formData, setFormData] = useState({
    username: { value: "", isValid: true },
    password: { value: "", isValid: true },
  });

  const [validated, setValidated] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    user.login({
      username: formData.username.value,
      password: formData.password.value,
    })
      .then((flag) => {
        if (!flag) {
          setFormData({
            username: { value: "", isValid: false },
            password: { value: "", isValid: false },
          });
        }
      });

    setValidated(true);
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setFormData({
      ...formData,
      [event.target.name]: {
        ...formData[event.target.name],
        ["value"]: event.target.value,
      },
    });
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Alert
          variant="danger"
          hidden={formData.username.isValid || formData.password.isValid}
        >
          Invalid username or password.
      </Alert>
        <Form.Group>
          <Form.Label>User name</Form.Label>
          <Form.Control
            name="username"
            type="text"
            placeholder="Enter user name"
            onChange={handleChange}
            value={formData.username.value}
            isInvalid={!formData.username.isValid}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            value={formData.password.value}
            isInvalid={!formData.password.isValid}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Login
      </Button>
      </Form>
      <Link to={`${process.env.PUBLIC_URL}/admin`}>
        <Button variant="primary">
          Admin Login
        </Button>
      </Link>
    </div>
  );
};

export default Login;
