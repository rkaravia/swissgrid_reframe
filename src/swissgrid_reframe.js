export const LV95 = 0;
export const LV03 = 1;

const DEFAULT_OFFSET = [
  [-2000000, -1000000],
  [2000000, 1000000],
];

export function transform(point, data, crs_from, crs_to) {
  const indices = index_lookup(data.index, point, crs_from);
  const triangles = indices.map((i) =>
    data.triangles[i].map((j) => data.points[j])
  );
  const triangle = find_triangle(triangles, point, crs_from);
  if (triangle) {
    return transform_point(triangle, point, crs_from, crs_to);
  } else {
    return default_transform(point, crs_from);
  }
}

function default_transform(point, crs_from) {
  const offset = DEFAULT_OFFSET[crs_from];
  return point.map((coordinate, i) => coordinate + offset[i]);
}

function index_lookup(index, point, crs) {
  const [i, j] = point.map((coordinate, i) => {
    return Math.floor((coordinate - index.origin[crs][i]) / index.cell_size);
  });
  if (i >= 0 && i < index.width && j >= 0 && j < index.height) {
    return index.data[j][i];
  } else {
    return [];
  }
}

function find_triangle(triangles, point, crs) {
  return triangles.find((triangle) => {
    return inside_counter_clockwise_triangle(triangle, point, crs);
  });
}

function transform_point(triangle, point, crs_from, crs_to) {
  const weights = get_weights(triangle, point, crs_from);
  return apply_weights(triangle, weights, crs_to);
}

function apply_weights(triangle, weights, crs) {
  const total_weight = sum(weights);
  const transformed = [];
  for (let i = 0; i < 2; i += 1) {
    const weighted_values = weights.map(
      (area, j) => area * triangle[j][crs][i]
    );
    transformed.push(sum(weighted_values) / total_weight);
  }
  return transformed;
}

function get_weights(triangle, point, crs) {
  const weights = [];
  for (let i = 0; i < 3; i += 1) {
    const weight_vertices = triangle.map((point) => point[crs]);
    weight_vertices[i] = point;
    const weight = sum(
      weight_vertices.map((current, j) => {
        const next = weight_vertices[(j + 1) % 3];
        const prev = weight_vertices[(j + 2) % 3];
        return current[0] * (next[1] - prev[1]);
      })
    );
    weights.push(weight);
  }
  return weights;
}

export function inside_counter_clockwise_triangle(triangle, coordinates, crs) {
  const orthogonals = triangle.map((point, i) => {
    const [x, y] = point[crs];
    const [xʹ, yʹ] = triangle[(i + 2) % 3][crs];
    return [yʹ - y, x - xʹ];
  });
  const relatives = triangle.map((point) => {
    return coordinates.map((coordinate, i) => coordinate - point[crs][i]);
  });
  return orthogonals.every((orthogonal, i) => {
    return dot_product(orthogonal, relatives[i]) >= 0;
  });
}

export function dot_product(v0, v1) {
  return sum(
    v0.map((coordinate, i) => {
      return coordinate * v1[i];
    })
  );
}

export function sum(array) {
  if (array.length) {
    return array.reduce((a, b) => a + b);
  }
  return 0;
}
