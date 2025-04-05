const ResponseStatus = {
  SUCCESS: "success",
  ERROR: "error",
};

const StatusCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  CONFLICT: 409,
};

module.exports = { ResponseStatus, StatusCode };
