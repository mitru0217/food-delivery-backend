const ApiError = require('../error/apiError');
const tokenService = require('../service/token-service');

module.exports = function (req, res, next) {
  try {
    //get authorization header from request body
    const authorizationHeader = req.headers.authorization;
    // check for the presence of authorization header
    if (!authorizationHeader) {
      // if the header is missing we throw an error and pass it to the next handler
      return next(ApiError.unauthorized());
    }
    // get access token from header and split the string to get only token without word "Bearer"
    const accessToken = authorizationHeader.split(' ')[1];
    // check for the presence of access token
    if (!accessToken) {
      // if the access token is missing we throw an error and pass it to the next handler
      return next(ApiError.unauthorized());
    }
    // check the access token through the service 'adminTokenService' for validation
    const userData = tokenService.validateAccessToken(accessToken);
    // check user data after token validation
    if (!userData) {
      return next(ApiError.unauthorized());
    }
    // if all checks were successful, then add information about user to the request object
    req.user = userData;
    // transfer control to the next handler
    next();
  } catch (e) {
    return next(ApiError.unauthorized());
  }
};
