import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email is not valid.";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required.";
    } else if (password.length < 5) {
      newErrors.password = "Password must be at least 6 characters long.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please correct your Email and Password");
      console.log("errors==========", errors);
      return;
    }
    const payload = {
      email: email,
      password: password,
    };
    console.log("payload", payload);
    axios
      .post("http://localhost:8000/api/user/login", payload)
      .then((response) => {
        // console.log("response", response);
        if (response.data.success === false && response.status === 200) {
          // console.log("error");
          toast.error(response.data.message);
        }
        if (response.data.success === true && response.status === 200) {
          toast.success(response.data.message);
          // Redirect use navigate
          navigate("/dashboard");
        }
      });
  };
  return (
    <div className="main">
      <div className="login_form">
        <form onSubmit={handleSubmit}>
          <h3>Log in</h3>
          <p className="separator"></p>
          <div className="input_box">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          <div className="input_box">
            <div className="password_title">
              <label for="password">Password</label>
              <Link to={"/forgetpassword"}>Forgot Password?</Link>
            </div>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              required
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>
          <button type="submit">Log In</button>
          <p className="sign_up">
            Don't have an account? <Link to={"/signup"}>Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
export default Login;
