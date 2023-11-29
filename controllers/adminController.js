const ApiError = require('../error/apiError');
const { validationResult } = require('express-validator');
const { setRefreshTokenCookie } = require('../utils/setRefreshTokenCookie');

const adminService = require('../service/admin-service');

class AdminController {
  //registration
  async register(req, res, next) {
    try {
      // check the validation of the request data
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // // if there are validation errors return  "Bad Request" and pass to the next handler
        return next(ApiError.badRequest('Validation error', errors.array()));
      }
      // extract name, email, password from the request body
      const { name, email, password } = req.body;
      // register  a new user  through adminService using the extracted data
      const userData = await adminService.register(name, email, password);
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
      // return data of new user in the json format
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
  //login
  async login(req, res, next) {
    try {
      // Extracting email and password from the request body
      const { email, password } = req.body;
      // Logging in by using adminService with the provided email and password
      const userData = await adminService.login(email, password);
      // Setting the refresh token in the response cookie
      const refreshTokenSet = await setRefreshTokenCookie(
        res,
        userData.refreshToken
      );
      // Checking if setting the refresh token in the cookie was unsuccessful
      if (!refreshTokenSet) {
        // If setting the refresh token fails, return a 500 server error
        return res
          .status(500)
          .json({ error: 'Error setting cookie refreshToken' });
      }
      // Returning the user data in JSON format
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
  //logout
  async logout(req, res, next) {
    try {
      // Extracting the refreshToken from the request cookies
      const { refreshToken } = req.cookies;
      // Logging out the user using adminService with the provided refreshToken
      const token = await adminService.logout(refreshToken);
      // Clearing the 'refreshToken' cookie from the response
      res.clearCookie('refreshToken');
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }
  //This code handles the refresh of a user's authentication token
  async refresh(req, res, next) {
    try {
      // Extracting the refreshToken from the request cookies
      const { refreshToken } = req.cookies;
      // Refreshing user data using adminService with the provided refreshToken
      const userData = await adminService.refresh(refreshToken);
      // Setting the new refreshToken in the response cookie
      const refreshTokenSet = await setRefreshTokenCookie(
        res,
        userData.refreshToken
      );
      // Checking if setting the refreshToken in the cookie was unsuccessful
      if (!refreshTokenSet) {
        // If setting the refreshToken fails, return a 500 server error
        return res
          .status(500)
          .json({ error: 'Error setting cookie refreshToken' });
      }
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
  async getUsers(req, res, next) {
    try {
      const users = await adminService.getAllUsersForAdmin();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = AdminController;
