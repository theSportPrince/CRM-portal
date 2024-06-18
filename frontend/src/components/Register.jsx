import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_BASE_URL}/api/users/register`, {
        name,
        email,
        password,
        role,
      });
      alert("User register Successfully")
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="form_container">
      <form className="form" onSubmit={handleSubmit}>
        <div className="flex-column">
          <label>Name</label>
        </div>
        <div className="inputForm">
          <input
            placeholder="Enter your Name"
            className="input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="flex-column">
          <label>Email</label>
        </div>
        <div className="inputForm">
          <input
            placeholder="Enter your Email"
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="flex-column">
          <label>Password</label>
        </div>
        <div className="inputForm">
          <input
            placeholder="Enter your Password"
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex-column">
          <label>Role</label>
        </div>
        <div className="inputForm">
          <select
            className="input"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button className="button-submit" type="submit">
          Register
        </button>
        <p className="p">
          Already have an account?
          <a href="/login">
            <span className="span">Sign In</span>
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;
