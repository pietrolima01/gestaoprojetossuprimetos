# Project Component Tree

## Backend Structure

```
backend/GestaoAcessos.Api/
│
├── Authorization/
│   └── AuthorizationPolicies.cs              # Policy definitions and handlers
│       ├── PermissionRequirement             # Custom requirement for permissions
│       ├── RoleRequirement                   # Custom requirement for roles
│       ├── MfaRequirement                    # Custom requirement for MFA
│       ├── PermissionAuthorizationHandler    # Handles permission checks
│       ├── RoleAuthorizationHandler          # Handles role checks
│       ├── MfaAuthorizationHandler           # Handles MFA verification
│       └── AuthorizationPolicies             # Static policy definitions
│
├── Controllers/
│   └── UsersController.cs                    # User management endpoints
│       ├── GET    /api/v1/users              # List users with filters
│       ├── GET    /api/v1/users/{id}         # Get user details
│       ├── POST   /api/v1/users              # Create user
│       ├── PUT    /api/v1/users/{id}         # Update user
│       ├── POST   /api/v1/users/{id}/roles   # Assign roles
│       ├── DELETE /api/v1/users/{id}/roles/{roleId}  # Revoke role
│       ├── POST   /api/v1/users/{id}/lock    # Lock user
│       ├── POST   /api/v1/users/{id}/unlock  # Unlock user
│       ├── POST   /api/v1/users/{id}/sessions/terminate  # End sessions
│       ├── POST   /api/v1/users/{id}/mfa/require  # Require MFA
│       ├── POST   /api/v1/users/{id}/mfa/reset  # Reset MFA
│       └── POST   /api/v1/users/bulk         # Bulk operations
│
├── Models/
│   ├── Domain/
│   │   └── Entities.cs                       # Domain entities
│   │       ├── User                          # User entity
│   │       ├── Role                          # Role entity
│   │       ├── Resource                      # Resource entity
│   │       ├── Permission                    # Permission entity
│   │       ├── RolePermission                # Role-Permission mapping
│   │       ├── UserRole                      # User-Role assignment
│   │       ├── Group                         # Group entity
│   │       ├── GroupMember                   # Group membership
│   │       ├── GroupRole                     # Group role inheritance
│   │       ├── AccessRequest                 # Access request
│   │       ├── Approval                      # Approval workflow
│   │       ├── Policy                        # ABAC policy
│   │       ├── AuditLog                      # Audit trail
│   │       ├── Session                       # User session
│   │       ├── MfaEnrollment                 # MFA configuration
│   │       └── ApiKey                        # API key
│   │
│   └── DTOs/
│       └── UserDtos.cs                       # Data transfer objects
│           ├── ApiResponse<T>                # Standard response wrapper
│           ├── ErrorInfo                     # Error details
│           ├── ResponseMeta                  # Response metadata
│           ├── PagedResult<T>                # Paginated response
│           ├── PaginationInfo                # Pagination metadata
│           ├── UserDto                       # User list item
│           ├── UserDetailDto                 # User details
│           ├── CreateUserRequestDto          # Create user request
│           ├── CreateUserResponseDto         # Create user response
│           ├── UpdateUserRequestDto          # Update user request
│           ├── AssignRolesRequestDto         # Assign roles request
│           ├── LockUserRequestDto            # Lock user request
│           ├── UnlockUserRequestDto          # Unlock user request
│           ├── TerminateSessionsRequestDto   # Terminate sessions request
│           ├── RequireMfaRequestDto          # Require MFA request
│           ├── ResetMfaRequestDto            # Reset MFA request
│           ├── BulkOperationRequestDto       # Bulk operation request
│           └── BulkOperationResultDto        # Bulk operation result
│
├── Services/                                 # [TO BE IMPLEMENTED]
│   ├── IUserService.cs
│   ├── UserService.cs
│   ├── IRoleService.cs
│   ├── RoleService.cs
│   ├── IAuditService.cs
│   └── AuditService.cs
│
├── Data/                                     # [TO BE IMPLEMENTED]
│   ├── AppDbContext.cs
│   ├── IRepository.cs
│   └── Repository.cs
│
├── Program.cs                                # Application entry point
├── appsettings.json                          # Configuration
└── GestaoAcessos.Api.csproj                  # Project file
```

