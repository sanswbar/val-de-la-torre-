/**
 * Formulario de contacto de valdelatorre — Google Apps Script web app.
 *
 * Recibe los envíos del formulario del sitio, agrega una fila a la hoja
 * "Contactos" y manda un aviso por correo con Reply-To al remitente.
 * Este script debe estar vinculado a la Google Sheet (Extensiones → Apps Script).
 */

const NOTIFY_EMAIL = 'valedelatorreg@gmail.com';
const SHEET_NAME = 'Contactos';
const HEADERS = ['Fecha', 'Nombre', 'Correo', 'Empresa', 'Tipo de colaboración', 'Fecha estimada', 'Mensaje'];

// Same limits as the maxlength attributes in index.html
const MAX_LENGTH = { name: 120, email: 254, company: 160, type: 60, date: 120, message: 4000 };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function doPost(e) {
  const p = (e && e.parameter) || {};

  // Honeypot filled → a bot. Answer "ok" so it doesn't retry, but store nothing.
  if (p.website) return json({ ok: true });

  const data = {};
  Object.keys(MAX_LENGTH).forEach(key => {
    data[key] = String(p[key] || '').trim().slice(0, MAX_LENGTH[key]);
  });

  if (!data.name || !data.company || !data.type || !data.message || !EMAIL_PATTERN.test(data.email)) {
    return json({ ok: false, error: 'invalid' });
  }

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    getSheet().appendRow([
      new Date(),
      safeCell(data.name),
      safeCell(data.email),
      safeCell(data.company),
      safeCell(data.type),
      safeCell(data.date),
      safeCell(data.message)
    ]);
  } catch (err) {
    console.error('No se pudo guardar la fila', err);
    return json({ ok: false, error: 'storage' });
  } finally {
    lock.releaseLock();
  }

  // The row is already saved, so a mail failure doesn't fail the submission
  // (otherwise the visitor would resend and create a duplicate row).
  try {
    sendNotification(data);
  } catch (err) {
    console.error('No se pudo enviar el aviso por correo', err);
  }

  return json({ ok: true });
}

// Visiting the web app URL in a browser shows this instead of an error
function doGet() {
  return json({ ok: true, status: 'Formulario de contacto activo' });
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sheet;
}

function sendNotification(data) {
  const subject = `Nuevo contacto — ${data.name} (${data.type})`.replace(/[\r\n]+/g, ' ');
  const body = [
    `Nombre: ${data.name}`,
    `Correo: ${data.email}`,
    `Empresa: ${data.company}`,
    `Tipo de colaboración: ${data.type}`,
    `Fecha estimada: ${data.date || '—'}`,
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
  return /^[=+\-@]/.test(value) ? `'${value}` : value;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Run this once from the editor (select it → Run) to approve permissions
 * and check that the sheet and the email work before going live.
 */
function testSubmission() {
  const res = doPost({ parameter: {
    name: 'Prueba',
    email: NOTIFY_EMAIL,
    company: 'Prueba',
    type: 'Otro',
    date: '',
    message: 'Mensaje de prueba del formulario.'
  }});
  console.log(res.getContent());
}
