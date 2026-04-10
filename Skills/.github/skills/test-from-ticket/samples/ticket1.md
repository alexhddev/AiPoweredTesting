# JIRA Ticket: AUTH-142

**Type:** User Story
**Priority:** High
**Sprint:** Sprint 24
**Reporter:** Sarah Chen
**Assignee:** Dev Team

---

## Summary

As a registered user, I want to reset my password via email so that I can regain access to my account if I forget my credentials.

---

## Description

Users who have forgotten their password should be able to request a password reset link via email. The link should be time-limited and single-use. Once the user sets a new password, all existing sessions should be invalidated.

---

## Acceptance Criteria

- [ ] AC1: A "Forgot Password?" link is visible on the login page.
- [ ] AC2: Submitting the forgot-password form with a registered email sends a reset link to that email within 2 minutes.
- [ ] AC3: Submitting the form with an unregistered email shows a generic success message (do not reveal whether the email exists).
- [ ] AC4: The reset link expires after 60 minutes.
- [ ] AC5: The reset link can only be used once; a second click shows an "invalid or expired link" error.
- [ ] AC6: The new password must be at least 8 characters and include one uppercase letter and one number.
- [ ] AC7: After a successful password reset, all active sessions for the user are invalidated.
- [ ] AC8: The user is redirected to the login page after a successful reset with a confirmation message.

---

## Notes

- Rate-limit reset requests to 3 per hour per email address.
- Log all reset attempts for security auditing.
- The reset token should be stored as a hash, not plaintext.
