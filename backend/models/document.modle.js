const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const documentSchema = new mongoose.Schema({
  titleName: { type: String },
  name: { type: String },
  woldLike: { type: String },
  userId: {
    type: String,
    require: true,
  },
  reasons: { type: String },
  createdOn: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Document", documentSchema);
