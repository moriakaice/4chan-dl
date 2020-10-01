const fs = require('fs')
const axios = require('axios')

const MAX_CONCURENCY = 8

const board = process.argv.slice(2).shift()
let requestsCount = 0

const sleep = (miliseconds) => new Promise((resolve) => setTimeout(resolve, miliseconds))

const increaseRequestCount = () => (requestsCount = requestsCount + 1)
const decreaseRequestCount = () => (requestsCount = requestsCount - 1)
const reserveRequestSlot = async () => {
  while (requestsCount >= MAX_CONCURENCY) await sleep(10)
  increaseRequestCount()
}

const createDir = (path) => fs.existsSync(path) || fs.mkdirSync(path)

const downloadImage = async (url, filename) => {
  if (!fs.existsSync(filename)) {
    const response = await axios({
      method: 'get',
      responseType: 'stream',
      url,
    })
    response.data.pipe(fs.createWriteStream(filename))
  }

  decreaseRequestCount()
}

const downloadThread = async (board, thread) => {
  createDir(`${__dirname}/dl/${board}/${thread}`)

  await reserveRequestSlot()
  const threadHtml = (await axios.get(`https://boards.4channel.org/${board}/thread/${thread}`)).data
  decreaseRequestCount()
  const fileRegexp = /<a class="fileThumb" href="([^"]+)/g
  const files = [...threadHtml.matchAll(fileRegexp)].map((match) => match.pop())

  console.log(`\t\tImages to download: ${files.length}`)

  for (let i = 0; i < files.length; i++) {
    await reserveRequestSlot()
    downloadImage(`https:${files[i]}`, `${__dirname}/dl/${board}/${thread}/${files[i].split('/').pop()}`)
  }
}

const run = async (board) => {
  console.log(`Starting download of /${board}/`)
  createDir(`${__dirname}/dl/${board}`)

  const catalogHtml = (await axios.get(`https://boards.4channel.org/${board}/catalog`)).data
  const catalog = JSON.parse(catalogHtml.split('var catalog = ').pop().split(';var style_group').shift())
  const threads = Object.keys(catalog.threads)

  console.log(`Threads to download: ${threads.length}`)
  for (let i = 0; i < threads.length; i++) {
    console.log(`\tThread #${threads[i]} (${i + 1}/${threads.length})`)
    await downloadThread(board, threads[i])
  }
}

if (board) {
  const boardSafeName = board.toLocaleLowerCase().replace(/[^a-z0-9-_]*/g, '')

  run(boardSafeName)
}
