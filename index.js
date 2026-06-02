const fs = require('fs')
const path = require('path')
const axios = require('axios')

const user = 'abrahamdw882'
const repo = 'xlicon-v'
const branch = 'main'
const githubFolderPath = 'xliconmd-db'

const localBasePath = path.join(__dirname)
const mainFile = path.join(__dirname, 'xliconmd.js')

async function downloadFolder(folderPath, localPath) {
    const url = `https://api.github.com/repos/${user}/${repo}/contents/${folderPath}?ref=${branch}`

    try {
        const { data } = await axios.get(url, {
            headers: { 'User-Agent': 'axios' }
        })

        for (const item of data) {
            const localFilePath = path.join(
                localPath,
                item.path.replace(githubFolderPath + '/', '')
            )

            if (item.type === 'file') {
                if (fs.existsSync(localFilePath)) continue

                fs.mkdirSync(path.dirname(localFilePath), { recursive: true })

                const { data: fileData } = await axios.get(item.download_url, {
                    responseType: 'text'
                })

                fs.writeFileSync(localFilePath, fileData, 'utf8')
            } else if (item.type === 'dir') {
                if (!fs.existsSync(localFilePath)) {
                    fs.mkdirSync(localFilePath, { recursive: true })
                }

                await downloadFolder(item.path, localPath)
            }
        }
    } catch (err) {
        console.error(`❌ Error reading folder ${folderPath}:`, err.message)
    }
}

async function start() {
    try {
        const missingFiles =
            !fs.existsSync(path.join(__dirname, 'lib')) ||
            !fs.existsSync(path.join(__dirname, 'plugins')) ||
            !fs.existsSync(path.join(__dirname, 'handler.js')) ||
            !fs.existsSync(path.join(__dirname, 'xliconmd.js'))

        if (missingFiles) {
            console.log(' Files        : Downloading...')
            await downloadFolder(githubFolderPath, localBasePath)
            console.log('📦 Files        : ✅ Download Complete')
        } else {
            console.log('🛡️ Files        : 🔁 Already exist — skipping download.')
        }

        if (fs.existsSync(mainFile)) {
            require('./xliconmd')
        } else {
            console.log('❌ xliconmd.js not found after download.')
        }
    } catch (err) {
        console.error('❌ Error in start XLICON-MD ():', err.message)
    }
}

start()
