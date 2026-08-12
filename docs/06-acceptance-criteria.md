# Acceptance Criteria

## Document Control

| Field               | Value                                                         |
| ------------------- | ------------------------------------------------------------- |
| Project             | Law Firm Website & Management System                          |
| Document            | Acceptance Criteria                                           |
| Document ID         | `AC-06`                                                     |
| Version             | 1.0                                                           |
| Status              | Complete and validated baseline                               |
| Effective date      | 2026-08-12                                                    |
| Business authority  | [01-brd.md](01-brd.md)                                         |
| Functional baseline | [02-frs.md](02-frs.md)                                         |
| User Story baseline | [05-user-stories.md](05-user-stories.md)                       |
| Decision register   | [assumptions-open-questions.md](assumptions-open-questions.md) |

## Record of Changes

| Date       | Change type | In charge | Description                                                                 |
| ---------- | ----------- | --------- | --------------------------------------------------------------------------- |
| 2026-08-12 | Added       | AI Agent  | Created and validated Acceptance Criteria from approved User Stories.         |

## 1. Introduction

This document specifies the Acceptance Criteria (AC) for the User Stories defined in `05-user-stories.md`.
The criteria establish the testable boundaries for each story, covering happy paths, validations, permissions, and exception handling using the Given-When-Then format.

## 2. Authentication & Access Control

### `AC-AUTH-001` — Authenticate Internal User
- **Related User Story**: `US-AUTH-001`
- **Related FR(s)**: `FR-AUTH-001`
- **Related OQ(s)**: `OQ-04`, `OQ-23`

**Scenario 1.1: Successful Login**
- **Given** an internal user is on the login page
- **When** they submit valid credentials (email and password)
- **Then** the system authenticates the user, generates a secure session token, and redirects them to their default dashboard based on their role.

**Scenario 1.2: Invalid Credentials**
- **Given** an internal user is on the login page
- **When** they submit invalid credentials
- **Then** the system denies access and displays a generic error message ("Invalid email or password") without indicating which field was incorrect.

**Scenario 1.3: Deactivated Account Login Attempt**
- **Given** an internal user with a deactivated account is on the login page
- **When** they submit their correctly matching credentials
- **Then** the system denies access and displays a message indicating the account is disabled.

### `AC-AUTH-002` — Maintain Secure Session
- **Related User Story**: `US-AUTH-002`
- **Related FR(s)**: `FR-AUTH-003`, `FR-AUTH-004`
- **Related OQ(s)**: `OQ-04`, `OQ-23`

**Scenario 2.1: Successful Token Refresh**
- **Given** an authenticated user has a valid refresh token and an expiring access token
- **When** the application requests a new access token
- **Then** the system validates the refresh token, issues a new access token, and extends the session seamlessly.

**Scenario 2.2: Expired Refresh Token**
- **Given** an authenticated user has an expired refresh token
- **When** the application requests a new access token
- **Then** the system denies the request and forces the user to log in again.

### `AC-AUTH-003` — Terminate Session
- **Related User Story**: `US-AUTH-003`
- **Related FR(s)**: `FR-AUTH-002`
- **Related OQ(s)**: `OQ-23`

**Scenario 3.1: Explicit Logout**
- **Given** an authenticated internal user
- **When** they click the "Log Out" button
- **Then** the system invalidates their current session (both access and refresh tokens) and redirects them to the login page.

### `AC-AUTH-004` — Enforce Permitted Access
- **Related User Story**: `US-AUTH-004`
- **Related FR(s)**: `FR-AUTH-004`
- **Related OQ(s)**: `OQ-04`

**Scenario 4.1: Access Denied to Unauthorized Resource**
- **Given** an authenticated user with the role `CONTENT_CREATOR`
- **When** they attempt to access an endpoint or page restricted to `SUPER_ADMIN`
- **Then** the system denies the request with a 403 Forbidden error and logs the unauthorized attempt.

## 3. User Administration

### `AC-USER-001` — Provision New Staff Account
- **Related User Story**: `US-USER-001`
- **Related FR(s)**: `FR-USER-001`, `FR-USER-003`
- **Related OQ(s)**: `OQ-04`, `OQ-17`, `OQ-23`

**Scenario 5.1: Successful User Creation**
- **Given** a `SUPER_ADMIN` is on the User Management page
- **When** they submit valid details (name, email, role, and temporary password) for a new user
- **Then** the system creates the user account and the new user can log in with those credentials.

