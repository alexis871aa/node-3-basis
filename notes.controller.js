const chalk = require('chalk'); // подключаем пакет для украшения консоли
// подключаем модель Note для получения возможности чтения и записи в базу данных
const Note = require('./models/Note');

async function addNote(title, owner) {
	// const notes = require('./db.json')     // обращение к базе данных делается по другому
	// const notes = Buffer.from(buffer).toString('utf-8')
	// чтобы не прерывать процесс программы NodeJS считывая файлы складывает результат в буффер
	await Note.create({ title, owner });
	console.log(chalk.bgGreen('Note was added!'));
}

async function getNotes() {
	const notes = await Note.find();
	return Array.isArray(notes) ? notes : [];
}

async function removeNote(id, owner) {
	const result = await Note.deleteOne({ _id: id, owner });

	if (result.matchedCount === 0) {
		throw new Error('No note to delete!');
	}

	console.log(chalk.bgGreen('Note was deleted!'));
}

async function updateNote(noteData, owner) {
	const result = await Note.updateOne(
		{ _id: noteData.id, owner },
		{ title: noteData.newTitle },
	);

	if (result.matchedCount === 0) {
		throw new Error('No note to edit!');
	}

	console.log(chalk.bgGreen('Note was updated!'));
}

// экспортируем эти функции
module.exports = {
	addNote,
	getNotes,
	removeNote,
	updateNote,
};