## Frontend Structure

```
frontend/
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                        # Root layout
│   │   ├── page.tsx                          # Home page
│   │   │
│   │   └── access-management/
│   │       └── page.tsx                      # Main access management page
│   │           ├── TabsNavigation            # 7 tabs navigation
│   │           ├── UsersTab                  # Users management
│   │           ├── RolesPermissionsTab       # [STUB]
│   │           ├── GroupsTeamsTab            # [STUB]
│   │           ├── AccessRequestsTab         # [STUB]
│   │           ├── PoliciesTab               # [STUB]
│   │           ├── AuditLogsTab              # [STUB]
│   │           └── TokensIntegrationsTab     # [STUB]
│   │
│   ├── components/
│   │   └── access-management/
│   │       ├── UsersTab.tsx                  # Users tab implementation
│   │       │   ├── UserFilters               # Search and filters
│   │       │   ├── BulkActionsBar            # Bulk operations
│   │       │   ├── UsersTable                # Data grid
│   │       │   │   ├── TableHeader           # Column headers
│   │       │   │   ├── TableRow              # User row
│   │       │   │   ├── StatusBadge           # Status indicator
│   │       │   │   ├── RoleBadges            # Role chips
│   │       │   │   ├── GroupBadges           # Group chips
│   │       │   │   └── MfaBadge              # MFA indicator
│   │       │   ├── Pagination                # Page controls
│   │       │   └── UserDetailsDrawer         # Details panel
│   │       │
│   │       ├── UserFilters.tsx               # Filter component
│   │       │   ├── SearchInput               # Search box
│   │       │   ├── StatusFilter              # Status dropdown
│   │       │   ├── RoleFilter                # Role dropdown
│   │       │   ├── GroupFilter               # Group dropdown
│   │       │   ├── MfaFilter                 # MFA dropdown
│   │       │   └── ClearButton               # Reset filters
│   │       │
│   │       ├── UserDetailsDrawer.tsx         # User details panel
│   │       │   ├── DrawerHeader              # Title and close
│   │       │   ├── QuickActions              # Action buttons
│   │       │   ├── UserInfo                  # Basic info
│   │       │   ├── RolesSection              # Role assignments
│   │       │   ├── GroupsSection             # Group memberships
│   │       │   ├── PermissionsSection        # Effective permissions
│   │       │   ├── SessionsSection           # Active sessions
│   │       │   ├── MfaSection                # MFA enrollments
│   │       │   └── AuditTimeline             # Event history
│   │       │
│   │       └── TabStubs.tsx                  # Stub components
│   │           ├── RolesPermissionsTab       # [TO BE IMPLEMENTED]
│   │           ├── GroupsTeamsTab            # [TO BE IMPLEMENTED]
│   │           ├── AccessRequestsTab         # [TO BE IMPLEMENTED]
│   │           ├── PoliciesTab               # [TO BE IMPLEMENTED]
│   │           ├── AuditLogsTab              # [TO BE IMPLEMENTED]
│   │           └── TokensIntegrationsTab     # [TO BE IMPLEMENTED]
│   │
│   ├── lib/                                  # [TO BE IMPLEMENTED]
│   │   ├── api.ts                            # API client
│   │   ├── auth.ts                           # Authentication
│   │   └── utils.ts                          # Utilities
│   │
│   ├── types/                                # [TO BE IMPLEMENTED]
│   │   ├── user.ts                           # User types
│   │   ├── role.ts                           # Role types
│   │   └── api.ts                            # API types
│   │
│   └── styles/
│       └── globals.css                       # Global styles + Tailwind
│
├── package.json                              # Dependencies
├── tsconfig.json                             # TypeScript config
├── tailwind.config.js                        # Tailwind config
├── postcss.config.js                         # PostCSS config
└── next.config.js                            # Next.js config
```

## Database Structure

