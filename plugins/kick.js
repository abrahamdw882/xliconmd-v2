module.exports = {
    name: 'kick',
    aliases: ['remove'],
    description: 'Kick a member from the group',
    enabled: true,

    async execute(sock, m, args) {
        try {
            if (!m.isGroup) {
                return m.reply('❌ This command only works in groups.');
            }

            let targetId;
            if (m.quoted) {
                targetId = m.quoted.sender;
            } else if (args[0]) {
                targetId = args[0].includes('@') ? args[0].replace('@', '') + '@s.whatsapp.net' : args[0] + '@s.whatsapp.net';
            } else {
                return m.reply('❌ Reply to a message or provide a number to kick.');
            }

            await sock.groupParticipantsUpdate(m.from, [targetId], 'remove');
            await m.reply('✅ User has been kicked from the group.');

        } catch (err) {
            console.error(err);
            await m.reply('❌ Failed to kick the user. Make sure the number is correct.');
        }
    }
};
