# Nero Mobile — Task Completion Checklist

When completing a task:

1. **Lint check**: Run `pnpm lint` and fix any errors
2. **Build check**: Ensure no TypeScript errors 
3. **Verify imports**: All imports resolve correctly with `@/src/` alias
4. **API consistency**: If backend was modified, regenerate API client with `pnpm generate-api`
5. **Clean code**: No unused imports, no console.log statements
6. **Accessibility**: Ensure interactive elements have proper a11y roles
7. **Components**: Modular components in `src/components/ui/`, one per file
8. **NativeWind**: Use Tailwind tokens, avoid arbitrary values
