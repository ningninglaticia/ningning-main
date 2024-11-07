const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  titleName: { type: String },
  fullName: { type: String },
  studentId: { type: String },
  faculty: { type: String },
  major: { type: String },
  address: {
    homeAddress: { type: String },
    moo: { type: String },
    soi: { type: String },
    street: { type: String },
    subDistrict: { type: String },
    District: { type: String },
    province: { type: String },
    postCode: { type: String },
  },
  email: { type: String },
  mobile: { type: String },
  password: { type: String },
  advisor: { type: String },
  role: { type: String, enum: ["User", "Advisor", "Admin"], default: "User" },
  createdOn: { type: Date, default: new Date().getTime() },
});

module.exports = mongoose.model("User", userSchema);
