import { find_optimal_blueprints } from "../packages/server/src/optimal-blueprint.js";
import { exampleInputs } from "./example-input.js";

const optimal_blueprints = find_optimal_blueprints(
  exampleInputs[0].target_shapes,
  exampleInputs[0].source_blueprints,
);
console.log(optimal_blueprints); /* ->
{
  target_shapes_unique: [ { id: 1, count: 5 }, { id: 2, count: 2 } ],
  optimal_blueprints_unique: [ { id: 3, count: 2 }, { id: 1, count: 1 }, { id: 2, count: 2 } ],
  shape_remainders_map: [ { id: 1, count: 0 }, { id: 3, count: 5 }, { id: 2, count: 0 } ],
  target_shapes_total_count: 7,
  target_shapes_unique_count: 2,
  optimal_blueprints_total_count: 5,
  optimal_blueprints_unique_count: 3,
  remainder: 5,
  score: 0
}
 */
