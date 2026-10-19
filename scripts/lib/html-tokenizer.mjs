// Shared HTML tokenizer + substituter used by the i18n page pipeline.
//
// Why hand-rolled: the project has no HTML parser dependency (node_modules
// holds only vite + the Vercel analytics shims) and adding one for a static
// generator is not worth it. The tokenizer only needs to split a document
// into (a) tag text, (b) attribute values and (c) text nodes — enough to
// swap copy without ever re-serialising the markup.
//
// It never touches the inside of <script>, <style> or <pre>, and it leaves
// attribute quoting untouched.

const VOID_TAGS = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
const RAW_TEXT = new Set(["script", "style", "textarea", "pre"]);

/**
 * Tokenize an HTML document.
 * Returns an array of { type, ... } where type is one of:
 *   "doctype" | "comment" | "text" | "tag"
 * A "tag" token carries { name, attrs: [{ name, value, quote, start, end }], selfClosing }.
 */
export function tokenize(html) {
  const tokens = [];
  let i = 0;
  const n = html.length;
  while (i < n) {
    const lt = html.indexOf("<", i);
    if (lt < 0) {
      tokens.push({ type: "text", start: i, end: n, value: html.slice(i, n) });
      break;
    }
    if (lt > i) tokens.push({ type: "text", start: i, end: lt, value: html.slice(i, lt) });

    // comment
    if (html.startsWith("<!--", lt)) {
      const close = html.indexOf("-->", lt + 4);
      const end = close < 0 ? n : close + 3;
      tokens.push({ type: "comment", start: lt, end, value: html.slice(lt, end) });
      i = end;
      continue;
    }
    // doctype / processing instruction
    if (html.startsWith("<!", lt) || html.startsWith("<?", lt)) {
      const close = html.indexOf(">", lt);
      const end = close < 0 ? n : close + 1;
      tokens.push({ type: "doctype", start: lt, end, value: html.slice(lt, end) });
      i = end;
      continue;
    }
    // tag
    const close = findTagEnd(html, lt);
    const end = close < 0 ? n : close + 1;
    const raw = html.slice(lt + 1, end - 1);
    const nameMatch = raw.match(/^([a-zA-Z][\w:-]*)/);
    const name = nameMatch ? nameMatch[1].toLowerCase() : "";
    const attrs = parseAttrs(raw, nameMatch ? nameMatch[0].length : 0);
    const selfClosing = raw.trimEnd().endsWith("/") || VOID_TAGS.has(name);
    tokens.push({ type: "tag", start: lt, end, name, attrs, selfClosing });
    i = end;

    // raw-text elements: skip to the matching close tag
    if (RAW_TEXT.has(name) && !selfClosing) {
      const closeTag = new RegExp("</" + name + "\\s*>", "i");
      const rest = html.slice(i);
      const m = closeTag.exec(rest);
      const endRaw = m ? i + m.index : n;
      tokens.push({ type: "raw", start: i, end: endRaw, value: html.slice(i, endRaw), name });
      i = endRaw;
      // the closing tag itself
      if (m) {
        const cEnd = i + m.index + m[0].length;
        tokens.push({ type: "tag", start: cEnd - m[0].length, end: cEnd, name, attrs: [], selfClosing: false });
        i = cEnd;
      }
    }
  }
  return tokens;
}

function findTagEnd(html, from) {
  let i = from + 1;
  let quote = null;
  while (i < html.length) {
    const c = html[i];
    if (quote) {
      if (c === quote) quote = null;
    } else if (c === '"' || c === "'") {
      quote = c;
    } else if (c === ">") {
      return i;
    }
    i++;
  }
  return -1;
}

