# 4chan-dl

[4chan.org](https://4chan.org/) image downloader is a command-line Node.js application that allows for an easy way to download images from boards on 4chan.

## Running the project

Checkout the repository, then install dependencies with `npm install` command.

To download selected board, run the following command: `npm run dl boardPrefix`, where you replace `boardPrefix` with the prefix of the board (e.g. `w`): `npm run dl w`

All images will be stored under `dl/boardPrefix`, with each thread having a separate directory.
