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
      FirstName: req.body.firstname,
      LastName: req.body.lastname,
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

  // get user
  app.get("/api/users/:id", authenticateJWT, async (req, res) => {
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
  app.delete("/api/deactivate/:id", authenticateJWT, async (req, res) => {
    if (req.body.userId === req.params.id) {
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
  app.put("/api/edit/:id", authenticateJWT, async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });

      res.status(200).json("profile updated successfully");
    } catch (err) {
      return res.status(500).json(err);
    }
  });

  // GET USER
  app.get("/api/getUser/:id", authenticateJWT, async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const { Password, ...other } = user._doc;
      res.status(200).json(other);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  //GET PROFILE
  app.get("/api/getProfile/:id", authenticateJWT, async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const { _id, FirstName, Password, Email, Friends, __v, ...other } =
        user._doc;
      res.status(200).json(other);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  //GET FRIENDS
  app.get("/api/getFriends/:id", authenticateJWT, async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const { _id, FirstName, Password, Email, Profile, __v, ...other } =
        user._doc;
      res.status(200).json(other);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  // GET LIKES
  // work in progress
  app.get("/api/getLike/:id", authenticateJWT, async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const { _id, FirstName, Friends, Password, Email, __v, Profile:Gamertag, ...favBuf } = user._doc;
      res.status(200).json(favBuf);
    } catch (err) {
      res.status(500).json(err);
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
