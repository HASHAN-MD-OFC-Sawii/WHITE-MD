const { cmd } = require('../command');
const os = require('os');

cmd({
    pattern: "alive3",
    alias: ["uptime", "bot"],
    desc: "Check if bot is alive with list menu",
    category: "info",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, pushname }) => {
    try {
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const caption = `*🤖 HASHAN-MD IS ALIVE! 🤖*\n\n*👋 Hey ${pushname}!*\n\n*⏰ Uptime:* ${days}d ${hours}h ${minutes}m ${seconds}s\n*📊 RAM:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\n*💻 Platform:* ${os.platform()}\n*👑 Owner:* Hashindu\n\n> Select an option below 👇`;

        const sections = [
            {
                title: "📌 MAIN MENU",
                rows: [
                    { title: "📜 All Commands", rowId: ".menu", description: "Show full command list" },
                    { title: "👑 Owner Info", rowId: ".owner", description: "Bot owner details" },
                    { title: "⚡ Ping Test", rowId: ".ping../", description: "Check bot speed" }
                ]
            },
            {
                title: "🎮 FUN MENU",
                rows: [
                    { title: "😂 Random Joke", rowId: ".joke../", description: "Get sinhala joke" },
                    { title: "❤️ Ship Meter", rowId: ".ship../", description: "Couple percentage" },
                    { title: "🎭 Animation", rowId: ".animation../ 5", description: "Send animations" }
                ]
            },
            {
                title: "⚙️ UTILITY",
                rows: [
                    { title: "🖼️ Sticker", rowId: ".sticker../", description: "Image to sticker" },
                    { title: "📱 QR Code", rowId: ".qr../ HashanMD", description: "Generate QR" },
                    { title: "🔊 TTS Voice", rowId: ".tts../ hello", description: "Text to speech" }
                ]
            }
        ];

        const listMessage = {
            image: { url: "https://i.ibb.co/2y8ZJ1x/alive.jpg" },
            caption: caption,
            footer: "© HASHAN-MD 2026",
            title: "🤖 BOT MENU",
            buttonText: "📋 SELECT OPTION",
            sections: sections
        };

        await conn.sendMessage(from, listMessage, { quoted: mek });

    } catch (e) {
        console.log(e);
    }
});
