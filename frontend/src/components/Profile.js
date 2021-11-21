import React, { useState, useContext } from "react";
import { AccountContext } from "./Account";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import pic from "../components/picture/Nezuko.png";

function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  var bp = require("./Path");
  const [genreList, setGenreList] = useState([]);
  const [gamerTag, setGamerTag] = useState("");
  const [age, setAge] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState("");

  var storage = require("../tokenStorage");

  /*const searchCard = async event => {
        var resultText = '';
        try {
            for (var i = 0; i < genre.length; i++) {
                resultText += genre[i];
                resultText += '\n';
            }
            //setGenreList(resultText);

        }
        catch (e) {
            alert(e.toString());
        }
    };*/
  var _ud = localStorage.getItem("user_data");
  var ud = JSON.parse(_ud);
  // eslint-disable-next-line

  var config = {
    method: "get",
    url: bp.buildPath("api/getUser/"),
    headers: { Authorization: storage.retrieveToken() },
  };
  axios(config)
    .then(function (response) {
      var res = response.data;
      if (res.error) {
        alert("HI");
      } else {
        setGamerTag(res.Profile.Gamertag);
        setAge(res.Profile.Age);
        setBio(res.Profile.Bio);
        //setGenreList(res.Profile.Favgenre);
        setProfilePic(res.Profile.ProfilePicture);
      }
    })
    .catch(function (error) {
      console.log("ERROR");
    });

  return (
    <div class="profile">
      <div class="name">
        <h3>{gamerTag}</h3>
        <h3>{age}</h3>
        <div class="row-sm-12">
          <img
            src={profilePic === "" ? `${PF}noAvatar.png` : PF + profilePic}
            alt="profile pic"
          />
        </div>
        <div class="row">
          <div class="col-sm-6">
            <p>Genre</p>
            <ul class="text list">
              {genreList.map((item) => {
                return <li>{item}</li>;
              })}
            </ul>
          </div>
          <div class="col-sm-6">
            <p>BIO</p>
            <p class="text">{bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
