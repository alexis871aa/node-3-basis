// стандартный модуль NodeJS - модуль FS для работы с файлами
const fs = require('fs/promises')
const path = require('path') // следующий стандартный модуль path
const chalk = require('chalk') // подключаем пакет для украшения консоли

// создадим константу, которая будет будет указывать путь
// __dirname - глобальная константа NodeJS
const notesPath = path.join(__dirname, 'db.json')

async function addNote(title) {
   // const notes = require('./db.json')     // обращение к базе данных делается по другому
   // const notes = Buffer.from(buffer).toString('utf-8')
   // чтобы не прерывать процесс программы NodeJS считывая файлы складывает результат в буффер

   const notes = await getNotes()
   const note = {
      title,
      id: Date.now() + Math.random().toString(36).substr(2, 10)
   }

   notes.push(note)

   await fs.writeFile(notesPath, JSON.stringify(notes))

   console.log(chalk.bgGreen('Note was added!'))
}

async function getNotes() {
   const notes = await fs.readFile(notesPath, {encoding: 'utf-8'})

   return Array.isArray(JSON.parse(notes)) ? JSON.parse(notes) : []
}

async function printNotes() {
   const notes = await getNotes()

   console.log(chalk.bgBlue('Here is the list of notes:'))
   notes.forEach((note => {
      console.log(chalk.blue(note.id), ' ', chalk.blue(note.title))
   }))
}

async function removeNote(id) {
   const notes = await getNotes()
   let newNotes;

   if (!notes.some((note) => note.id === id)) {
      console.log(chalk.bgRed('Note was not find!'))
      return
   }

   newNotes = notes.filter((note) => note.id !== id)

   await fs.writeFile(notesPath, JSON.stringify(newNotes))

   console.log(chalk.bgGreen('Note was deleted!'))
}

// экспортируем эти функции
module.exports = {
   addNote,
   printNotes,
   removeNote
}