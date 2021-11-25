import React, { useState, useContext, useEffect } from "react";
import { AccountContext } from './Account';
import UserPool from "../UserPool";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { resolve } from "path";
import { rejects } from "assert";
var fs = require('fs');


function EditProfile() {
  const [genreList, setGenreList] = useState([]);
  const [gamerTag, setGamerTag] = useState("");
  const [age, setAge] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [file, setFile] = useState(null);
  const { getSession } = useContext(AccountContext);

  var bp = require("./Path");
  var storage = require("../tokenStorage");

  useEffect(() => {
    getSession()
      .then(() => {
        // user is logged in
        setLoggedIn(true);
      })
      .catch(() => {
        window.location.href = "/";
      });
  }, []);

  var _ud = localStorage.getItem("user_data");
  var ud = JSON.parse(_ud);
  var userId = ud.id;

    useEffect(()=>{
        const getUser = async() =>{
            try{
                var config = {
                    method: "get",
                    url: bp.buildPath("api/getUser/" + userId),
                    headers: { Authorization: storage.retrieveToken() },
                };
                const resp = await axios(config);
                // console.log(resp);
                setGamerTag(resp.data.Profile.Gamertag);
                setGenreList(resp.data.Profile.Favgenre);
                setAge(resp.data.Profile.Age);
                setBio(resp.data.Profile.Bio);
                setProfilePic(resp.data.Profile.ProfilePicture);
                // console.log(resp.data.Profile.ProfilePicture);
                } catch (err){
                    console.log(err);
                }
        };
        getUser();
    },[userId]);
    
    const onSubmit = async (e) => {
      // Sending updated information to DB

      if(file) {
        console.log(file);
        console.log(file.name);
        console.log(file.size);    
      } 
    }

    return (loggedIn &&
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
                  <input type="gamertag" className="editProfileFields" defaultValue={ gamerTag } />
              </div>
              <div className="col-md-10 inputSpacing">
                  <label className="editProfileLabels">Age</label>
                  <input type="age" className="editProfileFields" defaultValue={age} />
              </div>
              {/* dont want to edit email */}
              {/* <div className="col-md-10 inputSpacing">
                <div className="form-group">
                  <label className="editProfileLabels">Email</label>
                  <input type="email" className="editProfileFields" defaultValue='' />
                </div>
              </div> */}
              <div className="col-md-10 inputSpacing">
                  <label className="editProfileLabels">Profile Picture</label>
                  <br/>
                  <input type="file" className="editProfileLabels" id="file" onChange ={(f)=> setFile(f.target.files[0])} aria-label="File browser example"/>

              </div>
              <div className="col-md-11 inputSpacing">
                <div className="form-group editProfileLabels">
                  <label className="" rows="10" cols="100">Bio</label>
                  <textarea
                    type="bio"
                    className="editProfileFields"
                    rows={4}
                    defaultValue = {bio}
                  />
                </div>
              </div>
              <div className="col-md-11 inputSpacing">
                <div className="form-group editProfileLabels">
                  <label className="" rows="10" cols="100">Genres</label>
                  <p class="text-muted mutedText">Enter genres with commas in between (ex. FPS, MOBA, Fighter, ...)</p>
                  <textarea
                    type="bio"
                    className="editProfileFields"
                    rows={4}
                    defaultValue = {genreList}
                    
                  />
                </div>
              </div>
            </div>
            <div>
                <a type="button" onClick = {onSubmit()}>Update</a>
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

