export function compressString(str: string, firstCharCount: number = 10, lastCharCount: number = 10): string {
  if (str === undefined || str.length <= firstCharCount + lastCharCount) {
      return str; // Return the original string if it's short enough
  }
  return str.substring(0, firstCharCount) + '...' + str.substring(str.length - lastCharCount);
}

