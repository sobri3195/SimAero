# Error Handling Implementation

## Overview

This project now includes comprehensive error handling to catch and log unhandled errors and promise rejections. The implementation consists of three layers:

### 1. Global Error Handler (window.error)

Located in `src/index.js`, this handler catches all unhandled JavaScript errors that occur in the application.

**Features:**
- Catches runtime errors that aren't caught by try-catch blocks
- Logs error details including filename, line number, and stack trace
- Stores errors in localStorage under the key `globalErrors`
- Maintains a rolling log of the last 50 errors

**Example errors caught:**
- Syntax errors
- Reference errors (undefined variables)
- Type errors
- Network errors

### 2. Unhandled Promise Rejection Handler

Located in `src/index.js`, this handler catches all unhandled promise rejections.

**Features:**
- Catches promise rejections that don't have a `.catch()` handler
- Logs rejection reason and stack trace
- Stores rejections in localStorage under the key `unhandledRejections`
- Maintains a rolling log of the last 50 rejections
- Prevents default browser behavior (prevents "Unhandled Promise Rejection" warnings in console)

**Example rejections caught:**
- Failed API calls without error handling
- Async/await errors without try-catch
- Failed fetch requests
- Database operation failures

### 3. React Error Boundary

Located in `src/components/common/ErrorBoundary.js`, this component catches React component errors.

**Features:**
- Catches errors during rendering, lifecycle methods, and in constructors
- Displays user-friendly error UI
- Shows detailed error information in development mode
- Stores errors in localStorage under the key `errorLogs`
- Maintains a rolling log of the last 50 errors
- Provides "Try Again" and "Back to Home" buttons for recovery

**Example errors caught:**
- Component rendering errors
- Null/undefined property access in JSX
- Invalid prop types
- State update errors

## Error Log Storage

All errors are stored in browser localStorage for debugging purposes:

### Storage Keys:
- `globalErrors` - Global JavaScript errors
- `unhandledRejections` - Unhandled promise rejections
- `errorLogs` - React component errors

### Log Format:
Each error log entry contains:
```json
{
  "message": "Error message",
  "stack": "Full stack trace",
  "timestamp": "ISO 8601 timestamp",
  "source": "filename (for global errors)",
  "lineno": "line number (for global errors)",
  "colno": "column number (for global errors)",
  "componentStack": "React component stack (for React errors)"
}
```

### Log Limits:
- Maximum 50 entries per log type
- Older entries are automatically removed (FIFO - First In, First Out)
- Logs persist across browser sessions

## Error Logger Utility

Located in `src/utils/errorLogger.js`, this utility provides functions to manage error logs.

### Available Functions:

#### `getErrorLogs()`
Returns all stored error logs.

```javascript
import { getErrorLogs } from './utils/errorLogger';

const logs = getErrorLogs();
console.log('Total errors:', logs.total);
console.log('Error logs:', logs.errorLogs);
console.log('Global errors:', logs.globalErrors);
console.log('Unhandled rejections:', logs.unhandledRejections);
```

#### `clearErrorLogs()`
Clears all stored error logs.

```javascript
import { clearErrorLogs } from './utils/errorLogger';

clearErrorLogs();
```

#### `exportErrorLogs()`
Downloads all error logs as a JSON file.

```javascript
import { exportErrorLogs } from './utils/errorLogger';

exportErrorLogs(); // Downloads error-logs-YYYY-MM-DD.json
```

#### `logError(error, context)`
Manually logs an error with additional context.

```javascript
import { logError } from './utils/errorLogger';

try {
  // Some code
} catch (error) {
  logError(error, { 
    component: 'MyComponent',
    action: 'fetchData',
    userId: currentUser.id 
  });
}
```

## User Experience

### Development Mode
- Detailed error information is displayed
- Full stack traces are visible
- Component stack traces are shown
- Error logs are accessible in console

### Production Mode
- User-friendly error messages in Indonesian
- No technical details exposed to users
- Suggestion to contact administrator
- Error details are still logged for debugging

## Testing Error Handling

### Test Global Error Handler:
```javascript
// Throw an error anywhere in the code
throw new Error('Test global error');
```

### Test Unhandled Promise Rejection:
```javascript
// Create a promise that rejects without catch
Promise.reject('Test rejection');

// Or use async/await without try-catch
async function test() {
  throw new Error('Test async error');
}
test(); // Call without await or catch
```

### Test React Error Boundary:
```javascript
// In any component
const BuggyComponent = () => {
  throw new Error('Test React error');
  return <div>This won't render</div>;
};
```

## Best Practices

### Do's:
✅ Use try-catch for async operations
✅ Add .catch() to all promises
✅ Use the ErrorBoundary for component-level error isolation
✅ Use logError() for caught errors that need tracking
✅ Check error logs during testing
✅ Export and review error logs periodically

### Don'ts:
❌ Don't swallow errors silently (empty catch blocks)
❌ Don't expose sensitive information in error messages
❌ Don't rely solely on error boundaries for all errors
❌ Don't forget to test error scenarios
❌ Don't let error logs grow indefinitely (they auto-limit to 50)

## Monitoring and Debugging

### View Errors in Console:
All errors are logged to console with `console.error()` for immediate visibility during development.

### Access Stored Logs:
```javascript
// In browser console
JSON.parse(localStorage.getItem('globalErrors'))
JSON.parse(localStorage.getItem('unhandledRejections'))
JSON.parse(localStorage.getItem('errorLogs'))
```

### Clear Logs:
```javascript
// In browser console
localStorage.removeItem('globalErrors')
localStorage.removeItem('unhandledRejections')
localStorage.removeItem('errorLogs')

// Or use the utility function
import { clearErrorLogs } from './utils/errorLogger';
clearErrorLogs();
```

## Integration with Settings Page

You can integrate error log viewing and management into the Settings page:

```javascript
import { getErrorLogs, clearErrorLogs, exportErrorLogs } from '../utils/errorLogger';

function ErrorLogsSection() {
  const logs = getErrorLogs();

  return (
    <div>
      <h3>Error Logs ({logs.total} total)</h3>
      <button onClick={exportErrorLogs}>Export Logs</button>
      <button onClick={clearErrorLogs}>Clear Logs</button>
      
      <div>
        <h4>React Errors: {logs.errorLogs.length}</h4>
        <h4>Global Errors: {logs.globalErrors.length}</h4>
        <h4>Unhandled Rejections: {logs.unhandledRejections.length}</h4>
      </div>
    </div>
  );
}
```

## Future Enhancements

Potential improvements for the error handling system:

1. **Remote Logging**: Send errors to a backend logging service
2. **Error Analytics**: Track error frequency and patterns
3. **User Feedback**: Allow users to provide context when errors occur
4. **Error Recovery**: Implement automatic retry mechanisms
5. **Error Notifications**: Alert administrators of critical errors
6. **Performance Monitoring**: Track error impact on performance
7. **Error Categorization**: Classify errors by severity and type
8. **Integration with Sentry or similar services**

## Support

For questions or issues related to error handling:
1. Check the error logs using the utility functions
2. Review the console for detailed error information
3. Export logs and share with the development team
4. Check this documentation for best practices

## Version History

- **v1.0.0** (2024) - Initial implementation
  - Global error handler
  - Unhandled promise rejection handler
  - React Error Boundary component
  - Error logger utility
  - localStorage-based error persistence