```
SQL Server Database: GestaoAcessos
│
├── Users                                     # User accounts
│   ├── Id (PK, GUID)
│   ├── Email (Unique Index)
│   ├── UserName
│   ├── PasswordHash
│   ├── IsActive, IsLocked
│   ├── LastLoginAt
│   ├── CreatedAt, UpdatedAt
│   └── RowVersion (Concurrency)
│
├── Roles                                     # Role definitions
│   ├── Id (PK, GUID)
│   ├── Name (Unique Index)
│   ├── IsSystemRole
│   └── RowVersion
│
├── Resources                                 # Protected resources
│   ├── Id (PK, GUID)
│   ├── Name (Unique Index)
│   └── ResourceType
│
├── Permissions                               # Granular permissions
│   ├── Id (PK, GUID)
│   ├── ResourceId (FK → Resources)
│   ├── Action (Create/Read/Update/Delete)
│   └── Unique (ResourceId, Action)
│
├── RolePermissions                           # N:N with scoping
│   ├── Id (PK, GUID)
│   ├── RoleId (FK → Roles)
│   ├── PermissionId (FK → Permissions)
│   ├── ScopeType (Global/Unit/Team/Resource)
│   ├── ScopeId (FK to scope entity)
│   └── Index on (RoleId, PermissionId, ScopeType, ScopeId)
│
├── UserRoles                                 # User role assignments
│   ├── Id (PK, GUID)
│   ├── UserId (FK → Users)
│   ├── RoleId (FK → Roles)
│   ├── ScopeType, ScopeId
│   ├── ExpiresAt (optional)
│   └── Reason
│
├── Groups                                    # Organizational groups
│   ├── Id (PK, GUID)
│   ├── Name (Unique Index)
│   ├── GroupType (Team/Unit/Department)
│   ├── ParentGroupId (FK → Groups, self-reference)
│   └── RowVersion
│
├── GroupMembers                              # Group membership
│   ├── Id (PK, GUID)
│   ├── GroupId (FK → Groups)
│   ├── UserId (FK → Users)
│   ├── IsManager
│   └── JoinedAt
│
├── GroupRoles                                # Group role inheritance
│   ├── Id (PK, GUID)
│   ├── GroupId (FK → Groups)
│   ├── RoleId (FK → Roles)
│   └── ScopeType, ScopeId
│
├── AccessRequests                            # Access request workflow
│   ├── Id (PK, GUID)
│   ├── RequesterId (FK → Users)
│   ├── TargetUserId (FK → Users)
│   ├── RequestType (RoleAssignment/etc)
│   ├── Status (Pending/Approved/Rejected)
│   ├── RequiresApprovals (2 by default)
│   ├── SlaDeadline
│   └── RowVersion
│
├── Approvals                                 # Approval stages
│   ├── Id (PK, GUID)
│   ├── AccessRequestId (FK → AccessRequests)
│   ├── ApproverId (FK → Users)
│   ├── ApprovalLevel (1st/2nd stage)
│   ├── Status (Pending/Approved/Rejected)
│   └── Comments
│
├── Policies                                  # ABAC policies
│   ├── Id (PK, GUID)
│   ├── Name (Unique Index)
│   ├── PolicyType (RBAC/ABAC/MFA/etc)
│   ├── Conditions (JSON)
│   ├── Effect (Allow/Deny/Require)
│   ├── Priority
│   └── IsActive
│
├── AuditLogs                                 # Immutable audit trail
│   ├── Id (PK, GUID)
│   ├── UserId (FK → Users)
│   ├── Action, ResourceType, ResourceId
│   ├── OldValues, NewValues (JSON)
│   ├── IpAddress, UserAgent
│   ├── PerformedAt (Index)
│   └── IntegrityHash (SHA-256)
│
├── Sessions                                  # Active sessions
│   ├── Id (PK, GUID)
│   ├── UserId (FK → Users)
│   ├── SessionToken (Unique Index)
│   ├── IsActive
│   ├── ExpiresAt
│   └── LastActivityAt
│
├── MfaEnrollments                            # MFA configurations
│   ├── Id (PK, GUID)
│   ├── UserId (FK → Users)
│   ├── MfaType (TOTP/SMS/Email/WebAuthn)
│   ├── Secret (Encrypted)
│   ├── RecoveryCodes (Encrypted)
│   └── IsEnabled, IsVerified
│
└── ApiKeys                                   # API key management
    ├── Id (PK, GUID)
    ├── UserId (FK → Users)
    ├── Name
    ├── KeyHash (Unique Index)
    ├── Prefix (for identification)
    ├── Scopes (JSON array)
    ├── IsActive
    ├── ExpiresAt
    └── LastUsedAt
```

