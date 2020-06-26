class CustomError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class PostgresError extends CustomError {
  constructor({ message, query }) {
    super(message);
    this.query = query;
  }
}

class MssqlError extends CustomError {
  constructor({ message, query }) {
    super(message);
    this.query = query;
  }
}

class AxiosError extends CustomError {
  constructor({ message, url }) {
    super(message);
    this.url = url;
  }
}

module.exports = {
  PostgresError,
  AxiosError,
  MssqlError
};
