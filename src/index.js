import { transform, LV95, LV03 } from "./swissgrid_reframe";
import * as data from "./data";

export function lv03_to_lv95(point) {
  return transform(point, data, LV03, LV95);
}

export function lv95_to_lv03(point) {
  return transform(point, data, LV95, LV03);
}