**Scenario 5.2: Duplicate Email Rejection**
- **Given** a `SUPER_ADMIN` is creating a new user
- **When** they submit an email address that is already registered in the system
- **Then** the system rejects the submission and displays a validation error ("Email is already in use").

### `AC-USER-002` — Manage Staff Account Details
- **Related User Story**: `US-USER-002`
- **Related FR(s)**: `FR-USER-001`, `FR-USER-003`
- **Related OQ(s)**: `OQ-04`, `OQ-17`, `OQ-23`

**Scenario 6.1: Role Update**
- **Given** a `SUPER_ADMIN` is editing an existing user
- **When** they change the user's role and save the changes
- **Then** the system updates the user's role, and the new permissions take effect upon the user's next token refresh or login.

### `AC-USER-003` — Control Account Lifecycle
- **Related User Story**: `US-USER-003`
- **Related FR(s)**: `FR-USER-002`, `FR-AUTH-001`, `FR-AUTH-003`
- **Related OQ(s)**: `OQ-04`, `OQ-17`, `OQ-23`

**Scenario 7.1: Deactivate User**
- **Given** a `SUPER_ADMIN` is managing users
- **When** they deactivate an active user account
- **Then** the system marks the account as inactive and immediately invalidates any active sessions for that user.

## 4. Lawyer Management

### `AC-LAW-001` — Maintain Lawyer Information
- **Related User Story**: `US-LAW-001`
- **Related FR(s)**: `FR-LAW-001`, `FR-LAW-002`
- **Related OQ(s)**: `OQ-04`, `OQ-21`, `OQ-25`

**Scenario 8.1: Create Lawyer Profile**
- **Given** an authorized internal user
- **When** they submit a valid lawyer profile (name, biography, experience, and portrait image)
- **Then** the system saves the profile and makes it available for publication.

**Scenario 8.2: Publish Incomplete Profile**
- **Given** an authorized internal user is editing a lawyer profile
- **When** they attempt to publish a profile missing a required field (e.g., biography)
- **Then** the system prevents publication and highlights the missing required fields.

### `AC-LAW-002` — Browse Lawyer Expertise
- **Related User Story**: `US-LAW-002`
- **Related FR(s)**: `FR-LAW-002`, `FR-WEB-002`
- **Related OQ(s)**: `OQ-21`, `OQ-25`

**Scenario 9.1: View Published Profile**
- **Given** a Guest is browsing the public website
- **When** they navigate to a published lawyer's profile page
- **Then** they see the lawyer's portrait, full biography, experience details, and contact options.

## 5. Lead Intake & Qualification

### `AC-LEAD-001` — Request Consultation Online
- **Related User Story**: `US-LEAD-001`
- **Related FR(s)**: `FR-LEAD-001`, `FR-NOTI-001`
- **Related OQ(s)**: `OQ-06`, `OQ-09`, `OQ-12`, `OQ-20`, `OQ-24`

**Scenario 10.1: Submit Valid Lead Form**
- **Given** a Guest is on the public contact form
- **When** they submit valid contact information and case details
- **Then** the system creates a `NEW` lead with source `WEBSITE`, stores the details, and triggers a new lead notification to authorized staff.

**Scenario 10.2: Submit Incomplete Form**
- **Given** a Guest is on the public contact form
- **When** they submit the form without required fields (e.g., phone number)
- **Then** the system rejects the submission and displays validation errors indicating the missing fields.

### `AC-LEAD-002` — Review and Follow Up Lead
- **Related User Story**: `US-LEAD-002`
- **Related FR(s)**: `FR-LEAD-003`
- **Related OQ(s)**: `OQ-04`, `OQ-06`, `OQ-15`

**Scenario 11.1: Add Follow-up Note**
- **Given** an authorized user is viewing a Lead
- **When** they add a text note documenting a phone call
- **Then** the system saves the note with a timestamp and the author's identity attached to the Lead.

### `AC-LEAD-003` — Delegate Lead Responsibility
- **Related User Story**: `US-LEAD-003`
- **Related FR(s)**: `FR-LEAD-003`
- **Related OQ(s)**: `OQ-04`

**Scenario 12.1: Assign Lead**
- **Given** a `LEGAL_ASSISTANT` is viewing an unassigned Lead
- **When** they assign the Lead to a specific `LAWYER`
- **Then** the system records the assignment, and the `LAWYER` gains access to view and manage the Lead.

### `AC-LEAD-004` — Track Intake Progress
- **Related User Story**: `US-LEAD-004`
- **Related FR(s)**: `FR-LEAD-004`, `FR-CASE-001`
- **Related OQ(s)**: `OQ-04`, `OQ-05`, `OQ-15`

