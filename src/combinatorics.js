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
  return set.length;
}
export function count_powerset_permutations(cardinality_set) {
  return 2 ** cardinality_set;
}
export function powerset(set, onPermutation) {
  const cardinality_set = count_cardinality(set);
  const cardinality_ps = count_powerset_permutations(cardinality_set);
  let permutation_index = 0;
  let permutation = [];

  while (permutation_index <= cardinality_ps) {
    for (let i = 0; i < cardinality_set; i++) {
      if (permutation_index & (2 ** i))
        permutation.push({
          set_index: i,
          set_value: set[i],
        });
    }
    onPermutation({
      permutation_index: permutation_index,
      permutation: [...permutation],
    });
    permutation = [];
    permutation_index++;
  }
}
