import { powerSet, combinations } from "combinatorial-generators";
import { designs } from "./designs.js";

let index_step = designs.length;
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

  permutations = [...powerSet(indexDesigns(designs))]
    .map((permutation) => calc_tsc(designs, permutation))
    .filter((tsc) => compare_tsc(tsc, target_tsc))
    .map((tsc) => calc_remainders(tsc, target_tsc));

  // find the permutation with the least amount of remainder patterns;
  const least_remainder = calc_least_remainder(permutations);
  permutations = permutations.filter(
    (perm) => perm.remainder === least_remainder,
  );
  return permutations;
}

function calc_tsc(designs, permutation) {
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

function compare_tsc(a, b) {
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
  tsc_a.remainder = tsc_a.t + tsc_a.s + tsc_a.c - (tsc_b.t + tsc_b.s + tsc_b.c);
  return tsc_a;
}

function calc_least_remainder(tscs) {
  let least_remainder = tscs.at(0).remainder;

  for (let i = 0; i < tscs.length; i++) {
    if (tscs[i].remainder < least_remainder)
      least_remainder = tscs[i].remainder;
  }
  return least_remainder;
}
function sort_remainders(a, b) {
  return a.remainder === b.remainder ? 1 : a.remainder < b.remainder ? -1 : 1;
}

function indexDesigns(designs) {
  return designs.map((_, i) => i % index_step);
}

export { findOptimalDesign };
