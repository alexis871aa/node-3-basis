// пакет для создания для создания сервера express
const express = require('express');
const chalk = require('chalk');
const path = require('path');
const mongoose = require('mongoose');
const { addNote, getNotes, removeNote, updateNote } = require('./notes.controller');
const { addUser } = require('./users.controller');

const PORT = 3000;
// const basePath = path.join(__dirname, 'pages')
const app = express();

// метод set позволяет переопределять какие базовые настройки, которые в нём присутствуют
app.set('view engine', 'ejs'); // эта настройка позволяет теперь переименовать файл index.ejs в index.ejs
app.set('views', __dirname + '/pages'); // меняем настройку папки с views на pages

// устанавливаем возможность отправлять на сервер данные в формате JSON
app.use(express.json());

// устанавливаем статической папкой папку public, таким образом, обозначая, что оттуда можно забирать скрипты
app.use(express.static(path.resolve(__dirname, 'public')));

// учим express формат данных, которые мы принимаем:
app.use(
	// этот метод используется для подключения промежуточного программного обеспечения (middleware) в Express
	express.urlencoded({
		// это встроенное промежуточное программное обеспечение в Express, которое анализирует входящие запросы с заголовком application/x-www-form-urlencoded. Это формат данных, который обычно используется для отправки данных формы через HTTP POST запросы.
		// учим express формат данных, которые мы принимаем:
		extended: true,
		// параметр extended определяет, какой библиотекой будет использоваться для парсинга данных формы.
		// true: Использует библиотеку qs для парсинга данных, что позволяет парсить вложенные объекты.
		// false: Использует встроенную библиотеку querystring, которая не поддерживает вложенные объекты.
	}),
);

// основные контроллеры

app.get('/register', async (req, res) => {
	res.render('register', {
		title: 'Register',
		error: undefined,
	});
});

app.post('/register', async (req, res) => {
	try {
		await addUser(req.body.email, req.body.password);

		res.redirect('login');
	} catch ({ message }) {
		console.error(message);
		res.render('register', {
			title: 'Register',
			error: message,
		});
	}
});

app.post('/', async (req, res) => {
	try {
		await addNote(req.body.title); // можем тут поценциально обрабатывать ошибки

		res.render('index', {
			title: 'Express App',
			notes: await getNotes(),
			created: true,
			error: false,
		});
	} catch ({ message }) {
		console.error('Creation error', message);
		res.render('index', {
			title: 'Express App',
			notes: await getNotes(),
			created: false,
			error: true,
		});
	}
});

app.delete('/:id', async (req, res) => {
	await removeNote(req.params.id);

	res.render('index', {
		title: 'Express App',
		notes: await getNotes(),
		created: false,
		error: false,
	});
});

app.put('/:id', async (req, res) => {
	await updateNote(req.body.title, req.params.id);

	res.render('index', {
		title: 'Express App',
		notes: await getNotes(),
		created: false,
		error: false,
	});
});

mongoose
	.connect(
		'mongodb+srv://alexis871:Valentina2006$@cluster.7kdmzin.mongodb.net/notes?retryWrites=true&w=majority&appName=Cluster',
	)
	.then(() => {
		app.listen(PORT, () => {
			console.log(chalk.green(`Server has been started on port ${PORT}...`));
		});
	});
