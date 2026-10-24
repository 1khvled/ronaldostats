// Per-language dictionary registry.
import * as en from "./en.js";
import * as es from "./es.js";
import * as pt from "./pt.js";
import * as fr from "./fr.js";

export const LANGS = ["en", "es", "pt", "fr"];
const REGISTRY = { en, es, pt, fr };

export function getDict(lang) {
  return REGISTRY[lang] || REGISTRY.en;
}

export default REGISTRY;
