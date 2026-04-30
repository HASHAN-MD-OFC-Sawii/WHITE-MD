const { cmd } = require('../command');
const config = require('../config');

// ඔයාගේ number එක මෙතන දාපන් - report log එන්නේ මෙතනට
const OWNER_NUMBER = '94703457206@s.whatsapp.net';

// Spam data
let inboxSpam = {}; // { userJid: { count: 1, msgs: [] } }
let blockedUsers = [];

cmd({
    pattern: "report",
    desc: "Report and block spammer in inbox",
    category: "owner",
    react: "🚨",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, sender, isOwner, reply }) => {
    if (isGroup) return reply("❌ This command only works in inbox");

    // Owner ට විතරයි වැඩ
    if (!isOwner) {
        // Normal user කෙනෙක්.report ගැහුවොත් auto block වෙනවා
        await reply("*🚫 YOU ARE BLOCKED*\n\nSpamming detected. You have been blocked by anti-spam system.");
        await conn.updateBlockStatus(sender, "block");

        // Owner ට notify කරනවා
        if (!blockedUsers.includes(sender)) {
            blockedUsers.push(sender);
            await conn.sendMessage(OWNER_NUMBER, {
                text: `*🚨 AUTO-BLOCK REPORT 🚨*\n\n*User:* @${sender.split('@')[0]}\n*Reason:* Used.report command / Spam detected\n*Action:* Blocked automatically\n*Time:* ${new Date().toLocaleString('en-US', {timeZone: 'Asia/Colombo'})}`,
                mentions: [sender]
            });
        }
        return;
    }

    // Owner.report ගැහුවොත් last chat කරපු එකාව block කරනවා
    const lastUser = m.quoted? m.quoted.sender : from;

    if (blockedUsers.includes(lastUser)) {
        return reply("✅ User already blocked");
    }

    blockedUsers.push(lastUser);
    await conn.updateBlockStatus(lastUser, "block");

    await conn.sendMessage(lastUser, {
        text: "*🚫 YOU HAVE BEEN BLOCKED*\n\nYou were blocked by the bot owner for spamming/abuse.\nContact owner to unblock."
    });

    await reply(`✅ @${lastUser.split('@')[0]} blocked successfully`, { mentions: [lastUser] });
});

// AUTO SPAM DETECT INBOX
cmd({ on: "body" }, async (conn, mek, m, { from, isGroup, sender, isOwner, body }) => {
    if (isGroup || isOwner) return; // Group එකේ වැඩ නෑ, Owner skip
    if (!body || body.startsWith('.')) return; // Commands skip

    const msg = body.toLowerCase().trim();
    if (msg.length < 3) return; // පොඩි msg skip

    // Spam track කරනවා
    if (!inboxSpam[sender]) {
        inboxSpam[sender] = { count: 1, msgs: [msg], firstTime: Date.now() };
        return;
    }

    const user = inboxSpam[sender];
    const timeDiff = Date.now() - user.firstTime;

    // විනාඩි 2ක් ඇතුලත නම් විතරයි count කරන්නේ
    if (timeDiff > 120000) {
        inboxSpam[sender] = { count: 1, msgs: [msg], firstTime: Date.now() };
        return;
    }

    // එකම msg එකද නැත්තම් වෙනස් msg spam ද බලනවා
    if (user.msgs.includes(msg)) {
        user.count++;
    } else {
        user.msgs.push(msg);
        user.count++;
    }

    // 5 පාරක් spam කරොත් auto block + report owner ට
    if (user.count >= 5 &&!blockedUsers.includes(sender)) {
        blockedUsers.push(sender);

        // User ව block කරනවා
        await conn.updateBlockStatus(sender, "block");

        // User ට msg යවනවා
        await conn.sendMessage(sender, {
            text: "*🚫 AUTOMATICALLY BLOCKED*\n\nYou have been blocked for spamming.\n5+ messages detected in 2 minutes.\n\nContact owner if this is a mistake."
        });

        // Owner ට report යවනවා
        await conn.sendMessage(OWNER_NUMBER, {
            text: `*🚨 SPAMMER BLOCKED 🚨*\n\n*User:* @${sender.split('@')[0]}\n*Number:* ${sender.split('@')[0]}\n*Messages:* ${user.count} msgs in 2min\n*Last Msg:* ${msg}\n*Action:* Auto Blocked\n*Time:* ${new Date().toLocaleString('en-US', {timeZone: 'Asia/Colombo'})}\n\nUse.unblock ${sender.split('@')[0]} to unblock`,
            mentions: [sender]
        });

        delete inboxSpam[sender]; // Clear data
    }
});

// UNBLOCK COMMAND
cmd({
    pattern: "unblock",
    desc: "Unblock a user",
    category: "owner",
    react: "✅",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, args, reply }) => {
    if (!isOwner) return reply("❌ Owner only");
    if (!args[0]) return reply("❌ Give number\nEx:.unblock 9477xxx");

    const number = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    await conn.updateBlockStatus(number, "unblock");
    blockedUsers = blockedUsers.filter(u => u!== number);
    delete inboxSpam[number];

    await conn.sendMessage(number, {
        text: "*✅ YOU HAVE BEEN UNBLOCKED*\n\nYou can now chat with the bot again.\nPlease don't spam."
    });

    reply(`✅ @${number.split('@')[0]} unblocked successfully`, { mentions: [number] });
});

// BLOCKED LIST
cmd({
    pattern: "blocklist",
    desc: "See blocked users",
    category: "owner",
    react: "📋",
    filename: __filename
},
async (conn, mek, m, { isOwner, reply }) => {
    if (!isOwner) return reply("❌ Owner only");

    if (blockedUsers.length === 0) return reply("✅ No blocked users");

    let list = `*📋 BLOCKED USERS 📋*\n\n`;
    blockedUsers.forEach((user, i) => {
        list += `${i+1}. @${user.split('@')[0]}\n`;
    });
    list += `\n*Total:* ${blockedUsers.length}`;

    await conn.sendMessage(m.chat, { text: list, mentions: blockedUsers }, { quoted: mek });
});
