# Property Management SaaS — Full Backend TODO

---

## Phase 1: Core Foundation

### Project Scaffolding
- [x] Create folder structure from architecture spec
- [x] Add docstrings to all modules
- [x] Set up requirements.txt and requirements-dev.txt
- [x] Create Dockerfile and docker-compose.yml
- [x] Create .env.example, .gitignore, pytest.ini
- [x] Add missing `__init__.py` files (blueprints/, docs/)
- [x] Add missing blueprint files (payments/models.py, auth/repositories.py, onboarding/models.py)

### App Factory & Extensions
- [x] Initialize Flask extensions (db, migrate, jwt, mail, cors)
- [x] Create environment-based config classes
- [x] Create application factory (create_app)
- [x] Set up run.py entry point
- [ ] Initialize Flask-Migrate (`flask db init`)

### Core Models
- [ ] Create base mixins (BaseModel, TenantMixin, TimestampMixin) in `app/core/models.py`
- [ ] Create User model in `app/blueprints/users/models.py`
- [ ] Create Tenant model in `app/blueprints/tenants/models.py`
- [ ] Create Store model in `app/blueprints/stores/models.py`
- [ ] Create Role and Permission models in `app/blueprints/rbac/models.py`
- [ ] Create junction tables (TenantUser, StoreUser, UserRole, RolePermission)
- [ ] Run first migration to create tables

### Authentication
- [ ] Implement password hashing utilities in `app/core/utils.py`
- [ ] Create AuthService (register, login, token generation) in `app/blueprints/auth/services.py`
- [ ] Create auth schemas (LoginSchema, RegisterSchema) in `app/blueprints/auth/schemas.py`
- [ ] Create auth routes (POST /api/v1/auth/register, POST /api/v1/auth/login)
- [ ] Create PasswordResetToken model in `app/blueprints/auth/models.py`
- [ ] Implement token refresh endpoint (POST /api/v1/auth/refresh)
- [ ] Implement forgot-password and reset-password endpoints

### Middleware
- [ ] Implement TenantMiddleware (extract tenant from JWT, set context)
- [ ] Implement StoreMiddleware (validate store access within tenant)
- [ ] Implement SQLAlchemy auto-filter hook (automatic WHERE tenant_id clause)
- [ ] Implement request logging middleware

### Error Handling
- [ ] Define custom exceptions (NotFoundError, ForbiddenError, ValidationError, ConflictError) in `app/core/exceptions.py`
- [ ] Register global error handlers (400, 401, 403, 404, 500) in `app/error_handlers.py`
- [ ] Add JSON error response formatting

### CLI & Seeding
- [ ] Implement db_commands.py (`flask seed-db`, `flask db-reset`)
- [ ] Implement user_commands.py (`flask user create`, `flask user assign-role`)
- [ ] Implement tenant_commands.py (`flask tenant create`, `flask tenant seed-roles`)
- [ ] Define initial permissions list in `app/core/constants.py`
- [ ] Seed default roles and permissions

### Phase 1 Testing
- [ ] Set up conftest.py with test client, test db, test tenant fixtures
- [ ] Write auth tests (register, login, token validation, refresh)
- [ ] Write tenant isolation tests (User A cannot see Tenant B data)
- [ ] Write middleware tests (tenant context, store context)

---

## Phase 2: Access Control (RBAC)

### Core Decorators
- [ ] Implement `@require_permission` decorator in `app/core/decorators.py`
- [ ] Implement `@require_feature` decorator (checks subscription plan features)
- [ ] Implement `@require_role` convenience decorator

### RBAC Service
- [ ] Implement RBACService.check_permission() in `app/blueprints/rbac/services.py`
- [ ] Implement RBACService.assign_role() (tenant-wide or store-scoped)
- [ ] Implement RBACService.revoke_role()
- [ ] Implement RBACService.list_user_permissions()

### RBAC API
- [ ] Create role routes: GET /api/v1/roles, POST /api/v1/roles, PUT /api/v1/roles/:id
- [ ] Create permission routes: GET /api/v1/permissions
- [ ] Create role assignment routes: POST /api/v1/users/:id/roles, DELETE /api/v1/users/:id/roles/:role_id
- [ ] Implement RoleSchema, PermissionSchema, AssignRoleSchema in `app/blueprints/rbac/schemas.py`

