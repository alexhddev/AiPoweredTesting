# JIRA Ticket: DASH-309

**Type:** User Story
**Priority:** Medium
**Sprint:** Sprint 26
**Reporter:** Priya Nair (Product)
**Assignee:** Frontend Team

---

## Summary

As an admin user, I want to export the user activity report as a CSV file so that I can analyse user engagement data in spreadsheet tools.

---

## Description

The analytics dashboard currently only displays user activity data in-browser. Admins need to be able to download this data as a CSV for offline analysis and sharing with stakeholders. The export should respect whatever filters are currently applied to the report view.

---

## Acceptance Criteria

- [ ] AC1: An "Export CSV" button is visible on the User Activity Report page, only for users with the `admin` role.
- [ ] AC2: Clicking "Export CSV" downloads a `.csv` file named `user_activity_YYYY-MM-DD.csv` using today's date.
- [ ] AC3: The exported CSV includes the same rows and columns currently displayed (i.e., active filters are applied).
- [ ] AC4: The CSV includes a header row matching the column names shown in the UI.
- [ ] AC5: If the filtered result set is empty, the download still succeeds and contains only the header row.
- [ ] AC6: For large exports (>10,000 rows) the file is generated asynchronously; the user receives a "Your export is being prepared" notification and a download link via email when ready.
- [ ] AC7: Non-admin users do not see the Export button and receive a 403 if they call the export API directly.
- [ ] AC8: All date/time values in the CSV are exported in ISO 8601 format (UTC).

---

## UI Mockup Notes

- Button placement: top-right of the report table, next to the existing "Refresh" button.
- Loading spinner shown on the button while the synchronous export is in progress.
- For async exports, show a dismissible toast: "Export started — you'll receive an email when it's ready."

---

## API Contract

`GET /api/reports/user-activity/export`

Query params mirror the existing report filter params (`from`, `to`, `userId`, `eventType`).

Response (sync, ≤10k rows): `Content-Type: text/csv`, file attachment.
Response (async, >10k rows): `202 Accepted`, JSON body `{ "jobId": "<uuid>" }`.

---

## Out of Scope

- Excel (`.xlsx`) format — CSV only for this ticket.
- Scheduled/automated exports.
