export function slice<T>(array: T[], start?: number, end?: number): T[] {
  return array.slice().slice(start, end);
}
