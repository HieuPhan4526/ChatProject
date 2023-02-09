import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import swal from "sweetalert";

export default function Login() {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      await swal({
        title: "Good job!",
        text: "You clicked the button!",
        icon: "success",
        button: "OK!",
      });
      navigate("/");
    } catch (error) {
      await swal({
        title: "Something went wrong!",
        text: "You clicked the button!",
        icon: "warning",
        button: "OK!",
      });
    }
  };
  return (
    <div className="Sign">
      <div className="Sign-img">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCRWWy0ic9NmIQ5ycV8ys_rMCYMpWZY2GmB4NXddUPIlsKxgNWeyhTud9hvayblFYg2bE&usqp=CAU"
          alt=""
        />
      </div>
      <div className="Sign-content">
        <h1>Login</h1>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-input">
            <span className="iconForm">
              <i className="fa fa-envelope"></i>
            </span>
            <input placeholder="Email" id="email" name="email" type="text" />
          </div>
          <div className="form-input">
            <span className="iconForm">
              <i className="fa fa-lock"></i>
            </span>
            <input
              placeholder="Password"
              id="password"
              name="password"
              type="password"
            />
          </div>
          <p>
            Don't have account yet?
            <span>
              <Link to="/register">Register</Link>
            </span>
          </p>
          <button type="submit" className="button-Sign">
            Login
          </button>
        </form>
        <div className="icon-contact">
          <span>
            <i className="fab fa-facebook"></i>
          </span>
          <span>
            <i className="fab fa-twitter"></i>
          </span>
        </div>
      </div>
    </div>
  );
}
