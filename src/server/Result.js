class Result {
  constructor() {}

  status(status) {
    this._status = status;
    return this;
  }

  ok(msg, body) {
    this._ok = true;
    this.msg = msg;
    this.data = body;
    return this;
  }

  nok(msg, error) {
    this._ok = false;
    this.msg = msg;
    this.errors = error;
    return this;
  }

  flush() {
    return {
      ok: this._ok,
      msg: this.msg,
      data: this.data,
      errors: this.errors,
    };
  }
}

export { Result };
