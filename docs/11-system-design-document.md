# System Design Document (SDD)

## Document Control

| Field               | Value                                                         |
| ------------------- | ------------------------------------------------------------- |
| Project             | Law Firm Website & Management System                          |
| Document            | System Design Document                                        |
| Document ID         | `SDD-11`                                                      |
| Version             | 1.0                                                           |
| Status              | Complete and validated baseline                               |
| Effective date      | 2026-08-12                                                    |
| Business authority  | [01-brd.md](01-brd.md)                                         |
| Functional baseline | [02-frs.md](02-frs.md)                                         |
| API baseline        | [10-openapi.yaml](10-openapi.yaml)                             |
| Database baseline   | [09-database-dictionary.md](09-database-dictionary.md)         |
| Decision register   | [assumptions-open-questions.md](assumptions-open-questions.md) |

## Record of Changes

| Date       | Change type | In charge | Description                                           |
| ---------- | ----------- | --------- | ----------------------------------------------------- |
| 2026-08-12 | Added       | AI Agent  | Consolidated system design based on Phase 1 artifacts.|

---

## 1. Introduction
This System Design Document (SDD) provides the comprehensive architectural and technical specifications for the Law Firm Website & Management System. It translates the verified business, functional, and non-functional requirements into a concrete technical blueprint.

## 2. Goals
- Deliver a secure, highly available platform for managing legal cases and public web presence.
- Ensure strict segregation of public content from confidential legal data.
- Provide a robust RESTful API to decouple frontend rendering from backend business logic.
- Establish an architecture that can gracefully expand into B2B offerings in the future.

## 3. Scope
**In Scope (Phase 1):**
- B2C Public Website (Next.js)
- Internal Management Dashboard (Next.js)
- Backend REST API (Spring Boot)
- Database (MySQL)
- Document Storage (S3 / MinIO)
- Real-time Notifications (WebSocket)

**Out of Scope (Phase 1):**
- Client portal for case tracking
- Payment gateway integration
- Advanced custom reporting builder

## 4. Architecture Overview
The system follows a standard three-tier architecture utilizing modern decoupling. The presentation layer is separated from the business logic layer via a REST API, and state is persisted in a relational database and object storage.

## 5. System Context
- **Users**: Guest (Public Visitor), internal staff (`SUPER_ADMIN`, `LAWYER`, `LEGAL_ASSISTANT`, `CONTENT_CREATOR`).
- **Frontend App**: Next.js (SSR for public SEO, CSR for dashboard).
- **Backend App**: Spring Boot 3.x (Java 17+).
- **Database**: MySQL 8.0+.
- **Storage**: AWS S3 (or MinIO for local/on-premise).

## 6. Logical Architecture
1. **Presentation Layer**: Next.js handles routing, view rendering, and state management.
2. **API Gateway / Load Balancer**: (TBD based on deployment) routes traffic, handles TLS termination.
3. **Application Layer**: Spring Boot REST Controllers, Services (Business Logic), Repositories (Data Access).
4. **Data Layer**: MySQL Database and S3 Object Storage.

## 7. Component Architecture
- **Auth Component**: Manages JWT lifecycle and BCrypt hashing.
- **Lead Component**: Intake, tracking, assignment.
- **Case Component**: Case lifecycle, lawyer assignment, activity logging.
- **CMS Component**: Public services, blogs, lawyer profiles.
- **Notification Component**: WebSocket management.
- **Audit Component**: Immutable event logging.

## 8. Frontend Architecture
- **Framework**: Next.js (React).
- **Public Site**: Employs Static Site Generation (SSG) and Server-Side Rendering (SSR) to maximize SEO (`NFR-SEO-001`).
- **Admin Dashboard**: Employs Client-Side Rendering (CSR) protected by route guards.
- **State Management**: React Context or Redux Toolkit (TBD).
- **Styling**: Tailwind CSS (Proposed).

