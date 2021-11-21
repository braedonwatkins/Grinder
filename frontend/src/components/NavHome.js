import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { IoLogOutOutline } from "react-icons/io5";
import { SidebarData } from './Sidebar';
import './Navbar.css';
import './style.css';
import { IconContext } from 'react-icons';
import pic from '../components/picture/logo_NavHome.png'
import { AccountContext } from './Account';

function NavHome() {

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
                    </ul>
                </nav>
            </IconContext.Provider>
        </>

    );

};
export default NavHome;