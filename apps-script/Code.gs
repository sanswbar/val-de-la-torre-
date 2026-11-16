/**
 * Formularios de contacto de valdelatorre.com — Google Apps Script web app.
 *
 * Recibe los envíos de los DOS formularios del sitio, agrega una fila a la hoja
 * "Contactos" y manda un aviso por correo con Reply-To al remitente.
 * Los envíos que parecen spam NO se borran: van a la hoja "Spam" (con el motivo)
 * y no generan correo. Al bot siempre se le responde { ok: true } para que no aprenda.
 *
 *  - Conferencias (index.html): source=Conferencias, name, company, email, phone, type, date, message
 *  - Prensa (media.html):       source=Prensa, outlet, name, email, phone, type, deadline, message
 *    → se guarda con el medio en "Empresa", la fecha límite en "Fecha estimada"
 *      y el tipo como "Prensa · Entrevista" (etc.), para distinguirlo en la hoja.
 *  - Ambos mandan además: website (campo trampa, vacío para personas) y
 *    ts (milisegundos entre que se mostró el formulario y el envío).
 *
 * Este script debe estar vinculado a la Google Sheet (Extensiones → Apps Script).
 */

// Both of Val's accounts get every notification
const NOTIFY_EMAIL = 'valedelatorreg@gmail.com,valdelatorreg@gmail.com';
const SHEET_NAME = 'Contactos';
const SPAM_SHEET_NAME = 'Spam';
// 'Teléfono' goes LAST so existing rows keep their columns
const HEADERS = ['Fecha', 'Nombre', 'Correo', 'Empresa', 'Tipo de colaboración', 'Fecha estimada', 'Mensaje', 'Teléfono'];
const SPAM_HEADERS = HEADERS.concat(['Motivo']);

// Same limits as the maxlength attributes in index.html and media.html
const MAX_LENGTH = { name: 120, email: 254, company: 160, type: 60, date: 120, message: 4000, phone: 40 };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MIN_FILL_MS = 3000;        // a person needs more than 3 s to fill the form
const DUPLICATE_WINDOW_S = 600;  // same email or phone again within 10 min → Spam

function doPost(e) {
  const p = (e && e.parameter) || {};
  const data = normalize(p);

  const reason = spamReason(p, data);
  if (reason) {
    saveRow(SPAM_SHEET_NAME, SPAM_HEADERS, data, [reason]);
    return json({ ok: true });
  }

  if (!data.name || !data.company || !data.type || !data.message || !EMAIL_PATTERN.test(data.email)) {
    return json({ ok: false, error: 'invalid' });
  }

  // Duplicate check last, and only remembered for accepted messages
  const cache = CacheService.getScriptCache();
  const keys = duplicateKeys(data);
  if (keys.some(k => cache.get(k))) {
    saveRow(SPAM_SHEET_NAME, SPAM_HEADERS, data, ['repetido (10 min)']);
    return json({ ok: true });
  }

  try {
    saveRow(SHEET_NAME, HEADERS, data, []);
  } catch (err) {
    console.error('No se pudo guardar la fila', err);
    return json({ ok: false, error: 'storage' });
  }
  keys.forEach(k => cache.put(k, '1', DUPLICATE_WINDOW_S));

  // The row is already saved, so a mail failure doesn't fail the submission
  // (otherwise the visitor would resend and create a duplicate row).
  try {
    sendNotification(data);
  } catch (err) {
    console.error('No se pudo enviar el aviso por correo', err);
  }

  return json({ ok: true });
}

// Maps both forms onto the same columns
function normalize(p) {
  const isPress = String(p.source || '').trim() === 'Prensa';
  const src = Object.assign({}, p, {
    company: p.company || p.outlet || '',
    date: p.date || p.deadline || '',
    type: (isPress && p.type) ? `Prensa · ${p.type}` : (p.type || '')
  });
  const data = {};
  Object.keys(MAX_LENGTH).forEach(key => {
    data[key] = String(src[key] || '').trim().slice(0, MAX_LENGTH[key]);
  });
  return data;
}

// ── Spam filter ───────────────────────────────────────────────────
// Returns a short reason (saved in the "Spam" sheet) or '' when it looks legit.

const STOPWORDS = new Set((
  'de la el en que y los las un una es para por con del al lo se su sus mi me te tu nos le les ' +
  'como pero mas más muy ya hay este esta estos estas ese esa son ser fue sobre hola buen buenos buenas ' +
  'dias días tardes gracias saludos favor quiero queremos quisiera nuestra nuestro evento eventos ' +
  'conferencia conferencias empresa información informacion fecha precio costo podcast entrevista ' +
  'the and to of for in is you your we our my on with this that are be it at as an or from hi hello ' +
  'thanks thank would like event talk speaker interview'
).split(' '));

function spamReason(p, data) {
  if (String(p.website || '').trim()) return 'campo trampa lleno';

  const elapsed = Number(p.ts);
  if (!p.ts || !isFinite(elapsed)) return 'sin tiempo de llenado';
  if (elapsed < MIN_FILL_MS) return 'enviado en menos de 3 s';

  if (!isValidPhone(data.phone)) return 'teléfono vacío o inválido';

  const all = [data.name, data.company, data.message].join(' ');
  const urls = (data.message.match(/(https?:\/\/|www\.)\S+/gi) || []).length;
  if (urls >= 2) return '2+ enlaces';
  if (/(https?:\/\/|www\.)/i.test(data.name + ' ' + data.company)) return 'enlace en nombre/empresa';

  if (mostlyNonLatin(all)) return 'alfabeto no latino';
  if (looksGibberish(all)) return 'texto sin sentido';
  if (unknownLanguage(data.message)) return 'idioma no reconocido';

  return '';
}

