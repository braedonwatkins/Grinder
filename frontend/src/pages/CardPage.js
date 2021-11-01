import React from 'react';
import NavHome from '../components/NavHome';
import Card from '../components/CardUI';
import Logged from '../components/LoggedInName';

const CardPage = () =>
{
    return(
        <div>
            
            <NavHome />
            <br />
            <Card />
            <Logged />
        </div>
    );
}

export default CardPage;