async function generateAndSaveTokens(user, service) {
  const payload = {
    userId: user.id,
    email: user.email,
  };
  const tokens = service.generateTokens(payload);
  await service.saveToken(user.id, tokens.refreshToken);
  return {
    ...tokens,
    user,
  };
}
module.exports = { generateAndSaveTokens };
