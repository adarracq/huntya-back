const Message = require('../_models/Message');

// Addition message to DB and senting it to pen pal
module.exports.addMessage = async function (req, res) {

    const message = new Message({
        fromUserId: req.body.fromUserId,
        toUserId: req.body.toUserId,
        text: req.body.message,
    });

    await message.save();
    const io = req.app.get('socketIO');
    io.emit(message.toUserId, message);
    res.status(201).json(message);
};

// Getting relevant messages
module.exports.getMessages = async function (req, res) {

    const messages = await Message.find({
        $or: [
            { fromUserId: req.body.fromUserId, toUserId: req.body.toUserId },
            { fromUserId: req.body.toUserId, toUserId: req.body.fromUserId }
        ]
    });
    
    res.status(200).json(messages);
};

// Getting relevant conversations
module.exports.getConvs = async function (req, res) {

    const messages = await Message.find({
        $or: [
            { fromUserId: req.body.userId },
            { toUserId: req.body.userId }
        ]
    });

    const convs = [];
    messages.forEach(message => {
        if (convs.findIndex(conv => conv === message.fromUserId) === -1) {
            convs.push(message);
        }
        if (convs.findIndex(conv => conv === message.toUserId) === -1) {
            convs.push(message);
        }
    });

    res.status(200).json(convs);
};