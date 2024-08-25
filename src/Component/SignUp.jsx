import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [paswd, setpaswd] = useState("");
  const [gender, setGender] = useState("male");
  const [address, setAddress] = useState("");
  const [selectedValue, setSelectedValue] = useState("male");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email is not valid.";
    }

    if (!paswd.trim()) {
      newErrors.paswd = "Password is required.";
    } else if (paswd.length < 6) {
      newErrors.paswd = "Password must be at least 6 characters long.";
    }

    if (!address.trim()) {
      newErrors.address = "Address is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please correct your details in the form.");
      console.log("errors==========", errors);
      return;
    }

    const formData = {
      name: name,
      email: email,
      paswd: paswd,
      gender: gender,
      address: address,
    };
    axios
      .post("http://localhost:8000/api/user/store", formData)
      .then((response) => {
        console.log(response);
        if (response.data.error) {
          toast.error(response.data.error);
        }
        if (response.data.success && response.status === 200) {
          toast.success(`${response.data[0].name} ${response.data.success}`);
          setName("");
          setEmail("");
          setAddress("");
          setpaswd("");
          setGender("");
        }
      });
  };
  return (
    <div className="main">
      <div className="login_form">
        <form onSubmit={handleSubmit}>
          <h3>Sign Up</h3>
          <p className="separator"></p>

          <div className="input_box">
            <label for="email">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div>
            <div className="gender_title">
              <label for="gender">Gender</label>
            </div>
            <input
              type="radio"
              value={gender}
              name="gender"
              checked={selectedValue === "male"}
              onChange={(e) => {
                setSelectedValue("male");
                return setGender("male");
              }}
            />
            Male
            <input
              type="radio"
              value={gender}
              name="gender"
              checked={selectedValue === "female"}
              onChange={(e) => {
                setSelectedValue("female");
                return setGender("female");
              }}
            />
            Female
          </div>

          <div className="input_box">
            <div className="email_title">
              <label for="email">Email ID</label>
            </div>
            <input
              type="text"
              id="email"
              placeholder="Enter your Emailid"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          <div className="input_box">
            <div className="password_title">
              <label for="password">Password</label>
            </div>
            <input
              type="password"
              id="pswd"
              placeholder="Enter your password"
              value={paswd}
              onChange={(e) => setpaswd(e.target.value)}
            />
            {errors.paswd && <span className="error-text">{errors.paswd}</span>}
          </div>

          <div className="input_box">
            <div className="address_title">
              <label for="address">Address</label>
            </div>
            <textarea
              id="address"
              name="address"
              rows="4"
              className="form-control"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            {errors.address && (
              <span className="error-text">{errors.address}</span>
            )}
          </div>

          <button type="submit">Sign Up</button>
          <p className="sign_up">
            you Already an account? <Link to={"/"}>LogIn</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
