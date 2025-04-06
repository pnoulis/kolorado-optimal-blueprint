class Result {
  constructor() {
    this.status = 0;
    this.msg = "";
    this.data = null;
    this.err = null;
  }
  ok(msg, data) {
    this.status = 1;
    this.msg = msg;
    this.data = data;
    return this;
  }
  nok(msg, error) {
    this.status = 0;
    this.msg = msg;
    if (error instanceof Error) {
      this.err = error;
    } else {
      this.data = error;
    }
    return this;
  }
  serialize() {
    return {
      status: this.status,
      msg: this.msg,
      data: this.err ? {
        msg: this.err.message,
        stack: this.err.stack
      } : this.data
    };
  }
}

export { Result };
