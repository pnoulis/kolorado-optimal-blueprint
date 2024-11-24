import { performance } from "node:perf_hooks";

const timings = new Map();

const timing = {
  start: (label = "default") => {
    if (timings.has(label)) throw new Error(`Duplicate timing: ${label}`);
    return timings.set(label, performance.now());
  },
  stop: (label = "default") => {
    if (!timings.has(label)) throw new Error(`Missing timing: ${label}`);
    const timing = (performance.now() - timings.get(label)).toFixed(3);
    timings.clear(label);
    return timing;
  },
};

export { timing };
