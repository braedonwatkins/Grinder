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
  <section className="py-5 my-5">
    <div className="container">
      
      <div className="editProfileBox shadow rounded-lg d-block d-sm-flex" class="editProfileBox">
        <div className="profile-tab-nav border-right">
          <div className="p-4">
            <div className="img-circle text-center mb-3">
              <img src="img/user2.jpg" alt="Image" className="shadow" />
            </div>
            <h4 className="text-center">Test Name</h4>
          </div>
          <div
            className="nav flex-column nav-pills"
            id="v-pills-tab"
            role="tablist"
            aria-orientation="vertical"
          >
            <a
              className="nav-link active"
              id="account-tab"
              data-toggle="pill"
              href="#account"
              role="tab"
              aria-controls="account"
              aria-selected="true"
            >
              <i className="fa fa-home text-center mr-1" />
              Account
            </a>
            <a
              className="nav-link"
              id="password-tab"
              data-toggle="pill"
              href="#password"
              role="tab"
              aria-controls="password"
              aria-selected="false"
            >
              <i className="fa fa-key text-center mr-1" />
              Password
            </a>
            
            
          </div>
        </div>
        <div className="tab-content p-4 p-md-5" id="v-pills-tabContent">
          <div
            className="tab-pane fade show active"
            id="account"
            role="tabpanel"
            aria-labelledby="account-tab"
          >
            <h3 className="mb-4">Edit Profile</h3>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" className="form-control" defaultValue='' />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" className="form-control" defaultValue='' />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Email</label>
                  <input type="text" className="form-control" defaultValue='' />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Phone number</label>
                  <input type="text" className="form-control" defaultValue='' />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Company</label>
                  <input type="text" className="form-control" defaultValue='' />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Designation</label>
                  <input type="text" className="form-control" defaultValue='' />
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    defaultValue={""}
                  />
                </div>
              </div>
            </div>
            <div>
                <a type="button">Update</a>
                <a type="button">Cancell</a>
            </div>
          </div>
          <div
            className="tab-pane fade"
            id="password"
            role="tabpanel"
            aria-labelledby="password-tab"
          >
            <h3 className="mb-4">Password Settings</h3>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Old password</label>
                  <input type="password" className="form-control" />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>New password</label>
                  <input type="password" className="form-control" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Confirm new password</label>
                  <input type="password" className="form-control" />
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
    </div>
  </section>
</>
);

};

export default EditProfile

