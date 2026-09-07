# Techet

Techet is a modern event ticketing and booking platform built for real use. It helps event organizers publish events, manage ticket sales, and gives customers a simple way to discover, book, and manage tickets.

## What Techet is

Techet is being built as a production-minded platform with a focus on usability, security, and growth. The goal is to create a system that can support real events, real bookings, and a real business.

## MVP scope

The first version of Techet focuses on the essentials needed to launch a usable platform.

### Customer features

- Create an account
- Log in and manage profile details
- Browse events
- Search and filter events
- View event details
- Select ticket type and quantity
- Book tickets
- Complete payment
- Receive booking confirmation
- Access a digital ticket with QR code
- View booking history

### Organizer features

- Create and edit events
- Publish and unpublish events
- Upload event images
- Add venue, date, and time
- Create ticket categories
- Set prices and quantities
- View bookings
- Track basic sales information

### Platform admin features

- View users
- View organizers
- View events
- Monitor bookings
- Review payments
- Manage platform settings

## Pages

### Public pages

- Landing page
- Event discovery
- Event search
- Event categories
- Event details
- About
- Contact
- FAQ
- Terms
- Privacy policy

### Customer pages

- Login
- Register
- Forgot password
- Profile
- My bookings
- My tickets
- Ticket details
- Notifications
- Account settings

### Organizer pages

- Dashboard
- Create event
- Edit event
- Events
- Bookings
- Ticket types
- Revenue overview
- Event settings

### Admin pages

- Dashboard
- Users
- Organizers
- Events
- Tickets
- Orders
- Payments
- Reports
- Settings

## Design direction

The interface should feel premium, fast, and professional. It should take inspiration from motorsport dashboards and modern fintech products without copying any existing brand.

The design should communicate:

- Speed
- Precision
- Energy
- Trust
- Premium quality

## Development rules

- Keep the code clean and readable
- Use reusable components where possible
- Avoid hardcoded secrets and credentials
- Store sensitive values in environment variables
- Do not trust client-side values for prices, totals, or ticket availability
- Keep the documentation updated as the project changes
- Prefer practical solutions over unnecessary complexity

## Technical principles

Techet should be built with a clean and scalable structure that separates:

- UI
- Business logic
- API
- Authentication
- Database
- Payments
- Notifications
- Ticket generation
- QR validation
- Analytics

## Security principles

Security is a first-class requirement.

The platform should support:

- Secure authentication
- Role-based access control
- Password hashing
- Input validation
- API authorization
- Rate limiting where appropriate
- Secure file uploads
- Secure QR validation
- Payment verification
- Audit logging
- Proper error handling

## Database direction

The database should support:

- Users
- Roles
- Organizers
- Events
- Venues
- Ticket types
- Tickets
- Orders
- Order items
- Payments
- Refunds
- Promo codes
- Notifications
- Audit logs

## Implementation approach

This project should be developed step by step.

Each update should follow this flow:

1. Explain what will change
2. Identify the relevant files
3. Implement the change
4. Check for errors
5. Test the feature
6. Fix issues if needed
7. Confirm what was completed
8. Move to the next logical task

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
