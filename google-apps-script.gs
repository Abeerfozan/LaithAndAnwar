/*
  Google Apps Script for Laith & Anwar RSVP responses.

  Setup:
  1) Open the destination Google Sheet.
  2) Extensions -> Apps Script.
  3) Paste this code and save.
  4) Deploy -> New deployment -> Web app.
  5) Execute as: Me.
  6) Who has access: Anyone.
  7) Copy the /exec URL into RSVP_GOOGLE_SCRIPT_URL in script.js.
*/

const RSVP_SHEET_NAME = 'RSVP';

function doPost(e) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(RSVP_SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(RSVP_SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Name', 'Attendance', 'Submitted At', 'Source']);
    sheet.setFrozenRows(1);
  }

  const params = e && e.parameter ? e.parameter : {};
  const name = String(params.name || '').trim();
  const attendance = String(params.attendance || '').trim();
  const submittedAt = String(params.submittedAt || '');
  const source = String(params.source || 'LaithAndAnwar invitation');

  if (!name || !attendance) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: 'Missing required fields' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  sheet.appendRow([
    new Date(),
    name,
    attendance,
    submittedAt,
    source
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, service: 'LaithAndAnwar RSVP' }))
    .setMimeType(ContentService.MimeType.JSON);
}
