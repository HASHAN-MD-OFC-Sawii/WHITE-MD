const { cmd } = require('../command');
cmd({pattern:"dare../",desc:"Dare challenge",category:"game",react:"😈",filename:__filename},async(conn,mek,m,{from})=>{let d=["Send voice msg singing","Change DP for 1 hour","Text crush 'I love u'","Dance video send","Eat 1 chili"];let t=d[Math.floor(Math.random()*d.length)];conn.sendMessage(from,{text:`*😈 DARE*\n\n${t}`},{quoted:mek})})
