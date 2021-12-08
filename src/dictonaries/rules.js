import { max, min, number, object, size, string } from "superstruct";

export const rules = {
  string: string(),
  number: number(),
  object: object(),
  min: (val = 0) => min(number(), val),
  max: (val = 10) => max(number(), val),
  size: (val = [0, 100]) => size(string(), val[0], val[1]),
};
