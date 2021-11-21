import React, { useState } from "react";
import { AccountContext } from './Account';
import UserPool from "../UserPool";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

function EditProfile() {
    return (
        <>
  <meta charSet="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Grinder</title>
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
    rel="stylesheet"
    integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
    crossOrigin="anonymous"
  />
  <link rel="stylesheet" type="text/css" href="style.css" />
  <meta
    content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
    name="viewport"
  />
  <link
    rel="stylesheet"
    type="text/css"
    href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
  />
  <link
    rel="stylesheet"
    href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
  />
  <section className="editProfileContainer py-5 my-2 ">
    <div className="container box editProfileContainer">
      <div className="editProfileBox box" class="editProfileBox">          
          <div className="editProfileFields" id="v-pills-tabContent">
            <h3 className="editProfileHeader">Edit Profile</h3>
            <br/>
            <h4 className="editProfileGamertag">Test Name </h4>
            <br/>
            <div className="row">
              <div className="col-md-10 inputSpacing">
                  <label className="editProfileLabels">Gamertag</label>
                  <input type="gamertag" className="editProfileFields" defaultValue='' />
              </div>
              <div className="col-md-10 inputSpacing">
                  <label className="editProfileLabels">Age</label>
                  <input type="age" className="editProfileFields" defaultValue='' />
              </div>
              <div className="col-md-10 inputSpacing">
                <div className="form-group">
                  <label className="editProfileLabels">Email</label>
                  <input type="email" className="editProfileFields" defaultValue='' />
                </div>
              </div>
              <div className="col-md-10 inputSpacing">
                  <label className="editProfileLabels">Profile Picture</label>
                  <br/>
                  <input type="file" className="editProfileLabels" id="file" aria-label="File browser example"/>

              </div>
              <div className="col-md-11 inputSpacing">
                <div className="form-group editProfileLabels">
                  <label className="" rows="10" cols="100">Bio</label>
                  <textarea
                    type="bio"
                    className="editProfileFields"
                    rows={4}
                    
                  />
                </div>
              </div>
            </div>
            <div>
                <a type="button">Update</a>
                <a type="button">Cancel</a>
            </div>
          </div>
          
        </div>
      
    </div>
  </section>
</>
);

};

export default EditProfile

