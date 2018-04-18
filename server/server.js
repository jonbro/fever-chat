"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const express = require("express");
const socketIo = require("socket.io");
const Data_1 = require("../client/Data");
const Vector_1 = require("../client/Vector");
const sqlite3 = require("sqlite3");
let db = new sqlite3.Database('./.data/fever.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the fever database.');
});
db.run('CREATE TABLE IF NOT EXISTS messages (content TEXT, position_x REAL, position_y REAL);');
class ChatServer {
    constructor() {
        this.players = [];
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
    }
    createApp() {
        this.app = express();
    }
    createServer() {
        this.server = http_1.createServer(this.app);
    }
    config() {
        this.port = process.env.PORT || ChatServer.PORT;
    }
    sockets() {
        this.io = socketIo(this.server);
    }
    listen() {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });
        this.io.on('connect', (socket) => {
            // send this connecting player information about all currently connected players
            console.log("players, on new player connect", this.players);
            // for each only works for arrays, not enumerating over objects
            for (const key in this.players) {
                if (this.players.hasOwnProperty(key)) {
                    const p = this.players[key];
                    this.io.to(socket.id).emit('player_connected', p);
                }
            }
            // also we need to dump all the existing message to the player
            let sql = `SELECT content,
                        position_x,
                        position_y
                        FROM messages`;
            db.each(sql, [], (err, row) => {
                if (err) {
                    throw err;
                }
                this.io.emit('message', new Data_1.Message(row.content, new Vector_1.Vector(row.position_x, row.position_y)));
            });
            socket.on('disconnect', (reason) => {
                this.players = this.players.filter(p => p.id !== socket.client.id);
            });
            this.players[socket.id] = new Data_1.SimplePlayer(new Vector_1.Vector(0, 0), socket.id);
            socket.broadcast.emit("player_connected", this.players[socket.id]);
            console.log('Connected client on port %s.', this.port);
            socket.on('player_update', (p) => {
                this.players[socket.id] = new Data_1.SimplePlayer(p.position, socket.id);
                socket.broadcast.emit('player_update', this.players[socket.id]);
            });
            socket.on('message', (m) => {
                this.io.emit('message', m);
                // store the message in the database
                db.run(`INSERT INTO messages VALUES(?,?,?)`, [m.content, m.position.x, m.position.y], function (err) {
                    if (err) {
                        return console.log(err.message);
                    }
                    // get the last insert id
                    console.log(`A row has been inserted with rowid ${this.lastID}`);
                });
            });
            socket.on('disconnect', () => {
                this.io.emit('player_disconnected', socket.id);
                console.log('Client disconnected');
            });
        });
    }
    getApp() {
        return this.app;
    }
}
ChatServer.PORT = process.env.PORT || 3000;
let app = new ChatServer().getApp();
exports.app = app;
app.use(express.static('public'));
