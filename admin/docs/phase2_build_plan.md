# Phase 2: Build Plan — Closing the Gap with Maxi

> **Reference codebase:** `/home/pierre/projects/version_freeze/maxi/backend`
> **Target codebase:** `/home/pierre/projects/version_freeze/property_mngt_sys/backend`
>
> Maxi (POS) is the proven blueprint. This plan ports its patterns to the
> property management domain, swapping `Store → Property` and adding the
> `Unit` tier.

---

## Phase 2A — Upgrade Core Models & Base Classes

**Goal:** Match maxi's model richness — audit fields, soft-delete, lifecycle states.

### 2A-1: Upgrade `core/models.py` base classes

Reference: `maxi/backend/app/core/models.py`

- [ ] Add `to_dict()` method to `BaseModel`
- [ ] Rename `TenantMixin` → `TenantScopedModel` (proper abstract model, not just a mixin)
  - Add `created_by` FK → `users.id` (nullable)
  - Add `updated_by` FK → `users.id` (nullable)
  - Add `deleted_at` DateTime (nullable)
  - Add `is_deleted` property
  - Add `soft_delete()` method
- [ ] Create `PropertyScopedModel(TenantScopedModel)` — adds `property_id` FK
  - Equivalent to maxi's `StoreScopedModel`
  - Unit and future models (Lease, Invoice) will inherit this

### 2A-2: Upgrade `User` model

Reference: `maxi/backend/app/blueprints/users/models.py`

- [ ] Add `set_password()` / `check_password()` methods (werkzeug)
- [ ] Add `email_verified` (Boolean, default False)
- [ ] Add `email_verified_at` (DateTime, nullable)

### 2A-3: Upgrade `Tenant` model

Reference: `maxi/backend/app/blueprints/tenants/models.py`

- [ ] Add `TenantStatus` enum: `trial`, `active`, `suspended`, `canceled`
- [ ] Replace `is_active` boolean with `status` column using the enum
- [ ] Add `trial_ends_at` (DateTime, nullable)
- [ ] Add `deleted_at` (DateTime, nullable) + `soft_delete()` method
- [ ] Add `is_active`, `is_trial`, `is_deleted` properties

### 2A-4: Create `TenantSettings` model

Reference: `maxi/backend/app/blueprints/tenants/models.py` → `TenantSettings`

- [ ] Create dedicated `TenantSettings` model (one-to-one with Tenant)
- [ ] Fields adapted for Kenya property management:
  - `timezone` (default `Africa/Nairobi`)
  - `currency` (default `KES`)
  - `locale` (default `en-KE`)
  - `date_format`, `time_format`
  - `tax_rate` (Kenya VAT 16%)
  - `tax_id` (KRA PIN)
  - `fiscal_year_start_month`, `fiscal_year_start_day`
  - `business_name`, `business_address`, `business_phone`, `business_email`
  - Onboarding state fields
- [ ] Remove the `settings` JSON column from Tenant (replaced by this model)

### 2A-5: Upgrade `TenantUser` junction table

Reference: `maxi/backend/app/blueprints/tenants/models.py` → `TenantUser`

- [ ] Switch from composite PK to surrogate UUID PK (matches maxi)
- [ ] Add `joined_at` (DateTime)
- [ ] Add `invited_by` FK → `users.id` (nullable)
- [ ] Add UniqueConstraint on `(user_id, tenant_id)`

### 2A-6: Upgrade `PropertyUser` junction table

Reference: `maxi/backend/app/blueprints/stores/models.py` → `StoreUser`

- [ ] Switch from composite PK to surrogate UUID PK
- [ ] Add `tenant_id` FK (so we can query by tenant)
- [ ] Add `assigned_at` (DateTime)
- [ ] Add `assigned_by` FK → `users.id` (nullable)
- [ ] Add UniqueConstraint on `(user_id, property_id)`

### 2A-7: Create `PropertySettings` model

Reference: `maxi/backend/app/blueprints/stores/models.py` → `StoreSettings`

