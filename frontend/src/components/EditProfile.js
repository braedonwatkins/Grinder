import React, { useState, useContext, useEffect } from "react";
import { AccountContext } from './Account';
import UserPool from "../UserPool";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown } from "react-bootstrap";
import { resolve } from "path";
import { Link } from 'react-router-dom';
import { rejects } from "assert";
import ImageResize from "../components/ImageResizer";


function EditProfile() {
  const [genreList, setGenreList] = useState([]);
  const [gamerTag, setGamerTag] = useState("");
  const [age, setAge] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const { getSession } = useContext(AccountContext);
  const [imageToResize, setImageToResize] = useState(undefined);
  const [resizedImage, setResizedImage] = useState(undefined);
  const [confirm, setConfirm] = useState("");

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

  useEffect(() => {
    const getUser = async () => {
      try {
        var config = {
          method: "get",
          url: bp.buildPath("api/getUser/" + userId),
          headers: { Authorization: storage.retrieveToken() },
        };
        const resp = await axios(config);
        setGamerTag(resp.data.Profile.Gamertag);
        setGenreList(resp.data.Profile.Favgenre);
        setAge(resp.data.Profile.Age);
        setBio(resp.data.Profile.Bio);
        setProfilePic(resp.data.Profile.ProfilePicture);
      } catch (err) {
        console.error(err);
      }
    };
    getUser();
  }, [userId]);

  const onUploadFile = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setImageToResize(event.target.files[0]);
    }
  };
  //Put cutBase64 into database
  let base64 = String(resizedImage);
  let cutBase64 = base64.slice(22);

  const handleCheckboxChange = (event) => {
    let newArray = [...genreList, event.target.id];
    if (genreList.includes(event.target.id)) {
      newArray = newArray.filter((day) => day !== event.target.id);
    } else {
    }
    setGenreList(newArray);
  };

  const onSubmit = async () =>{
    if(cutBase64 === undefined || cutBase64 === "")
    {
      cutBase64 = profilePic;
    }else if(cutBase64 !== undefined || cutBase64 !== ""){
      setProfilePic(cutBase64);
    }
    const newProfile = {
      Profile:{
        Gamertag: gamerTag,
        ProfilePicture: cutBase64,
        Favgenre: [...genreList],
        Bio: bio,
        Age: age
      }
    }
    try{
      var config ={
        method: "put",
        url: bp.buildPath("api/edit/"),
        headers: {Authorization: storage.retrieveToken() },
        data: newProfile,
      }
      const resp = await axios(config);
      setConfirm(resp.data);
    }catch(e){
      console.error(e);
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
              <br />
              {profilePic ? <img src={`data:image/png;base64,${profilePic}`} class="profilepic" /> : ''}
              <br />
              <div className="row">
              <div className="col-md-10 inputSpacing">
                  <br />
                  <label className="editProfileLabels">Profile Picture(PNG)</label>
                  <br />
                  <input type="file" className="editProfileLabels" id="file" accept=".png" onChange={onUploadFile} aria-label="File browser example" />
                  <div> <ImageResize
                    imageToResize={imageToResize}
                    onImageResized={(resizedImage) => setResizedImage(resizedImage)}
                  /></div>
                </div>
                <div className="col-md-10 inputSpacing">
                  <label className="editProfileLabels">Gamertag</label>
                  <input type="gamertag" className="editProfileFields" defaultValue={gamerTag} onChange={(c) => setGamerTag(c.target.value)} />
                </div>
                <div className="col-md-10 inputSpacing">
                  <label className="editProfileLabels">Age</label>
                  <input type="age" className="editProfileFields" defaultValue={age} onChange={(c) => setAge(c.target.value)} />
                </div>
                {/* dont want to edit email */}
                {/* <div className="col-md-10 inputSpacing">
                <div className="form-group">
                  <label className="editProfileLabels">Email</label>
                  <input type="email" className="editProfileFields" defaultValue='' />
                </div>
              </div> */}
                
                <div className="col-md-11 inputSpacing">
                  <div className="form-group editProfileLabels">
                    <label className="" rows="10" cols="100">Bio</label>
                    <textarea
                      type="bio"
                      className="editProfileFields"
                      rows={4}
                      cols={4}
                      defaultValue={bio}
                      wrap="hard"
                      onChange={(c) => setBio(c.target.value)}
                    />
                  </div>
                </div>

              </div>
              <div>
                <h5>Select your genre(s):</h5>
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="FPS"
                    value="FPS"
                    onChange={handleCheckboxChange}
                    checked = {genreList.includes("FPS") ? "checked" : ""}
                  />
                  <label className="custom-control-label" htmlFor="FPS">
                    FPS
                  </label>
                </div>
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="MOBA"
                    value="MOBA"
                    onChange={handleCheckboxChange}
                    checked = {genreList.includes("MOBA") ? "checked" : ""}
                  />
                  <label className="custom-control-label" htmlFor="MOBA">
                    MOBA
                  </label>
                </div>
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="RTS"
                    value="RTS"
                    onChange={handleCheckboxChange}
                    checked = {genreList.includes("RTS") ? "checked" : ""}
                  />
                  <label className="custom-control-label" htmlFor="RTS">
                    RTS
                  </label>
                </div>
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="RPG"
                    value="RPG"
                    checked = {genreList.includes("RPG") ? "checked" : ""}
                    onChange={handleCheckboxChange}
                  />
                  <label className="custom-control-label" htmlFor="RPG">
                    RPG
                  </label>
                </div>
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="Action"
                    value="Action"
                    checked = {genreList.includes("Action") ? "checked" : ""}
                    onChange={handleCheckboxChange}
                  />
                  <label className="custom-control-label" htmlFor="Action">
                    Action
                  </label>
                </div>
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="Simulation"
                    value="Simulation"
                    checked = {genreList.includes("Simulation") ? "checked" : ""}
                    onChange={handleCheckboxChange}
                  />
                  <label className="custom-control-label" htmlFor="Simulation">
                    Simulation
                  </label>
                </div>
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="Fighting"
                    value="Fighting"
                    checked = {genreList.includes("Fighting") ? "checked" : ""}
                    onChange={handleCheckboxChange}
                  />
                  <label className="custom-control-label" htmlFor="Fighting">
                  Fighting
                  </label>
                </div>
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="Platformer"
                    value="Platformer"
                    checked = {genreList.includes("Platformer") ? "checked" : ""}
                    onChange={handleCheckboxChange}
                  />
                  <label className="custom-control-label" htmlFor="Platformer">
                  Platformer
                  </label>
                </div>
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="MMO"
                    value="MMO"
                    checked = {genreList.includes("MMO") ? "checked" : ""}
                    onChange={handleCheckboxChange}
                  />
                  <label className="custom-control-label" htmlFor="MMO">
                  MMO
                  </label>
                </div>
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="Survival"
                    value="Survival"
                    checked = {genreList.includes("Survival") ? "checked" : ""}
                    onChange={handleCheckboxChange}
                  />
                  <label className="custom-control-label" htmlFor="Survival">
                  Survival
                  </label>
                </div>
              </div>
              <div>
                <a type="button" onClick={onSubmit}>Update</a>
                <a type="button"href="/home">Cancel</a>
              </div>
              <div>{confirm}</div>
            </div>

          </div>

        </div>
      </section>
    </>
  );


};

export default EditProfile

