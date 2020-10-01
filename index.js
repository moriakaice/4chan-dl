const fs = require('fs')
const board = process.argv.slice(2).shift()

const createDir = (path) => fs.existsSync(path) || fs.mkdirSync(path)

if (board) {
  const boardSafeName = board.toLocaleLowerCase().replace(/[^a-z0-9-_]*/g, '')
  createDir(`${__dirname}/dl/${boardSafeName}`)
}
