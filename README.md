# Gestão de Acessos - Access Management System

Complete access management system with comprehensive user, role, permission, group, policy, and audit management capabilities.

## 🌟 Features

### Core Capabilities
- **User Management**: Create, update, lock/unlock users with detailed tracking
- **Role-Based Access Control (RBAC)**: Define roles with granular permissions
- **Attribute-Based Access Control (ABAC)**: Policy-based access with conditional rules
- **Group & Team Management**: Organize users with role inheritance
- **Access Request Workflow**: Two-stage approval process with SLA tracking
- **Policy Management**: Define access policies by attributes (unit, team, region, time)
- **Audit Logging**: Immutable audit trail with integrity verification
- **Multi-Factor Authentication (MFA)**: TOTP, SMS, Email, WebAuthn support
- **Session Management**: Track and terminate user sessions
- **API Key Management**: Create, rotate, and manage API keys with scopes

### Security Features
- JWT-based authentication
- Scoped permissions (Global, Unit, Team, Resource)
- Password hashing (Argon2/bcrypt)
- Encrypted secrets and credentials
- CSRF and XSS protection
- Rate limiting
- Integrity hash verification for audit logs
- Soft delete with retention

### UX Features
- Responsive design (mobile, tablet, desktop)
- Keyboard navigation
- Screen reader support (WCAG 2.1 AA)
- Bulk operations
- CSV exports
- Real-time filtering and search
- Timeline view for audit logs
- Internationalization (pt-BR, en-US)

## 📋 Technology Stack

### Backend
- **Framework**: ASP.NET Core 8
- **ORM**: Entity Framework Core
- **Database**: SQL Server
- **Authentication**: JWT Bearer Tokens
- **Authorization**: Policy-based with custom handlers

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Radix UI
- **Forms**: React Hook Form + Zod validation

## 🚀 Getting Started

### Prerequisites
- .NET 8 SDK
- Node.js 20+
- SQL Server 2019+ or Azure SQL Database

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend/GestaoAcessos.Api
```

2. Restore dependencies:
```bash
dotnet restore
```

3. Update database connection string in `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=GestaoAcessos;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```

4. Run database migrations:
```bash
dotnet ef database update
```

5. Run the API:
```bash
dotnet run
```

API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

4. Run development server:
```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

## ✅ System Validation

### Automated Validation Script

Run the automated validation script to check system readiness:

```bash
./validate-system.sh
```

This script validates:
- ✅ Prerequisites installation (.NET, Node.js, npm)
- ✅ Backend build status
- ✅ Frontend configuration
- ✅ Documentation completeness
- ⚠️ Security features status
- ⚠️ Database configuration
- ✅ Project structure

### Health Check Endpoints

The backend API includes health check endpoints for monitoring:

```bash
# Basic health check
curl http://localhost:5000/api/v1/health

# Detailed readiness check
curl http://localhost:5000/api/v1/health/ready

# Liveness check
curl http://localhost:5000/api/v1/health/live

# System information
curl http://localhost:5000/api/v1/health/info
```

### System Readiness Status

**Development Environment**: ✅ **READY**
- System can be built and run locally
- Core features can be developed and tested

**Production Environment**: ❌ **NOT READY**
- Critical security features must be implemented
- See [System Readiness Report](docs/SYSTEM_READINESS_REPORT.md) for details

For complete validation results and production readiness checklist, see:
- [System Readiness Report](docs/SYSTEM_READINESS_REPORT.md)
- [Security Checklist](docs/security-checklist.md)

## 📁 Project Structure

```
gestaoprojetossuprimetos/
├── backend/
│   └── GestaoAcessos.Api/
│       ├── Authorization/          # Authorization policies and handlers
│       ├── Controllers/            # API controllers
│       ├── Models/
│       │   ├── Domain/            # Domain entities
│       │   └── DTOs/              # Data transfer objects
│       ├── Services/              # Business logic services
│       └── Data/                  # DbContext and repositories
│
├── frontend/
│   └── src/
│       ├── app/                   # Next.js app router pages
│       │   └── access-management/ # Main access management page
│       ├── components/            # React components
│       │   └── access-management/ # Access management UI components
│       ├── lib/                   # Utilities and helpers
│       ├── types/                 # TypeScript type definitions
│       └── styles/                # Global styles
│
└── docs/
    ├── database-schema.sql        # SQL Server database schema
    ├── api-endpoints.md           # API documentation
    ├── security-checklist.md      # Security implementation checklist
    └── ux-design-wireframe.md     # UX design and wireframes
```

## 🔐 Security

See [docs/security-checklist.md](docs/security-checklist.md) for comprehensive security implementation status and recommendations.

