const util = require('util')
const axios = require('axios')

let sentOnce = new Set()

module.exports = {
    name: 'exec',
    aliases: ['$'],
    description: 'Execute JavaScript code (Owner only)',

    async execute() {},

    async onMessage(sock, m) {
        if (!m?.text) return
        if (!m.text.startsWith('$')) return
        if (sentOnce.has(m.id)) return
        sentOnce.add(m.id)

        try {
            if (!m.isOwner) return

            const code = m.text.slice(1).trim()
            if (!code) {
                await m.reply('❌ Provide JavaScript code.')
                return
            }

            const info = '*ABZTech Exec*'
            const imgUrl = 'https://i.ibb.co/SX1gqfBd/XLICON-V2.jpg'
            const author = 'XLIOCN V2'
            const botname = 'XLIOCN ᴍᴜʟᴛɪᴅᴇᴠɪᴄᴇ'
            const sourceUrl = 'https://abztech.xyz/'

            const sandbox = {
                sock,
                m,
                axios,
                util,
                console,
                proto: global.proto,
                prepareWAMessageMedia: global.prepareWAMessageMedia,
                generateWAMessageContent: global.generateWAMessageContent,
                generateWAMessageFromContent: global.generateWAMessageFromContent,
                generateMessageID: global.generateMessageID
            }

            const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor

            let result
            if (code.includes('await') || code.includes('\n')) {
                result = await new AsyncFunction(...Object.keys(sandbox), code)(
                    ...Object.values(sandbox)
                )
            } else {
                result = await new Function(
                    ...Object.keys(sandbox),
                    `return (${code})`
                )(...Object.values(sandbox))
            }

            const output =
                result === undefined
                    ? 'ᴜɴᴅᴇғɪɴᴇᴅ'
                    : typeof result === 'string'
                    ? result
                    : util.inspect(result, { depth: 2 })

            const text = `☑️ ʀᴇsᴜʟᴛ:\n\`\`\`\n${JSON.stringify([output], null, 2).slice(0, 4000)}\n\`\`\``

            let thumbnailBuffer = null
            try {
                thumbnailBuffer = (
                    await axios.get(imgUrl, { responseType: 'arraybuffer' })
                ).data
            } catch {}

            await m.send(`${info}\n${text}`, {
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    externalAdReply: {
                        title: author,
                        body: botname,
                        thumbnail: thumbnailBuffer || undefined,
                        mediaType: 1,
                        renderLargerThumbnail: true,
                        sourceUrl
                    }
                }
            })
        } catch (err) {
            await m.send(`❌ Error:\n\`\`\`\n${err.stack || err.message}\n\`\`\``)
        } finally {
            setTimeout(() => sentOnce.delete(m.id), 5000)
        }
    }
}
