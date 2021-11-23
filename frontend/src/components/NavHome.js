import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { IoLogOutOutline, IoAlertCircleSharp } from "react-icons/io5";
import { SidebarData } from './Sidebar';
import './Navbar.css';
import './style.css';
import { IconContext } from 'react-icons';
import pic from '../components/picture/logo_NavHome.png'
import { AccountContext } from './Account';
import aws from "aws-sdk";
import axios from "axios";

function NavHome() {

    var bp = require("./Path");
  var _ud = localStorage.getItem("user_data");
  var ud = JSON.parse(_ud);
  // eslint-disable-next-line
  var objectId = ud.id;
  var storage = require("../tokenStorage");
    const [sidebar, setSidebar] = useState(false)

    const showSidebar = () => setSidebar(!sidebar)

    const { logout } = useContext(AccountContext);

    var _ud = localStorage.getItem("user_data");
    var ud = JSON.parse(_ud);
    
    // eslint-disable-next-line
    var userId = ud.id;

    const doLogout = (event) => {
        event.preventDefault();

        localStorage.removeItem("user_data");
        logout();
        window.location.href = "/";
    };
    const { getSession } = useContext(AccountContext);

  const [accessToken, setAccessToken] = useState();
  useEffect(() => {
    getSession().then((user) => {
      setAccessToken(user.accessToken.jwtToken); // get the current user's access token
    });
  }, []);
  const cognito = new aws.CognitoIdentityServiceProvider({
    region: "us-east-2",
  });

  const doDeactivate = async () => {
    var result = window.confirm("Want to delete?");
    if(result){
        var params = {
            AccessToken: accessToken /* required */,
          };
          // Allowing user to delete himself
          cognito.deleteUser(params, (err, data) => {
            if (err) {
              console.error(err);
              return;
            }
          });
      
          // On success store user into DB
          const userToDeactivate = {
            userId: objectId,
          };
          var userToDeactivatejson = JSON.stringify(userToDeactivate);
      
          var config = {
            method: "delete",
            url: bp.buildPath("api/deactivate/"),
            headers: {
              "Content-Type": "application/json",
              Authorization: storage.retrieveToken(),
            },
            data: userToDeactivatejson,
          };
      
          axios(config)
            .then(function (response) {
              var res = response.data;
      
              if (res.error) {
                console.log("error");
              } else {
                window.location.href = "/";
              }
            })
            .catch(function (error) {
              console.log(error);
            });
    }else{
        
        alert("Account not deleted");
    }
    
  };

    return (
        <>
            <IconContext.Provider value={{ color: "#fff" }}>
                <div className='navbar'>
                    <div>
                    <Link to='#' className='menu-button'>
                        <FaIcons.FaBars onClick={showSidebar} />
                        <img src={pic} alt="logo" className="logoNavHome"/>
                    </Link>
                    </div>

                </div>
                
                <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                    <ul className='nav-menu-items' onClick={showSidebar}>
                        <li className='navbar-toggle'>
                            <Link to='#' className='menu-bar'>
                                <AiIcons.AiOutlineClose />
                            </Link>
                        </li>
                        {SidebarData.map((item, index) => {
                            return (
                                <li key={index} className={item.cName}>
                                    <Link to={item.path}>
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </Link>
                                </li>
                            )
                        })}
                        <li className="nav-text">
                            <Link onClick={doLogout}>
                                <IoLogOutOutline />
                                <span>Logout</span>
                            </Link>
                        </li>
                        <li className="nav-text">
                            <Link onClick={doDeactivate} to="/home">
                                <IoAlertCircleSharp />
                                <span>Deactivate</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </IconContext.Provider>
        </>

    );

};
export default NavHome;