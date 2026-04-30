const { cmd } = require('../command');
const os = require('os');

cmd({
    on: "text",  // prefix නැතුව ඔක්කොම messages check කරනවා
    fromMe: false,
    filename: __filename
},
async (conn, mek, m, { from, body, pushname }) => {
    try {
        // "alive" කියලා ගැහුවම විතරක් වැඩ
        if (body.toLowerCase().trim() !== 'alive2') return;

        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const caption = `*🤖 HASHU BOT IS ALIVE! 🤖*

*👋 Hey ${pushname}!*

*⏰ Uptime:* ${days}d ${hours}h ${minutes}m ${seconds}s
*📊 RAM:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
*💻 Platform:* ${os.platform()}
*👑 Owner:* wa.me/94740137623

> Type *.menu* for command list`;

        // Buttons එක්ක යවනවා
        await conn.sendMessage(from, {
            image: { url: "https://i.ibb.co/2y8ZJ1x/alive.jpg" },
            caption: caption,
            footer: "© Hashu Bot 2026",
            buttons: [
                { buttonId: '.menu', buttonText: { displayText: '📜 MENU' }, type: 1 },
                { buttonId: '.owner', buttonText: { displayText: '👑 OWNER' }, type: 1 },
                { buttonId: '.ping../', buttonText: { displayText: '⚡ PING' }, type: 1 }
            ],
            headerType: 4
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
    }
});
