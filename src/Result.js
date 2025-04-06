class Result {
  constructor() {
    this.status = 0;
    this.code = 0;
    this.msg = "";
    this.data = null;
    this.err = null;
  }
  ok(data, msg) {
    this.status = 1;
    this.msg = msg;
    this.data = Object.assign({}, data);
  }
  nok(error, msg) {
    this.status = 0;
    this.msg = msg;
    if (error instanceof Error) {
      this.err = error;
    } else {
      this.data = error;
    }
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
