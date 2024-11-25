class Kerror extends Error {
  constructor(defaults = {}, { runtime, cause } = {}) {
    if (runtime?.async)
      return (cause) => {
        throw new Kerror(
          { ...defaults },
          { runtime: { ...runtime, async: false }, cause },
        );
      };

    super(
      typeof runtime === "string"
        ? runtime
        : runtime?.message ||
            defaults.message ||
            defaults.statusText ||
            cause?.message ||
            cause?.statusText,
      { cause: runtime.cause || cause },
    );
    this.name = defaults.name;
    this.errno =
      runtime?.errno ||
      runtime?.status ||
      defaults.errno ||
      defaults.status ||
      cause?.errno ||
      cause?.status;
    this.status = runtime?.status || defaults.status || cause?.status;
    this.statusText =
      runtime?.statusText || defaults.statusText || cause?.statusText;

    let lines;
    if (runtime instanceof Error) {
      const lines = runtime.stack.split("\n");
      this.stack = lines.join("\n");
    } else {
      const lines = this.stack.split("\n");
      this.stack = [lines[0], ...lines.slice(2)].join("\n");
    }
    return this;
  }

  toJson() {
    return {
      message: this.message,
      cause: this.cause.message || this.cause,
      errno: this.errno,
      status: this.status,
      statusText: this.statusText,
    };
  }

  /* Client Errors (400) */
  static ERR_BAD_REQUEST(runtime, cause) {
    // Request body/headers invalid
    return new Kerror(
      {
        name: "ERR_INVALID_ARGUMENTS",
        message: "Invalid Arguments",
        status: 400,
        statusText: "Bad Request",
      },
      { runtime, cause },
    );
  }
  static ERR_UNAUTHENTICATED(runtime, cause) {
    // API Consumer Unidentified
    return new Kerror(
      {
        name: "ERR_UNAUTHENTICATED",
        message: "Unauthenticated",
        status: 401,
        statusText: "Unauthorized",
      },
      { runtime, cause },
    );
  }
  static ERR_UNAUTHORIZED(runtime, cause) {
    // API Consumer missing permissions
    return new Kerror(
      {
        name: "ERR_UNAUTHORIZED",
        message: "Unauthorized",
        status: 403,
        statusText: "Forbidden",
      },
      { runtime, cause },
    );
  }
  static ERR_NOT_FOUND(runtime, cause) {
    // Resource Missing
    return new Kerror(
      {
        name: "ERR_NOT_FOUND",
        message: "Not Found",
        status: 404,
        statusText: "Not Found",
      },
      { runtime, cause },
    );
  }
  static ERR_API(runtime, cause) {
    // An unfulfilled condition in the API
    return new Kerror(
      {
        name: "ERR_API",
        message: "Unable to service the request",
        status: 422,
        statusText: "Unprocessable Entity",
      },
      { runtime, cause },
    );
  }
  /* Server Errors (500) */
  static ERR_SERVER(runtime, cause) {
    return new Kerror(
      {
        name: "ERR_SERVER",
        message: "Internal Server Error",
        status: 500,
        statusText: "Internal Server Error",
      },
      { runtime, cause },
    );
  }
}

export { Kerror };
