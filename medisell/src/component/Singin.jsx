import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Singin() {
  const [userData, setUserData] = useState({
    fullname: '',
    dob: '',
    username: '',
    email: '', // Add email field here
    password: '',
    checkbox: false,
    avatar: null,
    coverImage: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setUserData((prevData) => ({
        ...prevData,
        [name]: files[0], 
      }));
    } else {
      setUserData((prevData) => ({
        ...prevData,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate required fields
    if (!userData.avatar) {
      alert("Avatar is required!");
      return;
    }
    if (!userData.fullname) {
      alert("Full Name is required!");
      return;
    }
    if (!userData.dob) {
      alert("Date of Birth is required!");
      return;
    }
    if (!userData.username) {
      alert("Username is required!");
      return;
    }
    if (!userData.email) {  // Validate the email field
      alert("Email is required!");
      return;
    }
    if (!userData.password) {
      alert("Password is required!");
      return;
    }
    if (!userData.checkbox) {
      alert("You must accept the terms and conditions!");
      return;
    }
  
    const formData = new FormData();
    Object.keys(userData).forEach((key) => {
      formData.append(key, userData[key]);
    });
    console.log('Form Data:', userData);
  
    try {
      const response = await axios.post('http://localhost:8000/api/v1/users/register', formData);
      console.log('User added successfully.', response.data);
      alert('Form submitted successfully!');
  
      // Reset form after successful submission
      setUserData({
        fullname: '',
        dob: '',
        username: '',
        email: '',  // Reset the email field as well
        password: '',
        select: 'retailer',
        checkbox: false,
        avatar: null,
        coverImage: null, 
      });
    } catch (error) {
      // Log the entire error object to see the exact problem
      console.error('Error adding user:', error);
  
      // Check for error response if available
      if (error.response) {
        console.error('Error Response:', error.response.data);
        alert(`Error1: ${error.response.data.message || error.response.statusText}`);
      } else if (error.request) {
        console.error('Error Request:', error.request);
        alert("Error2: No response received from server.");
      } else {
        console.error('General Error:', error.message);
        alert(`Error3: ${error.message}`);
      }
    }
  };

  return (
    <div className="w-screen h-screen">
      <div
        style={{
          background:
            "radial-gradient(243.55% 153.69% at 23.48% -1.07%, #EBF3F5 10.46%, #C5E2F0 100%)",
          paddingBottom: "17vh",
        }}
        className="ml-36 mt-24 rounded-2xl border-4 w-9/12"
      >
        <form className="responsive-form py-12 px-12" onSubmit={handleSubmit}>
          {/* Avatar */}
          <label>
            Avatar <span className="text-red-500">*</span>
            <br />
            <input
              className="border-2 rounded-lg w-72 mt-2 mb-2"
              type="file"
              name="avatar"
              onChange={handleChange}
              accept="image/*"
              required
            />
          </label>
          <br />

          {/* Cover Image */}
          <label>
            Cover Image
            <br />
            <input
              className="border-2 rounded-lg w-72 mt-2 mb-2"
              type="file"
              name="coverImage"
              onChange={handleChange}
              accept="image/*"
            />
          </label>
          <br />

          {/* Full Name */}
          <label htmlFor="fullname">
            Enter your Name <span className="text-red-500">*</span>
            <br />
            <input
              className="border-2 rounded-lg w-72 mt-2 mb-2"
              type="text"
              name="fullname"
              placeholder="Name"
              onChange={handleChange}
              value={userData.fullname}
              required
            />
          </label>
          <br />

          {/* Date of Birth */}
          <label htmlFor="dob">
            DOB <span className="text-red-500">*</span>
            <br />
            <input
              className="border-2 rounded-lg w-72 mt-2 mb-2"
              type="date"
              name="dob"
              value={userData.dob}
              onChange={handleChange}
              required
            />
          </label>
          <br />

          {/* Email */}
          <label htmlFor="email">
            Email <span className="text-red-500">*</span>
            <br />
            <input
              className="border-2 rounded-lg w-72 mt-2 mb-2"
              type="email"
              name="email"
              placeholder="Email"
              value={userData.email}
              onChange={handleChange}
              required
            />
          </label>
          <br />

          {/* Username */}
          <label htmlFor="username">
            Username <span className="text-red-500">*</span>
            <br />
            <input
              className="border-2 rounded-lg w-72 mt-2 mb-2"
              type="text"
              name="username"
              placeholder="Username"
              value={userData.username}
              onChange={handleChange}
              required
            />
          </label>
          <br />

          {/* Password */}
          <label htmlFor="password" className="mt-6">
            Password <span className="text-red-500">*</span>
            <br />
            <input
              className="border-2 rounded-lg w-72 mt-2 bg-slate-300 hover:bg-white"
              type="password"
              name="password"
              placeholder="Password"
              value={userData.password}
              onChange={handleChange}
              required
            />
          </label>
          <br />

          {/* User Type */}
          
          {/* Terms and Conditions */}
          <label>
            <input
              type="checkbox"
              name="checkbox"
              onChange={handleChange}
              checked={userData.checkbox}
              required
            />
            Accept T&C <span className="text-red-500">*</span>
          </label>
          <br />

          {/* Submit Button */}
          <div className="flex mt-12">
            <input
              type="submit"
              value="Submit"
              className="w-24 h-12 border-2 rounded-lg bg-blue-500 hover:bg-blue-400 hover:text-white"
            />
            <Link to="/login">
              <input type="button" value="Login" className="mx-12 h-12 text-blue-500" />
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Singin;
