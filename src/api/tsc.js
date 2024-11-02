function tsc(blueprint) {
  return {
    t: blueprint.triangles || blueprint.triangle || blueprint.t,
    s: blueprint.squares || blueprint.square || blueprint.s,
    c: blueprint.circles || blueprint.circle || blueprint.c,
  };
}

function squash_tsc(...tsc) {
  let shapes_count = 0;
  for (let i = 0; i < tsc.length; i++) {
    shapes_count += tsc[i].t + tsc[i].s + tsc[i].c;
  }
  return shapes_count;
}

function subtract_tsc(a, b) {
  return tsc({
    t: a.t > b.t ? a.t - b.t : b.t - a.t,
    s: a.s > b.s ? a.s - b.s : b.s - a.s,
    c: a.c > b.c ? a.c - b.c : b.c - a.c,
  });
}

export { tsc, squash_tsc, subtract_tsc };
