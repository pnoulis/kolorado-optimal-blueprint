import { powerset_reverse } from "/lib/permute/dist/permute.mjs";
import { get_t_locale_iso8601 } from "/src/common/locale.js";
import { join } from "node:path";
import { readdirSync } from "node:fs";
const OPTIMAL_BLUEPRINT_ROOTDIR = join(
  process.env.PUBLICDIR,
  "optimal-blueprints",
);
const OPTIMAL_BLUEPRINT_FILENAME_PREFIX = "optimal-blueprint";

function get_optimal_blueprint(optimal_blueprint_id) {
  const files = readdirSync(OPTIMAL_BLUEPRINT_ROOTDIR, { encoding: "utf8" });
  const optimal_blueprints = [];
  const re_optimal_blueprint = new RegExp(
    optimal_blueprint_id || OPTIMAL_BLUEPRINT_FILENAME_PREFIX,
  );
  for (let i = 0; i < files.length; i++) {
    if (re_optimal_blueprint.test(files[i])) optimal_blueprints.push(files[i]);
  }
  return optimal_blueprints;
}

function make_optimal_blueprint_fileparts(optimal_blueprint_id) {
  const parts = {
    id: optimal_blueprint_id || get_t_locale_iso8601({ utc: true }).toString(),
    dirname: process.env.PUBLICDIR,
  };
  parts.basename = OPTIMAL_BLUEPRINT_FILENAME_PREFIX + "-" + parts.id;
  parts.path = join(parts.dirname, parts.basename);
  parts.report = parts.path + ".txt";
  parts.page = parts.path + ".html";
  return parts;
}

