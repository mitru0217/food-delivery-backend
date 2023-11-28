const tokenService = require('../service/token-service');

async function generateAndSaveTokens(user) {
  const payload = {
    userId: user.id,
    email: user.email,
  };
  const tokens = tokenService.generateTokens(payload);
  await tokenService.saveToken(user.id, tokens.refreshToken);
  return {
    ...tokens,
    user,
  };
}

module.exports = { generateAndSaveTokens };
