const http = require('http');
const app = require('./app');
const { Server } = require('socket.io');
const Conversation = require('./_models/Conversation');
const User = require('./_models/User');
const Zone = require('./_models/Zone');

const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const server = http.createServer(app);

// Socket.io for chat
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

let isConnected = false;

io.on('connection', (socket) => {
    socket.on('connect', () => {
        console.log('Nouvel utilisateur connecté :', socket.id);
        if (!isConnected) {
            isConnected = true;
        }
    });

    socket.on('sendMessage', async (messageData) => {
        const { participants, senderId, text } = messageData;

        // Rechercher une conversation existante avec les participants
        let conversation = await Conversation.findOne({
            participants: { $all: participants, $size: participants.length }
        });

        if (!conversation) {
            // Si aucune conversation n'existe, en créer une nouvelle
            conversation = new Conversation({
                participants,
            });
            // puis on les ajoute en amis
            let user1 = await User.findOne({ _id: participants[0] })
            let user2 = await User.findOne({ _id: participants[1] })

            user1.friends.push({
                _id: user2._id,
                firstname: user2.firstname,
                lastname: user2.lastname,
                email: user2.email,
                imageUrl: user2.imageUrl,
            });
            user2.friends.push({
                _id: user1._id,
                firstname: user1.firstname,
                lastname: user1.lastname,
                email: user1.email,
                imageUrl: user1.imageUrl,
            });

            await user1.save();
            await user2.save();

            // on incremente le champs nbContacts des zones de l'agent
            user1.type == "1" ? user1.agentProperties.zoneCodes.forEach(zone => {
                Zone.findOne({ code: zone })
                    .then(zone => {
                        zone.nbContacts += 1;
                        zone.save();
                    })
            }) : user2.agentProperties.zoneCodes.forEach(zone => {
                Zone.findOne({ code: zone })
                    .then(zone => {
                        zone.nbContacts += 1;
                        zone.save();
                    })
            });
        }

        // Ajouter le message à la conversation
        const newMessage = { senderId, text, date: new Date() };
        // si c'est un evenement
        if (messageData.event) {
            newMessage.event = messageData.event;
        }
        conversation.messages.push(newMessage);
        conversation.read = false;
        conversation.lastUpdated = new Date();

        // Enregistrer la conversation
        await conversation.save();

        // Diffuser le message en temps réel aux participants
        io.emit('receiveMessage', newMessage);
    });

    socket.on('disconnect', () => {
        isConnected = false;
    });
});

server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

server.listen(port);
