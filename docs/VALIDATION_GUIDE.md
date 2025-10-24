# System Validation Guide
**Gestão de Acessos - Access Management System**

This guide explains how to validate the system's readiness for development and production use.

---

## Quick Validation

### One-Command Validation

Run the automated validation script from the project root:

```bash
./validate-system.sh
```

This will:
- ✅ Check all prerequisites
- ✅ Validate backend build
- ✅ Validate frontend configuration
- ✅ Check documentation
- ⚠️ Analyze security features
- ⚠️ Verify database configuration
- ✅ Validate project structure

### Expected Output

```
==========================================
System Readiness Validation
Gestão de Acessos - Access Management System
==========================================

1. Checking Prerequisites...
----------------------------
✓ .NET SDK installed (version X.X.X)
✓ Node.js installed (version vX.X.X)
✓ npm installed (version X.X.X)

[... additional checks ...]

==========================================
Validation Summary
==========================================

Passed checks: XX
Warnings: X
Errors: X

✓ System appears ready for DEVELOPMENT use
```

---

## API Health Checks

### Start the Backend

```bash
cd backend/GestaoAcessos.Api
dotnet run
```

### Test Health Endpoints

Once the backend is running (http://localhost:5000), test the health endpoints:

#### 1. Basic Health Check

```bash
curl http://localhost:5000/api/v1/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "{current-timestamp}",
  "service": "Gestao de Acessos API",
  "version": "1.0.0"
}
```

#### 2. Readiness Check (Detailed)

```bash
curl http://localhost:5000/api/v1/health/ready
```

**Expected Response:**
```json
{
  "status": "ready_with_warnings",
  "timestamp": "{current-timestamp}",
  "service": "Gestao de Acessos API",
  "version": "1.0.0",
  "environment": "Development",
  "checks": [
    {
      "component": "Configuration",
      "status": "healthy",
      "message": "Configuration loaded"
    },
    {
      "component": "DatabaseConfiguration",
      "status": "warning",
      "message": "Database connection string not configured"
    },
    {
      "component": "Environment",
      "status": "healthy",
      "message": "Running in Development mode"
    }
  ],
  "warnings": [
    "System is NOT production-ready",
    "Critical security features must be implemented",
    "See docs/SYSTEM_READINESS_REPORT.md for details"
  ]
}
```

#### 3. Liveness Check

```bash
curl http://localhost:5000/api/v1/health/live
```

**Expected Response:**
```json
{
  "status": "alive",
  "timestamp": "{current-timestamp}"
}
```

#### 4. System Information

```bash
curl http://localhost:5000/api/v1/health/info
```

**Expected Response:**
```json
{
  "service": "Gestao de Acessos API",
  "version": "1.0.0",
  "description": "Access Management System",
  "environment": "Development",
  "timestamp": "{current-timestamp}",
  "capabilities": {
    "userManagement": true,
    "roleBasedAccessControl": true,
    "attributeBasedAccessControl": true,
    "groupManagement": true,
    "accessRequestWorkflow": true,
    "policyManagement": true,
    "auditLogging": true,
    "mfaSupport": true,
    "sessionManagement": true,
    "apiKeyManagement": true
  },
  "productionReady": false,
  "developmentReady": true,
  "documentation": {
    "readme": "/README.md",
    "api": "/docs/api-endpoints.md",
    "security": "/docs/security-checklist.md",
    "quickStart": "/docs/quick-start-guide.md",
    "readinessReport": "/docs/SYSTEM_READINESS_REPORT.md"
  }
}
```

---

## Validation Checklist

### Development Environment Setup

Use this checklist to ensure your development environment is ready:

#### Prerequisites
- [ ] .NET 8 SDK installed
- [ ] Node.js 20+ installed
- [ ] npm package manager available
- [ ] SQL Server installed (optional for basic validation)

#### Repository Setup
- [ ] Repository cloned
- [ ] Can navigate to project directory
- [ ] Validation script is executable (`chmod +x validate-system.sh`)

#### Backend Validation
- [ ] Backend project exists (`backend/GestaoAcessos.Api/`)
- [ ] Backend builds successfully (`dotnet build`)
- [ ] No compilation errors (warnings are acceptable)
- [ ] Controllers directory exists
- [ ] Models directory exists
- [ ] Authorization layer exists

#### Frontend Validation
- [ ] Frontend project exists (`frontend/`)
- [ ] `package.json` is present
- [ ] TypeScript configuration exists
- [ ] Next.js configuration exists
- [ ] Source directory exists (`frontend/src/`)
- [ ] Dependencies installed (`npm install`)

#### Documentation Validation
- [ ] README.md exists and is comprehensive
- [ ] API documentation exists (`docs/api-endpoints.md`)
- [ ] Security checklist exists (`docs/security-checklist.md`)
- [ ] Quick start guide exists (`docs/quick-start-guide.md`)
- [ ] System readiness report exists (`docs/SYSTEM_READINESS_REPORT.md`)

---

## Understanding Validation Results

### Status Indicators

#### ✅ Passed (Green)
- Feature/component is working correctly
- No action required for development

#### ⚠️ Warning (Yellow)
- Feature/component has issues but system can still run
- May need attention before production
- Review details and prioritize

#### ✗ Error (Red)
- Critical issue preventing functionality
- Must be fixed before proceeding
- System may not run properly

### Common Validation Scenarios

#### Scenario 1: All Green - Development Ready
```
Passed checks: 23+
Warnings: 0-2
Errors: 0
Status: ✓ System appears ready for DEVELOPMENT use
```
**Action**: Proceed with development

#### Scenario 2: Some Warnings - Development Ready with Caveats
```
Passed checks: 20+
Warnings: 3-5
Errors: 0-1
Status: ⚠ System has warnings but may work for DEVELOPMENT
```
**Action**: Review warnings, fix critical ones, proceed with caution

#### Scenario 3: Errors Present - Not Ready
```
Passed checks: <20
Warnings: 5+
Errors: 2+
Status: ✗ System is NOT ready - Critical errors found
```
**Action**: Fix errors before proceeding

---

## Validation for Different Environments

### Development Environment

**Minimum Requirements:**
- Backend builds successfully
- Frontend dependencies can be installed
- Documentation is available

**Run Validation:**
```bash
./validate-system.sh
```

**Expected Result:** Development Ready ✅

### Testing Environment

**Additional Requirements:**
- Frontend dependencies installed
- Backend can connect to database
- All APIs respond correctly

**Run Validation:**
```bash
# 1. Run validation script
./validate-system.sh

# 2. Start backend and test health
cd backend/GestaoAcessos.Api
dotnet run &
sleep 10
curl http://localhost:5000/api/v1/health/ready
```

**Expected Result:** Testing Ready ✅

### Production Environment

**Critical Requirements:**
- All security features implemented
- Database fully configured
- HTTPS/TLS enabled
- All tests passing
- Security audit completed

**Run Validation:**
```bash
./validate-system.sh
```

**Expected Result:** Currently **NOT READY** ❌

See [System Readiness Report](SYSTEM_READINESS_REPORT.md) for required improvements.

---

## Troubleshooting Validation Issues

### Issue: Backend Build Fails

**Symptom:**
```
✗ Backend has build warnings/errors
```

**Solution:**
```bash
cd backend/GestaoAcessos.Api
dotnet clean
dotnet restore
dotnet build
```

Review build output for specific errors.

### Issue: Frontend Dependencies Missing

**Symptom:**
```
⚠ Frontend dependencies not installed
```

**Solution:**
```bash
cd frontend
npm install
```

### Issue: Database Connection Missing

**Symptom:**
```
✗ Database connection configuration missing
```

**Solution:**

Add to `backend/GestaoAcessos.Api/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=GestaoAcessos;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```

### Issue: Health Endpoint Returns 404

**Symptom:**
```bash
curl http://localhost:5000/api/v1/health
# Returns: HTTP/1.1 404 Not Found
```

**Solution:**

Ensure `Program.cs` has controllers configured:
```csharp
var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure middleware and map controllers
app.MapControllers();

app.Run();
```

Then rebuild and restart:
```bash
dotnet build
dotnet run
```

### Issue: Permission Denied on Validation Script

**Symptom:**
```
bash: ./validate-system.sh: Permission denied
```

**Solution:**
```bash
chmod +x validate-system.sh
./validate-system.sh
```

---

## Continuous Validation

### During Development

Run validation after:
- Adding new features
- Making infrastructure changes
- Updating dependencies
- Before committing code

### In CI/CD Pipeline

Add to your CI/CD workflow:

```yaml
# Example GitHub Actions
- name: Validate System
  run: ./validate-system.sh
  
- name: Test Health Endpoints
  run: |
    cd backend/GestaoAcessos.Api
    dotnet run &
    sleep 10
    curl -f http://localhost:5000/api/v1/health || exit 1
```

### Regular Reviews

- **Weekly**: Quick validation during development
- **Before releases**: Full validation with all checks
- **Monthly**: Review security checklist and update readiness status

---

## Additional Resources

- **[System Readiness Report](SYSTEM_READINESS_REPORT.md)** - Comprehensive validation results
- **[Security Checklist](security-checklist.md)** - Security feature implementation status
- **[Quick Start Guide](quick-start-guide.md)** - Setup instructions
- **[API Documentation](api-endpoints.md)** - API reference

---

## Getting Help

If validation fails or you encounter issues:

1. **Check the logs**: Review validation script output carefully
2. **Review documentation**: See troubleshooting section above
3. **Check GitHub Issues**: Search for similar problems
4. **Create an issue**: Provide validation output and error messages

---

**Last Updated**: 2025-10-24  
**Script Version**: 1.0.0  
**Compatible With**: Gestão de Acessos v1.0.0