## 9. Backend Architecture
- **Framework**: Spring Boot (Spring Web, Spring Security, Spring Data JPA).
- **Design Pattern**: Controller-Service-Repository pattern.
- **Real-time**: Spring WebSocket with STOMP.
- **Security**: Spring Security filter chains for JWT validation.

## 10. Database Architecture
- **RDBMS**: MySQL.
- **ORM**: Hibernate (via Spring Data JPA).
- **Migrations**: Flyway or Liquibase (Proposed) to manage schema changes securely.
- **Design**: 3NF normalized, utilizing UUIDs for primary keys to prevent enumeration (`NFR-SEC-002`). Soft deletion implemented for sensitive records.

## 11. API Architecture
- **Style**: RESTful JSON over HTTPS.
- **Base Path**: `/api/v1`
- **Contract**: Defined strictly in `10-openapi.yaml`.
- **Response Format**: Standardized `ErrorResponse` for 4xx/5xx errors.

## 12. Authentication
- **Mechanism**: JSON Web Tokens (JWT).
- **Flow**: User submits credentials -> Backend validates -> Returns short-lived Access Token and long-lived Refresh Token.
- **Storage**: Access Token in memory/Closure, Refresh Token in `HttpOnly` secure cookie (Proposed).

## 13. Authorization / RBAC
- **Method**: Role-Based Access Control (RBAC) enforced at API endpoints using `@PreAuthorize`.
- **Data Scope**: Record-level security applied in the Service layer (e.g., verifying a lawyer is assigned to a case before returning document links).

## 14. Lead Management Architecture
- **Intake**: Public API endpoint accepts JSON, validates, and stores.
- **Status Machine**: `NEW` -> `CONTACTED` -> `QUALIFIED` / `LOST` -> `CONVERTED`.
- **Conversion**: Atomic transaction converting a Lead to a Case, ensuring no data inconsistency.

## 15. Appointment Architecture
- **Entity**: Links to either Lead (pre-conversion) or Case (post-conversion).
- **Timezones**: All times stored in UTC, converted to local time on the frontend.

## 16. Case Management Architecture
- **Access**: Strictly limited to assigned `LAWYER`s and `SUPER_ADMIN` / `LEGAL_ASSISTANT`.
- **History**: `case_activities` table tracks all status changes and lawyer notes.

## 17. Document Storage Architecture
- **Storage**: S3 or MinIO.
- **Security**: Files are strictly private. The frontend requests a short-lived pre-signed URL from the backend to download files (`US-DOC-002`).
- **Metadata**: File size, mime-type, and S3 key stored in MySQL `documents` table.

## 18. CMS Architecture
- **Content**: Blogs, Case Studies, Services, Lawyer Profiles.
- **Workflow**: Draft -> Published.
- **Segregation**: Case Studies must not contain links to operational Cases to protect client privacy (`AS-02`).

## 19. SEO Architecture
- **Implementation**: Next.js `next/head` and App Router metadata API.
- **Data**: `seo_metadata` table provides overriding Title and Description for CMS entities.
- **Structured Data**: JSON-LD injected server-side for public pages (`US-SEO-002`).

## 20. Notification Architecture
- **Protocol**: WebSocket (WSS).
- **Trigger**: Application events (e.g., Lead creation) publish to an internal message broker or directly to subscribed WebSocket sessions.

## 21. Audit Logging
- **Strategy**: Synchronous or asynchronous logging of sensitive POST/PUT/PATCH/DELETE actions.
- **Storage**: `audit_logs` table (Insert-only). Captures User ID, Action, Entity, and IP.

## 22. Application Logging
- **Standard**: SLF4J with Logback in Spring Boot.
- **Output**: JSON formatted logs to stdout for aggregation (e.g., ELK stack or Datadog).

## 23. Error Handling
- **Backend**: `@ControllerAdvice` to catch exceptions globally and return unified JSON error responses. Do not leak stack traces in production.
- **Frontend**: Error boundaries and user-friendly fallback UI.

