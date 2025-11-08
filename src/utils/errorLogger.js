export const getErrorLogs = () => {
  try {
    const errorLogs = JSON.parse(localStorage.getItem('errorLogs') || '[]');
    const globalErrors = JSON.parse(localStorage.getItem('globalErrors') || '[]');
    const unhandledRejections = JSON.parse(localStorage.getItem('unhandledRejections') || '[]');
    
    return {
      errorLogs,
      globalErrors,
      unhandledRejections,
      total: errorLogs.length + globalErrors.length + unhandledRejections.length
    };
  } catch (e) {
    console.error('Failed to retrieve error logs:', e);
    return {
      errorLogs: [],
      globalErrors: [],
      unhandledRejections: [],
      total: 0
    };
  }
};

export const clearErrorLogs = () => {
  try {
    localStorage.removeItem('errorLogs');
    localStorage.removeItem('globalErrors');
    localStorage.removeItem('unhandledRejections');
    return true;
  } catch (e) {
    console.error('Failed to clear error logs:', e);
    return false;
  }
};

export const exportErrorLogs = () => {
  const logs = getErrorLogs();
  const dataStr = JSON.stringify(logs, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `error-logs-${new Date().toISOString().split('T')[0]}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

export const logError = (error, context = {}) => {
  console.error('Logged error:', error, context);
  
  const errorLog = {
    message: error.message || error.toString(),
    stack: error.stack,
    context,
    timestamp: new Date().toISOString()
  };
  
  try {
    const existingLogs = JSON.parse(localStorage.getItem('errorLogs') || '[]');
    existingLogs.push(errorLog);
    if (existingLogs.length > 50) {
      existingLogs.shift();
    }
    localStorage.setItem('errorLogs', JSON.stringify(existingLogs));
  } catch (e) {
    console.error('Failed to save error log:', e);
  }
};
