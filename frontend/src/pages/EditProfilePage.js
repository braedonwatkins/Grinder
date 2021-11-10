import React from 'react';
import NavHome from '../components/NavHome';
import Card from '../components/CardUI';
import Logged from '../components/LoggedInName';
import EditProfile from '../components/EditProfile';

const EditProfilePage = () =>
{
    return(
        <div>
            
            <NavHome />
            <br />
            <EditProfile />
        </div>
    );
}

export default EditProfilePage;