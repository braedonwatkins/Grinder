import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
function navBar()
{
   return(
    <header class="p-3 bg-dark text-white">
    <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mbmd-0">
            <li><a href="/" class="nav-link px-2 text-white">Home</a></li>
        </ul>
    </div>
    </header>
   );
};
export default navBar;