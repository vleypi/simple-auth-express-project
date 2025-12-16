const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../config/database');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/jwt');

const signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Пароль должен быть минимум 6 символов' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Пользователь уже существует' });
          }
          return res.status(500).json({ error: 'Ошибка сервера' });
        }

        const token = jwt.sign(
          { id: this.lastID, username, email },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRES_IN }
        );

        res.cookie('token', token, { httpOnly: true, maxAge: 86400000 });
        res.status(201).json({
          message: 'Пользователь успешно зарегистрирован',
          user: { id: this.lastID, username, email },
          token
        });
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

const signin = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  db.get(
    'SELECT * FROM users WHERE username = ? OR email = ?',
    [username, username],
    async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Ошибка сервера' });
      }

      if (!user) {
        return res.status(401).json({ error: 'Неверные учетные данные' });
      }

      try {
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
          return res.status(401).json({ error: 'Неверные учетные данные' });
        }

        const token = jwt.sign(
          { id: user.id, username: user.username, email: user.email },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRES_IN }
        );

        res.cookie('token', token, { httpOnly: true, maxAge: 86400000 });
        res.json({
          message: 'Вход выполнен успешно',
          user: { id: user.id, username: user.username, email: user.email },
          token
        });
      } catch (err) {
        res.status(500).json({ error: 'Ошибка сервера' });
      }
    }
  );
};

const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Выход выполнен успешно' });
};

module.exports = { signup, signin, logout };