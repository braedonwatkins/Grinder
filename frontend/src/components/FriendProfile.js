
import axios from 'axios';
import React, { useState, useContext, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import './card.css';

export default function FriendProfile({ friendid }){
    const [Friend, setFriend] = useState("");
    const [Age, setAge] = useState("");

   useEffect(() =>{
        const id = friendid;
        var bp = require("./Path");
        console.log(id);
        const getFriend = async () =>{
            try{
                var config = {
                    method: "get",
                    url: bp.buildPath("api/getProfile/" + id),
                    //Header
                };
                axios(config)
                    .then(function (response){
                        var res = response.data;
                        if(res.error){
                            console.log(res.error);
                        }else{
                            setFriend(res.Profile.Gamertag);
                            setAge(res.Profile.Age);
                        }
                    })
            }catch(err){
              console.log(err);  
            }
        };
        getFriend();
    },[friendid]);
    return(

        
        <div className="clearfix">
            <div className="row">
                    <div className="col-md-4 animated fadeIn">
                        <div className="card">
                            <div className="card-body">
                                <div className="avatar">

                                </div>
                                <h5 className="card-title">
                                    {Friend}
                                </h5>
                                <p className="card-text">
                                    {Age}
                                    <br />
                                    <span className="phone">{Friend}</span>
                                </p>
                            </div>
                        </div>
                    </div>
            </div>
         </div>
    );
}