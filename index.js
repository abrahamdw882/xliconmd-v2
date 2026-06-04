const fs = require('fs')
const path = require('path')
const axios = require('axios')

const user = 'abrahamdw882'
const repo = 'xlicon-v'
const branch = 'main'
const githubFolderPath = 'xliconmd-db'

const localBasePath = __dirname
const mainFile = path.join(__dirname, 'xliconmd.js')

async function downloadFolder(folderPath, localPath) {
    const url =
`https://api.github.com/repos/${user}/${repo}/contents/${folderPath}?ref=${branch}`

    const { data } = await axios.get(url, {
        headers: {
            'User-Agent': 'axios'
        }
    })

    for (const item of data) {

        const localFilePath = path.join(
            localPath,
            item.path.replace(
                githubFolderPath + '/',
                ''
            )
        )

        if (item.type === 'dir') {

            fs.mkdirSync(
                localFilePath,
                { recursive: true }
            )

            await downloadFolder(
                item.path,
                localPath
            )

        } else {

            fs.mkdirSync(
                path.dirname(localFilePath),
                { recursive: true }
            )

            console.log(`⬇ Downloading ${item.path}`)

            const file = await axios.get(
                item.download_url,
                {
                    responseType: 'text'
                }
            )

            fs.writeFileSync(
                localFilePath,
                file.data,
                'utf8'
            )

            console.log(`✅ Saved ${localFilePath}`)
        }
    }
}

async function start() {

    try {

        const missing =
            !fs.existsSync('./plugins') ||
            !fs.existsSync('./lib') ||
            !fs.existsSync('./handler.js') ||
            !fs.existsSync('./xliconmd.js')

        if (missing) {

            console.log(
                '📦 Missing files detected. Downloading...'
            )

            await downloadFolder(
                githubFolderPath,
                localBasePath
            )

            console.log('✅ Download finished')

        }

        console.log({
            plugins: fs.existsSync('./plugins'),
            lib: fs.existsSync('./lib'),
            handler: fs.existsSync('./handler.js'),
            main: fs.existsSync('./xliconmd.js')
        })

        if (!fs.existsSync(mainFile)) {
            throw new Error(
                'xliconmd.js missing after download'
            )
        }

        require('./xliconmd')

    } catch (err) {

        console.error(
            'Startup failed:',
            err
        )

        process.exit(1)
    }
}

start()
