exports.setApp = function ( app, client )
{
    //load user model
    const User = require("./models/user.js");
    //load card model
    const Card = require("./models/card.js");
    const bcrypt = require("bcrypt");

  //REGISTER
    app.post('/api/signup', async (req, res, next) =>
    {
      try{
        // check if email already exists
      const user = await User.findOne({Login: req.body.login});
      user && res.status(409).json("Email Already Exists");

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      try
      {
        if( token.isExpired(jwtToken))
        {
          var r = {error:'The JWT is no longer valid', jwtToken: ''};
          res.status(200).json(r);
          return;
        }
      }
      catch(e)
      {
        console.log(e.message);
      }
    
      const newUser = new User({ FirstName: req.body.firstname, 
        LastName: req.body.lastname, 
        Login: req.body.login, 
        Password: hashedPassword});
      var error = 'Signed up successfully';
    
      try
      {
        // Save new user to database
        newUser.save();
      }
      catch(e)
      {
        error = e.toString();
      }
    
      var refreshedToken = null;
      try
      {
        refreshedToken = token.refresh(jwtToken);
      }
      catch(e)
      {
        console.log(e.message);
      }
    
      var ret = { error: error, jwtToken: refreshedToken };
      }catch(err){
        res.status(500).json(err);
    } 
      
      res.status(200).json(ret);
    });


    //LOGIN
    app.post('/api/login', async (req, res, next) => 
    {
    
      var error = '';
      try{
        const user = await User.findOne({Login: req.body.login});
        !user && res.status(404).json("User not found");
  
        const validPassword = await bcrypt.compare(req.body.password, user.Password);
        !validPassword && res.status(400).json("Wrong password");

        var id = -1;
        var fn = '';
        var ln = '';
        var ret;

        if( user.length !== 0 )
        {
          id = user.UserId;
          fn = user.FirstName;
          ln = user.LastName;
          try
          {
            const token = require("./createJWT.js");
            ret = token.createToken( fn, ln, id );
          }
          catch(e)
          {
            ret = {error:e.message};
          }
        }
        else
        {
            ret = {error:"Login/Password incorrect"};
        }
      }catch(err){
        res.status(500).json(err);
      }
      res.status(200).json(ret);
    }
    // Add get user profile api
    );
}
