// middleware для проверки JWT токена
const jwt = require('jsonwebtoken');

const jwtMiddleware = (req, res, next) => {
  // Получение токена из запроса (например, из заголовка или куки)
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Authorization denied' });
  }

  try {
    // Проверка и верификация токена
    const decoded = jwt.verify(token);
    // Добавление данных пользователя в req.user
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = jwtMiddleware;
