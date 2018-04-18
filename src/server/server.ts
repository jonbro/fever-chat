import {createServer, Server} from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';
import { Message, SimplePlayer } from "../client/Data"
import { Vector } from '../client/Vector';
import * as sqlite3 from 'sqlite3';

let db = new sqlite3.Database('./.data/fever.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the fever database.');
});
db.run('CREATE TABLE IF NOT EXISTS messages (content TEXT, position_x REAL, position_y REAL);');
class ChatServer {
    public static readonly PORT = process.env.PORT || 3000;
    private app: express.Application;
    private server: Server;
    private io: SocketIO.Server;
    private port: string | number;
    private players : SimplePlayer[] = [];
    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
    }

    private createApp(): void {
        this.app = express();
    }

    private createServer(): void {
        this.server = createServer(this.app);
    }

    private config(): void {
        this.port = process.env.PORT || ChatServer.PORT;
    }

    private sockets(): void {
        this.io = socketIo(this.server);
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });
        this.io.on('connect', (socket: SocketIO.Socket) => {
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
                this.io.emit('message', new Message(row.content, new Vector(row.position_x, row.position_y)));
            });
            socket.on('disconnect', (reason) => {
                this.players = this.players.filter(p => p.id !== socket.client.id);
            });

            this.players[socket.id] = new SimplePlayer(new Vector(0,0), socket.id);
            socket.broadcast.emit("player_connected", this.players[socket.id]);
            
            console.log('Connected client on port %s.', this.port);

            socket.on('player_update', (p : SimplePlayer)=>{
                this.players[socket.id] = new SimplePlayer(p.position, socket.id);
                socket.broadcast.emit('player_update', this.players[socket.id]);    
            });
            socket.on('message', (m: Message) => {
                this.io.emit('message', m);
                // store the message in the database
                db.run(`INSERT INTO messages VALUES(?,?,?)`, [m.content,m.position.x, m.position.y], function(err) {
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

    public getApp(): express.Application {
        return this.app;
    }
}
let app = new ChatServer().getApp();
app.use(express.static('public'));
export { app };