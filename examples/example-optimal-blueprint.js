import { generate_optimal_blueprint } from "../packages/server/src/optimal-blueprint.js";
import { exampleInputs } from "./example-input.js";
import { executionTime } from "common/executionTime.js";

executionTime.start();
const optimal_blueprints = generate_optimal_blueprint(
  exampleInputs[0].target_shapes,
  exampleInputs[0].source_blueprints,
);
console.log(executionTime.stop());
console.log(optimal_blueprints); /* ->
{
  target_shapes_unique: [
    { id: 1, name: 'Triangle', count: 5 },
    { id: 2, name: 'Square', count: 2 }
  ],
  optimal_blueprints_unique: [
    { id: 3, name: 'Blueprint C', shapes: [Array], count: 2 },
    { id: 1, name: 'Blueprint A', shapes: [Array], count: 1 },
    { id: 2, name: 'Blueprint B', shapes: [Array], count: 2 }
  ],
  shape_remainders_map: [
    { id: 1, name: 'Triangle', count: 5, score: 0 },
    { id: 3, name: 'Circle', count: 5, score: 5 },
    { id: 2, name: 'Square', count: 2, score: 0 }
  ],
  target_shapes_total_count: 7,
  target_shapes_unique_count: 2,
  optimal_blueprints_total_count: 5,
  optimal_blueprints_unique_count: 3,
  remainder: 5,
  score: 0
}
 */
