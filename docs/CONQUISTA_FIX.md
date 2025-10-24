# Fix for "Conquista" (Achievements) Page React Hooks Error

## Problem

The application was experiencing a runtime error:
```
Uncaught Error: Rendered more hooks than during the previous render.
```

This error occurred on the Conquista (Achievements) page and was causing a blank screen.

## Root Cause

React hooks must be called:
1. **Unconditionally** - Never inside if statements, loops, or nested functions
2. **In the same order** - The number and order of hooks must be identical on every render
3. **At the top level** - Before any early returns or conditional rendering

The error "Rendered more hooks than during the previous render" indicates that the component was calling hooks conditionally or the number of hooks was changing between renders.

## Solution

### 1. Created `useUserPoints` Hook (`frontend/src/hooks/useUserPoints.ts`)

A custom hook that properly manages user points and achievements data:

```typescript
export function useUserPoints() {
  // All hooks called unconditionally at the top
  const [userPoints, setUserPoints] = useState<UserPoints>({...});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Data fetching logic
  }, []);

  return { userPoints, isLoading, error };
}
```

**Key Points:**
- All `useState` and `useEffect` hooks are called unconditionally
- No conditional hook calls
- Returns data in a consistent structure

### 2. Created Conquistas Page (`frontend/src/app/conquistas/page.tsx`)

The page component uses the hook correctly:

```typescript
export default function Conquistas() {
  // CRITICAL: Hook called FIRST, unconditionally
  const { userPoints, isLoading, error } = useUserPoints();

  // Early returns come AFTER all hooks
  if (error) return <ErrorView />;
  if (isLoading) return <LoadingView />;

  return <MainView />;
}
```

**Key Points:**
- Hook is called at the very top of the component
- All conditional rendering happens AFTER the hook call
- This ensures the same number of hooks execute on every render

### 3. Additional Improvements

- **Next.js Link Component**: Used `<Link>` instead of `<a>` for client-side navigation
- **System Fonts**: Removed Google Fonts dependency to avoid network issues
- **Consistent Mock Data**: Fixed timestamps to be static instead of regenerating
- **ESLint Configuration**: Added proper linting configuration
- **Updated .gitignore**: Excluded TypeScript build cache files

## Verification

All checks passed:
- ✅ TypeScript type checking
- ✅ ESLint linting  
- ✅ Production build
- ✅ CodeQL security scan (0 issues)

## Testing

To test the fix:

```bash
cd frontend
npm install
npm run dev
```

Then navigate to `http://localhost:3000/conquistas` to see the Achievements page.

## References

- [React Hooks Rules](https://react.dev/reference/rules/rules-of-hooks)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Custom Hooks Best Practices](https://react.dev/learn/reusing-logic-with-custom-hooks)
