function factorial(number) {
  return number > 1 ? number * factorial(--number) : 1;
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

function permute(objects) {
  let result = [];
  const _permute = (arr, m = []) => {
    if (arr.length === 0) {
      result.push(m);
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);
        _permute(curr.slice(), m.concat(next));
      }
    }
  };
  _permute(objects);
  return result;
}
