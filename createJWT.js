const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.createToken = function (id) {
  return _createToken(id);
};

_createToken = function (id) {
  try {
    const expiration = new Date();
    const user = { id: id };

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

    // In order to exoire with a value other than the default, use the
    // following
    /*
      const accessToken= jwt.sign(user,process.env.ACCESS_TOKEN_SECRET, 
         { expiresIn: '30m'} );
                       '24h'
                      '365d'
      */

    var ret = { accessToken: accessToken };
  } catch (e) {
    var ret = { error: e.message };
  }
  return ret;
};

exports.isExpired = function (token) {
  var isError = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, verifiedJwt) => {
      if (err) {
        return true;
      } else {
        return false;
      }
    }
  );

  return isError;
};

exports.refresh = function (token) {
  var ud = jwt.decode(token, { complete: true });

  var id = ud.payload.id;
  

  return _createToken(id);
};
