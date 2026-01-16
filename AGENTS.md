# AGENTS.md - Development Guidelines for Timezone Gantt Chart

This document provides comprehensive guidelines for AI agents working on this React + TypeScript timezone visualization project.

## Development Commands

### Build & Development
- `npm run dev` - Start development server with hot reload
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally

### Testing
- `npm test` - Run all tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test -- --run --testNamePattern="should display current time"` - Run specific test
- `npm run test -- --run --testPathPattern=TimezoneSelector` - Run tests for specific component

### Code Quality
- `npm run lint` - Check code style and linting rules
- `npm run lint:fix` - Auto-fix linting issues
- `npm run typecheck` - Run TypeScript type checking

## Code Style Guidelines

### Imports & Exports
- Use absolute imports with `@/` prefix for internal modules
- Group imports: React imports, third-party libraries, internal modules
- No default exports for React components - use named exports
- Import type-only imports with `import type` syntax

```typescript
// Good
import type { TimezoneDisplay } from '@/types';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { TimezoneSelector } from '@/components/TimezoneSelector';

// Bad
import React, { useState } from 'react';
import * as dateFns from 'date-fns';
```

### Formatting & Style
- 4-space indentation (configured in .editorconfig)
- Single quotes for strings
- Trailing commas in multiline structures
- Max line length: 100 characters
- Use semicolons

### TypeScript Types & Interfaces
- Strict TypeScript mode enabled
- Use `interface` for object shapes, `type` for unions/aliases
- PascalCase for interface/type names
- Required properties first, optional with `?`
- Generic constraints for reusable types

```typescript
// Good
interface TimezoneDisplay {
  id: string;
  name: string;
  offset: number;
  abbreviation: string;
  isSelected?: boolean;
}

type TimezoneAction =
  | { type: 'ADD_TIMEZONE'; payload: TimezoneDisplay }
  | { type: 'REMOVE_TIMEZONE'; payload: string };

// Bad
interface timezoneDisplay {
  id: string;
  name?: string;
  offset: number;
}
```

### Naming Conventions
- **Components**: PascalCase (e.g., `TimezoneGantt`, `TimeInput`)
- **Functions/Methods**: camelCase (e.g., `formatTimezone`, `calculateOffset`)
- **Variables**: camelCase (e.g., `selectedTimezones`, `currentTime`)
- **Constants**: UPPER_CASE (e.g., `DEFAULT_TIMEZONES`, `TIMEZONE_API_URL`)
- **Files**: PascalCase for components, camelCase for utilities
- **Directories**: camelCase (e.g., `components/`, `utils/`, `hooks/`)

### Error Handling
- Use try-catch for async operations
- Create custom error classes extending Error
- Handle timezone parsing errors gracefully
- Log errors with context information

```typescript
// Good
try {
  const timezone = parseTimezone(input);
  return formatTime(timezone);
} catch (error) {
  console.error('Failed to parse timezone:', { input, error });
  throw new TimezoneParseError(`Invalid timezone: ${input}`);
}

// Bad
const timezone = parseTimezone(input);
return formatTime(timezone); // No error handling
```

### React Patterns
- Functional components with hooks
- Custom hooks for complex logic
- useCallback for event handlers
- useMemo for expensive calculations
- Error boundaries for component isolation

### File Organization
```
src/
├── components/        # React components
│   ├── common/       # Shared components
│   └── features/     # Feature-specific components
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
├── types/            # TypeScript type definitions
├── constants/        # Application constants
└── styles/           # Global styles and themes
```

## Project-Specific Rules

### Timezone Handling
- Always use IANA timezone identifiers (e.g., 'America/New_York')
- Cache timezone calculations to avoid repeated computations
- Handle DST transitions automatically
- Validate timezone inputs before processing

### Date/Time Formatting
- Use date-fns for all date operations
- Consistent time formats across the application
- Localize times appropriately for user timezone

### Performance Considerations
- Memoize expensive timezone calculations
- Virtualize long lists of timezones
- Debounce user input for time changes
- Lazy load timezone data

## Agentic AI Guidelines

### When Making Changes
- Always run tests before committing
- Check TypeScript compilation
- Run linting and fix issues
- Test in multiple browsers if UI changes

### When Uncertain
- Ask for clarification on requirements
- Check existing patterns in codebase
- Reference this document for consistency
- Consider edge cases and error scenarios

### Code Review Expectations
- All changes require tests
- TypeScript types must be correct
- Code follows established patterns
- Performance impact considered