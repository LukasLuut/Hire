export function getFirstAndLastName(name: string): string {
  if (!name) return "";

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0]; // caso só tenha um nome

  const first = parts[0];
  const last = parts[parts.length - 1];
  return `${first} ${last}`;
}
