import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inputOpen, setInputOpen] = useState(false);
  const [emailInput, setEmailInput] = useState(true);
  const [c_password, setconfirmPassword] = useState("");
  const [userId, setuserId] = useState(null);
  const navigate = useNavigate();

  const verifyEmail = (e) => {
    e.preventDefault();
    // console.log("varify Email", email);

    axios
      .get(`http://localhost:8000/api/user/verifey-email/${email}`)
      .then((response) => {
        console.log("response", response);

        if (response.data.success === true && response.status === 200) {
          setuserId(response.data.data[0].id);
          setInputOpen(true);
          setEmailInput(false);
        } else {
          toast.error(response.data.error);
        }
      });
  };

  function handleForgotPassword(e) {
    e.preventDefault();
    if (password !== c_password) {
      alert("Password Not match");
      return false;
    } else {
      const payload = {
        password: password,
        userId: userId,
      };
      axios
        .post(`http://localhost:8000/api/user/forgot-password`, payload)
        .then((response) => {
          if (response.data.success && response.status === 200) {
            toast.success(response.data.message);
            navigate("/");
          } else {
            toast.error("Something went wrong");
          }
        });
    }
  }
  return (
    <>
      <div className="main">
        <div className="login_form">
          <form onSubmit={verifyEmail}>
            <h3>Forget Password</h3>
            <p className="separator"></p>
            {emailInput === true ? (
              <>
                <div className="input_box">
                  <div className="email_title">
                    <label htmlFor="email">Email ID</label>
                  </div>
                  <input
                    type="text"
                    id="email"
                    placeholder="Enter your Emailid"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button type="submit">Verify Email </button>
              </>
            ) : (
              ""
            )}

            {inputOpen === true ? (
              <>
                <div className="input_box">
                  <div className="password">
                    <label htmlFor="password">New password</label>
                  </div>
                  <input
                    type="text"
                    id="password"
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="input_box">
                  <div className="c_password">
                    <label htmlFor="c_password">Confirm password</label>
                  </div>
                  <input
                    type="text"
                    id="c_password"
                    placeholder="Confirm your password"
                    value={c_password}
                    onChange={(e) => setconfirmPassword(e.target.value)}
                  />
                </div>
                <button type="button" onClick={handleForgotPassword}>
                  Forgot Password{" "}
                </button>
              </>
            ) : (
              ""
            )}
          </form>
        </div>
      </div>
    </>
  );
}

export default ForgetPassword;
