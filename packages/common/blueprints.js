const blueprint = {
  states(state, form) {
    switch (state) {
      case "active":
        return form === "number" ? 0 : state;
      case 0:
        return form === "alpha" ? "active" : state;
      case "deleted":
        return form === "number" ? 1 : state;
      case 1:
        return form === "alpha" ? "deleted" : state;
      case "invalid":
        return form === "number" ? 2 : state;
      case 2:
        return form === "alpha" ? "invalid" : state;
      default:
        throw new TypeError(`Unknown state enum key: '${state}'`);
    }
  },
};

export { blueprint };
