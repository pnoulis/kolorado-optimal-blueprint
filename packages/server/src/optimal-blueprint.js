import {
  powerset_reverse,
  count_powerset_permutations,
  count_cardinality,
} from "permute";
import { debug } from "common";

function find_optimal_blueprints(target_shapes, source_blueprints, options) {
  let target_shapes_unique = new Map();
  let target_shapes_total_count = 0;
  for (let i = 0; i < target_shapes.length; i++) {
    target_shapes_unique.set(target_shapes[i].id, {
      id: target_shapes[i].id,
      name: target_shapes[i].name,
      count:
        target_shapes[i].count +
        (target_shapes_unique.get(target_shapes[i].id)?.count || 0),
    });
    target_shapes_total_count += target_shapes[i].count;
  }
  target_shapes_unique = Array.from(target_shapes_unique.values());
  //debug("target_shapes_unique")(target_shapes_unique);
  //debug("target_shapes_total_count")(target_shapes_total_count);

  const unique_capable_blueprints = filter_blueprints_with_shapes(
    target_shapes_unique,
    source_blueprints,
  );
  //debug("unique_capable_blueprints")(unique_capable_blueprints);
  const capable_blueprints = match_target_shapes_count(
    target_shapes_unique,
    unique_capable_blueprints,
  );
  //debug("capable_blueprints")(capable_blueprints);

  // The sorting is really important. It guarantees that when the
  // first permutation that does not fulfill the target_shapes_count
  // is produced, no other permutation down the pipeline will get a
  // better score. As such the algorithm should cease its operations
  // and return the result
  sort_blueprints_shapes_count_increasing(capable_blueprints);
  //debug("sorted blueprints")(capable_blueprints);

  //const cardinality = count_cardinality(capable_blueprints);
  //const permutations = count_powerset_permutations(cardinality);
  //debug("cardinality")(cardinality);
  //debug("permutations")(permutations);

  let optimal_permutation_score = 1000000;
  let optimal_permutation;

  powerset_reverse(capable_blueprints, (permutation, _break) => {
    permutation.shapes_total_count = count_shapes(
      ...permutation.set.map((blueprint) => blueprint.value.shapes).flat(),
    );

    if (permutation.shapes_total_count < target_shapes_total_count)
      return _break();

    // Score the permutation.
    // The lower the score the better.
    // This allows the algorithm to interpret 0 as the best possible score.
    // The default scoring function, considers the permutation with
    // the least amount of remainder shapes as optimal.
    permutation.score = scoreByLeastShapeRemainder(
      target_shapes_unique,
      permutation,
    );
    //debug()(`permutation.score:${permutation.score}`);

    if (permutation.score < 0) return;

    if (permutation.score === 0) {
      optimal_permutation_score = 0;
      optimal_permutation = permutation;
      _break();
    } else if (permutation.score < optimal_permutation_score) {
      optimal_permutation_score = permutation.score;
      optimal_permutation = permutation;
    }
  });
  debug("optimal_permutation")(optimal_permutation);

  let optimal_blueprints = new Map();
  let blueprints_total_count = 0;
  for (let i = 0; i < optimal_permutation.set.length; i++) {
    ++blueprints_total_count;
    optimal_blueprints.set(optimal_permutation.set[i].value.id, {
      ...optimal_permutation.set[i].value,
      count:
        1 +
        (optimal_blueprints.get(optimal_permutation.set[i].value.id)?.count ||
          0),
    });
  }
  optimal_blueprints = {
    target_shapes_total_count,
    target_shapes_unique_count: target_shapes_unique.length,
    blueprints_total_count,
    blueprints_unique_count: unique_capable_blueprints.length,
    shape_remainders_total: optimal_permutation.score,
    shape_remainders_map: optimal_permutation.shapeRemainder,
    target_shapes: target_shapes_unique,
    source_blueprints,
    optimal_blueprints: Array.from(optimal_blueprints.values()),
  };

  //debug("optimal_blueprints")(optimal_blueprints);
  return optimal_blueprints;
}

function count_shapes(...shapes) {
  let shapes_count = 0;
  for (let i = 0; i < shapes.length; i++) {
    shapes_count += shapes[i].count;
  }
  return shapes_count;
}

function filter_shape(shape, ...blueprints) {
  const shapes = [];
  for (let i = 0; i < blueprints.length; i++)
    for (let y = 0; y < blueprints[i].shapes.length; y++)
      if (shape.id === blueprints[i].shapes[y].id)
        shapes.push(blueprints[i].shapes[y]);
  return shapes;
}

function sort_blueprints_shapes_count_increasing(blueprints) {
  return blueprints.sort((a, b) => {
    const a_count = count_shapes(...a.shapes);
    const b_count = count_shapes(...b.shapes);
    return a_count === b_count ? 1 : a_count < b_count ? -1 : 1;
  });
}

function filter_blueprints_with_shapes(target_shapes, source_blueprints) {
  const capable = [];
  for (let i = 0; i < target_shapes.length; i++) {
    for (let y = 0; y < source_blueprints.length; y++) {
      for (let z = 0; z < source_blueprints[y].shapes.length; z++) {
        if (source_blueprints[y].shapes[z].id !== target_shapes[i].id) continue;
        let unique = true;
        for (let x = 0; x < capable.length; x++) {
          if (capable[x].id !== source_blueprints[y].id) continue;
          unique = false;
          break;
        }
        if (unique) capable.push(source_blueprints[y]);
        break;
      }
    }
  }
  return capable;
}

function match_target_shapes_count(target_shapes, unique_capable_blueprints) {
  let capable_blueprints = [...unique_capable_blueprints];
  let shapes_increment = 0;
  let shapes_count = 0;
  for (let i = 0; i < target_shapes.length; i++) {
    shapes_increment = count_shapes(
      ...filter_shape(target_shapes[i], ...capable_blueprints),
    );
    shapes_count = shapes_increment;
    while (shapes_count < target_shapes[i].count) {
      shapes_count += shapes_increment;
      capable_blueprints = capable_blueprints.concat(capable_blueprints);
    }
  }
  return capable_blueprints;
}

function scoreByLeastShapeRemainder(target_shapes, permutation) {
  let shapeRemainder = [];
  let remainder = 0;
  let difference = 0;
  for (let i = 0; i < target_shapes.length; i++) {
    difference =
      count_shapes(
        ...filter_shape(
          target_shapes[i],
          ...permutation.set.map((element) => element.value),
        ),
      ) - target_shapes[i].count;
    if (difference < 0) return -1;
    shapeRemainder.push({ ...target_shapes[i], remainder: difference });
    remainder += difference;
  }
  permutation.shapeRemainder = shapeRemainder;
  return remainder;
}
