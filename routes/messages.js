const winston = require("winston");
const auth = require("../middleware/auth");
const {Message} = require("../models/message");
const Joi = require("joi");
const express = require("express");
const router = express.Router();

router.get("/:id", auth, async (req, res, next) => {
    try {
        const messages = await Message.find().sort({date: 1});
        const filteredMessages = messages.filter(message => message.conversationId === req.params.id); //req.user._id
        res.send(filteredMessages);
    } catch (error) {
        res.status(500).send("Ошибка: " + error.message);

        winston.error(error.message);
    }
});

router.post("/", async (req, res) => {
    const schema = Joi.object({
        conversationId: Joi.string(),
        sender: {
            authUser: Joi.boolean(),
            uid: Joi.string(),
            name: Joi.string(),
            profilePicture: Joi.string(),
        },
        content: Joi.string(),
        date: Joi.date(),
    });

    const {error} = schema.validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const {conversationId, sender, content, date} = req.body;

    let message = new Message({
        conversationId, sender, content, date
    });

    message = await message.save();
    res.send(message);
});

router.delete("/:id", auth, async (req, res) => {
    const message = await Message.findById(req.params.id);

    if (!message) return res.status(404).send("Сообщение не найдено...");

    if (message.sender.uid !== req.user._id)
        return res.status(401).send("Удаление сообщения невозможнно. Нет авторизации...");

    const deletedMessage = await Message.findByIdAndDelete(req.params.id);

    res.send(deletedMessage);
});



module.exports = router;
