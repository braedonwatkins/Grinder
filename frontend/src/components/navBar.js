import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import pic from '../components/picture/logo_light_small.png'

function navBar()
{
   return(
    <header class="p-1 bg-dark text-white">
    <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mbmd-0">
            <li><a href="/" class="nav-link px-2 text-white"><img src={pic} alt="logo" className="logo"/></a></li>
        </ul>
    </div>
    </header>
   );
};
export default navBar;