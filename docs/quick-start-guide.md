# Quick Start Guide - Gestão de Acessos

This guide will help you get the Access Management System running on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

### Required
- **.NET 8 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/8.0)
- **Node.js 20+** - [Download](https://nodejs.org/)
- **SQL Server 2019+** or **Azure SQL Database** - [Download SQL Server Express](https://www.microsoft.com/sql-server/sql-server-downloads)

### Recommended
- **Visual Studio 2022** or **VS Code** with C# extension
- **SQL Server Management Studio (SSMS)** or **Azure Data Studio**
- **Git** for version control

## Step 1: Clone the Repository

```bash
git clone https://github.com/pietrolima01/gestaoprojetossuprimetos.git
cd gestaoprojetossuprimetos
```

## Step 2: Database Setup

### Option A: Local SQL Server

1. **Open SQL Server Management Studio** and connect to your local instance

2. **Create a new database**:
```sql
CREATE DATABASE GestaoAcessos;
GO
```

3. **Run the schema script**:
   - Open `docs/database-schema.sql`
   - Execute it against the `GestaoAcessos` database
   - This will create all tables and seed initial data

### Option B: Azure SQL Database

1. **Create Azure SQL Database** in Azure Portal
2. **Configure firewall** to allow your IP
3. **Run the schema script** using Azure Data Studio or SSMS

## Step 3: Backend Configuration

1. **Navigate to backend directory**:
```bash
cd backend/GestaoAcessos.Api
```

2. **Update connection string** in `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=GestaoAcessos;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```

For Azure SQL, use:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=tcp:yourserver.database.windows.net,1433;Database=GestaoAcessos;User ID=yourusername;Password=yourpassword;Encrypt=True;TrustServerCertificate=False;"
  }
}
```

3. **Restore NuGet packages**:
```bash
dotnet restore
```

4. **Build the project**:
```bash
dotnet build
```

5. **Run the API**:
```bash
dotnet run
```

The API should start at `http://localhost:5000`

**Verify**: Open `http://localhost:5000/weatherforecast` in your browser - you should see JSON data.

## Step 4: Frontend Setup

1. **Navigate to frontend directory** (in a new terminal):
```bash
cd frontend
```

2. **Install dependencies**:
```bash
npm install
```

This will install:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Radix UI components
- And all other dependencies

3. **Create environment file** `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

4. **Run the development server**:
```bash
npm run dev
```

The frontend should start at `http://localhost:3000`

**Verify**: Open `http://localhost:3000` in your browser - you should see the home page.

## Step 5: Access the Application

1. **Open your browser** and navigate to:
   ```
   http://localhost:3000/access-management
   ```

2. **You should see**:
   - Tab navigation for all sections
   - Users tab with sample data
   - Filters and search functionality
   - User details drawer when clicking on a user

## Troubleshooting

### Backend Issues

#### "Cannot connect to database"
- Verify SQL Server is running
- Check connection string is correct
- Ensure database exists
- Check firewall settings

#### "Port 5000 already in use"
- Change port in `Properties/launchSettings.json`
- Update `NEXT_PUBLIC_API_URL` in frontend `.env.local`

#### Build errors
```bash
# Clean and rebuild
dotnet clean
dotnet restore
dotnet build
```

### Frontend Issues

#### "Module not found" errors
```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### "Port 3000 already in use"
```bash
# Use different port
npm run dev -- -p 3001
```

#### TypeScript errors
```bash
# Check TypeScript
npm run type-check
```

### Database Issues

#### "Login failed for user"
- For Windows Authentication: Ensure SQL Server allows Windows authentication
- For SQL Authentication: Verify username and password
- Check user has appropriate permissions

#### "Database does not exist"
```sql
-- Verify database exists
SELECT name FROM sys.databases WHERE name = 'GestaoAcessos';

-- Create if missing
CREATE DATABASE GestaoAcessos;
```

## Verification Checklist

After completing setup, verify:

- [ ] SQL Server is running
- [ ] Database `GestaoAcessos` exists with tables
- [ ] Backend runs without errors at `http://localhost:5000`
- [ ] Frontend runs without errors at `http://localhost:3000`
- [ ] Can access Access Management page at `http://localhost:3000/access-management`
- [ ] Can see Users tab with sample data
- [ ] Can click on a user to see details drawer

## Development Workflow

### Backend Development

1. **Make changes** to C# code
2. **Hot reload** should pick up changes automatically
3. If not, restart: `Ctrl+C` then `dotnet run`

### Frontend Development

1. **Make changes** to React/TypeScript code
2. **Hot reload** updates browser automatically
3. Check console for errors

### Database Changes

1. **Update** `docs/database-schema.sql`
2. **Apply changes** manually or create migration
3. **Test** with backend

## Next Steps After Setup

### For Backend Developers
1. Review `backend/GestaoAcessos.Api/Controllers/UsersController.cs`
2. Implement EF Core DbContext in `Data/` directory
3. Create repositories and services
4. Add unit tests in new `Tests/` project

### For Frontend Developers
1. Review `frontend/src/components/access-management/UsersTab.tsx`
2. Implement API integration
3. Complete other tab components
4. Add form validation

### For Full-Stack Developers
1. Connect frontend to backend API
2. Test end-to-end workflows
3. Implement authentication
4. Add comprehensive error handling

## Useful Commands

### Backend
```bash
# Build
dotnet build

# Run
dotnet run

# Run with watch (hot reload)
dotnet watch run

# Create migration (when EF Core is set up)
dotnet ef migrations add InitialCreate

# Update database
dotnet ef database update

# List packages
dotnet list package

# Add package
dotnet add package PackageName
```

### Frontend
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

### Database
```sql
-- Check tables
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE';

-- Check seed data
SELECT * FROM Roles;
SELECT * FROM Permissions;

-- Clear all data (development only!)
EXEC sp_MSforeachtable 'DELETE FROM ?';
```

## Environment Variables

### Backend (`appsettings.json`)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "your-connection-string"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  },
  "AllowedHosts": "*"
}
```

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_ENV=development
```

## IDE Setup

### Visual Studio Code

**Recommended Extensions**:
- C# (Microsoft)
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- SQL Server (mssql)

**Workspace Settings** (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[csharp]": {
    "editor.defaultFormatter": "ms-dotnettools.csharp"
  }
}
```

### Visual Studio 2022

1. Open `backend/GestaoAcessos.Api/GestaoAcessos.Api.csproj`
2. Set as startup project
3. Press F5 to run with debugging

## Support

### Documentation
- [README.md](../README.md) - Project overview
- [API Documentation](api-endpoints.md) - API reference
- [Security Checklist](security-checklist.md) - Security status
- [UX Wireframe](ux-design-wireframe.md) - UI design
- [Implementation Summary](implementation-summary.md) - What's implemented

### Common Issues
- Check GitHub Issues for known problems
- Review error messages carefully
- Ensure all prerequisites are installed
- Verify environment variables are set

---

**Setup Time**: ~15-30 minutes  
**Difficulty**: Beginner to Intermediate  
**Last Updated**: 2025-10-24
