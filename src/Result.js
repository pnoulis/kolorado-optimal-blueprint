class Result {
  constructor() {}

  _ok(msg, data) {
    this.success = 1;
    this._msg = msg;
    this.data = data;
    return this;
  }

  _nok(msg, error) {
    this.success = 0;
    this._msg = msg;
    if (error instanceof Error) {
      this.err = error;
    } else {
      this.data = error;
    }
    return this;
  }

  msg(msg) {
    this._msg = msg;
    return this;
  }

  ok(msg, data) {
    this.results ||= [];
    this.results.push(new Result()._ok(msg, data).serialize());
    return this;
  }

  nok(msg, error) {
    this.results ||= [];
    this.results.push(new Result()._nok(msg, error).serialize());
    return this;
  }

  serialize() {
    if (!this.results) {
      return {
        success: this.success,
        msg: this._msg,
        data: this.err
          ? {
            msg: this.err.message,
            stack: this.err.stack,
          }
          : this.data,
      };
    }
    return this.results.length === 1 ? this.results[0] : this.results;
  }
}

export { Result };
