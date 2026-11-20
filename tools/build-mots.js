// Génère la liste de mots du Mot juste et l'embarque dans index.html (balise <script id="mots">).
//
// Usage, depuis la racine du projet :
//   mkdir -p /tmp/mots && cd /tmp/mots && npm init -y && npm i an-array-of-french-words
//   curl -L -o /tmp/mots/fr_50k.txt https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/fr/fr_50k.txt
//   cd - && node tools/build-mots.js /tmp/mots/node_modules /tmp/mots/fr_50k.txt
//
// Sources :
// - an-array-of-french-words (MIT, 336 000 formes) : le dictionnaire, pour écarter noms propres, anglais et coquilles.
// - FrequencyWords de Hermit Dave (code MIT, contenu CC BY-SA 4.0) : les 50 000 mots les plus fréquents
//   des sous-titres français d'OpenSubtitles, avec leurs accents. Du français parlé, proche de la série.
//
// Résultat, tout replié sans accents, en minuscules, de 5 à 9 lettres (les longueurs jouées) :
// c = mots courants (4 000 premiers mots du dictionnaire dans l'ordre de fréquence),
// r = mots plus rares (les 6 000 suivants),
// d = autres mots acceptés : le reste des sous-titres, plus tous les mots de 5 lettres du dictionnaire.
const fs = require("fs");
const zlib = require("zlib");
const path = require("path");

const COMMON = 4000;
const RARE = 6000;

const [nm, freqFile] = process.argv.slice(2);
if (!nm || !freqFile) {
  console.error("Usage : node tools/build-mots.js <dossier node_modules> <fichier fr_50k.txt>");
  process.exit(1);
}

const nfc = (x) => x.normalize("NFC");
const dict = JSON.parse(fs.readFileSync(path.join(nm, "an-array-of-french-words/index.json"), "utf8")).map(nfc);
const known = new Set(dict);
const freq = fs.readFileSync(freqFile, "utf8")
  .split("\n").map((l) => nfc(l.trim().split(" ")[0] || "")).filter(Boolean);

const plain = (x) => x.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const ok = (x) => /^\p{L}+$/u.test(x) && /^[a-z]+$/.test(plain(x)) && plain(x).length === x.length;

const seen = new Set();
const c = [];
const r = [];
const d = new Set();
freq.forEach((w) => {
  if (!ok(w) || !known.has(w)) return;
  const p = plain(w);
  if (p.length < 5 || p.length > 9 || seen.has(p)) return;
  seen.add(p);
  if (c.length < COMMON) c.push(p);
  else if (r.length < RARE) r.push(p);
  else d.add(p);
});
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
console.log("courants " + c.length + ", rares " + r.length + ", autres " + d.size + ", " + Math.round(b64.length / 1024) + " Ko embarqués");
