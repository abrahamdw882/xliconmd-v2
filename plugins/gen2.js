const axios = require('axios');
const FormData = require('form-data');

const client = axios.create({
  baseURL: 'https://api-abztech.zone.id/ai/gen2'  
});

const validRatios = ["1:1", "16:9", "3:2", "2:3", "4:5", "5:4", "9:16", "3:4", "4:3", "custom"];

module.exports = {
    name: 'gen2',
    aliases: ['editimage', 'imgpro'],
    description: 'Edit images using AI based on prompt',

    async execute(sock, m, args) {
        if (!args[0]) {
            return m.reply(` Usᴀɢᴇ:
.ɢᴇɴ2 <ᴘʀᴏᴍᴘᴛ> | <ʀᴀᴛɪᴏ>

Exᴀᴍᴘʟᴇ:
.ɢᴇɴ2 ᴍᴀᴋᴇ sᴋɪɴ ʙʟᴀᴄᴋ | 1:1

Aᴠᴀɪʟᴀʙʟᴇ ʀᴀᴛɪᴏs: 
1:1, 16:9, 3:2, 2:3, 4:5, 5:4, 9:16, 3:4, 4:3, ᴄᴜsᴛᴏᴍ`);
        }

        if (!m.quoted || !m.quoted.mimetype || !m.quoted.mimetype.includes('image')) {
            return m.reply('⚠️ Pʟᴇᴀsᴇ ǫᴜᴏᴛᴇ ᴀɴ ɪᴍᴀɢᴇ ᴛᴏ ᴇᴅɪᴛ');
        }

        await m.reply('⏳ Pʀᴏᴄᴇssɪɴɢ ʏᴏᴜʀ ɪᴍᴀɢᴇ...');

        try {
            let [prompt, size] = args.join(' ').split('|');
            if (!prompt) prompt = args.join(' ');

            const imageBuffer = await m.quoted.download();
            
            const formData = new FormData();
            formData.append('image', imageBuffer, 'image.jpg');
            formData.append('prompt', prompt.trim());
            if (size && validRatios.includes(size.trim())) formData.append('size', size.trim());
            const response = await client.post('', formData, {
                headers: {
                    ...formData.getHeaders()
                },
                maxBodyLength: Infinity,
                maxContentLength: Infinity,
                timeout: 180000 
            });

            if (!response.data.status || !response.data.data?.image) {
                throw new Error(response.data.message || 'Failed to process image');
            }
            const resultImage = Buffer.from(response.data.data.image, 'base64');

            await m.reply(resultImage, {
                caption: '✅ Iᴍᴀɢᴇ ᴇᴅɪᴛᴇᴅ sᴜᴄᴄᴇssғᴜʟʟʏ!'
            });

        } catch (err) {
            console.error('Gen2 error:', err);
            await m.reply(`❌ Eʀʀᴏʀ: ${err.message}`);
        }
    }
};
