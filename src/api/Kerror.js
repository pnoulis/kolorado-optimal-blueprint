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
        : runtime?.message || defaults.message || cause?.message,
      { cause: runtime instanceof Error ? runtime : cause },
    );
    this.name = defaults.name;
    this.code = runtime?.code || defaults.code || cause?.code;
    Error.captureStackTrace(this, this.constructor);
    const lines = this.stack.split("\n");
    this.stack = [lines[0], ...lines.slice(2)].join("\n");
    return this;
  }
  static ERR_INVALID_ARGUMENTS(runtime, cause) {
    return new Kerror(
      {
        name: "ERR_INVALID_ARGUMENTS",
        message: "Invalid Arguments",
        code: 400,
      },
      { runtime, cause },
    );
  }
  static ERR_INVALID_RESPONSE(runtime, cause) {
    return new Kerror(
      {
        name: "ERR_INVALID_RESPONSE",
        message: "Invalid API Response",
        code: 500,
      },
      { runtime, cause },
    );
  }
  static ERR_UNAUTHENTICATED(runtime, cause) {
    return new Kerror(
      { name: "ERR_UNAUTHENTICATED", message: "Unauthenticated", code: 401 },
      { runtime, cause },
    );
  }
  static ERR_UNAUTHORIZED(runtime, cause) {
    return new Kerror(
      { name: "ERR_UNAUTHORIZED", message: "Unauthorized", code: 403 },
      { runtime, cause },
    );
  }
  static ERR_NOT_FOUND(runtime, cause) {
    return new Kerror(
      { name: "ERR_NOT_FOUND", message: "Not Found", code: 404 },
      { runtime, cause },
    );
  }
  static ERR_SERVER(runtime, cause) {
    return new Kerror(
      { name: "ERR_SERVER", message: "Internal Server Error", code: 500 },
      { runtime, cause },
    );
  }
}

export { Kerror };