- [ ] One-to-one with Property
- [ ] Fields adapted for property management:
  - `phone`, `email`, `address` (overrides tenant if set)
  - `management_fee_percentage` (Numeric)
  - `default_lease_duration_months` (Integer)
  - `late_payment_penalty_percentage` (Numeric)
  - `payment_due_day` (Integer, e.g. 5th of month)
  - `utility_billing_enabled` (Boolean)
  - `mpesa_paybill` or `mpesa_till` (String, property-level M-Pesa)

### 2A-8: Upgrade `Permission` model

Reference: `maxi/backend/app/blueprints/rbac/models.py` → `Permission`

- [ ] Add `resource` column (String, indexed) — e.g. `properties`, `units`, `leases`
- [ ] Add `action` column (String) — e.g. `create`, `read`, `update`, `delete`
- [ ] Add composite index on `(resource, action)`
- [ ] Keep `name` as the `resource.action` string for quick lookups

### 2A-9: Upgrade `UserRole` model

Reference: `maxi/backend/app/blueprints/rbac/models.py` → `UserRole`

- [ ] Add `assigned_at` (DateTime)
- [ ] Add `assigned_by` FK → `users.id` (nullable)
- [ ] Add `is_tenant_wide` property (`property_id is None`)

### 2A-10: Upgrade `RolePermission` model

Reference: maxi uses surrogate UUID PK + UniqueConstraint instead of composite PK.

- [ ] Switch from composite PK to surrogate UUID PK (matches maxi pattern)
- [ ] Add UniqueConstraint on `(role_id, permission_id)`

### 2A-11: Generate migration

- [ ] `flask db migrate -m "phase_2a_model_upgrades"`
- [ ] Review and apply

---

## Phase 2B — Auth Token Models

**Goal:** Full token lifecycle — blacklisting, revocation, invitations, email verification.

Reference: `maxi/backend/app/blueprints/auth/models.py` (517 lines, 5 models)

### 2B-1: `BlacklistedToken` model

- [ ] Fields: `jti` (unique, indexed), `user_id` FK, `token_type`, `expires_at`, `blacklisted_at`, `reason`
- [ ] Class methods: `is_blacklisted(jti)`, `blacklist_token()`, `cleanup_expired()`

### 2B-2: `UserTokenRevocation` model

- [ ] Fields: `user_id` (unique FK), `revoked_at`, `updated_at`
- [ ] Class methods: `get_revocation_time(user_id)`, `revoke_all_tokens(user_id)`
- [ ] Used for "logout from all devices"

### 2B-3: Upgrade `PasswordResetToken`

- [ ] Add class methods matching maxi: `create_token()`, `get_valid_token()`, `invalidate_user_tokens()`, `cleanup_expired()`
- [ ] Add `is_valid`, `is_expired` properties

### 2B-4: `UserInvitation` model

- [ ] Fields: `token`, `email`, `tenant_id`, `role_id`, `property_id` (nullable), `invited_by`, `expires_at`, `accepted_at`
- [ ] 7-day expiry
- [ ] Class methods: `create_invitation()`, `get_valid_invitation()`, `mark_accepted()`

### 2B-5: `EmailVerificationToken` model

- [ ] Fields: `token`, `user_id`, `expires_at`, `used_at`
- [ ] 24-hour expiry
- [ ] Class methods: `create_token()`, `get_valid_token()`, `mark_used()`

### 2B-6: Generate migration

- [ ] `flask db migrate -m "phase_2b_auth_tokens"`

---

## Phase 2C — Security Middleware

**Goal:** Port maxi's two-layer middleware, adapting Store → Property.

Reference: `maxi/backend/app/core/middleware.py` (528 lines)

### 2C-1: `TenantMiddleware` (first layer)

- [ ] Extract JWT from `Authorization: Bearer <token>` header
- [ ] Validate token signature and expiration
- [ ] Load User and Tenant from DB
- [ ] Validate: user is active, is member of tenant, tenant not suspended/canceled
- [ ] Check `BlacklistedToken` (single-token logout)
- [ ] Check `UserTokenRevocation` (logout-all)
- [ ] Set `g.user`, `g.tenant`, `g.tenant_user`
- [ ] Exempt paths: `/auth/*`, `/health*`

