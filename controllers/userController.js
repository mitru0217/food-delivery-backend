const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ApiError = require('../error/apiError');

const { User } = require('../models/models');

const generateJWT = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
    expiresIn: '24h',
  });
};

class UserController {
  async handleRegisterAndLogin(req, res, next) {
    const { name, email, password, role, login } = req.body;

    try {
      if (login) {
        // Логика входа
        const user = await User.findOne({ where: { email } });

        if (!user) {
          return next(ApiError.internal('Пользователь не найден'));
        }

        const comparePassword = bcrypt.compareSync(password, user.password);

        if (!comparePassword) {
          return next(ApiError.internal('Указан неверный пароль'));
        }

        const token = generateJWT(user.id, user.email, user.role);

        return res.json({ token });
      } else {
        // Логика регистрации
        if (!email || !password) {
          return next(ApiError.badRequest('Некорректный email или password'));
        }

        const candidate = await User.findOne({ where: { email } });

        if (candidate) {
          return next(
            ApiError.badRequest('Пользователь с таким email уже существует')
          );
        }

        const hashPassword = await bcrypt.hash(password, 7);
        const user = await User.create({
          name,
          email,
          role,
          password: hashPassword,
        });

        const token = generateJWT(user.id, user.email, user.role);

        return res.json({ token });
      }
    } catch (error) {
      return next(ApiError.internal('Ошибка при обработке запроса'));
    }
  }

  async check(req, res, next) {
    const token = generateJWT(req.user.id, req.user.email, req.user.role);
    return res.json({ token });
  }
}

// class UserController {
//   async registration(req, res, next) {
//     const { name, email, password, role } = req.body;

//     if (!email || !password) {
//       return next(ApiError.badRequest('Некорректный email или password'));
//     }
//     const candidate = await User.findOne({ where: { email } });

//     if (candidate) {
//       return next(
//         ApiError.badRequest('Пользователь с таким email уже существует')
//       );
//     }
//     const hashPassword = await bcrypt.hash(password, 5);

//     const user = await User.create({
//       name,
//       email,
//       role,
//       password: hashPassword,
//     });

//     const token = generateJWT(user.id, user.email, user.role);
//     return res.json({ token });
//   }

//   async login(req, res, next) {
//     const { email, password } = req.body;

//     const user = await User.findOne({ where: { email } });

//     if (!user) {
//       return next(ApiError.internal('Пользователь не найден'));
//     }
//     let comparePassword = bcrypt.compareSync(password, user.password);
//     if (!comparePassword) {
//       return next(ApiError.internal('Указан не верный пароль'));
//     }
//     const token = generateJWT(user.id, user.email, user.role);

//     return res.json({ token });
//   }

//   async check(req, res, next) {
//     const token = generateJWT(req.user.id, req.user.email, req.user.role);
//     return res.json({ token });
//   }
// }

module.exports = UserController;
