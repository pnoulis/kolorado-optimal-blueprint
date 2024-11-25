function matchResourceRepresentationRequest(availableRepresentations) {
  const caseInsensitive = availableRepresentations.map((_) => _.toLowerCase());
  return function (req, res, next) {
    const candidates = req.get("accept").split(",");
    const matched = candidates.find((candidate) =>
      caseInsensitive.includes(candidate.toLowerCase()),
    );
    if (!matched)
      throw new Error(`Could not match representation: ${req.get("accept")}`);
    res.set("content-type", matched);
    next();
  };
}

export { matchResourceRepresentationRequest };