function isValidPhone(phone) {
  if (!phone || /[^\d\s()+\-]/.test(phone)) return false;
  const digits = phone.replace(/\D/g, '').length;
  return digits >= 7 && digits <= 15;
}

// More than 40 % of the letters are not Latin script (Greek, Cyrillic, Arabic, CJK…)
function mostlyNonLatin(text) {
  const letters = text.match(/\p{L}/gu) || [];
  if (letters.length < 8) return false;
  const latin = text.match(/\p{Script=Latin}/gu) || [];
  return latin.length / letters.length < 0.6;
}

// Long consonant runs, or long tokens of capitals + digits with no spaces (MERTHYTJTJ3165…)
function looksGibberish(text) {
  if (/[bcdfghjklmnpqrstvwxzç]{6,}/i.test(text)) return true;
  return text.split(/\s+/).some(w => w.length >= 12 && /\d/.test(w) && /[A-Z]/.test(w) &&
    (w.match(/[A-Z0-9]/g) || []).length / w.length > 0.8);
}

// Messages of 4+ words with no common Spanish/English word, or full of foreign accents
// (Hawaiian, Vietnamese, Igbo…). They still land in "Spam", never lost.
function unknownLanguage(message) {
  const words = message.toLowerCase().match(/[\p{L}']+/gu) || [];
  if (words.length < 4) return false;
  const known = words.filter(w => STOPWORDS.has(w)).length;
  if (known === 0) return true;
  const letters = message.match(/\p{L}/gu) || [];
  const foreign = letters.filter(ch => !/[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]/.test(ch)).length;
  return letters.length >= 20 && foreign / letters.length > 0.15;
}

function duplicateKeys(data) {
  const keys = [];
  if (data.email) keys.push('e:' + data.email.toLowerCase());
  const digits = data.phone.replace(/\D/g, '');
  if (digits) keys.push('p:' + digits.slice(-10));
  return keys;
}

// ── Sheets ────────────────────────────────────────────────────────

function saveRow(sheetName, headers, data, extra) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    getSheet(sheetName, headers).appendRow([
      new Date(),
      safeCell(data.name),
      safeCell(data.email),
      safeCell(data.company),
      safeCell(data.type),
      safeCell(data.date),
      safeCell(data.message),
      safeCell(data.phone)
    ].concat(extra.map(safeCell)));
  } finally {
    lock.releaseLock();
  }
}

// Visiting the web app URL in a browser shows this instead of an error
function doGet() {
  return json({ ok: true, status: 'Formulario de contacto activo' });
}

function getSheet(name, headers) {
  name = name || SHEET_NAME;
  headers = headers || HEADERS;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(name) || ss.insertSheet(name);
  ensureHeaders(sheet, headers);
  return sheet;
}

// Keeps the column titles in row 1, even if the tab already had rows without them
function ensureHeaders(sheet, headers) {
  const current = sheet.getLastRow() > 0
    ? sheet.getRange(1, 1, 1, headers.length).getDisplayValues()[0]
    : [];
  if (current.join('|') === headers.join('|')) return;

  // Row 1 already has the old titles (same order, only new ones missing at the end): update it in place
  const isOldHeader = current.length > 0 && current[0] === headers[0] &&
    current.every((v, i) => v === '' || v === headers[i]);
  if (!isOldHeader && sheet.getLastRow() > 0) sheet.insertRowBefore(1);
  sheet.getRange(1, 1, 1, headers.length)
    .setValues([headers])
    .setFontWeight('bold');
  sheet.setFrozenRows(1);
}

/**
 * Run once from the editor (select it → Run) to add the titles to row 1
 * of "Contactos" (adds "Teléfono") and create the "Spam" tab now.
 */
function setupSheet() {
  getSheet(SHEET_NAME, HEADERS);
  getSheet(SPAM_SHEET_NAME, SPAM_HEADERS);
}

function sendNotification(data) {
  // Type first, then company, so the inbox list shows what kind of request it is
  const subject = `${data.type} — ${data.company}`.replace(/[\r\n]+/g, ' ');
  const body = [
    `Nombre: ${data.name}`,
    `Correo: ${data.email}`,
    `Teléfono: ${data.phone}`,
    `Empresa / medio: ${data.company}`,
    `Tipo de colaboración: ${data.type}`,
    `Fecha estimada / límite: ${data.date || '—'}`,
    '',
    'Mensaje:',
    data.message,
    '',
    '—',
    'Responde a este correo para contestarle directamente.'
  ].join('\n');

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    replyTo: data.email,
    subject: subject,
    body: body,
    name: 'Formulario valdelatorre'
  });
}

// Stops values like "=IMPORTXML(...)" from running as formulas in the sheet
function safeCell(value) {
  value = String(value);
  return /^[=+\-@]/.test(value) ? `'${value}` : value;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Run this once from the editor (select it → Run) to approve permissions
 * and check that the sheet and the email work before going live.
 * (Sends one test email and adds one "Prueba" row to Contactos.)
 */
function testSubmission() {
  const res = doPost({ parameter: {
    source: 'Conferencias',
    website: '',
    ts: '20000',
    name: 'Prueba',
    email: 'valedelatorreg@gmail.com',
    phone: '+52 55 0000 0000',
    company: 'Prueba',
    type: 'Otro',
    date: '',
    message: 'Mensaje de prueba del formulario.'
  }});
  console.log(res.getContent());
}
