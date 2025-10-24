# Gestão de Acessos - API Endpoints Documentation

## Base URL
```
https://api.gestaoacessos.local/api/v1
```

## Authentication
All endpoints require Bearer token authentication unless otherwise specified.

```http
Authorization: Bearer {access_token}
```

## Common Response Formats

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "meta": {
    "timestamp": "2025-10-24T15:00:00Z",
    "requestId": "uuid"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": []
  },
  "meta": {
    "timestamp": "2025-10-24T15:00:00Z",
    "requestId": "uuid"
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalPages": 5,
    "totalItems": 100,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

---

## 1. Users Management

### 1.1 List Users
```http
GET /users
```

**Query Parameters:**
- `page` (int, default: 1) - Page number
- `pageSize` (int, default: 20, max: 100) - Items per page
- `search` (string) - Search by name, email, or ID
- `status` (string) - Filter by status: active, inactive, locked
- `role` (uuid) - Filter by role ID
- `group` (uuid) - Filter by group ID
- `mfaEnabled` (boolean) - Filter by MFA status
- `sortBy` (string) - Sort field: name, email, createdAt, lastLoginAt
- `sortOrder` (string) - asc or desc

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "userName": "johndoe",
      "isActive": true,
      "isLocked": false,
      "lastLoginAt": "2025-10-24T10:30:00Z",
      "createdAt": "2025-01-01T00:00:00Z",
      "roles": [
        {
          "id": "uuid",
          "name": "User",
          "scope": {
            "type": "Global",
            "id": null
          }
        }
      ],
      "groups": ["Team Alpha", "Engineering"],
      "mfaEnabled": true
    }
  ],
  "pagination": { /* pagination info */ }
}
```

### 1.2 Get User Details
```http
GET /users/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "userName": "johndoe",
    "isActive": true,
    "isLocked": false,
    "lockedUntil": null,
    "lastLoginAt": "2025-10-24T10:30:00Z",
    "failedLoginAttempts": 0,
    "mustChangePwd": false,
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-10-24T10:30:00Z",
    "roles": [
      {
        "id": "uuid",
        "name": "User",
        "assignedAt": "2025-01-01T00:00:00Z",
        "assignedBy": "uuid",
        "expiresAt": null,
        "scope": {
          "type": "Global",
          "id": null
        }
      }
    ],
    "groups": [
      {
        "id": "uuid",
        "name": "Team Alpha",
        "isManager": false,
        "joinedAt": "2025-01-15T00:00:00Z"
      }
    ],
    "effectivePermissions": [
      {
        "resource": "Projects",
        "actions": ["Read", "Create", "Update"],
        "scope": {
          "type": "Team",
          "id": "uuid"
        }
      }
    ],
    "activeSessions": [
      {
        "id": "uuid",
        "ipAddress": "192.168.1.100",
        "userAgent": "Mozilla/5.0...",
        "createdAt": "2025-10-24T10:00:00Z",
        "lastActivityAt": "2025-10-24T10:30:00Z"
      }
    ],
    "mfaEnrollments": [
      {
        "id": "uuid",
        "type": "TOTP",
        "isEnabled": true,
        "isVerified": true,
        "enrolledAt": "2025-01-01T00:00:00Z"
      }
    ]
  }
}
```

### 1.3 Create User
```http
POST /users
```

**Request:**
```json
{
  "email": "newuser@example.com",
  "userName": "newuser",
  "mustChangePwd": true,
  "roles": [
    {
      "roleId": "uuid",
      "scopeType": "Global",
      "scopeId": null
    }
  ],
  "groups": ["uuid1", "uuid2"],
  "reason": "New employee onboarding"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "newuser@example.com",
    "temporaryPassword": "Auto-generated-P@ssw0rd",
    "mustChangePwd": true
  }
}
```

### 1.4 Update User
```http
PUT /users/{id}
```

**Request:**
```json
{
  "userName": "updatedname",
  "isActive": true,
  "reason": "Update user information"
}
```

### 1.5 Assign Roles to User
```http
POST /users/{id}/roles
```

**Request:**
```json
{
  "roles": [
    {
      "roleId": "uuid",
      "scopeType": "Team",
      "scopeId": "team-uuid",
      "expiresAt": "2025-12-31T23:59:59Z"
    }
  ],
  "reason": "Promoted to team lead"
}
```

### 1.6 Revoke Role from User
```http
DELETE /users/{id}/roles/{roleId}
```

**Query Parameters:**
- `reason` (string, required) - Reason for revocation

### 1.7 Lock/Unlock User
```http
POST /users/{id}/lock
POST /users/{id}/unlock
```

**Request:**
```json
{
  "reason": "Security violation detected",
  "lockUntil": "2025-10-25T00:00:00Z"
}
```

### 1.8 Terminate User Sessions
```http
POST /users/{id}/sessions/terminate
```

**Request:**
```json
{
  "sessionIds": ["uuid1", "uuid2"], // Empty array = all sessions
  "reason": "Security incident"
}
```

### 1.9 Require MFA for User
```http
POST /users/{id}/mfa/require
```

**Request:**
```json
{
  "mfaType": "TOTP",
  "reason": "Security policy compliance"
}
```

### 1.10 Reset User MFA
```http
POST /users/{id}/mfa/reset
```

**Request:**
```json
{
  "reason": "User lost device"
}
```

### 1.11 Bulk Operations
```http
POST /users/bulk
```

**Request:**
```json
{
  "operation": "assignRole", // assignRole, requireMfa, lock, unlock, delete
  "userIds": ["uuid1", "uuid2", "uuid3"],
  "parameters": {
    "roleId": "uuid",
    "scopeType": "Global"
  },
  "reason": "Mass policy application"
}
```

---

## 2. Roles & Permissions Management

### 2.1 List Roles
```http
GET /roles
```

**Query Parameters:**
- `page` (int)
- `pageSize` (int)
- `search` (string)
- `includeSystemRoles` (boolean, default: true)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Manager",
      "description": "Team manager role",
      "isSystemRole": false,
      "permissionCount": 15,
      "userCount": 23,
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

### 2.2 Get Role Details with Permissions Matrix
```http
GET /roles/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Manager",
    "description": "Team manager role",
    "isSystemRole": false,
    "permissions": [
      {
        "id": "uuid",
        "resource": {
          "id": "uuid",
          "name": "Projects",
          "type": "API"
        },
        "action": "Create",
        "scopeType": "Team",
        "scopeId": null,
        "inherited": false
      }
    ],
    "users": [
      {
        "id": "uuid",
        "userName": "john",
        "email": "john@example.com",
        "scopeType": "Team",
        "scopeId": "team-uuid"
      }
    ]
  }
}
```

### 2.3 Create Role
```http
POST /roles
```

**Request:**
```json
{
  "name": "ProjectManager",
  "description": "Manages projects and team members",
  "permissions": [
    {
      "permissionId": "uuid",
      "scopeType": "Global"
    }
  ]
}
```

### 2.4 Update Role Permissions
```http
PUT /roles/{id}/permissions
```

**Request:**
```json
{
  "permissions": [
    {
      "permissionId": "uuid",
      "scopeType": "Team",
      "scopeId": null
    }
  ],
  "reason": "Updated role definition"
}
```

### 2.5 Get Permissions Matrix
```http
GET /permissions/matrix
```

**Response:**
```json
{
  "success": true,
  "data": {
    "resources": [
      {
        "id": "uuid",
        "name": "Users",
        "actions": ["Create", "Read", "Update", "Delete"]
      }
    ],
    "roles": [
      {
        "id": "uuid",
        "name": "Admin",
        "permissions": {
          "Users": {
            "Create": { "granted": true, "scopeType": "Global" },
            "Read": { "granted": true, "scopeType": "Global" },
            "Update": { "granted": true, "scopeType": "Global" },
            "Delete": { "granted": true, "scopeType": "Unit", "scopeId": null }
          }
        }
      }
    ],
    "conflicts": [
      {
        "resource": "Users",
        "action": "Delete",
        "roles": ["Admin", "Manager"],
        "description": "Conflicting scopes",
        "resolution": "Admin scope takes precedence (higher priority)"
      }
    ]
  }
}
```

---

## 3. Groups & Teams Management

### 3.1 List Groups
```http
GET /groups
```

**Query Parameters:**
- `page` (int)
- `pageSize` (int)
- `search` (string)
- `groupType` (string) - Team, Unit, Department

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Engineering Team",
      "groupType": "Team",
      "memberCount": 15,
      "roleCount": 3,
      "parentGroup": {
        "id": "uuid",
        "name": "Technology Department"
      },
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

### 3.2 Get Group Details
```http
GET /groups/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Engineering Team",
    "description": "Software engineering team",
    "groupType": "Team",
    "parentGroup": {
      "id": "uuid",
      "name": "Technology Department"
    },
    "members": [
      {
        "id": "uuid",
        "userName": "john",
        "email": "john@example.com",
        "isManager": true,
        "joinedAt": "2025-01-01T00:00:00Z"
      }
    ],
    "roles": [
      {
        "id": "uuid",
        "name": "Developer",
        "scopeType": "Team",
        "scopeId": "uuid"
      }
    ],
    "inheritedRoles": [
      {
        "id": "uuid",
        "name": "Employee",
        "from": "Technology Department",
        "scopeType": "Unit"
      }
    ]
  }
}
```

### 3.3 Create Group
```http
POST /groups
```

**Request:**
```json
{
  "name": "New Team",
  "description": "Description",
  "groupType": "Team",
  "parentGroupId": "uuid",
  "members": ["user-uuid1", "user-uuid2"],
  "roles": [
    {
      "roleId": "uuid",
      "scopeType": "Team"
    }
  ]
}
```

### 3.4 Add Members to Group
```http
POST /groups/{id}/members
```

**Request:**
```json
{
  "userIds": ["uuid1", "uuid2"],
  "isManager": false,
  "reason": "Team expansion"
}
```

### 3.5 Remove Member from Group
```http
DELETE /groups/{id}/members/{userId}
```

**Query Parameters:**
- `reason` (string, required)

---

## 4. Access Requests Management

### 4.1 List Access Requests
```http
GET /access-requests
```

**Query Parameters:**
- `page` (int)
- `pageSize` (int)
- `status` (string) - Pending, Approved, Rejected, Cancelled
- `requesterId` (uuid)
- `approverId` (uuid)
- `requestType` (string)
- `overdueSla` (boolean) - Filter requests past SLA deadline

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "requester": {
        "id": "uuid",
        "userName": "john",
        "email": "john@example.com"
      },
      "targetUser": {
        "id": "uuid",
        "userName": "jane"
      },
      "requestType": "RoleAssignment",
      "targetRole": {
        "id": "uuid",
        "name": "Manager"
      },
      "status": "Pending",
      "justification": "Promotion to team lead",
      "requestedAt": "2025-10-20T10:00:00Z",
      "slaDeadline": "2025-10-23T10:00:00Z",
      "requiredApprovals": 2,
      "approvals": [
        {
          "approver": {
            "id": "uuid",
            "userName": "manager1"
          },
          "level": 1,
          "status": "Approved",
          "approvedAt": "2025-10-20T15:00:00Z"
        },
        {
          "approver": {
            "id": "uuid",
            "userName": "manager2"
          },
          "level": 2,
          "status": "Pending"
        }
      ],
      "slaStatus": "OnTime"
    }
  ]
}
```