### 2C-2: `PropertyMiddleware` (second layer)

- [ ] Check for `X-Property-ID` header
- [ ] Validate property exists and belongs to current tenant
- [ ] Validate user has access via:
  1. Direct `PropertyUser` record
  2. Property-scoped `UserRole`
  3. Tenant-wide `UserRole`
- [ ] Set `g.property`

### 2C-3: Error handlers

- [ ] Structured JSON error responses for 400, 401, 403, 404, 422, 500
- [ ] Port from `maxi/backend/app/error_handler.py`

### 2C-4: `init_middleware(app)` function

- [ ] Wire into `create_app()` after model imports

---

## Phase 2D — Decorators

**Goal:** Route-level security decorators matching maxi.

Reference: `maxi/backend/app/core/decorators.py` (558 lines)

### 2D-1: Core decorators

- [ ] `@require_tenant` — ensures `g.tenant` exists
- [ ] `@require_property` — ensures `g.property` exists (was `@require_store`)
- [ ] `@require_permission(permission, require_all=False)` — checks user permissions via roles
- [ ] `@require_subscription_active` — checks tenant subscription status
- [ ] `@audit_action(action, resource_type)` — auto-logs to audit trail

### 2D-2: Helper functions

- [ ] `get_user_permissions(user_id, tenant_id, property_id=None)`
- [ ] `has_permission(permission)`
- [ ] `has_any_permission(permissions)`

### 2D-3: API key auth (lower priority)

- [ ] `@api_key_required`
- [ ] `@require_api_key_scope(scope)`

---

## Phase 2E — Auth Service & Routes

**Goal:** Working registration, login, token refresh, password reset.

Reference: `maxi/backend/app/blueprints/auth/`

### 2E-1: `AuthService`

- [ ] `register(email, password, full_name)` — creates User + Tenant + TenantUser + default Owner Role
- [ ] `login(email, password)` — validates credentials, returns JWT (access + refresh)
- [ ] `refresh_token()` — issues new access token from refresh token
- [ ] `logout()` — blacklists current token
- [ ] `logout_all()` — revokes all user tokens
- [ ] `forgot_password(email)` — creates PasswordResetToken, sends email
- [ ] `reset_password(token, new_password)` — validates token, updates password

### 2E-2: Auth routes

- [ ] `POST /api/v1/auth/register`
- [ ] `POST /api/v1/auth/login`
- [ ] `POST /api/v1/auth/refresh`
- [ ] `POST /api/v1/auth/logout`
- [ ] `POST /api/v1/auth/logout-all`
- [ ] `POST /api/v1/auth/forgot-password`
- [ ] `POST /api/v1/auth/reset-password`

### 2E-3: Auth schemas (marshmallow)

- [ ] `RegisterSchema`, `LoginSchema`, `PasswordResetRequestSchema`, `PasswordResetSchema`

### 2E-4: JWT utilities

- [ ] Port from `maxi/backend/app/core/utils.py` — token generation, decoding, claims

---

## Phase 2F — Core Resource APIs

**Goal:** CRUD for the main entities.

### 2F-1: User management

- [ ] `GET /api/v1/users/me` — current user profile
- [ ] `PUT /api/v1/users/me` — update profile
- [ ] `GET /api/v1/users` — list tenant users (admin)
- [ ] `POST /api/v1/users/invite` — invite user to tenant

### 2F-2: Tenant management

- [ ] `GET /api/v1/tenants/current` — current tenant info + settings
- [ ] `PUT /api/v1/tenants/current` — update tenant
- [ ] `PUT /api/v1/tenants/current/settings` — update tenant settings

### 2F-3: Property management

- [ ] `POST /api/v1/properties` — create property
- [ ] `GET /api/v1/properties` — list properties in tenant
- [ ] `GET /api/v1/properties/:id` — get property details
- [ ] `PUT /api/v1/properties/:id` — update property
- [ ] `DELETE /api/v1/properties/:id` — soft-delete property

### 2F-4: Unit management

- [ ] `POST /api/v1/properties/:id/units` — create unit
- [ ] `GET /api/v1/properties/:id/units` — list units in property
- [ ] `GET /api/v1/units/:id` — get unit details
- [ ] `PUT /api/v1/units/:id` — update unit
- [ ] `DELETE /api/v1/units/:id` — soft-delete unit

