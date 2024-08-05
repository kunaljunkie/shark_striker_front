import React, { useState, useEffect } from "react";
import "./login.css";
import CustomSnackbar from "../snackbar/snackbar";
import Loading from "../loading/loading";
import { useNavigate } from "react-router-dom";
import { apiAuth, apiPost } from "../services/service";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    const userid = localStorage.getItem("userid");
    const token = localStorage.getItem('token');
    if (userid && token) {
      handleAuth(userid)
    } 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleAuth =async (userid)=>{
    setLoading(true)
    let param = {userid:userid} 
    const check = await apiAuth("user-check",param)
    if(check.status===200){
      navigate("/home")
    }else {
      setSnackbar({
        open: true,
        message: "SESSION EXPIRED: Login again",
        severity: "success",
      });

    }
    setLoading(false)
  }

  const handleValidation = () => {
    let valid = true;

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    } else {
      setEmailError("");
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      valid = false;
    } else {
      setPasswordError("");
    }

    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (handleValidation()) {
      setLoading(true);

      try {
        const response = await apiPost('login', { email, password });
        localStorage.setItem("userid", response.user._id);
        localStorage.setItem("token", response.token);
        localStorage.setItem("refreshtoken", response.token);

        setSnackbar({
          open: true,
          message: response.message || "Logged in successfully!",
          severity: "success",
        });

        setTimeout(() => navigate("/home"), 1000);
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.response?.data?.message || "An error occurred",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  return (
    <div className="login-form-container">
      {loading ? (
        <Loading />
      ) : (
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login</h2>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={emailError ? "input-error" : ""}
            />
            {emailError && <span className="error">{emailError}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={passwordError ? "input-error" : ""}
            />
            {passwordError && <span className="error">{passwordError}</span>}
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      )}

      <CustomSnackbar
        open={snackbar.open}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </div>
  );
}

export default LoginForm;
