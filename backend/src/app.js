import express from 'express';
import { createServer } from 'node:http';
import mongoose from 'mongoose';
import connectToSocket from './controllers/socketManager.js';
import cors from 'cors';
import userRoutes from './routes/users.routes.js';

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", process.env.PORT || 8000);

// MIDDLEWARE MUST COME BEFORE ROUTES
// app.use(cors());
app.use(cors({
  origin: [
    "https://video-chat-dusky-psi.vercel.app", // ✅ your frontend
    "http://localhost:3000" // ✅ for local testing
  ],
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json({limit : "40kb"}));
app.use(express.urlencoded({ limit : "40kb", extended: true }));

// ADD THIS LOGGING MIDDLEWARE
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Body:', req.body);
    next();
});

// ROUTES
app.use("/api/v1/users", userRoutes);

// ADD A TEST ROUTE
app.get("/test", (req, res) => {
    res.json({ message: "Server is working!" });
});

const start = async () => { 
    const mongoUri = await mongoose.connect("mongodb+srv://dbvideocall:dbvideocall@cluster0.r8xyjoc.mongodb.net/");

    console.log(`MongoDB connected, ${mongoUri.connection.host}`);

    server.listen(app.get("port"), () => {
        console.log("Server started on port 8000");
    });
}        

start();