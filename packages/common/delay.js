function delay(ms, fail) {
  return new Promise((resolve, reject) =>
    setTimeout(fail ? reject : resolve, ms),
  );
}

export { delay };
