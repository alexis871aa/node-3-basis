const chalk = require('chalk') // подключаем пакет для украшения консоли
// подключаем модель Note для получения возможности чтения и записи в базу данных
const Note = require('./models/Note')

async function addNote(title) {
	// const notes = require('./db.json')     // обращение к базе данных делается по другому
	// const notes = Buffer.from(buffer).toString('utf-8')
	// чтобы не прерывать процесс программы NodeJS считывая файлы складывает результат в буффер
	await Note.create({ title })
	console.log(chalk.bgGreen('Note was added!'))
}

async function getNotes() {
	const notes = await Note.find()
	return Array.isArray(notes) ? notes : []
}

async function updateNote(newTitle, id) {
	await Note.updateOne({ _id: id }, { title: newTitle })
	console.log(chalk.bgGreen('Note was updated!'))
}

async function removeNote(id) {
	await Note.deleteOne({ _id: id })
	console.log(chalk.bgGreen('Note was deleted!'))
}

// экспортируем эти функции
module.exports = {
	addNote,
	getNotes,
	removeNote,
	updateNote,
}
