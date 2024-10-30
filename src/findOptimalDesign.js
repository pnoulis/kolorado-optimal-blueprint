import { powerSet, combinations } from "combinatorial-generators";
import { designs } from "./designs.js";

const MAX_COMBINATORIAL_SPACE = 16;
let UNIQUE_BLUEPRINTS = 0;

const enum_shape = {
  triangle: "t",
  square: "s",
  circle: "c",
};

export function find_optimal_blueprint_set(blueprints, tsc) {
  UNIQUE_BLUEPRINTS = blueprints.length;
  const target_tsc = tsc;
  const target_tsc_gs = get_greatest_shape(target_tsc);
  const designs_tsc = calc_tsc(designs);
  const designs_tsc_gs = get_greatest_shape(designs_tsc);
  const blueprint_space = create_blueprint_space(designs, target_tsc);
  const combinatorial_spaces = create_combinatorial_spaces(blueprint_space);
  const combinatorial_spaces_map = new Map();
  const dynamic_target_tsc = { ...target_tsc };
  for (let i = 0; i < combinatorial_spaces.length; i++) {
    const combinatorial_space = combinatorial_spaces[i];
    const space_tsc = calc_tsc(combinatorial_space);
    const space_target_tsc = {};

    for (const [shape, count] of Object.entries(dynamic_target_tsc)) {
      if (count >= space_tsc[shape]) space_target_tsc[shape] = space_tsc[shape];
      else space_target_tsc[shape] = count > 0 ? count : 0;
      dynamic_target_tsc[shape] = count - space_tsc[shape];
    }
    const powerset = [...powerSet(index_blueprints(combinatorial_space))]
      .map((combination) => calc_tsc(blueprints, combination))
      .filter((tsc) => compare_tsc(tsc, space_target_tsc));

    combinatorial_spaces_map.set(i, {
      space: combinatorial_space,
      tsc: space_tsc,
      target_tsc: space_target_tsc,
      powerset,
    });
  }
  debug("designs")(designs);
  debug("target_tsc")(target_tsc);
  debug("target_tsc_gs")(target_tsc_gs);
  debug("designs_tsc")(designs_tsc);
  debug("designs_tsc_gs")(designs_tsc_gs);
  debug("can the designs fullfill the target?")(
    compare_tsc(designs_tsc, target_tsc),
  );
  debug("blueprint space")(blueprint_space);
  debug("how many sets of repeated blueprints?")(
    blueprint_space.length / UNIQUE_BLUEPRINTS,
  );
  // debug("combinatorial spaces")(combinatorial_spaces);
  debug("combinatorial spaces map")(combinatorial_spaces_map);
  // debug("powerset")(combinatorial_spaces_map.get(1).powerset);

  // combine powersets
  const powersets = [];
  for (const combinatorial_space of combinatorial_spaces_map.values()) {
    debug("space")(combinatorial_space);
    powersets.push(combinatorial_space.powerset);
  }
  const combine_powersets = [
    ...combinations(powersets.flat(), powersets.length),
  ];

  debug("powersets")(powersets);
  debug("combine_powersets")(combine_powersets);
  const squashed = combine_powersets
    .map(squash_powersets)
    .filter((ps) => compare_tsc(ps, target_tsc));
  debug("squashed")(squashed);

  const remainders = squashed.map((squashed) =>
    calc_remainders(squashed, target_tsc),
  );
  debug("remainders")(remainders);
  // find the permutation with the least amount of remainder patterns;
  const least_remainder = calc_least_remainder(remainders);
  debug("least remainder")(least_remainder);
  const optimal_blueprints = remainders.filter(
    (blueprint) => blueprint.remainder.total === least_remainder,
  );
  debug("optimal blueprints")(optimal_blueprints);
  // debug("optimal blueprints arrays")(
  //   optimal_blueprints.map((o) => o.blueprints),
  // );
  // remove duplicates
  const unique = [];
  for (let i = 0; i < optimal_blueprints.length; i++) {
    const blueprint_id = optimal_blueprints[i].blueprints.reduce(
      (car, cdr) => (car += cdr),
      0,
    );
    if (unique.find((bl) => bl.blueprint_id === blueprint_id)) continue;
    unique.push({ blueprint_id, blueprint: optimal_blueprints[i] });
  }
  debug("unique")(unique);
  const human = humanReadable(
    unique.map((uniq) => uniq.blueprint),
    blueprints,
  );
  human.target = target_tsc;
  debug("human readable")(human);

  return human;
}

function unique(array, compareFn) {
  const uniq = [];
  let i = 0;
  let y = 0;
  for (; i < array.length; i++) {
    while (y < i) {
      if (
        typeof compareFn === "function"
          ? compareFn(uniq[y], array[i])
          : uniq[y] === array[i]
      ) {
        break;
      }
      y++;
    }
    if (y === i) uniq.push(array[i]);
    y = 0;
  }
  return uniq;
}

