exports.setApp = function (app, client) {
  //load user model
  const User = require("./models/user.js");
  //load card model
  // const Card = require("./models/card.js");
  const bcrypt = require("bcrypt");

  //REGISTER
  app.post("/api/signup", async (req, res, next) => {
    // try{
    //   // check if email already exists
    // const user = await User.findOne({Email: req.body.email});
    // user && res.status(409).json("Email Already Exists");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    try {
      if (token.isExpired(jwtToken)) {
        var r = { error: "The JWT is no longer valid", jwtToken: "" };
        res.status(200).json(r);
        return;
      }
    } catch (e) {
      console.log(e.message);
    }

    const newUser = new User({
      FirstName: req.body.firstname,
      Email: req.body.email,
      Password: hashedPassword,
    });
    var error = "Signed up succesfully";
    try {
      // Save new user to database
      newUser.save();
    } catch (e) {
      error = e.toString();
    }

    var refreshedToken = null;
    try {
      refreshedToken = token.refresh(jwtToken);
    } catch (e) {
      console.log(e.message);
    }

    var ret = { error: error, jwtToken: refreshedToken };
    //   }catch(err){
    //     res.status(500).json(err);
    // }

    res.status(200).json(ret);
  });

  //LOGIN
  app.post("/api/login", async (req, res, next) => {
    var error = "";
    try {
      const user = await User.findOne({ Email: req.body.email });
      !user && res.status(404).json("User not found");

      const validPassword = await bcrypt.compare(
        req.body.password,
        user.Password
      );
      !validPassword && res.status(400).json("Wrong password");

      var id = -1;
      var fn = "";
      var ret;

      if (user.length !== 0) {
        id = user.id;
        fn = user.FirstName;
        console.log(id);
        console.log(fn);

        try {
          const token = require("./createJWT.js");
          ret = token.createToken(fn, id);
        } catch (e) {
          ret = { error: e.message };
        }
      } else {
        ret = { error: "Login/Password incorrect" };
      }
    } catch (err) {
      res.status(500).json(err);
    }
    res.status(200).json(ret);
  });

  // MATCH
  app.put("/api/:curId/match", async (req, res) => {
    if (req.body.userId !== req.params.curId) {
      try {
        const currentUser = await User.findById(req.params.curId); // current user
        const user = await User.findById(req.body.userId); // user to match with

        if (!currentUser.Friends.includes(req.body.userId)) {
          await currentUser.updateOne({ $push: { Friends: req.body.userId } });
          await user.updateOne({ $push: { Friends: req.params.curId } });
          res.status(200).json("Users have been matched");
        } else {
          res.status(403).json("You already matched with this user");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("You can't match with yourself");
    }
  });

  //UNMATCH
  app.put("/api/:curId/unmatch", async (req, res) => {
    if (req.body.userId !== req.params.curId) {
      try {
        const currentUser = await User.findById(req.params.curId); // current user
        const user = await User.findById(req.body.userId); // user to unmatch with

        if (currentUser.Friends.includes(req.body.userId)) {
          await currentUser.updateOne({
            $pull: { Friends: req.body.userId },
          });
          await user.updateOne({
            $pull: { Friends: req.params.curId },
          });
          res.status(200).json("Users have been unmatched");
        } else {
          res.status(403).json("You aren't matched with this user");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("You can't unmatch yourself");
    }
  });

  // get user
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      // In order to not bring password to client side put into internal doc
      const { Password, ...other } = user._doc;
      res.status(200).json(other);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  // new conversation
  app.post("/api/conversation", async (req, res, next) => {
    const newConversation = new Conversation({
      users: [req.body.senderId, req.body.recieverId],
    });
    try {
      const savedConversation = await newConversation.save();
      res.status(200).json(savedConversation);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  // get convo of a user
  app.get("/api/conversation/:userId", async (req, res, next) => {
    try {
      const conversation = await Conversation.find({
        users: { $in: [req.params.userId] },
      });
      res.status(200).json(conversation);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  // add message
  app.post("/api/message", async (req, res, next) => {
    const newMessage = new Message(req.body);

    try {
      const savedMessage = await newMessage.save();
      res.status(200).json(savedMessage);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  // get messages
  app.get("/api/message/:conversationId", async (req, res, next) => {
    try {
      const messages = await Message.find({
        conversationId: req.params.conversationId,
      });
      res.status(200).json(messages);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  //EDIT PROFILE
  // work in progress
  app.put('/api/edit/:profileId', async (req, res) => {
    try{
      const profile = await User.findById(req.params.profileId);
      await profile.updateOne({$set: {Gamertag: req.body.Gamertag}, });
      profile.Profile.

      //await profile.updateOne({$push: {Gamertag: req.body.Gamertag}, }).;
      res.status(200).json(profile);
    } catch(err) {
        return res.status(500).json(err);
    }
  });
    /*// if (req.body.userId === req.params.curId) {
    try {
      const currentUser = await User.findById(req.params.profileId);

      // Update profile fields: Gamertag, pfp, Favgenre, Bio and Age
      await currentUser.updateOne({ $set: { Gamertag: req.body.Gamertag} });
      await currentUser.updateOne({ $push: { ProfilePicture: req.body.ProfilePicture} });
      await currentUser.updateOne({ $push: { Favgenre: req.body.Favgenre} });
      await currentUser.updateOne({ $push: { Bio: req.body.Bio} });
      await currentUser.updateOne({ $push: { Age: req.body.Age} });

      console.log(req.body.Gamertag);

      res.status(200).json("Profile updated successfully");

    } catch (err) {
      res.status(500).json(err);
    }*/
  //});

  // GET USER
  app.get('/api/getUser/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const { Password, ...other } = user._doc;
      res.status(200).json(other);
    } catch (err) {
      res.status(404).json(err);
    }
  });

  //GET PROFILE
  app.get('/api/getProfile/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const { _id, FirstName, Password, Email, Friends, __v, ...other } = user._doc;
      res.status(200).json(other);
    } catch (err) {
      res.status(404).json(err);
    }
  });
};
