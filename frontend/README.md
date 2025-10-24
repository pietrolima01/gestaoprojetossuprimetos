# Frontend - Gestão de Acessos

Sistema de gestão de acessos com página de conquistas (achievements).

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📦 Available Scripts

- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 📁 Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── access-management/    # Access management page
│   ├── conquistas/           # Achievements page (NEW)
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/               # Reusable components
│   └── access-management/    # Access management components
├── hooks/                    # Custom React hooks
│   └── useUserPoints.ts      # User points/achievements hook (NEW)
└── styles/                   # Global styles
    └── globals.css
```

## 🏆 Features

### Conquistas (Achievements) Page

A new achievements system has been added at `/conquistas` that:

- Displays user points and level progression
- Shows unlocked and locked achievements
- Includes a progress bar for the current level
- Uses proper React hooks to avoid rendering errors

**Technical Implementation:**
- Custom `useUserPoints` hook for state management
- Proper React hooks usage (all hooks called unconditionally)
- Client-side component with 'use client' directive
- Mock data for development/testing

### Access Management

Complete access management interface with:
- User management
- Role-based access control
- Comprehensive UI components

## 🔧 Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Forms**: React Hook Form + Zod

## 🐛 Troubleshooting

### "Rendered more hooks than during the previous render"

This error has been fixed in the Conquistas page by ensuring all hooks are called unconditionally at the top level of the component. See `/docs/CONQUISTA_FIX.md` for details.

### Build Failures

If the build fails with network errors (e.g., Google Fonts), the layout has been updated to use system fonts instead.

## 📚 Documentation

- [Conquista Fix Documentation](../docs/CONQUISTA_FIX.md) - Details about the React hooks fix
- [Next.js Documentation](https://nextjs.org/docs)
- [React Hooks Rules](https://react.dev/reference/rules/rules-of-hooks)

## 🧪 Testing

Currently, the application uses mock data for the achievements system. In production, this should be replaced with actual API calls to your backend.

To test the Conquistas page:
1. Start the dev server: `npm run dev`
2. Navigate to http://localhost:3000/conquistas
3. You should see a page with user points, level, and achievements

## 📝 License

This project is part of the Gestão de Projetos Suprimentos system.
