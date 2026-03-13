module.exports = {
    name: 'tagall',
    aliases: ['everyone'],
    description: 'Tag everyone in the group',

    async execute(sock, m) {
        if (!m.isGroup) {
            return await sock.sendMessage(m.from, { text: 'ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ᴄᴀɴ ᴏɴʟʏ ʙᴇ ᴜsᴇᴅ ɪɴ ɢʀᴏᴜᴘs!' });
        }

        const owners = ['25770239992037', '233533763772'];
        const senderId = m.sender.split('@')[0];

        if (!owners.includes(senderId)) {
            const groupMetadata = await sock.groupMetadata(m.from);
            const adminIds = groupMetadata.participants
                .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
                .map(p => p.id.split('@')[0]);

            if (!adminIds.includes(senderId)) {
                return await sock.sendMessage(m.from, { text: 'ᴏɴʟʏ ɢʀᴏᴜᴘ ᴀᴅᴍɪɴs ᴏʀ ᴏᴡɴᴇʀs ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ!' });
            }
        }

        const groupMetadata = await sock.groupMetadata(m.from);
        const participants = groupMetadata.participants.map(p => p.id);
        const mentionText = participants.map(p => `@${p.split('@')[0]}`).join('\n');

        const message = `👋 ʜᴇʟʟᴏ ᴇᴠᴇʀʏᴏɴᴇ!
ʜᴇʀᴇ ᴀʀᴇ ᴛʜᴇ ɢʀᴏᴜᴘ ᴍᴇᴍʙᴇʀs:

${mentionText}`;

        await sock.sendMessage(m.from, {
            text: message,
            mentions: participants
        });
    }
};
