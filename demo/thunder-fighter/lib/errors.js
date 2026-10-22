class AppError extends Error {
  constructor(status, message, code) {
    super(message);
    this.status = status;
    this.code = code || 'ERROR';
  }
}

class ValidationError extends AppError {
  constructor(message) { super(400, message, 'VALIDATION_ERROR'); }
}

class UnauthorizedError extends AppError {
  constructor(message) { super(401, message || 'Unauthorized', 'UNAUTHORIZED'); }
}

class ForbiddenError extends AppError {
  constructor(message) { super(403, message || 'Forbidden', 'FORBIDDEN'); }
}

class NotFoundError extends AppError {
  constructor(message) { super(404, message || 'Not Found', 'NOT_FOUND'); }
}

class ConflictError extends AppError {
  constructor(message) { super(409, message || 'Conflict', 'CONFLICT'); }
}

class RateLimitError extends AppError {
  constructor(message) { super(429, message || 'Too Many Requests', 'RATE_LIMIT'); }
}

module.exports = {
  AppError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  RateLimitError
};
