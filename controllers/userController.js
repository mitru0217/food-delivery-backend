const ApiError = require('../error/apiError');
const { validationResult } = require('express-validator');
const userService = require('../service/user-service');
const { setRefreshTokenCookie } = require('../utils/setRefreshTokenCookie');

class UserController {
  async register(req, res, next) {
    try {
      //validate
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.badRequest('Validation error', errors.array()));
      }
      // extract name, email, password from the request body
      const { name, email, password } = req.body;
      //pass this data to the  register function inside the UserService
      const userData = await userService.register(name, email, password);
      // save refresh token into the cookies
      const refreshTokenSet = await setRefreshTokenCookie(
        res,
        userData.refreshToken
      );
      // checking the success of cookie setting
      if (!refreshTokenSet) {
        return res
          .status(500)
          .json({ error: 'Error setting cookie refreshToken' });
      }

      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      const refreshTokenSet = await setRefreshTokenCookie(
        res,
        userData.refreshToken
      );
      if (!refreshTokenSet) {
        return res
          .status(500)
          .json({ error: 'Error setting cookie refreshToken' });
      }
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      const refreshTokenSet = await setRefreshTokenCookie(
        res,
        userData.refreshToken
      );
      if (!refreshTokenSet) {
        return res
          .status(500)
          .json({ error: 'Error setting cookie refreshToken' });
      }
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
  async avatar(req, res, next) {
    try {
      const id = req.user.userId;

      const pathFile = req.file.path;
      const url = await userService.updateAvatar(id, pathFile);
      return res.json({ status: 'success', avatarUrl: url });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = UserController;
