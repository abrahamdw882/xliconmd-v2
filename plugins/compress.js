const fs = require('fs')
const ffmpeg = require('@ffmpeg-installer/ffmpeg')
const { execSync } = require('child_process')

module.exports = {
    name: 'compress',
    aliases: ['cmp', 'compressvideo'],

    async execute(sock, m) {

        if (!m.quoted) {
            return m.reply('Reply to a video')
        }

        const mime =
            m.quoted.message?.videoMessage?.mimetype || ''

        if (!mime.includes('video')) {
            return m.reply('Reply to a video')
        }

        try {

            await m.reply('Compressing video...')

            const input = './input.mp4'
            const output = './compressed.mp4'

            const buffer =
                await m.quoted.download()

            fs.writeFileSync(input, buffer)

            execSync(
                `"${ffmpeg.path}" -y -i "${input}" -vcodec libx264 -crf 35 -preset veryfast "${output}"`
            )

            await sock.sendMessage(
                m.from,
                {
                    video: fs.readFileSync(output),
                    mimetype: 'video/mp4',
                    caption: 'Compressed successfully'
                }
            )

            fs.unlinkSync(input)
            fs.unlinkSync(output)

        } catch (e) {

            console.log(e)

            m.reply('Failed to compress video')
        }
    }
}
