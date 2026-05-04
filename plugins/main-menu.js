const axios = require('axios');

module.exports = {
name: 'menu',
description: 'Show available bot commands',
aliases: ['help', 'cmdlist', 'commands'],

async execute(sock, m) {    
    const prefix = global.BOT_PREFIX || '.';    

    const menuText = `

XLIOCN ᴍᴜʟᴛɪᴅᴇᴠɪᴄᴇ

┌─ム ᴀᴠᴀɪʟᴀʙʟᴇ ᴄᴏᴍᴍᴀɴᴅs
│
├─ム *ɢᴇɴᴇʀᴀʟ*
│ ᪣ ${prefix}ᴀʟɪᴠᴇ
│ ᪣ ${prefix}ᴘɪɴɢ
│ ᪣ ${prefix}ᴜᴘᴛɪᴍᴇ
│ ᪣ ${prefix}ᴏᴡɴᴇʀ
│ ᪣ ${prefix}ᴍᴇɴᴜ2
│
├─ム *ᴅᴏᴡɴʟᴏᴀᴅᴇʀs*
│ ᪣ ${prefix}ᴛɪᴋᴛᴏᴋ / ${prefix}ᴛᴛ
│ ᪣ ${prefix}ʏᴛᴍᴘ3
│ ᪣ ${prefix}ɪɢ
│
├─ム *ᴛᴏᴏʟs*
│ ᪣ ${prefix}sᴛɪᴄᴋᴇʀ
│ ᪣ ${prefix}ᴏᴄʀ
│ ᪣ ${prefix}ᴛᴛs
│ ᪣ ${prefix}ᴘᴏʟʟ
│ ᪣ ${prefix}sʜᴀᴢᴀᴍ
│
├─ム *ᴀɪ*
│ ᪣ ${prefix}ᴀɪ
│ ᪣ ${prefix}ᴀɪ-sᴇᴀʀᴄʜ
│ ᪣ ${prefix}ᴀɪᴠ
│ ᪣ ${prefix}ɢᴇɴ
│
├─ム *ғᴜɴ*
│ ᪣ ${prefix}ʙʟᴜᴇ
│
├─ム *ɢʀᴏᴜᴘ*
│ ᪣ ${prefix}ᴛᴀɢᴀʟʟ
│ ᪣ ${prefix}ᴛᴀɢᴀʟʟ1
│ ᪣ ${prefix}ᴛᴀɢᴍᴇ
│ ᪣ ${prefix}ᴄᴏᴜᴘʟᴇᴘᴘ
│ ᪣ ${prefix}ɢʀᴏᴜᴘ
│
├─ム *sᴛᴀᴛᴜs*
│ ᪣ ${prefix}ɢsᴛᴀᴛᴜs
│
├─ム *ᴄʜᴀɴɴᴇʟ*
│ ᪣ ${prefix}ᴄʜᴀɴɴᴇʟɪᴅ
│
├─ム *ᴀᴅᴍɪɴ*
│ ᪣ ${prefix}ᴋɪᴄᴋ
│
╰─────────◆────────╯

> 「 𝙏𝙞𝙢𝙚 - 𝙏𝙞𝙢𝙚𝙡𝙚𝙨𝙨 」
`.trim();


    const imgUrl = 'https://i.ibb.co/BVmdwyv8/IMG-20260417-WA0030.jpg';    
    const author = 'XLICON V2';    
    const botname = 'XLICON ᴍᴜʟᴛɪᴅᴇᴠɪᴄᴇ';    
    const sourceUrl = 'https://abztech.my.id/';    

    try {    
        const thumbnailBuffer = (await axios.get(imgUrl, { responseType: 'arraybuffer' })).data;    

        await m.send(menuText, {    
            contextInfo: {    
                forwardingScore: 999,    
                isForwarded: true,    
                externalAdReply: {    
                    title: author,    
                    body: botname,    
                    thumbnail: thumbnailBuffer,    
                    mediaType: 1,    
                    renderLargerThumbnail: true,    
                    sourceUrl    
                }    
            }    
        });    
    } catch (err) {    
        console.error('Menu error:', err);    
        await m.reply('ғᴀɪʟᴇᴅ ᴛᴏ ʟᴏᴀᴅ ᴍᴇɴᴜ');    
    }    
}

};
