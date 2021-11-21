import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { CognitoUser } from "amazon-cognito-identity-js";
import Pool from "../UserPool";
import { reject, resolve } from "bcrypt/promises";
import axios from "axios";

function Login() {
  var loginName;
  var loginPassword;
  var bp = require("./Path");
  // eslint-disable-next-line
  const [message, setMessage] = useState("");

  const app_name = "cop4331-63";
  function buildPath(route) {
    if (process.env.NODE_ENV === "production") {
      return "https://" + app_name + ".herokuapp.com/" + route;
    } else {
      return "http://localhost:5000/" + route;
    }
  }

  const Submit = async (event) => {
    event.preventDefault();

    var obj = { login: loginName.value, password: loginPassword.value };
    var js = JSON.stringify(obj);

    try {
      const response = await fetch(buildPath("api/login"), {
        method: "POST",
        body: js,
        headers: { "Content-Type": "application/json" },
      });

      var res = JSON.parse(await response.text());

      if (res.id <= 0) {
        setMessage("User/Password combination incorrect");
      } else {
        var user = {
          firstName: res.firstName,
          lastName: res.lastName,
          id: res.id,
        };
        localStorage.setItem("user_data", JSON.stringify(user));

        setMessage("");
        window.location.href = "/cards";
      }
    } catch (e) {
      alert(e.toString());
      return;
    }
  };
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState(1); // 1 = email stage, 2 = code stage

  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");

  const getUser = () => {
    return new CognitoUser({
      Username: email.toLowerCase(),
      Pool,
    });
  };

  const sendCode = (event) => {
    event.preventDefault();

    getUser().forgotPassword({
      onSuccess: (data) => {
        console.log("onSucces: ", data);
      },
      onFailure: (err) => {
        console.log("onFailure: ", err);
      },
      inputVerificationCode: (data) => {
        console.log("Input code: ", data);
        setStage(2);
      },
    });
  };

  const resetPassword = (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }

    // Change password on Amazon Cognito User Pool
    getUser().confirmPassword(code, password, {
      onSuccess: (data) => {
        console.log("onSuccess: ", data);
        // On success, update database
        const newPassword = {
          email: email,
          password: password,
        };
        // Make a new json
        var newPasswordjson = JSON.stringify(newPassword);

        // Send new password json to api
        var config = {
          method: "post",
          url: bp.buildPath("api/resetpassword"),
          headers: { "Content-Type": "application/json" },
          data: newPasswordjson,
        };

        axios(config)
          .then(function (response) {
            var res = response.data;
            if (res.error) {
              setMessage(res.error);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      onFailure: (err) => {
        console.error("onFailure: ", err);
      },
    });
  };
  /*return (

        <div class="box">
            <div>
                <h3>Please enter email</h3>
                <div class="form-box">
                    <input type="email" id="loginNam" placeholder="Email"  ref={(c) => loginName = c}/>
                </div>
                <a type="button" value="Submit" onClick={Submit}>Submit</a>
            </div>
         </div>
    )*/
  return (
    <div class="box">
      <div class="form-box">
        {stage == 1 && (
          <form onSubmit={sendCode}>
            <h3>Password Reset</h3>
            <p class="text-muted">Please enter your account email</p>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <button class="button" type="submit">
              Submit
            </button>
          </form>
        )}

        {stage == 2 && (
          <form onSubmit={resetPassword}>
            <h3>Please Fill out boxes</h3>
            <p class="text-muted">If you did not receive an email try again</p>
            <input
              type="text"
              placeholder="Verifcation Code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(event) => setconfirmPassword(event.target.value)}
            />
            <button class="button" type="submit">
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;
