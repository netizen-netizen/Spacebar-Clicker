// server.js
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: "*" } });
const nodemailer = require('nodemailer');

// Middleware to parse JSON
app.use(express.json());

// ===== EMAIL (BUG REPORTS) =====

// Use environment variables for Gmail credentials
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

// Nodemailer setup for Gmail (STARTTLS, port 587)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // STARTTLS
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
    },
    tls: { rejectUnauthorized: true },
    socketTimeout: 30000,
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    debug: true
});

// Verify connection
transporter.verify((err, success) => {
    if (err) {
        console.error("❌ Mailer not ready:", err);
    } else {
        console.log("📧 Mailer ready");
    }
});

// Send bug report email
async function sendBugReportEmail(report) {
    try {
        const info = await transporter.sendMail({
            from: `"R+ Bug Reporter" <${SMTP_USER}>`,
            to: SMTP_USER, // Send bug reports to your Gmail
            subject: `Bug Report: ${report.title || 'Untitled'}`,
            text:
`Bug Report
Title: ${report.title || 'Untitled'}
Description:
${report.description || 'No description provided.'}
Player ID: ${report.playerId || 'Unknown'}
Game Path: ${report.gamePath || 'Unknown'}
Time: ${new Date().toISOString()}
---- LOG ----
${report.appLog || 'No log attached.'}`
        });

        console.log('✅ Bug report sent:', info.messageId);
    } catch (err) {
        console.error("❌ Bug report failed:", err.message);
        throw err;
    }
}

// ===== SERVER =====
const PORT = process.env.PORT || 7860;
let players = {};
let chatHistory = [];

io.on("connection", (socket) => {
    console.log(`🟢 User connected: ${socket.id}`);

    players[socket.id] = {
        id: socket.id,
        score: 0,
        combo: 0,
        gamePath: "Menu",
        status: "Lobby",
        isHost: false
    };

    socket.emit("chatHistory", chatHistory);
    io.emit("updatePlayerList", players);

    socket.on("updateStatus", (data) => {
        if (!players[socket.id]) return;

        players[socket.id] = { ...players[socket.id], ...data };
        const path = players[socket.id].gamePath;

        if (path !== "Menu") {
            const room = Object.values(players).filter(p => p.gamePath === path);
            if (!room.some(p => p.isHost)) players[socket.id].isHost = true;
        } else {
            players[socket.id].isHost = false;
        }

        io.emit("updatePlayerList", players);
    });

    socket.on("sendChat", (msg) => {
        if (typeof msg !== 'string') return;

        const packet = { id: socket.id, msg: msg.slice(0, 100), time: Date.now() };
        chatHistory.push(packet);
        if (chatHistory.length > 50) chatHistory.shift();

        io.emit("receiveChat", packet);
    });

    socket.on("syncVideo", (data) => {
        const p = players[socket.id];
        if (!p || !p.isHost) return;

        Object.values(players)
            .filter(x => x.gamePath === p.gamePath && x.id !== socket.id)
            .forEach(x => io.to(x.id).emit("forceVideoSync", data));
    });

    socket.on("requestStart", () => {
        const p = players[socket.id];
        if (p?.isHost && p.gamePath !== "Menu") io.emit("forceStartGame", p.gamePath);
    });

    socket.on("reportBug", async (report) => {
        try {
            await sendBugReportEmail({
                title: report?.title,
                description: report?.description,
                gamePath: report?.gamePath || players[socket.id]?.gamePath,
                playerId: report?.playerId || socket.id,
                appLog: report?.appLog
            });

            socket.emit("reportStatus", { success: true });
        } catch (err) {
            console.error("❌ Bug report failed:", err);
            socket.emit("reportStatus", { success: false });
        }
    });

    socket.on("disconnect", () => {
        delete players[socket.id];
        io.emit("updatePlayerList", players);
    });
});

http.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ R+ Multiplayer Server running on port ${PORT}`);
});
