import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from 'body-parser';

import path from "path";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(bodyParser.json({ limit: '50mb' })); // Increase JSON body limit
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ====== Custom Log Streamer ======
const OBS_URL = "https://intermuscularly-unpermeated-della.ngrok-free.dev/ingest?service=realtime-chat-app";

['log', 'error', 'warn'].forEach((method) => {
  const original = console[method];
  console[method] = function (...args) {
    // 1. Still print to your local terminal / Render logs natively
    original.apply(console, args);
    
    // 2. Stream a copy silently to our Observability Platform!
    const message = args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ');
    
    fetch(OBS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: message,
        level: method === 'log' ? 'info' : method,
      }),
    }).catch(() => {}); // ignore network errors so it doesn't crash your app
  };
});
// ===================================


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});
