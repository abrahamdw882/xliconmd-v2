const fs = require('fs')
const ffmpeg = require('@ffmpeg-installer/ffmpeg')
const { execSync } = require('child_process')

module.exports = {
    name: 'compress',
    aliases: ['cmp', 'compressvideo'],

    async execute(sock, m) {

        if (!m.quoted) {
            return m.reply('ʀᴇᴘʟʏ ᴛᴏ ᴀ ᴠɪᴅᴇᴏ')
        }

        const mime =
            m.quoted.message?.videoMessage?.mimetype || ''

        if (!mime.includes('video')) {
            return m.reply('ʀᴇᴘʟʏ ᴛᴏ ᴀ ᴠɪᴅᴇᴏ')
        }

        try {

            await m.reply('ᴄᴏᴍᴘʀᴇssɪɴɢ ᴠɪᴅᴇᴏ...')

            const input = './input.mp4'
            const output = './compressed.mp4'

            const buffer =
                await m.quoted.download()

            fs.writeFileSync(input, buffer)

            execSync(
                `"${ffmpeg.path}" -y -i "${input}" -vcodec libx264 -crf 28 -preset veryfast "${output}"`
            )

            await sock.sendMessage(
                m.from,
                {
                    video: fs.readFileSync(output),
                    mimetype: 'video/mp4',
                    caption: 'ᴄᴏᴍᴘʀᴇssᴇᴅ sᴜᴄᴄᴇssғᴜʟʟʏ'
                }
            )

            fs.unlinkSync(input)
            fs.unlinkSync(output)

        } catch (e) {

            console.log(e)

            m.reply('ғᴀɪʟᴇᴅ ᴛᴏ ᴄᴏᴍᴘʀᴇss ᴠɪᴅᴇᴏ')
        }
    }
}
