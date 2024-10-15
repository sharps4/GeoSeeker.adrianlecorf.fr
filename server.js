const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const server = http.createServer(app);

// Serve static files from the public directory
app.use('/public', express.static(path.join(__dirname, 'public')));

// Serve Socket.IO client library
app.use('/socket.io', express.static(path.join(__dirname, 'node_modules/socket.io/client-dist')));



app.use(cors({
    origin: 'https://geoseeker.adrianlecorf.fr/',  
    methods: ['GET', 'POST']
}));

const io = new Server(server, {
    cors: {
        origin: 'https://geoseeker.adrianlecorf.fr/',
        methods: ['GET', 'POST']
    }
});

const rooms = {};  

async function loadValidCoordinates() {
    try {
        const data = await fs.readFile(path.join(__dirname, 'public', 'assets', 'data', 'merged_output.json'), 'utf8');
        const coordinates = JSON.parse(data);
        if (!Array.isArray(coordinates) || coordinates.length === 0) {
            console.error('Erreur : Liste des coordonnées vides ou invalide.');
            return [];
        }
        console.log('Coordonnées chargées :', coordinates.length); 
        return coordinates;
    } catch (error) {
        console.error('Erreur lors du chargement des coordonnées :', error);
        return [];
    }
}

function getRandomValidCoordinate(validCoordinates) {
    if (validCoordinates.length === 0) {
        console.error('Aucune coordonnée valide disponible.');
        return null;
    }
    const randomIndex = Math.floor(Math.random() * validCoordinates.length);
    const randomCoords = validCoordinates[randomIndex];
    console.log('Coordonnées générées aléatoirement :', randomCoords);
    return randomCoords;
}

io.on('connection', (socket) => {
    console.log('Un joueur s\'est connecté : ' + socket.id);

    socket.on('createRoom', async () => {
        const roomId = Math.random().toString(36).substring(2, 10); 
        rooms[roomId] = {
            players: [socket.id],  
            guesses: {},  
            round: 1,  
            validCoordinates: await loadValidCoordinates()  
        };
        socket.join(roomId);  
        socket.emit('roomCreated', { roomId });  
        console.log(`Salon créé avec ID : ${roomId}`);
    });

    socket.on('joinRoom', (roomId) => {
        if (rooms[roomId]) {
            if (rooms[roomId].players.length < 2) {
                rooms[roomId].players.push(socket.id);  
                socket.join(roomId); 
                io.in(roomId).emit('startGameCountdown');  
                console.log(`Joueur ${socket.id} a rejoint le salon : ${roomId}`);
            } else {
                socket.emit('error', 'Le salon est complet.');
            }
        } else {
            socket.emit('error', 'Le salon n\'existe pas.');
        }
    });

    socket.on('startRound', (roomId) => {
        if (rooms[roomId]) {
            const randomCoords = getRandomValidCoordinate(rooms[roomId].validCoordinates);
            if (randomCoords) {
                console.log("Test2");
                console.log('Emitting startRound with coordinates:', randomCoords);
                io.in(roomId).emit('startRound', { randomCoords }); 
            } else {
                console.error('Erreur : Coordonnées non disponibles pour le salon', roomId);
            }
        }
    });   

    socket.on('nextRound', ({ roomId }) => {
        if (rooms[roomId]) {
            io.in(roomId).emit('closePopup');
            
            setTimeout(() => {
                rooms[roomId].round += 1;
                const randomCoords = getRandomValidCoordinate(rooms[roomId].validCoordinates);
                if (randomCoords) {
                    console.log("Test");
                    console.log('Emitting startNextRound with coordinates:', randomCoords);
                    io.in(roomId).emit('startNextRound', { randomCoords, round: rooms[roomId].round });
                } else {
                    console.error('Erreur : impossible de trouver des coordonnées valides.');
                }
            }, 1000);
        }
    });

    socket.on('submitGuess', ({ roomId, guess }) => {
        if (rooms[roomId]) {
            rooms[roomId].guesses[socket.id] = guess;
            const players = rooms[roomId].players;
    
            if (Object.keys(rooms[roomId].guesses).length === 2) {
                clearTimeout(rooms[roomId].timer);
                const playerGuesses = rooms[roomId].guesses;
                io.in(roomId).emit('showResults', playerGuesses);
                rooms[roomId].guesses = {};  
            } else if (Object.keys(rooms[roomId].guesses).length === 1) {
                rooms[roomId].timer = setTimeout(() => {
                    const playerGuesses = rooms[roomId].guesses;
                    io.in(roomId).emit('showResults', playerGuesses);
                    rooms[roomId].guesses = {};  
                }, 15000);
                
                io.in(roomId).emit('startTimer', { seconds: 15 });
            }
        }
    });
    
    
    
    // socket.on('timeUp', ({ roomId }) => {
    //     if (rooms[roomId]) {
    //         const playerGuesses = rooms[roomId].guesses;
    
    //         // Show results to both players
    //         io.in(roomId).emit('showResults', playerGuesses);
    
    //         rooms[roomId].guesses = {};  // Reset guesses for the next round
    
    //         // Proceed to the next round
    //         setTimeout(() => {
    //             if (rooms[roomId].round < 5) {  // Ensure game ends after 5 rounds
    //                 rooms[roomId].round += 1;
    //                 const randomCoords = getRandomValidCoordinate(rooms[roomId].validCoordinates);
    //                 io.in(roomId).emit('startNextRound', { randomCoords, round: rooms[roomId].round });
    //             }
    //         }, 5000);
    //     }
    // });
    
    

    socket.on('startTimer', ({ seconds }) => {
        startTimer(seconds); 
      });
    

    socket.on('disconnect', () => {
        console.log('Joueur déconnecté : ' + socket.id);
        for (const roomId in rooms) {
            const room = rooms[roomId];
            room.players = room.players.filter(player => player !== socket.id);

            if (room.players.length === 0) {
                delete rooms[roomId];
                console.log(`Salon ${roomId} supprimé car vide.`);
            }
        }
    });
});

server.listen(3000, () => {
    console.log('Serveur Socket.IO en écoute sur https://geoseeker.adrianlecorf.fr/');
});