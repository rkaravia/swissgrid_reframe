import pkg from "./package.json";

import dsv from "@rollup/plugin-dsv";
import json from "@rollup/plugin-json";
import buble from "@rollup/plugin-buble";
import { terser } from "rollup-plugin-terser";

import { parse_point, parse_triangle } from "./util/parse_data";

const banner = `/*!
* swissgrid_reframe v${pkg.version}
* Transform between the Swiss projected coordinate systems (LV03 and LV95).
* github.com/rkaravia/swissgrid_reframe
* Code: © Roman Karavia | MIT License
* Data: Derived from the REFRAME library © Swisstopo:
* > The REFRAME library may be distributed to third parties and integrated into commercial products,
* > but it must be delivered to the customer free of charge.
*/
`;

export default {
  input: "src/index.js",
  output: [
    {
      file: pkg.main,
      format: "es",
      banner,
      sourcemap: true,
    },
  ],
  plugins: [
    json(),
    dsv({
      processRow: (row, id) => {
        if (id.endsWith("chenyx06_points.csv")) {
          return parse_point(row);
        } else if (id.endsWith("chenyx06_triangles.csv")) {
          return parse_triangle(row);
        }
      },
    }),
    buble(),
    terser(),
  ],
};
