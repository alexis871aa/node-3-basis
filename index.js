require('dotenv').config();

// пакет для создания для создания сервера express
const express = require('express');
const chalk = require('chalk');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { addNote, getNotes, removeNote, updateNote } = require('./notes.controller');
const { addUser, loginUser } = require('./users.controller');
const auth = require('./middlewares/auth');

const port = 3000;
const app = express();

app.set('view engine', 'ejs'); // эта настройка позволяет теперь переименовать файл index.ejs в index.ejs
app.set('views', __dirname + '/pages'); // меняем настройку папки с views на pages

app.use(express.static(path.resolve(__dirname, 'public')));
// устанавливаем возможность отправлять на сервер данные в формате JSON
app.use(express.json());
app.use(cookieParser()); // cookieParser() это middleware для express, который обрабатывает cookie в удобном нам формате
app.use(
	express.urlencoded({
		extended: true,
	}),
);

app.get('/register', async (req, res) => {
	res.render('register', {
		title: 'Register',
		error: undefined,
	});
});

app.post('/register', async (req, res) => {
	try {
		await addUser(req.body.email, req.body.password);

		res.redirect('/login');
	} catch (error) {
		console.error(chalk.bgRed(error.message));

		if (error.code === 11000) {
			res.render('register', {
				title: 'Register',
				error: 'Email is already registered',
			});

			return;
		}

		res.render('register', {
			title: 'Register',
			error: error.message,
		});
	}
});

app.get('/login', async (req, res) => {
	res.render('login', {
		title: 'Login',
		error: undefined,
	});
});

app.post('/login', async (req, res) => {
	try {
		const token = await loginUser(req.body.email, req.body.password);

		res.cookie('token', token, { httpOnly: true });

		res.redirect('/');
	} catch (error) {
		console.error(chalk.bgRed(error.message));

		res.render('login', {
			title: 'Login',
			error: error.message,
		});
	}
});

app.get('/logout', (req, res) => {
	res.cookie('token', '', { httpOnly: true });

	res.redirect('/login');
});

app.use(auth);

app.get('/', async (req, res) => {
	res.render('index', {
		title: 'Express App',
		notes: await getNotes(),
		userEmail: req.user.email,
		created: false,
		error: false,
	});
});

app.post('/', async (req, res) => {
	try {
		await addNote(req.body.title, req.user.email); // можем тут поценциально обрабатывать ошибки

		res.render('index', {
			title: 'Express App',
			notes: await getNotes(),
			userEmail: req.user.email,
			created: true,
			error: false,
		});
	} catch ({ message }) {
		console.error('Creation error', message);

		res.render('index', {
			title: 'Express App',
			notes: await getNotes(),
			userEmail: req.user.email,
			created: false,
			error: true,
		});
	}
});

app.delete('/:id', async (req, res) => {
	try {
		await removeNote(req.params.id, req.user.email);

		res.render('index', {
			title: 'Express App',
			notes: await getNotes(),
			userEmail: req.user.email,
			created: false,
			error: false,
		});
	} catch (error) {
		res.render('index', {
			title: 'Express App',
			notes: await getNotes(),
			userEmail: req.user.email,
			created: false,
			error: error.message,
		});
	}
});

app.put('/:id', async (req, res) => {
	try {
		await updateNote({ newTitle: req.body.title, id: req.params.id }, req.user.email);

		res.render('index', {
			title: 'Express App',
			notes: await getNotes(),
			userEmail: req.user.email,
			created: false,
			error: false,
		});
	} catch (error) {
		res.render('index', {
			title: 'Express App',
			notes: await getNotes(),
			userEmail: req.user.email,
			created: false,
			error: error.message,
		});
	}
});

mongoose.connect(process.env.MONGODB_CONNECTIONS_STRING).then(() => {
	app.listen(port, () => {
		console.log(chalk.green(`Server has been started on port ${port}...`));
	});
});
