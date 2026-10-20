// The shell dictionaries, loaded for the runtime translation pass.
//
// The page copy that JavaScript renders is written in English in the source
// (it is data, not markup), so the translations that the page build already
// keeps for the shells are used to translate it at run time.
import en from "./en.json";
import es from "./es.json";
import pt from "./pt.json";
import fr from "./fr.json";
import ar from "./ar.json";
import bn from "./bn.json";
import hi from "./hi.json";
import ro from "./ro.json";
import uz from "./uz.json";

const REGISTRY = { en, es, pt, fr, ar, bn, hi, ro, uz };

export function getShellDict(lang) {
  return REGISTRY[lang] || REGISTRY.en;
}

export default REGISTRY;
