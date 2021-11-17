import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as IoIcons5 from "react-icons/io5";
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';

export const SidebarData = [
    {
        title: 'Home',
        path: '/home',
        icon: <AiIcons.AiFillHome />,
        cName: 'nav-text',
    },
    {
        title: 'Friends',
        path: '/Friends',
        icon: <IoIcons5.IoBodySharp />,
        cName: 'nav-text',
    },
    {
        title: 'Edit',
        path: '/editprofile',
        icon: <IoIcons5.IoPencil />,
        cName: 'nav-text',
    },
]
