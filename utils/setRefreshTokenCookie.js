async function setRefreshTokenCookie(res, refreshToken) {
  try {
    // trying to set cookie
    await res.cookie('refreshToken', refreshToken, {
      maxAge: 60 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
    });
    //if the cookie is successfully set
    return true;
  } catch (error) {
    // if there was an error setting the cookie
    return false;
  }
}

module.exports = { setRefreshTokenCookie };
