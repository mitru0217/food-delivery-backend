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

// async function generateAndSaveTokens(user, service) {
//   const payload = {
//     userId: user.id,
//     email: user.email,
//   };

//   // Используем тернарный оператор для выбора между tokenService и adminTokenService
//   const tokens = adminTokenService
//     ? adminTokenService.generateTokens(payload)
//     : tokenService.generateTokens(payload);

//   // Вызываем метод сохранения токена из выбранного сервиса
//   await (adminTokenService
//     ? adminTokenService.saveToken(user.id, tokens.refreshToken)
//     : tokenService.saveToken(user.id, tokens.refreshToken));

//   return {
//     ...tokens,
//     user,
//   };
// }
