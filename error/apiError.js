class ApiError extends Error {
  constructor(status, message, errors = []) {
    super();

    this.status = status;
    this.message = message;
    this.errors = errors;
  }
  static unauthorized() {
    return new ApiError(401, message);
  }

  static badRequest(message) {
    return new ApiError(400, message);
  }

  static internal(message) {
    return new ApiError(500, message);
  }

  static forbidden(message) {
    return new ApiError(403, message);
  }
}

module.exports = ApiError;
