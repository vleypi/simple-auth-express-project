const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(
  path.join(__dirname, '..', 'users.db'),
  (err) => {
    if (err) {
      console.error('Ошибка подключения к БД:', err);
    } else {
      console.log('Подключено к SQLite базе данных');
    }
  }
);

const initDatabase = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Ошибка создания таблицы:', err);
    } else {
      console.log('Таблица users готова');
    }
  });
};

process.on('SIGINT', () => {
  db.close((err) => {
    if (err) console.error('Ошибка закрытия БД:', err);
    console.log('База данных закрыта');
    process.exit(0);
  });
});

module.exports = { db, initDatabase };