function generate_optimal_blueprint(target_shapes, source_blueprints, options) {
  const [target_shapes_unique, target_shapes_total_count] =
    unique_shapes(target_shapes);

  const unique_capable_blueprints = filter_blueprints_with_shapes(
    target_shapes_unique,
    source_blueprints,
  );
  const capable_blueprints = match_target_shapes_count(
    target_shapes_unique,
    unique_capable_blueprints,
  );


  // The sorting is really important. It guarantees that when the
  // first permutation that does not fulfill the target_shapes_count
  // is produced, no other permutation down the pipeline will get a
  // better score. As such the algorithm should cease its operations
  // and return the result
  sort_blueprints_shapes_count_increasing(capable_blueprints);

  console.log(capable_blueprints);
  console.log('sorted');


  let optimal_permutation_score = 1000000;
  let optimal_permutation;

  powerset_reverse(capable_blueprints, (permutation, _break) => {
    // Score the permutation.
    // The lower the score the better.
    // This allows the algorithm to interpret 0 as the best possible score.
    // The default scoring function, considers the permutation with
    // the least amount of remainder shapes as optimal.
    score_by_least_shape_remainder(
      target_shapes_unique,
      target_shapes_total_count,
      permutation,
      _break,
    );

    console.log(permutation.score);
    if (permutation.score < 0) return;
    else if (permutation.score === 0) {
      optimal_permutation_score = 0;
      optimal_permutation = permutation;
      _break();
    } else if (permutation.score < optimal_permutation_score) {
      optimal_permutation_score = permutation.score;
      optimal_permutation = permutation;
    }
  });

  const optimal_blueprints_unique = unique_blueprints(
    optimal_permutation.set.map((permutation) => permutation.value),
  );
  return {
    target_shapes_unique,
    optimal_blueprints_unique,
    optimal_shapes_remainder: optimal_permutation.shapes_unique,
    target_shapes_total_count,
    target_shapes_unique_count: target_shapes_unique.length,
    optimal_shapes_total_count: optimal_permutation.shapes_total_count,
    optimal_shapes_unique_count: optimal_permutation.shapes_unique.length,
    optimal_blueprints_total_count: optimal_permutation.set.length,
    optimal_blueprints_unique_count: optimal_blueprints_unique.length,
    remainder: optimal_permutation.remainder_total,
    score: optimal_permutation.score,
  };
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
function unique_shapes(shapes) {
  const unique = new Map();
  let total_count = 0;
  for (let i = 0; i < shapes.length; i++) {
    if (unique.has(shapes[i].id)) {
      unique.get(shapes[i].id).count += shapes[i].count;
      total_count += shapes[i].count;
    } else {
      unique.set(shapes[i].id, { ...shapes[i] });
      total_count += shapes[i].count;
    }
  }

  return [Array.from(unique.values()), total_count];
}
function unique_blueprints(blueprints) {
  const unique = new Map();
  for (let i = 0; i < blueprints.length; i++) {
    if (unique.has(blueprints[i].id)) {
      unique.get(blueprints[i].id).count++;
    } else {
      unique.set(blueprints[i].id, { ...blueprints[i], count: 1 });
    }
  }
  return Array.from(unique.values());
}
function sort_blueprints_shapes_count_increasing(blueprints) {
  return blueprints.sort((a, b) => {
    const a_count = count_shapes(...a.shapes);
    const b_count = count_shapes(...b.shapes);
    return a_count === b_count ? 1 : a_count < b_count ? -1 : 1;
  });
}
function filter_blueprints_with_shapes(
  target_shapes_unique,
  source_blueprints,
) {
  const capable = [];
  for (let i = 0; i < target_shapes_unique.length; i++) {
    for (let y = 0; y < source_blueprints.length; y++) {
      for (let z = 0; z < source_blueprints[y].shapes.length; z++) {
        if (source_blueprints[y].shapes[z].id !== target_shapes_unique[i].id)
          continue;
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
function match_target_shapes_count(
  target_shapes_unique,
  unique_capable_blueprints,
) {
  let capable_blueprints = [...unique_capable_blueprints];
  let shapes_increment = 0;
  let shapes_count = 0;
  for (let i = 0; i < target_shapes_unique.length; i++) {
    const blueprints_with_shapes = filter_blueprints_with_shapes(
      [target_shapes_unique[i]],
      unique_capable_blueprints,
    );
    shapes_increment = count_shapes(
      ...filter_shape(target_shapes_unique[i], ...capable_blueprints),
    );
    shapes_count = shapes_increment;
    while (shapes_count < target_shapes_unique[i].count) {
      shapes_count += shapes_increment;
      capable_blueprints.push(...blueprints_with_shapes);
    }
  }
  return capable_blueprints;
}
function score_by_least_shape_remainder(
  target_shapes_unique,
  target_shapes_total_count,
  permutation,
  _break,
) {
  permutation.shapes_unique = [];
  permutation.shapes_total_count = 0;
  for (let i = 0; i < permutation.set.length; i++) {
    const [unique, total_count] = unique_shapes(
      permutation.shapes_unique.concat(
        unique_shapes(permutation.set[i].value.shapes)[0],
      ),
    );
    permutation.shapes_unique = unique;
    permutation.shapes_total_count = total_count;
  }
  // no reason to go forth, since the first permutation that does not
  // fullfill the target_shapes_total_count signals the end of all
  // such possible permutations.
  if (permutation.shapes_total_count < target_shapes_total_count)
    return _break();

  /* The blueprints capable of matching target_shapes_unique most
   certainly will include shapes not included in the
   target_shapes_unique. If these remainder blueprints were to be used
   in the score, it is guaranteed that the score would never have a
   chance of reaching 0. Since a score of 0 is used to put a stop to
   the algorithm, it would mean that the algorithm would have to
   exhaust all permutations until the first permutation that did not
   satisfy the target_shapes_total_count. As such, shapes not included
   in the target set are not included in the calculation of the score,
   however they are tracked because the user most certainly would need
   such information.
   */
  let remainder_target_total = 0; /* score, without shapes not included in the target set */
  let remainder_total = 0; /* remainder, with shapes not included in the target set */

  for (let i = 0; i < permutation.shapes_unique.length; i++) {
    permutation.shapes_unique[i].score = permutation.shapes_unique[i].count;
    for (let y = 0; y < target_shapes_unique.length; y++) {
      if (target_shapes_unique[y].id !== permutation.shapes_unique[i].id)
        continue;
      permutation.shapes_unique[i].score =
        permutation.shapes_unique[i].count > target_shapes_unique[y].count
          ? permutation.shapes_unique[i].count - target_shapes_unique[y].count
          : target_shapes_unique[y].count - permutation.shapes_unique[i].count;
      remainder_target_total += permutation.shapes_unique[i].score;
    }
    remainder_total += permutation.shapes_unique[i].score;
  }
  permutation.remainder_total = remainder_total;
  // permutation.score = remainder_target_total;
  permutation.score = remainder_total;
}

export {
  generate_optimal_blueprint,
  get_optimal_blueprint,
  make_optimal_blueprint_fileparts,
};
