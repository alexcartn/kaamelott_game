/**
 * Classement Kaamelott : mini serveur de scores, sans compte pour les joueurs.
 * À coller dans Extensions > Apps Script d'un Google Sheet (voir le README).
 *
 * GET  ?board=<id>                       -> meilleurs scores du classement
 * POST {board, name, score, n} (text/plain) -> enregistre un score
 */
const SHEET_NAME = "scores";
const MAX_ROWS = 20;
const BOARD_RE = /^(daily-\d{4}-\d{2}-\d{2}|(qui|complete)-(facile|moyen|difficile))$/;

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(["t", "board", "name", "score", "n"]);
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const board = String((e && e.parameter && e.parameter.board) || "");
  if (!BOARD_RE.test(board)) return json_({ ok: false, error: "classement inconnu" });

  const values = sheet_().getDataRange().getValues().slice(1);
  const best = {};
  values.forEach(function (r) {
    if (r[1] !== board) return;
    const key = String(r[2]).toLowerCase();
    const cur = best[key];
    const row = { t: Number(r[0]), name: String(r[2]), score: Number(r[3]), n: Number(r[4]) };
    // Un seul score par nom : le meilleur, et à égalité le plus ancien.
    if (!cur || row.score > cur.score || (row.score === cur.score && row.t < cur.t)) best[key] = row;
  });
  const rows = Object.keys(best).map(function (k) { return best[k]; })
    .sort(function (a, b) { return b.score - a.score || a.t - b.t; })
    .slice(0, MAX_ROWS);
  return json_({ ok: true, rows: rows });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    const board = String(d.board || "");
    // On retire les caractères de contrôle et ceux qui feraient interpréter le nom comme une formule.
    const name = String(d.name || "")
      .replace(/[\u0000-\u001f<>]/g, "")
      .replace(/^[=+\-@\s]+/, "")
      .trim()
      .slice(0, 20);
    const score = Number(d.score);
    const n = Number(d.n);
    const expectedN = board.indexOf("daily-") === 0 ? 5 : 10;
    if (!BOARD_RE.test(board) || !name || n !== expectedN || !Number.isInteger(score) || score < 0 || score > n) {
      return json_({ ok: false, error: "données invalides" });
    }
    sheet_().appendRow([Date.now(), board, name, score, n]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: "requête invalide" });
  } finally {
    lock.releaseLock();
  }
}
