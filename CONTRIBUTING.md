# Contributing to Trujillo AI Studio

Thank you for your interest in contributing to Trujillo AI Studio. We welcome bug reports, feature enhancements, documentation improvements, and localization updates.

---

## Development Workflow

1. Fork the repository and create your feature branch:
   ```bash
   git checkout -b feature/my-feature
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the local development server:
   ```bash
   npm run dev
   ```

4. Run the memory subsystem test suite:
   ```bash
   npm test
   ```

5. Verify that web assets compile properly:
   ```bash
   npm run build:web
   ```

---

## Commit Guidelines

- Write clear, concise commit messages in imperative tense (e.g., `feat: add support for streaming tool calls`, `fix: correct token count estimation`).
- Keep individual commits focused on a single change.
- Ensure that no API keys, secrets, or personal credentials are included in staged code.

---

## Submitting Pull Requests

- Target pull requests against the `develop` branch.
- Include a descriptive title and an overview of what changed and why.
- Confirm all tests pass locally before opening the PR.
