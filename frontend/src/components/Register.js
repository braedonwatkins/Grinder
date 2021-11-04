import React, { useState } from "react";
import UserPool from "../UserPool";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  var bp = require("./Path");

  var att = [
    {
      Name: "name",
      Value: name,
    },
  ];

  const onSubmit = (event) => {
    event.preventDefault();
    // AMAZON COGNITO - needs email, password , only attribute needed is name
    UserPool.signUp(email, password, att, null, (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      // On success store user into DB
      const newUser = {
        firstname: name,
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
            window.location.href = "/";
          } else {
            window.location.href = "/";
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label htmlFor="name">Firstname</label>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
        ></input>
        <label htmlFor="email">Email</label>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        ></input>
        <label htmlFor="password">Password</label>
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        ></input>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;