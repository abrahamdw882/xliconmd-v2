const axios = require('axios');

module.exports = {
    name: 'ping',
    aliases: ['speed', 'latency'],
    description: 'Check bot response speed',

    async execute(sock, m, args) {
        const start = Date.now();
        await m.reply('Pinging...');
        const latency = Date.now() - start;
        const info = `> Latency: ${latency} ms`;

        try {
            const imageBuffer = (await axios.get(global.menuImage, { responseType: 'arraybuffer' })).data;

            await m.reply(imageBuffer, {
                caption: info,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363230794474148@newsletter',
                        newsletterName: '──𝘈𝘉-𝘡𝘛𝘌𝘊𝘏🇬🇭「 𝙏𝙞𝙢𝙚 - 𝙏𝙞𝙢𝙚𝙡𝙚𝙨𝙨 」',
                        serverMessageId: 1
                    }
                }
            });
        } catch (err) {
            console.error('Menu error:', err);
            return;
        }
    }
};