### Key Security Features
- ✅ Role and permission-based authorization
- ✅ Scoped access control
- ✅ Audit logging with integrity hashing
- ✅ MFA support structure
- ⚠️ Password hashing (to be implemented)
- ⚠️ Secrets encryption (to be implemented)
- ⚠️ Rate limiting (to be implemented)
- ⚠️ CSRF protection (to be implemented)

### Known Risks
See [docs/security-checklist.md](docs/security-checklist.md#known-risks) for detailed risk assessment.

## 📖 API Documentation

See [docs/api-endpoints.md](docs/api-endpoints.md) for complete API documentation with request/response examples.

### Quick Examples

**List Users**:
```bash
GET /api/v1/users?page=1&pageSize=20&status=active
```

**Create User**:
```bash
POST /api/v1/users
{
  "email": "user@example.com",
  "userName": "newuser",
  "roles": [{"roleId": "...", "scopeType": "Global"}]
}
```

**Assign Role**:
```bash
POST /api/v1/users/{id}/roles
{
  "roles": [{"roleId": "...", "scopeType": "Team", "scopeId": "..."}],
  "reason": "Promotion"
}
```

## 🎨 UI Components

### Main Tabs
1. **Usuários (Users)**: User management with search, filters, bulk operations
2. **Papéis e Permissões (Roles & Permissions)**: Permission matrix and role management
3. **Grupos e Equipes (Groups & Teams)**: Group management with role inheritance
4. **Solicitações de Acesso (Access Requests)**: Approval workflow with SLA
5. **Políticas de Acesso (Access Policies)**: ABAC policy builder
6. **Auditoria e Logs (Audit & Logs)**: Audit trail with timeline view
7. **Tokens e Integrações (Tokens & Integrations)**: API key and SSO management

### Key Features
- Responsive table with pagination
- Advanced filters (status, role, group, MFA, date range)
- Bulk actions (assign role, require MFA, lock/unlock)
- Details drawer with user timeline
- Effective permissions view
- Active session management

## 🧪 Testing

### Backend Tests
```bash
cd backend/GestaoAcessos.Api.Tests
dotnet test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📦 Build & Deployment

### Backend
```bash
cd backend/GestaoAcessos.Api
dotnet publish -c Release -o ./publish
```

### Frontend
```bash
cd frontend
npm run build
npm start
```

## 🌍 Internationalization

Supported locales:
- `pt-BR`: Portuguese (Brazil) - Default
- `en-US`: English (United States)

To add new locale, update `next.config.js` and create translation files in `frontend/src/locales/`.

## 🔧 Configuration

### Backend Configuration
Key settings in `appsettings.json`:
- Connection strings
- JWT settings (secret, expiration)
- CORS origins
- Logging levels
- Rate limiting rules

### Frontend Configuration
Environment variables in `.env.local`:
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_ENV`: Environment (development, staging, production)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Add tests for new features
- Update documentation
- Run linters before committing
- Keep commits atomic and descriptive

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Known Issues

For a complete assessment of system readiness and known issues, see the [System Readiness Report](docs/SYSTEM_READINESS_REPORT.md).

### Critical Issues for Production

1. MFA implementation is structural only - TOTP/SMS/WebAuthn not fully implemented
2. Password hashing uses placeholder - must implement Argon2/bcrypt
3. API authentication not enforced - development only
4. Rate limiting not implemented
5. CSRF protection not implemented

See [docs/security-checklist.md](docs/security-checklist.md) for complete list.

## 🗺️ Roadmap

### Phase 1: Core Features (Current)
- [x] Database schema
- [x] Domain models
- [x] Authorization framework
- [x] User management API
- [x] Users tab UI
- [ ] Complete all tab UIs
- [ ] Integration tests

### Phase 2: Security Hardening
- [ ] Password hashing implementation
- [ ] Secrets encryption
- [ ] Rate limiting
- [ ] CSRF protection
- [ ] Complete MFA implementation

### Phase 3: Advanced Features
- [ ] SSO integration (OAuth, SAML)
- [ ] SCIM provisioning
- [ ] Advanced policy builder UI
- [ ] Real-time notifications
- [ ] Webhooks
- [ ] Mobile app

### Phase 4: Enterprise Features
- [ ] Multi-tenancy
- [ ] Advanced reporting
- [ ] Compliance dashboard
- [ ] Risk scoring
- [ ] ML-based anomaly detection

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check documentation in `docs/` folder
- Review API documentation

---

**Version**: 1.0.0  
**Last Updated**: 2025-10-24  
**Maintainers**: Development Team
