const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProfileSchema = require("./profile");

//Create Schema
const UserSchema = new Schema({
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
      default:[]
    },
  ],
  Profile: {
    type: mongoose.Schema.Types.Object,
    default: ProfileSchema,
  },
  Likes:[
    {
      type: mongoose.Schema.Types.ObjectId,
      default:[]
    }
  ],
  Dislikes:[
    {
      type: mongoose.Schema.Types.ObjectId,
      default:[]
    }
  ]
});
module.exports = User = mongoose.model("User", UserSchema, "Users");
