import { generate_optimal_blueprint } from "../packages/server/src/optimal-blueprint.js";
import { exampleInputs } from "./example-input.js";
import { timing } from "common/timing.js";

timing.start();
const optimal_blueprints = generate_optimal_blueprint(
  exampleInputs[1].target_shapes,
  exampleInputs[1].source_blueprints,
);
console.log(timing.stop());
console.log(optimal_blueprints); /* ->
{
  target_shapes_unique: [
    { id: 1, name: 'Square', count: 2 },
    { id: 4, name: 'Diamond', count: 5 }
  ],
  optimal_blueprints_unique: [
    { id: 5, name: 'Blueprint E', shapes: [Array], count: 5 },
    { id: 2, name: 'Blueprint B', shapes: [Array], count: 1 }
  ],
  optimal_shapes_remainder: [
    { id: 4, name: 'Diamond', count: 5, score: 0 },
    { id: 1, name: 'Circle', count: 2, score: 0 },
    { id: 2, name: 'Square', count: 2, score: 2 },
    { id: 3, name: 'Triangle', count: 2, score: 2 }
  ],
  target_shapes_total_count: 7,
  target_shapes_unique_count: 2,
  optimal_shapes_total_count: 11,
  optimal_shapes_unique_count: 4,
  optimal_blueprints_total_count: 6,
  optimal_blueprints_unique_count: 2,
  remainder: 4,
  score: 0
}
*/
