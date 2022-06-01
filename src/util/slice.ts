export function slice<T>(array: T[], start?: number, end?: number): T[] {
  return array.slice().slice(start, end);
}

//
export function reverse<T>(array: T[]): T[] {
  return array.slice().reverse();
}
