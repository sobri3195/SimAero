# Error Handling Tests

This document provides test scenarios to verify the error handling implementation.

## Test Scenarios

### 1. Test Global Error Handler

**Test Case**: Undefined Variable Reference
```javascript
// Add this to any component temporarily
console.log(undefinedVariable.property);
```

**Expected Behavior**:
- Error is caught by global error handler
- Error is logged to console
- Error is stored in localStorage under 'globalErrors'
- Application continues to run

**Verification**:
```javascript
// Check in browser console
JSON.parse(localStorage.getItem('globalErrors'))
```

---

### 2. Test Unhandled Promise Rejection

**Test Case**: Promise Without Catch
```javascript
// Add this to any component
Promise.reject(new Error('Test promise rejection'));
```

**Expected Behavior**:
- Rejection is caught by unhandledrejection handler
- Rejection is logged to console
- Rejection is stored in localStorage under 'unhandledRejections'
- No browser warning appears

**Verification**:
```javascript
// Check in browser console
JSON.parse(localStorage.getItem('unhandledRejections'))
```

---

### 3. Test React Error Boundary

**Test Case**: Component Rendering Error
```javascript
// Create a test component
const BuggyComponent = () => {
  const data = null;
  return <div>{data.property}</div>; // Will throw error
};

// Add to any page
<BuggyComponent />
```

**Expected Behavior**:
- Error is caught by ErrorBoundary
- User sees friendly error UI with:
  - Error icon
  - Indonesian message
  - "Coba Lagi" button
  - "Kembali ke Beranda" button
- In development: detailed error info shown
- Error stored in localStorage under 'errorLogs'

**Verification**:
```javascript
// Check in browser console
JSON.parse(localStorage.getItem('errorLogs'))
```

---

### 4. Test Error Logger Utility

**Test Case**: Manual Error Logging
```javascript
import { logError } from './utils/errorLogger';

try {
  throw new Error('Test manual logging');
} catch (error) {
  logError(error, { 
    component: 'TestComponent',
    action: 'testAction'
  });
}
```

**Expected Behavior**:
- Error is logged with context
- Error stored in localStorage
- Context information is preserved

---

### 5. Test Error Log Retrieval

**Test Case**: Get All Error Logs
```javascript
import { getErrorLogs } from './utils/errorLogger';

const logs = getErrorLogs();
console.log('All logs:', logs);
```

**Expected Result**:
```javascript
{
  errorLogs: [...],
  globalErrors: [...],
  unhandledRejections: [...],
  total: number
}
```

---

### 6. Test Error Log Export

**Test Case**: Export Logs to File
```javascript
import { exportErrorLogs } from './utils/errorLogger';

exportErrorLogs();
```

**Expected Behavior**:
- JSON file is downloaded
- Filename: `error-logs-YYYY-MM-DD.json`
- Contains all error logs in structured format

---

### 7. Test Error Log Clearing

**Test Case**: Clear All Logs
```javascript
import { clearErrorLogs } from './utils/errorLogger';

const success = clearErrorLogs();
console.log('Cleared:', success);
```

**Expected Behavior**:
- All localStorage error keys are removed
- Function returns true
- getErrorLogs() returns empty arrays

---

### 8. Test Error Boundary Recovery

**Test Case**: Try Again Button
1. Trigger a component error
2. Click "Coba Lagi" button

**Expected Behavior**:
- Error UI disappears
- Component attempts to re-render
- If error condition still exists, error UI shows again

**Test Case**: Back to Home Button
1. Trigger a component error
2. Click "Kembali ke Beranda" button

**Expected Behavior**:
- Navigates to home page (/)
- Error UI disappears
- Application state is preserved

---

### 9. Test Log Rotation

**Test Case**: Exceed 50 Error Limit
```javascript
// Generate 60 errors
for (let i = 0; i < 60; i++) {
  Promise.reject(new Error(`Test error ${i}`));
}

// Wait a moment, then check
setTimeout(() => {
  const logs = JSON.parse(localStorage.getItem('unhandledRejections'));
  console.log('Log count:', logs.length); // Should be 50
  console.log('Oldest error:', logs[0]); // Should be error #10
  console.log('Newest error:', logs[49]); // Should be error #59
}, 1000);
```

