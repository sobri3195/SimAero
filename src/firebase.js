// Mock Firebase - No real Firebase backend
// All Firebase functions are replaced with mock implementations

export const db = { _isMockDb: true };
export const auth = { _isMockAuth: true };
export const storage = { _isMockStorage: true };

const app = { _isMockApp: true };
export default app;
