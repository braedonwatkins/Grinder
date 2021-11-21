import axios from "axios";
import aws from "aws-sdk";
import { AccountContext } from "./Account";
import React, { useEffect, useContext, useState } from "react";

function Deactivate() {
  var bp = require("./Path");
  var _ud = localStorage.getItem("user_data");
  var ud = JSON.parse(_ud);
  // eslint-disable-next-line
  var objectId = ud.id;
  var storage = require("../tokenStorage");

  const { getSession } = useContext(AccountContext);

  const [accessToken, setAccessToken] = useState();
  useEffect(() => {
    getSession().then((user) => {
      setAccessToken(user.accessToken.jwtToken); // get the current user's access token
    });
  }, []);
  const cognito = new aws.CognitoIdentityServiceProvider({
    region: "us-east-2",
  });

  const doDeactivate = async () => {
    var params = {
      AccessToken: accessToken /* required */,
    };
    // Allowing user to delete himself
    cognito.deleteUser(params, (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
    });

    // On success store user into DB
    const userToDeactivate = {
      userId: objectId,
    };
    var userToDeactivatejson = JSON.stringify(userToDeactivate);

    var config = {
      method: "delete",
      url: bp.buildPath("api/deactivate/"),
      headers: {
        "Content-Type": "application/json",
        Authorization: storage.retrieveToken(),
      },
      data: userToDeactivatejson,
    };

    axios(config)
      .then(function (response) {
        var res = response.data;

        if (res.error) {
          console.log("error");
        } else {
          window.location.href = "/";
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div id="deactivateDiv">
      <br />
      <button
        type="button"
        id="deactivateButton"
        class="buttons"
        onClick={doDeactivate}
      >
        Deactivate
      </button>
    </div>
  );
}

export default Deactivate;