function humanReadable(blueprints, actual_blueprints) {
  const humanReadable = [];
  for (const blueprint of blueprints) {
    humanReadable.push({
      blueprints: blueprint.blueprints.reduce((car, cdr, i) => {
        const found = car.find((blueprint) => blueprint.id === cdr);
        if (found) {
          found.count++;
          return car;
        }
        car.push({
          id: cdr,
          blueprint: actual_blueprints[cdr],
          count: 1,
        });
        return car;
      }, []),
      remainder: blueprint.remainder,
    });
  }
  return humanReadable;
}
function squash_powersets(ps) {
  const tsc = { t: 0, s: 0, c: 0, blueprints: [] };
  for (let i = 0; i < ps.length; i++) {
    tsc.t += ps[i].t;
    tsc.s += ps[i].s;
    tsc.c += ps[i].c;
    tsc.blueprints.push(...ps[i].permutation);
  }
  return tsc;
}
function findOptimalDesign(triangle, square, circle) {
  // find the optimal set of designs that would satisfy the pattern.
  // The optimal set of designs is the one that produces the least amount of
  // leftover patterns.

  // add designs until pattern is exhausted
  // then it is a matter of best arrangment
  let permutations = [];

  // find number of designs needed to fullfill (target_tsc)
  const target_tsc = { t: triangle, s: square, c: circle };
  while (!compare_tsc(calc_tsc(designs), target_tsc)) designs.push(...designs);
  return designs.length;

  permutations = [...powerSet(indexDesigns(designs))].map((permutation) =>
    calc_tsc(designs, permutation),
  );
  // .filter((tsc) => compare_tsc(tsc, target_tsc))
  // .map((tsc) => calc_remainders(tsc, target_tsc));

  // find the permutation with the least amount of remainder patterns;
  const least_remainder = calc_least_remainder(permutations);
  permutations = permutations.filter(
    (perm) => perm.remainder === least_remainder,
  );
  return permutations;
}

export function calc_tsc(designs, permutation) {
  let tsc = { t: 0, s: 0, c: 0 };

  if (permutation) {
    for (const design of permutation) {
      tsc.t += designs[design].t;
      tsc.s += designs[design].s;
      tsc.c += designs[design].c;
    }
    tsc.permutation = permutation;
    return tsc;
  }

  for (let i = 0; i < designs.length; i++) {
    tsc.t += designs[i].t;
    tsc.s += designs[i].s;
    tsc.c += designs[i].c;
  }
  return tsc;
}

export function compare_tsc(a, b) {
  return a.t >= b.t && a.s >= b.s && a.c >= b.c;
}

function findCapablePermutations(designs, triangle, square, circle) {
  let permutations = [];
  // task 1: Find all permutations whose (t,s,c) can contain pattern
  for (let i = 0; i < designs.length; i++) {
    permutations.push(combinations(indexDesigns(designs), i));
  }

  permutations = permutations
    .flat()
    .map(tsc)
    .filter((tsc) => filterTSC(tsc, triangle, square, circle));

  return permutations.length === 0
    ? findCapablePermutations(designs.concat(designs), triangle, square, circle)
    : permutations;
}

function tsc(permutation) {
  let t = 0;
  let s = 0;
  let c = 0;
  for (const design of permutation) {
    t += designs[design].t;
    s += designs[design].s;
    c += designs[design].c;
  }
  return { permutation, t, s, c };
}

function filterTSC(tsc, triangle, square, circle) {
  return tsc.t >= triangle && tsc.s >= square && tsc.c >= circle;
}

function calc_remainders(tsc_a, tsc_b) {
  tsc_a.remainder = {
    t: tsc_a.t - tsc_b.t,
    s: tsc_a.s - tsc_b.s,
    c: tsc_a.c - tsc_b.c,
    total: tsc_a.t + tsc_a.s + tsc_a.c - (tsc_b.t + tsc_b.s + tsc_b.c),
  };
  return tsc_a;
}

function calc_least_remainder(tscs) {
  let least_remainder = tscs.at(0).remainder.total;

  for (let i = 0; i < tscs.length; i++) {
    if (tscs[i].remainder.total < least_remainder)
      least_remainder = tscs[i].remainder.total;
  }
  return least_remainder;
}
function sort_remainders(a, b) {
  return a.remainder === b.remainder ? 1 : a.remainder < b.remainder ? -1 : 1;
}

function index_blueprints(blueprints) {
  return blueprints.map((_, i) => i % UNIQUE_BLUEPRINTS);
}

export function get_greatest_shape(tsc) {
  let greatest = enum_shape.triangle;
  for (const shape of Object.keys(tsc))
    if (tsc[shape] > tsc[greatest]) greatest = shape;
  return { shape: greatest, count: tsc[greatest] };
}

export function create_combinatorial_spaces(designs) {
  const combinatorial_spaces = [];
  let i = 0;
  while (i < designs.length) {
    combinatorial_spaces.push(designs.slice(i, i + MAX_COMBINATORIAL_SPACE));
    i += MAX_COMBINATORIAL_SPACE;
  }
  return combinatorial_spaces;
}

/**
 * Constructs the set of all blueprints that is capable of fulfilling the amount
 * and type of shapes requested.
 * @returns {array} blueprint_space
 */
export function create_blueprint_space(blueprints, target_tsc) {
  const blueprint_space = [...blueprints];
  while (!compare_tsc(calc_tsc(blueprint_space), target_tsc))
    blueprint_space.push(
      ...blueprints,
    ); /* add another handfull of blueprints */
  return blueprint_space;
}

function debug(title) {
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
  console.log(title);
  return (msg) => {
    console.dir(msg, { depth: null });
    console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
  };
}

export { findOptimalDesign };
