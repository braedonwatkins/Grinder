import React from 'react';
//import NavHome from '../components/NavHome';
import NavBar from '../components/navBar'
import Card from '../components/CardUI';
import Logged from '../components/LoggedInName';
import EditProfile from '../components/EditProfile';

const EditProfilePage = () =>
{
    return(
        <div>
            
            <NavBar />
            <br />
            <EditProfile />
        </div>
    );
}

export default EditProfilePage;