## Documentation Structure

```
docs/
│
├── database-schema.sql                       # Complete SQL schema
│   ├── Table definitions (16 tables)
│   ├── Indexes and constraints
│   └── Seed data (roles, permissions)
│
├── api-endpoints.md                          # API reference
│   ├── Authentication
│   ├── Users Management (12 endpoints)
│   ├── Roles & Permissions (5 endpoints)
│   ├── Groups & Teams (5 endpoints)
│   ├── Access Requests (4 endpoints)
│   ├── Policies (5 endpoints)
│   ├── Audit Logs (3 endpoints)
│   ├── Tokens & Integrations (4 endpoints)
│   └── Sessions (2 endpoints)
│
├── security-checklist.md                     # Security status
│   ├── Authentication & Authorization (✅ 6, ⚠️ 6)
│   ├── MFA (✅ 3, ⚠️ 6)
│   ├── Data Protection (✅ 3, ⚠️ 7)
│   ├── Session Management (✅ 3, ⚠️ 6)
│   ├── Audit & Logging (✅ 4, ⚠️ 6)
│   ├── Input Validation (✅ 4, ⚠️ 6)
│   ├── Known Risks (High: 5, Medium: 5, Low: 4)
│   └── Testing Recommendations
│
├── ux-design-wireframe.md                    # UX design
│   ├── Design Principles
│   ├── Layout Structure (ASCII diagrams)
│   ├── Tab wireframes (7 tabs)
│   ├── Component specifications
│   ├── Interaction patterns
│   ├── Design tokens
│   ├── Accessibility features
│   └── Keyboard shortcuts
│
├── implementation-summary.md                 # What's implemented
│   ├── Overview
│   ├── Database (100%)
│   ├── Backend (60%)
│   ├── Frontend (30%)
│   ├── Documentation (100%)
│   ├── Architecture decisions
│   └── Next steps
│
└── quick-start-guide.md                      # Setup guide
    ├── Prerequisites
    ├── Database setup
    ├── Backend setup
    ├── Frontend setup
    ├── Troubleshooting
    └── Development workflow
```

## Feature Completeness

### Fully Implemented ✅
- Database schema (16 tables)
- Domain models (16 entities)
- Authorization framework (3 handlers, 20+ policies)
- Users API controller (12 endpoints)
- DTOs (15+ types)
- Users tab UI (complete)
- User details drawer (complete)
- User filters (complete)
- Tailwind styling with theme
- API documentation
- Security checklist
- UX wireframes
- Setup guide

### Partially Implemented ⚠️
- Backend (structure only, no database layer)
- Frontend (1 of 7 tabs)
- Authorization (policies defined, not enforced)

### To Be Implemented 📋
- EF Core DbContext
- Service layer
- Repository pattern
- Remaining 6 tab UIs
- API integration
- Authentication
- Password hashing
- Secrets encryption
- Rate limiting
- CSRF protection
- Tests

## Total Lines of Code

```
Backend:
  - Entities.cs:              560 lines
  - AuthorizationPolicies.cs: 310 lines
  - UsersController.cs:       450 lines
  - UserDtos.cs:             230 lines
  Total Backend:            1,550 lines

Frontend:
  - page.tsx:                  85 lines
  - UsersTab.tsx:             340 lines
  - UserDetailsDrawer.tsx:    370 lines
  - UserFilters.tsx:          140 lines
  - TabStubs.tsx:             100 lines
  - layout.tsx:                20 lines
  - globals.css:               60 lines
  Total Frontend:           1,115 lines

Database:
  - database-schema.sql:      520 lines

Documentation:
  - api-endpoints.md:         650 lines
  - security-checklist.md:    280 lines
  - ux-design-wireframe.md:   550 lines
  - implementation-summary.md: 390 lines
  - quick-start-guide.md:     280 lines
  - README.md:                310 lines
  Total Documentation:      2,460 lines

GRAND TOTAL:               ~5,645 lines
```

---

**Created**: 2025-10-24  
**Purpose**: Visual overview of project structure  
**Completeness**: Foundation ready for implementation
