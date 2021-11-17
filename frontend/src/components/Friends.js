import React, { useState, useContext, useEffect } from 'react';
import { AccountContext } from './Account';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import pic from '../components/picture/Nezuko.png'
import Profile from './FriendProfile';

function Friends() {
    var bp = require("./Path");
    const [friendList, setFriendList] = useState([]);
    var _ud = localStorage.getItem("user_data");
    var ud = JSON.parse(_ud);
    // eslint-disable-next-line

    var userId = ud.id;
    useEffect(()=>{
        const getFriend = async() =>{
            try{
                var config = {
                    method: "get",
                    url: bp.buildPath("api/getFriends/" + userId),
                };
                axios(config)
                    .then(function (response) {
                        var res = response.data;
                        if (res.error) {
                            alert("Error");
                        } else {
                            setFriendList(res.Friends);
                        }
            
                    })
                    .catch(function (error) {
                        console.log("ERROR");
                    });
                } catch (err){
                    console.log(err);
                }
        };
        getFriend();
    },[userId]);
    
    
     
    return (
        <div>
               {friendList.map((c)=>(
                   <Profile friendid={c}/>
               ))}
               
        </div>
    );
}
export default Friends;