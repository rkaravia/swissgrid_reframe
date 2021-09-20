import {
  transform,
  LV95,
  LV03,
  inside_counter_clockwise_triangle,
  sum,
  dot_product,
} from "../src/swissgrid_reframe";
import { csvParse } from "d3-dsv";
import { readFileSync } from "fs";
import { parse_point, parse_triangle } from "../util/parse_data";

function get_file_content(relative_path) {
  return readFileSync(new URL(relative_path, import.meta.url), {
    encoding: "utf8",
  });
}

const data = {
  points: csvParse(
    get_file_content("../data/chenyx06_points.csv"),
    parse_point
  ),
  triangles: csvParse(
    get_file_content("../data/chenyx06_triangles.csv"),
    parse_triangle
  ),
  index: JSON.parse(get_file_content("../data/chenyx06_index.json")),
};

test("transform LV03 => LV95", () => {
  const point = [700000, 100000];
  expect(transform(point, data, LV03, LV95)).toEqual([
    2700000.0397135145, 1099998.9548260847,
  ]);
});

test("transform LV03 => LV95 (boundary checks)", () => {
  const points = [
    [
      [459999, 41999],
      [2459999, 1041999],
    ],
    [
      [460000, 42000],
      [2460000, 1042000],
    ],
    [
      [460001, 42001],
      [2460000.999983717, 1042001.0000093962],
    ],
    [
      [867999, 321999],
      [2867999.000007186, 1321998.9999977315],
    ],
    [
      [868000, 322000],
      [2868000, 1322000],
    ],
    [
      [868001, 322001],
      [2868001, 1322001],
    ],
  ];
  points.forEach(([point_lv03, point_lv95]) => {
    expect(transform(point_lv03, data, LV03, LV95)).toEqual(point_lv95);
  });
});

test("transform LV95 => LV03", () => {
  const point = [2700000, 1100000];
  expect(transform(point, data, LV95, LV03)).toEqual([
    699999.9602804142, 100001.0451516218,
  ]);
});

test("transform LV95 => LV03 (boundary checks)", () => {
  const points = [
    [
      [2459999, 1041999],
      [459999, 41999],
    ],
    [
      [2460000, 1042000],
      [460000, 41999.99999999999],
    ],
    [
      [2460001, 1042001],
      [460001.00001628266, 42000.99999060369],
    ],
    [
      [2867999, 1321999],
      [867998.9999928138, 321999.0000022682],
    ],
    [
      [2868000, 1322000],
      [868000, 322000],
    ],
    [
      [2868001, 1322001],
      [868001, 322001],
    ],
  ];
  points.forEach(([point_lv95, point_lv03]) => {
    expect(transform(point_lv95, data, LV95, LV03)).toEqual(point_lv03);
  });
});

test(`transform 1000 sample points`, () => {
  const points = csvParse(get_file_content("test_data.csv"), parse_point);
  points.forEach(([point_lv95, point_lv03]) => {
    const transformed_point_lv95 = transform(point_lv03, data, LV03, LV95);
    expect(transformed_point_lv95[0]).toBeCloseTo(point_lv95[0], 8);
    expect(transformed_point_lv95[1]).toBeCloseTo(point_lv95[1], 8);

    const transformed_point_lv03 = transform(point_lv95, data, LV95, LV03);
    expect(transformed_point_lv03[0]).toBeCloseTo(point_lv03[0], 7);
    expect(transformed_point_lv03[1]).toBeCloseTo(point_lv03[1], 7);
  });
});

test("inside_counter_clockwise_triangle", () => {
  const triangle = [[[0, 0]], [[2, 0]], [[0, 2]]];
  const coordinates = [0.5, 0.5];
  expect(
    inside_counter_clockwise_triangle(triangle, coordinates, 0)
  ).toBeTruthy();
});

describe("sum", () => {
  test("empty", () => {
    expect(sum([])).toBe(0);
  });
  test("non-empty", () => {
    expect(sum([1, 2, 3])).toBe(6);
  });
});

test("dot_product", () => {
  expect(dot_product([1, 2, 3], [4, 5, 6])).toBe(32);
});
