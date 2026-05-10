const axios = require('axios');

module.exports = {
    name: 'autorise',
    description: 'Auto reply when a message *starts with* trigger keywords like "arise", "test", "bot", etc.',

    async execute() {},

    async onMessage(sock, m) {
        if (m.isBot || !m.text) return;

        const text = m.text.trim().toLowerCase();
        const triggers = ['arise', 'rise'];
        const isTriggered = triggers.some(word => text.startsWith(word));

        if (isTriggered) {
            const info = '*BOT ACTIVE AND RUNNING...*';

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
    }
};
