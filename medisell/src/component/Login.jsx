import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // Import axios
import Grid from "@mui/material/Unstable_Grid2";
import "../../src/style/login.css";

function Login() {
  const [userData, setUserData] = useState({
    username: '',
    password: '',
    checkbox: false,
  });

  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(false); 
  const [success, setSuccess] = useState(false); 
  const [avatar, setAvatar] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData.username || !userData.password ) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true); 
    setError(null);

    try {
      const response = await axios.post('http://localhost:8000/api/v1/users/login', {
        username: userData.username,
        password: userData.password,
      });

      setSuccess(true);
      setError(null);
      setLoading(false);

      const avatarUrl = response.data.data.user.avatar;
      setAvatar(avatarUrl); 

      // Example: Store token and user data, then redirect
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('avatarUrl', avatarUrl)
      window.location.href = "/home";
      console.log("Login successful!", response.data);
      console.log(localStorage.getItem('accesstoken'))

    } catch (err) {
      setLoading(false);
      setSuccess(false);

      if (err.response) {
        setError(err.response.data.message || "Login failed!");
      } else {
        setError("Something went wrong!");
      }
      console.log("Login error:", err);
    }
  };

  return (
    <div className="loginBody w-screen h-screen">
      <div
        className="w-9/12 ml-36 mt-24 rounded-2xl border-4"
        style={{
          background: "radial-gradient(243.55% 153.69% at 23.48% -1.07%, #EBF3F5 10.46%, #C5E2F0 100%)",
        }}
      >
        <Grid container spacing={1}>
          <div>
            {/* Replace with the avatar URL if available, otherwise show a default avatar or placeholder */}
            <img
              src={avatar || "https://res.cloudinary.com/di6vyjdrc/image/upload/v1738180282/bexouwr4hmntbiwzgjrl.webp"}  
              style={{
                width: "55vh",
                height: "60vh",
                border: "solid",
                borderRadius: "2vh",
              }}
              alt="User Avatar"
            />
          </div>
          <div>
            <form onSubmit={handleSubmit} style={{ padding: "3vh" }}>
              {/* Display error or success message */}
              {error && <div style={{ color: "red" }}>{error}</div>}
              {success && <div style={{ color: "green" }}>Login successful!</div>}

              <label htmlFor="username" style={{ padding: "1vh" }}>
                Username
                <br />
                <input
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={userData.username}
                  onChange={handleChange}
                  style={{
                    border: "1px solid",
                    margin: "1vh",
                    borderRadius: "2vh",
                    background: "#B4D8E4",
                    height: "5vh",
                    width: "40vh",
                  }}
                />
              </label>
              <br />
              <br />
              <label htmlFor="password" style={{ padding: "1vh" }}>
                Password
                <br />
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  style={{
                    border: "1px solid",
                    margin: "1vh",
                    borderRadius: "2vh",
                    background: "#B4D8E4",
                    height: "5vh",
                    width: "40vh",
                  }}
                />
              </label>
              <br />
              <label style={{ marginTop: "6vh", color: "#86C5DA", marginLeft: "2vh" }}>
                <input
                  type="checkbox"
                  name="checkbox"
                  checked={userData.checkbox}
                  onChange={(e) => setUserData({ ...userData, checkbox: e.target.checked })}
                  style={{ marginTop: "6vh" }}
                />
                Accept T&C (read document carefully)
              </label>
              <br />
              <button
                type="submit"
                style={{
                  background: "blue",
                  borderRadius: "1vh",
                  width: "15vh",
                  height: "6vh",
                  color: "white",
                  marginLeft: "2vh",
                  marginTop: "8vh",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Submit"}
              </button>
              <Link to="/signin">
                <input type="button" value="Signin" style={{ marginLeft: "5vh" }} />
              </Link>
            </form>
          </div>
        </Grid>
      </div>
    </div>
  );
}

export default Login;
