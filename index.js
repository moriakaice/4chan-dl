const fs = require('fs')
const axios = require('axios')

const board = process.argv.slice(2).shift()

const createDir = (path) => fs.existsSync(path) || fs.mkdirSync(path)

const downloadThread = async (board, thread) => {
  createDir(`${__dirname}/dl/${board}/${thread}`)
}

const run = async (board) => {
  createDir(`${__dirname}/dl/${board}`)

  const catalogHtml = (await axios.get(`https://boards.4channel.org/${board}/catalog`)).data
  const catalog = JSON.parse(catalogHtml.split('var catalog = ').pop().split(';var style_group').shift())
  const threads = Object.keys(catalog.threads)

  for (let i = 0; i < threads.length; i++) await downloadThread(board, threads[i])
}

if (board) {
  const boardSafeName = board.toLocaleLowerCase().replace(/[^a-z0-9-_]*/g, '')

  run(boardSafeName)
}