**Scenario 13.1: Valid Status Transition**
- **Given** an authorized user is viewing a `NEW` Lead
- **When** they update the status to `CONTACTED`
- **Then** the system saves the new status and records the change in the Lead's history.

**Scenario 13.2: Invalid Manual Conversion**
- **Given** an authorized user is viewing a Lead
- **When** they attempt to manually change the status dropdown to `CONVERTED` without using the formal Case Creation process
- **Then** the system prevents the status change and instructs the user to use the "Convert to Case" workflow.

### `AC-LEAD-005` — Centralize Off-Platform Inquiries
- **Related User Story**: `US-LEAD-005`
- **Related FR(s)**: `FR-LEAD-002`, `FR-NOTI-001`
- **Related OQ(s)**: `OQ-04`, `OQ-06`, `OQ-09`, `OQ-12`, `OQ-13`, `OQ-20`

**Scenario 14.1: Manual Lead Entry**
- **Given** a `LEGAL_ASSISTANT` is manually entering a lead
- **When** they provide contact details and select a source (e.g., `ZALO` or `HOTLINE`)
- **Then** the system creates the Lead with the selected source and a default `NEW` status.

## 6. Appointment Management

### `AC-APP-001` — Schedule Client Meeting
- **Related User Story**: `US-APP-001`
- **Related FR(s)**: `FR-APP-001`, `FR-APP-002`
- **Related OQ(s)**: `OQ-04`, `OQ-16`, `OQ-24`

**Scenario 15.1: Create Valid Appointment**
- **Given** a `LEGAL_ASSISTANT`
- **When** they schedule an `ONLINE` appointment for a specific date, time, and related Lead
- **Then** the system creates a `PENDING` appointment linked to the Lead.

**Scenario 15.2: Past Date Scheduling**
- **Given** a `LEGAL_ASSISTANT`
- **When** they attempt to schedule an appointment for a date in the past
- **Then** the system rejects the submission with a validation error.

### `AC-APP-002` — Track Meeting Execution
- **Related User Story**: `US-APP-002`
- **Related FR(s)**: `FR-APP-001`, `FR-APP-002`
- **Related OQ(s)**: `OQ-04`, `OQ-16`, `OQ-24`

**Scenario 16.1: Complete Appointment**
- **Given** a `LEGAL_ASSISTANT` is viewing a `CONFIRMED` appointment
- **When** they update the status to `COMPLETED`
- **Then** the system updates the appointment status and retains the historical record.

## 7. Case Management

### `AC-CASE-001` — Open Legal Case from Lead
- **Related User Story**: `US-CASE-001`
- **Related FR(s)**: `FR-CASE-001`, `FR-LEAD-004`
- **Related OQ(s)**: `OQ-03`, `OQ-04`, `OQ-05`, `OQ-06`

**Scenario 17.1: Successful Conversion**
- **Given** an authorized user is viewing a `QUALIFIED` Lead
- **When** they execute the "Convert to Case" action
- **Then** the system creates a new Case record migrating relevant Lead data, and atomically updates the Lead status to `CONVERTED`.

**Scenario 17.2: Convert Unqualified Lead**
- **Given** an authorized user is viewing a `NEW` Lead
- **When** they attempt to convert it to a Case
- **Then** the system rejects the action, requiring the Lead to be `QUALIFIED` first.

### `AC-CASE-002` — Maintain Case Details
- **Related User Story**: `US-CASE-002`
- **Related FR(s)**: `FR-CASE-002`, `FR-CASE-003`
- **Related OQ(s)**: `OQ-03`, `OQ-04`, `OQ-17`

**Scenario 18.1: Update Case Status**
- **Given** an assigned `LAWYER`
- **When** they update the legal status or add an activity log entry to their Case
- **Then** the system saves the update and timestamps the activity.

### `AC-CASE-003` — Allocate Legal Team
- **Related User Story**: `US-CASE-003`
- **Related FR(s)**: `FR-CASE-002`
- **Related OQ(s)**: `OQ-03`, `OQ-04`

**Scenario 19.1: Assign Additional Lawyer**
- **Given** an authorized user is managing a Case
- **When** they add a second `LAWYER` to the case team
- **Then** the system records the assignment and grants the second `LAWYER` access to view and manage the Case.

## 8. Secure Document Management

### `AC-DOC-001` — Store Private File
- **Related User Story**: `US-DOC-001`
- **Related FR(s)**: `FR-DOC-001`
- **Related OQ(s)**: `OQ-04`, `OQ-07`, `OQ-08`, `OQ-12`, `OQ-29`