### 4.2 Create Access Request
```http
POST /access-requests
```

**Request:**
```json
{
  "targetUserId": "uuid", // null for self-request
  "requestType": "RoleAssignment",
  "targetRoleId": "uuid",
  "scopeType": "Team",
  "scopeId": "uuid",
  "justification": "Need access to manage team projects"
}
```

### 4.3 Approve/Reject Access Request
```http
POST /access-requests/{id}/approve
POST /access-requests/{id}/reject
```

**Request:**
```json
{
  "comments": "Approved based on manager recommendation",
  "applyImmediately": true
}
```

### 4.4 Cancel Access Request
```http
POST /access-requests/{id}/cancel
```

**Request:**
```json
{
  "reason": "Request no longer needed"
}
```

---

## 5. Policies Management

### 5.1 List Policies
```http
GET /policies
```

**Query Parameters:**
- `page` (int)
- `pageSize` (int)
- `policyType` (string) - RBAC, ABAC, MFA, SessionControl
- `isActive` (boolean)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Require MFA for Admins",
      "description": "All admin users must have MFA enabled",
      "policyType": "MFA",
      "isActive": true,
      "priority": 100,
      "conditions": {
        "roles": ["Admin", "SuperAdmin"],
        "mfaRequired": true
      },
      "effect": "Require",
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

