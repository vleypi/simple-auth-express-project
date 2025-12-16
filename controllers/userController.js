const { db } = require('../config/database');

const getProfile = (req, res) => {
  db.get(
    'SELECT id, username, email, created_at FROM users WHERE id = ?',
    [req.user.id],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Ошибка сервера' });
      }
      res.json({ user });
    }
  );
};

const getAllUsers = (req, res) => {
  db.all('SELECT id, username, email, created_at FROM users', [], (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
    res.json({ users });
  });
};

module.exports = { getProfile, getAllUsers };