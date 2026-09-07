# Techet

Techet is a modern event ticketing and booking platform built for real use. It is designed to help organizers publish events, manage ticket sales, and give customers a smooth way to discover, book, and manage tickets.

## What this project is about

Techet is being built as a production-minded platform with a clear focus on usability, security, and growth. The goal is to create a system that can support real events, real bookings, and a real business model.

## Core goals

- Make event discovery simple and fast
- Give organizers a clean way to manage events and ticket types
- Support secure booking and payment workflows
- Generate digital tickets with QR validation
- Keep the codebase maintainable and easy to extend
- Prepare the platform for future SaaS growth

## Development approach

This project is being developed step by step.

Each update should follow this flow:

1. Explain what will change
2. Identify the relevant files
3. Implement the change
4. Check for errors
5. Test the feature
6. Fix issues if needed
7. Confirm what was completed
8. Move to the next logical task

## Working rules

- Keep the code clean and readable
- Use reusable components where possible
- Avoid hardcoded secrets and credentials
- Store sensitive values in environment variables
- Do not trust client-side values for prices, totals, or availability
- Keep the documentation updated as the project changes
- Prefer practical solutions over unnecessary complexity

## Planned structure

- `src/` for application code
- `docs/` for supporting documentation
- `tests/` for automated tests
- `.env.example` for environment variable examples
- `CHANGELOG.md` for notable updates
- `.github/` for repository templates and workflow support

## Roadmap

### Phase 1: Repository review
Understand the current setup and identify what can be reused.

### Phase 2: Foundation
Set up the project structure, documentation, and base application shell.

### Phase 3: Security and authentication
Add secure login, roles, and access control.

### Phase 4: Events and tickets
Build event management, ticket types, and inventory handling.

### Phase 5: Booking and payments
Implement checkout, payment handling, and booking confirmation.

### Phase 6: Tickets and QR validation
Generate digital tickets and verify them securely.

### Phase 7: Dashboards
Build organizer and admin dashboards with useful analytics.

### Phase 8: Performance and deployment
Improve speed, reliability, testing, and deployment readiness.

## Business direction

Techet is intended to grow into a real event technology business. The platform should support organizers, attendees, and administrators in a way that is reliable, easy to use, and ready for expansion.

## Next step

The next step is to inspect the current repository structure and begin the foundation work without removing anything useful.
