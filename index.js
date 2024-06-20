// стандартный модуль для создания веб-интерфейса http
const http = require('http')
const chalk = require('chalk')

const PORT = 3005

const server = http.createServer((req, res) => {
	console.log('Request object:', req.method) // смотрим метод, с которым мы делали запрос
	console.log('Request object:', req.url) // смотрим url запроса

	res.end('Hello from server!')
})

server.listen(PORT, () => {
	console.log(chalk.green(`Server has been started on port ${PORT}...`))
})
