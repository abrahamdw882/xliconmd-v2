module.exports = {
    name: 'banchat',
    aliases: ['unbanchat'],

    async execute(sock, m, args) {

        if (!global.owners.includes(m.sender)) return;

        if (!m.from.endsWith('@g.us')) {
            return m.reply('ᴛʜɪs ɪs ᴏɴʟʏ ғᴏʀ ɢʀᴏᴜᴘs');
        }

        if (m.body.startsWith(global.BOT_PREFIX + 'banchat')) {

            if (global.bannedChats.includes(m.from)) {
                return m.reply('⚠️ ɢʀᴏᴜᴘ ᴀʟʀᴇᴀᴅʏ ʙᴀɴɴᴇᴅ');
            }

            global.bannedChats.push(m.from);

            return m.reply('✅ ʙᴏᴛ ʙᴀɴɴᴇᴅ ɪɴ ᴛʜɪs ɢʀᴏᴜᴘ');
        }

        if (m.body.startsWith(global.BOT_PREFIX + 'unbanchat')) {

            if (!global.bannedChats.includes(m.from)) {
                return m.reply('⚠️ ɢʀᴏᴜᴘ ɪs ɴᴏᴛ ʙᴀɴɴᴇᴅ');
            }

            global.bannedChats =
                global.bannedChats.filter(id => id !== m.from);

            return m.reply('✅ ʙᴏᴛ ᴜɴʙᴀɴɴᴇᴅ ɪɴ ᴛʜɪs ɢʀᴏᴜᴘ');
        }
    },

    async onMessage(sock, m) {

        if (!global.bannedChats.includes(m.from)) {
            return false;
        }

        if (global.owners.includes(m.sender)) {
            return false;
        }

        if (
            m.body &&
            m.body.startsWith(global.BOT_PREFIX)
        ) {
            return true;
        }

        return false;
    }
};
