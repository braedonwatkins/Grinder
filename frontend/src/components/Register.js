import React, { useState } from "react";
import { AccountContext } from "./Account";
import UserPool from "../UserPool";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  var bp = require("./Path");

  var att = [
    {
      Name: "name",
      Value: name,
    },
  ];

  const onSubmit = (event) => {
    event.preventDefault();
    if (confirm !== password) {
      console.error("Passwords do not match");
      return;
    }
    // AMAZON COGNITO - needs email, password , only attribute needed is name
    UserPool.signUp(email, password, att, null, (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      // On success store user into DB
      const newUser = {
        gamertag: name,
        email: email,
        password: password,
      };
      var newUserjson = JSON.stringify(newUser);

      var config = {
        method: "post",
        url: bp.buildPath("api/signup"),
        headers: {
          "Content-Type": "application/json",
        },
        data: newUserjson,
      };

      axios(config)
        .then(function (response) {
          var res = response.data;

          if (res.error) {
            console.error(res.error);
          } else {
            window.location.href = "/";
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  };

  // return (
  // <div class="box">
  //   <div>
  //     <h3>Create an Account</h3>
  //     <form onSubmit={onSubmit}>
  //       <label htmlFor="name">Firstname</label>
  //       <input
  //         value={name}
  //         onChange={(event) => setName(event.target.value)}
  //       ></input>
  //       <label htmlFor="email">Email</label>
  //       <input
  //         value={email}
  //         onChange={(event) => setEmail(event.target.value)}
  //       ></input>
  //       <label htmlFor="password">Password</label>
  //       <input
  //         value={password}
  //         onChange={(event) => setPassword(event.target.value)}
  //       ></input>

  //       <button type="submit">Register</button>
  //     </form>
  //   </div>
  // </div>
  // );

  return (
    <div class="box">
      <div>
        <h3>Create an account</h3>
        <p class="text-muted">Please fill out all fields</p>
        <form onSubmit={onSubmit}>
          <div class="form-box">
            <input
              type="firstname"
              placeholder="Enter Gamertag"
              value={name}
              onChange={(event) => setName(event.target.value)}
            ></input>
          </div>
          <div class="form-box">
            <input
              type="email"
              placeholder="Enter Email Address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            ></input>
          </div>
          <div class="form-floating">
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            ></input>
          </div>
          <div class="form-floating">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
            />
          </div>
          <a href="index.html" class="forgot">
            Already have an account?
          </a>
        </form>

        <input type="button" value="Register" onClick={onSubmit}>
        </input>
      </div>
    </div>
  );
};

export default Register;
