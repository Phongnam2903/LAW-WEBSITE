# System UML Diagrams

## Document Control

| Field               | Value                                                         |
| ------------------- | ------------------------------------------------------------- |
| Project             | Law Firm Website & Management System                          |
| Document            | UML Diagrams                                                  |
| Document ID         | `UML-07`                                                      |
| Version             | 1.0                                                           |
| Status              | Complete and validated baseline                               |
| Effective date      | 2026-08-12                                                    |
| Business authority  | [01-brd.md](01-brd.md)                                         |
| Functional baseline | [02-frs.md](02-frs.md)                                         |
| Use Case baseline   | [04-use-case-specification.md](04-use-case-specification.md)   |
| Decision register   | [assumptions-open-questions.md](assumptions-open-questions.md) |

## Record of Changes

| Date       | Change type | In charge | Description                                                           |
| ---------- | ----------- | --------- | --------------------------------------------------------------------- |
| 2026-08-12 | Added       | AI Agent  | Created initial UML diagrams covering Use Cases, Activity, Sequence, and Domain. |

## 1. System / Actor Use Case View

```mermaid
usecaseDiagram
    actor "Guest / Public Visitor" as Guest
    actor "SUPER_ADMIN" as Admin
    actor "LAWYER" as Lawyer
    actor "LEGAL_ASSISTANT" as Assistant
    actor "CONTENT_CREATOR" as Creator

    package "Law Firm Website & Management System" {
        usecase "Browse Website" as UC_WEB
        usecase "Submit Lead" as UC_LEAD_SUBMIT
        usecase "View Lawyer Profile" as UC_LAW_PUB
        
        usecase "Manage Lead" as UC_LEAD_MANAGE
        usecase "Convert to Case" as UC_CASE_CONV
        usecase "Manage Case" as UC_CASE_MANAGE
        
        usecase "Schedule Appointment" as UC_APP
        
        usecase "Manage Users" as UC_USER
        
        usecase "Manage Content" as UC_CMS
        usecase "Manage SEO" as UC_SEO
        
        usecase "Upload/View Document" as UC_DOC
    }

    Guest --> UC_WEB
    Guest --> UC_LEAD_SUBMIT
    Guest --> UC_LAW_PUB
    
    Assistant --> UC_LEAD_MANAGE
    Assistant --> UC_APP
    
    Lawyer --> UC_CASE_MANAGE
    Lawyer --> UC_DOC
    Assistant --> UC_DOC
    Lawyer --> UC_LEAD_MANAGE
    
    Admin --> UC_USER
    
    Creator --> UC_CMS
    Creator --> UC_SEO
    
    Assistant --> UC_CASE_CONV
    Lawyer --> UC_CASE_CONV
```

## 2. Activity Diagrams

### 2.1 Lead Intake & Qualification

```mermaid
stateDiagram-v2
    [*] --> Form_Submitted: Guest Submits Form
    Form_Submitted --> Lead_Created: System records NEW Lead
    Lead_Created --> Notification_Sent: WebSocket Alert
    Notification_Sent --> Under_Review: Assistant views Lead
    
    Under_Review --> Assigned: Assistant assigns Lawyer
    Assigned --> Contacted: Assistant/Lawyer calls Lead
    
    Contacted --> Qualified: Lead meets criteria
    Contacted --> Lost: Lead not interested/qualified
    
    Qualified --> Case_Converted: Lawyer/Assistant Converts
    Case_Converted --> [*]
    Lost --> [*]
```

### 2.2 Document Upload & Secure Access

```mermaid
stateDiagram-v2
    [*] --> Upload_Requested: Staff selects file
    Upload_Requested --> Validation: System checks size/format
    
    Validation --> Upload_Failed: Invalid file
    Upload_Failed --> [*]
    
    Validation --> Upload_Success: Valid file
    Upload_Success --> Storage: Save to S3 (UUID)
    Storage --> Metadata_Saved: Link to Case/Lead
    
    Metadata_Saved --> View_Requested: Staff clicks document
    View_Requested --> AuthCheck: Verify Record-Scope Access
    
    AuthCheck --> Denied: Unauthorized
    Denied --> [*]
    
    AuthCheck --> Approved: Authorized
    Approved --> DownloadLink: Generate Signed URL
    DownloadLink --> [*]
```

## 3. Sequence Diagrams

### 3.1 Submit Lead & Notification

