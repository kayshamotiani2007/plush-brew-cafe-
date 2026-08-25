export function cleanText(value, maxLength = 1000) {
  return String(value || "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function cleanEmail(value) {
  return cleanText(value, 255).toLowerCase();
}

export function requireFields(source, fields) {
  const missing = fields.filter((field) => !cleanText(source[field]));
  return missing.length ? `${missing.join(", ")} required.` : null;
}
