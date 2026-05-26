// Minimal `cn` helper similar to classnames/clsx
export function cn(...inputs: Array<string | Record<string, any> | false | null | undefined>) {
  const classes: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === 'string') {
      classes.push(input);
    } else if (typeof input === 'object') {
      for (const [k, v] of Object.entries(input)) {
        if (v) classes.push(k);
      }
    }
  }
  return classes.join(' ');
}
