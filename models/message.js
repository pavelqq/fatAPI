const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    conversationId: {type: String},
    sender: {
        authUser: {type: Boolean},
        uid: {type: String},
        name: {type: String},
        profilePicture: {type: String},
    },
    content: {type: String},
    date: {type: Date, default: new Date()},
});

const Message = mongoose.model("Message", messageSchema);
exports.Message = Message;
