module.exports = {
    name: 'antistat',
    aliases: ['antigcstats'],

    async execute(sock, m, args) {
        if (!global.owners.includes(m.sender)) return

        if (!m.from.endsWith('@g.us')) {
            return m.reply('ᴛʜɪs ɪs ᴏɴʟʏ ғᴏʀ ɢʀᴏᴜᴘs')
        }

        if (args.includes("on")) {
            const groupData = db.get('groups', m.from)
            if (groupData && groupData.enable === false) {
                return m.reply('ᴀɴᴛɪsᴛᴀᴛs ᴀʟʀᴇᴀᴅʏ ᴏɴ')
            }

            await db.editData('groups', m.from, true, 'antistats')
            return m.reply('ᴀɴᴛɪsᴛᴀᴛs ᴏɴ')
        }

        if (args.includes('off')) {
            const groupData = db.get('groups', m.from)
            if (!groupData || groupData.enable === true) {
                return m.reply('ᴀɴᴛɪsᴛᴀᴛs ᴀʟʀᴇᴀᴅʏ ᴏꜰꜰ')
            }

            await db.editData('groups', m.from, false, 'antistats')
            return m.reply('ᴀɴᴛɪsᴛᴀᴛs ᴏꜰꜰ')
        }
    },

    async onMessage(sock, m) {
        const groupData = db.get('groups', m.from)
        
        if (!groupData || groupData.antistats === true) {
            return false
        }

        if (global.owners.includes(m.sender)) {
            return false
        }

        if (m.body && m.isGroup && m.message.groupStatusMentionMessage) {
          await sock.sendMessage(m.sender, {delete: m.key}, {quoted: m})
          m.reply("ᴅᴇʟᴇᴛᴇᴅ")
            
          return true
        }

        return false
    }
}
