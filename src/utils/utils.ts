export function isJsonString(str: string): boolean {
  try {
    const parsed = JSON.parse(str);
    // Optional: only return true if it's an object or array
    return typeof parsed === "object" && parsed !== null;
  } catch {
    return false; // parsing failed → not valid JSON
  }
}