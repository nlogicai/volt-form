import { assert, nonempty } from "superstruct";
import { rules } from "@/dictonaries/rules";

export function requiredValidator(value, type) {
  const nonemptyTypes = ["string", "array", "map"];
  if (nonemptyTypes.some((el) => el === type)) {
    assert(value, nonempty(rules[type]));
  } else assert(value, rules[type]);
}
