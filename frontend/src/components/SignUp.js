
import React, { useState, useContext } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import userContext from "../state/UserContext";

const SignUp = (props) => {
  const User = useContext(userContext);

  const [formData, setFormData] = useState({
    username: { value: "", isValid: false, validated: false },
    email: { value: "", isValid: false, validated: false },
    password: { value: "", isValid: false, validated: false },
    confirm_pass: { value: "", isValid: false, validated: false },
  });

  const [usrnameExsits, setUsrnameExsits] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.target;
    if (
      formData.username.isValid &&
      formData.email.isValid &&
      formData.password.isValid &&
      formData.confirm_pass.isValid
    ) {
      User.signUp({
        username: formData.username.value,
        email: formData.email.value,
        password: formData.password.value,
      }).then((flag) => {
        if (!flag) {
          setUsrnameExsits(true);
        }
      });
    }
  };

  const handleChange = (event) => {
    const isUsernameOrPass =
      event.target.name === "username" || event.target.name === "password";
    const isValidLength =
      event.target.value.length > 3 && event.target.value.length < 21;
    const isConfirmPass = event.target.name === "confirm_pass";
    const isSamePass = formData.password.value === event.target.value;
    setFormData({
      ...formData,
      [event.target.name]: {
        ...formData[event.target.name],
        ["value"]: event.target.value,
        ["validated"]: true,
        ["isValid"]: isUsernameOrPass
          ? isValidLength
            ? true
            : false
          : isConfirmPass
          ? isSamePass
            ? true
            : false
          : true,
      },
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Alert variant="danger" hidden={!usrnameExsits}>
        Username exists. Please use another username.
      </Alert>
      <Form.Group>
        <Form.Label>User name</Form.Label>
        <Form.Control
          name="username"
          type="text"
          placeholder="Enter user name"
          onChange={handleChange}
          value={formData.username.value}
          isInvalid={!formData.username.isValid && formData.username.validated}
          required
        />
        <Form.Control.Feedback type="invalid">
          Please provide a valid username (4-20 characters)
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Form.Label>Email address</Form.Label>
        <Form.Control
          name="email"
          type="email"
          placeholder="Enter email"
          onChange={handleChange}
          value={formData.email.value}
          isInvalid={!formData.email.isValid && formData.email.validated}
          required
        />
        <Form.Control.Feedback type="invalid">
          Please provide a valid email address
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group>
        <Form.Label>Password</Form.Label>
        <Form.Control
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          value={formData.password.value}
          isInvalid={!formData.password.isValid && formData.password.validated}
          required
        />
        <Form.Control.Feedback type="invalid">
          Please provide a valid password (4-20 characters)
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          name="confirm_pass"
          type="password"
          placeholder="Confirm Password"
          onChange={handleChange}
          value={formData.confirm_pass.value}
          isInvalid={
            !formData.confirm_pass.isValid && formData.confirm_pass.validated
          }
          required
        />
        <Form.Control.Feedback type="invalid">
          Please enter the same password
        </Form.Control.Feedback>
      </Form.Group>
      <Button variant="primary" type="submit">
        Sign Up
      </Button>
    </Form>
  );
};

export default SignUp;