**Scenario 20.1: Upload Valid Document**
- **Given** an authorized user is viewing a Case
- **When** they upload a 5MB PDF document
- **Then** the system stores the file securely (e.g. S3), generates a UUID-based reference, and links the file metadata to the Case.

**Scenario 20.2: Reject Oversized File**
- **Given** an authorized user is viewing a Case
- **When** they attempt to upload a 25MB document
- **Then** the system rejects the upload with a "File size exceeds 20MB limit" error.

**Scenario 20.3: Reject Invalid Format**
- **Given** an authorized user is viewing a Case
- **When** they attempt to upload a `.exe` file
- **Then** the system rejects the upload with an "Unsupported file format" error.

### `AC-DOC-002` — Retrieve Protected File
- **Related User Story**: `US-DOC-002`
- **Related FR(s)**: `FR-DOC-002`
- **Related OQ(s)**: `OQ-04`, `OQ-07`, `OQ-12`, `OQ-29`

**Scenario 21.1: Authorized Download**
- **Given** an assigned `LAWYER` is viewing their Case
- **When** they request to download a linked document
- **Then** the system generates a secure, temporary access link (or streams the file securely) and logs the access.

**Scenario 21.2: Unauthorized Download Attempt**
- **Given** a `LAWYER` not assigned to a specific Case
- **When** they attempt to access a document linked to that Case directly via URL
- **Then** the system denies access with a 403 Forbidden error.

### `AC-DOC-003` — Apply Document Retention Policy
- **Related User Story**: `US-DOC-003`
- **Related FR(s)**: `FR-DOC-003`, `FR-DOC-001`, `FR-AUDIT-001`
- **Related OQ(s)**: `OQ-04`, `OQ-07`, `OQ-08`, `OQ-12`, `OQ-17`

**Scenario 22.1: Delete Document Manually**
- **Given** an authorized user with deletion privileges
- **When** they delete a document attached to a Case
- **Then** the system marks the document record as deleted (soft delete) or removes it per policy, and logs the action in the audit log.

## 9. Content Management

### `AC-CMS-001` — Publish Legal Insights
- **Related User Story**: `US-CMS-001`
- **Related FR(s)**: `FR-CMS-002`, `FR-SEO-001`
- **Related OQ(s)**: `OQ-04`, `OQ-21`, `OQ-25`

**Scenario 23.1: Create and Publish Blog Post**
- **Given** a `CONTENT_CREATOR`
- **When** they draft a blog post and mark it as published
- **Then** the system saves the article and makes it immediately available on the public website.

### `AC-CMS-002` — Publish Firm Successes
- **Related User Story**: `US-CMS-002`
- **Related FR(s)**: `FR-CMS-003`, `FR-AUDIT-001`
- **Related OQ(s)**: `OQ-04`, `OQ-12`, `OQ-14`, `OQ-21`, `OQ-25`

**Scenario 24.1: Publish Case Study**
- **Given** a `CONTENT_CREATOR`
- **When** they submit a finalized Case Study
- **Then** the system publishes the Case Study ensuring it is physically segregated from operational Case data.

### `AC-CMS-003` — Update Public Offerings
- **Related User Story**: `US-CMS-003`
- **Related FR(s)**: `FR-CMS-001`, `FR-SEO-001`
- **Related OQ(s)**: `OQ-04`, `OQ-21`, `OQ-25`

**Scenario 25.1: Update Service Description**
- **Given** a `CONTENT_CREATOR`
- **When** they modify the description of an existing legal service and save
- **Then** the updated description is reflected on the public Services page.

## 10. SEO Management

### `AC-SEO-001` — Optimize Content for Search
- **Related User Story**: `US-SEO-001`
- **Related FR(s)**: `FR-SEO-001`
- **Related OQ(s)**: `OQ-04`, `OQ-21`, `OQ-25`, `OQ-35`

**Scenario 26.1: Define Metadata**
- **Given** a `CONTENT_CREATOR` editing a Blog Post
- **When** they input custom Meta Title and Meta Description
- **Then** the system saves the SEO overrides for that specific content entity.

### `AC-SEO-002` — Provide Structured Data
- **Related User Story**: `US-SEO-002`
- **Related FR(s)**: `FR-SEO-001`, `FR-SEO-002`, `FR-WEB-002`
- **Related OQ(s)**: `OQ-21`, `OQ-25`, `OQ-35`

