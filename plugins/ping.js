const axios = require('axios');

module.exports = {
    name: 'ping',
    aliases: ['speed', 'latency'],
    description: 'Check bot response speed',

    async execute(sock, m, args) {
        const start = Date.now();
        await m.reply('Pinging...');
        const latency = Date.now() - start;
        const info = `Latency: ${latency} ms`;

        try {
            await sock.sendMessage(m.from, {
                contact: {
                    displayName: 'AB-Z TECH BOT',
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:AB-Z TECH BOT\nORG:ABZ Tech\nTITLE:WhatsApp Bot\nTEL;waid=${m.senderNumber || '1234567890'}:+${m.senderNumber || '1234567890'}\nURL:https://abztech.my.id/\nNOTE:${info}\nEND:VCARD`
                },
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
            console.error('Ping error:', err);
            await m.reply(info);
        }
    }
};
