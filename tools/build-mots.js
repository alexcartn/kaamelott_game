// Génère la liste de mots du Mot juste et l'embarque dans index.html (balise <script id="mots">).
//
// Usage, depuis la racine du projet :
//   mkdir -p /tmp/mots && cd /tmp/mots && npm init -y && npm i an-array-of-french-words most-common-words-by-language
//   cd - && node tools/build-mots.js /tmp/mots/node_modules
//
// Sources : an-array-of-french-words (MIT, 336 000 formes) et most-common-words-by-language (MIT),
// dont les fréquences viennent des listes de fréquence de Wiktionnaire (CC BY-SA).
// Résultat : c = mots courants (rangs 1 à 5000), r = mots plus rares (5001 à 10000), d = autres mots
// de 5 lettres du dictionnaire. Tout est replié sans accents, en minuscules, longueur de 4 à 10.
const fs = require("fs");
const zlib = require("zlib");
const path = require("path");

const nm = process.argv[2];
if (!nm) { console.error("Usage : node tools/build-mots.js <dossier node_modules>"); process.exit(1); }

const dict = JSON.parse(fs.readFileSync(path.join(nm, "an-array-of-french-words/index.json"), "utf8"));
const top = fs.readFileSync(path.join(nm, "most-common-words-by-language/build/resources/french.txt"), "utf8")
  .split("\n").map((x) => x.trim()).filter(Boolean);

const plain = (x) => x.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const ok = (x) => /^\p{L}+$/u.test(x) && /^[a-z]+$/.test(plain(x)) && plain(x).length === x.length;

const seen = new Set();
const c = [];
const r = [];
top.forEach((w, i) => {
  if (!ok(w)) return;
  const p = plain(w);
  if (p.length < 4 || p.length > 10 || seen.has(p)) return;
  seen.add(p);
  (i < 5000 ? c : r).push(p);
});
const d = new Set();
dict.forEach((w) => {
  if (!ok(w)) return;
  const p = plain(w);
  if (p.length === 5 && !seen.has(p)) d.add(p);
});

const blob = JSON.stringify({ c: c.sort().join(" "), r: r.sort().join(" "), d: [...d].sort().join(" ") });
const b64 = zlib.gzipSync(blob, { level: 9 }).toString("base64");

const file = path.join(__dirname, "..", "index.html");
let html = fs.readFileSync(file, "utf8");
const re = /(<script id="mots" type="text\/plain">)[\s\S]*?(<\/script>)/;
if (!re.test(html)) { console.error('Balise <script id="mots" type="text/plain"> introuvable dans index.html'); process.exit(1); }
html = html.replace(re, (m, a, b) => a + b64 + b);
fs.writeFileSync(file, html);
console.log("courants " + c.length + ", rares " + r.length + ", autres de 5 lettres " + d.size + ", " + Math.round(b64.length / 1024) + " Ko embarqués");
