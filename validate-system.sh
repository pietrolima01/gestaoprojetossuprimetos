#!/bin/bash

# Gestão de Acessos - System Readiness Validation Script
# This script validates if the system is ready for use

set -e

echo "=========================================="
echo "System Readiness Validation"
echo "Gestão de Acessos - Access Management System"
echo "=========================================="
echo ""

VALIDATION_PASSED=0
VALIDATION_WARNINGS=0
VALIDATION_ERRORS=0

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
    VALIDATION_PASSED=$((VALIDATION_PASSED + 1))
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
    VALIDATION_WARNINGS=$((VALIDATION_WARNINGS + 1))
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
    VALIDATION_ERRORS=$((VALIDATION_ERRORS + 1))
}

print_info() {
    echo "  → $1"
}

echo "1. Checking Prerequisites..."
echo "----------------------------"

# Check .NET SDK
if command -v dotnet &> /dev/null; then
    DOTNET_VERSION=$(dotnet --version)
    print_success ".NET SDK installed (version $DOTNET_VERSION)"
else
    print_error ".NET SDK not found - Required for backend"
fi

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js installed (version $NODE_VERSION)"
else
    print_error "Node.js not found - Required for frontend"
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm installed (version $NPM_VERSION)"
else
    print_error "npm not found - Required for frontend"
fi

echo ""
echo "2. Backend Validation..."
echo "------------------------"

# Check if backend project exists
if [ -f "backend/GestaoAcessos.Api/GestaoAcessos.Api.csproj" ]; then
    print_success "Backend project file found"
    
    # Try to build backend
    cd backend/GestaoAcessos.Api
    if dotnet build --nologo --verbosity quiet > /dev/null 2>&1; then
        print_success "Backend builds successfully"
    else
        print_warning "Backend has build warnings/errors"
        print_info "Run 'cd backend/GestaoAcessos.Api && dotnet build' for details"
    fi
    cd ../..
else
    print_error "Backend project file not found"
fi

# Check backend configuration
if [ -f "backend/GestaoAcessos.Api/appsettings.json" ]; then
    print_success "Backend configuration file exists"
else
    print_error "Backend configuration file missing"
fi

# Check if Controllers exist
if [ -d "backend/GestaoAcessos.Api/Controllers" ]; then
    CONTROLLER_COUNT=$(find backend/GestaoAcessos.Api/Controllers -name "*.cs" 2>/dev/null | wc -l)
    if [ "$CONTROLLER_COUNT" -gt 0 ]; then
        print_success "Backend controllers found ($CONTROLLER_COUNT files)"
    else
        print_warning "No controller files found"
    fi
fi

# Check if Models exist
if [ -d "backend/GestaoAcessos.Api/Models" ]; then
    MODEL_COUNT=$(find backend/GestaoAcessos.Api/Models -name "*.cs" 2>/dev/null | wc -l)
    if [ "$MODEL_COUNT" -gt 0 ]; then
        print_success "Backend models found ($MODEL_COUNT files)"
    else
        print_warning "No model files found"
    fi
fi

echo ""
echo "3. Frontend Validation..."
echo "-------------------------"

# Check if frontend exists
if [ -f "frontend/package.json" ]; then
    print_success "Frontend package.json found"
    
    # Check if node_modules exists
    if [ -d "frontend/node_modules" ]; then
        print_success "Frontend dependencies installed"
    else
        print_warning "Frontend dependencies not installed"
        print_info "Run 'cd frontend && npm install' to install"
    fi
    
    # Check TypeScript config
    if [ -f "frontend/tsconfig.json" ]; then
        print_success "TypeScript configuration exists"
    else
        print_error "TypeScript configuration missing"
    fi
    
    # Check Next.js config
    if [ -f "frontend/next.config.js" ]; then
        print_success "Next.js configuration exists"
    else
        print_error "Next.js configuration missing"
    fi
    
    # Check src directory
    if [ -d "frontend/src" ]; then
        print_success "Frontend source directory exists"
    else
        print_error "Frontend source directory missing"
    fi
else
    print_error "Frontend package.json not found"
fi

echo ""
echo "4. Documentation Validation..."
echo "-------------------------------"

# Check README
if [ -f "README.md" ]; then
    print_success "README.md exists"
else
    print_error "README.md missing"
fi

# Check docs directory
if [ -d "docs" ]; then
    DOC_COUNT=$(find docs -name "*.md" 2>/dev/null | wc -l)
    if [ "$DOC_COUNT" -gt 0 ]; then
        print_success "Documentation files found ($DOC_COUNT files)"
    else
        print_warning "No documentation markdown files found"
    fi
    
    # Check specific critical docs
    if [ -f "docs/security-checklist.md" ]; then
        print_success "Security checklist documentation exists"
    else
        print_warning "Security checklist documentation missing"
    fi
    
    if [ -f "docs/api-endpoints.md" ]; then
        print_success "API endpoints documentation exists"
    else
        print_warning "API endpoints documentation missing"
    fi
    
    if [ -f "docs/quick-start-guide.md" ]; then
        print_success "Quick start guide exists"
    else
        print_warning "Quick start guide missing"
    fi
else
    print_warning "Documentation directory not found"
fi

echo ""
echo "5. Security Analysis..."
echo "-----------------------"

