import { tsc, squash_tsc, subtract_tsc } from "./tsc.js";
import {
  powerset,
  powerset_reverse,
  count_powerset_permutations,
  count_cardinality,
} from "./combinatorics.js";
import { debug } from "../../debug.js";

function find_optimal_blueprints(shapes, blueprints, options = {}) {
  const target_tsc = tsc(shapes);
  debug("target_tsc")(target_tsc);
  const target_shapes_count = squash_tsc(target_tsc);
  debug("target_shapes_count")(target_shapes_count);
  const [blueprints_tsc, blueprints_shapes_count] = match_target_shapes_count(
    target_shapes_count,
    blueprints,
  );
  // The sorting is really important. It guarantees that when the
  // first permutation that does not fulfill the target_shapes_count
  // is produced, no other permutation down the pipeline will get a
  // better score. As such the algorithm should cease its operations
  // and return the result
  sort_tsc_increasing_shapes_count(blueprints_tsc);
  debug("blueprints_tsc")(blueprints_tsc);
  debug("blueprints_shapes_count")(blueprints_shapes_count);
  debug("blueprints_cardinality")(count_cardinality(blueprints_tsc));
  debug("blueprints_permutations")(
    count_powerset_permutations(count_cardinality(blueprints_tsc)),
  );

  // optimal blueprints
  let optimal_blueprints_score = 0;
  let optimal_blueprints;

  powerset_reverse(blueprints_tsc, (permutation, _break) => {
    permutation.shapes_count = calc_permutation_shapes_count(permutation);

    // Score the permutation.
    // The lower the score the better.
    // This allows the algorithm to interpret 0 as the best possible score.
    // The default scoring function, considers the permutation with
    // the least amount of remainder shapes as optimal.
    permutation.score = get_scoring_fn(options.scoring_method)({
      permutation,
      shapes_count: permutation.shapes_count,
      target_tsc,
      target_shapes_count,
    });

    debug("permutation")(permutation);

    if (permutation.score < 0) return; // Ignore negative scores
    else if (
      optimal_blueprints_score === 0 ||
      permutation.score < optimal_blueprints_score
    ) {
      // first blueprint to pass the eligibility tests sets the bar
      // or a new best optimal blueprint was found
      optimal_blueprints_score = permutation.score;
      optimal_blueprints = permutation;
    }
    // if (permutation.score === optimal_blueprints_score)
    // Under the assumption that order is not important, 2
    // permutations with the same score are considered duplicate

    // if (permutation.score > optimal_blueprints_score)
    // is sub-optimal relative to the current best optimal blueprint

    if (
      permutation.shapes_count < target_shapes_count ||
      permutation.score === 0
    )
      _break();
  });

  return optimal_blueprints;
}

function calc_permutation_shapes_count(permutation) {
  let shapes_count = 0;
  for (let i = 0; i < permutation.set.length; i++) {
    shapes_count += squash_tsc(permutation.set[i].value);
  }
  return shapes_count;
}

function get_scoring_fn(scoring_method) {
  switch (scoring_method) {
    default:
      return ({ shapes_count, target_shapes_count }) =>
        shapes_count - target_shapes_count;
  }
}

function sort_tsc_increasing_shapes_count(blueprints_tsc) {
  return blueprints_tsc.sort((a, b) =>
    ((a, b) => (a === b ? 1 : a < b ? -1 : 1))(squash_tsc(a), squash_tsc(b)),
  );
}

function match_target_shapes_count(target_shapes_count, blueprints) {
  let blueprints_tsc = blueprints.map(tsc);
  let blueprints_shapes_count = squash_tsc(...blueprints_tsc);

  while (blueprints_shapes_count < target_shapes_count) {
    blueprints_tsc = blueprints_tsc.concat(blueprints.map(tsc));
    blueprints_shapes_count = squash_tsc(...blueprints_tsc);
  }
  return [blueprints_tsc, blueprints_shapes_count];
}

export { find_optimal_blueprints };
