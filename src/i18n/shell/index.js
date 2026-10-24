// The shell dictionaries, loaded for the runtime translation pass.
//
// The page copy that JavaScript renders is written in English in the source
// (it is data, not markup), so the translations that the page build already
// keeps for the shells are used to translate it at run time.
import en from "./en.json";
import es from "./es.json";
import pt from "./pt.json";
import fr from "./fr.json";

const REGISTRY = { en, es, pt, fr };

export function getShellDict(lang) {
  return REGISTRY[lang] || REGISTRY.en;
}

export default REGISTRY;
