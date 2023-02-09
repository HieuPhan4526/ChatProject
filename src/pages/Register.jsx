import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { ref } from "firebase/storage";
import swal from "sweetalert";

export default function SignUp() {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const storageRef = ref(storage, displayName);

      await updateProfile(res.user, {
        displayName,
      });
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        displayName: displayName,
        email: email,
      });
      await setDoc(doc(db, "userChatrs", res.user.uid), {});
      swal({
        title: "Good job!",
        text: "You clicked the button!",
        icon: "success",
        button: "OK!",
      });
      navigate("/login");
    } catch (error) {
      swal({
        title: "Something went wrong!",
        text: "You clicked the button!",
        icon: "warning",
        button: "OK!",
      });
    }
  };
  return (
    <div className="SignUp">
      <div className="Sign-content">
        <h1>Register CyberBugs</h1>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-input">
            <span className="iconForm">
              <i className="fa fa-user"></i>
            </span>
            <input placeholder="Name" type="text" />
          </div>
          <div className="form-input">
            <span className="iconForm">
              <i className="fa fa-envelope"></i>
            </span>
            <input placeholder="Email" type="email" />
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
          <div className="addAvatar">
            <input
              style={{ display: "none" }}
              type="file"
              name="file"
              id="file"
            />
            <label htmlFor="file">
              <i className="fa fa-file-image"></i>
              <span>Add avatar</span>
            </label>
          </div>
          <button type="submit" className="button-Sign">
            Register
          </button>
        </form>
        <p>
          Already have an account?
          <span>
            <Link to="/login">Login Now</Link>
          </span>
        </p>
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
