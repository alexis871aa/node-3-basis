// для того, чтобы работать с базой данных Note, опишем модель БД в папке models
const mongoose = require('mongoose'); // импортируем mongoose

// описываем схему данных, она будет позволять mongoose валидировать нашиданные перед тем, как отправлять их в базу. Необходимо на уровне приложения сделать валидацию данных

// таким образом схема - это описание самой структуры данных, какие валидаторы будут использоваться, а модель это уже абстракция, с которой мы будем работать. То есть модель позволит нам доставать данные, их сохранять и т.д.

const NoteSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	owner: {
		type: String,
		required: true,
	},
});

const Note = mongoose.model('Note', NoteSchema);

module.exports = Note;
