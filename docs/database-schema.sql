-- =====================================================================
-- Gestão de Acessos - SQL Server Database Schema
-- =====================================================================
-- This schema implements a comprehensive access management system with:
-- - RBAC (Role-Based Access Control)
-- - ABAC (Attribute-Based Access Control)
-- - MFA Support
-- - Audit Trails
-- - Session Management
-- - API Key Management
-- =====================================================================

-- Users Table
CREATE TABLE Users (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Email NVARCHAR(256) NOT NULL UNIQUE,
    NormalizedEmail NVARCHAR(256) NOT NULL,
    UserName NVARCHAR(256) NOT NULL,
    NormalizedUserName NVARCHAR(256) NOT NULL,
    PasswordHash NVARCHAR(MAX) NOT NULL,
    SecurityStamp NVARCHAR(MAX),
    IsActive BIT NOT NULL DEFAULT 1,
    IsLocked BIT NOT NULL DEFAULT 0,
    LockedUntil DATETIME2 NULL,
    LastLoginAt DATETIME2 NULL,
    FailedLoginAttempts INT NOT NULL DEFAULT 0,
    MustChangePwd BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    RowVersion ROWVERSION,
    INDEX IX_Users_Email (Email),
    INDEX IX_Users_NormalizedEmail (NormalizedEmail),
    INDEX IX_Users_IsActive (IsActive),
    INDEX IX_Users_CreatedAt (CreatedAt)
);

-- Roles Table
CREATE TABLE Roles (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(256) NOT NULL UNIQUE,
    NormalizedName NVARCHAR(256) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    IsSystemRole BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    RowVersion ROWVERSION,
    INDEX IX_Roles_Name (Name),
    INDEX IX_Roles_NormalizedName (NormalizedName)
);

-- Resources Table
CREATE TABLE Resources (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(256) NOT NULL UNIQUE,
    Description NVARCHAR(MAX) NULL,
    ResourceType NVARCHAR(50) NOT NULL, -- API, UI, Data, etc.
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    RowVersion ROWVERSION,
    INDEX IX_Resources_Name (Name),
    INDEX IX_Resources_ResourceType (ResourceType)
);

-- Permissions Table
CREATE TABLE Permissions (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ResourceId UNIQUEIDENTIFIER NOT NULL,
    Action NVARCHAR(50) NOT NULL, -- Create, Read, Update, Delete, Execute, etc.
    Name NVARCHAR(256) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    RowVersion ROWVERSION,
    CONSTRAINT FK_Permissions_Resources FOREIGN KEY (ResourceId) REFERENCES Resources(Id) ON DELETE CASCADE,
    CONSTRAINT UQ_Permissions_Resource_Action UNIQUE (ResourceId, Action),
    INDEX IX_Permissions_ResourceId (ResourceId),
    INDEX IX_Permissions_Action (Action)
);

-- RolePermissions (Many-to-Many)
CREATE TABLE RolePermissions (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    RoleId UNIQUEIDENTIFIER NOT NULL,
    PermissionId UNIQUEIDENTIFIER NOT NULL,
    ScopeType NVARCHAR(50) NOT NULL, -- Global, Unit, Team, Resource
    ScopeId UNIQUEIDENTIFIER NULL, -- FK to Unit, Team, or specific Resource
    GrantedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    GrantedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT FK_RolePermissions_Roles FOREIGN KEY (RoleId) REFERENCES Roles(Id) ON DELETE CASCADE,
    CONSTRAINT FK_RolePermissions_Permissions FOREIGN KEY (PermissionId) REFERENCES Permissions(Id) ON DELETE CASCADE,
    CONSTRAINT UQ_RolePermissions UNIQUE (RoleId, PermissionId, ScopeType, ScopeId),
    INDEX IX_RolePermissions_RoleId (RoleId),
    INDEX IX_RolePermissions_PermissionId (PermissionId),
    INDEX IX_RolePermissions_ScopeType_ScopeId (ScopeType, ScopeId)
);

-- UserRoles (Many-to-Many)
CREATE TABLE UserRoles (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    RoleId UNIQUEIDENTIFIER NOT NULL,
    ScopeType NVARCHAR(50) NOT NULL, -- Global, Unit, Team, Resource
    ScopeId UNIQUEIDENTIFIER NULL,
    AssignedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    AssignedBy UNIQUEIDENTIFIER NULL,
    ExpiresAt DATETIME2 NULL,
    Reason NVARCHAR(MAX) NULL,
    CONSTRAINT FK_UserRoles_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    CONSTRAINT FK_UserRoles_Roles FOREIGN KEY (RoleId) REFERENCES Roles(Id) ON DELETE CASCADE,
    CONSTRAINT UQ_UserRoles UNIQUE (UserId, RoleId, ScopeType, ScopeId),
    INDEX IX_UserRoles_UserId (UserId),
    INDEX IX_UserRoles_RoleId (RoleId),
    INDEX IX_UserRoles_ScopeType_ScopeId (ScopeType, ScopeId),
    INDEX IX_UserRoles_ExpiresAt (ExpiresAt)
);

