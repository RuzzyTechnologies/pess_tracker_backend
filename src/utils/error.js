class HttpError extends Error {
  status_code;
  success;

  constructor(statusCode, message) {
    super(message);
    this.name = this.constructor.name;
    this.status_code = statusCode;
  }
}

class BadRequest extends HttpError {
  constructor(message) {
    super(400, message);
  }
}

class ResourceNotFound extends HttpError {
  constructor(message) {
    super(404, message);
  }
}
class Unauthorized extends HttpError {
  constructor(message) {
    super(401, message);
  }
}
class Forbidden extends HttpError {
  constructor(message) {
    super(403, message);
  }
}
class Conflict extends HttpError {
  constructor(message) {
    super(409, message);
  }
}
class InvalidInput extends HttpError {
  constructor(message) {
    super(422, message);
  }
}
class ServerError extends HttpError {
  constructor(message) {
    super(500, message);
  }
}


module.exports = { ServerError, ResourceNotFound, Unauthorized, HttpError, BadRequest, Conflict, InvalidInput, Forbidden };