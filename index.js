import { debug } from "./debug.js";
import { blueprints } from "./seed/blueprints.js";
import { find_optimal_blueprints } from "./src/api/optimal-blueprint.js";

const optimal_blueprints = find_optimal_blueprints(
  {
    t: 200,
    s: 200,
    c: 200,
  },
  blueprints,
);
debug('optimal blueprints')(optimal_blueprints);
