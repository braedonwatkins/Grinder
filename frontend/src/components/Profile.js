import React, { useState, useContext, useEffect } from "react";
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
                console.log(resp);
                setGamerTag(resp.data.Profile.Gamertag);
                setGenreList(resp.data.Profile.Favgenre);
                setAge(resp.data.Profile.Age);
                setBio(resp.data.Profile.Bio);
                setProfilePic(resp.data.Profile.ProfilePicture);
                console.log(resp.data.Profile.ProfilePicture);
                } catch (err){
                    console.log(err);
                }
        };
        getUser();
    },[userId]);

  return (
    <div class="profile">
      <div class="name">
        <div class="tag">
        <h3 >{gamerTag}</h3>
        <h3>{age}</h3>
        </div>
        
        <div class="row-sm-12">
          <img className="conversationImg" src={profilePic === "" ? `${PF}noAvatar.png`: PF + profilePic}  />
        </div>
        <div class="row">
          <div class="col-sm-6">
            <p>Genre</p>
            <ul class="text list">
              {genreList.map((item) => {
                return <li key ={item}>{item}</li>;
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
//{profilePic ? <img src={`data:image/png;base64,${profilePic}`} class="profilepic"/>: ''}