# Parse security checklist to count implemented vs not implemented features
if [ -f "docs/security-checklist.md" ]; then
    IMPLEMENTED_COUNT=$(grep -c "^- \[x\]" docs/security-checklist.md 2>/dev/null || echo "0")
    NOT_IMPLEMENTED_COUNT=$(grep -c "^- \[ \]" docs/security-checklist.md 2>/dev/null || echo "0")
    
    print_info "Security features implemented: $IMPLEMENTED_COUNT"
    print_info "Security features pending: $NOT_IMPLEMENTED_COUNT"
    
    if [ "$IMPLEMENTED_COUNT" -gt 0 ]; then
        print_success "Some security features are implemented"
    fi
    
    if [ "$NOT_IMPLEMENTED_COUNT" -gt "$IMPLEMENTED_COUNT" ]; then
        print_warning "Many security features still need implementation"
        print_info "See docs/security-checklist.md for details"
    fi
    
    # Check for known high priority risks
    if grep -q "### High Priority" docs/security-checklist.md; then
        print_warning "High priority security risks identified"
        print_info "Review 'Known Risks' section in docs/security-checklist.md"
    fi
fi

# Check if HTTPS/SSL is mentioned in config
if grep -q "UseHttps\|https://" backend/GestaoAcessos.Api/appsettings.json 2>/dev/null; then
    print_success "HTTPS configuration found"
else
    print_warning "HTTPS configuration not detected"
fi

echo ""
echo "6. Database Validation..."
echo "--------------------------"

# Check for database schema
if [ -f "docs/database-schema.sql" ]; then
    print_success "Database schema file exists"
    
    # Count tables in schema
    TABLE_COUNT=$(grep -c "CREATE TABLE" docs/database-schema.sql 2>/dev/null || echo "0")
    print_info "Database tables defined: $TABLE_COUNT"
else
    print_warning "Database schema file not found"
fi

# Check for database connection string in config
if grep -q "ConnectionStrings" backend/GestaoAcessos.Api/appsettings.json 2>/dev/null; then
    print_success "Database connection configuration exists"
else
    print_error "Database connection configuration missing"
fi

echo ""
echo "7. Project Structure Validation..."
echo "-----------------------------------"

# Check for LICENSE
if [ -f "LICENSE" ]; then
    print_success "LICENSE file exists"
else
    print_warning "LICENSE file missing"
fi

# Check for .gitignore
if [ -f ".gitignore" ]; then
    print_success ".gitignore file exists"
else
    print_warning ".gitignore file missing"
fi

# Check backend structure
if [ -d "backend/GestaoAcessos.Api/Authorization" ]; then
    print_success "Authorization layer exists"
else
    print_warning "Authorization layer not found"
fi

# Check frontend structure
if [ -d "frontend/src/components" ]; then
    print_success "Frontend components directory exists"
else
    print_warning "Frontend components directory not found"
fi

echo ""
echo "=========================================="
echo "Validation Summary"
echo "=========================================="
echo ""
echo -e "${GREEN}Passed checks: $VALIDATION_PASSED${NC}"
echo -e "${YELLOW}Warnings: $VALIDATION_WARNINGS${NC}"
echo -e "${RED}Errors: $VALIDATION_ERRORS${NC}"
echo ""

# Determine overall readiness
if [ "$VALIDATION_ERRORS" -eq 0 ] && [ "$VALIDATION_WARNINGS" -lt 5 ]; then
    echo -e "${GREEN}✓ System appears ready for DEVELOPMENT use${NC}"
    echo ""
    print_info "Next steps:"
    print_info "1. Install frontend dependencies: cd frontend && npm install"
    print_info "2. Configure database connection in backend/GestaoAcessos.Api/appsettings.json"
    print_info "3. Run backend: cd backend/GestaoAcessos.Api && dotnet run"
    print_info "4. Run frontend: cd frontend && npm run dev"
    EXIT_CODE=0
elif [ "$VALIDATION_ERRORS" -eq 0 ]; then
    echo -e "${YELLOW}⚠ System has warnings but may work for DEVELOPMENT${NC}"
    echo ""
    print_info "Review warnings above and address as needed"
    print_info "Check docs/security-checklist.md for security improvements"
    EXIT_CODE=0
else
    echo -e "${RED}✗ System is NOT ready - Critical errors found${NC}"
    echo ""
    print_info "Fix errors above before proceeding"
    EXIT_CODE=1
fi

echo ""
echo "=========================================="
echo "Production Readiness Assessment"
echo "=========================================="
echo ""

if [ -f "docs/security-checklist.md" ]; then
    echo -e "${YELLOW}⚠ WARNING: System is NOT ready for PRODUCTION use${NC}"
    echo ""
    print_info "Critical security features must be implemented before production:"
    print_info "• Password hashing (Argon2/bcrypt)"
    print_info "• MFA secrets encryption"
    print_info "• Rate limiting"
    print_info "• CSRF protection"
    print_info "• API key validation"
    print_info "• Session timeout"
    print_info "• Input sanitization"
    print_info "• CORS configuration"
    print_info ""
    print_info "See docs/security-checklist.md for complete list"
fi

echo ""
echo "For detailed status, see:"
echo "  • README.md - Project overview and setup"
echo "  • docs/security-checklist.md - Security implementation status"
echo "  • docs/quick-start-guide.md - Getting started guide"
echo "  • docs/api-endpoints.md - API documentation"
echo ""
echo "Validation completed at $(date)"
echo "=========================================="

exit $EXIT_CODE
