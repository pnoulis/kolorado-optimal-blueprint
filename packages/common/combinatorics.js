const MAX_VALUE = Number.MAX_VALUE;
const U64_CEIL = 2n ** 64n;
const U64_CEIL_SIGN = U64_CEIL - 1n; // taking into consideration the sign bit
const MAX_INTEGER = Number.MAX_SAFE_INTEGER;

function factorial(number) {
  const biggie = BigInt(number);
  return _factorial(biggie);
  function _factorial(n) {
    return n > 1n ? n * _factorial(--n) : 1n;
  }
}
function count_combinations(objects, arrangement) {
  // C(n,r) -> n! / n! * (n-r)!
  return (
    factorial(objects) /
    (factorial(arrangement) * factorial(objects - arrangement))
  );
}
function count_permutations(objects, arrangement) {
  // P(n,r) -> n! / (n-r)!
  return factorial(objects) / factorial(objects - arrangement);
}
function count_cardinality(set) {
  return BigInt(set.length);
}
function count_powerset_permutations(cardinality_set) {
  return BigInt(2) ** cardinality_set;
}
function powerset(set, onPermutation) {
  const cardinality_set = count_cardinality(set);
  const cardinality_ps = count_powerset_permutations(cardinality_set);
  let permutation_index = 0n;
  let permutation = [];
  let _continue = true;
  function _break() {
    _continue = false;
  }

  while (permutation_index < cardinality_ps && _continue) {
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
}

function powerset_reverse(set, onPermutation) {
  const cardinality_set = count_cardinality(set);
  const cardinality_ps = count_powerset_permutations(cardinality_set);
  let permutation_index = cardinality_ps - 1n;
  let permutation = [];
  let _continue = true;
  function _break() {
    _continue = false;
  }

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
}

export {
  factorial,
  count_cardinality,
  count_combinations,
  count_permutations,
  count_powerset_permutations,
  powerset,
  powerset_reverse,
};
