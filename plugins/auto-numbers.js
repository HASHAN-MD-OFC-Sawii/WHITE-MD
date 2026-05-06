const { cmd } = require('../command');

// ⚠️ Settings
const CHANNEL_ID = '120363425798833059@g.us'; // උඹේ Channel/Group ID එක
const INTERVAL_SECONDS = 30; // තත්පර 30න් 30ට
const MIN_NUMBER = 5000;
const MAX_NUMBER = 9999;

let autoInterval = null;
let count = 0;

cmd({
    pattern: "startnum",
    desc: "Start auto sending random numbers",
    category: "owner",
    react: "🎲",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) return reply("Owner Only! ❌");
    
    if (autoInterval) {
        clearInterval(autoInterval);
        autoInterval = null;
    }
    
    reply(`✅ *Auto Number Started*\n\n📢 Channel: ${CHANNEL_ID}\n🔢 Range: ${MIN_NUMBER}-${MAX_NUMBER}\n⏱️ Interval: ${INTERVAL_SECONDS}s\n\nStop:.stopnum`);
    
    // පළවෙනි එක දැන්ම යවනවා
    await sendRandomNumber(conn);
    
    // 30sec න් 30ට auto send
    autoInterval = setInterval(async () => {
        await sendRandomNumber(conn);
    }, INTERVAL_SECONDS * 1000);
});

cmd({
    pattern: "stopnum",
    desc: "Stop auto sending",
    category: "owner",
    react: "🛑",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) return reply("Owner Only! ❌");
    
    if (autoInterval) {
        clearInterval(autoInterval);
        autoInterval = null;
        reply(`✅ Auto Send Stopped\n📊 Total Sent: ${count}`);
        count = 0;
    } else {
        reply("❌ Auto send run වෙන්නෙ නෑ");
    }
});

// Random Number යවන Function එක
async function sendRandomNumber(conn) {
    try {
        count++;
        // 5000-9999 අතර random number
        const randomNum = Math.floor(Math.random() * (MAX_NUMBER - MIN_NUMBER + 1)) + MIN_NUMBER;
        const time = new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Colombo' });
        
        const msg = `🎲 *Hashu Random Number*\n\n` +
                   `🔢 Number: *${randomNum}*\n` +
                   `📊 Count: ${count}\n` +
                   `⏰ Time: ${time}\n\n` +
                   `_Auto every ${INTERVAL_SECONDS}s_`;
        
        await conn.sendMessage(CHANNEL_ID, { text: msg });
        console.log(`Sent: ${randomNum} | Count: ${count}`);
        
    } catch (e) {
        console.error('[AUTO NUM ERROR]', e);
    }
}