-- Groups Table
CREATE TABLE Groups (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(256) NOT NULL UNIQUE,
    Description NVARCHAR(MAX) NULL,
    GroupType NVARCHAR(50) NOT NULL, -- Team, Unit, Department, etc.
    ParentGroupId UNIQUEIDENTIFIER NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    RowVersion ROWVERSION,
    CONSTRAINT FK_Groups_ParentGroup FOREIGN KEY (ParentGroupId) REFERENCES Groups(Id),
    INDEX IX_Groups_Name (Name),
    INDEX IX_Groups_GroupType (GroupType),
    INDEX IX_Groups_ParentGroupId (ParentGroupId)
);

-- GroupMembers (Many-to-Many)
CREATE TABLE GroupMembers (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    GroupId UNIQUEIDENTIFIER NOT NULL,
    UserId UNIQUEIDENTIFIER NOT NULL,
    IsManager BIT NOT NULL DEFAULT 0,
    JoinedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    AddedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT FK_GroupMembers_Groups FOREIGN KEY (GroupId) REFERENCES Groups(Id) ON DELETE CASCADE,
    CONSTRAINT FK_GroupMembers_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    CONSTRAINT UQ_GroupMembers UNIQUE (GroupId, UserId),
    INDEX IX_GroupMembers_GroupId (GroupId),
    INDEX IX_GroupMembers_UserId (UserId)
);

-- GroupRoles (Roles inherited by group members)
CREATE TABLE GroupRoles (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    GroupId UNIQUEIDENTIFIER NOT NULL,
    RoleId UNIQUEIDENTIFIER NOT NULL,
    ScopeType NVARCHAR(50) NOT NULL,
    ScopeId UNIQUEIDENTIFIER NULL,
    AssignedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    AssignedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT FK_GroupRoles_Groups FOREIGN KEY (GroupId) REFERENCES Groups(Id) ON DELETE CASCADE,
    CONSTRAINT FK_GroupRoles_Roles FOREIGN KEY (RoleId) REFERENCES Roles(Id) ON DELETE CASCADE,
    CONSTRAINT UQ_GroupRoles UNIQUE (GroupId, RoleId, ScopeType, ScopeId),
    INDEX IX_GroupRoles_GroupId (GroupId),
    INDEX IX_GroupRoles_RoleId (RoleId)
);

-- AccessRequests Table
CREATE TABLE AccessRequests (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    RequesterId UNIQUEIDENTIFIER NOT NULL,
    TargetUserId UNIQUEIDENTIFIER NULL, -- NULL if self-request
    RequestType NVARCHAR(50) NOT NULL, -- RoleAssignment, PermissionGrant, GroupMembership, etc.
    TargetRoleId UNIQUEIDENTIFIER NULL,
    TargetGroupId UNIQUEIDENTIFIER NULL,
    ScopeType NVARCHAR(50) NULL,
    ScopeId UNIQUEIDENTIFIER NULL,
    Status NVARCHAR(50) NOT NULL DEFAULT 'Pending', -- Pending, Approved, Rejected, Cancelled
    Justification NVARCHAR(MAX) NOT NULL,
    RequestedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    RequiresApprovals INT NOT NULL DEFAULT 2,
    SlaDeadline DATETIME2 NULL,
    CompletedAt DATETIME2 NULL,
    CancelledAt DATETIME2 NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    RowVersion ROWVERSION,
    CONSTRAINT FK_AccessRequests_Requester FOREIGN KEY (RequesterId) REFERENCES Users(Id),
    CONSTRAINT FK_AccessRequests_TargetUser FOREIGN KEY (TargetUserId) REFERENCES Users(Id),
    CONSTRAINT FK_AccessRequests_TargetRole FOREIGN KEY (TargetRoleId) REFERENCES Roles(Id),
    CONSTRAINT FK_AccessRequests_TargetGroup FOREIGN KEY (TargetGroupId) REFERENCES Groups(Id),
    INDEX IX_AccessRequests_RequesterId (RequesterId),
    INDEX IX_AccessRequests_TargetUserId (TargetUserId),
    INDEX IX_AccessRequests_Status (Status),
    INDEX IX_AccessRequests_RequestedAt (RequestedAt),
    INDEX IX_AccessRequests_SlaDeadline (SlaDeadline)
);

