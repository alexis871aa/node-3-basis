const chalk = require('chalk')
const http = require('http')
const fs = require('fs/promises')
const path = require('path')
const { addNote } = require('./notes.controller')

const basePath = path.join(__dirname, 'pages')

const PORT = 3000

const server = http.createServer(async (req, res) => {
	if (req.method === 'GET') {
		const content = await fs.readFile(path.join(basePath, 'index.ejs'))
		// res.setHeader('Content-Type', 'text/html')
		res.writeHead(200, {
			'Content-Type': 'text/html',
		})
		res.end(content)
	} else if (req.method === 'POST') {
		const body = []
		res.writeHead(200, {
			'Content-Type': 'text/plain; charset=utf-8',
		})

		req.on('data', (data) => {
			body.push(Buffer.from(data))
		})

		req.on('end', async () => {
			const title = body.toString().split('=').at(1).replaceAll('+', ' ')

			await addNote(title)

			res.end(`Title = ${title}`)
		})
	}
})

server.listen(PORT, () => {
	console.log(chalk.green(`Server has been started on port ${PORT}...`))
})
