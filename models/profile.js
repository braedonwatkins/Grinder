const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const ProfileSchema = new Schema({
  // Gamertag / Username
  Gamertag: {
    type: String,
    required: true,
  },
  ProfilePicture: {
    type: String,
    default: "",
  },
  Favgenre: {
    type: [String],
    default: [],
  },
  Bio: {
    type: String,
    default: "",
  },
  Age: {
    type: Number,
    default: 0,
  },
});

module.exports = Profile = mongoose.model("Profile", ProfileSchema, "Profiles");
