import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
    var loginName;
    var loginPassword;

    // eslint-disable-next-line
    const [message, setMessage] = useState('');

    const app_name = 'cop4331-63'
    function buildPath(route) {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        }
        else {
            return 'http://localhost:5000/' + route;
        }
    }


    const Submit = async event => {
        event.preventDefault();

        var obj = { login: loginName.value, password: loginPassword.value };
        var js = JSON.stringify(obj);

        try {
            const response = await fetch(buildPath('api/login'),
                { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            var res = JSON.parse(await response.text());

            if (res.id <= 0) {
                setMessage('User/Password combination incorrect');
            }
            else {
                var user = { firstName: res.firstName, lastName: res.lastName, id: res.id }
                localStorage.setItem('user_data', JSON.stringify(user));

                setMessage('');
                window.location.href = '/cards';
            }
        }
        catch (e) {
            alert(e.toString());
            return;
        }
    };

    return (

        <div class="box">
            <div>
                <h3>Please enter email</h3>
                <div class="form-box">
                    <input type="email" id="loginNam" placeholder="Email"  ref={(c) => loginName = c}/>
                </div>
                <input type="button" value="Submit" onClick={Submit}/>
            </div>
         </div>
    )
};

export default Login;