const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const advisorSchema = new mongoose.Schema({
  titleName: { type: String },
  fullName: { type: String },
  email: { type: String },
  password: { type: String },
});
const advisorModel = mongoose.model.advisor || mongoose.model("advisor", advisorSchema);
export default advisorModel
