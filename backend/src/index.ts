import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { db } from './db/drizzle';
import { user } from './db/schema';
import { eq } from 'drizzle-orm';
import { ApiError } from 'utils/ApiError';
const router =  require('./routes/userRoute'); 
import cors from 'cors'; // Fixed import
const chatRouter =  require('./routes/chatRoute')
const friendRouter = require('./routes/friendRoute')
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const userSocketMap: Record<string, Socket> = {}; // Store full Socket object
const userfriendSocket: Record<string, Set<Socket>> = {}; // Fixed socket set

const corsOptions = {
    origin: process.env.CORS_ORIGIN, 
    credentials: true
};

app.use(cors(corsOptions)); // Fixed CORS usage
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

app.use((req:any, res:any, next:any) => {
    res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN);
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
  

app.use('/users', router);
app.use('/chats', chatRouter)
app.use('/friends', friendRouter)

app.get('/', async (req, res) => {
    console.log('API hit');
    res.send('hello');   
});

io.on('connection', (socket: Socket) => {
    const userId = socket.handshake.query.userId as string;

    if (userId) {
        userSocketMap[userId] = socket;
        console.log(`User connected: ${userId}`);
      
        if (!userfriendSocket[userId]) {
          userfriendSocket[userId] = new Set();
        }        
      
        userfriendSocket[userId].add(socket);
      }
      
      userfriendSocket[userId].forEach((s) => {
        s.emit('setUserStatus', JSON.stringify({userId, status:true}));
      });

    socket.on('message', (data: any) => {
        try {
            const parseData = JSON.parse(data); // Removed await
            
            const { event, receiverId, message } = parseData;

            const receiverSocket = userSocketMap[receiverId];
            if (!receiverSocket) {
                return;
            }
            if (!userfriendSocket[userId].has(receiverSocket)) {
                userfriendSocket[userId].add(receiverSocket);
            }

            if (event === 'sendMessage') {
                console.log('message sent:',receiverId);
                receiverSocket.emit('receiveMessage', JSON.stringify({receiverId, message}));
            } else if (event === 'typing') {
                console.log();
                
                receiverSocket.emit('userTyping', JSON.stringify({receiverId, message}));
            } else if (event === 'sendFriends') {
                socket.emit('setFriends', Array.from(userfriendSocket[userId]));
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });

    socket.on('disconnect', () => {
        if (userfriendSocket[userId]) {
            userfriendSocket[userId].forEach((s) => {
                s.emit('setUserStatus', JSON.stringify({userId, status:false}));
              });
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on: http://localhost:${PORT}`);
});