```mermaid
sequenceDiagram
    actor Guest
    participant Frontend
    participant API as Backend API
    participant DB as MySQL
    participant WS as WebSocket Server
    actor Assistant as LEGAL_ASSISTANT

    Guest->>Frontend: Fills and submits Contact Form
    Frontend->>API: POST /api/v1/leads (payload)
    API->>API: Validate input and rate limits
    API->>DB: Insert new Lead (Status: NEW)
    DB-->>API: Lead ID
    API->>WS: Publish "New Lead" event
    WS-->>Assistant: Push real-time notification
    API-->>Frontend: 201 Created (Success message)
    Frontend-->>Guest: Show confirmation screen
```

### 3.2 Convert Lead to Case

```mermaid
sequenceDiagram
    actor User as Authorized User
    participant Frontend
    participant API as Backend API
    participant DB as MySQL

    User->>Frontend: Clicks "Convert to Case" on Qualified Lead
    Frontend->>API: POST /api/v1/cases (fromLeadId)
    API->>DB: Check Lead Status == QUALIFIED
    DB-->>API: Lead valid
    API->>DB: Insert new Case (mapping Lead details)
    API->>DB: Update Lead Status to CONVERTED
    API->>DB: Insert Audit Log entry
    DB-->>API: Transaction success, Case ID
    API-->>Frontend: 201 Created (Case details)
    Frontend-->>User: Redirect to Case view
```

### 3.3 Secure Document Access

```mermaid
sequenceDiagram
    actor Lawyer as Assigned LAWYER
    participant Frontend
    participant API as Backend API
    participant DB as MySQL
    participant S3 as Object Storage (MinIO/S3)

    Lawyer->>Frontend: Clicks to download Case Document
    Frontend->>API: GET /api/v1/documents/{id}/download
    API->>DB: Fetch Document metadata and Case ID
    DB-->>API: Document info
    API->>API: Verify Lawyer is assigned to Case
    API->>S3: Request pre-signed URL for object key
    S3-->>API: Pre-signed URL
    API->>DB: Log Audit Event (Document Accessed)
    API-->>Frontend: 200 OK (URL)
    Frontend->>S3: Download file using URL
    S3-->>Lawyer: File transfer
```

## 4. Domain / Class Diagram

```mermaid
classDiagram
    class User {
        +UUID id
        +String email
        +String passwordHash
        +String role
        +Boolean isActive
        +DateTime createdAt
    }

    class LawyerProfile {
        +UUID id
        +String name
        +String biography
        +String experience
        +String portraitUrl
        +Boolean isPublished
    }

    class Lead {
        +UUID id
        +String fullName
        +String email
        +String phone
        +String issueDescription
        +String source
        +String status
        +DateTime createdAt
    }

    class Case {
        +UUID id
        +String title
        +String description
        +String status
        +DateTime openedAt
        +DateTime closedAt
    }

    class Appointment {
        +UUID id
        +String type
        +DateTime scheduledAt
        +String status
        +String locationOrLink
    }

    class Document {
        +UUID id
        +String originalName
        +String storageKey
        +String mimeType
        +Long sizeBytes
        +DateTime uploadedAt
    }

    class AuditLog {
        +UUID id
        +String action
        +String entityType
        +String entityId
        +String ipAddress
        +DateTime timestamp
    }

    class Blog {
        +UUID id
        +String title
        +String content
        +String slug
        +Boolean isPublished
    }

    class Service {
        +UUID id
        +String title
        +String description
        +String slug
    }

    class CaseStudy {
        +UUID id
        +String title
        +String challenges
        +String outcomes
    }

    class SeoMetadata {
        +UUID id
        +String targetType
        +UUID targetId
        +String metaTitle
        +String metaDescription
    }

    class Notification {
        +UUID id
        +String type
        +String message
        +Boolean isRead
        +DateTime createdAt
    }

    User "1" -- "0..1" LawyerProfile : has
    Lead "1" -- "0..1" Case : converts to
    User "1" -- "0..*" Lead : assigned to
    User "1" -- "0..*" Case : assigned to (via case_lawyers)
    Case "1" -- "0..*" Document : contains
    Lead "1" -- "0..*" Document : contains
    Case "1" -- "0..*" Appointment : has
    Lead "1" -- "0..*" Appointment : has
    User "1" -- "0..*" AuditLog : triggers
    User "1" -- "0..*" Notification : receives
    Blog "1" -- "0..1" SeoMetadata : has
    Service "1" -- "0..1" SeoMetadata : has
    CaseStudy "1" -- "0..1" SeoMetadata : has
```
