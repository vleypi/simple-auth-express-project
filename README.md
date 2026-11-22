# simple auth express project

Сервер аутентификации на Express и SQLite. Учебное задание.

## О приложении

Пользователь регистрируется, входит по имени или почте и получает JWT. Токен возвращается в ответе и ставится в cookie, защищённые маршруты принимают его из cookie или из заголовка `Authorization`. Пароли хранятся в виде хешей bcrypt, токен действует 24 часа.

Пользователи лежат в базе SQLite, файл `users.db` создаётся при первом запуске. На главной странице сервера перечислены все маршруты.

## Маршруты

| Метод | Адрес | Что делает |
|---|---|---|
| POST | `/api/auth/signup` | регистрация, пароль не короче 6 символов |
| POST | `/api/auth/signin` | вход по имени или почте |
| POST | `/api/auth/logout` | выход |
| GET | `/api/users/profile` | профиль текущего пользователя, нужен токен |
| GET | `/api/users` | список пользователей, нужен токен |

## Как запустить

Потребуются Git и Node.js 18 или новее.

```bash
git clone https://github.com/vleypi/simple-auth-express-project.git
cd simple-auth-express-project
npm install
npm start
```

После запуска сервер доступен по адресу http://localhost:3000. Команда `npm run dev` запускает сервер с автоперезапуском. Секрет для подписи токенов задаётся переменной `JWT_SECRET`, по умолчанию используется тестовый.

## Структура

```
simple-auth-express-project/
├── server.js            запуск сервера и подключение маршрутов
├── config/
│   ├── database.js      подключение к SQLite и таблица users
│   └── jwt.js           секрет и срок действия токена
├── routes/              маршруты авторизации и пользователей
├── controllers/         регистрация, вход, профиль, список пользователей
├── middleware/
│   └── authMiddleware.js проверка токена
├── public/              страница с описанием маршрутов
└── package.json         зависимости и скрипты
```

## Проверка

```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"username":"alice","email":"alice@example.com","password":"qwerty123"}' \
  http://localhost:3000/api/auth/signup

curl -X POST -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"qwerty123"}' \
  http://localhost:3000/api/auth/signin

curl http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer <токен из ответа>"
```