### 5.2 Get Policy Details
```http
GET /policies/{id}
```

### 5.3 Create Policy
```http
POST /policies
```

**Request:**
```json
{
  "name": "Regional Access Control",
  "description": "Limit access based on region",
  "policyType": "ABAC",
  "priority": 50,
  "conditions": {
    "userAttributes": {
      "region": ["US", "EU"]
    },
    "resourceAttributes": {
      "dataClassification": "Regional"
    },
    "timeWindow": {
      "businessHours": true,
      "timezone": "UTC"
    }
  },
  "effect": "Allow"
}
```

### 5.4 Update Policy
```http
PUT /policies/{id}
```

### 5.5 Activate/Deactivate Policy
```http
POST /policies/{id}/activate
POST /policies/{id}/deactivate
```

---

## 6. Audit & Logs

### 6.1 List Audit Logs
```http
GET /audit-logs
```

**Query Parameters:**
- `page` (int)
- `pageSize` (int)
- `userId` (uuid)
- `action` (string)
- `resourceType` (string)
- `resourceId` (string)
- `startDate` (ISO 8601)
- `endDate` (ISO 8601)
- `ipAddress` (string)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user": {
        "id": "uuid",
        "userName": "admin",
        "email": "admin@example.com"
      },
      "action": "Users.Update",
      "resourceType": "User",
      "resourceId": "target-user-uuid",
      "description": "Updated user role assignment",
      "oldValues": {
        "roles": ["User"]
      },
      "newValues": {
        "roles": ["User", "Manager"]
      },
      "ipAddress": "192.168.1.100",
      "userAgent": "Mozilla/5.0...",
      "performedAt": "2025-10-24T10:30:00Z",
      "integrityHash": "sha256-hash"
    }
  ]
}
```

### 6.2 Verify Audit Log Integrity
```http
POST /audit-logs/verify-integrity
```

**Request:**
```json
{
  "logIds": ["uuid1", "uuid2"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "verified": true,
    "results": [
      {
        "logId": "uuid1",
        "isValid": true,
        "expectedHash": "sha256-hash",
        "actualHash": "sha256-hash"
      }
    ]
  }
}
```

### 6.3 Export Audit Logs
```http
GET /audit-logs/export
```

**Query Parameters:**
- Same as list audit logs
- `format` (string) - csv, json (default: csv)
- `timezone` (string) - IANA timezone (default: UTC)

**Response:**
CSV file with headers:
```
Timestamp,User,Email,Action,ResourceType,ResourceId,Description,IPAddress,UserAgent
```

---

## 7. Tokens & Integrations

### 7.1 List API Keys
```http
GET /api-keys
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "CI/CD Integration",
      "prefix": "gak_live_",
      "scopes": ["projects:read", "projects:write"],
      "isActive": true,
      "expiresAt": "2026-01-01T00:00:00Z",
      "lastUsedAt": "2025-10-24T09:00:00Z",
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

