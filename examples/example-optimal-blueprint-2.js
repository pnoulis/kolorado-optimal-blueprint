import { find_optimal_blueprints } from "../packages/server/src/optimal-blueprint.js";
import { exampleInputs } from "./example-input.js";

const optimal_blueprints = find_optimal_blueprints(
  exampleInputs[1].target_shapes,
  exampleInputs[1].source_blueprints,
);
console.log(optimal_blueprints);
