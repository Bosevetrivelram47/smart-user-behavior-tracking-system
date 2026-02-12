# smart-user-behavior-tracking-system

Smart User Behavior Tracking System:

    A full-stack web application developed to monitor user activities, manage task lifecycle, and generate structured behavior analytics using a clean and scalable architecture.

Project Description:
    Track user activities within an application
    Manage task creation, assignment, and resolution
    Log user actions for auditing and analytics
    Send notifications for important events
    Maintain structured task lifecycle management

Tech Stack:
    React Vite (TypeScript)
    REST API Integration

Backend:
    Java 17
    Spring Boot
    Spring Data JPA
    RESTful APIs
    Custom Exception Handling

Database:
    PostgreSQL
    Flyway for schema migration

Architecture Overview:

    Browser (User)
        ↓
    React Frontend
        ↓ (REST API Calls)
    Spring Boot Backend
        ↓
    Service Layer
        ↓
    Repository Layer
        ↓
    PostgreSQL Database

Backend Layers:
    Controller Layer – Handles API requests
    Service Layer – Contains business logic
    Repository Layer – Database interaction
    Entity Layer – JPA models
    Exception Layer – Custom error handling