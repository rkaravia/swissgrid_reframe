export function parse_point(row) {
  const { E, N, y, x } = row;
  return [
    [+E, +N],
    [+y, +x],
  ];
}

export function parse_triangle(row) {
  const { point_0, point_1, point_2 } = row;
  return [point_0, point_1, point_2].map((value) => +value);
}