**Expected Behavior**:
- Only last 50 errors are retained
- Oldest errors are automatically removed
- Newest errors are preserved

---

### 10. Test Error Handling in Async Operations

**Test Case**: Async/Await Without Try-Catch
```javascript
const fetchData = async () => {
  throw new Error('Async operation failed');
};

fetchData(); // No await or catch
```

**Expected Behavior**:
- Error caught by unhandledrejection handler
- Error logged and stored
- Application continues running

---

## Automated Test Suite

You can create automated tests using the following template:

```javascript
describe('Error Handling', () => {
  beforeEach(() => {
    // Clear error logs before each test
    localStorage.removeItem('globalErrors');
    localStorage.removeItem('unhandledRejections');
    localStorage.removeItem('errorLogs');
  });

  test('should catch global errors', () => {
    // Trigger global error
    window.dispatchEvent(new ErrorEvent('error', {
      error: new Error('Test error'),
      message: 'Test error',
      filename: 'test.js',
      lineno: 1,
      colno: 1
    }));

    // Verify error was logged
    const logs = JSON.parse(localStorage.getItem('globalErrors'));
    expect(logs).toHaveLength(1);
    expect(logs[0].message).toBe('Test error');
  });

  test('should catch unhandled rejections', () => {
    // Trigger unhandled rejection
    window.dispatchEvent(new PromiseRejectionEvent('unhandledrejection', {
      reason: new Error('Test rejection'),
      promise: Promise.reject()
    }));

    // Verify rejection was logged
    const logs = JSON.parse(localStorage.getItem('unhandledRejections'));
    expect(logs).toHaveLength(1);
    expect(logs[0].reason).toContain('Test rejection');
  });

  test('should limit logs to 50 entries', () => {
    // Create 60 errors
    for (let i = 0; i < 60; i++) {
      window.dispatchEvent(new ErrorEvent('error', {
        error: new Error(`Error ${i}`),
        message: `Error ${i}`
      }));
    }

    // Verify only 50 logs retained
    const logs = JSON.parse(localStorage.getItem('globalErrors'));
    expect(logs).toHaveLength(50);
  });
});
```

## Manual Testing Checklist

- [ ] Global error handler catches runtime errors
- [ ] Unhandled promise rejections are caught
- [ ] React ErrorBoundary displays error UI
- [ ] Error logs are stored in localStorage
- [ ] Log rotation works (max 50 entries)
- [ ] getErrorLogs() returns all logs
- [ ] clearErrorLogs() removes all logs
- [ ] exportErrorLogs() downloads JSON file
- [ ] logError() stores errors with context
- [ ] "Coba Lagi" button works
- [ ] "Kembali ke Beranda" button works
- [ ] Development mode shows detailed errors
- [ ] Production mode hides technical details
- [ ] Errors don't crash the application
- [ ] Console logs show error information

## Testing in Different Environments

### Development Mode
1. Start the app: `npm start`
2. Open browser console
3. Run test scenarios
4. Verify detailed error information is visible

### Production Build
1. Build the app: `npm run build`
2. Serve: `serve -s build`
3. Run test scenarios
4. Verify user-friendly messages (no technical details)
5. Verify errors still logged to localStorage

## Common Issues and Solutions

### Issue: Errors not being caught
**Solution**: Ensure error occurs during runtime, not during build

### Issue: Logs not appearing in localStorage
**Solution**: Check browser's localStorage quota and permissions

### Issue: Error UI not showing
**Solution**: Verify ErrorBoundary wraps the component with the error

### Issue: "Coba Lagi" button doesn't work
**Solution**: Error condition must be resolved before retry succeeds

## Performance Testing

Verify error handling doesn't impact performance:

1. Use browser DevTools Performance tab
2. Trigger multiple errors
3. Check for performance degradation
4. Verify localStorage operations are fast
5. Monitor memory usage

**Expected**: Minimal performance impact (<5ms per error)

## Browser Compatibility

Test error handling in:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

All error handlers should work consistently across browsers.
