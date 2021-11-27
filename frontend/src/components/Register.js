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
  const [err, setErr] = useState("");

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
      setErr("Passwords do not match");
      return;
    }
    if(name === "" || email === "" || confirm ==="" || password ===""){
      setErr("Please fill out form");
      return;
    }
    // AMAZON COGNITO - needs email, password , only attribute needed is name
    UserPool.signUp(email, password, att, null, (err, data) => {
      if (err) {
        setErr(err.message);
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
          window.location.href = "/";
          
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  };

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
              placeholder="Enter Username(email) Address"
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
        <br />
        <p>{err}</p>
        <input type="button" value="Register" onClick={onSubmit}></input>
      </div>
    </div>
  );
};

export default Register;