### RBAC Repository
- [ ] Implement RoleRepository (CRUD with tenant scoping)
- [ ] Implement PermissionRepository (global read, tenant-scoped assignment)

### User Management
- [ ] Implement UserService (CRUD, profile updates, tenant user listing)
- [ ] Implement UserRepository (data access with tenant filtering)
- [ ] Create user routes: GET /api/v1/me, PUT /api/v1/me, GET /api/v1/users (admin)
- [ ] Create user schemas: UserSchema, UpdateProfileSchema
- [ ] Implement invite-user flow (create user + assign to tenant)

### Store Management
- [ ] Implement StoreService (CRUD, assign users to stores)
- [ ] Implement StoreRepository (tenant-scoped store queries)
- [ ] Create store routes: POST /api/v1/stores, GET /api/v1/stores, PUT /api/v1/stores/:id
- [ ] Create store schemas: StoreSchema, CreateStoreSchema
- [ ] Implement store user assignment (POST /api/v1/stores/:id/users)

### Tenant Management
- [ ] Implement TenantService (create, update, deactivate)
- [ ] Implement TenantRepository
- [ ] Create tenant routes: GET /api/v1/tenants/current, PUT /api/v1/tenants/current
- [ ] Create tenant schemas: TenantSchema, UpdateTenantSchema

### Phase 2 Testing
- [ ] Write RBAC tests (role creation, permission assignment, access denial)
- [ ] Write user management tests (CRUD, profile, admin listing)
- [ ] Write store management tests (CRUD, user assignment, tenant scoping)
- [ ] Write tenant management tests (update, deactivate)

---

## Phase 3: SaaS Business Layer

### Subscription Plans
- [ ] Implement Plan model (name, price, billing_cycle, features) in `app/blueprints/subscriptions/models.py`
- [ ] Implement Feature model and PlanFeature junction table
- [ ] Implement Subscription model (tenant, plan, status, billing dates)
- [ ] Implement SubscriptionService (create, upgrade, downgrade, cancel)
- [ ] Implement feature gating: SubscriptionService.check_feature()
- [ ] Implement SubscriptionRepository and PlanRepository
- [ ] Create subscription routes: GET /api/v1/subscriptions/current, PUT /api/v1/subscriptions/current
- [ ] Create plan routes: GET /api/v1/plans (public listing)
- [ ] Create subscription schemas: SubscriptionSchema, PlanSchema

### Billing & Invoicing
- [ ] Implement Invoice model and PaymentTransaction model in `app/blueprints/billing/models.py`
- [ ] Implement BillingService (generate invoices, calculate charges, process renewals)
- [ ] Implement PaymentTransactionRepository
- [ ] Create billing routes: GET /api/v1/billing/invoices, GET /api/v1/billing/history
- [ ] Create billing schemas: InvoiceSchema, TransactionSchema

### Usage Tracking
- [ ] Implement UsageMetric and UsageEvent models in `app/blueprints/usage/models.py`
- [ ] Implement UsageTrackingService (track events, check limits, aggregate metrics)
- [ ] Implement UsageMetricRepository, UsageEventRepository
- [ ] Create usage routes: GET /api/v1/usage/current, GET /api/v1/usage/history
- [ ] Create usage schemas: UsageMetricSchema, UsageEventSchema
- [ ] Define usage limits per plan (e.g., max stores, max users)

### Onboarding
- [ ] Implement OnboardingService (create tenant + user + subscription in one flow)
- [ ] Implement OnboardingStep and OnboardingProgress models
- [ ] Create onboarding routes: POST /api/v1/onboarding/register
- [ ] Create onboarding schemas: OnboardingSchema

### Notifications
- [ ] Implement Notification and NotificationTemplate models in `app/blueprints/notifications/models.py`
- [ ] Implement NotificationService (send, mark_read, bulk mark)
- [ ] Implement NotificationRepository
- [ ] Create notification routes: GET /api/v1/notifications, PUT /api/v1/notifications/:id/read
- [ ] Create notification schemas: NotificationSchema, NotificationPreferenceSchema

