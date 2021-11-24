import React, { useState, useContext, useEffect } from 'react';
import { AccountContext } from './Account';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import pic from '../components/picture/Nezuko.png'
import Profile from './FriendProfile';

function Friends() {
    const { getSession } = useContext(AccountContext);
    useEffect(() => {
        getSession()
        .then(() => {
            // user is logged in
        })
        .catch(() => {
            window.location.href = "/";
        });
    }, []);
    
    var bp = require("./Path");
    const [friendList, setFriendList] = useState([]);
    var _ud = localStorage.getItem("user_data");
    var ud = JSON.parse(_ud);
    // eslint-disable-next-line
    var storage = require("../tokenStorage");

    var userId = ud.id;
    useEffect(()=>{
        const getFriend = async() =>{
            try{
                var config = {
                    method: "get",
                    url: bp.buildPath("api/getFriends/" + userId),
                    headers: { Authorization: storage.retrieveToken() },
                };
                const resp = await axios(config);
                console.log(resp.data.Friends);
                setFriendList([...resp.data.Friends]);
                } catch (err){
                    console.log(err);
                }
        };
        getFriend();
    },[userId]);
    return (
        <section className="editProfileContainer py-5 my-2 ">
            <div className="container box editProfileContainer friendsBox">
                <h3 className="editProfileHeader">Friends List</h3>
                <div className="friendsBox">
                    <div>
                    {
                        <Profile friendid={friendList}/> 
                    }
                    </div>
                </div>
            </div>
        </section>
    );
}
export default Friends;