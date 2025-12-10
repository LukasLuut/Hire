// helpers/file-helpers.ts
export function toFiles(list: FileList | null): File[] {
  return list ? (Array.from(list) as File[]) : [];
}
