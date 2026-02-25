# Security Assessment and Demonstration Guide
## WSC Demo Lab

## 1. Overview

### Purpose of the Lab
WSC Demo Lab is an intentionally vulnerable web application used to teach web security concepts, secure coding basics, and risk identification in a controlled environment.

### Architecture
- Backend: Node.js + Express
- Authentication: JWT with role claims
- Storage: Local JSON files (`users.json`, `projects.json`, `votes.json`)
- Frontend: Plain HTML + Vanilla JavaScript
- Deployment target: Render-compatible Node service

### Educational Goals
- Demonstrate common web security weaknesses in realistic code flows.
- Show why server-side controls are mandatory.
- Teach how to assess, explain, and remediate vulnerabilities.

## 2. Identified Vulnerabilities

### 1) Debug Endpoint Information Disclosure
- Description: A debug endpoint exposes internal application details.
- Where: `GET /api/debug/config`.
- Why vulnerable: Sensitive operational metadata is publicly accessible.
- Violated principle: Least privilege and information minimization.
- Potential impact: Assists reconnaissance and privilege-targeted abuse.
- Risk severity: Medium.

### 2) Weak JWT Secret
- Description: JWT uses a weak, hardcoded secret.
- Where: Token signing and verification logic in backend.
- Why vulnerable: Low-entropy static secret weakens token trust.
- Violated principle: Secure cryptographic key management.
- Potential impact: Unauthorized access via token integrity compromise.
- Risk severity: High.

### 3) Plaintext Password Storage
- Description: Credentials are stored unencrypted.
- Where: `data/users.json`.
- Why vulnerable: Any file exposure reveals usable credentials.
- Violated principle: Confidentiality of authentication data.
- Potential impact: Account takeover and credential reuse risk.
- Risk severity: Critical.

### 4) Business Logic Flaw in Vote Validation
- Description: Vote submissions lack domain rule checks.
- Where: `POST /api/vote`.
- Why vulnerable: Server accepts unverified vote semantics.
- Violated principle: Data integrity and business rule enforcement.
- Potential impact: Manipulated outcomes and untrusted results.
- Risk severity: High.

### 5) Frontend-Only Voting Enforcement
- Description: Voting disable behavior is enforced only in UI.
- Where: `public/js/vote.js` toggle logic.
- Why vulnerable: Client controls are not authoritative.
- Violated principle: Trust boundary enforcement.
- Potential impact: Restricted actions can still be accepted by backend.
- Risk severity: High.

### 6) Lack of Server-Side Input Validation
- Description: API accepts broad input without strict schema validation.
- Where: Vote and auth input handling.
- Why vulnerable: Malformed or unexpected data can be processed and stored.
- Violated principle: Input validation and fail-safe defaults.
- Potential impact: Data quality issues and expanded attack surface.
- Risk severity: Medium.

## 3. Demonstration Steps (High-Level Only)

### Debug Endpoint Disclosure
- Access published endpoints as a normal user.
- Observe whether internal notes/configuration are visible.

### Weak JWT Secret
- Review the authentication model and token dependency for role checks.
- Observe reliance on token integrity for admin route access.

### Plaintext Password Storage
- Review credential representation in storage.
- Compare with expected hashed and salted storage standard.

### Vote Business Logic Gap
- Submit varied normal test inputs.
- Observe acceptance of values that should be constrained by policy.

### Frontend-Only Control
- Toggle voting state in UI and compare server behavior.
- Observe mismatch between client restriction and backend acceptance.

### Missing Input Validation
- Test non-malicious malformed input structures.
- Observe backend processing and stored output behavior.

## 4. Security Concepts Explained

### Trust Boundaries
All browser input is untrusted until validated and authorized server-side.

### Server-Side Validation
Client validation improves UX only. Security decisions must happen on backend.

### Broken Access Control
Actions/resources must be protected by strict authorization checks.

### Information Disclosure
Unnecessary public detail increases attacker reconnaissance capability.

### Business Logic Flaws
Missing domain rules can break integrity even when code appears functional.

### Authentication vs Authorization
- Authentication: verifies identity.
- Authorization: defines allowed actions.
Both are required for secure access control.

## 5. Remediation Guide

### Debug Endpoint
- Remove in production or gate behind strong admin-only control.
- Use environment-based feature flags for diagnostics.

### Weak JWT Secret
- Use strong random secret from environment/secret manager.
- Implement key rotation and token expiration strategy.

### Plaintext Passwords
- Store password hashes with bcrypt or Argon2.
- Enforce password policy and secure credential lifecycle.

### Vote Logic Validation
- Add server-side checks for allowed score range, valid project ID, and voting constraints.
- Enforce business rules before persistence.

### Frontend-Only Enforcement
- Move voting-state enforcement to backend checks.
- Keep frontend toggle as visual state only.

### Input Validation
- Add schema validation middleware.
- Reject unknown fields and invalid types/ranges.

## 6. Hardening Checklist

- [ ] Remove or protect debug endpoints.
- [ ] Replace hardcoded secrets with managed environment secrets.
- [ ] Enforce token lifetime and key rotation policy.
- [ ] Hash passwords using bcrypt/Argon2.
- [ ] Enforce all business rules server-side.
- [ ] Add strict request schema validation.
- [ ] Strengthen authorization checks on privileged endpoints.
- [ ] Add rate limiting for login and sensitive routes.
- [ ] Add audit logging for auth/admin events.
- [ ] Return minimal error detail to clients.
- [ ] Apply secure HTTP headers and restrictive CORS.
- [ ] Add security-focused tests in CI/CD.

## 7. Disclaimer

This lab is intentionally vulnerable and must not be deployed as a production system.
