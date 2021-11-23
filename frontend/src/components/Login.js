import React, { useState, useContext } from "react";
import { AccountContext } from "./Account";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import pic from '../components/picture/logo.png'

function Login() {
  var loginName;
  var loginPassword;

  // eslint-disable-next-line
  const [message, setMessage] = useState("");
  const { authenticate } = useContext(AccountContext);

  var bp = require("./Path");
  var storage = require("../tokenStorage.js");

  const doLogin = async (event) => {
    event.preventDefault();
    
    authenticate(loginName.value, loginPassword.value)
      .then((data) => {
        console.log("Logged in!", data);

        // on successful login, send to DB
        const loginCredentials = {
          email: loginName.value,
          password: loginPassword.value,
        };
        var loginCredentialsjson = JSON.stringify(loginCredentials);
        var config = {
          method: "post",
          url: bp.buildPath("api/login"),
          headers: { "Content-Type": "application/json" },
          data: loginCredentialsjson,
        };
        axios(config)
          .then(function (response) {
            var res = response.data;
            if (res.error) {
              setMessage("User/Password combination incorrect");
            } else {
              storage.storeToken(res);
              var jwt = require("jsonwebtoken");

              // Store objectId and firstname in application for future use
              var ud = jwt.decode(storage.retrieveToken(), { complete: true });
              var id = ud.payload.id;
              

              var user = {
                id: id,
              };
              localStorage.setItem("user_data", JSON.stringify(user));
              window.location.href = "/home";
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch((err) => {
        setMessage("Incorrect Email or Password");
        console.error("Failed to login", err);
        setTimeout(function () {setMessage("");}, 3000);
      });
  };

  return (
    <div class="box">
      <div>
        <h3>Please sign in</h3>
        <p class="text-muted">Enter your login information</p>
        <div class="form-box">
          <input
            type="email"
            id="loginName"
            placeholder="Email"
            ref={(c) => (loginName = c)}
          />
        </div>
        <div class="form-box">
          <input
            type="password"
            id="loginPassword"
            placeholder="Password"
            ref={(c) => (loginPassword = c)}
          />
        </div>
        <p id="error">
          {message}
        </p>
        <a href="/Email" class="forgot">
          Forgot Password?
        </a>

        {/* <a type="button" value="Login" onClick={doLogin}>
          Login
        </a>
        <a href="/register" type="button" value="Register">
          Register
        </a> */}
        <input type="button" value="Login" onClick={doLogin}/>
        <a type ="button" value="Register" href="/register">Register</a>
      </div>
    </div>
  );
}

export default Login;