/** Parse the attribute list of a tag body. Returns [{ name, value, quote }]. */
function parseAttrs(raw, from) {
  const attrs = [];
  const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*(=\s*("([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  re.lastIndex = from;
  let m;
  while ((m = re.exec(raw))) {
    const quote = m[3] !== undefined ? '"' : m[5] !== undefined ? "'" : m[7] !== undefined ? "" : null;
    const value = m[3] !== undefined ? m[4] : m[5] !== undefined ? m[6] : m[7] !== undefined ? m[7] : "";
    attrs.push({ name: m[1].toLowerCase(), value, quote });
  }
  return attrs;
}

/**
 * Apply a substitution map to a document.
 * `map` maps a plain string to its replacement.
 * `opts.text`  — also replace text nodes
 * `opts.attrs` — replace the value of these attribute names
 * Returns the new document plus a report of what changed.
 */
export function substitute(html, map, opts = {}) {
  const doText = opts.text !== false;
  const attrNames = new Set((opts.attrs || []).map((a) => a.toLowerCase()));
  const tokens = tokenize(html);
  let out = "";
  let cursor = 0;
  const changed = [];
  const missing = new Set();

  for (const tok of tokens) {
    out += html.slice(cursor, tok.start);
    cursor = tok.end;

    if (tok.type === "text") {
      const raw = tok.value;
      const lead = raw.match(/^\s*/)[0];
      const trail = raw.match(/\s*$/)[0];
      const core = raw.slice(lead.length, raw.length - trail.length);
      if (doText && core && map[core]) {
        out += lead + map[core] + trail;
        changed.push(core);
      } else {
        if (doText && core && /[A-Za-z]/.test(core) && !isMachineText(core)) missing.add(core);
        out += raw;
      }
      continue;
    }

    if (tok.type === "tag") {
      let body = tok.value || html.slice(tok.start, tok.end);
      // rebuild the tag with substituted attribute values
      const rebuilt = tok.attrs.map((a) => {
        if (!attrNames.has(a.name) || !a.value) return null;
        if (!map[a.value]) {
          if (/[A-Za-z]/.test(a.value) && !isMachineText(a.value)) missing.add(a.value);
          return null;
        }
        changed.push(a.value);
        return { name: a.name, value: map[a.value], quote: a.quote || '"' };
      }).filter(Boolean);
      if (rebuilt.length) {
        body = applyAttrSubs(body, rebuilt);
      }
      out += body;
      continue;
    }
    out += tok.value;
  }
  out += html.slice(cursor);
  return { html: out, changed, missing: [...missing] };
}

function applyAttrSubs(tagBody, subs) {
  // tagBody includes the surrounding <> for tags, or is the inner text.
  let s = tagBody;
  for (const sub of subs) {
    const re = new RegExp("(\\s" + sub.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*=\\s*)(\"[^\"]*\"|'[^']*'|[^\\s>]+)", "i");
    s = s.replace(re, (m, pre, val) => {
      const q = val[0] === '"' || val[0] === "'" ? val[0] : '"';
      const inner = val[0] === '"' || val[0] === "'" ? val.slice(1, -1) : val;
      return pre + q + escapeAttr(sub.value) + q;
    });
  }
  return s;
}

function escapeAttr(v) {
  return String(v).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Strings that are not prose and must never be sent to a translator. */
export function isMachineText(s) {
  const t = s.trim();
  if (!t) return true;
  if (/^https?:\/\//i.test(t)) return true;
  if (/^\/[\w\-./?=&%#]*$/.test(t)) return true;      // paths
  if (/^[A-Z]{2,5}$/.test(t)) return true;              // all caps codes
  // no letters at all -> numbers, prices, dates, percentages, symbols
  if (!/[a-z]/i.test(t)) return true;
  // a lone currency amount or a range of them
  if (/^[\$€£¥]\s?\d[\d.,]*(?:\s*[–-]\s*\$?\d[\d.,]*)?$/.test(t)) return true;
  if (/^\d[\d.,]*\s*[–-]\s*\d[\d.,]*$/.test(t)) return true;
  if (t.length < 2) return true;
  return false;
}
