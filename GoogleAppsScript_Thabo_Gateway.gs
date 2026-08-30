/**
 * Thabo Google Gateway
 *
 * This script is deployed as a Google Apps Script Web App.
 * It saves and reads public company research in the Research Leads sheet
 * and sends email only when the request explicitly contains approved: true.
 */

const CONFIG = {
  researchSheet: 'Research Leads',
  emailLogSheet: 'Email Log',
  tokenProperty: 'THABO_GATEWAY_TOKEN',
};

function authorizeThabo() {
  SpreadsheetApp.getActiveSpreadsheet().getName();
  GmailApp.getAliases();
  return 'Thabo permissions are ready';
}

function doGet() {
  return jsonResponse({ ok: true, service: 'Thabo Google Gateway' });
}

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    verifyToken_(body.token);

    switch (body.action) {
      case 'save_research':
        return jsonResponse(saveResearch_(body.payload || {}));
      case 'read_research':
        return jsonResponse(readResearch_(body.payload || {}));
      case 'send_approved_email':
        return jsonResponse(sendApprovedEmail_(body.payload || {}));
      default:
        throw new Error('Unknown action');
    }
  } catch (error) {
    return jsonResponse({ ok: false, message: String(error.message || error) });
  }
}

function verifyToken_(receivedToken) {
  const expectedToken = PropertiesService.getScriptProperties().getProperty(CONFIG.tokenProperty);
  if (!expectedToken) throw new Error('Gateway token is not configured in Script Properties');
  if (!receivedToken || receivedToken !== expectedToken) throw new Error('Unauthorized gateway request');
}

function saveResearch_(payload) {
  const rows = Array.isArray(payload.rows) ? payload.rows : [];
  if (!rows.length) return { ok: true, saved: 0, message: 'No rows supplied' };

  const sheet = getOrCreateSheet_(CONFIG.researchSheet, [
    'Company Name', 'Country', 'Sector', 'Website', 'Business Email', 'Business Phone',
    'Contact Page', 'Source URL', 'Public Fact', 'Business Fit', 'Research Date', 'Email Status',
  ]);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const existing = new Map();
  values.slice(1).forEach((row, index) => {
    const key = `${row[0] || ''}|${row[7] || ''}`;
    existing.set(key, index + 2);
  });

  let saved = 0;
  rows.forEach(item => {
    const row = headers.map(header => valueForHeader_(header, item));
    const key = `${item.companyName || ''}|${item.sourceUrl || ''}`;
    const existingRow = existing.get(key);
    if (existingRow) sheet.getRange(existingRow, 1, 1, headers.length).setValues([row]);
    else sheet.appendRow(row);
    saved += 1;
  });

  return { ok: true, saved, sheet: CONFIG.researchSheet };
}

function readResearch_(payload) {
  const sheet = getOrCreateSheet_(CONFIG.researchSheet, [
    'Company Name', 'Country', 'Sector', 'Website', 'Business Email', 'Business Phone',
    'Contact Page', 'Source URL', 'Public Fact', 'Business Fit', 'Research Date', 'Email Status',
  ]);
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return { ok: true, rows: [] };
  const headers = values[0];
  const query = String(payload.query || '').toLowerCase().trim();
  const rows = values.slice(1).map(row => headers.reduce((record, header, index) => {
    record[header] = row[index] instanceof Date ? row[index].toISOString() : row[index];
    return record;
  }, {})).filter(row => !query || JSON.stringify(row).toLowerCase().includes(query));
  return { ok: true, rows };
}

function sendApprovedEmail_(payload) {
  if (payload.approved !== true) throw new Error('Email send requires explicit human approval');
  if (!payload.to || !payload.subject || !payload.body) throw new Error('Recipient, subject, and body are required');

  GmailApp.sendEmail(String(payload.to), String(payload.subject), String(payload.body), {
    name: 'Thabo',
  });

  const log = getOrCreateSheet_(CONFIG.emailLogSheet, [
    'Company Name', 'Recipient Email', 'Subject', 'Email Body', 'Email Mode',
    'Approval Status', 'Sent Status', 'Sent Date', 'Error Message',
  ]);
  log.appendRow([
    payload.companyName || '', payload.to, payload.subject, payload.body,
    payload.mode || 'approval', 'Approved', 'Sent', new Date(), '',
  ]);
  return { ok: true, sent: true, companyName: payload.companyName || '' };
}

function getOrCreateSheet_(name, headers) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(name);
  if (!sheet) sheet = spreadsheet.insertSheet(name);
  if (sheet.getLastRow() === 0) sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  return sheet;
}

function valueForHeader_(header, item) {
  const map = {
    'Company Name': item.companyName,
    'Country': item.country,
    'Sector': item.sector,
    'Website': item.website,
    'Business Email': item.businessEmail,
    'Business Phone': item.businessPhone,
    'Contact Page': item.contactPage,
    'Source URL': item.sourceUrl,
    'Public Fact': item.publicFact,
    'Business Fit': item.fit,
    'Research Date': item.researchedAt || new Date().toISOString(),
    'Email Status': item.emailStatus || 'Research complete',
  };
  return map[header] || '';
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
