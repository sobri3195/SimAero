import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  
  const errorLog = {
    message: event.message || 'Unknown error',
    source: event.filename || 'unknown',
    lineno: event.lineno,
    colno: event.colno,
    error: event.error ? event.error.toString() : 'No error object',
    stack: event.error?.stack,
    timestamp: new Date().toISOString()
  };
  
  try {
    const existingLogs = JSON.parse(localStorage.getItem('globalErrors') || '[]');
    existingLogs.push(errorLog);
    if (existingLogs.length > 50) {
      existingLogs.shift();
    }
    localStorage.setItem('globalErrors', JSON.stringify(existingLogs));
  } catch (e) {
    console.error('Failed to save global error log:', e);
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  
  const errorLog = {
    type: 'unhandledrejection',
    reason: event.reason?.toString() || 'Unknown reason',
    promise: 'Promise object',
    stack: event.reason?.stack,
    timestamp: new Date().toISOString()
  };
  
  try {
    const existingLogs = JSON.parse(localStorage.getItem('unhandledRejections') || '[]');
    existingLogs.push(errorLog);
    if (existingLogs.length > 50) {
      existingLogs.shift();
    }
    localStorage.setItem('unhandledRejections', JSON.stringify(existingLogs));
  } catch (e) {
    console.error('Failed to save unhandled rejection log:', e);
  }

  event.preventDefault();
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