## 24. Security Design
- **Transport**: TLS 1.2+ mandatory for all connections.
- **Data**: Passwords hashed with BCrypt.
- **Vulnerabilities**: Spring Security mitigates CSRF, XSS (via headers), and SQL Injection (via JPA parameter binding). Rate limiting applied to public endpoints (`NFR-SEC-002`).

## 25. Privacy / Data Protection
- Sensitive fields (e.g., Lead issue descriptions, Case notes) are strictly authorization-gated.
- Soft deletes ensure data can be recovered or permanently scrubbed per legal retention policies (`OQ-07`, `OQ-08`).

## 26. Performance Strategy
- **Frontend**: SSG/SSR for fast First Contentful Paint (FCP) on public pages.
- **Backend**: Connection pooling (HikariCP), pagination on all list endpoints.
- **Database**: Indexes on frequently queried columns (`status`, `assigned_to`, `deleted_at`).

## 27. Caching Strategy
- **Public Content**: Next.js ISR (Incremental Static Regeneration) for blogs and services (Proposed).
- **API**: HTTP Cache-Control headers for static assets. No aggressive caching on private API routes yet.

## 28. Backup & Recovery
- **Database**: Automated daily snapshots (e.g., AWS RDS).
- **Storage**: S3 versioning enabled.
- **RTO/RPO**: TBD based on final infrastructure SLAs.

## 29. Monitoring & Observability
- **Metrics**: Spring Boot Actuator exposing Prometheus metrics (Proposed).
- **Health Checks**: `/actuator/health` configured for load balancer probes.

## 30. Deployment Architecture
- **Containers**: Dockerized Spring Boot and Next.js apps.
- **Orchestration**: Kubernetes, AWS ECS, or Docker Compose (TBD based on firm budget).

## 31. Environment Configuration
- `development`: Local developer machines.
- `staging`: QA and client review.
- `production`: Live system.
- Configuration injected via Environment Variables (`application.yml` profiles).

## 32. Frontend Folder Structure (Proposed)
```text
/src
  /app (Next.js App Router)
  /components (Shared UI)
  /lib (API clients, utilities)
  /hooks (React hooks)
  /types (TypeScript definitions)
```

## 33. Backend Folder Structure (Proposed)
```text
/src/main/java/com/lawfirm
  /config (Security, WebSocket)
  /controllers (REST Endpoints)
  /services (Business Logic)
  /repositories (Data Access)
  /models (JPA Entities)
  /dtos (Data Transfer Objects)
  /exceptions (Global Handlers)
```

## 34. Coding Conventions
- **Frontend**: TypeScript strict mode, ESLint, Prettier.
- **Backend**: Java standard conventions, Checkstyle, immutability where possible, final variables.

## 35. Testing Strategy
- **Unit Testing**: JUnit 5 + Mockito for Backend; Jest + React Testing Library for Frontend.
- **Integration Testing**: Testcontainers for database integration tests.
- **E2E Testing**: Cypress or Playwright (Proposed for Phase 2).

## 36. CI/CD Strategy (Proposed)
- **CI**: GitHub Actions to run tests and build Docker images on PR.
- **CD**: Automated deployment to Staging on merge to `main`. Manual approval for Production.

## 37. Technical Risks
- **Data Leakage**: Improper implementation of Record-Level Access Control could expose Case data. Mitigated by rigorous unit testing of service-layer authorization.
- **WebSocket Scaling**: Stateful WebSockets can complicate load balancing. Mitigated by keeping notification payloads small and non-critical.

## 38. Assumptions
- See `assumptions-open-questions.md` (`AS-01` to `AS-04`).

## 39. Open Questions
- Unresolved technical decisions depend on business feedback: `OQ-04`, `OQ-07`, `OQ-08`, `OQ-16`, `OQ-23`.

## 40. Future Extensions
- Extension to B2B architecture (Corporate accounts, multi-user client portals).
- Integration with third-party billing/invoicing systems.
- Advanced document search (Elasticsearch).
