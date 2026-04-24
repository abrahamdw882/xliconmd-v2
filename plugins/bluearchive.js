const axios = require('axios');
const fs = require('fs');

module.exports = {
    name: 'bluearchive',
    description: 'Fetch random Blue Archive image',
    aliases: ['ba', 'blue'],
    tags: ['anime'],
    command: /^\.?(bluearchive|ba|blue)$/i,

    async execute(sock, m, args) {
        try {
            await m.reply('ғᴇᴛᴄʜɪɴɢ ʙʟᴜᴇ ᴀʀᴄʜɪᴠᴇ ɪᴍᴀɢᴇ...');

            const apiUrl = 'https://api-rebix.zone.id/api/bluearchive';
            
            const response = await axios.get(apiUrl, {
                responseType: 'arraybuffer'
            });

            const imageBuffer = Buffer.from(response.data);
            const fileName = `bluearchive_${Date.now()}.jpg`;
            const filePath = `./temp/${fileName}`;

            if (!fs.existsSync('./temp')) {
                fs.mkdirSync('./temp', { recursive: true });
            }

            fs.writeFileSync(filePath, imageBuffer);

            const caption = `*ʙʟᴜᴇ ᴀʀᴄʜɪᴠᴇ*

ᴅᴏᴡɴʟᴏᴀᴅᴇᴅ ʙʏ XLICON V2`;

            await sock.sendMessage(m.from, {
                image: fs.readFileSync(filePath),
                caption: caption,
                mimetype: 'image/jpeg'
            });

            fs.unlinkSync(filePath);

        } catch (err) {
            console.error('BlueArchive Error:', err);
            await m.reply(`ᴇʀʀᴏʀ: ${err.message}`);
        }
    }
};
