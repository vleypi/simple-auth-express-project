const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const { initDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

initDatabase();

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send(`
    <h1>Express.js Auth API</h1>
    <h2>Auth эндпоинты:</h2>
    <ul>
      <li>POST /api/auth/signup - Регистрация</li>
      <li>POST /api/auth/signin - Вход</li>
      <li>POST /api/auth/logout - Выход</li>
    </ul>
    <h2>User эндпоинты (требуют auth):</h2>
    <ul>
      <li>GET /api/users/profile - Получить профиль</li>
      <li>GET /api/users - Получить всех пользователей</li>
    </ul>
  `);
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});