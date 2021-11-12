const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Create Schema
const ConversationSchema = new Schema(
  {
    users: {
      type: Array,
    },
  },
  { timestamps: true }
);
module.exports = Conversation = mongoose.model(
  "Conversation",
  ConversationSchema,
  "Converations"
);
