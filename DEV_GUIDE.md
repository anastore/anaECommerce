# AnaECommerce Developer Guide

This document provides a comprehensive, developer-focused reference for new contributors. It is intended to stay in sync with the codebase. For exact version numbers, refer to the respective project files (csproj, package.json, etc.).

---

## Tech Snapshot
- Backend: .NET 8 (target net8.0), ASP.NET Core 8.x, EF Core 8.x, SQL Server, JWT Bearer + ASP.NET Identity, Swagger (Swashbuckle), AutoMapper, Repository + Unit of Work
- Frontend: Angular (latest major version used by the repo), TypeScript, RxJS, HttpClient
- Build & Tools: Git, Docker (optional), npm/yarn, dotnet CLI, OpenAPI/Swagger tooling
- Docs: Backend/OpenAPI.yaml and Backend/Docs/API.md serve as the API contract and human-readable reference

> Exact versions are defined in the project files. Update this section after cloning by inspecting package.json and csproj files.

---

## Architecture & Design
- Layered architecture: API (Controllers) -> Services -> Repositories -> Data (EF Core) -> Entities
- Design patterns: Repository, Unit of Work, DTOs, AutoMapper, Dependency Injection
- API documentation: Swagger/OpenAPI contract and human-readable docs
- Authorization: Role-based access (Admin, Manager, Client) with JWT Bearer authentication
- Cross-cutting: Validation, centralized error handling, pagination wrappers

---

## Backend Overview

### Folder Structure
- Backend/
  - Controllers/: API endpoints (Auth, Users, Profile, Products, Categories, SubCategories, Brands, Orders, Roles, Upload, Seed)
  - DTOs/: API contracts for requests/responses
  - Services/: Business logic implementations and interfaces
  - Repositories/: Data access abstractions and implementations
  - Data/: EF Core context (ApplicationDbContext.cs) and migrations
  - Mappings/: AutoMapper profiles
  - Config/: JWT, Swagger, CORS and other services configuration
  - Tests/: Unit/integration tests
  - OpenAPI.yaml: machine-readable API contract
  - Docs/API.md: human-readable API documentation

### Key Technologies & Roles
- .NET 8 / C# 10+ for API development
- EF Core 8.x for data access
- ASP.NET Core Identity + JWT for authentication
- Swagger/OpenAPI for API docs
- AutoMapper for DTO mapping
- Repository + Unit of Work for data access patterns
- SQL Server as the database
- OpenAPI.yaml and API.md as the source of truth for API contracts

---

## Frontend Overview

- Framework: Angular (current major version in use by the repo)
- Language: TypeScript
- State & HTTP: RxJS, HttpClient
- Interceptors: JWT auth, global error handling
- Service layer mirrors backend API endpoints
- Environments: src/environments for dev/prod base URLs

---

## API Documentation
- Machine-readable: Backend/OpenAPI.yaml
- Human-readable: Backend/Docs/API.md
- Swagger UI: available at /swagger in both dev and prod
- Updating: Keep OpenAPI.yaml in sync with DTOs and endpoints; update API.md with endpoint-level details if needed

---

## Security Model
- JWT Bearer tokens issued on login/registration
- Role-based authorization: Admin, Manager, Client
- Password hashing via ASP.NET Core Identity
- CORS policy: AllowAngular to permit Angular frontend

---

## Data Access & Migrations
- EF Core 8.x with SQL Server
- Migrations: dotnet ef migrations add <Name> and dotnet ef database update
- Seeding: Seed endpoints and/or EF seeding strategies

---

## Build, Run & Migration
- Prereqs: .NET 8 SDK, Node.js for frontend, SQL Server
- Backend:
  - cd Backend
  - dotnet restore
  - dotnet build
  - dotnet run
- Frontend:
  - cd Frontend
  - npm ci
  - npm run start
- Migrations: dotnet ef migrations add and dotnet ef database update

---

## Testing Strategy
- Backend: xUnit/NUnit tests; EF Core in-memory or SQLite for tests
- Frontend: Jasmine/Karma or Jest (as configured)

---

## CI/CD & Deployment
- CI: Build, test, and lint; generate API contract artifacts
- CD: Deploy backend to target environments; manage secrets via CI secrets
- OpenAPI contract must be consistent with code changes

---

## Coding Standards & Documentation
- Follow existing C# and TypeScript conventions in the repo
- Use XML/inline comments and update API docs when changes are made
- Keep DEV_GUIDE.md and OpenAPI.yaml in sync

---

## Updating This Guide
- Update the Tech Snapshot after changing dependencies
- Refresh architecture diagrams if folder structure changes
- Regenerate OpenAPI.yaml when DTOs/endpoints change
- Update API.md with new endpoints and examples
- Commit with clear messages; include docs changes in PRs

---

## Quick References
- OpenAPI contract: Backend/OpenAPI.yaml
- Human API reference: Backend/Docs/API.md
- Backend code: Backend/
- Frontend code: Frontend/

If you want me to tailor this guide to your exact versions, share your csproj and package.json files and I’ll refresh this document with precise numbers.
