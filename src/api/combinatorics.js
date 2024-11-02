const MAX_VALUE = Number.MAX_VALUE;
const U64_CEIL = 2n ** 64n;
const U64_CEIL_SIGN = U64_CEIL - 1n; // taking into consideration the sign bit
const MAX_INTEGER = Number.MAX_SAFE_INTEGER;

function factorial(number) {
  return number > 1 ? number * factorial(--number) : 1;
}
export function count_combinations(objects, arrangement) {
  // C(n,r) -> n! / n! * (n-r)!
  return (
    factorial(objects) /
    (factorial(arrangement) * factorial(objects - arrangement))
  );
}
export function count_permutations(objects, arrangement) {
  // P(n,r) -> n! / (n-r)!
  return factorial(objects) / factorial(objects - arrangement);
}
export function count_cardinality(set) {
  return BigInt(set.length);
}
export function count_powerset_permutations(cardinality_set) {
  return BigInt(2) ** cardinality_set;
}
export function powerset(set, onPermutation) {
  const cardinality_set = count_cardinality(set);
  const cardinality_ps = count_powerset_permutations(cardinality_set);
  let permutation_index = 0n;
  let permutation = [];
  let _continue = true;

  while (permutation_index < cardinality_ps) {
    for (let i = 0n; i < cardinality_set; i++) {
      if (permutation_index & (2n ** i))
        permutation.push({
          index: i,
          value: set[i],
        });
    }
    onPermutation(
      {
        index: permutation_index,
        set: [...permutation],
      },
      _break,
    );
    permutation = [];
    permutation_index++;
  }

  function _break() {
    _continue = false;
  }
}

export function powerset_reverse(set, onPermutation) {
  const cardinality_set = count_cardinality(set);
  const cardinality_ps = count_powerset_permutations(cardinality_set);
  let permutation_index = cardinality_ps - 1n;
  let permutation = [];
  let _continue = true;

  while (permutation_index >= 0 && _continue) {
    for (let i = 0n; i < cardinality_set; i++) {
      if (permutation_index & (2n ** i))
        permutation.push({
          index: i,
          value: set[i],
        });
    }
    onPermutation(
      {
        index: permutation_index,
        set: [...permutation],
      },
      _break,
    );
    permutation = [];
    permutation_index--;
  }

  function _break() {
    _continue = false;
  }
}
