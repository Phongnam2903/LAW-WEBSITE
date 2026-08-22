# Law Firm Website & Management System

A public marketing site plus an internal case/lead/appointment management back office for a law firm.

- **Frontend**: [`frontend/`](frontend/) — Next.js, TypeScript, Tailwind CSS
- **Backend**: [`backend/`](backend/) — Spring Boot, Spring Security, Spring Data JPA, MySQL
- **Infra**: [`infra/`](infra/) — local development infrastructure (MySQL, MinIO)

## Documentation

- [`docs/README.md`](docs/README.md) — Phase 1 (Business Analysis & System Design) index
- [`docs/ui/README.md`](docs/ui/README.md) — Phase 2 (UI/UX Design & Frontend Planning) index
- [`docs/technical-foundation/README.md`](docs/technical-foundation/README.md) — Phase 3 (Technical Foundation & Application Bootstrapping) index, current progress tracker

## Project Status

Phase 1 — Business Analysis & System Design: Completed
Phase 2 — UI/UX Design & Frontend Planning: Completed
Phase 3 — Technical Foundation & Application Bootstrapping: Completed (see [`docs/technical-foundation/README.md`](docs/technical-foundation/README.md))

## Getting Started

Requires Docker Desktop running. Java/Maven are optional — the backend can run entirely through Docker if you don't have a local JDK.

### 1. Start infrastructure (MySQL + MinIO)

```powershell
docker compose up -d mysql minio minio-init
```

MySQL is published on host port **3307** (not 3306), to avoid clashing with any MySQL you may already have running locally. MinIO API is on 9000, console on 9001.

### 2. Run the backend

With a local JDK 17 installed:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Without a local JDK (via Docker):

```powershell
docker run --rm `
  --add-host=host.docker.internal:host-gateway `
  -v "${PWD}\backend:/app" -v maven-repo-cache:/root/.m2 -w /app `
  -e DB_HOST=host.docker.internal -e DB_PORT=3307 -e DB_NAME=lawfirm -e DB_USERNAME=lawfirm -e DB_PASSWORD=lawfirm `
  -e STORAGE_ENDPOINT=http://host.docker.internal:9000 -e STORAGE_ACCESS_KEY=minioadmin -e STORAGE_SECRET_KEY=minioadmin -e STORAGE_BUCKET=lawfirm-documents `
  -p 8080:8080 -p 8081:8081 `
  eclipse-temurin:17-jdk sh -c "chmod +x mvnw; ./mvnw spring-boot:run"
```

Or run everything (MySQL + MinIO + backend + frontend) containerized in one shot:

```powershell
docker compose --profile full up --build
```

Verify it's up:

```powershell
curl.exe http://localhost:8081/actuator/health
```

Expected: `{"status":"UP",...}`. The API itself lives under `http://localhost:8080/api/v1/...` (no business endpoints exist yet — see Phase 3 scope below).

### 3. Run the frontend

```powershell
cd frontend
copy .env.example .env.local
npm install
npm run dev
```

Opens at `http://localhost:3000`.

### Stopping / resetting

```powershell
docker compose down       # stop, keep data
docker compose down -v    # stop and wipe MySQL/MinIO data (fresh start next time)
```

### More detail

- [`docs/technical-foundation/04-frontend-foundation.md`](docs/technical-foundation/04-frontend-foundation.md)
- [`docs/technical-foundation/05-backend-foundation.md`](docs/technical-foundation/05-backend-foundation.md)
- [`docs/technical-foundation/08-docker-development.md`](docs/technical-foundation/08-docker-development.md)
- [`docs/technical-foundation/09-environment-configuration.md`](docs/technical-foundation/09-environment-configuration.md)