**Scenario 27.1: Render SEO Tags**
- **Given** a Guest views a published Blog Post
- **When** the page loads
- **Then** the HTML `<head>` contains the exact Meta Title, Description, and generated JSON-LD structured data.

## 11. Public Website Experience

### `AC-WEB-001` — Navigate Firm Information
- **Related User Story**: `US-WEB-001`
- **Related FR(s)**: `FR-WEB-001`, `FR-WEB-002`, `FR-WEB-003`
- **Related OQ(s)**: `OQ-21`, `OQ-25`, `OQ-27`, `OQ-28`, `OQ-34`

**Scenario 28.1: Mobile Navigation**
- **Given** a Guest on a mobile device
- **When** they visit the Home page
- **Then** the layout adjusts responsively and they can access the mobile navigation menu to reach Services, Lawyers, Blog, and Contact pages.

### `AC-WEB-002` — Learn About Litigation Process
- **Related User Story**: `US-WEB-002`
- **Related FR(s)**: `FR-WEB-001`, `FR-WEB-002`, `FR-WEB-004`, `FR-CMS-001`
- **Related OQ(s)**: `OQ-21`, `OQ-25`

**Scenario 29.1: View Service Details**
- **Given** a Guest clicks on a specific Service from the list
- **When** the Service detail page loads
- **Then** they see the full service description and any related Case Studies or Lawyers.

### `AC-WEB-003` — Browse Legal Team
- **Related User Story**: `US-WEB-003`
- **Related FR(s)**: `FR-WEB-002`, `FR-WEB-004`, `FR-LAW-002`
- **Related OQ(s)**: `OQ-21`, `OQ-25`

**Scenario 30.1: View Lawyers Directory**
- **Given** a Guest navigates to the Lawyers page
- **When** the page loads
- **Then** they see a grid/list of all published lawyer profiles.

### `AC-WEB-004` — Access Contact Options
- **Related User Story**: `US-WEB-004`
- **Related FR(s)**: `FR-WEB-003`, `FR-LEAD-001`
- **Related OQ(s)**: `OQ-13`, `OQ-18`, `OQ-20`, `OQ-24`, `OQ-25`

**Scenario 31.1: Click Contact Channel**
- **Given** a Guest views the public website
- **When** they click the Zalo or Facebook Messenger floating buttons
- **Then** they are correctly redirected to the firm's respective social messaging profiles.

## 12. Dashboard & Reporting

### `AC-DASH-001` — Review Operational Performance
- **Related User Story**: `US-DASH-001`
- **Related FR(s)**: `FR-DASH-001`
- **Related OQ(s)**: `OQ-04`, `OQ-22`

**Scenario 32.1: Dashboard Data Loading**
- **Given** a `SUPER_ADMIN` logs in
- **When** they navigate to the Dashboard
- **Then** the system displays aggregated metrics (e.g., total active leads, open cases) accurately reflecting the current database state.

## 13. Notification

### `AC-NOTI-001` — Get Real-time Lead Alerts
- **Related User Story**: `US-NOTI-001`
- **Related FR(s)**: `FR-NOTI-001`, `FR-LEAD-001`, `FR-LEAD-002`
- **Related OQ(s)**: `OQ-04`, `OQ-09`, `OQ-13`

**Scenario 33.1: Real-time Lead Reception**
- **Given** a `LEGAL_ASSISTANT` is logged in and viewing the management portal
- **When** a new Lead is submitted via the public website
- **Then** the assistant receives a real-time (WebSocket) notification indicator immediately.

## 14. Audit & Governance

### `AC-AUDIT-001` — Log Sensitive Actions
- **Related User Story**: `US-AUDIT-001`
- **Related FR(s)**: `FR-AUDIT-001`
- **Related OQ(s)**: `OQ-04`, `OQ-07`, `OQ-17`

**Scenario 34.1: Record Document Deletion**
- **Given** an authorized user deletes a document
- **When** the deletion transaction completes
- **Then** the system automatically writes an immutable log entry detailing the actor's user ID, the timestamp, the action type (DELETE), and the target document ID.

### `AC-AUDIT-002` — Review System Activity
- **Related User Story**: `US-AUDIT-002`
- **Related FR(s)**: `FR-AUDIT-002`
- **Related OQ(s)**: `OQ-04`, `OQ-07`, `OQ-17`

**Scenario 35.1: View Audit Trail**
- **Given** a `SUPER_ADMIN`
- **When** they navigate to the Audit Log section
- **Then** they can view a chronological list of all logged system events.
