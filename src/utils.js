/**
 * Generates a unique UUID (v4) for use as an Idempotency-Key.
 * 
 * @param {string} [prefix] - Optional prefix to prepended to the UUID (e.g., "my-system-").
 * @returns {string} A unique UUID string.
 */
export function generateUUID(prefix = '') {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}${crypto.randomUUID()}`;
  }
  
  return `${prefix}${'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  })}`;
}