-- Approvals Table
CREATE TABLE Approvals (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    AccessRequestId UNIQUEIDENTIFIER NOT NULL,
    ApproverId UNIQUEIDENTIFIER NOT NULL,
    ApprovalLevel INT NOT NULL, -- 1st stage, 2nd stage, etc.
    Status NVARCHAR(50) NOT NULL DEFAULT 'Pending', -- Pending, Approved, Rejected
    Comments NVARCHAR(MAX) NULL,
    ApprovedAt DATETIME2 NULL,
    RejectedAt DATETIME2 NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_Approvals_AccessRequests FOREIGN KEY (AccessRequestId) REFERENCES AccessRequests(Id) ON DELETE CASCADE,
    CONSTRAINT FK_Approvals_Approver FOREIGN KEY (ApproverId) REFERENCES Users(Id),
    CONSTRAINT UQ_Approvals UNIQUE (AccessRequestId, ApproverId, ApprovalLevel),
    INDEX IX_Approvals_AccessRequestId (AccessRequestId),
    INDEX IX_Approvals_ApproverId (ApproverId),
    INDEX IX_Approvals_Status (Status)
);

-- Policies Table (ABAC - Attribute-Based Access Control)
CREATE TABLE Policies (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(256) NOT NULL UNIQUE,
    Description NVARCHAR(MAX) NULL,
    PolicyType NVARCHAR(50) NOT NULL, -- RBAC, ABAC, MFA, SessionControl, etc.
    IsActive BIT NOT NULL DEFAULT 1,
    Priority INT NOT NULL DEFAULT 0, -- Higher priority takes precedence
    Conditions NVARCHAR(MAX) NOT NULL, -- JSON with attribute conditions
    Effect NVARCHAR(50) NOT NULL, -- Allow, Deny, Require
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    RowVersion ROWVERSION,
    INDEX IX_Policies_Name (Name),
    INDEX IX_Policies_IsActive (IsActive),
    INDEX IX_Policies_Priority (Priority)
);

-- AuditLogs Table (Immutable audit trail)
CREATE TABLE AuditLogs (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NULL,
    Action NVARCHAR(256) NOT NULL,
    ResourceType NVARCHAR(100) NOT NULL,
    ResourceId NVARCHAR(256) NULL,
    Description NVARCHAR(MAX) NULL,
    OldValues NVARCHAR(MAX) NULL, -- JSON
    NewValues NVARCHAR(MAX) NULL, -- JSON
    IpAddress NVARCHAR(45) NULL,
    UserAgent NVARCHAR(MAX) NULL,
    PerformedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IntegrityHash NVARCHAR(64) NOT NULL, -- SHA-256 hash for integrity verification
    CONSTRAINT FK_AuditLogs_Users FOREIGN KEY (UserId) REFERENCES Users(Id),
    INDEX IX_AuditLogs_UserId (UserId),
    INDEX IX_AuditLogs_Action (Action),
    INDEX IX_AuditLogs_ResourceType (ResourceType),
    INDEX IX_AuditLogs_PerformedAt (PerformedAt)
);

-- Sessions Table
CREATE TABLE Sessions (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    SessionToken NVARCHAR(256) NOT NULL UNIQUE,
    RefreshToken NVARCHAR(256) NULL,
    IpAddress NVARCHAR(45) NULL,
    UserAgent NVARCHAR(MAX) NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ExpiresAt DATETIME2 NOT NULL,
    LastActivityAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    TerminatedAt DATETIME2 NULL,
    TerminatedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT FK_Sessions_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    INDEX IX_Sessions_UserId (UserId),
    INDEX IX_Sessions_SessionToken (SessionToken),
    INDEX IX_Sessions_IsActive (IsActive),
    INDEX IX_Sessions_ExpiresAt (ExpiresAt)
);

-- MfaEnrollments Table
CREATE TABLE MfaEnrollments (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    MfaType NVARCHAR(50) NOT NULL, -- TOTP, SMS, Email, WebAuthn
    IsEnabled BIT NOT NULL DEFAULT 1,
    IsVerified BIT NOT NULL DEFAULT 0,
    Secret NVARCHAR(MAX) NULL, -- Encrypted
    PhoneNumber NVARCHAR(20) NULL,
    RecoveryCodes NVARCHAR(MAX) NULL, -- Encrypted JSON array
    EnrolledAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    LastUsedAt DATETIME2 NULL,
    CONSTRAINT FK_MfaEnrollments_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    INDEX IX_MfaEnrollments_UserId (UserId),
    INDEX IX_MfaEnrollments_MfaType (MfaType)
);