### 2F-5: RBAC management

- [ ] `GET /api/v1/roles` — list roles in tenant
- [ ] `POST /api/v1/roles` — create role
- [ ] `PUT /api/v1/roles/:id` — update role
- [ ] `POST /api/v1/roles/:id/permissions` — assign permissions to role
- [ ] `POST /api/v1/users/:id/roles` — assign role to user
- [ ] `GET /api/v1/permissions` — list all permissions

---

## Phase 2G — Infrastructure

### 2G-1: Config hardening

Reference: `maxi/backend/app/config.py`

- [ ] Production pool settings (`pool_size`, `max_overflow`, `pool_recycle`, `pool_pre_ping`)
- [ ] JWT expiry from env vars
- [ ] CORS origins from env (not wildcard in prod)
- [ ] Fail-fast on missing secrets in production

### 2G-2: Rate limiting

- [ ] Add `flask-limiter` to requirements
- [ ] Configure in `extensions.py` (maxi: 200/min default)
- [ ] Apply stricter limits on auth routes (e.g. 5/min on login)

### 2G-3: Custom exceptions

Reference: `maxi/backend/app/core/exceptions.py`

- [ ] `NotFoundError`, `ForbiddenError`, `UnauthorizedError`, `ValidationError`, `ConflictError`
- [ ] Wire into error handlers for structured JSON responses

### 2G-4: CLI commands

Reference: `maxi/backend/app/cli/`

- [ ] `flask seed-permissions` — seed all permissions
- [ ] `flask create-superadmin` — create first superadmin user
- [ ] `flask seed-roles` — create default roles per tenant

### 2G-5: Celery setup

- [ ] Wire `init_celery()` in `create_app()`
- [ ] Email tasks (verification, password reset, rent reminders)
- [ ] Celery worker entry point

### 2G-6: API versioning

Reference: `maxi/backend/app/blueprints/api/v1/`

- [ ] Create `api/v1` blueprint that registers all sub-blueprints
- [ ] All routes under `/api/v1/` prefix

---

## Phase 2H — Tests

Reference: `maxi/backend/tests/conftest.py` (611 lines)

### 2H-1: `conftest.py` fixtures

- [ ] `app`, `client`, `db_session`
- [ ] `user`, `inactive_user`, `user_password`
- [ ] `tenant`, `tenant_trial`, `tenant_suspended`, `second_tenant`
- [ ] `property_obj`, `second_property`, `property_user`
- [ ] `permissions`, `admin_role`, `viewer_role`
- [ ] `user_with_admin_role`, `user_with_viewer_role`, `user_with_property_role`
- [ ] `auth_tokens`, `auth_headers`, `auth_headers_with_property`

### 2H-2: Test files

- [ ] `test_auth.py` — register, login, refresh, logout, password reset
- [ ] `test_rbac.py` — role creation, permission assignment, access checks
- [ ] `test_tenants.py` — tenant isolation, cross-tenant access denied
- [ ] `test_properties.py` — CRUD, tenant scoping
- [ ] `test_units.py` — CRUD, property scoping
- [ ] `test_users.py` — profile, invitation, deactivation

---

## Suggested Execution Order

| Day | Phase | Effort | Depends on |
|-----|-------|--------|------------|
| 1 | **2A** Model upgrades | ~2 hrs | — |
| 1 | **2B** Auth token models | ~1 hr | 2A |
| 2 | **2C** Middleware | ~2 hrs | 2A, 2B |
| 2 | **2D** Decorators | ~1.5 hrs | 2C |
| 3 | **2E** Auth service & routes | ~2 hrs | 2C, 2D |
| 3 | **2G** Infrastructure (config, exceptions, rate limiting) | ~1 hr | — |
| 4 | **2F** Core resource APIs | ~3 hrs | 2C, 2D, 2E |
| 4 | **2G** Infrastructure (CLI, Celery, API versioning) | ~1 hr | 2F |
| 5 | **2H** Tests | ~3 hrs | Everything |
