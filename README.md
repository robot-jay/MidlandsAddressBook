# Midlands Address Book

A simple full-stack address book application built as part of the Midlands Testing coding exercise.

# Live Demo

Frontend:
[https://ambitious-wave-0781da110.7.azurestaticapps.net](https://ambitious-wave-0781da110.7.azurestaticapps.net/)

Backend:
[https://midlandsaddressbookbackend-bhanfjdscpbcdcch.canadacentral-01.azurewebsites.net](midlandsaddressbookbackend-bhanfjdscpbcdcch.canadacentral-01.azurewebsites.net/)

## Overview

This application allows users to:

* View contacts
* Add new contacts
* Edit existing contacts
* Delete contacts

The solution consists of a Vue frontend, a Fastify REST API backend, and SQLite for data persistence.

## Technology Stack

### Frontend

* Vue 3
* TypeScript
* Axios
* Vite

### Backend

* Fastify
* TypeScript
* SQLite
* better-sqlite3

### Hosting

* Azure Static Web Apps (Frontend)
* Azure App Service (Backend)

## Architecture

The backend follows a layered architecture:

```text
Routes
  ↓
Services
  ↓
Repositories
  ↓
SQLite Database
```

This separation keeps HTTP concerns, business logic, and data access concerns independent and makes the persistence layer easy to replace in the future.

## Assumptions

The exercise requirements did not specify authentication or authorization, so all contact management operations are available without login.

SQLite was selected to keep setup and deployment simple. For a production system, I would likely use Azure SQL, PostgreSQL, or MySQL.

## Running Locally

### Prerequisites

* Node.js 22+
* npm

### Backend

```bash
cd backend

npm install
npm run build
npm run seed
npm run dev
```

The backend will start on:

```text
http://localhost:3000
```

### Frontend

```bash
cd frontend

npm install
npm run dev
```

The frontend will start on:

```text
http://localhost:5173
```

## API Endpoints

### Get Contacts

```http
GET /contacts
```

### Create Contact

```http
POST /contacts
```

### Update Contact

```http
PUT /contacts/{id}
```

### Delete Contact

```http
DELETE /contacts/{id}
```

Interactive API documentation is available through Swagger:

```text
http://localhost:3000/docs
```

## Validation

Request validation is performed using Fastify schema validation.

Examples include:

* Required fields
* State length validation
* Zip code validation
* Route parameter validation

## Development Approach

I approached the solution incrementally:

1. Establish database connectivity
2. Implement repository and service layers
3. Build and validate REST endpoints
4. Add Swagger documentation
5. Create Vue frontend
6. Integrate frontend with API
7. Deploy to Azure

This allowed each layer to be tested independently before moving to the next.

## Security Considerations

This application intentionally does not include authentication because the exercise requirements state that authentication is not necessary.

Security considerations included in this implementation:

- API request validation using Fastify JSON schemas
- Parameter validation for contact IDs
- SQL parameter binding through prepared statements
- CORS restricted to the deployed frontend origin
- No secrets committed to source control
- Environment-specific configuration for deployed API URLs and database path

For production, I would add:

- Authentication and authorization
- Managed relational database storage instead of SQLite
- Rate limiting
- Request logging and monitoring
- Centralized error handling without exposing internal details
- HTTPS-only access
- More complete automated test coverage

## Future Improvements

Given additional time, I would consider:

* Search and filtering
* Pagination
* Contact detail page
* Automated unit and integration tests
* Containerization with Docker
* CI/CD deployment environments
* Authentication and authorization
* Migration from SQLite to a managed database service

## Author

Jay Ragsdale
