import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login()
{
    var loginName;
    var loginPassword;

    // eslint-disable-next-line
    const [message,setMessage] = useState('');

    const app_name = 'cop4331-grinder'
    function buildPath(route)
    {
        if (process.env.NODE_ENV === 'production') 
        {
            return 'https://' + app_name +  '.herokuapp.com/' + route;
        }
        else
        {        
            return 'http://localhost:5000/' + route;
        }
    }

    
    const doLogin = async event => 
    {
        event.preventDefault();

        var obj = {login:loginName.value,password:loginPassword.value};
        var js = JSON.stringify(obj);

        try
        {    
            const response = await fetch(buildPath('api/login'),
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());

            if( res.id <= 0 )
            {
                setMessage('User/Password combination incorrect');
            }
            else
            {
                var user = {firstName:res.firstName,lastName:res.lastName,id:res.id}
                localStorage.setItem('user_data', JSON.stringify(user));

                setMessage('');
                window.location.href = '/cards';
            }
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }    
    };

    return(
        <div class="box">
        <div>
            <h3>Please sign in</h3>
            <div class="form-box">
                <input type="email" id="loginNam" placeholder="Email / Username"  ref={(c) => loginName = c}/>
            </div>
            <div class="form-box">
                <input type="password" id="loginPassword" placeholder="Password" ref={(c) => loginPassword = c} />
            </div>
            <a href="/Email" class="forgot">Forgot Password?</a>

            <input type="button" value="Login" onClick={doLogin}/>
            <input type ="button" value="Register" />
        </div>
     </div>
    );
};

export default Login;