### Background Tasks
- [ ] Configure Celery app in `app/tasks/celery_app.py`
- [ ] Implement email tasks (verification, password reset, welcome) in `app/tasks/email_tasks.py`
- [ ] Implement billing tasks (renewal processing, invoice generation) in `app/tasks/billing_tasks.py`
- [ ] Implement usage tasks (metric aggregation, limit checks) in `app/tasks/usage_tasks.py`

### Phase 3 Testing
- [ ] Write subscription tests (create, upgrade, downgrade, cancel, feature gating)
- [ ] Write billing tests (invoice generation, payment recording)
- [ ] Write usage tests (event tracking, limit enforcement)
- [ ] Write notification tests (send, mark read)

---

## Phase 4: Monetization (Payments)

### M-Pesa Integration
- [ ] Implement M-Pesa Daraja API client in `app/blueprints/payments/mpesa.py`
- [ ] Implement STK push (Lipa Na M-Pesa) initiation
- [ ] Implement payment callback handling (C2B confirmation)
- [ ] Implement transaction status query
- [ ] Handle M-Pesa reversal requests

### Payment Service
- [ ] Implement PaymentService (initiate payment, handle callback, verify status)
- [ ] Implement PaymentTransaction model in `app/blueprints/payments/models.py`
- [ ] Implement MpesaCallback model for storing raw callback data
- [ ] Create payment routes: POST /api/v1/payments/mpesa/initiate, POST /api/v1/payments/mpesa-callback
- [ ] Create payment schemas: PaymentRequestSchema, PaymentStatusSchema

### Subscription Billing Integration
- [ ] Wire subscription renewals to M-Pesa payment initiation
- [ ] Implement automatic invoice generation on successful payment
- [ ] Implement payment failure handling (retry, grace period, suspension)
- [ ] Implement payment receipt generation

### Dependency Injection
- [ ] Set up dependency injection container in `app/container.py`
- [ ] Wire services and repositories through the container
- [ ] Configure environment-specific service bindings

### Phase 4 Testing
- [ ] Write M-Pesa integration tests (mock Daraja API)
- [ ] Write payment callback tests (success, failure, duplicate)
- [ ] Write subscription renewal payment tests

---

## Phase 5: Polish & Production Readiness

### API Documentation
- [ ] Set up OpenAPI/Swagger spec in `app/docs/swagger.py`
- [ ] Document all auth endpoints
- [ ] Document all user management endpoints
- [ ] Document all tenant and store endpoints
- [ ] Document all RBAC endpoints
- [ ] Document all subscription and billing endpoints
- [ ] Document all payment endpoints
- [ ] Document all notification endpoints

### Health & Monitoring
- [ ] Implement health check routes: GET /health, GET /health/db in `app/blueprints/health/routes.py`
- [ ] Add database connectivity check
- [ ] Add Redis connectivity check
- [ ] Add response time monitoring

### Blueprint Registration
- [ ] Register all blueprints in `app/blueprints/api/v1/__init__.py`
- [ ] Register all blueprints in app factory (`app/__init__.py`)
- [ ] Verify all URL prefixes and route naming

### Validators
- [ ] Implement email validator in `app/core/validators.py`
- [ ] Implement password strength validator
- [ ] Implement phone number validator (for M-Pesa)
- [ ] Implement common field validators (UUID, date range, pagination)

### Constants
- [ ] Define all permission constants in `app/core/constants.py`
- [ ] Define role constants (OWNER, ADMIN, MANAGER, STAFF)
- [ ] Define status constants (subscription, payment, tenant, store)
- [ ] Define billing cycle constants

### Configuration
- [ ] Implement development config overrides in `config/development.py`
- [ ] Implement testing config overrides in `config/testing.py`
- [ ] Implement production config overrides in `config/production.py`
- [ ] Add rate limiting configuration
- [ ] Add CORS origin configuration

### Comprehensive Testing
- [ ] Achieve test coverage for all services
- [ ] Write integration tests for full flows (register -> create tenant -> create store -> assign roles)
- [ ] Write edge case tests (expired tokens, deactivated tenants, exceeded usage limits)
- [ ] Set up CI test pipeline

### Deployment
- [ ] Finalize Dockerfile for production
- [ ] Finalize docker-compose.yml with all services
- [ ] Create database migration scripts for all models
- [ ] Create production deployment checklist
- [ ] Set up logging configuration (app.log, error.log)
