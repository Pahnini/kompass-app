# Kompass App Style Guide

This document outlines the coding standards and style guidelines for the Kompass App project. Following these guidelines ensures consistent code quality and improves collaboration between team members.

## Table of Contents

1. [Code Formatting](#code-formatting)
2. [Development Environment Setup](#development-environment-setup)
3. [Using Formatting Tools](#using-formatting-tools)
4. [TypeScript Guidelines](#typescript-guidelines)
5. [React Best Practices](#react-best-practices)
6. [Fast Refresh Compatibility](#fast-refresh-compatibility)

## Code Formatting

The project uses the following tools for code formatting and linting:

### Prettier

Prettier is configured in `.prettierrc.json` with the following settings:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

Key formatting rules:

- Use semicolons at the end of statements
- Use single quotes for strings
- Use 2 spaces for indentation
- Add trailing commas in objects and arrays (ES5 compatible)
- Limit line length to 100 characters
- Include spaces inside object literals
- Avoid parentheses around single arrow function parameters

### EditorConfig

EditorConfig is used to maintain consistent coding styles across different editors and IDEs. The configuration is in `.editorconfig`:

```
root = true

[*]
end_of_line = lf
insert_final_newline = true
charset = utf-8
indent_style = space
indent_size = 2
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
```

### ESLint

ESLint is configured in `eslint.config.ts` using the new flat config format. It includes:

- JavaScript/JSX configuration
- TypeScript/TSX configuration
- React Hooks rules
- React Refresh rules
- Prettier integration

## Development Environment Setup

To ensure consistent code formatting across all development environments:

1. **Install Required Extensions in VSCode**:
   - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
   - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
   - [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)

2. **Use the Project's VSCode Settings**:
   - The project includes a `.vscode/settings.json` file with recommended settings
   - These settings will automatically apply when you open the project in VSCode

3. **Install Dependencies**:

   ```bash
   npm install
   ```

## Using Formatting Tools

The project includes several npm scripts to help maintain code quality:

### Formatting with Prettier

```bash
# Format all files
npm run format

# Check if files are formatted correctly without modifying them
npm run format:check
```

### Linting with ESLint

```bash
# Check for linting issues
npm run lint

# Fix linting issues automatically
npm run lint:fix
```

### TypeScript Type Checking

```bash
# Check for type errors
npm run type-check
```

### Recommended Workflow

Before committing code, run these commands to ensure your code follows the project standards:

```bash
npm run format      # Format all files
npm run lint:fix    # Fix linting issues
npm run type-check  # Check for type errors
```

## TypeScript Guidelines

- Use explicit types for function parameters and return values when they're not obvious
- Prefer interfaces for object types that will be extended
- Use type for complex types or unions
- Avoid using `any` type; use `unknown` if the type is truly unknown
- Use TypeScript's non-null assertion operator (`!`) sparingly

## React Best Practices

### Component Structure

- Use functional components with hooks instead of class components
- Keep components small and focused on a single responsibility
- Extract reusable logic into custom hooks
- Use named exports for components

### Props and State

- Use destructuring for props and state
- Define prop types using TypeScript interfaces
- Use default props when appropriate
- Keep state minimal and focused

### Context API Usage

- Create separate contexts for different concerns
- Memoize context values to prevent unnecessary re-renders
- Use `useCallback` for functions passed through context
- Keep context providers high in the component tree

## Fast Refresh Compatibility

To ensure React Fast Refresh works correctly:

1. **Memoize Functions and Objects**:
   - Use `useCallback` for event handlers and functions passed to child components
   - Use `useMemo` for computed values and objects

2. **Context Provider Optimization**:
   - Memoize context values with `useMemo`
   - Use `useCallback` for setter functions
   - Use functional updates for state that depends on previous state
   - Separate derived state calculations

3. **Component Exports**:
   - Follow the ESLint rule `react-refresh/only-export-components`
   - Avoid anonymous exports of components
   - Memoize components with `React.memo` when appropriate

4. **State Management**:
   - Use lazy initialization for state that requires expensive computation
   - Prefer functional updates (`setCount(c => c + 1)`) over direct updates (`setCount(count + 1)`)
   - Keep state as local as possible

### Example: Optimized Context Provider

```tsx
export function MyContextProvider({ children }) {
  // Use lazy initialization for state
  const [state, setState] = useState(() => initialValue);

  // Stable callback reference with useCallback
  const updateState = useCallback(newValue => {
    setState(newValue);
    // Additional side effects...
  }, []);

  // Memoize derived state
  const derivedValue = useMemo(() => computeValue(state), [state]);

  // Memoize the context value
  const value = useMemo(
    () => ({
      state,
      updateState,
      derivedValue,
    }),
    [state, updateState, derivedValue]
  );

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
}
```

By following these guidelines, you'll ensure that your code is consistent, maintainable, and works well with React's Fast Refresh feature.
