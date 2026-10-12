/**
 * NEETprep College Predictor - Google Sheet Webhook Receiver
 *
 * HOW TO SET UP IN 60 SECONDS:
 * 1. Open a new Google Sheet (e.g. "NEETprep Predictor Leads 2025")
 * 2. Click Extensions > Apps Script
 * 3. Replace all code with this snippet
 * 4. Click Deploy > New deployment > Select type "Web app"
 * 5. Under "Execute as": "Me", Under "Who has access": "Anyone"
 * 6. Click Deploy and copy the Web App URL
 * 7. Paste that URL into the Admin Dashboard Settings of the Predictor app!
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Setup headers on row 1 if empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Lead ID",
        "Name",
        "Phone",
        "Score",
        "Category",
        "Home State",
        "Predicted AIR",
        "Score Band",
        "UTM Source",
        "UTM Medium",
        "UTM Campaign",
        "Device",
        "Is Test?"
      ]);
      sheet.getRange(1, 1, 1, 14).setFontWeight("bold").setBackground("#e2e8f0");
    }

    var payload = JSON.parse(e.postData.contents);
    if (payload.type === 'lead') {
      var lead = payload.data;
      sheet.appendRow([
        new Date().toISOString(),
        lead.id,
        lead.name,
        "'" + lead.phone, // format as text so leading zeros don't drop
        lead.score,
        lead.category,
        lead.state,
        lead.predicted_rank,
        lead.score_band,
        lead.utm_source,
        lead.utm_medium,
        lead.utm_campaign,
        lead.device,
        lead.is_test ? "YES" : "NO"
      ]);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("NEETprep Webhook is live!");
}
