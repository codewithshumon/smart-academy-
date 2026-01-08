# Contributing to Smart Academy

Thank you for your interest in contributing to the Smart Academy project! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Commit Guidelines](#commit-guidelines)
6. [Pull Request Process](#pull-request-process)

## Code of Conduct

Please be respectful and considerate in all interactions. Harassment or discriminatory behavior will not be tolerated.

## Getting Started

### Prerequisites

-   Node.js 20.11.0 LTS
-   npm 10.x or pnpm 8.x
-   Git 2.43+
-   Docker (optional but recommended)

### Setup

1. Fork the repository
2. Clone your fork:

    ```bash
    git clone https://github.com/your-username/smart-academy.git
    cd smart-academy
    ```

3. Install dependencies:

    ```bash
    # Frontend
    cd frontend
    npm install

    # Backend
    cd ../backend
    npm install
    ```

4. Start development servers:

    ```bash
    # Start Docker services (PostgreSQL, Redis, Elasticsearch)
    docker compose up -d

    # Start backend
    cd backend
    npm run dev

    # Start frontend (in another terminal)
    cd frontend
    npm run dev
    ```

## Development Workflow

1. Create a new branch from `develop`:

    ```bash
    git checkout develop
    git pull origin develop
    git checkout -b feature/your-feature-name
    ```

2. Make your changes
3. Test thoroughly
4. Commit your changes (see [Commit Guidelines](#commit-guidelines))
5. Push to your fork:

    ```bash
    git push origin feature/your-feature-name
    ```

6. Create a Pull Request

## Coding Standards

### Frontend (Next.js/React)

-   Use functional components with hooks
-   Follow React best practices
-   Use TypeScript for all new code
-   Follow the existing component structure
-   Use Tailwind CSS for styling

### Backend (Express.js/Node.js)

-   Use async/await for asynchronous operations
-   Follow RESTful API conventions
-   Implement proper error handling
-   Use TypeScript for all new code
-   Write unit tests for new features

### Code Style

-   Use ESLint and Prettier for code formatting
-   Follow the existing code style
-   Write meaningful comments for complex logic
-   Keep functions small and focused

## Commit Guidelines

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

-   `feat`: New feature
-   `fix`: Bug fix
-   `docs`: Documentation changes
-   `style`: Code style changes (formatting)
-   `refactor`: Code refactoring
-   `test`: Adding or updating tests
-   `chore`: Maintenance tasks

### Examples

```
feat(auth): add JWT token refresh functionality

Implement automatic token refresh to improve user experience
and reduce login frequency.

Closes #123
```

```
fix(api): resolve user profile image upload issue

Fixed multipart form data parsing error that prevented
users from uploading profile images.

Fixes #456
```

## Pull Request Process

1. Ensure your code passes all tests
2. Update documentation if needed
3. Create a descriptive PR title and description
4. Reference any related issues
5. Wait for code review
6. Address review feedback

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

-   [ ] Bug fix
-   [ ] New feature
-   [ ] Breaking change
-   [ ] Documentation update

## Testing

Describe how you tested your changes

## Checklist

-   [ ] Code follows project style guidelines
-   [ ] Tests pass locally
-   [ ] Documentation updated
-   [ ] No new warnings generated
```

## Questions?

Feel free to open an issue for questions or discussion.
