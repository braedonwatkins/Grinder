const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProfileSchema = require("./profile");

//Create Schema
const UserSchema = new Schema({
  FirstName: {
    type: String,
    required: true,
  },
  Lastname: {
    type: String,
  },
  Email: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  Friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  Profile: {
    type: mongoose.Schema.Types.Object,
    default: ProfileSchema,
  },
});
module.exports = User = mongoose.model("User", UserSchema, "Users");
