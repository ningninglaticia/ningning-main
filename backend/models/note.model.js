const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const noteSchema = new Schema({
    title: {
        type: String, require: true
    },
    content: {
        type: String, require: true
    },
    tags: {
        type: [String], default: []
    },
    isPinned: {
        type: Boolean, default: false
    },
    userId: {
        type: String, require: true
    },
    createdOn: {
        type: Date, default: new Date().getTime()
    },
    document: {
        fileName: { type: String },
        fileUrl: { type: String },
    }
});

module.exports = mongoose.model("Note", noteSchema);