### 7.2 Create API Key
```http
POST /api-keys
```

**Request:**
```json
{
  "name": "New Integration",
  "scopes": ["users:read", "roles:read"],
  "expiresAt": "2026-12-31T23:59:59Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "New Integration",
    "apiKey": "gak_live_1234567890abcdefghijklmnopqrstuvwxyz",
    "prefix": "gak_live_",
    "scopes": ["users:read", "roles:read"],
    "expiresAt": "2026-12-31T23:59:59Z",
    "warning": "This key will only be shown once. Store it securely."
  }
}
```

### 7.3 Revoke API Key
```http
DELETE /api-keys/{id}
```

**Request:**
```json
{
  "reason": "Key compromised"
}
```

### 7.4 Rotate API Key
```http
POST /api-keys/{id}/rotate
```

**Response:**
Returns new API key with same scopes and expiration.

---

## 8. Sessions Management

### 8.1 List Active Sessions
```http
GET /sessions
```

**Query Parameters:**
- `userId` (uuid) - Filter by user

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user": {
        "id": "uuid",
        "userName": "john"
      },
      "ipAddress": "192.168.1.100",
      "userAgent": "Mozilla/5.0...",
      "isActive": true,
      "createdAt": "2025-10-24T08:00:00Z",
      "lastActivityAt": "2025-10-24T10:30:00Z",
      "expiresAt": "2025-10-25T08:00:00Z"
    }
  ]
}
```

### 8.2 Terminate Session
```http
DELETE /sessions/{id}
```

---

## Rate Limiting

All endpoints are rate limited:
- Standard endpoints: 100 requests per minute per user
- Authentication endpoints: 10 requests per minute per IP
- Bulk operations: 10 requests per minute per user

Rate limit headers:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1635072000
```

## Error Codes

- `AUTH_001` - Invalid credentials
- `AUTH_002` - Token expired
- `AUTH_003` - Insufficient permissions
- `AUTH_004` - MFA required
- `VAL_001` - Validation error
- `VAL_002` - Required field missing
- `BIZ_001` - Business rule violation
- `BIZ_002` - Conflicting operation
- `SYS_001` - System error
- `SYS_002` - Database error

## Webhooks

Configure webhooks to receive real-time notifications:

```http
POST /webhooks
```

**Request:**
```json
{
  "url": "https://your-app.com/webhook",
  "events": ["user.created", "user.role.assigned", "access-request.approved"],
  "secret": "your-webhook-secret"
}
```

**Webhook Payload:**
```json
{
  "event": "user.role.assigned",
  "timestamp": "2025-10-24T10:30:00Z",
  "data": {
    "userId": "uuid",
    "roleId": "uuid",
    "assignedBy": "uuid"
  },
  "signature": "sha256-hmac-signature"
}
```
