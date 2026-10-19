// Per-language dictionary registry.
import * as en from "./en.js";
import * as es from "./es.js";
import * as pt from "./pt.js";
import * as fr from "./fr.js";
import * as ar from "./ar.js";
import * as bn from "./bn.js";
import * as hi from "./hi.js";
import * as ro from "./ro.js";
import * as uz from "./uz.js";

export const LANGS = ["en","es","pt","fr","ar","bn","hi","ro","uz"];
const REGISTRY = { en, es, pt, fr, ar, bn, hi, ro, uz };

export function getDict(lang) {
  return REGISTRY[lang] || REGISTRY.en;
}

export default REGISTRY;
