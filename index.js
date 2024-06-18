const yargs = require('yargs')  // данный пакет нам поможет в чтении параметров и в формировании документации
const pkg = require('./package.json') // подключаем package.json как JS объект

const {addNote, getNotes, printNotes, removeNote} = require('./notes.controller') // подключаем модуль notes.controller

// метод для актуализации версии программы (появляется по команде node index --version)
yargs.version(pkg.version)

// регистрируем команду для добавления заметки в лист заметок
yargs.command({   // WebStorm показывает, что он не знает такую команду, лечиться npm i @types/yargs
   command: 'add',
   describe: 'Add new note to list',
   builder: {
      title: {
         type: 'string',
         describe: 'Note title',
         demandOption: true,  // это обязательный параметр для работы данной команды
      }
   },
   async handler({ title }) { // деструктуризируем options считывает параметры консоли
      await addNote(title)
   }
})

// регистрируем команду для вывода всех заметок в листе заметок
yargs.command({
   command: 'list',
   describe: 'Print all notes',
   async handler() {
      await printNotes()
   }
})

// регистрируем команду для удаления заметок по ID
yargs.command({
   command: 'remove',
   describe: 'Remove note by id',
   builder: {
      id: {
         type: 'string',
         describe: 'Note ID',
         demandOption: true,  // это обязательный параметр для работы данной команды
      }
   },
   async handler({ id }) {
      await removeNote(id)
   }
})

// инициализируем команды
yargs.parse()
