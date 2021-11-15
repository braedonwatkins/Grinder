import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import './App.css';

import LoginPage from './pages/LoginPage';
import CardPage from './pages/CardPage';
import Email from './pages/Email';
import nav from 'react-bootstrap/Nav';
import { Account } from "./components/Account";
import Register from './components/Register';
import EditProfile from './pages/EditProfilePage';
<script src="https://unpkg.com/react/umd/react.production.min.js" crossorigin></script>


function App() {
  
  return (
    <Router >
      <Account>
        <Switch>
          <Route path="/" exact>
            <LoginPage />
          </Route>
          <Route path="/editprofile" exact>
            <EditProfile />
          </Route>
          <Route path="/register" exact>
            {/* Add register Component to Register Page */}
            <Register />
          </Route>
          <Route path="/home" exact>
            <CardPage />
          </Route>
          <Route path="/eMail" exact>
            <Email />
          </Route>
          <Redirect to="/" />
        </Switch>  
      </Account>
    </Router>
  );
}

export default App;