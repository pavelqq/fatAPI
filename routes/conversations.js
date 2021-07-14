const winston = require("winston");
const auth = require("../middleware/auth");
const {Conversation} = require("../models/conversation");
const Joi = require("joi");
const express = require("express");
const router = express.Router();

router.get("/:userId", auth, async (req, res, next) => {
    try {
        const conversations = await Conversation.find().sort({date: 1});
        const filteredConversations = conversations.filter(conversation =>
            (conversation.firstUser.uid === req.params.userId)
            || (conversation.secondUser.uid === req.params.userId));
        res.send(filteredConversations);
    } catch (error) {
        res.status(500).send("Ошибка: " + error.message);

        winston.error(error.message);
    }
});

router.post("/", async (req, res) => {
    const schema = Joi.object({
        conversationId: Joi.string(),
        firstUser: {
            uid: Joi.string(),
            name: Joi.string(),
            profilePicture: Joi.string(),
        },
        secondUser: {
            uid: Joi.string(),
            name: Joi.string(),
            profilePicture: Joi.string(),
        },
        date: Joi.date(),
    });

    const {error} = schema.validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const {conversationId, firstUser, secondUser, date} = req.body;

    let conversation = new Conversation({
        conversationId, firstUser, secondUser, date
    });

    conversation = await conversation.save();
    res.send(conversation);
});

router.delete("/:conversationId", auth, async (req, res) => {
    const conversation = await Conversation.findById(req.params.conversationId);

    if (!conversation) return res.status(404).send("Диалог не найден...");

    if (
        (conversation.firstUser.uid !== req.user._id)
        || (conversation.secondUser.uid !== req.user._id)
    ) return res.status(401).send("Удаление диалога невозможнно. Нет авторизации...");

    const deletedConversation = await Conversation.findByIdAndDelete(req.params.id);

    res.send(deletedConversation);
});

// router.put("/:id/like", async (req, res) => {
//     try {
//         const post = await Post.findById(req.params.id);
//         if (!post.likes.includes(req.body.userId)) {
//             await post.updateOne({ $push: { likes: req.body.userId } });
//             res.status(200).json("Пост лайкнут");
//         } else {
//             await post.updateOne({ $pull: { likes: req.body.userId } });
//             res.status(200).json("Пост дизлайкнут");
//         }
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

module.exports = router;
