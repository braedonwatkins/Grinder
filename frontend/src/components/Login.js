import React, { useState, useContext } from 'react';
import { AccountContext } from './Account';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';


function Login()
{
    var loginName;
    var loginPassword;

    // eslint-disable-next-line
    const [message,setMessage] = useState('');
    const { authenticate } = useContext(AccountContext);

    var bp = require("./Path");

    
    const doLogin = async event => 
    {
        event.preventDefault();
        console.log(loginName.value + " " + loginPassword.value + " about to authenticate");
        authenticate(loginName.value, loginPassword.value)
            .then((data) => {
                console.log("Logged in!", data);

                // on successful login, send to DB
                const loginCredentials = {
                    email: loginName.value,
                    password: loginPassword.value
                };
                var loginCredentialsjson = JSON.stringify(loginCredentials);
                var config = {
                    method: "post",
                    url: bp.buildPath("api/login"),
                    headers: { "Content-Type": "application/json"},
                    data: loginCredentialsjson,
                };
                axios(config)
                .then(function (response) {
                    var res = response.data;
                    if (res.error) {
                      
                    } else {
                      
                    }
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
                  window.location.href = "/home";
            })
            .catch((err) => {
                console.error("Failed to login", err);
            });
    };

    return(
        <div class="box">
        <div>
            <h3>Please sign in</h3>
            <div class="form-box">
                <input type="email" id="loginName" placeholder="Email / Username"  ref={(c) => loginName = c}/>
            </div>
            <div class="form-box">
                <input type="password" id="loginPassword" placeholder="Password" ref={(c) => loginPassword = c} />
            </div>
            <a href="/Email" class="forgot">Forgot Password?</a>

            <a type = "button" value="Login" onClick={doLogin}>Login</a>
            <a href="/register" type ="button" value="Register">Register</a>
        </div>
     </div>
    );
};

export default Login;
