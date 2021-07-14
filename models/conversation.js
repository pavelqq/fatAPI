const mongoose = require("mongoose");

// const messageSchema = new mongoose.Schema({
//     id: {type: String},
//     sender: {
//         authUser: {type: Boolean},
//         uid: {type: String},
//         name: {type: String},
//         profilePicture: {type: String},
//         content: {type: String},
//         date: {type: Date, default: new Date()},
//     }
// });

const conversationSchema = new mongoose.Schema({
    conversationId: {type: String},
    firstUser: {
        uid: {type: String},
        name: {type: String},
        profilePicture: {type: String},
    },
    secondUser: {
        uid: {type: String},
        name: {type: String},
        profilePicture: {type: String},
    },
    // messages: messageSchema,
    date: {type: Date, default: new Date()},
});

const Conversation = mongoose.model("Conversation", conversationSchema);
exports.Conversation = Conversation;