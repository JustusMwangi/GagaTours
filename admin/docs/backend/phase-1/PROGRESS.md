# Property Management SaaS — Progress

---

## Current Phase: Phase 1 (Core Foundation)

---

## Phase 1: Core Foundation

### Status: In Progress

### Completed
- [x] **Project scaffolding** — full folder structure (13 blueprint modules, core, cli, tasks, tests, migrations, config)
- [x] **Missing files added** — `blueprints/__init__.py`, `docs/__init__.py`, `payments/models.py`, `auth/repositories.py`, `onboarding/models.py`
- [x] **Config files** — .env.example, .gitignore, requirements.txt, requirements-dev.txt, Dockerfile, docker-compose.yml, pytest.ini
- [x] **App factory** — `create_app()` in `app/__init__.py`
- [x] **Extensions** — SQLAlchemy, Flask-Migrate, JWT, Mail, CORS in `app/extensions.py`
- [x] **Config classes** — DevelopmentConfig, TestingConfig, ProductionConfig in `app/config.py`
- [x] **Entry point** — `run.py` with app factory
- [x] **Architecture doc** — `core_system_architecture.md`

### Up Next
- [ ] Initialize Flask-Migrate (`flask db init`)
- [ ] Define core models (BaseModel, TenantMixin, TimestampMixin)
- [ ] Create User, Tenant, Store, Role, Permission models
- [ ] Create junction tables (TenantUser, StoreUser, UserRole, RolePermission)
- [ ] Run first migration

### Blockers
- None

---

## Phase 2: Access Control (RBAC)

### Status: Not Started

### Depends On
- Phase 1 core models and authentication

### Scope
- RBAC service + decorators (`@require_permission`, `@require_feature`)
- Role/permission management API
- User management API (CRUD, invite, profile)
- Store management API (CRUD, user assignment)
- Tenant management API (update, deactivate)

---

## Phase 3: SaaS Business Layer

### Status: Not Started

### Depends On
- Phase 2 RBAC and user/store management

### Scope
- Subscription plans (Plan, Feature, PlanFeature models)
- Billing & invoicing (Invoice, PaymentTransaction)
- Usage tracking & metering (UsageMetric, UsageEvent)
- Onboarding flow (tenant + user + subscription creation)
- Notification system (Notification, NotificationTemplate)
- Celery background tasks (email, billing, usage)

---

## Phase 4: Monetization (Payments)

### Status: Not Started

### Depends On
- Phase 3 subscriptions and billing

### Scope
- M-Pesa Daraja API integration (STK push, callbacks, reversals)
- Payment service (initiate, callback handling, status query)
- Subscription billing integration (auto-renewal, failure handling)
- Dependency injection container setup

---

## Phase 5: Polish & Production Readiness

### Status: Not Started

### Depends On
- Phase 4 payments integration

### Scope
- API documentation (OpenAPI/Swagger)
- Health check endpoints
- Blueprint registration (wire all modules into app factory)
- Validators (email, password, phone, pagination)
- Constants (permissions, roles, statuses)
- Environment-specific configs
- Comprehensive test coverage
- Deployment preparation (Docker, migrations, logging)

---

## Decisions Made
- Flask + SQLAlchemy + PostgreSQL stack
- Module-per-feature blueprint structure (auth, users, tenants, stores, rbac, subscriptions, billing, payments, usage, onboarding, notifications, health)
- Repository pattern for data access layer
- JWT-based authentication
- M-Pesa for payment processing
- Celery + Redis for background tasks
- 5-phase incremental build process

## File Counts
- **Total source files**: ~120 (excluding venv, .git)
- **Blueprints**: 13 modules, 71 files
- **Core**: 8 files
- **CLI**: 4 files
- **Tasks**: 5 files
- **Tests**: 7 files
- **Config**: 3 files
- **Migrations**: 4 files (no versions yet)
