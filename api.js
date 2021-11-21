const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path")

exports.setApp = function (app, client) {
  const authenticateJWT = (req, res, next) => {
    const authHeader = "Bearer " + req.headers.authorization;
    console.log(authHeader);
    if (authHeader) {
      const token = authHeader.split(" ")[1];

      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }

        req.user = user;
        next();
      });
    } else {
      res.sendStatus(401);
    }
  };
  //load user model
  const User = require("./models/user.js");

  //load conversation and message models
  const Conversation = require("./models/ConversationSchema");
  const Message = require("./models/MessageSchema")
  
  const bcrypt = require("bcrypt");

  // multer to save img to folder
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "Images");
    },
    filename: (req, file, cb) => {
      console.log(file);
      imgName = Date.now() + path.extname(file.originalname);
      cb(null, imgName);
    },
  });

  const upload = multer({ storage: storage });

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
      Gamertag: req.body.gamertag,
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

        try {
          const token = require("./createJWT.js");
          ret = token.createToken(id);
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
  app.put("/api/:curId/match", authenticateJWT, async (req, res) => {
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
  app.put("/api/:curId/unmatch", authenticateJWT, async (req, res) => {
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

  // new conversation
  app.post("/api/conversation", authenticateJWT, async (req, res, next) => {
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
  app.get("/api/conversation/:userId", authenticateJWT, async (req, res, next) => {
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
  app.post("/api/message", authenticateJWT, async (req, res, next) => {
    const newMessage = new Message(req.body);

    try {
      const savedMessage = await newMessage.save();
      res.status(200).json(savedMessage);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  // get messages
  app.get("/api/message/:conversationId", authenticateJWT, async (req, res, next) => {
    try {
      const messages = await Message.find({
        conversationId: req.params.conversationId,
      });
      res.status(200).json(messages);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  // Deactivate Account
  app.delete("/api/deactivate/", authenticateJWT, async (req, res) => {
    var ud = jwt.decode(req.headers.authorization, { complete: true });
      var id = ud.payload.id;
    if (req.body.userId === id) {
      try {
        await User.findByIdAndDelete(req.body.userId);
        res.status(200).json("Account deactivated");
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      return res.status(403).json("You can delete only your account!");
    }
  });

  //EDIT PROFILE
  app.put("/api/edit/", authenticateJWT, async (req, res) => {
    var ud = jwt.decode(req.headers.authorization, { complete: true });
      var id = ud.payload.id;
    try {
      const user = await User.findByIdAndUpdate(id, {
        $set: req.body,
      });

      res.status(200).json("profile updated successfully");
    } catch (err) {
      return res.status(500).json(err);
    }
  });

  // GET USER
  app.get("/api/getUser/", authenticateJWT, async (req, res) => {
    var ud = jwt.decode(req.headers.authorization, { complete: true });
      var id = ud.payload.id;
    try {
      const user = await User.findById(id);
      const { Password, ...other } = user._doc;
      res.status(200).json(other);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  //GET PROFILE
  app.get("/api/getProfile/", authenticateJWT, async (req, res) => {
    var ud = jwt.decode(req.headers.authorization, { complete: true });
      var id = ud.payload.id;
    try {
      const user = await User.findById(id);
      const { _id, FirstName, Password, Email, Friends, __v, ...other } =
        user._doc;
      res.status(200).json(other);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  //GET FRIENDS
  app.get("/api/getFriends/", authenticateJWT, async (req, res) => {
    var ud = jwt.decode(req.headers.authorization, { complete: true });
      var id = ud.payload.id;
    try {
      const user = await User.findById(id);
      const { _id, FirstName, Password, Email, Profile, __v, ...other } =
        user._doc;
      res.status(200).json(other);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  // Like user and check for matches
  app.put("/api/like/", authenticateJWT, async (req, res) => {
    try {
      var ud = jwt.decode(req.headers.authorization, { complete: true });
      var id = ud.payload.id;
      console.log(id);
      const currentUser = await User.findById(id);
      const user = await User.findById(req.body.userId);

      if (
        !currentUser.Likes.includes(req.body.userId) &&
        !currentUser.Friends.includes(req.body.userId)
      ) {
        await currentUser.updateOne({
          $push: { Likes: req.body.userId },
        });
        if (user.Likes.includes(id)) {
          await currentUser.updateOne({
            $push: { Friends: user._id },
            $pull: { Likes: user._id },
          });
          await user.updateOne({
            $push: { Friends: currentUser._id },
            $pull: { Likes: currentUser._id },
          });
          res.status(200).json("You guys liked each other and are now friends");
        } else {
          res.status(200).json("You liked a user");
        }
      } else {
        res.status(403).json("Already Friend/liked this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });

  // dislikes a user
  app.put("/api/dislike/", authenticateJWT, async (req, res) => {
    try {
      var ud = jwt.decode(req.headers.authorization, { complete: true });
      var id = ud.payload.id;
      const currentUser = await User.findById(id);

      if (!currentUser.Dislikes.includes(req.body.userId)) {
        await currentUser.updateOne({
          $push: { Dislikes: req.body.userId },
        });
        res.status(200).json("You disliked a user");
      } else {
        res.status(403).json("Already matched/disliked this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });

  // gets an array of ALL user objs 
  app.get("/api/getNextUser/", authenticateJWT, async (req, res) => {
    try {
      var ud = jwt.decode(req.headers.authorization, { complete: true });
      var id = ud.payload.id;
      const currentUser = await User.findById(id);
      !currentUser && res.status(404).json("User not found");
  
      try {
        const nextUser = await User.aggregate([
          {
            $match: {
              Dislikes: { $not: { $in: [currentUser._id] } },
              Friends: { $not: { $in: [currentUser._id] } },
            },
          },
        ]);
        res.status(200).json(nextUser);
      } catch (error) {
        res.status(400).json("User not found");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  });

  // Upload Image to server folder
  // requires user's JWT token for authorization in the header
  // file is sent as a multi part form data and name should be image
  
  app.post("/api/upload", authenticateJWT, upload.single("image"),

    async (req, res, next) => {
      try {
        var jwt = require("jsonwebtoken");

        var ud = jwt.decode(req.headers.authorization, { complete: true });
        var id = ud.payload.id;

        const user = await User.findById(id);

        setTimeout(async () => {
          const profile = await User.findByIdAndUpdate(id, {
            $set: {
              Profile: {
                Gamertag: user.Profile.Gamertag,
                ProfilePicture: imgName,
                Favgenre: [...user.Profile.Favgenre],
                Bio: user.Profile.Bio,
                Age: user.Profile.Age,
                _id: mongoose.Types.ObjectId(id),
              },
            },
          });
        }, 1000);

        res.status(200).json("Upload image successfuly");
      } catch (err) {
        res.status(500).json(err);
        console.log(err);
      }
    }
  );
};