-- ApiKeys Table
CREATE TABLE ApiKeys (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NULL,
    Name NVARCHAR(256) NOT NULL,
    KeyHash NVARCHAR(256) NOT NULL UNIQUE,
    Prefix NVARCHAR(16) NOT NULL, -- First few chars for identification
    Scopes NVARCHAR(MAX) NOT NULL, -- JSON array
    IsActive BIT NOT NULL DEFAULT 1,
    ExpiresAt DATETIME2 NULL,
    LastUsedAt DATETIME2 NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    RevokedAt DATETIME2 NULL,
    RevokedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT FK_ApiKeys_Users FOREIGN KEY (UserId) REFERENCES Users(Id),
    INDEX IX_ApiKeys_UserId (UserId),
    INDEX IX_ApiKeys_KeyHash (KeyHash),
    INDEX IX_ApiKeys_IsActive (IsActive),
    INDEX IX_ApiKeys_ExpiresAt (ExpiresAt)
);

-- =====================================================================
-- Seed Data
-- =====================================================================

-- Insert default admin user (password: Admin@123 - MUST BE CHANGED)
INSERT INTO Users (Id, Email, NormalizedEmail, UserName, NormalizedUserName, PasswordHash, IsActive)
VALUES (
    NEWID(),
    'admin@gestaoacessos.local',
    'ADMIN@GESTAOACESSOS.LOCAL',
    'admin',
    'ADMIN',
    'AQAAAAIAAYagAAAAEJ4kVqZ8xG5qNP5xGkYvZ7vF0qNz3KJYc+0xZyLqBmWqW5xJ3J2V8pN4kQ==', -- Hash placeholder
    1
);

-- Insert default roles
DECLARE @SuperAdminRoleId UNIQUEIDENTIFIER = NEWID();
DECLARE @AdminRoleId UNIQUEIDENTIFIER = NEWID();
DECLARE @ManagerRoleId UNIQUEIDENTIFIER = NEWID();
DECLARE @UserRoleId UNIQUEIDENTIFIER = NEWID();
DECLARE @ViewerRoleId UNIQUEIDENTIFIER = NEWID();

INSERT INTO Roles (Id, Name, NormalizedName, Description, IsSystemRole)
VALUES 
    (@SuperAdminRoleId, 'SuperAdmin', 'SUPERADMIN', 'Full system access with all permissions', 1),
    (@AdminRoleId, 'Admin', 'ADMIN', 'Administrative access to manage users and roles', 1),
    (@ManagerRoleId, 'Manager', 'MANAGER', 'Manage team members and approve access requests', 1),
    (@UserRoleId, 'User', 'USER', 'Standard user with basic permissions', 1),
    (@ViewerRoleId, 'Viewer', 'VIEWER', 'Read-only access to resources', 1);

-- Insert default resources
DECLARE @UsersResourceId UNIQUEIDENTIFIER = NEWID();
DECLARE @RolesResourceId UNIQUEIDENTIFIER = NEWID();
DECLARE @GroupsResourceId UNIQUEIDENTIFIER = NEWID();
DECLARE @AuditResourceId UNIQUEIDENTIFIER = NEWID();

INSERT INTO Resources (Id, Name, Description, ResourceType)
VALUES 
    (@UsersResourceId, 'Users', 'User management resource', 'API'),
    (@RolesResourceId, 'Roles', 'Role management resource', 'API'),
    (@GroupsResourceId, 'Groups', 'Group management resource', 'API'),
    (@AuditResourceId, 'AuditLogs', 'Audit log viewing resource', 'API');

-- Insert default permissions
INSERT INTO Permissions (ResourceId, Action, Name, Description)
VALUES 
    (@UsersResourceId, 'Create', 'Users.Create', 'Create new users'),
    (@UsersResourceId, 'Read', 'Users.Read', 'View user information'),
    (@UsersResourceId, 'Update', 'Users.Update', 'Update user information'),
    (@UsersResourceId, 'Delete', 'Users.Delete', 'Delete users'),
    (@RolesResourceId, 'Create', 'Roles.Create', 'Create new roles'),
    (@RolesResourceId, 'Read', 'Roles.Read', 'View roles'),
    (@RolesResourceId, 'Update', 'Roles.Update', 'Update roles'),
    (@RolesResourceId, 'Delete', 'Roles.Delete', 'Delete roles'),
    (@GroupsResourceId, 'Create', 'Groups.Create', 'Create new groups'),
    (@GroupsResourceId, 'Read', 'Groups.Read', 'View groups'),
    (@GroupsResourceId, 'Update', 'Groups.Update', 'Update groups'),
    (@GroupsResourceId, 'Delete', 'Groups.Delete', 'Delete groups'),
    (@AuditResourceId, 'Read', 'AuditLogs.Read', 'View audit logs');

GO
